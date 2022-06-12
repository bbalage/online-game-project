import { last } from 'rxjs';
import { userHistoryDao } from '../database/UserHistoryDAO';
import { AnimationStatus, Bullet, BulletDescriptor, BulletStatus, BULLET_DAMAGE, BULLET_SPEED, DeleteTankCommand, GameStatus, MapDescriptor, TankDescriptor, TankDirection, TankStatus } from '../model/GameStatus';
import { WSMessageMoveTankReceived, WSMessageShootCannonReceived, WSSendMessageType } from '../model/WSMessages';
import { ActiveUserService, TokenSwitch } from '../websocket/activeUser-service';
import { WebSocketService } from '../websocket/websocket-service';
import { ScoreLoggerService } from './score-logger-service';

const EXIT_LIMIT = 10;

interface ShotDirection {
    dx: number,
    dy: number
}

interface ShotOffset {
    dx: number,
    dy: number
}

export class GameService {

    private tankDirectionShotMap: Map<TankDirection, ShotDirection> = new Map<TankDirection, ShotDirection>([
        [TankDirection.UP, { dx: 0, dy: -BULLET_SPEED }],
        [TankDirection.RIGHT, { dx: BULLET_SPEED, dy: 0 }],
        [TankDirection.DOWN, { dx: 0, dy: BULLET_SPEED }],
        [TankDirection.LEFT, { dx: -BULLET_SPEED, dy: 0 }]
    ]);

    // TODO: Change this once tank size is properly set!
    private tankDirectionShotOffsetMap: Map<TankDirection, ShotOffset> = new Map<TankDirection, ShotOffset>([
        [TankDirection.UP, { dx: TankDescriptor.side / 2, dy: - 1 }],
        [TankDirection.RIGHT, { dx: TankDescriptor.side + 1, dy: TankDescriptor.side / 2 }],
        [TankDirection.DOWN, { dx: TankDescriptor.side / 2, dy: TankDescriptor.side + 1 }],
        [TankDirection.LEFT, { dx: -1, dy: TankDescriptor.side / 2 }]
    ]);

    private gameStatus: GameStatus = {
        tanks: new Map<number, TankStatus>(),
        bullets: []
    };

    constructor(private webSocketService: WebSocketService,
        private activeUserService: ActiveUserService,
        private scoreLogger: ScoreLoggerService) {
        console.log("Constructed game-service.");
        webSocketService.moveTankMessages$.subscribe({
            next: (message: WSMessageMoveTankReceived) => this.handleMoveTankMessage(message)
        });
        webSocketService.tankRegisterMessages$.subscribe({
            next: (id: number) => this.handleTankRegistration(id)
        });
        webSocketService.shootCannonMessages$.subscribe({
            next: (message: WSMessageShootCannonReceived) => this.handleShootCannon(message)
        });
    }

    sendUpdateMessage() {
        const animationStatus: AnimationStatus = {
            tanks: new Array<TankStatus>(this.gameStatus.tanks.size),
            bullets: new Array<BulletStatus>(this.gameStatus.bullets.length)
        };
        let i = 0;
        for (let tank of this.gameStatus.tanks.values()) {
            animationStatus.tanks[i] = tank;
            i++;
        }
        i = 0;
        for (let bullet of this.gameStatus.bullets) {
            animationStatus.bullets[i] = { x: bullet.x, y: bullet.y };
            i++;
        }
        this.webSocketService.send({
            header: {
                type: WSSendMessageType.GameStatus,
                timestamp: new Date()
            },
            data: {
                status: animationStatus,
                defeated: false
            }
        });
    }

    moveBullets() {
        let disabledCount: number = 0;
        for (let bullet of this.gameStatus.bullets) {
            bullet.move();
            if (this.checkBulletHit(bullet)) {
                disabledCount++;
                bullet.disable();
            }
        }
        this.removeDisabledBullets(disabledCount);
    }

    private handleTankRegistration(id: number) {
        if (this.gameStatus.tanks.has(id)) {
            return;
        }
        console.log("Creating new tank.");
        this.gameStatus.tanks.set(id, this.generateNewTank());
    }

    private handleMoveTankMessage(message: WSMessageMoveTankReceived) {
        const senderTank = this.gameStatus.tanks.get(message.header.id);
        if (senderTank === undefined) {
            return; // TODO: This is an error. Handle somehow!
        }
        if (message.data.x !== 0
            && senderTank.x + message.data.x + TankDescriptor.side < MapDescriptor.width
            && senderTank.x + message.data.x >= 0) {
            senderTank.x += message.data.x;
        }
        if (message.data.y !== 0
            && senderTank.y + message.data.y + TankDescriptor.side < MapDescriptor.height
            && senderTank.y + message.data.y >= 0) {
            senderTank.y += message.data.y;
        }
        senderTank.dir = message.data.dir;
    }

    private handleShootCannon(message: WSMessageShootCannonReceived) {
        const currentTank = this.gameStatus.tanks.get(message.header.id);
        if (currentTank === undefined) {
            // TODO: This is an error. Handle somehow!
            return;
        }
        const shotDirection = this.tankDirectionShotMap.get(currentTank.dir);
        const shotOffset = this.tankDirectionShotOffsetMap.get(currentTank.dir);
        if (shotDirection === undefined || shotOffset === undefined) {
            throw Error("Unexpected error! Shot direction or offset is undefined!");
        }
        this.gameStatus.bullets.push(new Bullet(
            currentTank.x + shotOffset.dx,
            currentTank.y + shotOffset.dy,
            shotDirection.dx,
            shotDirection.dy,
            message.header.id
        ));
    }

    private deleteTank(id: number) {
        this.gameStatus.tanks.delete(id);
    }

    private generateNewTank(): TankStatus {
        for (let i = 0; i < EXIT_LIMIT; i++) {
            let x = Math.random() * MapDescriptor.width - TankDescriptor.side - 1;
            let y = Math.random() * MapDescriptor.height - TankDescriptor.side - 1;
            if (!this.checkTankHitAgainstAllTanks(x, y)) {
                return {
                    x: x,
                    y: y,
                    dir: TankDirection.UP,
                    hp: 100
                }
            }
        }
        console.log("Could not create tank.");
        // TODO: Might have to solve this with different "Rooms" someday.
        return {
            x: MapDescriptor.width / 2,
            y: MapDescriptor.height / 2,
            dir: TankDirection.UP,
            hp: 100
        }
    }

    private checkBulletHit(bullet: Bullet): boolean {
        if (bullet.x < 0 || bullet.y < 0 || bullet.x >= MapDescriptor.width || bullet.y >= MapDescriptor.height) {
            return true;
        }
        for (let entries of this.gameStatus.tanks.entries()) {
            const tank = entries[1];
            if (this.checkBoxHit(
                bullet.x - BulletDescriptor.hitRadius, bullet.y - BulletDescriptor.hitRadius, BulletDescriptor.side,
                tank.x, tank.y, TankDescriptor.side)) {
                this.damageTank(entries[0], tank);
                this.scoreLogger.raiseScore(bullet.shooterId);
                return true;
            }
        }
        return false;
    }

    private removeDisabledBullets(disabledCount: number) {
        let lastDelete = 0;
        for (let i = 0; i < disabledCount; i++) {
            for (let j = lastDelete; j < this.gameStatus.bullets.length; j++) {
                if (this.gameStatus.bullets[j].disabled) {
                    this.gameStatus.bullets.splice(j, 1);
                    lastDelete = j;
                    break;
                }
            }
        }
    }

    private checkTankHitAgainstAllTanks(tankX: number, tankY: number): boolean {
        for (let tank of this.gameStatus.tanks.values()) {
            if (this.checkBoxHit(tankX, tankY, TankDescriptor.side, tank.x, tank.y, TankDescriptor.side)) {
                return true;
            }
        }
        return false;
    }

    private checkBoxHit(x1: number, y1: number, side1: number, x2: number, y2: number, side2: number): boolean {
        return this.checkIntervalOverlap(x1, side1, x2, side2) &&
            this.checkIntervalOverlap(y1, side1, y2, side2);
    }

    private checkIntervalOverlap(start1: number, length1: number, start2: number, length2: number): boolean {
        return start1 < start2 + length2 && start1 + length1 > start2;
    }

    private damageTank(id: number, tank: TankStatus) {
        tank.hp -= BULLET_DAMAGE;
        if (tank.hp <= 0) {
            this.deleteTank(id);
        }
        // TODO: Send defeated message
    }
}
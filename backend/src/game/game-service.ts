import { last } from 'rxjs';
import { AnimationStatus, Bullet, BulletDescriptor, BulletStatus, BULLET_DAMAGE, BULLET_SPEED, DeleteTankCommand, GameStatus, MapDescriptor, TankDescriptor, TankDirection, TankStatus } from '../model/GameStatus';
import { WSMessageMoveTankReceived, WSMessageRegisterTankReceived, WSMessageShootCannonReceived, WSSendMessageType } from '../model/WSMessages';
import { ActiveUserService, TokenSwitch } from '../websocket/activeUser-service';
import { WebSocketService } from '../websocket/websocket-service';

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
        [TankDirection.UP, { dx: TankDescriptor.side / 2, dy: - 5 }],
        [TankDirection.RIGHT, { dx: TankDescriptor.side + 1, dy: TankDescriptor.side / 2 }],
        [TankDirection.DOWN, { dx: TankDescriptor.side / 2, dy: TankDescriptor.side + 1 }],
        [TankDirection.LEFT, { dx: -5, dy: TankDescriptor.side / 2 }]
    ]);

    private gameStatus: GameStatus = {
        tanks: new Map<string, TankStatus>(),
        bullets: []
    };

    constructor(private webSocketService: WebSocketService, private activeUserService: ActiveUserService) {
        console.log("Constructed game-service.");
        webSocketService.moveTankMessages$.subscribe({
            next: (message: WSMessageMoveTankReceived) => this.handleMoveTankMessage(message)
        });
        webSocketService.tankRegisterMessages$.subscribe({
            next: (message: WSMessageRegisterTankReceived) => this.handleTankRegistration(message)
        });
        webSocketService.shootCannonMessages$.subscribe({
            next: (message: WSMessageShootCannonReceived) => this.handleShootCannon(message)
        });
        this.webSocketService.userSessionExpired$.subscribe({
            next: (token: string) => this.deleteTank(token)
        });
        this.activeUserService.userRelogged$.subscribe({
            next: (token: TokenSwitch) => this.relocateTokenOfTank(token)
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

    private handleTankRegistration(message: WSMessageRegisterTankReceived) {
        if (this.gameStatus.tanks.has(message.header.jwtToken)) {
            return;
        }
        console.log("Creating new tank.");
        this.gameStatus.tanks.set(message.header.jwtToken, this.generateNewTank());
    }

    private handleMoveTankMessage(message: WSMessageMoveTankReceived) {
        const senderTank = this.gameStatus.tanks.get(message.header.jwtToken);
        if (senderTank === undefined) {
            return; // TODO: This is an error. Handle somehow!
        }
        senderTank.x += message.data.x;
        senderTank.y += message.data.y;
        senderTank.dir = message.data.dir;
    }

    private handleShootCannon(message: WSMessageShootCannonReceived) {
        console.log("Game Service handles cannon shoot.");
        const currentTank = this.gameStatus.tanks.get(message.header.jwtToken);
        if (currentTank === undefined) {
            // TODO: This is an error. Handle somehow!
            return;
        }
        console.log("Asking directions.");
        const shotDirection = this.tankDirectionShotMap.get(currentTank.dir);
        const shotOffset = this.tankDirectionShotOffsetMap.get(currentTank.dir);
        if (shotDirection === undefined || shotOffset === undefined) {
            throw Error("Unexpected error!");
        }
        console.log("Adding bullet.");
        this.gameStatus.bullets.push(new Bullet(
            currentTank.x + shotOffset.dx,
            currentTank.y + shotOffset.dy,
            shotDirection.dx,
            shotDirection.dy
        ));
    }

    private deleteTank(token: string) {
        this.gameStatus.tanks.delete(token);
    }

    private relocateTokenOfTank(tokenSwitch: TokenSwitch) {
        const tank = this.gameStatus.tanks.get(tokenSwitch.oldToken);
        if (tank === undefined) {
            return;
        }
        this.gameStatus.tanks.set(tokenSwitch.newToken, tank);
        this.gameStatus.tanks.delete(tokenSwitch.oldToken);
    }

    private generateNewTank(): TankStatus {
        for (let i = 0; i < EXIT_LIMIT; i++) {
            let x = Math.random() * MapDescriptor.width;
            let y = Math.random() * MapDescriptor.height;
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
        if (bullet.x < 0 || bullet.y < 0 || bullet.x >= MapDescriptor.width, bullet.y >= MapDescriptor.height) {
            return true;
        }
        for (let entries of this.gameStatus.tanks.entries()) {
            const tank = entries[1];
            if (this.checkBoxHit(
                bullet.x - BulletDescriptor.hitRadius, bullet.y - BulletDescriptor.hitRadius, BulletDescriptor.side,
                tank.x, tank.y, TankDescriptor.side)) {
                this.damageTank(entries[0], tank);
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
        //return start2 >= start1 && start2 < start1 + length1
        //    || start2 + length2 > start1 && start2 < start1 + length2;
    }

    private damageTank(token: string, tank: TankStatus) {
        tank.hp -= BULLET_DAMAGE;
        if (tank.hp <= 0) {
            this.deleteTank(token);
        }
        // TODO: Send defeated message
    }
}
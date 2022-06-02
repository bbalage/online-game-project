import { send } from 'process';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';
import { AnimationStatus, GameStatus, MapDescriptor, TankDirection, TankStatus } from '../model/GameStatus';
import { MessageType, WSMessageGameReceived, WSMessageReceived } from '../model/WSMessages';
import { WebSocketService } from './websocket-service';

const EXIT_LIMIT = 10;

export class GameService {

    private gameStatus: GameStatus = { tanks: new Map<string, TankStatus>() };

    constructor(private websocketService: WebSocketService) {
        console.log("Constructed game-service.");
        websocketService.gameMessages$.subscribe({
            next: (message: WSMessageGameReceived) => this.handleMessage(message)
        });
        websocketService.tankRegisterMessages$.subscribe({
            next: (message: WSMessageReceived) => this.handleTankRegistration(message)
        });
    }

    handleTankRegistration(message: WSMessageReceived) {
        console.log("Creating new tank.");
        // TODO: What happens if token already exists?
        this.gameStatus.tanks.set(message.header.jwtToken, this.generateNewTank());
        this.sendGameMessage();
    }

    handleMessage(message: WSMessageGameReceived) {
        console.log("game-service handling message.");
        const senderTank = this.gameStatus.tanks.get(message.header.jwtToken);
        if (senderTank === undefined) {
            return; // TODO: This is an error. Handle somehow!
        }
        senderTank.x += message.data.x;
        senderTank.y += message.data.y;
        senderTank.dir = message.data.dir;
        this.sendGameMessage();
    }

    sendGameMessage() {
        const animationStatus: AnimationStatus = { tanks: new Array<TankStatus>(this.gameStatus.tanks.size) };
        let i = 0;
        for (let tank of this.gameStatus.tanks.values()) {
            animationStatus.tanks[i] = tank;
            i++;
        }
        this.websocketService.send({
            header: {
                type: MessageType.GameStatus,
                timestamp: new Date()
            },
            data: {
                status: animationStatus,
                defeated: false
            }
        });
    }

    generateNewTank(): TankStatus {
        for (let i = 0; i < EXIT_LIMIT; i++) {
            let x = Math.random() * MapDescriptor.width;
            let y = Math.random() * MapDescriptor.height;
            if (!this.checkHit(x, y)) {
                return {
                    x: x,
                    y: y,
                    dir: TankDirection.UP,
                    hp: 100
                }
            }
        }
        // TODO: Might have to solve this with different "Rooms" someday.
        return {
            x: MapDescriptor.width / 2,
            y: MapDescriptor.height / 2,
            dir: TankDirection.UP,
            hp: 100
        }
    }

    // TODO: Implement!
    checkHit(tankX: number, tankY: number): boolean {
        return false;
    }
}
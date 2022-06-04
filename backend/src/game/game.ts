import { WSMessageMoveTankReceived, WSMessageReceived } from "../model/WSMessages";
import { WebSocketService } from "../websocket/websocket-service";
import { GameService } from "./game-service";

export class Game {

    constructor(private gameService: GameService) {

    }

    loop() {
        this.gameService.moveBullets();
        this.gameService.sendUpdateMessage();
    }
}
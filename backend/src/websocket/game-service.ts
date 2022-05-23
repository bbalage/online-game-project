import { MessageType, WSMessageGameReceived } from '../model/WSMessages';
import { WebSocketService } from './websocket-service';

export class GameService {

    constructor(private websocketService: WebSocketService) {
        console.log("Constructed game-service.");
        websocketService.gameMessages$.subscribe({
            next: (message: WSMessageGameReceived) => this.handleMessage(message)
        });
    }

    handleMessage(message: WSMessageGameReceived) {
        message.data?.x
    }
}
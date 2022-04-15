import { MessageType, WebSocketService, WSMessageChat } from './websocket-service';

export class ChatService {

    constructor(private websocketService: WebSocketService) {
        console.log("Constructed chatservice.");
        websocketService.chatMessages$.subscribe({
            next: (message: WSMessageChat) => this.handleMessage(message)
        });
    }

    handleMessage(message: WSMessageChat) {
        this.websocketService.send({
            header: {
                type: MessageType.ChatMessage,
                timestamp: new Date()
            },
            data: {
                // text: message.data.text
                text: "Text"
            }
        });
    }
}
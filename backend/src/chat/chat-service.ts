import { WSRecievedMessageType, WSMessageChatReceived, WSSendMessageType } from '../model/WSMessages';
import { ActiveUserService } from '../websocket/activeUser-service';
import { WebSocketService } from '../websocket/websocket-service';

export class ChatService {

    constructor(
        private websocketService: WebSocketService,
        private activeUserService: ActiveUserService) {
        console.log("Constructed chat-service.");
        websocketService.chatMessages$.subscribe({
            next: (message: WSMessageChatReceived) => this.handleMessage(message)
        });
    }

    handleMessage(message: WSMessageChatReceived) {
        console.log("chat-service handling message.");
        const sentMessage = {
            header: {
                type: WSSendMessageType.ChatMessage,
                timestamp: new Date()
            },
            data: {
                username: this.activeUserService.getUserName(message.header.jwtToken),
                text: message.data.text
            }
        }
        this.websocketService.send(sentMessage);
    }
}
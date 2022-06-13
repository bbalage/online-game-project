import { WSRecievedMessageType, WSMessageChatReceived, WSSendMessageType } from '../model/WSMessages';
import { ActiveAdminService } from '../websocket/activeAdmin-service';
import { ActiveUserService } from '../websocket/activeUser-service';
import { WebSocketService } from '../websocket/websocket-service';

export class ChatService {

    constructor(
        private websocketService: WebSocketService,
        private activeUserService: ActiveUserService,
        private activeAdminService: ActiveAdminService) {
        console.log("Constructed chat-service.");
        websocketService.chatMessages$.subscribe({
            next: (message: WSMessageChatReceived) => this.handleMessage(message)
        });
    }

    handleMessage(message: WSMessageChatReceived) {
        const sentMessage = {
            header: {
                type: WSSendMessageType.ChatMessage,
                timestamp: new Date()
            },
            data: {
                username: message.header.username,
                text: message.data.text
            }
        }
        this.websocketService.send(sentMessage);
    }
}
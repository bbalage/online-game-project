import * as WebSocket from 'ws';
import * as http from 'http';
import { ChatService } from './chat-service';
import { Subject } from 'rxjs';

export enum MessageType {
    RegisterUser = 1,
    ChatMessage,
    GameStatus,
}

export interface WSMessageReceived {
    header: {
        type: MessageType,
        userId: number,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageChat {
    header: {
        userId: number,
        timestamp: Date
    }
    data?: any
}

export interface WSMessageSend {
    header: {
        type: MessageType,
        timestamp: Date
    }
    data?: any
}

export class WebSocketService {

    ws!: WebSocket.Server;
    public readonly chatMessages$ = new Subject<WSMessageChat>();

    constructor(server: http.Server) {
        this.initWebSocket(server);
    }

    private initWebSocket(server: http.Server) {
        this.ws = new WebSocket.Server({ server });

        this.ws.on('connection', (ws: WebSocket) => {

            ws.onmessage = (message: WebSocket.MessageEvent) => {
                const msg = JSON.parse(message.data.toString()) as WSMessageReceived;
                switch (msg.header.type) {
                    // TODO: Do actual registration of user, and use this registration!
                    case MessageType.RegisterUser:
                        console.log("Registering user: %s", msg.header.userId);
                        break;
                    case MessageType.ChatMessage:
                        console.log("Handling chat message: %s", msg.header.userId);
                        this.chatMessages$.next(msg);
                        break;
                    case MessageType.GameStatus:
                        console.log("Handling new game status: %s", msg.header.userId);
                        break;
                }
            };

            ws.onerror = (errorEvent: WebSocket.ErrorEvent) => {
                console.log('Error: %s', errorEvent.message);
            };

            ws.onclose = (closeEvent: WebSocket.CloseEvent) => {
                // TODO: Remove connection
                console.log('Connection removed: %s', closeEvent.target);
            };
        });
    }

    // TODO: Use clients parameter to send only to specific clients. Possibly userId would be better for this?
    public send(message: WSMessageSend, clients?: WebSocket.WebSocket) {
        this.ws.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
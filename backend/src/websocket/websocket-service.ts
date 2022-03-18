import * as WebSocket from 'ws';
import * as http from 'http';
import { ChatService } from './chat-service';

export enum MessageType {
    RegisterUser = 1,
    ChatMessage,
    GameStatus,
}

export interface WSMessage {
    header: {
        type: MessageType,
        userId: number,
        timestamp: Date
    }
    data?: any
}

export interface WSAnswer {
    header: {
        type: MessageType,
        timestamp: Date
    }
    data?: any
}

export interface WSAnswers {
    recipients: [],
    message: WSAnswer
}

export class WebSocketService {

    chatService!: ChatService;

    constructor(server: http.Server, chatService: ChatService) {
        this.chatService = chatService;
        this.initWebSocket(server);
    }

    private initWebSocket(server: http.Server) {
        const ws = new WebSocket.Server({ server });

        ws.on('connection', (ws: WebSocket) => {

            ws.onmessage = (message: WebSocket.MessageEvent) => {
                console.log('received: %s', message.data);
                ws.send(`Hello, you sent -> ${message.data}`);
                const msg = JSON.parse(message.data.toString()) as WSMessage;
                switch (msg.header.type) {
                    case MessageType.RegisterUser:
                        console.log("Registering user: %s", msg.header.userId);
                        break;
                    case MessageType.ChatMessage:
                        console.log("Handling chat message: %s", msg.header.userId);
                        // TODO: Make this asyncronous (and learn to spell the word)
                        const answers = this.chatService.handleMessage();
                        this.reply(answers);
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

            ws.send('Hi there, I am a WebSocket server');
        });
    }

    private reply(answers: WSAnswers) {
        // TODO: Map listener websockets to user ids.
    }
}
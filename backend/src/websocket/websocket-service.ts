import * as WebSocket from 'ws';
import * as http from 'http';
import { Subject } from 'rxjs';
import { MessageType, WSMessageChatReceived, WSMessageGameReceived, WSMessageReceived, WSMessageSend } from '../model/WSMessages';

export class WebSocketService {

    ws!: WebSocket.Server;
    public readonly chatMessages$ = new Subject<WSMessageChatReceived>();
    public readonly gameMessages$ = new Subject<WSMessageGameReceived>();
    public readonly tankRegisterMessages$ = new Subject<WSMessageReceived>();

    constructor(server: http.Server) {
        this.initWebSocket(server);
    }

    private initWebSocket(server: http.Server) {
        this.ws = new WebSocket.Server({ server });

        this.ws.on('connection', (ws: WebSocket) => {

            ws.onmessage = (message: WebSocket.MessageEvent) => {
                const msg = JSON.parse(message.data.toString()) as WSMessageReceived;
                // TODO: Check jwt token! If token is invalid, send message to exit user!
                switch (msg.header.type) {
                    case MessageType.RegisterTank:
                        console.log("Handling tank registering message " + msg.header.timestamp);
                        this.tankRegisterMessages$.next(msg);
                        break;
                    case MessageType.ChatMessage:
                        console.log("Handling chat message " + msg.header.timestamp);
                        if (msg.data && msg.data.text) {
                            this.chatMessages$.next({
                                header: msg.header,
                                data: {
                                    text: msg.data.text
                                }
                            });
                        }
                        break;
                    case MessageType.GameStatus:
                        console.log("Handling new game status " + msg.header.timestamp);
                        if (msg.data) {
                            this.gameMessages$.next({
                                header: msg.header,
                                data: {
                                    x: msg.data.x,
                                    y: msg.data.y,
                                    dir: msg.data.dir,
                                    shot: msg.data.shot
                                }
                            });
                        }
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
        console.log("Sending message of type: " + message.header.type);
        this.ws.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
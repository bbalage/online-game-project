import * as WebSocket from 'ws';
import * as http from 'http';
import { Subject } from 'rxjs';
import { MessageType, WSMessageChatReceived, WSMessageGameReceived, WSMessageReceived, WSMessageSend } from '../model/WSMessages';

export class WebSocketService {

    ws!: WebSocket.Server;
    public readonly chatMessages$ = new Subject<WSMessageChatReceived>();
    public readonly gameMessages$ = new Subject<WSMessageGameReceived>();

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
                        console.log("Registering user: %s", msg.header.jwtToken);
                        break;
                    case MessageType.ChatMessage:
                        console.log("Handling chat message: %s", msg.header.jwtToken);
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
                        console.log("Handling new game status: %s", msg.header.jwtToken);
                        this.gameMessages$.next(msg);
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
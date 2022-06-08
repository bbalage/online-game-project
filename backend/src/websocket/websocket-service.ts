import * as WebSocket from 'ws';
import * as http from 'http';
import { Subject } from 'rxjs';
import {
    WSRecievedMessageType,
    WSMessageChatReceived,
    WSMessageMoveTankReceived,
    WSMessageReceived,
    WSMessageSend,
    WSMessageRegisterTankReceived,
    WSMessageShootCannonReceived,
    WSSendMessageType
} from '../model/WSMessages';
import { ActiveUserService } from './activeUser-service';
import { DeleteTankCommand } from '../model/GameStatus';

export class WebSocketService {

    ws!: WebSocket.Server;
    public readonly chatMessages$ = new Subject<WSMessageChatReceived>();
    public readonly tankRegisterMessages$ = new Subject<WSMessageRegisterTankReceived>();
    public readonly moveTankMessages$ = new Subject<WSMessageMoveTankReceived>();
    public readonly shootCannonMessages$ = new Subject<WSMessageShootCannonReceived>();
    public readonly deleteTankCommands$ = new Subject<DeleteTankCommand>();

    constructor(server: http.Server, private activeUserService: ActiveUserService) {
        this.initWebSocket(server);
    }

    private initWebSocket(server: http.Server) {
        this.ws = new WebSocket.Server({ server });

        this.ws.on('connection', (ws: WebSocket) => {

            ws.onmessage = (message: WebSocket.MessageEvent) => {
                const msg = JSON.parse(message.data.toString()) as WSMessageReceived;
                if (msg.header.jwtToken === undefined) {
                    return;
                }
                if (!this.activeUserService.isUserActive(msg.header.jwtToken)) {
                    this.deleteTankCommands$.next({token: msg.header.jwtToken});
                    this.send({
                        header: {
                            type: WSSendMessageType.Logout,
                            timestamp: new Date()
                        }
                    })
                }
                switch (msg.header.type) {
                    case WSRecievedMessageType.RegisterTank:
                        console.log("Handling tank registering message " + msg.header.timestamp);
                        this.tankRegisterMessages$.next(msg);
                        break;
                    case WSRecievedMessageType.MoveTank:
                        if (msg.data) {
                            this.moveTankMessages$.next({
                                header: msg.header,
                                data: {
                                    x: msg.data.x,
                                    y: msg.data.y,
                                    dir: msg.data.dir,
                                }
                            });
                        }
                        break;
                    case WSRecievedMessageType.ShootCannon:
                        this.shootCannonMessages$.next({
                            header: msg.header,
                        });
                        break;
                    case WSRecievedMessageType.ChatMessage:
                        if (msg.data && msg.data.text) {
                            this.chatMessages$.next({
                                header: msg.header,
                                data: {
                                    text: msg.data.text
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
        this.ws.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
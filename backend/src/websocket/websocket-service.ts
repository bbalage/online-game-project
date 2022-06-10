import * as WebSocket from 'ws';
import * as http from 'http';
import { Subject } from 'rxjs';
import {
    WSRecievedMessageType,
    WSMessageChatReceived,
    WSMessageMoveTankReceived,
    WSMessageReceived,
    WSMessageSend,
    WSMessageShootCannonReceived,
    WSSendMessageType
} from '../model/WSMessages';
import { ActiveUserService } from './activeUser-service';

export class WebSocketService {

    ws!: WebSocket.Server;
    public readonly chatMessages$ = new Subject<WSMessageChatReceived>();
    public readonly tankRegisterMessages$ = new Subject<number>();
    public readonly moveTankMessages$ = new Subject<WSMessageMoveTankReceived>();
    public readonly shootCannonMessages$ = new Subject<WSMessageShootCannonReceived>();
    public readonly userSessionExpired$ = new Subject<number>();

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
                    const reply: WSMessageSend = {
                        header: {
                            type: WSSendMessageType.Logout,
                            timestamp: new Date()
                        }
                    };
                    ws.send(JSON.stringify(reply));
                }
                const id = this.activeUserService.getId(msg.header.jwtToken);
                if (id === null || id === undefined) {
                    return;
                }
                const idHeader = { id: id, timestamp: msg.header.timestamp }
                switch (msg.header.type) {
                    case WSRecievedMessageType.RegisterTank:
                        this.tankRegisterMessages$.next(id);
                        break;
                    case WSRecievedMessageType.MoveTank:
                        if (msg.data) {
                            this.moveTankMessages$.next({
                                header: idHeader,
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
                            header: idHeader
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
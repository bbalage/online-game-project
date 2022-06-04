import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AnimationStatus } from '../models/AnimationStatus';
import { WSMessageChatReceived, WSMessageGameReceived, WSMessageSend, WSReceivedMessageType } from '../models/WSMessages';

// TODO: Move to config file
const CHAT_URL: string = "ws://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private ws = new WebSocket(CHAT_URL);
  userId!: number;
  public readonly chatMessages$ = new Subject<WSMessageChatReceived>();
  public readonly gameMessages$ = new Subject<WSMessageGameReceived>();
  public readonly opened$ = new Subject<undefined>();

  constructor() {
    this.initWebSocket();
  }

  sendMessage(message: WSMessageSend) {
    const sendJSON = JSON.stringify(message);
    this.ws.send(sendJSON);
  }

  private initWebSocket() {
    this.ws.onopen = (ev: any) => {
      this.opened$.next(undefined);
      console.log("Connection opened.");
    }
    this.ws.onmessage = (messageEvent: any) => {
      const msg = JSON.parse(messageEvent.data)
      switch (msg.header.type) {
        case WSReceivedMessageType.ChatMessage:
          this.chatMessages$.next(msg);
          break;
        case WSReceivedMessageType.GameStatus:
          this.gameMessages$.next(msg);
          break;
      }
    };
    this.ws.onclose = (ev: any) => {
      console.log("Connection closed.");
    }
    this.ws.onerror = (ev: any) => {
      console.log("Error!");
    }
  }
}

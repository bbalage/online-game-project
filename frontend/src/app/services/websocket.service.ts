import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AnimationStatus } from '../models/AnimationStatus';
import { WSMessageChatReceived, WSMessageGameReceived, WSMessageSend, WSMessageType } from '../models/WSMessages';

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

  constructor() {
    this.initWebSocket();
  }

  sendMessage(message: WSMessageSend) {
    console.log(`Sending message:\n${message}`);
    this.ws.send(JSON.stringify(message));
  }

  private initWebSocket() {
    this.ws.onopen = (ev: any) => {
      console.log("Connection opened.");
    }
    this.ws.onmessage = (messageEvent: any) => {
      console.log(`Received message: ${messageEvent}`);
      const msg = JSON.parse(messageEvent.data)
      switch (msg.header.type) {
        case WSMessageType.ChatMessage:
          this.chatMessages$.next(msg);
          break;
        case WSMessageType.GameStatus:
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

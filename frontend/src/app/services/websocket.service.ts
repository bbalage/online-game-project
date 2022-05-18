import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// TODO: Move to config file
const CHAT_URL: string = "ws://localhost:3000";

export enum WSMessageType {
  RegisterUser = 1,
  ChatMessage,
  GameStatus,
}

export interface WSMessageSend {
  header: {
    type: WSMessageType,
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

export interface WSMessageGame {
  header: {
    timestamp: Date
  }
  data: [
    { pos: { x: number, y: number } }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private ws = new WebSocket(CHAT_URL);
  userId!: number;
  public readonly chatMessages$ = new Subject<WSMessageChat>();
  public readonly gameMessages$ = new Subject<WSMessageGame>();

  constructor() {
    this.initWebSocket();
  }

  setUser(userId: number) {
    this.userId = userId;
    this.sendMessage({
      header: {
        type: WSMessageType.RegisterUser,
        userId: userId,
        timestamp: new Date()
      }
    })
  }

  sendMessage(message: WSMessageSend) {
    console.log(`Sending message:\n${message}`);
    this.ws.send(JSON.stringify(message));
  }

  private initWebSocket() {
    this.ws.onopen = (ev: any) => {
      console.log("Connection opened.");
      this.setUser(1);
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

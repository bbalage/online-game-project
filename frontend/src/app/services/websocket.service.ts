import { Injectable } from '@angular/core';

// TODO: Move to config file
const CHAT_URL: string = "ws://localhost:3000";

export enum WSMessageType {
  RegisterUser = 1,
  ChatMessage,
  GameStatus,
}

export interface WSMessage {
  header: {
    type: WSMessageType,
    userId: number,
    timestamp: Date
  }
  data?: any
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  ws!: WebSocket;
  userId!: number;

  constructor() {
    this.initWebSocket();
  }

  setUser(userId: number) {
    this.userId = userId;
    console.log("Calling send message.");
    this.sendMessage({
      header: {
        type: WSMessageType.RegisterUser,
        userId: userId,
        timestamp: new Date()
      }
    })
  }

  sendMessage(message: WSMessage) {
    console.log("Sending message.");
    this.ws.send(JSON.stringify(message));
  }

  private initWebSocket() {
    this.ws = new WebSocket(CHAT_URL);
    this.ws.onopen = (ev: any) => {
      console.log("Connection opened.");
      this.setUser(1);
    }
    this.ws.onmessage = (messageEvent: any) => {
      console.log(messageEvent);
    };
    this.ws.onclose = (ev: any) => {
      console.log("Connection closed.");
    }
    this.ws.onerror = (ev: any) => {
      console.log("Error!");
    }
  }
}

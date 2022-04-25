import { Injectable } from '@angular/core';

// TODO: Move to config file
const CHAT_URL: string = "ws://localhost:3000";

export interface AppMessage {
  header: {
    type: number,
    userId: number,
    timestamp: Date
  }
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  ws!: WebSocket;

  constructor() {
    this.ws = new WebSocket(CHAT_URL);
    this.ws.onmessage = (messageEvent: any) => {
      console.log(messageEvent);
    };
  }

  sendMessage(message: AppMessage) {
    this.ws.send(JSON.stringify(message));
  }
}

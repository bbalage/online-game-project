import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

const CHAT_URL = "ws://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  ws!: WebSocket;

  constructor() {
    this.ws = new WebSocket(CHAT_URL);
    this.ws.onmessage = (message: any) => {
      console.log(message);
    };
  }

  sendMessage(message: string) {
    this.ws.send(message);
  }
}

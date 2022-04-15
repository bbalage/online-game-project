import { Component, OnInit } from '@angular/core';
import { WebSocketService, WSMessageChat, WSMessageType } from 'src/app/services/websocket.service';

interface ChatBubble {
  // TODO: Add commented
  // time: Date,
  // username: string,
  text: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatBubbles: ChatBubble[] = [];

  constructor(private webSocketService: WebSocketService) {
    webSocketService.chatMessages$.subscribe({
      next: (message: WSMessageChat) => this.receiveChatMessage(message)
    });
  }

  ngOnInit(): void {
  }

  private receiveChatMessage(message: WSMessageChat) {
    this.chatBubbles.push({
      text: message.data.text
    });
  }

  sendChatMessage() {
    this.webSocketService.sendMessage({
      header: {
        userId: 0,
        type: WSMessageType.ChatMessage,
        timestamp: new Date()
      },
      data: {
        text: "Testing chat message."
      }
    });
  }
}

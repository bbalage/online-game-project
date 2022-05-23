import { Component, Directive, OnChanges, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WSMessageChatReceived, WSMessageType } from 'src/app/models/WSMessages';
import { ID_TOKEN_KEY } from 'src/app/services/user.service';

interface ChatBubble {
  time: Date,
  username: string,
  text: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currentUsername: string = "NoUserName";
  chatBubbles: ChatBubble[] = [];
  messageForm = new FormGroup({
    message: new FormControl('')
  });


  constructor(private webSocketService: WebSocketService) {
    webSocketService.chatMessages$.subscribe({
      next: (message: WSMessageChatReceived) => this.receiveChatMessage(message)
    });
  }

  ngOnInit(): void {
    // TODO: Mocked
    this.currentUsername = "Paul";

  }

  private receiveChatMessage(message: WSMessageChatReceived) {
    this.chatBubbles.push({
      text: message.data.text,
      username: message.data.username,
      time: message.header.timestamp
    });
  }

  public scrollDown() {
    const scroll = document.getElementById("scroll");
    if (scroll != null)
      scroll.scrollTop = scroll.scrollHeight;
    console.log(scroll?.scrollTop);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.code === 'Enter' && event.shiftKey == false) {
      this.sendChatMessage();
    }
  }

  sendChatMessage() {
    const message = this.messageForm.controls["message"].value
    if (message != '') {
      this.webSocketService.sendMessage({
        header: {
          jwtToken: sessionStorage.getItem(ID_TOKEN_KEY),
          type: WSMessageType.ChatMessage,
          timestamp: new Date()
        },
        data: {
          text: message
        }
      });
      this.messageForm.setValue({ message: '' });
    }
  }
}

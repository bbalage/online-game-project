import { Component, Directive, OnChanges, OnInit } from '@angular/core';
import { WebSocketService, WSMessageChat, WSMessageType } from 'src/app/services/websocket.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
      next: (message: WSMessageChat) => this.receiveChatMessage(message)
    });
  }

  ngOnInit(): void {
    //Mocked
    this.currentUsername="Paul";

  }

  private receiveChatMessage(message: WSMessageChat) {
    this.chatBubbles.push({
      text: message.data.text,
      //Mocked
      username: Math.floor(Math.random()*2)==0 ? this.currentUsername : "Dummyuser",
      //Mocked
      time: new Date()
    });

  }

  public scrollDown(){
    const scroll = document.getElementById("scroll");
    if (scroll!=null)
      scroll.scrollTop = scroll.scrollHeight;
      console.log(scroll?.scrollTop);
  }

  onKeyPress(event:KeyboardEvent){
    if (event.code==='Enter' && event.shiftKey==false){
      this.sendChatMessage();
    }
  }

  sendChatMessage() {
    const message = this.messageForm.controls["message"].value
    if (message!=''){
    this.webSocketService.sendMessage({
      header: {
        userId: 0,
        type: WSMessageType.ChatMessage,
        timestamp: new Date()
      },
      data: {
        text: message
      }
    });
    this.messageForm.setValue({message: ''});
     }
  }
}

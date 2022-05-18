import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketService, WSMessageGame } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {

  @ViewChild('sceneCanvas') private canvas!: HTMLCanvasElement;

  constructor(private webSocketService: WebSocketService) {
    webSocketService.gameMessages$.subscribe({
      next: (message: WSMessageGame) => this.receiveGameUpdate(message)
    });
  }

  ngOnInit(): void {
  }

  receiveGameUpdate(message: any) {

  }


}

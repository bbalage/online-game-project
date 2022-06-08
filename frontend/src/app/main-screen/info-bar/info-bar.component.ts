import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css']
})
export class InfoBarComponent implements OnInit {

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  startPlaying() {
    if (!this.webSocketService.isOpen()) {
      
    } // TODO: Continue!
    this.webSocketService.opened$.subscribe({
      next: (v: undefined) => this.gameService.registerTank()
    })
  }

}

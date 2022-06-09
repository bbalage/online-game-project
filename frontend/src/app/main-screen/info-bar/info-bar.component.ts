import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css']
})
export class InfoBarComponent implements OnInit {

  @Output()
  startGame: EventEmitter<undefined> = new EventEmitter();

  constructor(private webSocketService: WebSocketService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  startPlaying() {
    if (!this.webSocketService.isOpen()) {
      this.snackBar.open("Connection is not established!", "Dismiss");
    }
    this.startGame.emit();
  }

}

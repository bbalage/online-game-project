import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService, WSMessageGame } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx !: CanvasRenderingContext2D;

  constructor(
    private webSocketService: WebSocketService,
    private gameService: GameService,
    private snackBar: MatSnackBar) {
    webSocketService.gameMessages$.subscribe({
      next: (message: WSMessageGame) => this.receiveGameUpdate(message)
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext("2d");
    if (ctx !== null) {
      this.ctx = ctx;
    } else {
      this.snackBarMessage("Could not load context!");
    }
  }

  private snackBarMessage(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }

  receiveGameUpdate(message: any) {
    this.gameService.updateGame(message);
  }


}

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
  private tankSpriteUp!: any;

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
    if (ctx === null) {
      this.snackBarMessage("Could not load context!");
      return;
    }
    this.ctx = ctx;
    this.tankSpriteUp = new Image();
    this.tankSpriteUp.src = "/assets/sprites/tank1.png";
    this.tankSpriteUp.onload = () => { this.ctx.drawImage(this.tankSpriteUp, 0, 0, 20, 20); }
    this.animate();
  }

  private snackBarMessage(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }

  receiveGameUpdate(message: any) {
    this.gameService.updateGame(message);
  }

  animate() {
    const id = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const animationStatus = this.gameService.retrieveGameAnimationStatus();
    for (let tank of animationStatus.tanks) {
      this.ctx.drawImage(this.tankSpriteUp, tank.x, tank.y, 20, 20);
    }
  }


}

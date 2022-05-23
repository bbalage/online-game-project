import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TankStatus, TankDirection } from 'src/app/models/AnimationStatus';
import { WSMessageGameReceived } from 'src/app/models/WSMessages';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx !: CanvasRenderingContext2D;
  private tankDirectionMap!: Map<TankDirection, any>;
  // TODO: Purpose is to make chat and game events coexist. Implement!
  private playMode: boolean = true;

  constructor(
    private webSocketService: WebSocketService,
    private ngZone: NgZone,
    private gameService: GameService,
    private snackBar: MatSnackBar) {
    webSocketService.gameMessages$.subscribe({
      next: (message: WSMessageGameReceived) => this.receiveGameUpdate(message)
    });
    webSocketService.opened$.subscribe({
      next: (v: undefined) => this.gameService.registerTank()
    })

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
    this.initializeGameSetting();
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private snackBarMessage(message: string) {
    this.snackBar.open(message, 'Dismiss');
  }

  receiveGameUpdate(message: WSMessageGameReceived) {
    this.gameService.updateGame(message);
  }

  animate() {
    const id = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const animationStatus = this.gameService.retrieveGameAnimationStatus();
    if (!animationStatus) {
      return;
    }
    for (let tank of animationStatus.tanks) {
      this.drawTank(tank);
    }
  }

  private drawTank(tank: TankStatus) {
    this.ctx.drawImage(this.tankDirectionMap.get(tank.dir), tank.x, tank.y, 15, 15);
  }

  private initializeGameSetting() {
    this.tankDirectionMap = new Map<TankDirection, any>([
      [TankDirection.UP, new Image()],
      [TankDirection.RIGHT, new Image()],
      [TankDirection.DOWN, new Image()],
      [TankDirection.LEFT, new Image()]
    ]);
    this.tankDirectionMap.get(TankDirection.UP).src = "/assets/sprites/tank1.png";
    this.tankDirectionMap.get(TankDirection.RIGHT).src = "/assets/sprites/tank2.png";
    this.tankDirectionMap.get(TankDirection.DOWN).src = "/assets/sprites/tank3.png";
    this.tankDirectionMap.get(TankDirection.LEFT).src = "/assets/sprites/tank4.png";

    document.addEventListener("keydown", (e) => this.keyDownHandler(e), false);
    document.addEventListener("keyup", (e) => this.keyUpHandler(e), false);
    // this.canvas.nativeElement.addEventListener("mousemove", (e) => this.mouseMoveHandler(e), false);
  }

  private keyDownHandler(e: any) {
    if (this.playMode) {
      if (e.key === "w") {
        this.gameService.moveTank(TankDirection.UP);
      } else if (e.key === "d") {
        this.gameService.moveTank(TankDirection.RIGHT);
      } else if (e.key === "s") {
        this.gameService.moveTank(TankDirection.DOWN);
      } else if (e.key === "a") {
        this.gameService.moveTank(TankDirection.LEFT);
      }
    }
  }

  private keyUpHandler(e: Event) {
    if (this.playMode) {
      console.log(e);
    }
  }

  private mouseMoveHandler(e: Event) {
    console.log(e);
  }
}

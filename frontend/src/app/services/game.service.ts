import { Injectable } from '@angular/core';
import { AnimationStatus, TankDirection, TankStatus } from '../models/AnimationStatus';
import { WSMessageGameReceived, WSMessageGameSend, WSMessageType } from '../models/WSMessages';
import { ID_TOKEN_KEY } from './user.service';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private animationStatus: AnimationStatus | null = null;
  private defeated: boolean = false;

  constructor(private webSocketService: WebSocketService) { }

  registerTank() {
    console.log("Sending tank registration.");
    this.webSocketService.sendMessage({
      header: {
        jwtToken: sessionStorage.getItem(ID_TOKEN_KEY),
        type: WSMessageType.RegisterTank,
        timestamp: new Date()
      }
    });
  }

  moveTank(dir: TankDirection) {
    let x = 0, y = 0;
    switch (dir) {
      case TankDirection.UP:
        y = -1;
        break;
      case TankDirection.RIGHT:
        x = 1;
        break;
      case TankDirection.DOWN:
        y = 1;
        break;
      case TankDirection.LEFT:
        x = -1;
        break;
    }
    this.webSocketService.sendMessage({
      header: {
        jwtToken: sessionStorage.getItem(ID_TOKEN_KEY),
        timestamp: new Date(),
        type: WSMessageType.GameStatus
      },
      data: {
        x: x,
        y: y,
        dir: dir
      }
    });
  }

  isDefeated() {
    return this.defeated;
  }

  updateGame(gameMessage: WSMessageGameReceived) {
    this.animationStatus = gameMessage.data.status;
    for (let tank of this.animationStatus.tanks) {
      console.log(`Tank position ${tank.x} : ${tank.y}`);
    }
    this.defeated = gameMessage.data.defeated;
  }

  retrieveGameAnimationStatus(): AnimationStatus | null {
    return this.animationStatus;
  }
}

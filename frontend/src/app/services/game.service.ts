import { Injectable } from '@angular/core';
import { AnimationStatus } from '../models/AnimationStatus';
import { WSMessageGameReceived } from '../models/WSMessages';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private animationStatus: AnimationStatus | null = null;
  private defeated: boolean = false;

  constructor() { }

  isDefeated() {
    return this.defeated;
  }

  updateGame(gameMessage: WSMessageGameReceived) {
    this.animationStatus = gameMessage.data.status;
    this.defeated = gameMessage.data.defeated;
  }

  retrieveGameAnimationStatus(): AnimationStatus | null {
    return this.animationStatus;
  }
}

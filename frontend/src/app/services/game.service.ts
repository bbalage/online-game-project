import { Injectable } from '@angular/core';
import { AnimationStatus } from '../models/AnimationStatus';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  updateGame(gameMessage: any) {

  }

  retrieveGameData() {

  }

  retrieveGameAnimationStatus(): AnimationStatus {
    return {
      tanks: [{ x: 10, y: 10, dir: 0, hp: 50 }]
    };
  }
}

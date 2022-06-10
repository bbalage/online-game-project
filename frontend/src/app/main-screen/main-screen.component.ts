import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WSMessageLogoutReceived } from '../models/WSMessages';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  disablingGameMode: Subject<undefined> = new EventEmitter();

  constructor(
    private wsService: WebSocketService,
    private userService: UserService,
    private gameService: GameService,
    private router: Router
  ) {
    wsService.logoutMessages$.subscribe({
      next: (message: WSMessageLogoutReceived) => this.performLogout()
    });
  }

  ngOnInit(): void {

  }

  performLogout() {
    console.log("Logout user.");
    this.userService.logoutUser();
    this.router.navigateByUrl("/login");
  }

  startGame() {
    this.gameService.registerTank();
  }

  disableGameMode() {
    this.disablingGameMode.next(undefined);
  }
}
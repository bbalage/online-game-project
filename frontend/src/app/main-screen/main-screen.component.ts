import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  constructor(private wsService: WebSocketService) {
  }


  ngOnInit(): void {

  }

}

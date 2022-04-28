import { Component, OnInit } from '@angular/core';
import { History } from 'src/app/models/History';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  constructor(private historyService: HistoryService) { }

  scores: History[] = [];

  displayedColumns: string[] = ['id', 'username'];

  ngOnInit(): void {
    this.historyService.getHistories().subscribe((histories) => {
      this.scores = histories;
    })
  }

}

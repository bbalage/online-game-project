import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor() { }

  users : String[] = [];

  username = new FormControl('', [Validators.required]);
  asd : string = "";

  ngOnInit(): void {
    this.users.push("User1");
    this.users.push("User2");
    this.users.push("User3");
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UserService) { }

  users: User[] = [];

  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  displayedColumns: string[] = ['id', 'username'];

  message: string = '';

  ngOnInit(): void {
    this.userService.getUsers().subscribe((result) => {
      this.users = result;
    })
  }

  addUser() {
    const user = this.registrationForm.value;

    this.userService.addUser(user).subscribe(
      () => {
        this.message = "User added";
      },
      (err) => {
        this.message = err.toString();
      }
    );
  }

}

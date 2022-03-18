import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
  });

  isPlayerChecked: boolean = false;

  users!: User[];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    //EXAMPLE, DELETE LATER
    var user1: User = { id: 0, username: 'marci', password: '123' };
    var user2: User = { id: 1, username: 'béla', password: '121' };
    var user3: User = { id: 2, username: 'kata', password: '122' };
    this.users = [user1, user2, user3];
  }

  //TODO finish after DAO update
  login() {
    const user = this.loginForm.value;

    this.userService.authenticateUser(user);//USE THIS LATER

    //EXAMPLE, DELETE LATER
    for (let u of this.users) {
      if (u.username == user.username && u.password == user.password) {
        sessionStorage.setItem('user', JSON.stringify(this.loginForm.value));
        this.router.navigateByUrl('/home');
        return;
      }
    }
  }

  register() {
    //EXAMPLE, DELETE LATER
    sessionStorage.setItem('user', JSON.stringify(this.loginForm.value));
    this.router.navigateByUrl('/home');
  }

  checkUserRegistration(): boolean {
    //EXAMPLE, DELETE LATER
    const user = this.loginForm.value;

    var isPlayerRegistered = false;

    for (let u of this.users) {
      if (u.username == user.username) {
        isPlayerRegistered = true;
        break;
      }
    }

    this.loginForm.controls['password'].setValidators([Validators.required]);
    this.isPlayerChecked = true;
    return isPlayerRegistered;
  }
}

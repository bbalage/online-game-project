import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  isUserValid: boolean = true;
  isAdmin: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  login() {
    const user = this.loginForm.value;
    if (this.isAdmin) {
      this.userService.authenticateAdmin(user).subscribe(
        () => {
          this.router.navigateByUrl('/admin');
        },
        (err) => (this.isUserValid = false)
      );
    } else {
      this.userService.authenticateAdmin(user).subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        (err) => (this.isUserValid = false)
      );
    }
  }

  register() {
    this.router.navigateByUrl('/registration');
  }
}

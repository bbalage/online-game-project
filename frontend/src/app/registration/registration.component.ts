import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  message: string = '';

  constructor(private router: Router, private userService: UserService) {}

  register() {
    const user = this.registrationForm.value;

    this.userService.addUser(user).subscribe(
      () => {
        this.router.navigateByUrl('/login');
      },
      (err) => {
        this.message = err.toString();
      }
    );
  }
}

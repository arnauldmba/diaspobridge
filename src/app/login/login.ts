import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit  {

  user = new User();
  errorLogin = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLoggdin(): void {
    console.log('Login attempt for user:', this.user);
    let isValidUser = this.authService.login(this.user);
    if (isValidUser) {
      console.log('Login successful');
      this.router.navigate(['/']);
    } else {
      console.log('Invalid credentials');
      this.errorLogin = 1;
    }
  }

}

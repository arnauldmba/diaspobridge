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

  requestUser = {
    email: '',
    password: ''
  };
  
  errorLogin = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLoggdin(): void {

    this.authService.login(this.requestUser).subscribe({
      next: (response) => {
        const jwtToken = response.headers.get('Authorization');
        if (jwtToken) {
          console.log('Login sucess: *******', jwtToken);
          this.authService.saveToken(jwtToken);
          this.router.navigate(['/']);
        } else {
          this.errorLogin = 1;
        }
      },
      error: (err) => {
        console.error('Login error: ', err);
        this.errorLogin = 1;
      }
    });

    /*
    console.log('Login attempt for user:', this.user);
    let isValidUser = this.authService.login(this.user);
    if (isValidUser) {
      console.log('Login successful');
      this.router.navigate(['/']);
    } else {
      console.log('Invalid credentials');
      this.errorLogin = 1;
    }
      */
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from '../model/users.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit  {

  user = new User();

  ngOnInit(): void {
  }

  onLoggdin(): void {
    console.log('Login attempt for user:', this.user);
    // Here you would typically call a service to handle authentication
  }

}

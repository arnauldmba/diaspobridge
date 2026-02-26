import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  requestUser = {
    email: '',
    password: ''
  };

  message: string = '';

  errorLogin = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const msg = sessionStorage.getItem('auth_error');
    if (msg) {
      this.message = msg;
      sessionStorage.removeItem('auth_error');
    }
  }

  onLoggdin(): void {

    this.authService.login(this.requestUser).subscribe({
      next: (response) => {
        const jwtToken = response.headers.get('Authorization');
        if (jwtToken) {
          this.authService.saveToken(jwtToken);
          this.router.navigate(['/listings']);
        } else {
          this.errorLogin = 1;
        }
      },
      error: (err) => {
        console.log("HTTP error:", err);

        const raw = err?.error;
        const cause =
          typeof raw === "object" && raw !== null ? (raw as any).errorCause : null;

        if (cause === "disabled") {
          this.message = "Compte non activé. Veuillez vérifier votre email.";
        } else {
          this.message = "Login ou mot de passe incorrect";
        }

        this.errorLogin = 1;
      }
    });
  }

}

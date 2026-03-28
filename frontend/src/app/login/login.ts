import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { finalize, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  isLoading: boolean = true; 

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

          this.authService.loadCurrentUser().subscribe({
            next: (user) => {
              if(user.role === 'ADMIN'){
                this.router.navigate(['/admin']);
              }else{
                this.router.navigate(['/listings']);
              }
            }
          })
          
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

  onLoggdin2(): void {
    this.errorLogin = 0;
    this.message = '';
    this.isLoading = true;

    this.authService.login(this.requestUser).pipe(
      switchMap((response) => {
        const token = response.headers.get('Authorization');
        if (!token) throw new Error('TOKEN_MISSING');

        this.authService.saveToken(token);
        return this.authService.loadCurrentUser();
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (user) => {
        this.router.navigate([user.role === 'ADMIN' ? '/admin' : '/listings']);
      },
      error: (err) => {
        console.error(err);

        const cause = err?.error?.errorCause;

        if (cause === "disabled") {
          this.message = "Compte non activé. Vérifiez votre email.";
        } else if (err.message === 'TOKEN_MISSING') {
          this.message = "Erreur technique lors de la connexion.";
        } else {
          this.message = "Login ou mot de passe incorrect";
        }

        this.errorLogin = 1;
      }
    });
  }
}

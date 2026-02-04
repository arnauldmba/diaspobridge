import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../model/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../model/LoginRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verif-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verif-email.html',
  styleUrl: './verif-email.css',
})
export class VerifEmail implements OnInit {

  email = '';
  loading = false;
  resending = false;

  message: string | null = null;
  error: string | null = null;

  code: string = '';
  err = "";
  user: User = new User();
  requestUser!: LoginRequest;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getRegistredUser();
    this.requestUser = {
      email: this.user.email!,
      password: this.user.password!
    };
  }

  onValidateEmail() {

    this.authService.validateEmail(this.code).subscribe({
      next: (res) => {
        alert('Login successful');
        this.authService.login(this.requestUser).subscribe({
          next: (data) => {
            let jwToken = data.headers.get('Authorization')!;
            this.authService.saveToken(jwToken);
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err: any) => {
        if ((err.error.errorCode = "EXPIRED_TOKEN"))
          this.err = "Token expiré. Veuillez réessayer.";

        if ((err.error.errorCode = "INVALID_TOKEN"))
          this.err = "Token invalide. Veuillez réessayer.";

        console.log(err.errorCode);
      },
    });

  }

  onVerify(): void {
    this.message = null;
    this.error = null;
    this.loading = true;

    const token = this.code?.trim();
    if (!token) {
      this.loading = false;
      return;
    }

    this.authService.validateEmail(token).subscribe({
      next: () => {
        // Optionnel: tu peux aussi juste afficher success et laisser l’utilisateur cliquer sur Login
        this.authService.login(this.requestUser).subscribe({
          next: (data) => {
            const jwToken = data.headers.get('Authorization');
            if (jwToken) this.authService.saveToken(jwToken);

            this.message = "Email confirmé ✅ Tu peux maintenant te connecter.";
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            this.error = err?.error?.message ?? "Email confirmé, mais connexion impossible. Essaie de te connecter.";
            this.loading = false;
            console.log(err);
          }
        });
      },
      error: (err: any) => {
        const code = err?.error?.errorCode;

        if (code === "EXPIRED_TOKEN") {
          this.error = "Token expiré. Veuillez demander un nouveau code.";
        } else if (code === "INVALID_TOKEN") {
          this.error = "Token invalide. Veuillez réessayer.";
        } else {
          this.error = err?.error?.message ?? "Code invalide ou expiré.";
        }

        this.loading = false;
        console.log(err);
      }
    });
  }


  onResend(): void {
    this.message = null;
    this.error = null;

    this.resending = true;
    const email = this.email.trim();

    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.message = "Si l’email existe, un nouveau code a été envoyé ✅";
        this.resending = false;
      },
      error: () => {
        this.error = "Impossible d’envoyer le code. Réessaie plus tard.";
        this.resending = false;
      }
    });
  }
}

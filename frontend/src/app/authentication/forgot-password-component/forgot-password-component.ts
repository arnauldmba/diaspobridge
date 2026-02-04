import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { finalize } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password-component',
  imports: [FormsModule, MatFormField, MatLabel, MatInputModule, RouterModule],
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.css',
})
export class ForgotPasswordComponent {

  email = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router) { }

  submit(): void {
    const email = (this.email ?? '').trim();
    if (!email) return;

    this.loading = true;

    // IMPORTANT: message neutre (ne pas leak si email existe ou non)
    this.authService.forgotPassword(email).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => {
        this.snack.open(
          "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.",
          "OK",
          { duration: 5000 }
        );
        // Option: retour login
        // this.router.navigate(['/login']);
      },
      error: () => {
        // Même en cas d'erreur, on garde un message neutre côté UX
        this.snack.open(
          "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.",
          "OK",
          { duration: 5000 }
        );
      }
    });
  }

}

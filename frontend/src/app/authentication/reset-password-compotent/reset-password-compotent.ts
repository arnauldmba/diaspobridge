import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { MatFormField, MatLabel, MatHint, MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-reset-password-compotent',
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule,  MatLabel, MatIcon, MatHint, MatError, RouterModule],
  templateUrl: './reset-password-compotent.html',
  styleUrl: './reset-password-compotent.css',
})
export class ResetPasswordCompotent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;

  hide1 = true;
  hide2 = true;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    console.log("token recu dans reset: ", this.token);
    if (!this.token) {
      this.snack.open("Lien invalide: token manquant. Redemande un nouveau lien.", "OK", { duration: 6000 });
    }
  }

  get canSubmit(): boolean {
    const pw = this.newPassword ?? '';
    const okLength = pw.length >= 8;
    const okMatch = pw === (this.confirmPassword ?? '');
    return !!this.token && okLength && okMatch && !this.loading;
  }

  submit(): void {
    if (!this.canSubmit) return;

    this.loading = true;

    this.auth.resetPassword(this.token, this.newPassword).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => {
        this.snack.open("Mot de passe mis à jour ✅ Tu peux te connecter.", "OK", { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Backend peut renvoyer "Token expired" / "Invalid token" / "Password too short"
        const msg = this.mapError(err);
        this.snack.open(msg, "OK", { duration: 7000 });
      }
    });
  }

  private mapError(err: any): string {
    const raw = (err?.error?.message || err?.error || err?.message || '').toString().toLowerCase();

    if (raw.includes('expired')) return "Ce lien a expiré. Redemande un nouveau lien.";
    if (raw.includes('invalid token')) return "Lien invalide. Redemande un nouveau lien.";
    if (raw.includes('too short') || raw.includes('min')) return "Mot de passe trop court (min 8 caractères).";

    return "Impossible de réinitialiser le mot de passe. Redemande un nouveau lien.";
  }
}
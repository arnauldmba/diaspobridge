import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  sending = false;
  form!: FormGroup;

  appName = environment.appName;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router) {
      this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(800)]],
    });
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // ✅ MVP: pas de backend, donc on simule l'envoi
    this.sending = true;

    setTimeout(() => {
      this.sending = false;
      this.toastr.success('Message envoyé. Merci !');
      this.form.reset();
    }, 700);

    // ✅ Plus tard (V2): envoyer au backend (ContactService) ou envoyer un email.
  }

  reset(): void {
    this.form.reset();
  }

  backToListing() {
    this.router.navigate(['/listings']);
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormField, MatLabel, MatHint, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../../model/users.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    RouterLink, 
    CommonModule, 
    MatProgressSpinnerModule, 
    MatFormField, MatLabel, 
    MatFormFieldModule, 
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  myForm!: FormGroup;
  err: any;
  loading: boolean = false;

  constructor( private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister() {
    this.loading = true;

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formValue = this.myForm.value;

    // 🔹 On envoie seulement ce que le backend attend
    const payload = {
      firstName: formValue.firstName,
      email: formValue.email,
      password: formValue.password
    };

    const user = new User();
    user.firstName = formValue.firstName;
    user.email = formValue.email;
    user.password = formValue.password;

    this.authService.registerUser(user).subscribe({
      next: (res) => {
        this.authService.setRegistredUser(user);
        this.loading = false;
        this.toastr.success('Inscription réussie ! Veuillez vérifier votre email pour la validation.', 'Succès'); 
        this.router.navigate(['/auth/verify-email']);
      },
      error: (err: any) => {
        console.error('Registration error: ', err);

        // ✅ à la place :
        if (err.status === 400) {
          this.loading = false;
          this.err = err.error?.message ?? 'Requête invalide (400)';
        }
      }
    });
  }
}

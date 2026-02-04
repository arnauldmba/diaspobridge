import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../model/users.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
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

    console.log('Payload envoyé au backend:', payload);

    this.authService.registerUser(user).subscribe({
      next: (res) => {
        this.authService.setRegistredUser(user);
        this.loading = false;
        this.toastr.success('Inscription réussie ! Veuillez vérifier votre email pour la validation.', 'Succès'); 
        this.router.navigate(['/verifEmail']);
      },
      error: (err: any) => {
        console.error('Registration error: ', err);

        // ❌ ici tu fais une affectation, pas une comparaison
        // if (err.status = 400) { ... }

        // ✅ à la place :
        if (err.status === 400) {
          this.loading = false;
          this.err = err.error?.message ?? 'Requête invalide (400)';
        }
      }
    });
  }
}

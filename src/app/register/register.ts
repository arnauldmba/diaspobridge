import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  myForm!: FormGroup;
  err: any;

  constructor( private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister2(): void {
    console.log('Registering user:', this.myForm.value);
  }

  onRegister() {
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

    console.log('Payload envoyé au backend:', payload);

    this.authService.registerUser(payload).subscribe({
      next: (res) => {
        alert("Veuillez confirmer votre email");
      //  this.router.navigate(['/listings']);
      //  this.router.navigate(['/']);
        // this.router.navigate(["/verifEmail", formValue.email]);
      },
      error: (err: any) => {
        console.error('Registration error: ', err);

        // ❌ ici tu fais une affectation, pas une comparaison
        // if (err.status = 400) { ... }

        // ✅ à la place :
        if (err.status === 400) {
          this.err = err.error?.message ?? 'Requête invalide (400)';
        }
      }
    });
  }
}

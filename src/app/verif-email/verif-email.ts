import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../model/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../model/LoginRequest';

@Component({
  selector: 'app-verif-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verif-email.html',
  styleUrl: './verif-email.css',
})
export class VerifEmail implements OnInit {

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
        if((err.error.errorCode = "EXPIRED_TOKEN"))
          this.err = "Token expiré. Veuillez réessayer.";
        
        if((err.error.errorCode = "INVALID_TOKEN"))
          this.err = "Token invalide. Veuillez réessayer.";
        
        console.log(err.errorCode);
      },
    });

  }

}

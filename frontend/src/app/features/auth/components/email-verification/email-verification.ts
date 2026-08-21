import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css',
})
export class EmailVerification {
  emailForm: FormGroup;
  email_2: string ="";

  constructor(private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  requestCode(): void {
    console.log(this.emailForm.value.email);
  }

  

  

}

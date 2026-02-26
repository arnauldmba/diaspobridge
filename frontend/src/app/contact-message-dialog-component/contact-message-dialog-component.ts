import { Component, Inject } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FirstLetterPipe } from "../shared/first-letter-pipe";

export type ContactDialogData = {
  title?: string;
  placeholder?: string;
  date?: string;
}

@Component({
  selector: 'app-contact-message-dialog-component',
  imports: [FormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, /*MatDialogClose,*/ MatDialogActions, MatButtonModule, FirstLetterPipe],
  standalone: true,
  templateUrl: './contact-message-dialog-component.html',
  styleUrl: './contact-message-dialog-component.css',
})

export class ContactMessageDialogComponent {

  message = '';
  touched = false;

  constructor(
    private ref: MatDialogRef<ContactMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData
  ) {}

  onCancel() {
    this.ref.close();
  }

  onSend() {
    this.touched = true;
    if (!this.message.trim()) return; // ✅ bloque l’envoi
    this.ref.close(this.message.trim()); // ✅ renvoie le message au parent
  }

}

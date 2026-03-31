import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LanguageSwitcher } from "../../shared/components/language-switcher/language-switcher";

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, LanguageSwitcher],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from "../../../../../shared/components/language-switcher/language-switcher";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, LanguageSwitcher],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  year = new Date().getFullYear();

  constructor(router: Router){}
}

import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  currentUrl = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.router.url;
      });
  }

  isHomeSection(): boolean {
    return this.currentUrl === '/' || this.currentUrl.startsWith('/listing-details/');
  }

  isMessagesSection(): boolean {
    return this.currentUrl.startsWith('/messages');
  }

  isProfileSection(): boolean {
    return this.currentUrl.startsWith('/profil');
  }

  isCreateSection(): boolean {
    return this.currentUrl.startsWith('/add-listing');
  }
}

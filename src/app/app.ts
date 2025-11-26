import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('diasporabridge');

  constructor(public authService: AuthService, public router: Router) { }

  logout(): void {
    this.authService.logout();
  }

  isUserLogIn() {
    if (!this.authService.isloggedIn) {
      this.router.navigate(['/login']);
    }
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkWithHref, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('diasporabridge');

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.authService.loadToken();
    if (this.authService.getToken() == null || this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
    }

    /*
    let isloggedIn: string
    let loggedUser: string;

    isloggedIn = localStorage.getItem('isloggedIn')!;
    loggedUser = localStorage.getItem('loggedUser')!;

    if (isloggedIn != 'true' || !isloggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.authService.setLoggedUserFromLocalStorage(loggedUser);
    }
    */
  }

  logout(): void {
    this.authService.logout();
  }

  isUserLogIn() {
    if (!this.authService.isloggedIn) {
      this.router.navigate(['/login']);
    }
  }
}

import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs/operators';
import { FirstLetterPipe } from "./shared/first-letter-pipe";
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterOutlet, RouterLinkWithHref, MatIconModule, RouterLinkActive, MatButtonModule, MatMenuModule, FirstLetterPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('diasporabridge');
  isLoggedIn$!: Observable<boolean>;
  currentUserEmail?: string; 
  currentUserEmail2$: Observable<string | null> | undefined;

  mobileMenuOpen = false;

  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  @ViewChild('navbar') navbar!: ElementRef;

  constructor(public authService: AuthService, public router: Router) { 
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => (this.mobileMenuOpen = false));
  }

  ngOnInit(): void {
    this.authService.loadToken();
    this.isLoggedIn$ = this.authService.authState$;
    this.currentUserEmail = this.authService.logedUser;
    this.currentUserEmail2$ = this.authService.userEmail$;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.mobileMenuOpen) return;

    const clickedInside =
      this.mobileMenu?.nativeElement.contains(event.target) ||
      this.navbar?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.closeMenu();
    }
  }
}

import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterOutlet, RouterLinkWithHref, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { FirstLetterPipe } from '../../shared/first-letter-pipe';
import { Observable, filter } from 'rxjs';
import { SeachBarComputer } from "../../features/listings/components/seach-bar-computer/seach-bar-computer";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar-desk',
  standalone: true,
  imports: [
    AsyncPipe, 
    RouterLink, 
    RouterLinkWithHref, 
    MatIconModule, 
    RouterLinkActive, 
    MatButtonModule, 
    MatMenuModule, 
    FirstLetterPipe, 
    MatBadgeModule, 
    MatFormFieldModule, 
    MatInputModule],
  templateUrl: './navbar-desk.html',
  styleUrl: './navbar-desk.css',
})
export class NavbarDesk implements OnInit{

  value: string = '';

  
  protected readonly title = signal('diasporabridge');

  hidden = false;
  unreadMessage!: number;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  /** detect scroll for nav-shadow bottom */
  isScrolled = false;

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

  /** scroll shadow */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): boolean {
    return this.mobileMenuOpen = !this.mobileMenuOpen;
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
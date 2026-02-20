import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import { Role } from '../model/role.models';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginRequest } from '../model/LoginRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  apiUrl: string = environment.apiUrl;

  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  private userEmailSubject = new BehaviorSubject<string | null>(null);
  public userEmail$ = this.userEmailSubject.asObservable();

  usersList: User[] = [];
  token!: string;

  public logedUser?: string;
  public roles: Role[] = [];
  public logedUserId?: number;
  private helper = new JwtHelperService();

  regitredUser: User = new User();

  constructor(private router: Router, private http: HttpClient) {
    this.userEmailSubject.next(this.logedUser ?? null);
    this.loadToken(); 
  }

  setRegistredUser(user: User) {
    this.regitredUser = user;
  }
  
  getRegistredUser() {
    return this.regitredUser;
  }

  validateEmail(code: string) {
    return this.http.get<User>(this.apiUrl + '/auth/verifyEmail/' + code);
  }

  resendVerification(email: string) {
    //return this.http.post(`/api/auth/verifyEmail/resend`, { email });
    return this.http.post(`${this.apiUrl}/auth/verifyEmail/resend`, { email });
  }

  forgotPassword(email: string): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  login(requestUser: LoginRequest): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, requestUser, { observe: 'response' });
  }

  private normalizeToken(token: string | null): string | null {
    if (!token) return null;
    return token.startsWith('Bearer ') ? token.substring('Bearer '.length) : token;
  }

  // Save JWT token to local storage
  saveToken(jwt: string) {
    const raw = this.normalizeToken(jwt) ?? '';

    if (!raw) {
      this.clearAuthState();
      return;
    }

    localStorage.setItem('jwt', raw);
    this.token = raw;

    this.decodeJWTFrom(raw);
    this.userEmailSubject.next(this.logedUser ?? null);
    this.authStateSubject.next(true);
  }

  isTokenExpired(): boolean {
    const raw = this.getToken();
    return !raw || this.helper.isTokenExpired(raw);
  }

  getToken(): string | null {
    // 1) lire depuis mémoire ou localStorage
    const stored = this.token || localStorage.getItem('jwt');
    const raw = this.normalizeToken(stored);
    if (!raw) return null;

    // 2) si expiré -> purge
    if (this.helper.isTokenExpired(raw)) {
      this.clearAuthState();
      return null;
    }

    return raw; // ✅ toujours RAW (sans Bearer)
  }

  registerUser(user: User) {
    return this.http.post<User>(this.apiUrl + '/auth/register', user,
      { observe: 'response' });
  }

  getUserByEmail(email: string): User | null {
    const user = this.usersList.find(u => u.email === email);
    return user ? user : null;
  }

  private clearAuthState(): void {
    localStorage.removeItem('jwt');
    this.token = '';
    this.roles = [];
    this.logedUser = undefined;
    this.logedUserId = undefined;

    this.userEmailSubject.next(null);
    this.authStateSubject.next(false);
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.helper.isTokenExpired(token);
  }

  // Get current user (for simulation purposes, return the first user)
  getCurrentUser(): User | null {
    return this.usersList.length > 0 ? this.usersList[0] : null;
  }

  loadToken(): void {
    const t = localStorage.getItem('jwt');
    this.token = t ?? '';

    if (t && !this.helper.isTokenExpired(t)) {
      this.decodeJWTFrom(t);
      this.userEmailSubject.next(this.logedUser ?? null);
      this.authStateSubject.next(true);
    } else {
      this.clearAuthState();
    }
  }

  decodeJWTFrom(token: string): void {
    const decodedToken = this.helper.decodeToken(token);

    const rawRoles: string[] = decodedToken.roles || [];
    this.roles = rawRoles
      .map((r: string) => r.replace('ROLE_', ''))
      .filter((r: string) => Object.values(Role).includes(r as Role)) as Role[];

    this.logedUser = decodedToken.sub;
    this.logedUserId = decodedToken.userId;
  }

  decodeJWT(): void {
    if (this.token) this.decodeJWTFrom(this.token);
  }

  isAdmin(): boolean {
    return this.roles.includes(Role.ADMIN);
  }

  setLoggedUserFromLocalStorage(logedUser: string) {
    this.logedUser = logedUser;
    this.getUserRole(logedUser);
  }

  getUserRole(username: string) {
    this.usersList.forEach((u) => {
      if (username === u.firstName) {
        this.roles = [u.role];
        this.logedUserId = u.id;
      }
    });
  }
}

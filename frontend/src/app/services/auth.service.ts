import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import { Role } from '../model/role.models';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginRequest } from '../model/LoginRequest';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //apiUrl: string = 'http://localhost:8080/diasporabridge/api';
  apiUrl: string = environment.apiUrl;

  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();


  usersList: User[] = [];
  token!: string;

  public logedUser?: string;
  public roles: Role[] = [];
  public logedUserId?: number;
  private helper = new JwtHelperService();

  regitredUser: User = new User();

  constructor(
    private router: Router, 
    private http: HttpClient,
  ) { }

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
    localStorage.setItem('jwt', raw);
    this.token = raw;

    this.decodeJWTFrom(raw);
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
      localStorage.removeItem('jwt');
      this.token = '';
      this.roles = [];
      this.logedUser = undefined;
      this.logedUserId = undefined;
      this.authStateSubject.next(false);
      return null;
    }

    return raw; // ✅ toujours RAW (sans Bearer)
  }

  decodeJWT(): void {
    if (this.token) {
      const decodedToken = this.helper.decodeToken(this.token);
      console.log('Decoded ---- JWT:', decodedToken);

      const rawRoles: string[] = decodedToken.roles || [];

      // Normalisation : "ROLE_ADMIN" -> "ADMIN"
      this.roles = rawRoles
        .map((r: string) => r.replace('ROLE_', ''))
        .filter((r: string) => Object.values(Role).includes(r as Role)) as Role[];
      this.logedUser = decodedToken.sub;
      this.logedUserId = decodedToken.userId; // ✅
      console.log('User Roles:', this.roles);
      console.log('Logged User:', this.logedUser);
      console.log('Logged User ID:', this.logedUserId);
    }
  }

  //registerUser(user: any) {
  registerUser(user: User) {
    return this.http.post<User>(this.apiUrl + '/auth/register', user,
      { observe: 'response' });
  }

  getUserByEmail(email: string): User | null {
    const user = this.usersList.find(u => u.email === email);
    return user ? user : null;
  }

  // Simulate user logout
  logout(): void {
    this.token = '';
    this.roles = [];
    this.logedUserId = undefined;
    this.logedUser = undefined;
    localStorage.removeItem('jwt');

    this.authStateSubject.next(false);
    this.router.navigate(['/login']);
    //localStorage.setItem('isloggedIn', String(this.isloggedIn));
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
      this.authStateSubject.next(true);
    } else {
      localStorage.removeItem('jwt'); // ✅ purge si expiré
      this.token = '';
      this.authStateSubject.next(false);
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

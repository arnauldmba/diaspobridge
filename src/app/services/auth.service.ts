import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import { USERS_LIST } from '../mocks/users.mock'; 
import { Role } from '../model/role.models';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginRequest } from '../model/LoginRequest';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  usersList: User[] = USERS_LIST;
  apiUrl: string = 'http://localhost:8080/diasporabridge/api/auth';
  token!: string;

  public logedUser?: string;
  public isloggedIn: boolean = false;
  public roles:Role[] = [];
  public logedUserId?: number;
  private helper = new JwtHelperService();


  constructor(private router: Router, private http: HttpClient) { }

  
  login(requestUser: LoginRequest): Observable<HttpResponse<User>>  {
   return this.http.post<User>(`${this.apiUrl}/login`, requestUser, {observe: 'response'});
  }

  // Save JWT token to local storage
  saveToken(jwt: string) {
    localStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  getToken(): string{
    return this.token;
  }

  decodeJWT(): void {
    if (this.token) {
      const decodedToken = this.helper.decodeToken(this.token);
      console.log('Decoded JWT:', decodedToken);
      console.log('isloggedIn:', this.isloggedIn);

      const rawRoles: string[] = decodedToken.roles || [];

      // Normalisation : "ROLE_ADMIN" -> "ADMIN"
      this.roles = rawRoles
        .map((r: string) => r.replace('ROLE_', ''))
        .filter((r: string) => Object.values(Role).includes(r as Role)) as Role[];
      this.logedUser = decodedToken.sub;
    }
  }

  getUserByEmail(email: string): User | null {
    const user = this.usersList.find(u => u.email === email);
    return user ? user : null;
  }

  // Simulate user logout
  logout(): void {
    this.token =  undefined!;
    this.roles = undefined!;
    this.logedUserId = undefined;
    localStorage.removeItem('jwt');
    this.logedUser = undefined;
    this.isloggedIn = false;
    //localStorage.setItem('isloggedIn', String(this.isloggedIn));
    this.router.navigate(['/login']);
  }

  // Get current user (for simulation purposes, return the first user)
  getCurrentUser(): User | null {
    return this.usersList.length > 0 ? this.usersList[0] : null;
  }

  isTokenExpired(): boolean {
    return this.helper.isTokenExpired(this.token);
  }

  loadToken(): void {
    this.token = localStorage.getItem('jwt')!;
    this.decodeJWT();
  }

  isAdmin(): boolean {
    return this.roles.includes(Role.ADMIN);
  }

  setLoggedUserFromLocalStorage(logedUser: string) {
    this.logedUser = logedUser;
    this.isloggedIn = true;
    this.getUserRole(logedUser);
  }

  getUserRole(username: string){
    this.usersList.forEach((u) => {
      if(username === u.firstName){
        this.roles = [u.role];
        this.logedUserId = u.id;
      }
    });
  }


  
}

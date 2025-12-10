import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import { USERS_LIST } from '../mocks/users.mock'; 
import { Role } from '../model/role.models';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  usersList: User[] = USERS_LIST;
  apiUrl: string = 'http://localhost:8080/users'; //http://localhost:8080/diasporabridge/api/trip'
  token!: string;

  public logedUser?: string;
  public isloggedIn: boolean = false;
  public roles:Role[] = [];
  public logedUserId?: number;

  constructor(private router: Router, private http: HttpClient) { }

  login2(user: User) {
   // return this.http.post<{token: string}>(`${this.apiUrl}/login`, user);
   return this.http.post<User>(`${this.apiUrl}/login`, user, {observe: 'response'});
  }

  saveToken(jwt: string) {
    localStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isloggedIn = true;
  }

  // Simulate user login
  login(user: User): Boolean{
    let validUser: Boolean = false;
    this.usersList.forEach((u) => {
      if(user.email === u.email && user.passwordHash == u.passwordHash){
        validUser = true;
        this.logedUser = u.firstName;
        this.isloggedIn = true;
        this.roles = [u.role];
        this.logedUserId = u.id;
        localStorage.setItem('loggedUser', this.logedUser!);
        localStorage.setItem('isloggedIn', String(this.isloggedIn));
      }
    });
    return validUser;
  }

  // Simulate fetching user by email
  getUserByEmail(email: string): User | null {
    const user = this.usersList.find(u => u.email === email);

    //const user = this.usersList.find(u => u.email === email);
    return user ? user : null;
  }

  // Simulate user logout
  logout(): void {
    this.isloggedIn = false;
    this.logedUser = undefined;
    this.roles = [];
    localStorage.removeItem('loggedUser');
    localStorage.setItem('isloggedIn', String(this.isloggedIn));
    this.router.navigate(['/login']);
  }

  // Get current user (for simulation purposes, return the first user)
  getCurrentUser(): User | null {
    return this.usersList.length > 0 ? this.usersList[0] : null;
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

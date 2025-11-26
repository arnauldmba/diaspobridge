import { Injectable } from '@angular/core';
import { User } from '../model/users.model';
import { USERS_LIST } from '../mocks/users.mock'; 
import { Role } from '../model/role.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  usersList: User[] = USERS_LIST;

  public logedUser?: string;
  public isloggedIn: boolean = false;
  public roles:Role[] = [];

  constructor() { }

  // Simulate user login
  login(user: User): Boolean{
    let validUser: Boolean = false;
    this.usersList.forEach((u) => {
      if(user.email === u.email && user.passwordHash == u.passwordHash){
        validUser = true;
        this.logedUser = u.firstName;
        this.isloggedIn = true;
        this.roles = [u.role];
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
    // In a real application, you would clear user session data
    console.log('User logged out');
  }

  // Get current user (for simulation purposes, return the first user)
  getCurrentUser(): User | null {
    return this.usersList.length > 0 ? this.usersList[0] : null;
  }
  
}

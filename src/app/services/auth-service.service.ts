import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private users: User[] = [];
  private registeredUsers: User[] = [
    {
      userName: 'Admin',
      emailId: 'admin@parkmate.com',
      password: 'admin',
      role: 'Admin',
    },
    {
      userName: 'EntryGateOperator',
      emailId: 'entry@parkmate.com',
      password: 'entry',
      role: 'EntryGateOperator',
    },
    {
      userName: 'ExitGateOperator',
      emailId: 'exit@parkmate.com',
      password: 'exit',
      role: 'ExitGateOperator',
    },
  ];
  private currentUser: User | null = null;

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  // Register New user
  registerUser(newUser: User): boolean {
    // Checking if user already exists
    const userExists = this.users.some(
      (user) => user.emailId === newUser.emailId
    );

    if (userExists) {
      console.log('User already exists');
      return false;
    }

    this.users.push(newUser);
    this.saveUsers();

    // Setting as current user
    this.currentUser = newUser;
    localStorage.setItem('CurrentUser', JSON.stringify(newUser));
    console.log("Registered and loged in as " + this.currentUser.userName);
    
    return true;
  }

  // Saving users in local storage
  private saveUsers() {
    localStorage.setItem('Users', JSON.stringify(this.users));
  }

  // Loading users from local storage
  private loadUsers() {
    const storedUsers = localStorage.getItem('Users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    this.registeredUsers.forEach((user) => {
      if(!this.users.some((u) => u.emailId === user.emailId)) {
        this.users.push(user);
      }
    });
  }

  // Login user
  loginUser(emailId: string, password: string): boolean {
    const user = this.users.find((user) => user.emailId === emailId);

    // Password check
    if (user?.password === password) {
      this.currentUser = user;
      // Saving current user
      localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser));
      console.log('Logged in as: ' + user.userName + ' with Email ID: ' + user.emailId);
      return true;
    } else {
      return false;
    }
  }

  // Load current user
  private loadCurrentUser() {
    const storedUser = localStorage.getItem('CurrentUser');
    if(storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  // Getting current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Getting current user role
  getUserRole(): string | null {
    return this.currentUser ? this.currentUser.role : null;
  }

  getCurrentUserName(): string | null {
    return this.currentUser ? this.currentUser.userName : null;
  }

  // Logout
  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem('CurrentUser');
  }
}

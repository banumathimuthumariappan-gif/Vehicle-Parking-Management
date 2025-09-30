import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerUserName: string = '';
  registerEmailID: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onRegister(form: any) {
    const registerNewUser: User = {
      userName: this.registerUserName,
      emailId: this.registerEmailID,
      password: this.registerPassword,
      role: 'User', // Default Role
    };
    if (this.authService.registerUser(registerNewUser)) {
      alert('User Registered Successfully');
      this.router.navigateByUrl('/user-dashboard');
    } else {
      alert('User already exists');
    }
    form.reset();
  }
}

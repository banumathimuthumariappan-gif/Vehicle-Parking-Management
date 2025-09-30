import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginEmail: string = '';
  loginPassword: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthServiceService, private router: Router) {}

  onLogin(formValue: any) {
    console.log(this.loginEmail);
    console.log(this.loginPassword);
    const loginSuccessStatus = this.authService.loginUser(this.loginEmail, this.loginPassword);
    if(loginSuccessStatus) {
      this.loginFailed = false;
      // alert('Login successful');
      formValue.reset();

      const role = this.authService.getUserRole();
      console.log("User role is " + role);

      switch(role) {
        case 'User': {
          this.router.navigateByUrl('/user-dashboard');
          break;
        }
        case 'Admin': {
          this.router.navigateByUrl('/admin-dashboard');
          break;
        }
        case 'EntryGateOperator': {
          this.router.navigateByUrl('/entry-gate-dashboard');
          break;
        }
        case 'ExitGateOperator': {
          this.router.navigateByUrl('/exit-gate-dashboard');
          break;
        }
        default: {
          this.router.navigateByUrl('/login');
          break;
        }
      }
      
    } else {
      this.loginFailed = true;
      alert('Login failed');
    }
  }
}

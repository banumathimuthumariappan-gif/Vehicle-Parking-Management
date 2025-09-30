import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  userRole: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.getUserRole();
    this.getUserName();
  }

  getUserRole() {
    const role = this.authService.getUserRole();
    console.log('Role ' + role);

    if (role) {
      this.userRole = role;
    }
  }

  getUserName() {
    const username = this.authService.getCurrentUserName();
    console.log('Username : ' + username);

    if (username) {
      this.userName = username;
    }
  }

  logout() {
    this.router.navigateByUrl('/login');
  }
}

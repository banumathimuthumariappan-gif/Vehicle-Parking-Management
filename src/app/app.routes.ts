import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { EntryGateDashboardComponent } from './pages/entry-gate-dashboard/entry-gate-dashboard.component';
import { ExitGateDashboardComponent } from './pages/exit-gate-dashboard/exit-gate-dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        // canActivate: [authGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'user-dashboard',
        component: UserDashboardComponent,
        // canActivate: [authGuard],
        data: { roles: ['User'] },
      },
      {
        path: 'entry-gate-dashboard',
        component: EntryGateDashboardComponent,
        // canActivate: [authGuard],
        data: { roles: ['EntryGateOperator'] },
      },
      {
        path: 'exit-gate-dashboard',
        component: ExitGateDashboardComponent,
        // canActivate: [authGuard],
        data: { roles: ['ExitGateOperator'] },
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

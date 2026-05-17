import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./ui/login/login').then((m) => m.Login),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

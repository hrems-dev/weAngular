import { Routes } from '@angular/router';

export const personRoutes: Routes = [
  {
    path: 'suppliers',
    loadComponent: () => import('./ui/supplier-list/supplier-list').then((m) => m.SupplierList),
  },
  {
    path: 'clients',
    loadComponent: () => import('./ui/client-list/client-list').then((m) => m.ClientList),
  },
];

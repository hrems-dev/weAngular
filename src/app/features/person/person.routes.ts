import { Routes } from '@angular/router';

export const personRoutes: Routes = [
  {
    path: 'suppliers',
    loadComponent: () => import('./ui/supplier-list/supplier-list').then((m) => m.SupplierList),
  },
  {
    path: 'suppliers/create',
    loadComponent: () =>
      import('./ui/supplier-list/supplier-form/supplier-form').then((m) => m.SupplierForm),
  },
  {
    path: 'suppliers/edit/:id',
    loadComponent: () =>
      import('./ui/supplier-list/supplier-form/supplier-form').then((m) => m.SupplierForm),
  },
  {
    path: 'clients',
    loadComponent: () => import('./ui/client-list/client-list').then((m) => m.ClientList),
  },
  {
    path: 'clients/create',
    loadComponent: () =>
      import('./ui/client-list/client-form/client-form').then((m) => m.ClientForm),
  },
  {
    path: 'clients/edit/:id',
    loadComponent: () =>
      import('./ui/client-list/client-form/client-form').then((m) => m.ClientForm),
  },
];

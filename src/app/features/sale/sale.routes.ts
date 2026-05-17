import { Routes } from '@angular/router';

export const saleRoutes: Routes = [
  {
    path: 'sales',
    loadComponent: () => import('./ui/sale-list/sale-list').then((m) => m.SaleList),
  },
  {
    path: 'report',
    loadComponent: () => import('./ui/sale-report/sale-report').then((m) => m.SaleReport),
  },
];

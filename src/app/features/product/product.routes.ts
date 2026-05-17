import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./ui/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'categories',
    loadComponent: () => import('./ui/category-list/category-list').then((m) => m.CategoryList),
  },
];

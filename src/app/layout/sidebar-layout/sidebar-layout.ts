import { Component, inject } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { LayoutState } from '../../core/layout-state';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './sidebar-layout.html',
  styleUrl: './sidebar-layout.scss',
})
export class SidebarLayout {
  layoutState = inject(LayoutState);

  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard'],
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      items: [
        { label: 'Products', icon: 'pi pi-list', routerLink: ['/products/products'] },
        { label: 'Categories', icon: 'pi pi-tags', routerLink: ['/products/categories'] },
      ],
    },
    {
      label: 'Persons',
      icon: 'pi pi-users',
      items: [
        { label: 'Suppliers', icon: 'pi pi-truck', routerLink: ['/persons/suppliers'] },
        { label: 'Clients', icon: 'pi pi-user', routerLink: ['/persons/clients'] },
      ],
    },
    {
      label: 'Sales',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'Sales', icon: 'pi pi-list', routerLink: ['/sales/sales'] },
        { label: 'Report', icon: 'pi pi-chart-bar', routerLink: ['/sales/report'] },
      ],
    },
  ];
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLayout } from '../header-layout/header-layout';
import { SidebarLayout } from '../sidebar-layout/sidebar-layout';
import { FooterLayout } from '../footer-layout/footer-layout';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderLayout, SidebarLayout, FooterLayout],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-layout',
  standalone: true,
  templateUrl: './footer-layout.html',
  styleUrl: './footer-layout.scss',
})
export class FooterLayout {
  year = new Date().getFullYear();
}

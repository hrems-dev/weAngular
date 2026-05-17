import { Component, inject } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';

import { LayoutState } from '../../core/layout-state';

@Component({
  selector: 'app-header-layout',
  standalone: true,
  imports: [Toolbar, Button, Avatar],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.scss',
})
export class HeaderLayout {
  layoutState = inject(LayoutState);
}

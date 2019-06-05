/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Navbar Component
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
import {Component} from '@angular/core';

interface NavItem {
  displayName: string;
  routerLink: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  public navItems: Array<NavItem> = [
    {displayName: 'Home', routerLink: ''},
    {displayName: 'About', routerLink: 'about'}
  ];

  public isCollapsed = true;
}

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
import {TranslateService} from '@ngx-translate/core';

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
  private inputLanguage = 'en';

  public isCollapsed = true;

  constructor(public translate: TranslateService) {
  }

  private changeLanguage(lan: string): void {
    this.translate.use(lan);
  }
}

import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.addLangs(['de', 'en', 'hu', 'fr', 'it', 'fi']);
    translate.setDefaultLang(translate.getBrowserLang());
    translate.use(translate.getBrowserLang());
  }
}

import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.addLangs([
      'da', 'de-at', 'de-ch', 'en', 'fr-be', 'fr-fr', 'fr-ch', 'it-it', 'it-ch', 'hu', 'nl-be', 'nl-nl', 'sk', 'sl', 'sv-se']);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}

import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'de-at', 'da', 'fr-fr',
                              'sl', 'it-it', 'nl-be', 'nl-nl',
                              'fr-be', 'sk', 'it-ch', 'de-ch',
                              'fr-ch', 'sv-se', 'hu']);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}

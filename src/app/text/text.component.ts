import {Component} from '@angular/core';
import {SpeechService, TranslationResponse} from './speech.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  public recognisedText$ = new BehaviorSubject<string>('');
  public translatedResult$ = new BehaviorSubject<TranslationResponse>({text: ''});
  public listening = false;
  public inputLang = this.translate.currentLang;
  public outputLang = 'de-ch';

  private subscription: Subscription;

  constructor(private speechService: SpeechService,
              private translate: TranslateService) {

    this.translateText();
  }

  private changeInputLanguage(lang: string): void {
    this.reset();
    this.inputLang = lang;
    if (this.inputLang === this.outputLang) {
      if (this.outputLang !== 'en') {
        this.outputLang = 'en';
      } else {
        this.outputLang = 'de-ch';
      }
    }

    this.translate.use(lang);
  }

  changeOutputLanguage(lang: string) {
    this.outputLang = lang;
    this.translateText();
  }

  reset() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
  }

  listen() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
    this.listening = true;
    this.subscription = this.speechService.listen(this.getSpeakLang(this.inputLang))
      .subscribe(r => {
        this.recognisedText$.next(r);
      }, () => {
        this.listening = false;
      }, () => {
        this.listening = false;
      });
  }

  stopListening() {
    this.subscription.unsubscribe();
    this.listening = false;
  }

  private getSpeakLang(input: string): string {
    switch (input) {
      case 'en':
        return 'en-GB';
      case 'de-at':
        return 'de-DE';
      case 'da':
        return 'da-DK';
      case 'fr-fr':
        return 'fr-FR';
      case 'sl':
        return 'sl-SI';
      case 'it-it':
        return 'it-IT';
      case 'nl-be':
        return 'nl-NL';
      case 'nl-nl':
        return 'nl-NL';
      case 'fr-be':
        return 'fr-FR';
      case 'sk':
        return 'sk-SK';
      case 'it-ch':
        return 'it-IT';
      case 'de-ch':
        return 'de-DE';
      case 'fr-ch':
        return 'fr-FR';
      case 'sv-se':
        return 'sv-SE';
      case 'hu':
        return 'hu-HU';
    }
  }

  private translateText() {
    this.recognisedText$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        filter(rt => rt && rt.length > 0),
        tap(rt => {
          console.debug('# voice recognition: ', rt);
        }),
        switchMap(rt => this.speechService.sendToBackend$(rt, this.inputLang, this.outputLang)),
        tap(translated => {
          console.debug('# translation from backend: ', translated);
          this.translatedResult$.next(translated);
        }),
      ).subscribe(() => {
    });
  }
}

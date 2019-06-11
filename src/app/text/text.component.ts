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
  private recognisedText$ = new BehaviorSubject<string>('');
  private translatedResult$ = new BehaviorSubject<TranslationResponse>({text: ''});
  private isListening = false;
  private isTranslating = false;
  private inputLang = this.translate.currentLang;
  private outputLang = 'de-ch';

  private subscription: Subscription;

  constructor(private speechService: SpeechService,
              private translate: TranslateService) {
  }

  private changeInputLanguage(lang: string): void {
    this.reset();
    this.stopListening();
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
    if (this.recognisedText$.getValue()) {
      this.translateText();
    }
  }

  reset() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
  }

  listen() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
    this.isListening = true;
    this.subscription = this.speechService.listen(this.getSpeakLang(this.inputLang))
      .subscribe(r => {
        this.recognisedText$.next(r);
      }, () => {
        this.isListening = false;
      }, () => {
        this.isListening = false;
        this.translateText();
      });
  }

  stopListening() {
    this.subscription.unsubscribe();
    this.isListening = false;
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
    this.translatedResult$.next({text: ''});
    this.isTranslating = true;
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
          this.isTranslating = false;
          this.translatedResult$.next(translated);
        }),
      ).subscribe(() => {
    });
  }
}

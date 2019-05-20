import { Component } from '@angular/core';
import { SpeechService, TranslationResult } from './speech.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  public recognisedText$ = new BehaviorSubject<string>('');
  public translatedResult$ = new BehaviorSubject<TranslationResult>({text: ''});
  public listening = false;
  public inputLang = 'de';
  public outputLang = 'en';

  private subscription: Subscription;

  constructor(private _speechService: SpeechService) {
    this.recognisedText$
      .pipe(
        filter(rt => rt && rt.length > 0),
        tap(rt => console.debug('# voice recognition: ', rt, this.inputLang, this.outputLang)),
        switchMap(rt => this._speechService.sendToBackend$(rt, this.inputLang, this.outputLang)),
        tap(translated => console.debug('# translation from backend: ', translated)),
        tap((translated: TranslationResult) => this._speechService.speakAnswer(translated.text, this.outputLang)),
      ).subscribe(() => {}, (err) => {
        this.listening = false;
    });
  }

  reset() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
  }

  listen() {
    this.listening = true;
    this.subscription = this._speechService.listen(this.getSpeakLang(this.inputLang))
      .subscribe(r => {
        this.recognisedText$.next(r);
      });
  }

  stopListening() {
    this.subscription.unsubscribe();
    this.listening = false;
  }

  private getSpeakLang(input: string): string {
    switch(input) {
      case 'de':
        return 'de-DE';
      case 'en':
        return 'en-EN';
      case 'hu':
        return 'hu-HU';
    }
  }
}

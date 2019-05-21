import { Component } from '@angular/core';
import { SpeechService, TextAnalysis, TranslationResult } from './speech.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  public recognisedText$ = new BehaviorSubject<string>('');
  public translatedResult$ = new BehaviorSubject<TranslationResult>({text: ''});
  public analyzedText$ = new Observable<TextAnalysis>();
  public listening = false;
  public inputLang = 'en';
  public outputLang = 'de';

  public displayedColumnsEntities: string[] = ['name', 'type'];
  public displayedColumnsTokens: string[] = ['word', 'tag'];

  private subscription: Subscription;

  constructor(private _speechService: SpeechService) {
    this.recognisedText$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        filter(rt => rt && rt.length > 0),
        tap(rt => {
          console.debug('# voice recognition: ', rt);
        }),
        switchMap(rt => this._speechService.sendToBackend$(rt, this.inputLang, this.outputLang)),
        tap(translated => {
          console.debug('# translation from backend: ', translated);
          this.translatedResult$.next(translated);
        }),
        debounceTime(800),
        tap((translated: TranslationResult) => this._speechService.speakAnswer(translated.text, this.outputLang)),
      ).subscribe(() => {
    }, (err) => {
      this.listening = false;
    }, () => {
      this.listening = false;
    });

    this.analyzedText$ = this.recognisedText$
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        filter(rt => rt && rt.length > 0),
        tap(rt => {
          console.debug('# voice recognition: ', rt);
        }),
        switchMap(rt => this._speechService.analyzeText$(rt, this.inputLang)),
      );
  }

  reset() {
    this.recognisedText$.next('');
    this.translatedResult$.next({text: ''});
    this.stopListening();
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
    switch (input) {
      case 'de':
        return 'de-DE';
      case 'en':
        return 'en-EN';
      case 'hu':
        return 'hu-HU';
    }
  }
}

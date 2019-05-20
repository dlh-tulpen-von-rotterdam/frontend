import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpeechService, TranslationResult } from './speech.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnDestroy {
  public recognisedText$ = new BehaviorSubject<string>('');
  public translatedResult$ = new BehaviorSubject<TranslationResult>({text: ''});

  private _destroy$ = new Subject<void>();
  private subscription: Subscription;

  constructor(private _speechService: SpeechService) {
  }

  listen() {
    this.subscription = this._speechService.listen()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(r => {
        this.recognisedText$.next(r);
      });
  }

  stopListening() {
    this.subscription.unsubscribe();
  }

  readAnswer() {
    this._speechService.speakAnswer(this.recognisedText$.getValue(), 'en');
  }

  sendToBackend() {
    this._speechService.sendToBackend$(this.recognisedText$.getValue())
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(t => {
        this.translatedResult$.next(t);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
  }
}

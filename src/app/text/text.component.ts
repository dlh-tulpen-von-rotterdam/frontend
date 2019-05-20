import { Component, OnInit } from '@angular/core';
import { SpeechService, TranslationResult } from './speech.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  private subscription: Subscription;
  public recognisedText$ = new BehaviorSubject<string>('');
  public translatedResult$ = new Observable<TranslationResult>();

  constructor(private _speechService: SpeechService) {
    this._speechService.listen();
  }

  ngOnInit() {
  }

  listen() {
    this.subscription = this._speechService.listen().subscribe(r => {
      this.recognisedText$.next(r);
      console.log(r);
    });
  }

  stopListening() {
    this.subscription.unsubscribe();
  }

  sayHello() {
    this._speechService.sayHello();
  }

  sendToBackend() {
    this.translatedResult$ = this._speechService.sendToBackend(this.recognisedText$.getValue());
  }
}

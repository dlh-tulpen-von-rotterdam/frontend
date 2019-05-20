import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export interface TranslationResult {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private _speechRecognition: any;

  constructor(private _zone: NgZone, private _http: HttpClient) {
  }

  public listen(): Observable<string> {
    return Observable.create(observer => {
      const {webkitSpeechRecognition}: IWindow = window as IWindow;
      this._speechRecognition = new webkitSpeechRecognition();
      this._speechRecognition.continuous = true;
      this._speechRecognition.interimResults = true;
      this._speechRecognition.lang = 'de-DE';
      // this._speechRecognition.maxAlternatives = 1;

      this._speechRecognition.onresult = speech => {
        let term = '';
        if (speech.results) {
          const result = speech.results[speech.resultIndex];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log('Unrecognized result - Please try again');
            } else {
              console.log(`[${transcript}]`);
              term = transcript.trim();
              console.log('Did you said? -> ' + term + ' , If not then say something else...');
            }
          }
        }
        if (term && term.length) {
          this._zone.run(() => {
            observer.next(term);
          });
        }
      };

      this._speechRecognition.onerror = error => {
        console.log('recognition error', error);
        observer.error(error);
      };

      this._speechRecognition.onend = () => {
        console.log('recognition ended');
        observer.complete();
      };

      this._speechRecognition.start();
      console.log('Say something - We are listening !!!');

      return () => {
        console.log('Stopped');
        this._speechRecognition.stop();
      };
    });
  }

  public sayHello() {
    // `` Ich werde dir die Erlaubnis geben, am Halt zeigenden Signal vorbei zu fahrend. Dafür muss du mit eingeschränkter Laufgeschwindigkeit von 40km/h von Kilometer 12300 bis 15200 fahren.`);
    const speechSynth = new SpeechSynthesisUtterance(`Verstanden, Lokführer 37210, du stehst vor Blocksignal B12. Wir können das Signal momentan nicht auf Fahrt stellen wegen eines Vandalismusschadens.`);
    speechSynth.lang = 'de-DE';
    speechSynth.onerror = (err) => {
      console.log('error while speechSynth: ', err);
    };

    window.speechSynthesis.speak(speechSynth);
  }

  public sendToBackend(text: string): Observable<TranslationResult> {
    return this._http.post<TranslationResult>('http://14ddd340.ngrok.io/translate', {inputLanguage: 'de', outputLanguage: 'en', text: text});
  }
}

import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

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

  public listen(inputLang: string): Observable<string> {
    return Observable.create(observer => {
      const {webkitSpeechRecognition}: IWindow = window as IWindow;
      this._speechRecognition = new webkitSpeechRecognition();
      this._speechRecognition.continuous = true;
      this._speechRecognition.interimResults = true;
      this._speechRecognition.lang = inputLang;
      this._speechRecognition.maxAlternatives = 1;

      this._speechRecognition.onresult = speech => {
        let term = '';
        if (speech.results) {
          // console.debug(speech.results);
          const result = speech.results[speech.resultIndex];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log('Unrecognized result - Please try again');
            } else {
              term = transcript.trim();
              console.log('Did you said? -> ' + term + ' , If not then say something else...');
            }
          } else {
            term = transcript.trim();
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
        console.log('recognition ended.');
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

  public speakAnswer(text: string, lang: string): void {
    console.debug(`Got text to say: ${text}`);
    const splitted = text.match(new RegExp('.{1,200}', 'g'));

    splitted.reduce(async (previousPromise, nextText) => {
      await previousPromise;
      return this.speakText(nextText, lang);
    }, Promise.resolve());
  }

  private speakText(text: string, lang: string): Promise<void> {
    console.debug(`Saying: ${text}`);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onerror = (err) => {
      console.log('error while speaking: ', err);
    };
    speechSynthesis.speak(utterance);

    return new Promise(resolve => {
      const id = setInterval(() => {
        if (speechSynthesis.speaking === false) {
          clearInterval(id);
          resolve();
        }
      }, 100);
    });
  }

  public sendToBackend$(text: string, inputLang: string, outputLang: string): Observable<TranslationResult> {
    console.debug('Sending to backend', text);
    return this._http.post<TranslationResult>('http://c78a1994.ngrok.io/translate', {
      inputLanguage: inputLang,
      outputLanguage: outputLang,
      text: text,
    }).pipe(
      tap(res => console.debug(`Response from translation ${res.text}`)),
    );
  }
}

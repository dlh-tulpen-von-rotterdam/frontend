import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export interface TranslationResult {
  inputLanguage?: string;
  outputLanguage?: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private speechRecognition: any;

  constructor(private zone: NgZone, private httpClient: HttpClient) {
  }

  public listen(inputLang: string): Observable<string> {
    return Observable.create(observer => {
      const {webkitSpeechRecognition}: IWindow = window as IWindow;
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = inputLang;
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        let term = '';
        let isFinal = false;
        if (speech.results) {
          // console.debug(speech.results);
          const result = speech.results[speech.resultIndex];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            isFinal = true;
            if (result[0].confidence < 0.3) {
              console.log('Unrecognized result - Please try again');
            } else {
              term = transcript.trim();
              console.log('Did you say? -> ' + term + ' , If not then say something else...');
            }
          } else {
            term = transcript.trim();
          }
        }
        if (term && term.length) {
          this.zone.run(() => {
            observer.next(term);

            if (isFinal) {
              observer.complete();
            }
          });
        }
      };

      this.speechRecognition.onerror = error => {
        console.log('recognition error', error);
        this.zone.run(() => {
          observer.error(error);
        });
      };

      this.speechRecognition.onend = () => {
        console.log('recognition ended.');
        this.zone.run(() => {
          observer.complete();
        });
      };

      this.speechRecognition.start();
      console.log('Say something - We are listening !!!');

      return () => {
        console.log('Stopped');
        this.speechRecognition.stop();
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
    return this.httpClient.post<TranslationResult>('http://localhost:8080/translate', {
      inputLanguage: inputLang,
      outputLanguage: outputLang,
      text: text,
    }).pipe(
      tap(res => console.debug(`Response from translation ${res.text}`)),
    );
  }

  public analyzeText$(text: string, inputLang: string): Observable<TextAnalysis> {
    return this.httpClient.post<TextAnalysis>(
      'https://language.googleapis.com/v1/documents:annotateText?key=AIzaSyAq6olsck9A9TZ0Z2JuugZMt-wp4t5eljs', {
        document: {
          content: text,
          language: inputLang,
          type: 'PLAIN_TEXT',
        },
        features: {
          classifyText: false,
          extractDocumentSentiment: false,
          extractEntities: true,
          extractEntitySentiment: false,
          extractSyntax: true,
        },
      },
    );
  }
}

export interface Text {
  content: string;
  beginOffset: number;
}

export interface Sentence {
  text: Text;
}

export interface Text2 {
  content: string;
  beginOffset: number;
}

export interface PartOfSpeech {
  tag: string;
  aspect: string;
  case: string;
  form: string;
  gender: string;
  mood: string;
  number: string;
  person: string;
  proper: string;
  reciprocity: string;
  tense: string;
  voice: string;
}

export interface DependencyEdge {
  headTokenIndex: number;
  label: string;
}

export interface Token {
  text: Text2;
  partOfSpeech: PartOfSpeech;
  dependencyEdge: DependencyEdge;
  lemma: string;
}

export interface Metadata {
}

export interface Text3 {
  content: string;
  beginOffset: number;
}

export interface Mention {
  text: Text3;
  type: string;
}

export interface Entity {
  name: string;
  type: string;
  metadata: Metadata;
  salience: number;
  mentions: Mention[];
}

export interface DocumentSentiment {
  magnitude: number;
  score: number;
}

export interface TextAnalysis {
  sentences: Sentence[];
  tokens: Token[];
  entities: Entity[];
  documentSentiment: DocumentSentiment;
  language: string;
  categories: any[];
}



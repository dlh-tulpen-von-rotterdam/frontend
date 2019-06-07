import {Component, Input} from '@angular/core';
import {SpeechService} from '../text/speech.service';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent {

  @Input()
  private title: string;

  @Input()
  private content: string;

  @Input()
  private language: string;

  constructor(private speechService: SpeechService) {
  }

  speak() {
    this.speechService.speakAnswer(this.content, this.language);
  }
}

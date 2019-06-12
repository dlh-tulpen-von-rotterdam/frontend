import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SpeechService} from '../text/speech.service';
import {diff_match_patch} from 'diff-match-patch';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnChanges {

  @Input()
  private title: string;

  @Input()
  private content: string;

  @Input()
  private language: string;

  @Input()
  private loading: boolean;

  @Input()
  private diff: string;

  private innerHtml;

  constructor(private speechService: SpeechService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.innerHtml = '';

    if (this.diff) {
      const Diff = new diff_match_patch();
      const diffArr = Diff.diff_main(this.diff, this.content);
      Diff.diff_cleanupSemantic(diffArr);

      diffArr.forEach(value => {
        if (value[0] === 1) {
          this.innerHtml += `<span class="emphasize">${value[1]}</span>`;
        }
        if (value[0] === 0) {
          this.innerHtml += value[1];
        }
      });
    }
  }

  speak() {
    this.speechService.speakAnswer(this.content, this.language);
  }
}

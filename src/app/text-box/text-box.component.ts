import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {

  @Input()
  private title: string;

  @Input()
  private content: string;

  constructor() {
  }

  ngOnInit() {
  }

}

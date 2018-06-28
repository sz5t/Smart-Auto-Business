import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-grid-date-picker',
  templateUrl: './cn-grid-date-picker.component.html',
})
export class CnGridDatePickerComponent implements OnInit {
  @Input() config;
  model;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}

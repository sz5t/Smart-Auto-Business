import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-cn-grid-range-picker',
  templateUrl: './cn-grid-range-picker.component.html',
})
export class CnGridRangePickerComponent implements OnInit {
  @Input() config;
  model;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-cn-grid-time-picker',
  templateUrl: './cn-grid-time-picker.component.html',
})
export class CnGridTimePickerComponent implements OnInit {
  @Input() config;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}

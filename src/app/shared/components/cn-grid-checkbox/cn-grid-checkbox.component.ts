import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-cn-grid-checkbox',
  templateUrl: './cn-grid-checkbox.component.html',
})
export class CnGridCheckboxComponent implements OnInit {
  @Input() config;
  model;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}

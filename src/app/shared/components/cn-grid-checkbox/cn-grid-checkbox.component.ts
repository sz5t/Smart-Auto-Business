import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-cn-grid-checkbox',
  templateUrl: './cn-grid-checkbox.component.html',
})
export class CnGridCheckboxComponent implements OnInit {
    @Input() config;
    @Input() formGroup: FormGroup;
    model;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}

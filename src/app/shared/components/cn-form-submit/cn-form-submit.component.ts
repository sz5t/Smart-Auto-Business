import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-form-submit',
  templateUrl: './cn-form-submit.component.html',
})
export class CnFormSubmitComponent implements OnInit {
  @Input() config;
  @Input() formGroup;
  constructor(
      private http: _HttpClient
  ) { }

  ngOnInit() {
  }

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.formGroup.reset();
    for(const key in this.formGroup.controls){
      this.formGroup.controls[key].markAsPristine();
    }
  }



}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'cn-date-picker',
  templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
  @Input() config;
  formGroup: FormGroup;
  date;
  constructor(
  ) { }

  ngOnInit() {
  }

}

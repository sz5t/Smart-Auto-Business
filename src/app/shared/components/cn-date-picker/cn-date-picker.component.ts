import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'cn-date-picker',
  templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
  @Input() config;
  @Input() value;
  @Output()
  updateValue = new EventEmitter();
  formGroup: FormGroup;
  date;
  constructor(
  ) { }

  ngOnInit() {
  }

  valueChange(name?) {
    const backValue = { name: this.config.name, value: name };
    this.updateValue.emit(backValue);

  }

}

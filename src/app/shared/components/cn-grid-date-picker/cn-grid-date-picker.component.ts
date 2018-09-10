import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-grid-date-picker',
  templateUrl: './cn-grid-date-picker.component.html',
})
export class CnGridDatePickerComponent implements OnInit {
  @Input() config;
    @Input() value;
  @Output() updateValue = new EventEmitter();
    _value;
  constructor(
      private http: _HttpClient
  ) { }

    ngOnInit() {
        if (this.value)
            this._value = this.value.data;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    valueChange(name?) {
        this.value.data = name;
        this.updateValue.emit(this.value);
    }
}

import {Component, Input, OnInit, EventEmitter,Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'cn-grid-input',
  templateUrl: './cn-grid-input.component.html',
})
export class CnGridInputComponent implements OnInit {
    @Input() config;
    @Output() updateValue = new EventEmitter();
    @Input()  value;
    @Input() casadeData;
    _value;
    cascadeSetValue = {};
    constructor(
        private http: _HttpClient
    ) { }
    ngOnInit() {
       // console.log('input' , this.casadeData);
        if (this.value) {
            this._value = this.value.data;
        }
        for (const key in this.casadeData) {
            if (key === 'setValue') {
                this.cascadeSetValue['setValue'] = this.casadeData['setValue'];
                console.log('setValue' , this.casadeData['setValue']);
            }
        }
        if ( this.cascadeSetValue.hasOwnProperty('setValue')) {
            this._value = this.cascadeSetValue['setValue'];
         }
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

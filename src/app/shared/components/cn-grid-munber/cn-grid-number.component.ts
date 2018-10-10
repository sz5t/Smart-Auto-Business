import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'cn-grid-number',
  templateUrl: './cn-grid-number.component.html',
})
export class CnGridNumberComponent implements OnInit {
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
                this.cascadeSetValue['setValue'] = JSON.parse(JSON.stringify(this.casadeData['setValue']));
                delete this.casadeData['setValue'];
               // console.log('setValue' , this.casadeData['setValue']);
            }
        }
        if ( this.cascadeSetValue.hasOwnProperty('setValue')) {
            this._value = this.cascadeSetValue['setValue'];
            this.valueChange(this._value );
            delete this.cascadeSetValue['setValue'];
            // console.log('setValueTO valueChange', this._value );
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

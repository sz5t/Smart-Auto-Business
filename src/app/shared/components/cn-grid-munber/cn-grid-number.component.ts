import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-grid-number',
  templateUrl: './cn-grid-number.component.html',
})
export class CnGridNumberComponent implements OnInit {
    @Input() public config;
    @Output() public updateValue = new EventEmitter();
    @Input()  public value;
    @Input() public casadeData;
    public _value;
    public cascadeSetValue = {};
    constructor(
        private http: _HttpClient
    ) { }
    public ngOnInit() {
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

    public setValue(value) {
       this.value = value;
    }

    public getValue() {
        return this.value;
    }

    public valueChange(name?) {
      this.value.data = name;
      this.updateValue.emit(this.value);
    }

    public formatter = value => {
        if (this.config.beforeFormatter) {
          return `${this.config.beforeFormatter ? this.config.beforeFormatter : ''}${value ? value : ''}`;
        } else if (this.config.afterFormatter) {
          return `${value ? value : ''}${this.config.afterFormatter ? this.config.afterFormatter : ''}`;
        } else {
          return value;
        }
      }
  
      public parser = value => {
        if (this.config.beforeFormatter) {
          return value.replace(this.config.beforeFormatter, '');
        } else if (this.config.afterFormatter) {
          return value.replace(this.config.afterFormatter, '');
        } else {
          return value;
        }
        
      }
  
}

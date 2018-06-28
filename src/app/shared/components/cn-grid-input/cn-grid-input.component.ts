import {Component, Input, OnInit, EventEmitter,Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'cn-grid-input',
  templateUrl: './cn-grid-input.component.html',
})
export class CnGridInputComponent implements OnInit {
    @Input() config;
    @Output() updateValue =new EventEmitter();
    @Input()  value;

    _value;
    constructor(
        private http: _HttpClient
    ) { }
    ngOnInit() {
        if(this.value)
        this._value=this.value.data;
    }

    setValue(value){
       this.value=value;
    }

    getValue(){
        return this.value;
    }

    valueChange(name?){
      this.value.data=name;
      this.updateValue.emit(this.value);
    }
}

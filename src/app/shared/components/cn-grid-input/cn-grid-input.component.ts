import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    selector: 'cn-grid-input,[cn-grid-input]',
    templateUrl: './cn-grid-input.component.html',
})
export class CnGridInputComponent implements OnInit {
    @Input() config;
    @Output() updateValue = new EventEmitter();
    @Input() value;
    @Input() casadeData;
    _value;
    cascadeSetValue = {};
    constructor(
        private http: _HttpClient
    ) { }
    ngOnInit() {
        if (!this.config['disabled']) {
            this.config['disabled'] = false;
        }
        if (!this.config['readonly']) {
            this.config['readonly'] = null;
        }
        if (this.value) {
            this._value = this.value.data;
        }
        for (const key in this.casadeData) {
            if (key === 'setValue') {
                this.cascadeSetValue['setValue'] = JSON.parse(JSON.stringify(this.casadeData['setValue']));
                delete this.casadeData['setValue'];
            }
        }
        if (this.cascadeSetValue.hasOwnProperty('setValue')) {
            this._value = this.cascadeSetValue['setValue'];
            this.valueChange(this._value);
            delete this.cascadeSetValue['setValue'];
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

    onblur(e?, type?) {
        this.assemblyValue();

    }
    onKeyPress(e?, type?) {
        if (e.code === 'Enter') {
            this.assemblyValue();
        }
    }

    // 组装值
    assemblyValue() {
        this.valueChange(this._value); 
    }
}

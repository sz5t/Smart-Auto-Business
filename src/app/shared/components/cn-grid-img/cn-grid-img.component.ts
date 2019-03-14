import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    selector: 'cn-grid-img,[cn-grid-img]',
    templateUrl: './cn-grid-img.component.html',
})
export class CnGridImgComponent implements OnInit {
    @Input() public config;
    @Output() public updateValue = new EventEmitter();
    @Input() public value;
    @Input() public casadeData;
    public _value;
    public bodyStyle = {
        width: '100 %',
        height: '50px'

    };
    public cascadeSetValue = {};
    constructor(
        private http: _HttpClient
    ) { }
    public ngOnInit() {
        if (!this.config['disabled']) {
            this.config['disabled'] = false;
        }
        if (!this.config['readonly']) {
            this.config['readonly'] = null;
        }
        if (this.value) {
            this._value = this.value.data;
            if (this.value) {
                if (this.config.hasOwnProperty('defaultValue')) {
                    this.value = this.config.defaultValue;
                }
            }

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

        // console.log('img::::', this._value);
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

}

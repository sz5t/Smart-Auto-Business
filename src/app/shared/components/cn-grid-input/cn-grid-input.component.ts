import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    selector: 'cn-grid-input,[cn-grid-input]',
    templateUrl: './cn-grid-input.component.html',
})
export class CnGridInputComponent implements OnInit {
    @Input() public config;
    @Output() public updateValue = new EventEmitter();
    @Input() public value;
    @Input() public casadeData;
    @Input()
    public bsnData;
    @Input()
    public rowData;
    public _value;
    public cascadeSetValue = {};
    public Visible = false;
    public message = '当前值不合理';
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
            if (this.value.data === '') {
                this._value = this.config.defaultValue;
                this.value.data = this._value;
                this.updateValue.emit(this.value);
            } else {
                this._value = this.value.data
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
    }

    public setValue(value) {
        this.value = value;
    }

    public getValue() {
        return this.value;
    }

    public valueChange(name?) {
        this.VisibleChange(name);
        this.value.data = name;
        this.updateValue.emit(this.value);
    }

    public onblur(e?, type?) {
        this.assemblyValue();

    }
    public onKeyPress(e?, type?) {
        if (e.code === 'Enter') {
            // this.assemblyValue();
            console.log(e.srcElement);
            e.srcElement.blur();
        }
    }

    // 组装值
    public assemblyValue() {
        this._value = this._value ? this._value.trim() : this._value;
        this.valueChange(this._value);
    }

    // 校验结果
    public VisibleChange(val) {
        //   validations
        // "validations": [
        //     {
        //       "validator": "compare",
        //       "compareValueName":"",
        //       "compareType":"<=",
        //       "errorMessage": "当前值不合理"
        //     }
        //   ]
        if (this.config.validations) {
            this.config.validations.forEach(v => {
                let v2
                if (v.validator === 'compare') {
                    if (this.rowData[v['compareValueName']] !== undefined) {
                        v2 = this.rowData[v['compareValueName']];
                    } else {
                        v2 = this.rowData[v['value']];
                    };
                    const type = v['compareType'];
                    this.message = v['errorMessage'];
                    if (this.valueToValidations(val, v2, type)) {
                        this.Visible = false;
                    } else {
                        this.Visible = true;
                    }
                }
            });
        }
    }


    public valueToValidations(val1, val2, type) {
        let isValidation = false;
        if (type === '>') {
            if (val1 > val2) {
                isValidation = true;
            }
        }
        if (type === '>=') {
            if (val1 >= val2) {
                isValidation = true;
            }
        }
        if (type === '<') {
            if (val1 < val2) {
                isValidation = true;
            }
        }
        if (type === '<=') {
            if (val1 <= val2) {
                isValidation = true;
            }
        }
        if (type === '==') {
            if (val1 === val2) {
                isValidation = true;
            }
        }
        return isValidation;
    }


}

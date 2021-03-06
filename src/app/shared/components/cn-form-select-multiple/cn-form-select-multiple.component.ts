import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
    OnChanges
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'cn-form-select-multiple',
    templateUrl: './cn-form-select-multiple.component.html'
})
export class CnFormSelectMultipleComponent
    implements OnInit, AfterViewInit, OnChanges {
    @Input()
    public config;
    @Input()
    public value;
    @Input()
    public bsnData;
    @Input()
    public rowData;
    @Input()
    public initValue;
    
    @Input()
    public dataSet;
    @Input() public changeConfig;
    public formGroup: FormGroup;
    // @Output() updateValue = new EventEmitter();
    @Output()
    public updateValue = new EventEmitter();
    public _options = [];
    public cascadeValue = {};
    // _selectedMultipleOption:any[];
    constructor(private apiService: ApiService) {}
    public _selectedOption;
    public _clear = true;
    public ngOnInit() {
        if (!this.config['multiple']) {
            this.config['multiple'] = 'default';
        }
        if (this.config['cascadeValue']) {
            // cascadeValue
            for (const key in this.config['cascadeValue']) {
                if (this.config['cascadeValue'].hasOwnProperty(key)) {
                    this.cascadeValue['cascadeValue'] = this.config[
                        'cascadeValue'
                    ][key];
                }
            }
        }
        if (this.changeConfig) {
            if (this.changeConfig['cascadeValue']) {
                // cascadeValue
                for (const key in this.changeConfig['cascadeValue']) {
                    if (this.changeConfig['cascadeValue'].hasOwnProperty(key)) {
                        this.cascadeValue[key] = this.changeConfig['cascadeValue'][key];
                    }
                }
            }
        }

        this._options.length = 0;
        if (this.dataSet) {
            // 加载数据集
            this._options = this.dataSet;
            this.selectedByLoaded();
        } else if (this.config.ajaxConfig) {
            // 异步加载options
            (async () => {
                const result = await this.asyncLoadOptions(
                    this.config.ajaxConfig
                );
                if (this.config.valueType && this.config.valueType === 'list') {
                    const labels = this.config.labelName.split('.');
                    const values = this.config.valueName.split('.');
                    result.data.forEach(d => {
                        d[this.config.valueName].forEach(v => {
                            this._options.push({
                                label: v.ParameterName,
                                value: v.ParameterName
                            });
                        });
                    });
                } else {
                    result.data.forEach(d => {
                        this._options.push({
                            label: d[this.config.labelName],
                            value: d[this.config.valueName]
                        });
                    });
                }
                this.selectedByLoaded();
            })();
        } else {
            // 加载固定数据
            this._options = this.config.options;
            this.selectedByLoaded();
        }
        // 未知是否有错误
        if (!this.value && this.value !== 0) {
            if (this.formGroup.value[this.config.name]) {
                this.value = this.formGroup.value[this.config.name];
            } else {
                if (this.config.hasOwnProperty('defaultValue')) {
                    this.value = this.config.defaultValue;
                } else {
                    if (this._options.length > 0 ) {
                        this.value = this._options[0].value;
                    }
                }
            }
        }
        if (this.config.removalable) {
            this._clear = false;
        }
    }

    public ngOnChanges() {

    }
    public ngAfterViewInit() {}

    public async asyncLoadOptions(p?, componentValue?, type?) {
        const params = {};
        let tag = true;
        let url;
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this.bsnData[param.valueName]) {
                                params[param.name] = this.bsnData[
                                    param.valueName
                                ];
                            } else {

                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    } else {
                        if (this.bsnData && this.bsnData[param.valueName]) {
                            // liu 参数非空判断
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    }
                } else if (param.type === 'value') {
                    params[param.name] = param.value;
                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue[param.valueName];
                } else if (param.type === 'cascadeValue') {
                    params[param.name] = this.cascadeValue[param.valueName];
                } else if (param.type === 'initValue') {
                    params[param.name] = this.initValue[param.valueName];
                }
            });
            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = 'null';
                p.url.params.forEach(param => {
                    if (param['type'] === 'value') {
                        pc = param.value;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue[param.valueName];
                    } else if (param.type === 'tempValue') {
                        pc = this.bsnData[param.valueName];
                    }
                });

                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'get' && tag) {

            /*  const dd=await this._http.getProj(APIResource[p.url], params).toPromise();
       if (dd && dd.Status === 200) {
     
       }
      */

            return this.apiService.get(url, params).toPromise();
        }

    }

    public selectedByLoaded() {
        let selected;
        if (!this.value) {
            this.value = this.config.defaultValue;
        }
        if (this.value && this.value.data) {
            this._options.forEach(element => {
                if (element.value === this.value.data) {
                    selected = element;
                }
            });
        } else {
            this._options.forEach(element => {
                if (element.value === this.config.defaultValue) {
                    selected = element;
                }
            });
        }

        this._selectedOption = selected;
    }

    public valueChange(name?) {
        let ArrayValue = '';
        name && name.forEach(element => {
            ArrayValue = ArrayValue + element.toString() + ',';
        });
        const dataItemobj = {value: ArrayValue};
        if (name) {
           
            const backValue = { name: this.config.name, value: name, dataItem: dataItemobj };
            this.updateValue.emit(backValue);
        } else {
            const backValue = { name: this.config.name, value: name, dataItem: dataItemobj  };
            this.updateValue.emit(backValue);
        }
    }

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}

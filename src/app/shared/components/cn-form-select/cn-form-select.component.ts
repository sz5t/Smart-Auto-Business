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
import { CacheService } from '@delon/cache';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-form-select',
    templateUrl: './cn-form-select.component.html'
})
export class CnFormSelectComponent implements OnInit, AfterViewInit, OnChanges {
    @Input()
    public config;
    @Input()
    public value;
    @Input()
    public bsnData;
    @Input()
    public rowData;
    @Input()
    public dataSet;
    @Input()
    public initValue;
    @Input()
    private changeConfig;
    public formGroup: FormGroup;
    // @Output() updateValue = new EventEmitter();
    @Output()
    public updateValue = new EventEmitter();
    public _options = [];
    private cascadeValue = {};
    private resultData;
    public cacheValue;
    // _selectedMultipleOption:any[];
    constructor(private apiService: ApiService, private cacheService: CacheService) {
        this.cacheValue = this.cacheService;
    }
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
                    this.cascadeValue[key] = this.config['cascadeValue'][key];
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
            setTimeout(() => {
                this.load();
            });
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

    public async load() {
        const result = await this.asyncLoadOptions(
            this.config.ajaxConfig,
            this.formGroup.value
        );
        this.resultData = result;
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
            if (result.data && result.data.length > 0) {
                result.data.forEach(d => {
                    this._options.push({
                        label: d[this.config.labelName],
                        value: d[this.config.valueName]
                    });
                });
            }
            
        }

        this.selectedByLoaded();
    }

    public ngOnChanges() {

    }
    public ngAfterViewInit() { }

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
                                //  params[param.name] = this.bsnData[param.valueName ];
                                if (param['datatype']) {
                                    params[param.name] = this.getParameters(param['datatype'], this.bsnData[param.valueName]);
                                } else {
                                    params[param.name] = this.bsnData[param.valueName];
                                }
                            } else {
                                tag = false;
                                return;
                            }
                        } else {
                            //  params[param.name] = this.bsnData[param.valueName];
                            if (param['datatype']) {
                                params[param.name] = this.getParameters(param['datatype'], this.bsnData[param.valueName]);
                            } else {
                                params[param.name] = this.bsnData[param.valueName];
                            }
                        }
                    } else {
                        if (this.bsnData && this.bsnData[param.valueName]) {
                            // liu 参数非空判断
                            //  params[param.name] = this.bsnData[param.valueName];
                            if (param['datatype']) {
                                params[param.name] = this.getParameters(param['datatype'], this.bsnData[param.valueName]);
                            } else {
                                params[param.name] = this.bsnData[param.valueName];
                            }
                        }
                    }
                } else if (param.type === 'value') {
                    //  params[param.name] = param.value;
                    if (param['datatype']) {
                        params[param.name] = this.getParameters(param['datatype'], param.value);
                    } else {
                        params[param.name] = param.value;
                    }
                } else if (param.type === 'componentValue') {
                    // params[param.name] = componentValue[param.valueName];
                    if (param['datatype']) {
                        params[param.name] = this.getParameters(param['datatype'], componentValue[param.valueName]);
                    } else {
                        params[param.name] = componentValue[param.valueName];
                    }
                } else if (param.type === 'cascadeValue') {
                    // params[param.name] = this.cascadeValue[param.valueName];
                    if (param['datatype']) {
                        params[param.name] = this.getParameters(param['datatype'], this.cascadeValue[param.valueName]);
                    } else {
                        params[param.name] = this.cascadeValue[param.valueName];
                    }
                } else if (param.type === 'initValue') {
                    // params[param.name] = this.initValue[param.valueName];
                    if (param['datatype']) {
                        params[param.name] = this.getParameters(param['datatype'], this.initValue[param.valueName]);
                    } else {
                        params[param.name] = this.initValue[param.valueName];
                    }
                } else if (param.type === 'cacheValue') {

                    const cache = this.cacheValue.getNone('userInfo');
                    if (param['datatype']) {
                        params[param.name] = this.getParameters(param['datatype'], cache[param['valueName']]);
                    } else {
                        params[param.name] = cache[param['valueName']];
                    }
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
        if (this.value) {
            this._options.forEach(element => {
                if (element.value === this.value) {
                    selected = element;
                }
            });
        } else {
            if (this.config.defaultValue) {
                this._options.forEach(element => {
                    if (element.value === this.config.defaultValue) {
                        selected = element;
                    }
                });
            } else {
                selected = this._options[0];
            }
            
        }

        this._selectedOption = selected;
    }

    public async valueChange(name?) {
        // if (name) {
        //   const backValue = { name: this.config.name, value: name };
        //   this.updateValue.emit(backValue);
        // } else {
        //   const backValue = { name: this.config.name, value: name };
        //   this.updateValue.emit(backValue);
        // }
        if (name || name === 0) {
            const backValue = { name: this.config.name, value: name };
            if (this.resultData) {

                const index = this.resultData.data.findIndex(
                    item => item[this.config['valueName']] === name
                );
                this.resultData.data &&
                    (backValue['dataItem'] = this.resultData.data[index]);
            } else {
                if (this.config.ajaxConfig) {
                    const result = await this.asyncLoadOptions(
                        this.config.ajaxConfig,
                        this.formGroup.value
                    );
                    const index = result.data.findIndex(
                        item => item[this.config['valueName']] === name
                    );
                    if (index > -1) {
                        result.data &&
                            (backValue['dataItem'] = result.data[index]);
                    }
                }

            }
            this.updateValue.emit(backValue);
        } else {
            const backValue = { name: this.config.name, value: name };
            this.updateValue.emit(backValue);
        }
    }

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    // liu 20181213  参数简析[可适配后台多条件查询]
    public getParameters(datatype?, inputValue?) {
        let strQ = '';
        if (!inputValue) {
            // return strQ;
        }
        switch (datatype) {
            case 'eq': // =
                strQ = strQ + 'eq(' + inputValue + ')';
                break;
            case 'neq': // !=
                strQ = strQ + '!eq(' + inputValue + ')';
                break;
            case 'ctn': // like
                strQ = strQ + 'ctn(\'%' + inputValue + '%\')';
                break;
            case 'nctn': // not like
                strQ = strQ + '!ctn(\'%' + inputValue + '%\')';
                break;
            case 'in': // in  如果是input 是这样取值，其他则是多选取值
                strQ = strQ + 'in(' + inputValue + ')';
                break;
            case 'nin': // not in  如果是input 是这样取值，其他则是多选取值
                strQ = strQ + '!in(' + inputValue + ')';
                break;
            case 'btn': // between  
                strQ = strQ + 'btn(' + inputValue + ')';
                break;
            case 'ge': // >=  
                strQ = strQ + 'ge(' + inputValue + ')';
                break;
            case 'gt': // >  
                strQ = strQ + 'gt(' + inputValue + ')';
                break;
            case 'le': // <=  
                strQ = strQ + 'le(' + inputValue + ')';
                break;
            case 'lt': // <  
                strQ = strQ + 'lt(' + inputValue + ')';
                break;
            default:
                strQ = inputValue;
                break;
        }

        if (!inputValue) {
            strQ = null;
        }

        return strQ;
    }
}

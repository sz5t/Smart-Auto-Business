import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    AfterViewInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-grid-select-multiple',
    templateUrl: './cn-grid-select-multiple.component.html'
})
export class CnGridSelectMultipleComponent implements OnInit, AfterViewInit, OnChanges {
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
    public casadeData;
    @Output()
    private updateValue = new EventEmitter();
    public _options = [];
    public _selectedOption;
    private resultData;
    private cascadeValue = {};
    private cascadeSetValue = {};
    public _clear = true;
    // _selectedMultipleOption:any[];
    constructor(private apiService: ApiService) { }

    public async ngOnInit() {
        if (this.casadeData) {
            for (const key in this.casadeData) {
                // 临时变量的整理
                if (key === 'cascadeValue') {
                    for (const casekey in this.casadeData['cascadeValue']) {
                        if (
                            this.casadeData['cascadeValue'].hasOwnProperty(
                                casekey
                            )
                        ) {
                            this.cascadeValue[casekey] = this.casadeData[
                                'cascadeValue'
                            ][casekey];
                        }
                    }
                } else if (key === 'options') {
                    // 目前版本，静态数据集 优先级低
                    this.config.options = this.casadeData['options'];
                } else if (key === 'setValue') {
                    this.cascadeSetValue['setValue'] = JSON.parse(
                        JSON.stringify(this.casadeData['setValue'])
                    );
                    delete this.casadeData['setValue'];
                }
            }
        }
        if (this.dataSet) {
            // 加载数据集
            this._options = this.dataSet;
        } else if (this.config.ajaxConfig) {
            // 异步加载options
            //  (async() => {
            this.resultData = await this.asyncLoadOptions(
                this.config.ajaxConfig
            );
            if (this.config.valueType && this.config.valueType === 'list') {
                const labels = this.config.labelName.split('.');
                const values = this.config.valueName.split('.');
                this.resultData.data.forEach(d => {
                    d[this.config.valueName].forEach(v => {
                        this._options.push({
                            label: v.ParameterName,
                            value: v.ParameterName
                        });
                    });
                });
            } else {
                if (this.resultData) {
                    this.resultData.data.forEach(d => {
                        this._options.push({
                            label: d[this.config.labelName],
                            value: d[this.config.valueName]
                        });
                    });
                } else {
                    this._options = [];
                }
            }
            // })();

        } else {
            // 加载固定数据
            this._options = this.config.options;
        }

        //  this.selectedByLoaded(); // liu 20181221多选级联不能赋值
        // if (this.cascadeSetValue.hasOwnProperty('setValue')) {
        //     this.selectedBycascade();
        // } else {
        //     this.selectedByLoaded();
        // }

        if (this.value) {
            if (this.value.data !== undefined) {
                this._selectedOption = this.getSetComponentValue(this.value.data);
            }
        }
        if (this.config.removalable) {
            this._clear = false;
        }
    }

    public ngAfterViewInit() { }
    // casadeData
    public ngOnChanges() {

    }
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
                    if (this.cascadeValue[param.valueName]) {
                        params[param.name] = this.cascadeValue[param.valueName];
                    } else {
                        tag = false;
                        return null;
                    }
                    // params[param.name] = this.cascadeValue[param.valueName];
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
                    } else if (param.type === 'cascadeValue') {
                        pc = this.cascadeValue[param.valueName];
                    }
                });

                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }

        if (p.ajaxType === 'get' && tag) {

            return this.apiService.get(url, params).toPromise();
        } else if (p.ajaxType === 'put') {

            return this.apiService.put(url, params).toPromise();
        } else if (p.ajaxType === 'post') {

            return this.apiService.post(url, params).toPromise();
        } else {
            return null;
        }
    }
    // 级联赋值
    public selectedBycascade() {
        let selected;
        this._options.forEach(element => {
            if (element.value === this.cascadeSetValue['setValue']) {
                selected = element;
                delete this.cascadeSetValue['setValue'];
            }
        });

        this._selectedOption = selected;
        this.valueChange(this._selectedOption);
    }
    public selectedByLoaded() {
        let selected;
        if (this.value && this.value['data'] !== undefined || this.value['data'] === 0) {
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

        if (this._selectedOption) {
            this.valueChange(this._selectedOption);
        }
    }

    public valueChange(name?) {
        // 使用当前rowData['Id'] 作为当前编辑行的唯一标识
        // 所有接收数据的组件都已自己当前行为标识进行数据及联
        // dataItem

        if (name) {
            const c_value = this.getComponentValue(name);
            this.value.data = c_value;
            // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联

            this.updateValue.emit(this.value);
        } else {
            this.value.data = null;
            this.updateValue.emit(this.value);
        }
    }

    public getComponentValue(name?) {
        let labels = '';
        let values = '';
        if (name) {

            name.forEach(element => {
                labels = labels + element.label + ',';
                values = values + element.value + ',';
            });

            if (values.length > 0) {
                values = values.substring(0, values.length - 1);
            }
        }
        return values;
    }

    public getSetComponentValue(data?) {
        let ArrayValue = [];
        const c_value = [];
        if (data) {
            if (data.length > 0) {
                ArrayValue = data.split(',');
            }
        }
        ArrayValue.forEach(element => {
            const index = this._options.findIndex(
                item => item['value'] === element
            );
            if (index > -1) {
                c_value.push(this._options[index]);
            }
        });
        return c_value;
    }

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}

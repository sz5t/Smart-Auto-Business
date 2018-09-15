import {Component, Input, OnInit, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';

@Component({
    selector: 'cn-grid-select',
    templateUrl: './cn-grid-select.component.html',
})
export class CnGridSelectComponent implements OnInit , AfterViewInit {
    @Input() config;
    @Input() value;
    @Input() bsnData;
    @Input() rowData;
    @Input() dataSet;
    @Output() updateValue = new EventEmitter();
    _options = [];
    _selectedOption;
    resultData;
    // _selectedMultipleOption:any[];
    constructor(private apiService: ApiService) {
    }

    async ngOnInit() {
        if (this.dataSet) {
            // 加载数据集
            this._options = this.dataSet;
        } else if (this.config.ajaxConfig) {
            // 异步加载options
            this.resultData = await this.asyncLoadOptions(this.config.ajaxConfig);
            if (this.config.valueType && this.config.valueType === 'list') {
                const labels = this.config.labelName.split('.');
                const values = this.config.valueName.split('.');
                this.resultData.data.forEach(d => {
                    d[this.config.valueName].forEach(v => {
                        this._options.push({label: v.ParameterName, value: v.ParameterName});
                    });
                });
            } else {
                this.resultData.data.forEach(d => {
                    this._options.push({'label': d[this.config.labelName], 'value': d[this.config.valueName]});
                });
            }
        } else {
            // 加载固定数据
            this._options = this.config.options;
        }
        this.selectedByLoaded();
    }

    ngAfterViewInit() {

    }

    async asyncLoadOptions(p?, componentValue?, type?) {
        const params = {};
        let tag = true;
        let url;
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this.bsnData[param.valueName]) {
                                params[param.name] = this.bsnData[param.valueName];
                            } else {
                                // console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    } else {
                        if (this.bsnData && this.bsnData[param.valueName]) { // liu 参数非空判断
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    }

                } else if (param.type === 'value') {

                    params[param.name] = param.value;

                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue[param.valueName];
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
             console.log("服务器返回执行成功返回",dd.Data);
             }
             console.log("服务器返回",dd); */

            return this.apiService.getProj(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            // console.log('put参数', params);
            return this.apiService.putProj(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            // console.log('post参数', params);
            return this.apiService.postProj(url, params).toPromise();
        } else {
            return null;
        }
    }

    selectedByLoaded() {
        let selected;
        if (this.value && this.value.data) {
            this._options.forEach(element => {
                if (element.value === this.value.data) {
                    selected = element;
                }
            });

        } else {
            this._options.forEach((element => {
                if(element.value === this.config.defaultValue) {
                    selected = element;
                }
            }));
        }
        this._selectedOption = selected;
        this.valueChange(this._selectedOption);
    }

    valueChange(name?) {
        // 使用当前rowData['Id'] 作为当前编辑行的唯一标识
        // 所有接收数据的组件都已自己当前行为标识进行数据及联
        if (name) {
            this.value.data = name.value;
            // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
            if(this.resultData) {
                const index = this.resultData.data.findIndex(item => item['Id'] === name.value);
                this.resultData.data && (this.value['dataItem'] = this.resultData.data[index]);
            }
            this.updateValue.emit(this.value);
        } else {
            this.value.data = null;
            this.updateValue.emit(this.value);
        }

    }

    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import {CommonTools} from "@core/utility/common-tools";
import {NzTreeNode} from "ng-zorro-antd";

@Component({
    selector: 'cn-grid-select-tree',
    templateUrl: './cn-grid-select-tree.component.html',
})
export class CnGridSelectTreeComponent implements OnInit {
    @Input() config;
    @Input() value;
    @Input() bsnData;
    @Input() rowData;
    @Input() dataSet;
    @Output() updateValue = new EventEmitter();
    _selectedValue;
    treeData = [];
    _tempValue = {};
    constructor(
        private apiService: ApiService
    ) { }
    _selectedMultipleOption;

    async ngOnInit() {
        if (this.dataSet) {
            // 加载数据集
            this.treeData = this.dataSet;
        } else if (this.config.ajaxConfig) {
            // 异步加载options
            this.loadTreeData();
        } else {
            // 加载固定数据
            this.treeData = this.config.options;
        }
        this._selectedValue = this.value['data'];
        // this.selectedByLoaded();
    }

    loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            if (data.data && data.status === 200 && data.isSuccess) {
                const TotreeBefore = data.data;
                TotreeBefore.forEach(d => {
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            d[col['field']] = d[col['valueName']];
                        });
                    }
                });

                let parent = null;
                // 解析出 parentid ,一次性加载目前只考虑一个值
                if (this.config.parent) {
                    this.config.parent.forEach(param => {
                        if (param.type === 'tempValue') {
                            parent = this._tempValue[param.valueName];

                        } else if (param.type === 'value') {
                            if (param.value === 'null') {
                                param.value = null;
                            }
                            parent = param.value;

                        } else if (param.type === 'GUID') {
                            const fieldIdentity = CommonTools.uuID(10);
                            parent = fieldIdentity;
                        }
                    });
                }
                // const result = [new NzTreeNode({
                //     title: '根节点',
                //     key: 'null',
                //     isLeaf: false,
                //     children: []
                // })];

                // result[0].children.push(...);
                this.treeData = this.listToAsyncTreeData(TotreeBefore, parent);
            }


        })();
    }

    async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, 'load');
    }

    async execAjax(p?, componentValue?, type?) {
        const params = {
        };
        let url;
        let tag = true;
        /*  if (!this._tempValue)  {
         this._tempValue = {};
         } */
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this._tempValue[param.valueName]) {
                                params[param.name] = this._tempValue[param.valueName];
                            } else {
                                // console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this._tempValue[param.valueName];
                        }
                    } else {
                        params[param.name] = this._tempValue[param.valueName];
                    }
                } else if (param.type === 'value') {

                    params[param.name] = param.value;

                } else if (param.type === 'GUID') {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue;
                }
            });
            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = 'null';
                p.url.params.forEach(param => {
                    if (param['type'] === 'value') {
                        pc = param.value;
                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue.value;
                    } else if (param.type === 'tempValue') {
                        pc = this._tempValue[param.valueName];
                    }
                });
                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'get' && tag) {
            return this.apiService.get(url, params).toPromise();
        }
    }

    listToAsyncTreeData(data, parentid): NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                temp = this.listToAsyncTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                    data[i]['isLeaf'] = false;
                } else {
                    data[i]['isLeaf'] = false;
                }
                data[i].level = '';
                result.push(new NzTreeNode(data[i]));
            }
        }
        return result;
    }


    valueChange(val?: NzTreeNode) {
        if (val) {
            this.value.data = val;
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

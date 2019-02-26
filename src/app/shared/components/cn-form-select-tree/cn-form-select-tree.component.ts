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
import { NzTreeNode } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-form-select-tree',
    templateUrl: './cn-form-select-tree.component.html'
})
export class CnFormSelectTreeComponent implements OnInit {
    public formGroup: FormGroup;
    @Input()
    public value;
    @Input()
    public config;
    @Input()
    public bsnData;
    @Output() public updateValue = new EventEmitter();
    @Input() public dataSet;
    @Input() public casadeData;
    @Input() public initValue;
    @Input() public changeConfig;
    public treeData;
    public treeDatalist = [];
    public _tempValue = {};
    public checkedKeys = [];
    public selectedKeys = [];
    public cascadeValue = {};
    public selfEvent = {
        clickNode: [],
        expandNode: [],
        load: []
    };
    public cascadeSetValue = {};
    // value;
    public _selectedValue;
    public treecolumns = {};
    constructor(private _http: ApiService) { }

    public ngOnInit() {
        if (this.config.columns) {
            this.config.columns.forEach(element => {
                this.treecolumns[element.field] = element.valueName;
            });
        }
        if (!this.config['multiple']) {
            this.config['multiple'] = false;
        }
        if (!this.config['Checkable']) {
            this.config['Checkable'] = false;
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
        this.loadTreeData();
        if (this.cascadeSetValue.hasOwnProperty('setValue')) {
            this._selectedValue = this.cascadeSetValue['setValue'];
            delete this.cascadeSetValue['setValue'];
        } else {
            if (this.formGroup.value[this.config.name]) {
                this._selectedValue = this.formGroup.value[this.config.name];
            } else {
                if (this.config.hasOwnProperty('defaultValue')) {
                    this._selectedValue = this.config.defaultValue;
                }
            }
        }

    }

    public async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, 'load');
    }

    public loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            if (data) {
                if (data.data && data.status === 200 && data.isSuccess) {
                    const TotreeBefore = data.data;
                    this.treeDatalist = data.data;
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
                                parent = this.bsnData[param.valueName];
                            } else if (param.type === 'value') {
                                if (param.value === 'null') {
                                    param.value = null;
                                }
                                parent = param.value;
                            } else if (param.type === 'GUID') {
                                const fieldIdentity = CommonTools.uuID(10);
                                parent = fieldIdentity;
                            } else if (param.type === 'cascadeValue') {
                                parent = this.cascadeValue[param.valueName];
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
                    this.treeData = this.listToAsyncTreeData(
                        TotreeBefore,
                        parent
                    );
                }
            }
        })();
    }

    public listToAsyncTreeData(data, parentid): NzTreeNode[] {
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

    public async execAjax(p?, componentValue?, type?) {
        const params = {};
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
                            if (this.bsnData[param.valueName]) {
                                // params[param.name] = this._tempValue[param.valueName];
                                params[param.name] = this.bsnData[
                                    param.valueName
                                ];
                            } else {
                                tag = false;
                                return;
                            }
                        } else {
                            //  params[param.name] = this._tempValue[param.valueName];
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    } else {
                        // params[param.name] = this._tempValue[param.valueName];
                        params[param.name] = this.bsnData[param.valueName];
                    }
                } else if (param.type === 'value') {
                    params[param.name] = param.value;
                } else if (param.type === 'GUID') {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === 'componentValue') {
                    params[param.name] = componentValue;
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
                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue.value;
                    } else if (param.type === 'tempValue') {
                        // pc = this._tempValue[param.valueName];
                        pc = this.bsnData[param.valueName];
                    }
                });
                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }

        if (p.ajaxType === 'get' && tag) {
            return this._http.get(url, params).toPromise();
        }
    }

    public onMouseAction(actionName, $event) {
        this[actionName]($event);
    }

    public onChange($event: NzTreeNode) {
        this.value = $event;
        // 表单树和列表不一致
        // let tkey = 'key';
        // if (this.treecolumns['key']) {
        //     tkey = this.treecolumns['key'];
        // }
    }

    public valueChange(val?: NzTreeNode) {
        if (val) {
            const backValue = { name: this.config.name, value: val };
            if (this.treeDatalist) {
                let tkey = 'key';
                if (this.treecolumns['key']) {
                    tkey = this.treecolumns['key'];
                }
                const index = this.treeDatalist.findIndex(item => item[tkey] === val);
                this.treeDatalist && (backValue['dataItem'] = this.treeDatalist[index]);
            }
            this.updateValue.emit(backValue);
        } else {
            const backValue = { name: this.config.name, value: null };
            this.updateValue.emit(backValue);
        }

    }
    public expandNode = e => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                const s = await Promise.all(
                    this.config.expand
                        .filter(p => p.type === e.node.isLeaf)
                        .map(async expand => {
                            const data = await this.execAjax(
                                expand.ajaxConfig,
                                e.node.key,
                                'load'
                            );
                            if (data.data.length > 0 && data.status === 200) {
                                data.data.forEach(item => {
                                    item['isLeaf'] = false;
                                    item['children'] = [];
                                    if (this.config.columns) {
                                        this.config.columns.forEach(col => {
                                            item[col['field']] =
                                                item[col['valueName']];
                                        });
                                    }
                                });
                                e.node.addChildren(data.data);
                            }
                        })
                );
            }
        })();
    };

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}

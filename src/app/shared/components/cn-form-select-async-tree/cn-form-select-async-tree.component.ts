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
import { NzTreeNode, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';
import { GridBase } from '@shared/business/grid.base';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'cn-form-select-async-tree',
  templateUrl: './cn-form-select-async-tree.component.html',
  styleUrls: ['./cn-form-select-async-tree.component.css']
})
export class CnFormSelectAsyncTreeComponent extends GridBase implements OnInit {
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
    public treeData: NzTreeNode[] = [];
    public treeDatalist = [];
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
    constructor(
        private _http: ApiService,
        private _cacheService: CacheService,
        private _msg: NzMessageService,
    ) { 
        super();
        this.apiResource = this._http;
        this.baseMessage = this._msg;
    }

    public ngOnInit() {
        this.tempValue = this.bsnData ? this.bsnData : {};
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

        if (this.config.asyncData) {
            this.loadAsyncTreeData();
        } else {
            this.loadTreeData();
        }
        
        
        
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


    private async _execute(url, method, body) {
        return this._http[method](url, body).toPromise();
    }

    public async getAsyncTreeData(ajaxConfig = null, nodeValue = null) {
        const params = CommonTools.parametersResolver({
            params: ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue,
            item: nodeValue
        });
        const ajaxData = await this._execute(
            ajaxConfig.url,
            'get',
            params
        );
        return ajaxData;
    } 

    // 异步加载数据,一次加载一层节点, 普通异步配置加载
    public loadAsyncTreeData() {
        (async () => {
            const result = await this.getAsyncTreeData(this.config.ajaxConfig);
            const toTreeBefore: NzTreeNode[] = []
            if (result.isSuccess) {
                result.data.forEach(d => {
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            d[col['field']] = d[col['valueName']];
                        });
                    }
                    toTreeBefore.push(d); 
                });
            }
            this.treeData = toTreeBefore;
        })();
    }

    // 同步加载数据一次性加载所有节点, 递归加载数据
    public loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData(this.config.ajaxConfig);
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

                this.treeData = this.listToTreeData(
                    TotreeBefore,
                    parent
                );
                // const result = [new NzTreeNode({
                //     title: '根节点',
                //     key: 'null',
                //     isLeaf: false,
                //     children: []
                // })];
                // result[0].children.push(...);
                
                // this.treeData = CommonTools.deepCopy(this.treeData);
            }
        })();
    }

    private listToTreeAsyncData(data, parentid){

    }

    public listToTreeData(data, parentid): NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                temp = this.listToTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                    data[i]['isLeaf'] = false;
                } else {
                    data[i]['isLeaf'] = true;
                }
                data[i].level = '';
                // result.addChildren(new NzTreeNode(data[i]))
                 result.push(new NzTreeNode(data[i]));
            }
        }
        return result;
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
        if (e.node.isExpanded) {
            (async () => {
                    const s = await Promise.all(
                        this.config.expand
                            .filter(p => p.type === e.node.isLeaf)
                            .map(async expand => {
                                const data = await this.getAsyncTreeData(expand.ajaxConfig, e.node);
                                if (data.isSuccess && data.data.length > 0) {
                                    // this.toTree.push(
                                    //     ...JSON.parse(JSON.stringify(data.data))
                                    // );
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
                                } else {
                                    e.node.addChildren([]);
                                    e.node.setExpanded(false);
                                }

                            })
                    );
            })();
        } else if (e.node.isExpanded === false) {
            e.node.clearChildren();
        }
    };

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}


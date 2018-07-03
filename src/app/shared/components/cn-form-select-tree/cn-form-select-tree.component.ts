import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { FormGroup } from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'cn-form-select-tree',
  templateUrl: './cn-form-select-tree.component.html',
})
export class CnFormSelectTreeComponent implements OnInit {
  formGroup: FormGroup;

  @Input() config;
    treeData;
    _tempValue = {};
    checkedKeys = [];
    selectedKeys = [];
    selfEvent = {
        clickNode: [],
        expandNode: [],
        load: []
    };
    value;
    constructor(
        private _http: ApiService
    ) {
    }

    ngOnInit() {
      this.loadTreeData();
    }

    async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, 'load');
    }


    loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            if (data.data && data.status === 200) {
                const TotreeBefore = data.data;
                TotreeBefore.forEach(d => {
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            d[col['field']] = d[col['valueName']];
                        });
                    }
                });
                let parent = '';
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
                console.log(TotreeBefore);
                this.treeData = this.listToAsyncTreeData(TotreeBefore, parent);
                console.log('---------------------', this.treeData);
            }


        })();
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
            return this._http.get(url, params).toPromise();
        }
    }

    onMouseAction(actionName, $event) {
        this[actionName]($event);
    }

    onChange($event: NzTreeNode) {
      this.value = $event;
    }


    expandNode = (e) => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                
                const s = await Promise.all(this.config.expand
                .filter(p => p.type === e.node.isLeaf)
                .map(async expand => {
                    const  data =  await this.execAjax(expand.ajaxConfig, e.node.key, 'load');
                    if (data.data.length > 0 && data.status === 200) {
                    data.data.forEach(item => {
                        item['isLeaf'] = false;
                        item['children'] = [];
                        if (this.config.columns) {
                            this.config.columns.forEach(col => {
                                item[col['field']] = item[col['valueName']];
                            });
                        }
                    });
                    e.node.addChildren(data.data);
                }
                })); 
            }
        })();
    }

    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
  
}

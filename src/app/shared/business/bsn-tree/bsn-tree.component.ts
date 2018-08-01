import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE } from '@core/relative-Service/BsnTableStatus';
import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { APIResource } from '@core/utility/api-resource';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { Observer ,  Observable ,  Subscription } from 'rxjs';
@Component({
    selector: 'cn-bsn-tree',
    templateUrl: './bsn-tree.component.html',
})
export class CnBsnTreeComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() config;
    treeData;
    _relativeResolver;
    _tempValue = {};
    checkedKeys = [];
    selectedKeys = [];
    selfEvent = {
        clickNode: [],
        expandNode: [],
        load: []
    };
    _clickedNode: any;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    constructor(
        private _http: ApiService,
        private _messageService: RelativeService,
        @Inject(BSN_COMPONENT_MODES) private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngOnInit() {
        // if (this.config.relations) {
        //     this._relativeResolver = new RelativeResolver();
        //     this._relativeResolver.reference = this;
        //     this._relativeResolver.relativeService = this._messageService;
        //     this._relativeResolver.initParameter = [this.loadTreeData];
        //     this._relativeResolver.initParameterEvents = [this.loadTreeData];
        //     this._relativeResolver.relations = this.config.relations;
        //     this._relativeResolver.resolverRelation();
        //     this._tempValue = this._relativeResolver. _tempParameter;
        // }
        
        this._statusSubscription = this.eventStatus.subscribe(updateStatus => {
            if (this.config.viewId = updateStatus._viewId) {
                const option = updateStatus.option;
                switch (updateStatus._mode) {
                    case BSN_COMPONENT_MODES.ADD_NODE:
                    break;
                    case BSN_COMPONENT_MODES.DELETE_NODE:
                    break;
                    case BSN_COMPONENT_MODES.EDIT_NODE:
                    break;
                    case BSN_COMPONENT_MODES.SAVE:
                    break;
                    case BSN_COMPONENT_MODES.FORM:
                    break;
                    case BSN_COMPONENT_MODES.DIALOG:
                    break;
                    case BSN_COMPONENT_MODES.WINDOW:
                    break;
                }
            }
        });
     
        if (this.config.componentType && this.config.componentType.parent === true) {
            this.after(this, 'clickNode', () => {
                this._clickedNode && this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                        this.config.viewId,
                        {
                            data: this._clickedNode
                        }
                    )
                );
            });
        }

        if (this.config.componentType && this.config.componentType.child === true) {
            this._statusSubscription =  this.cascadeEvents.subscribe(cascadeEvent => {
                if (this.config.relations && this.config.relations.length > 0) {
                    this.config.relations.forEach(relation => {
                        if (relation.relationViewId === cascadeEvent._viewId) {
                            // 获取当前设置的级联的模式
                            const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode];
                            // 获取传递的消息数据
                            const option = cascadeEvent.option;
                            // 解析参数
                            if (relation.params && relation.params.length > 0) {
                                relation.params.forEach(param => {
                                    this._tempValue[param['cid']] = option.data[param['pid']];
                                });
                            }
                            switch (mode) {
                                case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                    this.load();
                                    break;
                                case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                    this.load();
                                    break;
                                case BSN_COMPONENT_CASCADE_MODES.SELECTED_NODE:
                                break;
                            }
                        }
                    });
                }
            });
        }

        if (this.config.componentType) {
            if (this.config.componentType.parent === true) {
                this.loadTreeData();
            }
            if (!this.config.componentType.child) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
       // this.loadTreeData();
    }

    async getTreeData() {
        const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
        return ajaxData;
    }

    loadTreeData() {
        (async () => {
            const data = await this.getTreeData();
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
                const result = [new NzTreeNode({
                    title: '根节点',
                    key: 'null',
                    isLeaf: false,
                    children: []
                })];
                result[0].children.push(...this.listToTreeData(TotreeBefore, parent));
                this.treeData = result;
            }
        })();
    }

    load() {
        this.loadTreeData();
    }
    listToTreeData(data, parentid):  NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                temp = this.listToTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                } else {
                    data[i]['isLeaf'] = true;
                }
                
                if (this._clickedNode && (data[i]['key'] === this._clickedNode['key'])) {
                    data[i]['isSelected'] = true;
                }
                data[i].level = '';
                result.push(new NzTreeNode(data[i]));
            }
        }
        
        return result;
    }

    treeToListData(treeData) {
        let list = [];
        const item: {title: any, key: any, isLeaf: boolean} = {
            title: treeData.title,
            key: treeData.key,
            isLeaf: treeData.isLeaf
        };
        list.push(item);
        if (treeData.children && treeData.children.length > 0 ) {
            treeData.children.map(d => {
                list = list.concat(this.treeToListData(d));
            });
            
        }

        return list;

    }

    onMouseAction(actionName, $event) {

        this[actionName]($event);
    }

    clickNode = (e) => {
        this._clickedNode = e.node;
    }

    checkboxChange = (e) => {
        let checkItemList = [];
        e.checkedKeys.map(item => {
            checkItemList = checkItemList.concat(this.treeToListData(item));
        });
        // console.log(checkItemList);
    }

    ngOnDestroy() {
        // if (this._relativeResolver) {
        //     this._relativeResolver.unsubscribe();
        // }
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
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
                    params[param.name] = componentValue.value;
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
            // console.log('get参数', params);
            return this._http.getProj(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            // console.log('put参数', params);
            return this._http.putProj(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            // console.log('post参数', params);
            return this._http.postProj(url, params).toPromise();
        } else {
            return null;
        }
    }
    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

}

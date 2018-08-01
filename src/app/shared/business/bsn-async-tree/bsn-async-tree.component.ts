import { CommonTools } from '@core/utility/common-tools';
import { Component, OnInit, ViewChild, OnDestroy, Input, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { APIResource } from '@core/utility/api-resource';
import { NzTreeNode } from 'ng-zorro-antd';
import { Subscription ,  Observable ,  Observer } from 'rxjs';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';

@Component({
    selector: 'cn-bsn-async-tree',
    templateUrl: './bsn-async-tree.component.html',
})
export class BsnAsyncTreeComponent extends CnComponentBase implements OnInit, OnDestroy {

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
        //     this._tempValue = this._relativeResolver._tempParameter;
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
                                    this.loadTreeData();
                                    break;
                                case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                    this.loadTreeData();
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
    }

    async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, 'load');
    }


    loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            // if (data.Data && data.Status === 200) {
            //     this.treeData = this.listToAsyncTreeData(data.Data, '');
            // }
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
                result[0].children.push(...this.listToAsyncTreeData(TotreeBefore, parent));
                this.treeData = result;
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
            return this._http.getProj(url, params).toPromise();
        }
    }

    onMouseAction(actionName, $event) {
        this[actionName]($event);
    }


    expandNode = (e) => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                
                const s = await Promise.all(this.config.expand
                .filter(p => p.type === e.node.isLeaf)
                .map(async expand => {
                    const  data =  await this.execAjax(expand.ajaxConfig, e.node.key, 'load');
                    if (data.data && data.status === 200) {
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

                
                
                // if (data.Data && data.Status === 200) {
                //     data.Data.forEach(item => {
                //         item['isLeaf'] = false;
                //         item['children'] = [];
                //     });
                //     e.node.addChildren(data.Data);
                // }



                // this.config.expand.map(async expand => {
                //     if (expand.type === e.node.level) {
                //         const data = await this.execAjax(expand.ajaxConfig, e.node.key, 'load');
                //         console.log(data);
                //         if (data.Data && data.Status === 200) {
                //             data.Data.forEach(item => {
                //                 item['isLeaf'] = false;
                //                 item['children'] = [];
                //             });
                //             e.node.addChildren(data.Data);
                //         }
                //     }
                // });


                
            }
        })();
    }



    clickNode = (e) => {
        this._clickedNode = e.node;
    }


    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}

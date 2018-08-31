import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE } from '@core/relative-Service/BsnTableStatus';
import {Component, OnInit, Input, OnDestroy, Inject, HostListener} from '@angular/core';
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
    styles  : [ `
        :host ::ng-deep .ant-tree {
            overflow: hidden;
            /*margin: 0 -24px;*/
            /*padding: 0 24px;*/
        }

        :host ::ng-deep .ant-tree li {
            padding: 4px 0 0 0;
        }

        @keyframes shine {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        .shine-animate {
            animation: shine 2s ease infinite;
        }

        .custom-node {
            cursor: pointer;
            line-height: 26px;
            margin-left: 4px;
            display: inline-block;
            margin: 0 -1000px;
            padding: 0 1000px;
        }

        .active {
            background: #0BCAF8;
            color: #fff;
        }

        .is-dragging {
            background-color: transparent !important;
            color: #000;
            opacity: 0.7;
        }

        .file-name, .folder-name, .file-desc, .folder-desc {
            margin-left: 4px;
        }

        .file-desc, .folder-desc {
            /*padding: 2px 8px;
            background: #87CEFF;
            color: #FFFFFF;*/
        }
    ` ]
})
export class CnBsnTreeComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() config;
    treeData;
    _relativeResolver;
    tempValue = {};
    checkedKeys = [];
    selectedKeys = [];
    _clickedNode: any;
    _toTreeBefore = [];
    activedNode: NzTreeNode;
    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    _checkItemList = [];
    constructor(
        private _http: ApiService,
        private _message: NzMessageService,
        @Inject(BSN_COMPONENT_MODES) private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngOnInit() {
        if(!this.tempValue) {
            this.tempValue = {};
        }
        this.resolverRelation();
        if (this.config.componentType) {
            if (this.config.componentType.parent === true) {
                this.loadTreeData(true);
            }
            if (!this.config.componentType.child) {
                this.loadTreeData(true);
            }
        } else {
            this.loadTreeData(true);
        }
    }

    resolverRelation() {
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
                    case BSN_COMPONENT_MODES.SAVE_NODE:
                        if(option.ajaxConfig) {
                            this.submitNodeData(option.ajaxConfig);
                        }
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

        // 父类型注册节点点击后触发消息
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

        // 注册多界面切换消息
        if(this.config.componentType && this.config.componentType.sub === true){
            debugger;
            this.after(this, 'clickNode', () => {
                this._clickedNode && this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                        this.config.viewId,
                        {
                            data: this._clickedNode,
                            tempValue: this.tempValue,
                            subViewId: () => {
                                let id = '';
                                this.config.subMapping.forEach(sub => {
                                    const mappingVal = this._clickedNode[sub['field']];
                                    if(sub.mapping){
                                        sub.mapping.forEach(m => {
                                            if(m.value === mappingVal) {
                                                id = m.subViewId;
                                            }
                                        });
                                    }
                                });
                                return id;
                            }
                        }
                    )
                );
            });
        }

        // 子类型注册接收消息后加载事件
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
                                    this.tempValue[param['cid']] = option.data[param['pid']];
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

    }

    async getTreeData() {
        const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
        return ajaxData;
    }

    loadTreeData(pageLoad = false) {
        (async () => {
            const data = await this.getTreeData();
            if (data.data && data.isSuccess) {
                this._toTreeBefore = data.data;
                for (let i = 0, len = this._toTreeBefore.length; i < len ; i++){
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            this._toTreeBefore[i][col['field']] = this._toTreeBefore[i][col['valueName']];
                        });
                    }
                    if(this.config.checkable && this.config.checkedMapping) {
                        this.config.checkedMapping.forEach(m => {
                            if(this._toTreeBefore[i][m.name] && this._toTreeBefore[i][m.name] === m.value) {
                                this._toTreeBefore[i]['checked'] = true;
                            }
                        });
                    }
                }

                // this._toTreeBefore.map(d => {
                //     if (this.config.columns) {
                //         this.config.columns.forEach(col => {
                //             // 解析对应字段
                //             d[col['field']] = d[col['valueName']];
                //         });
                //     }
                //     if (this.config.checkable && this.config.checkedMapping) {
                //         this.config.checkedMapping.map(m => {
                //             if(d[m.name] && d[m.name] === m.value) {
                //                 d['checked'] = true;
                //             }
                //         });
                //         // 解析选中字段
                //     }
                // });
                let parent = '';
                // 解析出 parentid ,一次性加载目前只考虑一个值
                if (this.config.parent) {
                    this.config.parent.forEach(param => {
                        if (param.type === 'tempValue') {
                            parent = this.tempValue[param.valueName];

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
                const result = new NzTreeNode({
                    title: '根节点',
                    key: 'null',
                    isLeaf: false,
                    children: []
                });

                // result.addChildren(this.listToTreeData(this._toTreeBefore, parent));
                this.treeData = this.listToTreeData(this._toTreeBefore, parent);
                console.log(this.treeData);
                //this.treeData = [result];
            }
        })();
    }

    load() {
        this.loadTreeData();
    }

    setItemToNzTreeNode(item): NzTreeNode {
        return new NzTreeNode(item);
    }

    _getChildrenNodeData(parentId) {
        const leastNodes =  this._toTreeBefore
            .filter(d => d.parentId === parentId);
        return leastNodes;

    }

    _setDataToNzTreeNodes(childrenData, parentNode) {
        const nodes: NzTreeNode[] = [];
        if(childrenData && childrenData.length > 0) {
            childrenData.map(d => {
                const node: NzTreeNode = new NzTreeNode(d);
                const leastData = this._getChildrenNodeData(node.key);
                if(leastData && leastData.length > 0) {
                    this._setDataToNzTreeNodes(leastData, node);
                }
                nodes.push(node);
            });
        }
        if(nodes.length > 0) {
            console.log(parentNode);
            parentNode.addChildren(nodes);
        }
    }

    listToTreeData(data, parentId):  NzTreeNode[] {
        const result: NzTreeNode[] = [];

        for (let i = 0, len = data.length; i < len; i++) {
            let cNode: NzTreeNode;
            // 设置默认选中节点
            if (this._clickedNode && (data[i]['key'] === this._clickedNode['key'])) {
                data[i]['selected'] = true;
            }
            // 查找根节点
            if (data[i].parentId === parentId) {
                // data.splice(data.indexOf(data[i]), 1);
                // i--;
                // len--;
                // 查找根节点对应的自节点
                const leastNodes = this._getChildrenNodeData(data[i].key);

                if (leastNodes.length > 0) {
                    cNode = new NzTreeNode(data[i]);
                    debugger;
                    this._setDataToNzTreeNodes(leastNodes, cNode);
                } else {
                    data[i]['isLeaf'] = true;
                    cNode = new NzTreeNode(data[i]);
                }
                result.push(cNode);

            }
        }
        return result;
    }

    treeToListData(treeData) {
        let list = [];
        // const item: {title: any, key: any, isLeaf: boolean} = {
        //     title: treeData.title,
        //     key: treeData.key,
        //     isLeaf: treeData.isLeaf
        // };
        list.push(treeData['key']);
        if (treeData.children && treeData.children.length > 0 ) {
            treeData.children.forEach(d => {
                list = list.concat(this.treeToListData(d));
            });

        }

        return list;

    }

    onMouseAction(actionName, $event) {

        this[actionName]($event);
    }

    clickNode = (e) => {
        if (this.activedNode) {
            this.activedNode = null;
        }
        e.node.isSelected = true;
        this.activedNode = e.node;
        // 从节点的列表中查找选中的数据对象
        this._clickedNode = this._toTreeBefore.find(n => n.key === e.node.key);
    };

    checkboxChange = (e) => {

        const checkedIds = [];
        // 设置选中项对应的ID数组
        if(!this.tempValue['_checkedIds']) {
            this.tempValue['_checkedIds'] = '';
        }
        // 获取选中项的数据列表
        e.checkedKeys.map(item => {
            checkedIds.push(this.treeToListData(item));
        });
        // 将选中ID保存到临时变量中，_checkedIds 配置中通过该属性访问id
        // this._checkItemList.forEach(item => {
        //     checkedIds.push(item);
        // });
        this.tempValue['_checkedIds'] = checkedIds.join(',');

        // 将选中的数据保存到临时变量中
    }

    submitNodeData(ajaxConfig) {
        (async() => {
            if(ajaxConfig.post) {
                ajaxConfig.post.map(async cfg => {
                   const res = await this.execAjax(cfg);
                   if(res.isSuccess) {
                       this._message.success('保存成功');
                   } else {
                       this._message.error('保存失败');
                   }
                })
            }
        })();
    }

    ngOnDestroy() {
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
       /*  if (!this.tempValue)  {
            this.tempValue = {};
        } */
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this.tempValue[param.valueName]) {
                                params[param.name] = this.tempValue[param.valueName];
                            } else {
                                // console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.tempValue[param.valueName];
                        }
                    } else {
                        params[param.name] = this.tempValue[param.valueName];
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
                        pc = this.tempValue[param.valueName];
                    }
                });
                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'get' && tag) {
            // console.log('get参数', params);
            return this._http.get(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            // console.log('put参数', params);
            return this._http.put(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            // console.log('post参数', params);
            return this._http.post(url, params).toPromise();
        } else {
            return null;
        }
    }

    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }



}

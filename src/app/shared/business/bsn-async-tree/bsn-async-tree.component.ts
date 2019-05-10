import { CommonTools } from '@core/utility/common-tools';
import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    Input,
    Inject
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import {
    RelativeService,
    RelativeResolver
} from '@core/relative-Service/relative-service';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { APIResource } from '@core/utility/api-resource';
import { NzTreeNode, NzMessageService, NzModalService, NzDropdownService, NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent } from 'ng-zorro-antd';
import { Subscription, Observable, Observer } from 'rxjs';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_EXECUTE_ACTION
} from '@core/relative-Service/BsnTableStatus';
import { CacheService } from '@delon/cache';
import { ActivatedRoute } from '@angular/router';
import { GridBase } from '../grid.base';
import { SystemResource } from '@core/utility/system-resource';

@Component({
    selector: 'cn-bsn-async-tree',
    templateUrl: './bsn-async-tree.component.html',
    styles: [
        `
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
                background: #0bcaf8;
                color: #fff;
            }

            .is-dragging {
                background-color: transparent !important;
                color: #000;
                opacity: 0.7;
            }

            .file-name,
            .folder-name,
            .file-desc,
            .folder-desc {
                margin-left: 4px;
            }

            .file-desc,
            .folder-desc {
                /*padding: 2px 8px;
            background: #87CEFF;
            color: #FFFFFF;*/
            }
        `
    ]
})
export class BsnAsyncTreeComponent extends GridBase
    implements OnInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public initData;
    @Input()
    public permissions = [];
    @ViewChild('treeObj')
    public treeObj: NzTreeComponent;
    public treeData: NzTreeNodeOptions[];
    public _relativeResolver;
    // _tempValue = {};
    public checkedKeys = [];
    public selectedKeys = [];
    public _toTreeBefore = [];
    public activedNode: NzTreeNode;
    public selectedItem: any;

    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;
    public isLoading = false;
    constructor(
        private _http: ApiService,
        private _cacheService: CacheService,
        private _msg: NzMessageService,
        private _modal: NzModalService,
        private _dropdownService: NzDropdownService,
        private _router: ActivatedRoute,
        @Inject(BSN_COMPONENT_MODES)
        private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiResource = this._http;
        this.baseMessage = this._msg;
        this.baseModal = this._modal;
        // this.windowCallback = this.load;
    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
        this.cacheValue = this._cacheService ? this._cacheService : {};
        this.permissions = this.permissions ? this.permissions : [];
        this.resolverRelation();
        if (this.config.componentType) {
            if (this.config.componentType.parent === true) {
                this.loadTreeData();
            } else if (!this.config.componentType.child) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
    }

    public resolverRelation() {
        this._statusSubscription = this.eventStatus.subscribe(updateState => {
            if (this.config.viewId === updateState._viewId) {
                const option = updateState.option;
                switch (updateState._mode) {
                    case BSN_COMPONENT_MODES.REFRESH:
                        this.loadTreeData();
                        break;
                    case BSN_COMPONENT_MODES.CREATE:
                        // this.addRow();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        // this.updateRow();
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        // this.cancelRow();
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        // this.saveRow(option);
                        break;
                    case BSN_COMPONENT_MODES.DELETE:
                        // this.deleteRow(option);
                        break;
                    case BSN_COMPONENT_MODES.DIALOG:
                        this.dialog(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE:
                        // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
                        this._resolveAjaxConfig(option);
                        break;
                    case BSN_COMPONENT_MODES.WINDOW:
                        this.windowDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        // this.SearchRow(option);
                        break;
                    case BSN_COMPONENT_MODES.UPLOAD:
                        this.uploadDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM_BATCH:
                        this.formBatchDialog(option);
                        break;
                }
            }
        });

        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            this.after(this, 'clickNode', () => {
                this.selectedItem &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                            this.config.viewId,
                            {
                                data: this.selectedItem
                            }
                        )
                    );
            });
        }

        if (
            this.config.componentType &&
            this.config.componentType.sub === true
        ) {
            this.after(this, 'clickNode', () => {
                this.tempValue['_selectedNode'] &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                            this.config.viewId,
                            {
                                data: {
                                    ...this.initValue,
                                    ...this.tempValue['_selectedNode']
                                },
                                initValue: this.initValue ? this.initValue : {},
                                tempValue: this.tempValue ? this.tempValue : {},
                                subViewId: () => {
                                    let id = '';
                                    this.config.subMapping.forEach(sub => {
                                        const mappingVal = this.tempValue[
                                            '_selectedNode'
                                        ][sub['field']];
                                        if (sub.mapping) {
                                            sub.mapping.forEach(m => {
                                                if (m.value === mappingVal) {
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

        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            if (!this._statusSubscription) {
                this._statusSubscription = this.cascadeEvents.subscribe(
                    cascadeEvent => {
                        if (
                            this.config.relations &&
                            this.config.relations.length > 0
                        ) {
                            this.config.relations.forEach(relation => {
                                if (
                                    relation.relationViewId === cascadeEvent._viewId
                                ) {
                                    // 获取当前设置的级联的模式
                                    const mode =
                                        BSN_COMPONENT_CASCADE_MODES[
                                            relation.cascadeMode
                                        ];
                                    // 获取传递的消息数据
                                    const option = cascadeEvent.option;
                                    // 解析参数
                                    if (
                                        relation.params &&
                                        relation.params.length > 0
                                    ) {
                                        relation.params.forEach(param => {
                                            this.tempValue()[param['cid']] =
                                                option.data[param['pid']];
                                        });
                                    }
                                    switch (mode) {
                                        case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                            this.tempValue['_selectedNode'] = null;
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
                    }
                );
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

    private addChildren() {
        this.treeObj.getTreeNodes()[0].addChildren([{title: CommonTools.uuID(5), isLeaf: true, key: CommonTools.uuID(5)}], 1)
       //  console.log(this.treeObj.getTreeNodeByKey('18805fe0dfcd4518a258b0f4809e793c'));
       this.treeObj.getTreeNodes()[0].children[1].title = '------------------';
        // this.treeData[0].addChildren([{title: CommonTools.uuID(5), isLeaf: true, key: CommonTools.uuID(5)}], 0)
    }

    public loadTreeData() {
        this.isLoading = true;
        (async () => {
            const data = await this.getAsyncTreeData(this.config.ajaxConfig);
            // if (data.Data && data.Status === 200) {
            //     this.treeData = this.listToAsyncTreeData(data.Data, '');
            // }
            if (data.data && data.isSuccess) {
                this._toTreeBefore = data.data;
                this._toTreeBefore.forEach(d => {
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
                // const result = [
                //     {
                //         title: '根节点',
                //         key: 'null',
                //         isLeaf: false,
                //         children: []
                //     }
                // ];
                // result[0].children.push(
                //     ...this.listToAsyncTreeData(this._toTreeBefore, parent)
                // );

                const result = [
                    ...this.listToAsyncTreeData(this._toTreeBefore, parent)
                ];
                if (result.length > 0) {
                    result[0]['selected'] = true;
                    this.selectedItem =  result[0];
                    this.tempValue['_selectedNode'] = result[0];
                }

                this.treeData = result;


                if (
                    this.config.componentType
                    && this.config.componentType.parent === true
                    && this.treeData
                    && this.treeData.length > 0
                ) {
                    // console.log('send cascade data')
                    this.tempValue['_selectedNode'] &&
                        this.cascade.next(
                            new BsnComponentMessage(
                                BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                                this.config.viewId,
                                {
                                    data: this.tempValue['_selectedNode']
                                }
                            )
                        );
                }
                if (
                    this.config.componentType
                    && this.config.componentType.sub === true
                    && this.treeData
                    && this.treeData.length > 0
                ) {
                    this.tempValue['_selectedNode'] &&
                        this.cascade.next(
                            new BsnComponentMessage(
                                BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                                this.config.viewId,
                                {
                                    data: {
                                        ...this.initValue,
                                        ...this.tempValue['_selectedNode']
                                    },
                                    initValue: this.initValue
                                        ? this.initValue
                                        : {},
                                    tempValue: this.tempValue
                                        ? this.tempValue
                                        : {},
                                    subViewId: () => {
                                        let id = '';
                                        this.config.subMapping.forEach(
                                            sub => {
                                                const mappingVal = this
                                                    .tempValue[
                                                    '_selectedNode'
                                                ][sub['field']];
                                                if (sub.mapping) {
                                                    sub.mapping.forEach(
                                                        m => {
                                                            if (
                                                                m.value ===
                                                                mappingVal
                                                            ) {
                                                                id =
                                                                    m.subViewId;
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                        return id;
                                    }
                                }
                            )
                        );
                }
            }
            this.isLoading = false;
        })();
    }

    public listToAsyncTreeData(data, parentid){
        const result: any[] = [];
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
                result.push(data[i]);
            }
        }
        return result;
    }

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }


    public onMouseAction(actionName, $event) {
        this[actionName]($event);
    }

    public expandNode = e => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                const s = await Promise.all(
                    this.config.expand
                        .filter(p => p.type === e.node.isLeaf)
                        .map(async expand => {
                            const data = await this.getAsyncTreeData(expand.ajaxConfig, e.node);
                            if (data.isSuccess && data.data.length > 0) {
                                this._toTreeBefore.push(
                                    ...JSON.parse(JSON.stringify(data.data))
                                );
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

    public clickNode = e => {
        if (this.activedNode) {
            this.activedNode = null;
        }
        e.node.isSelected = true;
        this.activedNode = e.node;
        // 从节点的列表中查找选中的数据对象
        this.tempValue['_selectedNode'] = {
            ...this.initValue,
            ...this._toTreeBefore.find(n => n.key === e.node.key)
        };
        this.selectedItem =  this.tempValue['_selectedNode'];



    };

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }


    /**
     * 弹出对话框
     * @param option
     */
    public dialog(option) {
        if (this.config.dialog && this.config.dialog.length > 0) {
            const index = this.config.dialog.findIndex(
                item => item.name === option.actionName
            );
            this.showForm(this.config.dialog[index]);
        }
    }
    /**
     * 弹出窗体
     * @param option
     */
    public windowDialog(option) {
        if (this.config.windowDialog && this.config.windowDialog.length > 0) {
            const index = this.config.windowDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showLayout(this.config.windowDialog[index]);
        }
    }
    /**
     * 弹出上传对话
     * @param option
     */
    public uploadDialog(option) {
        if (this.config.uploadDialog && this.config.uploadDialog.length > 0) {
            const index = this.config.uploadDialog.findIndex(
                item => item.name === option.actionName
            );
            this.openUploadDialog(this.config.uploadDialog[index]);
        }
    }
    /**
     * 弹出表单
     * @param option
     */
    public formDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showForm(this.config.formDialog[index]);
        }
    }
    /**
     * 弹出批量处理表单
     * @param option
     */
    public formBatchDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showBatchForm(this.config.formDialog[index]);
        }
    }

    public nzEvent(event: NzFormatEmitEvent): void {
        //  console.log(event, this.treeObj.getMatchedNodeList().map(v => v.title));
    }

    // region 数据操作逻辑
    private _resolveAjaxConfig(option) {
        if (option.ajaxConfig && option.ajaxConfig.length > 0) {
            option.ajaxConfig.filter(c => !c.parentName).map(c => {
                this._getAjaxConfig(c, option);
            });
        }
    }

    private _getAjaxConfig(c, option) {
        let msg = '操作成功!';
        if (c.action) {
            let handleData;
            // 所有获取数据的方法都会将数据保存至tempValue
            // 使用是可以通过临时变量定义的固定属性访问
            // 可已使用内置的参数类型进行访问
            switch (c.action) {
                case BSN_COMPONENT_MODES.REFRESH:
                    this.loadTreeData();
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODES_CHECKED_KEY:
                    handleData = this._getCheckedNodesIds();
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODE_SELECTED:
                    handleData = this._getSelectedNodeId();
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODE_CHECKED:
                    handleData = this._getCheckedNodes();
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_DOWNLOAD:
                    handleData = this._getSelectedNodeId();
                    window.open(`${SystemResource.appSystem.Server}file/download?_ids=${handleData['Id']}`)
                    return;
            }
            if (c.message) {
                this.baseModal.confirm({
                    nzTitle: c.title ? c.title : '提示',
                    nzContent: c.message ? c.message : '',
                    nzOnOk: () => {
                        (async () => {
                            const response = await this._executeAjaxConfig(
                                c,
                                handleData
                            );
                            // 处理输出参数
                            if (c.outputParams) {
                                this.outputParametersResolver(
                                    c,
                                    response,
                                    option.ajaxConfig,
                                    () => {
                                        this.loadTreeData();
                                    }
                                );
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(response, msg, () => {
                                    this.loadTreeData();
                                }, c);
                            }
                        })();
                    },
                    nzOnCancel() { }
                });
            } else {
                (async () => {
                    const response = await this._executeAjaxConfig(
                        c,
                        handleData
                    );
                    // 处理输出参数
                    if (c.outputParams) {
                        this.outputParametersResolver(
                            c,
                            response,
                            option.ajaxConfig,
                            () => {
                                this.cascade.next(
                                    new BsnComponentMessage(
                                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                                        this.config.viewId
                                    )
                                );
                                this.loadTreeData();
                            }
                        );
                    } else {
                        // 没有输出参数，进行默认处理
                        this.showAjaxMessage(response, msg, () => {
                            this.cascade.next(
                                new BsnComponentMessage(
                                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                                    this.config.viewId
                                )
                            );
                            this.loadTreeData();
                        }, c);
                    }
                })();
            }
        }
    }

    private _executeAjaxConfig(ajaxConfigObj, handleData) {
        if (Array.isArray(handleData)) {
            return this._executeBatchAction(ajaxConfigObj, handleData);
        } else {
            return this._executeAction(ajaxConfigObj, handleData);
        }
    }

    private async _executeAction(ajaxConfigObj, handleData) {
        const executeParam = CommonTools.parametersResolver({
            params: ajaxConfigObj.params,
            tempValue: this.tempValue,
            item: handleData,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        // 执行数据操作
        return this._execute(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType,
            executeParam
        );
        // if (response.isSuccess) {
        //     this.baseMessage.success('操作成功');
        // } else {
        //     this.baseMessage.error(`操作失败 ${response.message}`);
        // }
    }

    private async _executeBatchAction(ajaxConfigObj, handleData) {
        const executeParams = [];
        if (Array.isArray(handleData)) {
            if (ajaxConfigObj.params) {
                handleData.forEach(dataItem => {
                    const newParam = CommonTools.parametersResolver({
                        params: ajaxConfigObj.params,
                        tempValue: this.tempValue,
                        item: dataItem,
                        initValue: this.initValue,
                        cacheValue: this.cacheValue
                    });
                    executeParams.push(newParam);
                });
            }
        } else {
            executeParams.push(
                CommonTools.parametersResolver({
                    params: ajaxConfigObj.params,
                    tempValue: this.tempValue,
                    item: handleData,
                    initValue: this.initValue,
                    cacheValue: this.cacheValue
                })
            );
        }
        // 执行数据操作
        return this._execute(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType,
            executeParams
        );
        // if (response.isSuccess) {
        //     this.baseMessage.success('操作成功');
        // } else {
        //     this.baseMessage.error(`操作失败 ${response.message}`);
        // }
    }



    private _getCheckedNodesFromParent(treeNode) {
        let list = [];
        if (treeNode.children && treeNode.children.length > 0) {
            treeNode.children.forEach(d => {
                list = list.concat(this._getCheckedNodesFromParent(d));
            });
        }
        list.push(treeNode);
        return list;
    }


    private _getCheckedNodes() {

        let checkedNodes = [];
        const currentNodes = [...this.treeObj.getCheckedNodeList()];
        currentNodes.forEach(node => {
            checkedNodes = checkedNodes.concat([...this._getCheckedNodesFromParent(node)]);
        });
        checkedNodes.push(...this.treeObj.getHalfCheckedNodeList());

        this.tempValue['_checkedNodes'] = checkedNodes;
        return checkedNodes;
    }

    private _getCheckedNodesIds() {
        const checkedIds = [];
        const checkedNodes = this._getCheckedNodes();
        if (checkedNodes && checkedNodes.length > 0) {
            checkedNodes.forEach(node => {
                checkedIds.push(node.key);
            })
        }
        this.tempValue['_checkedIds'] = checkedIds.join(',');
        return checkedIds.join(',');
    }

    private _getSelectedNodeId() {
        const selectedNodes = this.treeObj.getSelectedNodeList();
        this.tempValue['_selectedNode'] = selectedNodes[0].origin;
        return selectedNodes[0].origin;
    }
}

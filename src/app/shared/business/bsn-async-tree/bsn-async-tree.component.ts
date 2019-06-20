import { CommonTools } from '@core/utility/common-tools';
import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    Input,
    Inject,
    AfterViewInit
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
import { BeforeOperation } from '../before-operation.base';

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
    implements OnInit, AfterViewInit, OnDestroy {
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
    public beforeOperation;
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
        this.cascadeBase = this.cascade;
        this.statusSubscriptions = this.eventStatus;
        this.callback = function() {};

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

        // 初始化前置条件验证对象
        this.beforeOperation = new BeforeOperation({
            config: this.config,
            message: this.baseMessage,
            modal: this.baseModal,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue.getNone('userInfo')
                ? this.cacheValue.getNone('userInfo')
                : {},
            apiResource: this.apiResource
        });
    }

    public ngAfterViewInit() {

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
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
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
            if (!this.cascadeSubscriptions) {
                this.cascadeSubscriptions = this.cascadeEvents.subscribe(
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
                                            option.data[param['pid']] && (this.tempValue[param['cid']] = option.data[param['pid']]);
                                        });
                                    }
                                   
                                    if (cascadeEvent._mode === mode) {
                                        switch (mode) {
                                            // case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                            //     // this.tempValue['_selectedNode'] = null;
                                            //     // this.loadTreeData();
                                            //     break;
                                            // case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                            //     // this.loadTreeData();
                                            //     break;
                                            case BSN_COMPONENT_CASCADE_MODES.SELECTED_NODE:
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.ADD_ASYNC_TREE_NODE:
                                                this.tempValue['_add_ids'] && this.addChildrenNode(this.tempValue['_add_ids']);
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.EDIT_ASNYC_TREE_NODE:
                                                this.tempValue['_edit_ids'] && this.updateNode(this.tempValue['_edit_ids']);
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.DELETE_ASYNC_TREE_NODE:
                                                this.tempValue['_del_ids'] && this.deleteNodes(this.tempValue['_del_ids']);
                                                break;
                                        }
                                    }

                                }
                            });
                        }
                    }
                );
            }

        }
    }

    // 根据删除ID 动态删除对应节点数据
    public deleteNodes(keys: string) {
        const keysArray = keys.split(',');
        if (keysArray && keysArray.length > 0) {
            for (const k of keysArray) {
                this.treeObj.getTreeNodeByKey(k).remove();
            }
        }
        this.treeData = this.treeObj.getTreeNodes();

        if (this.activedNode && this.activedNode.getChildren().length === 0) {
            this.activedNode.setExpanded(false);
        }

    }

    // 根据更新数据ID, 动态加载对应节点数据
    public updateNode(keys: string) {
        if (keys && keys.length > 0) {
            (async() => {
                this._execute(this.config.ajaxConfig.url, 'get', {'Id': `in(${keys})`}).then(
                    result => {
                        if (result.isSuccess) {
                            for (const d of result.data) {
                                const currentNode: NzTreeNode = this.treeObj.getTreeNodeByKey(d['Id']);
                                const index = this.config.columns.findIndex(c => c.field === 'title');
                                currentNode['title'] = d[this.config.columns[index]['valueName']] ? d[this.config.columns[index]['valueName']] : '';
                                currentNode['origin'] = d ? d : {};
                            }
                            this.treeData = this.treeObj.getTreeNodes();
                        }
                    }
                )
            })();
        }
    }

    // 根据添加的数据ID, 动态加载添加数据到对应节点上
    public addChildrenNode(keys: string) {
        if (keys && keys.length > 0) {
            (async() => {
                this._execute(this.config.ajaxConfig.url, 'get', {'Id': `in(${keys})`}).then(
                    result => {
                        if (result.isSuccess) {
                            const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.selectedItem.key);
                            const addNodes = [];
                            for (const d of result.data) {
                                const title_index = this.config.columns.findIndex(c => c.field === 'title');
                                const key_index = this.config.columns.findIndex(c => c.field === 'key');
                                const parent_index = this.config.columns.findIndex(c => c.field === 'parentId');
                                let node = {};
                                node['title'] = d[this.config.columns[title_index]['valueName']] ? d[this.config.columns[title_index]['valueName']] : '';
                                node['key'] = d[this.config.columns[key_index]['valueName']] ? d[this.config.columns[key_index]['valueName']] : '';
                                node['parentId'] = d[this.config.columns[parent_index]['valueName']] ? d[this.config.columns[parent_index]['valueName']] : '';
                                node['origin'] = d ? d : {};
                                node['selected'] = false;
                                addNodes.push(node);
                            }
                            this.treeData = this.treeObj.getTreeNodes();
                            // 打开节点, 重新异步加载数据
                            if (!currentSelectedNode.isExpanded) {
                                currentSelectedNode.setExpanded(true);
                                this.expandNode({node: currentSelectedNode}, this.setChildrenSelectedNode, this);
                            } else { // 节点已经打开,直接在节点下添加子节点
                                currentSelectedNode.addChildren(addNodes, 0);
                                this.setChildrenSelectedNode(this);
                            }
                            // if (addNodes.length > 0) {


                            // }
                        }
                    }
                )
            })();
        }
    }

    private setChildrenSelectedNode(that) {
        const currentSelectedNode = that.treeObj.getTreeNodeByKey(that.selectedItem.key);
        currentSelectedNode.isSelected = false;

        const sNode = currentSelectedNode.getChildren();
        sNode[0].isSelected = true;

        // that.activedNode.isSelected = false;
        // that.activedNode = null;


        that.activedNode = sNode[0];
        that.selectedItem = that.activedNode.origin;
        that.tempValue['_selectedNode'] = that.selectedItem;
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
                const result = [
                    {
                        title: this.config.rootTitle ? this.config.rootTitle : '根节点  ',
                        key: null,
                        isLeaf: false,
                        children: [],
                        expanded: true
                    }
                ];
                result[0].children.push(
                    ...this.listToAsyncTreeData(this._toTreeBefore, parent)
                );

                // const result = [
                //     ...this.listToAsyncTreeData(this._toTreeBefore, parent)
                // ];

                if (result[0].children.length > 0) {
                    result[0].children[0].selected = true;
                    this.selectedItem = result[0].children[0];
                    this.tempValue['_selectedNode'] = result[0].children[0];
                    this.activedNode = result[0].children[0];
                }

        //         const getNodes = this.treeObj.getTreeNodes();

        // if (getNodes.length > 0) {
        //     getNodes[0].setExpanded(true);
        //     getNodes[0].isSelected = true;
        //     this.selectedItem =  getNodes[0].origin;
        //     this.tempValue['_selectedNode'] = getNodes[0].origin;
        //     }

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

    public expandNode = (e, callback?, that?) => {
        if (e.node.isExpanded) {
            (async () => {
                    const s = await Promise.all(
                        this.config.expand
                            .filter(p => p.type === e.node.isLeaf)
                            .map(async expand => {
                                const data = await this.getAsyncTreeData(expand.ajaxConfig, e.node);
                                if (data.isSuccess && data.data.length > 0) {
                                   
                                    this._toTreeBefore.push(
                                        ...JSON.parse(JSON.stringify(data.data))
                                    );
                                    // this._toTreeBefore = [...this._toTreeBefore, ...data.data];
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
                                    if (callback) {
                                        callback(that);
                                    }
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

    public clickNode = e => {
        if (this.activedNode) {
            this.activedNode.isSelected = false;
            this.activedNode['selected'] && (this.activedNode['selected'] = false);
            this.activedNode = null;
        }
        e.node.isSelected = true;
        this.activedNode = e.node;
        // 从节点的列表中查找选中的数据对象
        this.tempValue['_selectedNode'] = {
            ...this.initValue,
            ...e.node.origin
        };
        this.selectedItem =  this.tempValue['_selectedNode'];

        // 选中节点,判断时候展开并加载下层节点数据
        if (!e.node.isExpanded) {
            e.node.isExpanded = true;
            this.expandNode(e);
        }

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
        let msg ;
        if (c.action) {
            let handleData;
            // 所有获取数据的方法都会将数据保存至tempValue
            // 使用是可以通过临时变量定义的固定属性访问
            // 可已使用内置的参数类型进行访问
            switch (c.action) {
                case BSN_COMPONENT_MODES.REFRESH:
                    this.loadTreeData();
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODES_CHECKED_KEY:
                    if (
                        this.treeObj.getCheckedNodeList().length <= 0
                        // this.treeData.filter(item => item.checked === true)
                        //     .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getCheckedNodesIds();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_ALL_NODES_CHECKED_KEY:
                    if (
                        this.treeObj.getCheckedNodeList().length <= 0
                        // this.treeData.filter(item => item.checked === true)
                        //     .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getAllCheckedNodesIds();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODE_SELECTED:
                    handleData = this._getSelectedNodeId();
                    this.beforeOperation.operationItemData = handleData;
                    if (this.beforeOperation.beforeItemDataOperation(option)) {
                        return;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_NODE_CHECKED:
                    if (
                        this.treeObj.getCheckedNodeList().length <= 0
                        // this.treeData[0].children.filter(item => item.checked === true)
                        //     .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getCheckedNodes();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_ALL_NODE_CHECKED:
                    if (
                        this.treeObj.getCheckedNodeList().length <= 0
                        // this.treeData[0].children.filter(item => item.checked === true)
                        //     .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getAllCheckedNodes();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_DOWNLOAD:
                    handleData = this._getSelectedNodeId();
                    window.open(`${SystemResource.appSystem.Server}file/download?_ids=${handleData['Id']}`)
                    msg = '操作完成';
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

    private _getAllCheckedNodes() {
        let checkedNodes = [];
        const currentNodes = [...this.treeObj.getCheckedNodeList()];
        currentNodes.forEach(node => {
            checkedNodes = checkedNodes.concat([...this._getCheckedNodesFromParent(node)]);
        });
        this.tempValue['_allCheckedNodes'] = checkedNodes;
        return checkedNodes;
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

    private _getAllCheckedNodesIds() {
        const checkedIds = [];
        const checkedNodes = this._getAllCheckedNodes();
        if (checkedNodes && checkedNodes.length > 0) {
            checkedNodes.forEach(node => {
                checkedIds.push(node.key);
            })
        }
        this.tempValue['_checkedIds'] = checkedIds.join(',');
        return checkedIds.join(',');
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

    public sendCascadeMessage(returnValue?: any) {
        // 发送消息 刷新其他界面
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                    this.config.viewId,
                    {
                        data: { ...this.returnValue, ...this.dataList }
                    }
                )
            );
        }

        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId,
                    {
                        data: { ...this.returnValue, ...this.dataList }
                    }
                )
            );
        }

        if (this.config.componentType && this.config.componentType.toAsyncTree === true) {
            // 发送操作完成的ids
            const objs = CommonTools.getReturnIdsAndType(returnValue);
            if (objs && Array.isArray(objs) && objs.length > 0) {

                for (const r_val of objs) {
                    let mode: string;
                    let paramData: any;
                    switch (r_val.type) {
                        case 'add':
                        mode = BSN_COMPONENT_CASCADE_MODES.ADD_ASYNC_TREE_NODE;
                        paramData = {_add_ids: r_val.ids.join(',')};
                        break;
                        case 'edit':
                        mode = BSN_COMPONENT_CASCADE_MODES.EDIT_ASNYC_TREE_NODE;
                        paramData = {_edit_ids: r_val.ids.join(',')};
                        break;
                        case 'delete':
                        mode = BSN_COMPONENT_CASCADE_MODES.DELETE_ASYNC_TREE_NODE;
                        paramData = {_del_ids: r_val.ids.join(',')};
                        break;
                    }
                    this.cascade.next(
                        new BsnComponentMessage(
                            mode,
                            this.config.viewId,
                            {
                                data: paramData
                            }
                        )
                    );
                }

            }
        }
    }
}

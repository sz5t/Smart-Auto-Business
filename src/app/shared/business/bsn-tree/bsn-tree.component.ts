import { GridBase } from "./../grid.base";
import {
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_EXECUTE_ACTION
} from "@core/relative-Service/BsnTableStatus";
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Inject,
    TemplateRef
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { ApiService } from "@core/utility/api-service";
import {
    NzMessageService,
    NzModalService,
    NzTreeNode,
    NzDropdownContextComponent,
    NzDropdownService,
    NzTreeNodeOptions
} from "ng-zorro-antd";
import { CnComponentBase } from "@shared/components/cn-component-base";
import { CommonTools } from "@core/utility/common-tools";
import { Observer, Observable, Subscription } from "rxjs";
import { CacheService } from "@delon/cache";
@Component({
    selector: "cn-bsn-tree",
    templateUrl: "./bsn-tree.component.html",
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

            :host ::ng-deep nz-upload {
                display: block;
            }

            :host ::ng-deep .ant-upload.ant-upload-drag {
                height: 180px;
            }
            :host ::ng-deep .tree {
                min-height: 300px;
            }
            :host ::ng-deep .tree-container {
                overflow: auto;
                height: 300px;
            }
        `
    ]
})
export class CnBsnTreeComponent extends GridBase implements OnInit, OnDestroy {
    @Input()
    config;
    @Input()
    initData;
    @Input()
    permissions = [];
    treeData: NzTreeNodeOptions[];
    _relativeResolver;
    checkedKeys = [];
    selectedKeys = [];
    _toTreeBefore = [];
    activedNode: NzTreeNode;
    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    _checkItemList = [];
    dropdown: NzDropdownContextComponent;
    _selectedNode = {};
    constructor(
        private _http: ApiService,
        private _cacheService: CacheService,
        private _msg: NzMessageService,
        private _modal: NzModalService,
        private _dropdownService: NzDropdownService,
        @Inject(BSN_COMPONENT_MODES)
        private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiService = this._http;
        this.message = this._msg;
        this.modalService = this._modal;
    }

    ngOnInit() {
        if (this.initData) {
            this.initValue = this.initData;
        }
        if (this._cacheService) {
            this.cacheValue = this._cacheService;
        }
        this.callback = this.load;
        this.resolverRelation();
        if (this.config.componentType) {
            if (this.config.componentType.parent === true) {
                this.loadTreeData();
            } else if (!this.config.componentType.child) {
                this.loadTreeData();
            } else if (this.config.componentType.sub) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
    }

    resolverRelation() {
        // 监听消息，执行对应的数据操作
        this._statusSubscription = this.eventStatus.subscribe(updateState => {
            if (this.config.viewId === updateState._viewId) {
                const option = updateState.option;
                switch (updateState._mode) {
                    case BSN_COMPONENT_MODES.REFRESH:
                        this.load();
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

        // 父类型注册节点点击后触发消息
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            this.after(this, "clickNode", () => {
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

            this.after(this, "checkboxChange", () => {
                this.tempValue["_checkedIds"] &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN,
                            this.config.viewId,
                            {
                                data: this.tempValue["_checkedIds"]
                            }
                        )
                    );
            });
        }

        // 注册多界面切换消息
        if (
            this.config.componentType &&
            this.config.componentType.sub === true
        ) {
            this.after(this, "clickNode", () => {
                this.tempValue["_selectedNode"] &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                            this.config.viewId,
                            {
                                data: {
                                    ...this.initValue,
                                    ...this.tempValue["_selectedNode"]
                                },
                                tempValue: this.tempValue,
                                subViewId: () => {
                                    let id = "";
                                    this.config.subMapping.forEach(sub => {
                                        const mappingVal = this.tempValue[
                                            "_selectedNode"
                                        ][sub["field"]];
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

        // 子类型注册接收消息后加载事件
        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(
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
                                        this.tempValue[param["cid"]] =
                                            option.data[param["pid"]];
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
                }
            );
        }
    }

    async getTreeData() {
        const params = CommonTools.parametersResolver({
            params: this.config.ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        const ajaxData = await this._execute(
            this.config.ajaxConfig.url,
            "get",
            params
        );
        return ajaxData;
    }

    loadTreeData() {
        (async () => {
            const data = await this.getTreeData();
            if (data.data && data.isSuccess) {
                if (data.data.length > 0) {
                    this._toTreeBefore = data.data;
                    for (
                        let i = 0, len = this._toTreeBefore.length;
                        i < len;
                        i++
                    ) {
                        if (this.config.columns) {
                            this.config.columns.forEach((col, index) => {
                                this._toTreeBefore[i][
                                    col["field"]
                                ] = this._toTreeBefore[i][col["valueName"]];
                            });
                        }
                        if (
                            this.config.checkable &&
                            this.config.checkedMapping
                        ) {
                            this.config.checkedMapping.forEach(m => {
                                if (
                                    this._toTreeBefore[i][m.name] &&
                                    this._toTreeBefore[i][m.name] === m.value
                                ) {
                                    this._toTreeBefore[i]["checked"] = true;
                                }
                            });
                        }
                    }
                    let parent = "";
                    // 解析出 parentid ,一次性加载目前只考虑一个值
                    if (this.config.parent) {
                        this.config.parent.forEach(param => {
                            if (param.type === "tempValue") {
                                parent = this.tempValue[param.valueName];
                            } else if (param.type === "value") {
                                if (param.value === "null") {
                                    param.value = null;
                                }
                                parent = param.value;
                            } else if (param.type === "GUID") {
                                const fieldIdentity = CommonTools.uuID(10);
                                parent = fieldIdentity;
                            }
                        });
                    }

                    const d = this._setDataToNzTreeNodes(
                        this._toTreeBefore,
                        parent,
                        this.config.currentRoot
                    );

                    // 设置树初始化选中第一个节点
                    if (!this.tempValue["_selectedNode"]) {
                        if (d && d.length > 0) {
                            // 根据配置指定选中节点
                            if (this.config.defaultSelection) {
                                let selectedStatus = 0;
                                if (this.config.defaultSelection.selected) {
                                    const defaultSelection = this.config
                                        .defaultSelection.selected;
                                    let allData = d;

                                    let j = 1;
                                    for (
                                        let i = 0;
                                        i < defaultSelection.length;

                                    ) {
                                        let index = defaultSelection[i].index;
                                        let level = defaultSelection[i].level;
                                        if (level === j) {
                                            // level = level - 1;
                                            index = index - 1;
                                            i++;
                                        } else {
                                            level = j;
                                            index = 0;
                                        }
                                        if (
                                            this._checkDefaultSelection(
                                                allData,
                                                level,
                                                index
                                            )
                                        ) {
                                            allData = this._setDefaultSelection(
                                                allData,
                                                level,
                                                index
                                            );
                                            selectedStatus = 0;
                                        } else {
                                            selectedStatus = 1;
                                            break;
                                        }
                                        if (
                                            level ===
                                            defaultSelection[
                                                defaultSelection.length - 1
                                            ]["level"]
                                        ) {
                                            allData["selected"] = true;
                                            this.selectedItem = allData;
                                            this.tempValue[
                                                "_selectedNode"
                                            ] = allData;
                                        }
                                        j++;
                                    }
                                }
                                if (selectedStatus === 1) {
                                    d[0]["selected"] = true;
                                    this.selectedItem = d[0];
                                    this.tempValue["_selectedNode"] = d[0];
                                }
                            }
                        }
                    }
                    this.treeData = d;
                    // 发送消息
                    if (
                        this.config.componentType &&
                        this.config.componentType.parent === true
                    ) {
                        this.tempValue["_selectedNode"] &&
                            this.cascade.next(
                                new BsnComponentMessage(
                                    BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                                    this.config.viewId,
                                    {
                                        data: this.tempValue["_selectedNode"]
                                    }
                                )
                            );
                    }
                    if (
                        this.config.componentType &&
                        this.config.componentType.sub === true
                    ) {
                        this.tempValue["_selectedNode"] &&
                            this.cascade.next(
                                new BsnComponentMessage(
                                    BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                                    this.config.viewId,
                                    {
                                        data: {
                                            ...this.tempValue["_selectedNode"],
                                            ...this.initValue
                                        },
                                        tempValue: this.tempValue,
                                        subViewId: () => {
                                            let id = "";
                                            this.config.subMapping.forEach(
                                                sub => {
                                                    const mappingVal = this
                                                        .tempValue[
                                                        "_selectedNode"
                                                    ][sub["field"]];
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
                } else {
                    this.treeData = [];
                }
            }
        })();
    }
    _checkDefaultSelection(d, level, index) {
        if (level === 1) {
            if (d[index]) {
                return true;
            } else {
                return false;
            }
        }
        if (d["children"]) {
            if (d["children"][index]) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    _setDefaultSelection(d, level, index) {
        if (level === 1) {
            d[index]["expanded"] = true;
            return d[index];
        }
        if (d["children"]) {
            d["children"][index]["expanded"] = true;
            return d["children"][index];
        } else {
            d["expanded"] = true;
            return d;
        }
    }

    load() {
        this.loadTreeData();
    }

    setItemToNzTreeNode(item): NzTreeNode {
        return new NzTreeNode(item);
    }

    _getChildrenNodeData(parentId) {
        const leastNodes = this._toTreeBefore.filter(
            d => d.parentId === parentId
        );
        return leastNodes;
    }

    _setDataToNzTreeNodes(childrenData, parentId, isCurrentRoot) {
        const nodes: NzTreeNodeOptions[] = [];
        if (childrenData && childrenData.length > 0) {
            childrenData.map(d => {
                let cNode: NzTreeNode;
                if (
                    this.tempValue["_selectedNode"] &&
                    d["key"] === this.tempValue["_selectedNode"]["key"]
                ) {
                    d["selected"] = true;
                }
                if (d["Id"] === parentId && isCurrentRoot) {
                    const leastNodes = this._getChildrenNodeData(d["key"]);
                    if (leastNodes.length > 0) {
                        d["isLeaf"] = false;
                        cNode = new NzTreeNode(d);
                        const childrenNode = this._setDataToNzTreeNodes(
                            leastNodes,
                            d["Id"],
                            false
                        );
                        // cNode['children'] = childrenNode;
                        cNode.addChildren(d);
                    } else {
                        d["isLeaf"] = true;
                        cNode = new NzTreeNode(d);
                    }
                    if (cNode) {
                        nodes.push(d);
                    }
                } else if (d["parentId"] === parentId && !isCurrentRoot) {
                    const leastNodes = this._getChildrenNodeData(d["key"]);
                    if (leastNodes.length > 0) {
                        d["isLeaf"] = false;
                        cNode = new NzTreeNode(d);
                        const childrenNode = this._setDataToNzTreeNodes(
                            leastNodes,
                            d["Id"],
                            false
                        );
                        // cNode['children'] = childrenNode;
                        cNode.addChildren(childrenNode);
                    } else {
                        d["isLeaf"] = true;
                        cNode = new NzTreeNode(d);
                    }
                    if (cNode) {
                        nodes.push(d);
                    }
                }
            });
        }
        return nodes;
    }

    // listToTreeData(data, parentId):  NzTreeNode[] {
    //     const result: NzTreeNode[] = [];
    //
    //     for (let i = 0, len = data.length; i < len; i++) {
    //         let cNode: NzTreeNode;
    //         // 设置默认选中节点
    //         if (this.tempValue['_selectedNode'] && (data[i]['key'] === this.tempValue['_selectedNode']['key'])) {
    //             data[i]['selected'] = true;
    //         }
    //         // 查找根节点
    //         if (data[i].parentId === parentId) {
    //             // data.splice(data.indexOf(data[i]), 1);
    //             // i--;
    //             // len--;
    //             // 查找根节点对应的自节点
    //             const leastNodes = this._getChildrenNodeData(data[i].key);
    //
    //             if (leastNodes.length > 0) {
    //                 cNode = new NzTreeNode(data[i]);
    //                 this._setDataToNzTreeNodes(leastNodes, cNode,);
    //             } else {
    //                 data[i]['isLeaf'] = true;
    //                 cNode = new NzTreeNode(data[i]);
    //             }
    //             result.push(cNode);
    //
    //         }
    //     }
    //     return result;
    // }

    treeToListData(treeData) {
        let list = [];
        // const item: {title: any, key: any, isLeaf: boolean} = {
        //     title: treeData.title,
        //     key: treeData.key,
        //     isLeaf: treeData.isLeaf
        // };
        list.push(treeData["key"]);
        if (treeData.children && treeData.children.length > 0) {
            treeData.children.forEach(d => {
                list = list.concat(this.treeToListData(d));
            });
        }

        return list;
    }

    onMouseAction(actionName, $event) {
        this[actionName]($event);
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this._dropdownService.create($event, template);
    }

    clickNode = e => {
        if (this.activedNode) {
            this.activedNode = null;
        }
        // e.node.isSelected = true;
        this.activedNode = e.node;
        // 从节点的列表中查找选中的数据对象
        this.tempValue["_selectedNode"] = {
            ...this.initValue,
            ...this._toTreeBefore.find(n => n.key === e.node.key)
        };
        this.selectedItem = this.tempValue["_selectedNode"];
    };

    checkboxChange = e => {
        const checkedIds = [];
        // 设置选中项对应的ID数组
        if (!this.tempValue["_checkedIds"]) {
            this.tempValue["_checkedIds"] = "";
        }
        if (!this.tempValue["_checkedNodes"]) {
            this.tempValue["_checkedNodes"] = [];
        }
        // 获取选中项的数据列表
        e.checkedKeys.map(item => {
            checkedIds.push(this.treeToListData(item));
        });
        // 将选中ID保存到临时变量中，_checkedIds 配置中通过该属性访问id
        // this._checkItemList.forEach(item => {
        //     checkedIds.push(item);
        // });
        // this.tempValue['_checkedIds'] = checkedIds.join(',');
        this.tempValue["_checkedNodes"] = checkedIds;
        this.tempValue["_checkedIds"] = checkedIds.join(",");
        // 将选中的数据保存到临时变量中
    };

    ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    // region 数据操作逻辑
    private _resolveAjaxConfig(option) {
        if (option.ajaxConfig && option.ajaxConfig.length > 0) {
            option.ajaxConfig.map(async c => {
                if (c.action) {
                    let handleData;
                    // 所有获取数据的方法都会将数据保存至tempValue
                    // 使用是可以通过临时变量定义的固定属性访问
                    // 可已使用内置的参数类型进行访问
                    switch (c.action) {
                        case BSN_COMPONENT_MODES.REFRESH:
                            this.load();
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
                    }
                    this._executeAjaxConfig(c, handleData);
                }
            });
        }
    }

    private _executeAjaxConfig(ajaxConfigObj, handleData) {
        this.modalService.confirm({
            nzTitle: ajaxConfigObj.title ? ajaxConfigObj.title : "提示",
            nzContent: ajaxConfigObj.message ? ajaxConfigObj.message : "",
            nzOnOk: () => {
                if (Array.isArray(handleData)) {
                    this._executeBatchAction(ajaxConfigObj, handleData);
                } else {
                    this._executeAction(ajaxConfigObj, handleData);
                }
            },
            nzOnCancel() {}
        });
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
        const response = await this._execute(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType,
            executeParam
        );
        if (response.isSuccess) {
            this.message.success("操作成功");
        } else {
            this.message.error(`操作失败 ${response.message}`);
        }
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
        const response = await this._execute(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType,
            executeParams
        );
        if (response.isSuccess) {
            this.message.success("操作成功");
        } else {
            this.message.error(`操作失败 ${response.message}`);
        }
    }

    private _getCheckedNodes() {
        return this.tempValue["_checkedNodes"]
            ? this.tempValue["_checkedNodes"]
            : [];
    }

    private _getCheckedNodesIds() {
        return this.tempValue["_checkedIds"]
            ? this.tempValue["_checkedIds"]
            : "";
    }

    private _getSelectedNodeId() {
        return this.tempValue["_selectedNode"]
            ? this.tempValue["_selectedNode"]
            : {};
    }

    private async _execute(url, method, body) {
        return this._http[method](url, body).toPromise();
    }

    /**
     * 弹出对话框
     * @param option
     */
    dialog(option) {
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
    windowDialog(option) {
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
    uploadDialog(option) {
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
    formDialog(option) {
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
    formBatchDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showBatchForm(this.config.formDialog[index]);
        }
    }

    // endregion
}

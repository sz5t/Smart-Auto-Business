import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Type
} from "@angular/core";
import {
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES
} from "@core/relative-Service/BsnTableStatus";
import { ApiService } from "@core/utility/api-service";
import { CommonTools } from "@core/utility/common-tools";
import { CacheService } from "@delon/cache";
import { FormResolverComponent } from "@shared/resolver/form-resolver/form-resolver.component";
import { LayoutResolverComponent } from "@shared/resolver/layout-resolver/layout-resolver.component";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { Observable, Observer, Subscription } from "rxjs";
import { GridBase } from "./../grid.base";
import { stringify } from "querystring";
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent
};
@Component({
    selector: "bsn-tree-table,[bsn-tree-table]",
    templateUrl: "./bsn-tree-table.component.html",
    styles: [
        `
            .table-operations {
                margin-bottom: 16px;
            }
            .table-operations > button {
                margin-right: 8px;
            }
            .selectedRow {
                color: blue;
            }
        `
    ]
})
export class BsnTreeTableComponent extends GridBase
    implements OnInit, OnDestroy {
    @Input()
    config;
    @Input()
    permissions = [];
    // @Input() ref;
    @Input()
    initData;
    @Input()
    casadeData; // 级联配置 liu 20181023
    @Input()
    value;
    @Input()
    bsnData;
    //  分页默认参数
    loading = false;
    total = 1;

    //  表格操作
    allChecked = false;
    indeterminate = false;
    is_Search;
    search_Row;

    /**
     * 数据源
     */
    // dataList = [];
    /**
     * 展开数据行
     */
    expandDataCache = {};
    /**
     * 待编辑的行集合
     */
    // dataList = [];

    editCache = {};
    // editCache;
    treeData = [];
    treeDataOrigin = [];

    //  业务对象
    _selectRow = {};
    _searchParameters = {};
    rowContent = {};
    dataSet = {};
    checkedCount = 0;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;

    // 下拉属性 liu
    is_Selectgrid = true;
    cascadeValue = {}; // 级联数据
    selectGridValueName;
    _beforeOperationMap: Map<string, any[]>;

    constructor(
        private _api: ApiService,
        private _msg: NzMessageService,
        private _modal: NzModalService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiService = this._api;
        this.message = this._msg;
        this.modalService = this._modal;
        if (this.initData) {
            this.initValue = this.initData;
        }

        this.callback = focusId => {
            this._cancelEditRows();
            this.load();
        };
    }

    // 生命周期事件
    ngOnInit() {
        this.permission = this.permissions;
        if (this.casadeData) {
            for (const key in this.casadeData) {
                // 临时变量的整理
                if (key === "cascadeValue") {
                    for (const casekey in this.casadeData["cascadeValue"]) {
                        if (
                            this.casadeData["cascadeValue"].hasOwnProperty(
                                casekey
                            )
                        ) {
                            this.cascadeValue[casekey] = this.casadeData[
                                "cascadeValue"
                            ][casekey];
                        }
                    }
                }
            }
        }
        this.resolverBeforeOperation();
        // liu 20181022 特殊处理行定位
        if (this.config.isSelectGrid) {
            this.is_Selectgrid = false;
        }
        this.resolverRelation();
        if (this._cacheService) {
            this.cacheValue = this._cacheService;
        }
        this._getContent();
        if (this.config.dataSet) {
            (async () => {
                for (
                    let i = 0, len = this.config.dataSet.length;
                    i < len;
                    i++
                ) {
                    const url = this.buildURL(
                        this.config.dataSet[i].ajaxConfig.url
                    );
                    const params = this.buildParameters(
                        this.config.dataSet[i].ajaxConfig.params
                    );
                    const data = await this.get(url, params);
                    if (data.length > 0 && data.status === 200) {
                        if (this.config.dataSet[i].fields) {
                            const dataSetObjs = [];
                            data.data.map(d => {
                                const setObj = {};
                                this.config.dataSet[i].fields.map(fieldItem => {
                                    if (d[fieldItem.field]) {
                                        setObj[fieldItem.name] =
                                            d[fieldItem.field];
                                    }
                                });
                                dataSetObjs.push(setObj);
                            });
                            this.dataSet[
                                this.config.dataSet[i].name
                            ] = dataSetObjs;
                        } else {
                            this.dataSet[this.config.dataSet[i].name] =
                                data.Data;
                        }
                    }
                }
            })();
        }
        this.pageSize = this.config.pageSize
            ? this.config.pageSize
            : this.pageSize;
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            }
        } else {
            this.load();
        }
    }
    ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    // 解析消息
    private resolverRelation() {
        // 注册按钮状态触发接收器
        this._statusSubscription = this.stateEvents.subscribe(updateState => {
            if (updateState._viewId === this.config.viewId) {
                const option = updateState.option;
                switch (updateState._mode) {
                    case BSN_COMPONENT_MODES.CREATE:
                        this._addNewRow();
                        break;
                    case BSN_COMPONENT_MODES.CREATE_CHILD:
                        this._addNewChildRow();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        this._editRowData();
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        this._cancelEditRows();
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        this.saveRow();
                        break;
                    case BSN_COMPONENT_MODES.DELETE:
                        this.deleteRow();
                        break;
                    case BSN_COMPONENT_MODES.DIALOG:
                        this.dialog(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE:
                        this._getAddedAndUpdatingRows();
                        this.resolver(option.ajaxConfig);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE_SELECTED:
                        this.executeSelectedRow(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE_CHECKED:
                        this.executeCheckedRow(option);
                        break;
                    case BSN_COMPONENT_MODES.WINDOW:
                        this.windowDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        !this.beforeSelectedRowOperation(option) &&
                            this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.searchRow(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.searchRow(option);
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
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, "selectRow", () => {
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
            this.config.componentType.child === true
        ) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(
                cascadeEvent => {
                    // 解析子表消息配置
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
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    //  功能实现
    private load() {
        this.loading = true;
        this.allChecked = false;
        this.checkedCount = 0;
        const url = this.buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this.buildParameters(this.config.ajaxConfig.params),
            ...this.buildPaging(this.config.pagination),
            ...this.buildFilter(this.config.ajaxConfig.filter),
            ...this.buildSort(),
            ...this.buildColumnFilter(),
            ...this.buildFocusId(),
            ...this.buildRecursive(),
            ...this.buildSearch()
        };
        this.expandDataCache = {};
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.status === 200) {
                if (loadData.data && loadData.data.rows) {
                    this.treeDataOrigin = loadData.data.rows;
                    this.treeData = CommonTools.deepCopy(loadData.data.rows);
                    this.treeData.map(row => {
                        row["key"] = row[this.config.keyId]
                            ? row[this.config.keyId]
                            : "Id";
                        this.expandDataCache[row.Id] = this.convertTreeToList(
                            row
                        );
                    });
                    this.dataList = this._getAllItemList();
                    this._updateEditCache();
                    this.total = loadData.data.total;
                    if (this.is_Search) {
                        this.createSearchRow();
                    }
                } else {
                    // this._updateEditCacheByLoad([]);
                    this.dataList = loadData.data;
                    this.total = 0;
                    if (this.is_Search) {
                        this.createSearchRow();
                    }
                }
            } else {
                // this._updateEditCacheByLoad([]);
                this.dataList = [];
                this.total = 0;
                if (this.is_Search) {
                    this.createSearchRow();
                }
            }
            // liu
            if (!this.is_Selectgrid) {
                this.setSelectRow();
            }
            this.loading = false;
        })();
    }
    // 获取 文本值，当前选中行数据
    async loadByselect(
        ajaxConfig,
        componentValue?,
        selecttempValue?,
        cascadeValue?
    ) {
        const url = this.buildURL(ajaxConfig.url);
        const params = {
            ...this._buildParametersByselect(
                ajaxConfig.params,
                componentValue,
                selecttempValue,
                cascadeValue
            )
        };
        let selectrowdata = {};
        const loadData = await this._load(url, params);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                if (loadData.data.length > 0) {
                    selectrowdata = loadData.data[0];
                }
            }
        }
        console.log("异步获取当前值:", selectrowdata);
        return selectrowdata;
    }
    // 构建获取文本值参数
    private _buildParametersByselect(
        paramsConfig,
        componentValue?,
        selecttempValue?,
        cascadeValue?
    ) {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: selecttempValue,
                componentValue: componentValue,
                initValue: this.initValue,
                // cacheValue: this.cacheService,
                cascadeValue: cascadeValue
            });
        }
        return params;
    }
    /**
     * 更新编辑数据,并设置为取消状态
     */
    private _updateEditCache(): void {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                if (item.key) {
                    this.editCache[item.key] = {
                        edit: false,
                        data: { ...item }
                    };
                }
            }
        });
    }

    /**
     * 设置数据状态为编辑
     * @param key
     */
    private _startRowEdit(key: string): void {
        this.editCache[key]["edit"] = true;
    }

    /**
     * 创建新行数据
     */
    _createNewRowData(parentId?) {
        const newRow = { ...this.rowContent };
        const fieldIdentity = CommonTools.uuID(6);
        newRow["key"] = fieldIdentity;
        newRow["Id"] = fieldIdentity;
        newRow["checked"] = true;
        newRow["row_status"] = "adding";
        if (parentId) {
            newRow["parentId"] = parentId;
        }
        return newRow;
    }
    /**
     * 添加根节点行
     */
    private _addNewRow() {
        // 初始化新行数据
        const newRow = this._createNewRowData();

        this.expandDataCache[newRow["Id"]] = [newRow];
        // 数据添加到数据列表中
        this.dataList = [newRow, ...this.dataList];
        // 数据添加到树结构数据中
        this.treeData = [newRow, ...this.treeData];

        // 更新编辑行对象
        this._updateEditCache();
        // 打开行编辑状态
        this._startRowEdit(newRow["Id"]);

        return true;
    }

    /**
     * 添加子节点行
     */
    private _addNewChildRow() {
        if (this.selectedItem) {
            const parentId = this.selectedItem[
                this.config.keyId ? this.config.keyId : "Id"
            ];
            const newRow = this._createNewRowData(parentId);
            // 数据添加到具体选中行的下方
            this.dataList = this._setChildRow(this.dataList, newRow, parentId);
            const rootId = this.findRootId(this.dataList, parentId);
            // 数据添加到树结构中
            const newTreeData = this._addTreeData(
                parentId,
                newRow,
                this.treeData
            );
            this.treeData = JSON.parse(JSON.stringify(newTreeData));

            // 数据添加到数据列表中
            this.expandDataCache[rootId] = this.convertTreeToList(
                this.treeData.filter(item => item.Id === rootId)[0]
            );

            this._updateEditCache();
            this._startRowEdit(newRow["Id"]);

            for (const r in this.expandDataCache) {
                this.expandDataCache[r].map(row => {
                    row["selected"] = false;
                });
            }
        } else {
            console.log("未选择任何行,无法添加下级");
            return false;
        }
    }

    // 定位行选中 liu 20181024

    setSelectRow() {
        // console.log('setSelectRow', this.value);

        // 遍历
        for (const key in this.expandDataCache) {
            if (this.expandDataCache.hasOwnProperty(key)) {
                if (this.expandDataCache[key]) {
                    this.expandDataCache[key].forEach(element => {
                        element.selected = false; // 取消行选中
                    });
                    this.expandDataCache[key].forEach(element => {
                        if (element["Id"] === this.value) {
                            element.selected = true; // 有值行选中
                            this.selectedItem = element;
                        }
                    });
                }
            }
        }
    }

    /**
     * 递归向数据源中添加新行数据
     * @param parentId
     * @param newRowData
     * @param parent
     */
    private _addTreeData(parentId, newRowData, parent) {
        if (parentId) {
            // 子节点数据
            for (let i = 0, len = parent.length; i < len; i++) {
                if (parentId === parent[i].Id) {
                    if (!parent[i]["children"]) {
                        parent[i]["children"] = [];
                    }
                    parent[i]["children"].push(newRowData);
                    return parent;
                } else {
                    if (
                        parent[i]["children"] &&
                        parent[i]["children"].length > 0
                    ) {
                        this._addTreeData(
                            parentId,
                            newRowData,
                            parent[i]["children"]
                        );
                    }
                }
            }
        }
        return parent;
    }

    /**
     * 查找根节点ID
     * @param dataList
     * @param Id
     */
    private findRootId(dataList, Id) {
        for (let i = 0, len = dataList.length; i < len; i++) {
            if (dataList[i].Id === Id) {
                return dataList[i]["rootId"]
                    ? dataList[i]["rootId"]
                    : dataList[i]["Id"];
            }
        }
    }

    /**
     * 重新排列数据列表(将添加的新行追加到父节点下的位置)
     * @param dataList
     * @param newRowData
     * @param parentId
     */
    private _setChildRow(dataList, newRowData, parentId) {
        const list = [];
        if (dataList) {
            for (let i = 0, len = dataList.length; i < len; i++) {
                list.push(dataList[i]);
                if (dataList[i]["Id"] && dataList[i]["Id"] === parentId) {
                    list.push(newRowData);
                }
            }
        }
        return list;
    }

    private _getAddedAndUpdatingRows() {
        const checkedRows = this._getCheckedRowStatusMap();
        this.addedTreeRows = [];
        this.editTreeRows = [];
        checkedRows.forEach(item => {
            if (item.status === "adding") {
                this.addedTreeRows.push(this.editCache[item.key].data);
            } else if (item.status === "updating") {
                this.editTreeRows.push(this.editCache[item.key].data);
            }
        });
    }

    private _cancelEditRows() {
        const cancelRowMap = this._getCheckedRowStatusMap();

        // 删除dataList中数据
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            const key = this.dataList[i].key;
            const checkedRowStatus = cancelRowMap.get(key);
            if (checkedRowStatus && checkedRowStatus.status === "adding") {
                if (this.editCache[key]) {
                    delete this.editCache[key];
                }
                this.dataList.splice(i, 1);
                // 删除treeData中数据的临时数据或者更改原始数据中的编辑状态
                this._cancelTreeDataByKey(this.treeData, key);
                i--;
                len--;
            } else if (
                checkedRowStatus &&
                checkedRowStatus.status === "updating"
            ) {
                this._cancelEdit(key);
            }
        }

        // 刷新数据
        this.treeData.map(row => {
            row["key"] = row[this.config.keyId] ? row[this.config.keyId] : "Id";
            this.expandDataCache[row.Id] = this.convertTreeToList(row);
        });

        this.refChecked();
        return true;
    }

    private _cancelTreeDataByKey(treeData, key) {
        for (let j = 0, jlen = treeData.length; j < jlen; j++) {
            if (treeData[j]["Id"] === key) {
                treeData.splice(j, 1);
                j--;
                jlen--;
                return;
            } else {
                if (
                    treeData[j]["children"] &&
                    treeData[j]["children"].length > 0
                ) {
                    this._cancelTreeDataByKey(treeData[j]["children"], key);
                }
            }
        }
    }

    private selectRow(data, $event) {
        if (
            $event.srcElement.type === "checkbox" ||
            $event.target.type === "checkbox"
        ) {
            return;
        }
        $event.stopPropagation();
        for (const r in this.expandDataCache) {
            this.expandDataCache[r].map(row => {
                row["selected"] = false;
            });
        }
        data["selected"] = true;
        this.selectedItem = data;
        // liu  子组件
        if (!this.is_Selectgrid) {
            this.value = this.selectedItem[
                this.config.selectGridValueName
                    ? this.config.selectGridValueName
                    : "Id"
            ];
        }
    }

    private _getCheckedRowStatusMap(): Map<
        string,
        { key: string; status: string }
    > {
        const cancelRowMap: Map<
            string,
            { key: string; status: string }
        > = new Map();
        this.treeData.map(dataItem => {
            this.expandDataCache[dataItem.Id].map(item => {
                if (item["checked"]) {
                    cancelRowMap.set(item.Id, {
                        key: item.Id,
                        status: item["row_status"]
                            ? item["row_status"]
                            : "updating"
                    });
                }
            });
        });
        return cancelRowMap;
    }

    private _editRowData() {
        // debugger;
        const checkedRowStatusMap = this._getCheckedRowStatusMap();
        checkedRowStatusMap.forEach(item => {
            if (item.status === "updating") {
                this._startRowEdit(item.key);
            }
        });

        // this.dataList.forEach(item => {
        //     if (item.checked) {
        //         if (item['row_status'] && item['row_status'] === 'adding') {

        //         } else if (item['row_status'] && item['row_status'] === 'search') {

        //         } else {
        //             item['row_status'] = 'updating';
        //         }
        //         this._startRowEdit(item.key);
        //     }
        // });
        return true;
    }
    /** --------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load();
    }

    //  服务区端交互
    private async _load(url, params) {
        return this.apiService.get(url, params).toPromise();
    }

    private async post(url, body) {
        return this.apiService.post(url, body).toPromise();
    }

    private async put(url, body) {
        return this.apiService.put(url, body).toPromise();
    }

    private async delete(url, params) {
        return this.apiService.delete(url, params).toPromise();
    }

    private async get(url, params) {
        return this.apiService.get(url, params).toPromise();
    }

    //  格式化单元格
    setCellFont(value, format) {
        let fontColor = "";
        if (format) {
            format.map(color => {
                if (color.value === value) {
                    fontColor = color.fontcolor;
                }
            });
        }

        return fontColor;
    }

    searchRow(option) {
        if (option["type"] === "addSearchRow") {
            this.addSearchRow();
        } else if (option["type"] === "cancelSearchRow") {
            this.cancelSearchRow();
        }
    }

    addSearchRow() {
        let isSearch = true;
        for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i]["row_status"] === "search") {
                isSearch = false;
            }
        }
        if (isSearch) {
            this.createSearchRow();
            this.is_Search = true;
        } else {
            // 执行行查询
            this.load(); // 查询后将页面置1
            // 执行行查询
            let len = this.dataList.length;
            for (let i = 0; i < len; i++) {
                if (this.dataList[i]["row_status"] === "search") {
                    this.dataList.splice(
                        this.dataList.indexOf(this.dataList[i]),
                        1
                    );
                    i--;
                    len--;
                }
            }
            this.is_Search = false;
            this.search_Row = {};
        }
    }

    // 生成查询行
    createSearchRow() {
        if (this.is_Search) {
            this.dataList = [this.search_Row, ...this.dataList];
            // this.dataList.push(this.rowContent);
            this._updateEditCache();
            this._startRowEdit(this.search_Row["key"].toString());
        } else {
            const newSearchContent = JSON.parse(
                JSON.stringify(this.rowContent)
            );
            const fieldIdentity = CommonTools.uuID(6);
            newSearchContent["key"] = fieldIdentity;
            newSearchContent["checked"] = false;
            newSearchContent["row_status"] = "search";

            this.expandDataCache[fieldIdentity] = [newSearchContent];
            this.dataList = [newSearchContent, ...this.dataList];
            // this.dataList = [newSearchContent, ...this.dataList];
            this._addEditCache();
            this._startAdd(fieldIdentity);

            this.search_Row = newSearchContent;
        }
    }

    // 取消查询
    cancelSearchRow() {
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            if (this.dataList[i]["row_status"] === "search") {
                delete this.editCache[this.dataList[i].key];
                this.dataList.splice(
                    this.dataList.indexOf(this.dataList[i]),
                    1
                );
                i--;
                len--;
            }
        }

        for (let i = 0, len = this.dataList.length; i < len; i++) {
            if (this.dataList[i]["row_status"] === "search") {
                this.dataList.splice(
                    this.dataList.indexOf(this.dataList[i]),
                    1
                );
                i--;
                len--;
            }
        }

        this.is_Search = false;
        this.search_Row = {};
        this.load(); // 查询后将页面置1
        return true;
    }

    //  表格操作
    _getAllItemList() {
        let list = [];
        if (this.expandDataCache) {
            for (const r in this.expandDataCache) {
                list = list.concat([...this.expandDataCache[r]]);
            }
        }
        return list;
    }

    checkAll(value) {
        for (const r in this.expandDataCache) {
            this.expandDataCache[r].map(data => {
                if (!data["disabled"]) {
                    data["checked"] = value;
                }
            });
        }

        this.refChecked();
    }

    refChecked() {
        let allCount = 0;
        // parent count
        this.checkedCount = 0; // = this.dataList.filter(w => w.checked).length;
        // child count
        for (const r in this.expandDataCache) {
            this.checkedCount += this.expandDataCache[r].filter(
                c => c.checked
            ).length;
            allCount += this.expandDataCache[r].length;
        }

        this.allChecked = this.checkedCount === allCount;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
    }

    async saveRow() {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this.dataList.map(item => {
            delete item["$type"];
            if (item.checked && item["row_status"] === "adding") {
                addRows.push(item);
            } else if (item.checked && item["row_status"] === "updating") {
                updateRows.push(item);
            }
        });
        if (addRows.length > 0) {
            // save add;
            isSuccess = await this.executeSave(addRows, "post");
        }

        if (updateRows.length > 0) {
            // update
            isSuccess = await this.executeSave(updateRows, "put");
        }
        return isSuccess;
    }

    async _execute(rowsData, method, postConfig) {
        let isSuccess = false;
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = {};
                    postConfig[i].params.map(param => {
                        if (param.type === "tempValue") {
                            submitItem[param["name"]] = this.tempValue[
                                param["valueName"]
                            ];
                        } else if (param.type === "componentValue") {
                            submitItem[param["name"]] =
                                rowData[param["valueName"]];
                        } else if (param.type === "GUID") {
                        } else if (param.type === "value") {
                            submitItem[param["name"]] = param.value;
                        }
                    });
                    submitData.push(submitItem);
                });
                const response = await this[method](
                    postConfig[i].url,
                    submitData
                );
                if (response && response.status === 200 && response.isSuccess) {
                    this.message.create("success", "保存成功");
                    isSuccess = true;
                } else {
                    this.message.create("error", response.message);
                }
            }
            if (isSuccess) {
                rowsData.map(row => {
                    this._saveEdit(row.key);
                });
                this.load();
            }
        }
        if (isSuccess === true) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId
                )
            );
        }
        return isSuccess;
    }

    async executeSave(rowsData, method) {
        // Todo: 优化配置
        let result;
        this.config.toolbar.forEach(bar => {
            if (bar.group && bar.group.length > 0) {
                const index = bar.group.findIndex(
                    item => item.name === "saveRow"
                );
                if (index !== -1) {
                    const postConfig = bar.group[index].ajaxConfig[method];
                    result = this._execute(rowsData, method, postConfig);
                }
            }
            if (
                bar.dropdown &&
                bar.dropdown.buttons &&
                bar.dropdown.buttons.length > 0
            ) {
                const index = bar.dropdown.buttons.findIndex(
                    item => item.name === "saveRow"
                );
                if (index !== -1) {
                    const postConfig =
                        bar.dropdown.buttons[index].ajaxConfig[method];
                    result = this._execute(rowsData, method, postConfig);
                }
            }
        });

        return result;
    }

    async executeDelete(ids) {
        let result;
        if (ids && ids.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const index = bar.group.findIndex(
                        item => item.name === "deleteRow"
                    );
                    if (index !== -1) {
                        const deleteConfig =
                            bar.group[index].ajaxConfig["delete"];
                        result = this._executeDelete(deleteConfig, ids);
                    }
                }
                if (
                    bar.dropdown &&
                    bar.dropdown.buttons &&
                    bar.dropdown.buttons.length > 0
                ) {
                    const index = bar.dropdown.buttons.findIndex(
                        item => item.name === "deleteRow"
                    );
                    if (index !== -1) {
                        const deleteConfig =
                            bar.dropdown.buttons[index].ajaxConfig["delete"];
                        result = this._executeDelete(deleteConfig, ids);
                    }
                }
            });
        }

        return result;
    }

    async _executeDelete(deleteConfig, ids) {
        let isSuccess;
        if (deleteConfig) {
            for (let i = 0, len = deleteConfig.length; i < len; i++) {
                const params = {
                    _ids: ids.join(",")
                };
                const response = await this["delete"](
                    deleteConfig[i].url,
                    params
                );
                if (response && response.status === 200 && response.isSuccess) {
                    this.message.create("success", "删除成功");
                    isSuccess = true;
                } else {
                    this.message.create("error", response.message);
                }
            }
            if (isSuccess) {
                this.load();
            }
        }

        if (isSuccess === true) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId
                )
            );
        }
        return isSuccess;
    }

    executeSelectedRow(option) {
        if (!this._selectRow) {
            this.message.create("info", "请选选择要执行的数据");
            return false;
        }
        this.modalService.confirm({
            nzTitle: "是否将选中的数据执行当前操作？",
            nzContent: "",
            nzOnOk: () => {
                if (this._selectRow["row_status"] === "adding") {
                    this.message.create("info", "当前数据未保存无法进行处理");
                    return false;
                }

                this.executeSelectedAction(this._selectRow, option);
            },
            nzOnCancel() {}
        });
    }

    executeCheckedRow(option) {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this.message.create("info", "请选择要执行的数据");
            return false;
        }
        this.modalService.confirm({
            nzTitle: "是否将选中的数据执行当前操作？",
            nzContent: "",
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                this.dataList.forEach(item => {
                    // if (item.checked === true && item['row_status'] === 'adding') {
                    //     // 删除新增临时数据
                    //     newData.push(item.key);
                    // }
                    if (
                        item.checked === true &&
                        item["row_status"] !== "adding" &&
                        item["row_status"] !== "updating" &&
                        item["row_status"] !== "search"
                    ) {
                        // 删除服务端数据
                        serverData.push(item);
                    }
                });
                // if (newData.length > 0) {
                //     newData.forEach(d => {
                //         this.dataList.splice(this.dataList.indexOf(d), 1);
                //     });
                // }
                if (serverData.length > 0) {
                    this.executeCheckedAction(serverData, option);
                }
            },
            nzOnCancel() {}
        });
    }

    async executeSelectedAction(selectedRow, option) {
        let isSuccess;
        if (selectedRow) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.findIndex(
                        item => item.action === "EXECUTE_SELECTED"
                    );
                    const index = execButtons.findIndex(
                        item => (item.actionName = option.name)
                    );
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(
                            selectedRow,
                            option,
                            cfg
                        );
                    }
                }
                if (
                    bar.dropdown &&
                    bar.dropdown.buttons &&
                    bar.dropdown.buttons.length > 0
                ) {
                    const execButtons = bar.dropdown.button.findIndex(
                        item => item.action === "EXECUTE_SELECTED"
                    );
                    const index = execButtons.findIndex(
                        item => (item.actionName = option.name)
                    );
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(
                            selectedRow,
                            option,
                            cfg
                        );
                    }
                }
            });
        }
        return isSuccess;
    }

    async _executeSelectedAction(selectedRow, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                const newParam = {};
                cfg[i].params.forEach(param => {
                    newParam[param["name"]] = selectedRow[param["valueName"]];
                });
                const response = await this[option.type](cfg[i].url, newParam);
                if (response && response.status === 200 && response.isSuccess) {
                    this.message.create("success", "执行成功");
                    isSuccess = true;
                } else {
                    this.message.create("error", response.message);
                }
            }
            if (isSuccess) {
                this.load();
            }
        }
        if (isSuccess === true) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId
                )
            );
        }
    }

    async executeCheckedAction(items, option) {
        let isSuccess;
        if (items && items.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.findIndex(
                        item => item.action === "EXECUTE_CHECKED"
                    );
                    const index = execButtons.findIndex(
                        item => (item.actionName = option.name)
                    );
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(
                            items,
                            option,
                            cfg
                        );
                    }
                }
                if (
                    bar.dropdown &&
                    bar.dropdown.buttons &&
                    bar.dropdown.buttons.length > 0
                ) {
                    const execButtons = bar.dropdown.button.findIndex(
                        item => item.action === "EXECUTE_CHECKED"
                    );
                    const index = execButtons.findIndex(
                        item => (item.actionName = option.name)
                    );
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(
                            items,
                            option,
                            cfg
                        );
                    }
                }
            });
        }
        return isSuccess;
    }

    async _executeCheckedAction(items, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                // 构建参数
                const params = [];
                if (cfg[i].params) {
                    items.forEach(item => {
                        const newParam = {};
                        cfg[i].params.forEach(param => {
                            newParam[param["name"]] = item[param["valueName"]];
                        });
                        params.push(newParam);
                    });
                }
                const response = await this[option.type](cfg[i].url, params);
                if (response && response.status === 200 && response.isSuccess) {
                    this.message.create("success", "执行成功");
                    isSuccess = true;
                } else {
                    this.message.create("error", response.message);
                }
            }
            if (isSuccess) {
                this.load();
            }
        }
        if (isSuccess === true) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId
                )
            );
        }
    }

    deleteRow() {
        this.modalService.confirm({
            nzTitle: "确认删除选中的记录？",
            nzContent: "",
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                const e = this.dataList;
                const d = this.editCache;

                for (let i = 0, len = this.dataList.length; i < len; i++) {
                    if (
                        this.dataList[i].checked &&
                        this.dataList[i]["row_status"] === "adding"
                    ) {
                        if (this.editCache[this.dataList[i].key]) {
                            delete this.editCache[this.dataList[i].key];
                        }
                        this.dataList.splice(this.dataList.indexOf(d), 1);
                        i--;
                        len--;
                    }
                }

                for (let i = 0, len = this.dataList.length; i < len; i++) {
                    if (this.dataList[i]["checked"]) {
                        if (this.dataList[i]["row_status"] === "adding") {
                            this.dataList.splice(
                                this.dataList.indexOf(this.dataList[i]),
                                1
                            );
                            i--;
                            len--;
                        } else if (
                            this.dataList[i]["row_status"] === "search"
                        ) {
                            this.dataList.splice(
                                this.dataList.indexOf(this.dataList[i]),
                                1
                            );
                            this.is_Search = false;
                            this.search_Row = {};
                            i--;
                            len--;
                        } else {
                            serverData.push(this.dataList[i].key);
                        }
                    }
                }

                // const itemList = this.allDataList;
                // itemList.forEach(item => {
                //     if (item.checked === true && item['row_status'] === 'adding') {
                //         // 删除新增临时数据
                //         newData.push(item.key);
                //     }
                //     if (item.checked === true) {
                //         // 删除服务端数据
                //         serverData.push(item.Id);
                //     }
                // });
                // if (newData.length > 0) {
                //     newData.forEach(d => {
                //         itemList.splice(itemList.indexOf(d), 1);
                //     });
                // }
                if (serverData.length > 0) {
                    this.executeDelete(serverData);
                }
            },
            nzOnCancel() {}
        });
    }

    private _deleteEdit(i: string): void {
        const dataSet = this._getAllItemList().filter(d => d.key !== i);
        // 需要特殊处理层级问题
        this.dataList = dataSet;
    }

    // 获取行内编辑是行填充数据
    private _getContent() {
        this.rowContent["key"] = null;
        this.config.columns.forEach(element => {
            const colsname = element.field.toString();
            this.rowContent[colsname] = "";
        });
    }

    // 初始化可编辑的数据结构
    private _initEditDataCache() {
        // this.editCache = {};
        this.editCache = {};
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: { ...item }
                };
            }
        });

        // 将编辑数据帮定至页面
        // this.editCache = this.editCache;
    }

    // 将选中行改变为编辑状态
    updateRow() {
        this.dataList.forEach(item => {
            if (item.checked) {
                if (item["row_status"] && item["row_status"] === "adding") {
                } else if (
                    item["row_status"] &&
                    item["row_status"] === "search"
                ) {
                } else {
                    item["row_status"] = "updating";
                }
                this._startRowEdit(item.key);
            }
        });
        // console.log(this.editCache);
        return true;
    }

    private _saveEdit(key: string): void {
        const itemList = this.dataList;
        const index = itemList.findIndex(item => item.key === key);
        let checked = false;
        let selected = false;

        if (itemList[index].checked) {
            checked = itemList[index].checked;
        }
        if (itemList[index].selected) {
            selected = itemList[index].selected;
        }

        itemList[index] = this.editCache[key].data;
        itemList[index].checked = checked;
        itemList[index].selected = selected;

        this.editCache[key].edit = false;

        this.editCache = this.editCache;
    }

    cancelRow() {
        // debugger;
        // for (let i = 0, len = this.dataList.length; i < len; i++) {
        //     if (this.dataList[i].checked) {
        //         if (this.dataList[i]['row_status'] === 'adding') {
        //             if (this.editCache[this.dataList[i].key]) {
        //                 delete this.editCache[this.dataList[i].key];
        //             }
        //             this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
        //             i--;
        //             len--;
        //         }

        //     }
        // }
        const cancelKeys = [];
        this.treeData.map(dataItem => {
            this.expandDataCache[dataItem.Id].map(item => {
                if (item["checked"]) {
                    cancelKeys.push(item["key"]);
                }
            });
        });
        // const cancelList = this.dataList.filter(item => cancelKeys.findIndex(key => key === item.key) > -1);

        for (let i = 0, len = this.dataList.length; i < len; i++) {
            const __key = this.dataList[i].key;
            if (cancelKeys.findIndex(key => key === __key) > -1) {
                if (this.dataList[i]["row_status"] === "adding") {
                    if (this.editCache[__key]) {
                        delete this.editCache[__key];
                    }
                    this.dataList.splice(
                        this.dataList.indexOf(this.dataList[i]),
                        1
                    );
                    // 删除数结果集中的数据
                    this._cancelTreeDataByKey(this.treeData, __key);

                    i--;
                    len--;
                } else if (this.dataList[i]["row_status"] === "search") {
                    this.dataList.splice(
                        this.dataList.indexOf(this.dataList[i]),
                        1
                    );
                    this.is_Search = false;
                    this.search_Row = {};
                    i--;
                    len--;
                } else {
                    this._cancelEdit(this.dataList[i].key);
                }
            }

            // if (this.dataList[i]['checked']) {
            //     // // const key = this.dataList[i].key;
            //     // // if (this.dataList[i]['row_status'] === 'adding') {
            //     // //     if (this.editCache[key]) {
            //     // //         delete this.editCache[key];
            //     // //     }
            //     // //     this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
            //     // //     // 删除数结果集中的数据
            //     // //     this._cancelTreeDataByKey(this.treeData, key);
            //     // //     i--;
            //     // //     len--;

            //     // } else if (this.dataList[i]['row_status'] === 'search') {
            //     //     this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
            //     //     this.is_Search = false;
            //     //     this.search_Row = {};
            //     //     i--;
            //     //     len--;
            //     // } else {
            //     //     this._cancelEdit(this.dataList[i].key);
            //     // }
            // }
        }
        if (cancelKeys.length > 0) {
            this.treeData.map(row => {
                row["key"] = row[this.config.keyId]
                    ? row[this.config.keyId]
                    : "Id";
                this.expandDataCache[row.Id] = this.convertTreeToList(row);
            });
        }
        this.refChecked();
        return true;
    }

    // private _cancelTreeDataByKey(treeData, key) {
    //     for (let j = 0, jlen = treeData.length; j < jlen; j++) {
    //         if (treeData[j]['key'] === key) {
    //             treeData = treeData.splice(treeData.indexOf(treeData[j], 1));
    //             j--;
    //             jlen--;
    //         } else {
    //             if (treeData[j]['children'] && treeData[j]['children'].length > 0) {
    //                 this._cancelTreeDataByKey(treeData[j]['children'], key);
    //             }
    //         }
    //     }
    // }

    private _cancelEdit(key: string): void {
        const itemList = this.dataList;
        const index = itemList.findIndex(item => item.key === key);
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(JSON.stringify(itemList[index]));
        this.editCache = this.editCache;
    }

    addRow() {
        const rowContentNew = { ...this.rowContent };
        const fieldIdentity = CommonTools.uuID(6);
        rowContentNew["key"] = fieldIdentity;
        rowContentNew["Id"] = fieldIdentity;
        rowContentNew["checked"] = true;
        rowContentNew["row_status"] = "adding";
        // 针对查询和新增行处理
        if (this.is_Search) {
            this.dataList.splice(1, 0, rowContentNew);
        } else {
            this.expandDataCache[fieldIdentity] = [rowContentNew];
            this.dataList = [rowContentNew, ...this.dataList];
            this.treeData = [rowContentNew, ...this.treeData];
            // this.dataList = [rowContentNew, ...this.dataList];
            // this.treeData.map(row => {
            //     row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
            //     this.expandDataCache[row.Id] = this.convertTreeToList(row);
            // });
        }
        // 需要特殊处理层级问题
        // this.dataList.push(this.rowContent);
        this._addEditCache();
        this._startAdd(fieldIdentity);
        return true;
    }

    addChildRow() {
        const rowContentNew = { ...this.rowContent };
        const fieldIdentity = CommonTools.uuID(6);
        let parentId;
        if (this.selectedItem["Id"]) {
            parentId = this.selectedItem["Id"];
        } else {
            console.log("未获取父节点数据");
            return;
        }
        rowContentNew["key"] = fieldIdentity;
        rowContentNew["checked"] = true;
        rowContentNew["row_status"] = "adding";
        rowContentNew["Id"] = fieldIdentity;

        // 向数据集中添加子节点数据
        this._setChildRow(this.treeData, rowContentNew, parentId);
        // this.treeData[0].children.push(rowContentNew);

        // 重新生成树表的数据格式
        // 查找添加节点的数据根节点
        this.treeData.map(row => {
            row["key"] = row[this.config.keyId] ? row[this.config.keyId] : "Id";
            this.expandDataCache[row.Id] = this.convertTreeToList(row);
        });
        this.dataList = [...this._setDataList(this.expandDataCache)];
        this._updateChildRowEditCache();
        this._startChildRowAdd(fieldIdentity);
        return true;
    }

    private _setExpandDataCache(cacheData, newRowData, parentId) {
        if (cacheData) {
            for (const p in cacheData) {
                if (cacheData[p] && cacheData[p].length > 0) {
                    for (let i = 0, len = cacheData[p].length; i < len; i++) {
                        if (cacheData[p][i]["Id"] === parentId) {
                            // 向该节点下添加下级节点
                            if (!cacheData[p][i]["children"]) {
                                cacheData[p][i]["children"] = [];
                            }
                            newRowData["parent"] = cacheData[p][i];
                            cacheData[p][i]["children"].push(newRowData);
                            return cacheData;
                        } else {
                            if (
                                cacheData[p][i]["children"] &&
                                cacheData[p][i].length > 0
                            ) {
                                this._setExpandChildData(
                                    cacheData[p][i]["children"],
                                    newRowData,
                                    parentId
                                );
                            }
                        }
                    }
                }
            }
        }
        return cacheData;
    }
    private _setExpandChildData(parentRowData, newRowData, parentId) {
        for (let i = 0, len = parentRowData.length; i < len; i++) {
            if (parentRowData["Id"] === parentId) {
                // 向该节点下添加下级节点
                if (!parentRowData[i]["children"]) {
                    parentRowData[i]["children"] = [];
                }
                newRowData["parent"] = parentRowData[i];
                parentRowData[i]["children"].push(newRowData);
                return parentRowData;
            } else {
                if (
                    parentRowData[i]["children"] &&
                    parentRowData[i].length > 0
                ) {
                    this._setExpandChildData(
                        parentRowData[i]["children"],
                        newRowData,
                        parentId
                    );
                }
            }
        }
    }
    private _setDataList(cacheData) {
        const resultList = [];
        if (cacheData) {
            for (const p in cacheData) {
                if (cacheData && cacheData[p].length > 0) {
                    // for (let i = 0, len = cacheData[p].length; i < len; i++) {
                    //     resultList.push(cacheData[p][i]);
                    //     if (cacheData[p][i]['children'] && cacheData[p][i]['children'].length > 0) {
                    //         resultList.push(...this._setChildDataList(cacheData[p][i]['children']));
                    //     }
                    // }
                    resultList.push({ ...cacheData[p][0] });
                    if (
                        cacheData[p][0]["children"] &&
                        cacheData[p][0]["children"].length > 0
                    ) {
                        resultList.push(
                            ...this._setChildDataList(
                                cacheData[p][0]["children"]
                            )
                        );
                    }
                }
            }
        }
        return resultList;
    }
    private _setChildDataList(parentRowData) {
        const childResultList = [];
        for (let i = 0, len = parentRowData.length; i < len; i++) {
            childResultList.push({ ...parentRowData[i] });
            if (parentRowData[i]["children"] && parentRowData[i].length > 0) {
                childResultList.push(
                    ...this._setChildDataList(parentRowData[i]["children"])
                );
            }
        }
        return childResultList;
    }

    private _addEditCache(): void {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                if (item.key) {
                    this.editCache[item.key] = {
                        edit: false,
                        data: { ...item }
                    };
                }
            }
        });
        this.editCache = this.editCache;
    }

    private _startAdd(key: string): void {
        this.editCache[key]["edit"] = true;
    }

    private _updateChildRowEditCache() {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                if (item.key) {
                    this.editCache[item.key] = {
                        edit: false,
                        data: { ...item }
                    };
                }
            }
        });
    }

    private _startChildRowAdd(key: string) {
        this.editCache[key]["edit"] = true;
    }

    private _startChildRowAddRecurse() {}

    private _startChildRowaddRecurse_2() {}

    valueChange(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    expandChange(array: any[], data: any, $event: boolean) {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    d["key"] = d[this.config.keyId];
                    const target = array.find(
                        a => a[this.config.keyId] === d["key"]
                    );
                    if (target) {
                        target["expand"] = false;
                        this.expandChange(array, target, false);
                    }
                });
            } else {
                return;
            }
        }

        // if ($event === false) {
        //     if (data.Children) {
        //         data.Children.forEach(d => {
        //             const target = array.find(a => a.key === d.key);
        //             target.expand = false;
        //             this.collapse(array, target, false);
        //         });
        //     } else {
        //         return;
        //     }
        // } else {
        //     console.log('点击树节点展开->异步请求');
        //     // data.children =  await this.expandLoad(data);
        //     this.dataList[0]['children'] = await this.expandLoad(data);
        //     console.log('组装结果', data.children);
        //     if (data.Children) {
        //         data.Children.forEach(d => {
        //             // const target = array.find(a => a.key === d.key);
        //             // target['expand'] = true;
        //             // this.collapse(array, target, false);
        //         });
        //     } else {
        //         return;
        //     }
        // }

        // console.log('最终展示有关的数据', this.expandDataCache);
    }

    convertTreeToList(root: object): any[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: true });
        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        ...node.children[i],
                        level: node.level + 1,
                        expand: true,
                        parent: node,
                        key: node.children[i][this.config.keyId],
                        rootId: root["Id"]
                    });
                }
            }
        }
        return array;
    }

    visitNode(node: any, hashMap: object, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    dialog(option) {
        if (this.config.dialog && this.config.dialog.length > 0) {
            const index = this.config.dialog.findIndex(
                item => item.name === option.actionName
            );
            this.showForm(this.config.dialog[index]);
        }
    }

    windowDialog(option) {
        console.log("option:", option);
        if (this.config.windowDialog && this.config.windowDialog.length > 0) {
            const index = this.config.windowDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showLayout(this.config.windowDialog[index]);
        }
    }

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
     * 操作前置判断
     * option: type, name, actionName, ajaxConfig
     */
    beforeSelectedRowOperation(option) {
        let result = false;
        if (this._beforeOperationMap.has(option.name)) {
            const op_status = this._beforeOperationMap.get(option.name);
            op_status.forEach(statusItem => {
                const conditionResult = this.handleOperationConditions(
                    statusItem.conditions
                );
                const actionResult = this.handleOperationAction(
                    conditionResult,
                    statusItem.action
                );
                if (actionResult) {
                    result = true;
                    return true;
                }
                result = actionResult;
            });
        }
        return result;
    }

    handleOperationConditions(conditions) {
        const orResult = [];
        conditions.forEach(elements => {
            // 解析‘与’的关系条件
            elements.forEach(item => {
                let andResult = true;
                // 选中行的解析处理
                switch (item.checkType) {
                    case "value":
                        andResult = this.matchValueCondition(
                            this.selectedItem,
                            item
                        );
                        break;
                    case "regexp":
                        andResult = this.matchRegexpCondition(
                            this.selectedItem,
                            item
                        );
                        break;
                }
                orResult.push(andResult);
            });
            // 解析’或‘的关系条件
        });
        return orResult;
    }

    /**
     * 值匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    matchValueCondition(dataItem, statusItem) {
        let result = true;
        if (dataItem) {
            if (dataItem[statusItem["name"]] === statusItem["value"]) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    /**
     * 正则表达匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    matchRegexpCondition(dataItem, statusItem) {
        let result = true;
        if (dataItem) {
            const reg = new RegExp(statusItem.value ? statusItem.value : "");
            if (reg.test(dataItem[statusItem["name"]])) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    handleOperationAction(actionResult, action) {
        let result = true;
        if (action) {
            switch (action.execute) {
                case "prevent":
                    if (actionResult.some(item => (item = true))) {
                        this.beforeOperationMessage(action);
                        result = true;
                    } else {
                        result = false;
                    }
                    break;
                case "continue":
                    if (actionResult.every(false)) {
                        result = false;
                    } else {
                        this.beforeOperationMessage(action);
                        result = true;
                    }
                    break;
            }
        }

        return result;
    }

    beforeOperationMessage(action) {
        if (action["type"] === "confirm") {
            this.modalService.confirm({
                nzTitle: action["title"],
                nzContent: action["message"],
                nzOnOk: () => {
                    // 调用后续操作
                },
                nzOnCancel() {}
            });
        } else {
            this.message[action["type"]](action.message);
        }
    }

    beforeCheckedRowOperation(conditions) {
        conditions.forEach(elements => {
            // 解析‘与’的关系条件
            elements.forEach(item => {
                // 勾选中行的解析处理
            });

            // 解析’或‘的关系条件
        });
    }

    resolverBeforeOperation() {
        this._beforeOperationMap = new Map();
        if (
            this.config.beforeOperation &&
            Array.isArray(this.config.beforeOperation) &&
            this.config.beforeOperation.length > 0
        ) {
            this.config.beforeOperation.forEach(element => {
                this._beforeOperationMap.set(element.name, element.status);
            });
        }
    }
}

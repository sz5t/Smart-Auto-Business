import { ApiService } from './../../../core/utility/api-service';
import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Type,
    AfterViewInit
} from '@angular/core';
import {
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES
} from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
import { CacheService } from '@delon/cache';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable, Observer, Subscription } from 'rxjs';
import { GridBase } from '../grid.base';
import { BeforeOperation } from '../before-operation.base';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent
};
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-async-tree-table,[bsn-async-tree-table]',
    templateUrl: './bsn-treeTable.component.html',
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
export class BsnAsyncTreeTableComponent extends GridBase
    implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public permissions = [];
    @Input()
    public initData;
    @Input()
    public casadeData; // 级联配置 liu 20181023
    @Input()
    public value;
    @Input()
    public bsnData;
    //  分页默认参数
    public loading = false;
    public total = 1;

    //  表格操作
    public allChecked = false;
    public indeterminate = false;
    public is_Search;
    public search_Row;
    public changeConfig_new = {};
    // 级联
    public cascadeList = {};
    /**
     * 数据源
     */
    // dataList = [];
    /**
     * 展开数据行
     */
    public expandDataCache = {};
    /**
     * 待编辑的行集合
     */
    // dataList = [];

    public editCache = {};
    // editCache;
    public treeData = [];
    public treeDataOrigin = [];

    //  业务对象
    public _selectRow = {};
    public _searchParameters = {};
    public rowContent = {};
    public dataSet = {};
    public checkedCount = 0;

    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;

    // 下拉属性 liu
    public is_Selectgrid = true;
    public cascadeValue = {}; // 级联数据
    public selectGridValueName;

    public beforeOperation;
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
        this.baseMessage = this._msg;
        this.baseModal = this._modal;
        if (this.initData) {
            this.initValue = this.initData;
        }
        this.apiResource = this._api;

        this.callback = focusId => {
            // this._cancelEditRows();
            this.load();
        };
    }

    // 生命周期事件
    public ngOnInit() {
        this.cfg = this.config;
        this.permission = this.permissions;
        if (this.config.select) {
            this.config.select.forEach(selectItem => {
                this.config.columns.forEach(columnItem => {
                    if (columnItem.editor) {
                        if (columnItem.editor.field === selectItem.name) {
                            // if (selectItem.type === 'selectGrid') {
                            columnItem.editor.options['select'] = selectItem.config;
                            // }
                        }
                    }
                });
            });
        }
        // 初始化级联
        this.caseLoad();
        if (this.casadeData) {
            for (const key in this.casadeData) {
                // 临时变量的整理
                if (key === 'cascadeValue') {
                    for (const casekey in this.casadeData['cascadeValue']) {
                        if (
                            this.casadeData['cascadeValue'].hasOwnProperty(
                                casekey
                            )
                        ) {
                            this.cascadeValue[casekey] = this.casadeData[
                                'cascadeValue'
                            ][casekey];
                        }
                    }
                }
            }
        }
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
                    const data = await this.apiResource.get(url, params).toPromise();
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
    public ngAfterViewInit() {
        // 初始化前置条件验证对象
        this.beforeOperation = new BeforeOperation({
            config: this.config,
            message: this.baseMessage,
            modal: this.baseModal,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue.get('userInfo').value
                ? this.cacheValue.get('userInfo').value
                : {},
            apiResource: this.apiResource
        });
    }
    public ngOnDestroy() {
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
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.addNewRow();
                        break;
                    case BSN_COMPONENT_MODES.CREATE_CHILD:
                    
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.addNewChildRow();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        this.beforeOperation.operationItemData = [
                            ...this.getAddedRows(),
                            ...this.getEditedRows()
                        ];
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this._editRowData();
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        this._cancelEditRows();
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.saveRow();
                        break;
                    case BSN_COMPONENT_MODES.DELETE:
                        this.beforeOperation.operationItemsData = this.getCheckedItems();
                        !this.beforeOperation.beforeItemsDataOperation(
                            option
                        ) && this.deleteRow();
                        break;
                    case BSN_COMPONENT_MODES.DIALOG:
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.dialog(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE:
                        this._getAddedAndUpdatingRows();
                        this.resolver(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE_SELECTED:
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.executeSelectedRow(option);
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE_CHECKED:
                        this.beforeOperation.operationItemsData = this.getCheckedItems();
                        !this.beforeOperation.beforeItemsDataOperation(
                            option
                        ) && this.executeCheckedRow(option);
                        break;
                    case BSN_COMPONENT_MODES.WINDOW:
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.windowDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.searchRow(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.searchRow(option);
                        break;
                    case BSN_COMPONENT_MODES.UPLOAD:
                        this.beforeOperation.operationItemData = this.selectedItem;
                        !this.beforeOperation.beforeItemDataOperation(option) &&
                            this.uploadDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM_BATCH:
                        this.beforeOperation.operationItemsData = this.getCheckedItems();
                        !this.beforeOperation.beforeItemsDataOperation(
                            option
                        ) && this.formBatchDialog(option);
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
            this.after(this, 'selectRow', () => {
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
                                        this.tempValue[param['cid']] =
                                            option.data[param['pid']];
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

    // 加载数据
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
            const loadData = await this.apiResource.get(url, params).toPromise();
            if (loadData && loadData.status === 200) {
                if (loadData.data && loadData.data.rows) {
                    this.treeDataOrigin = loadData.data.rows;
                    this.treeData = CommonTools.deepCopy(loadData.data.rows);
                    this.treeData.map(row => {
                        this.setChildExpand(row, 0);
                    });
                    this.dataList = this.treeData;
                    this.total = loadData.data.total;
                }
            }
            // liu
            if (!this.is_Selectgrid) {
                this.setSelectRow();
            }
            this.loading = false;
        })();
    }

    private _setExpandChildData(parentRowData, newRowData, parentId) {
        for (let i = 0, len = parentRowData.length; i < len; i++) {
            if (parentRowData['Id'] === parentId) {
                // 向该节点下添加下级节点
                if (!parentRowData[i]['children']) {
                    parentRowData[i]['children'] = [];
                }
                newRowData['parent'] = parentRowData[i];
                parentRowData[i]['children'].push(newRowData);
                return parentRowData;
            } else {
                if (
                    parentRowData[i]['children'] &&
                    parentRowData[i].length > 0
                ) {
                    this._setExpandChildData(
                        parentRowData[i]['children'],
                        newRowData,
                        parentId
                    );
                }
            }
        }
    }

    public expandChange(childrenData, data: any, $event: boolean) {
        if ($event === true) {
            (async () => {
                const response = await this.expandLoad(data);
                if (response.isSuccess && response.data.length > 0) {
                    response.data.forEach(d => {
                        this.setChildExpand(d, data['level'] + 1);
                    });
                    // childrenData = data;
                    this.insertChildrenListToTree(data, response.data);
                }
            })();
        } else {
            if (childrenData) {
                childrenData.forEach(d => {
                    const target = this.dataList.find(t => t.Id === d.Id);
                    if (target && target.parent) {
                        target.parent.expand = false;
                    }
                    this.expandChange(target.children, target, false)
                })
            }
        }
    }

    private setChildExpand(data, level) {
        data['parent'] = {};
        data['parent']['expand'] = true;
        data['level'] = level;
        data['key'] = data['Id'];
        // data['edit'] = false;
        // 将当前行数据添加到编辑缓存对象当中
        this.editCache[data['key']] = {edit: false, data: data};
    }

    private insertChildrenListToTree(parent, childrenList) {
        const index = this.treeData.findIndex(d => d.Id === parent.Id);
        this.treeData.splice(index + 1, 0, ...childrenList);
    }

    private expandLoad(parentData) {
        const url = this.buildURL(this.config.ajaxConfig.url);
        const params = this.buildParameters(this.config.ajaxConfig.childrenParams, parentData);
        return this.apiResource.get(url, { ...params, ...this.buildRecursive() }).toPromise();
    }

    //  格式化单元格
    public setCellFont(value, format) {
        let fontColor = '';
        if (format) {
            format.map(color => {
                if (color.value === value) {
                    fontColor = color.fontcolor;
                }
            });
        }

        return fontColor;
    }

    /**
     * 选中行
     * @param data
     * @param $event 
     */
    private selectRow(data, $event) {
        if (
            $event.srcElement.type === 'checkbox' ||
            $event.target.type === 'checkbox'
        ) {
            return;
        }
        $event.stopPropagation();

        this.treeData.forEach(t => t['selected'] = false);
        data['selected'] = true;
        this.selectedItem = data;
        // liu  子组件
        if (!this.is_Selectgrid) {
            this.value = this.selectedItem[
                this.config.selectGridValueName
                    ? this.config.selectGridValueName
                    : 'Id'
            ];
        }
    }

    /**
     * 创建新行数据
     */
    public createNewRowData(parentId?) {
        const newRow = { ...this.rowContent };
        const  newRowId = CommonTools.uuID(6);
        newRow['key'] = newRowId;
        newRow['Id'] = newRowId;
        newRow['checked'] = true;
        newRow['row_status'] = 'adding';
        if (parentId) {
            newRow['parentId'] = parentId;
        }
        newRow['children'] = [];
        return newRow;
    }
    /**
     * 添加根节点行
     */
    private addNewRow() {
        // 初始化新行数据
        const newRow = this.createNewRowData();
        this.editCache[newRow['Id']] = {edit: true, data : newRow};
        this.dataList.splice(0, 0, newRow);
        return true;
    }

    /**
     * 添加子节点行
     */
    private addNewChildRow() {
        if (this.selectedItem) {
            const parentId = this.selectedItem[
                this.config.keyId ? this.config.keyId : 'Id'
            ];
            const newRow = this.createNewRowData(parentId);
            this.editCache[newRow['Id']] = {edit: true, data : newRow};
            // 数据添加到具体选中行的下方
            this.dataList = this._setChildRow(newRow, parentId);
        } else {
            console.log('未选择任何行,无法添加下级');
            return false;
        }
    }

    /**
     * 重新排列数据列表(将添加的新行追加到父节点下的位置)
     * @param dataList
     * @param newRowData
     * @param parentId
     */
    private _setChildRow(newRowData, parentId) {
        if (this.dataList) {
            const parentIndex = this.dataList.findIndex(d => d.Id === parentId);
            if (parentIndex > -1) {
                const level = this.dataList[parentIndex]['level'];
                if (level > 0) {
                    newRowData['level'] = level + 1;
                }
                this.dataList.splice(parentIndex + 1, 0, newRowData);
            }
        }
        return this.dataList;
    }

    /**
     * 设置数据状态为编辑
     * @param key
     */
    private _startRowEdit(key: string): void {
        this.editCache[key]['edit'] = true;
    }

    private _cancelEditRows() {
        const cancelRowMap = this._getCheckedRowStatusMap();
        // 删除dataList中数据
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            const key = this.dataList[i].key;
            const checkedRowStatus = cancelRowMap.get(key);
            if (checkedRowStatus && checkedRowStatus.status === 'adding') {
                if (this.editCache[key]) {
                    delete this.editCache[key];
                }
                this.dataList.splice(i, 1);
                i--;
                len--;
            } else if (
                checkedRowStatus &&
                checkedRowStatus.status === 'updating'
            ) {
                this._cancelEdit(key);
            }
        }

        this.refChecked();
        return true;
    }

    private _cancelTreeDataByKey(treeData, key) {
        for (let j = 0, jlen = treeData.length; j < jlen; j++) {
            if (treeData[j]['Id'] === key) {
                treeData.splice(j, 1);
                j--;
                jlen--;
                return;
            } else {
                if (
                    treeData[j]['children'] &&
                    treeData[j]['children'].length > 0
                ) {
                    this._cancelTreeDataByKey(treeData[j]['children'], key);
                }
            }
        }
    }

    private _getCheckedRowStatusMap(): Map<string, { key: string; status: string }> {
        const cancelRowMap: Map<string, { key: string; status: string }> = new Map();
        this.dataList.filter(d => d.checked)
            .map(dataItem => {
                const checkedData = this.editCache[dataItem.Id];
                if (checkedData) {
                    cancelRowMap.set(dataItem.Id, {
                        key: dataItem.Id,
                                status: dataItem['row_status']
                                    ? dataItem['row_status']
                                    : 'updating'
                    });
                }
            })
        return cancelRowMap;
    }

    private _editRowData() {
        const checkedRowStatusMap = this._getCheckedRowStatusMap();
        checkedRowStatusMap.forEach(item => {
            if (item.status === 'updating') {
                this._startRowEdit(item.key);
            }
        });
        return true;
    }

    private _cancelEdit(key: string): void {
        const itemList = this.treeDataOrigin;
        const index = itemList.findIndex(item => item.Id === key);
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(JSON.stringify(itemList[index]));
    }

    public checkAll(value) {
        this.dataList.forEach(d => {
            d['checked'] = value;
        })
        this.refChecked();
    }

    public refChecked() {
        let allCount = 0;
        // parent count
        this.checkedCount = 0; 
        // child count
        this.dataList.forEach(r => {
            allCount += r.checked ? 1 : 0;
        });
        
        this.indeterminate = this.allChecked ? false : allCount > 0;
    }

    private _getAddedAndUpdatingRows() {
        const checkedRows = this._getCheckedRowStatusMap();
        this.addedTreeRows = [];
        this.editTreeRows = [];
        checkedRows.forEach(item => {
            if (item.status === 'adding') {
                this.addedTreeRows.push(this.editCache[item.key].data);
            } else if (item.status === 'updating') {
                this.editTreeRows.push(this.editCache[item.key].data);
            }
        });
    }

    // 获取行内编辑是行填充数据
    private _getContent() {
        this.rowContent['key'] = null;
        this.config.columns.forEach(element => {
            const colsname = element.field.toString();
            this.rowContent[colsname] = '';
        });
    }

    public deleteRow() {
        this.baseModal.confirm({
            nzTitle: '确认删除选中的记录？',
            nzContent: '',
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                const e = this.dataList;
                const d = this.editCache;

                for (let i = 0, len = this.dataList.length; i < len; i++) {
                    if (
                        this.dataList[i].checked &&
                        this.dataList[i]['row_status'] === 'adding'
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
                    if (this.dataList[i]['checked']) {
                        if (this.dataList[i]['row_status'] === 'adding') {
                            this.dataList.splice(
                                this.dataList.indexOf(this.dataList[i]),
                                1
                            );
                            i--;
                            len--;
                        } else if (
                            this.dataList[i]['row_status'] === 'search'
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
                if (serverData.length > 0) {
                    this.executeDelete(serverData);
                }
            },
            nzOnCancel() { }
        });
    }

    public async executeDelete(ids) {
        let result;
        if (ids && ids.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const index = bar.group.findIndex(
                        item => item.name === 'deleteRow'
                    );
                    if (index !== -1) {
                        const deleteConfig =
                            bar.group[index].ajaxConfig['delete'];
                        result = this._executeDelete(deleteConfig, ids);
                    }
                }
                if (
                    bar.dropdown &&
                    bar.dropdown.buttons &&
                    bar.dropdown.buttons.length > 0
                ) {
                    const index = bar.dropdown.buttons.findIndex(
                        item => item.name === 'deleteRow'
                    );
                    if (index !== -1) {
                        const deleteConfig =
                            bar.dropdown.buttons[index].ajaxConfig['delete'];
                        result = this._executeDelete(deleteConfig, ids);
                    }
                }
            });
        }

        return result;
    }

    public async _executeDelete(deleteConfig, ids) {
        let isSuccess;
        if (deleteConfig) {
            for (let i = 0, len = deleteConfig.length; i < len; i++) {
                const params = {
                    _ids: ids.join(',')
                };
                const response = await this.apiResource.delete(
                    deleteConfig[i].url,
                    params
                ).toPromise();
                if (response && response.status === 200 && response.isSuccess) {
                    this.baseMessage.create('success', '删除成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
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

    public async saveRow() {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this.dataList.map(item => {
            delete item['$type'];
            if (item.checked && item['row_status'] === 'adding') {
                addRows.push(item);
            } else if (item.checked && item['row_status'] === 'updating') {
                updateRows.push(item);
            }
        });
        if (addRows.length > 0) {
            // save add;
            isSuccess = await this.executeSave(addRows, 'post');
        }

        if (updateRows.length > 0) {
            // update
            isSuccess = await this.executeSave(updateRows, 'put');
        }
        return isSuccess;
    }

    public async _execute(rowsData, method, postConfig) {
        let isSuccess = false;
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = {};
                    postConfig[i].params.map(param => {
                        if (param.type === 'tempValue') {
                            submitItem[param['name']] = this.tempValue[
                                param['valueName']
                            ];
                        } else if (param.type === 'componentValue') {
                            submitItem[param['name']] =
                                rowData[param['valueName']];
                        } else if (param.type === 'GUID') {
                        } else if (param.type === 'value') {
                            submitItem[param['name']] = param.value;
                        }
                    });
                    submitData.push(submitItem);
                });
                const response = await this[method](
                    postConfig[i].url,
                    submitData
                );
                if (response && response.status === 200 && response.isSuccess) {
                    this.baseMessage.create('success', '保存成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
                }
            }
            if (isSuccess) {
                // rowsData.map(row => {
                //     this._saveEdit(row.key);
                // });
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

    public async executeSave(rowsData, method) {
        // Todo: 优化配置
        let result;
        this.config.toolbar.forEach(bar => {
            if (bar.group && bar.group.length > 0) {
                const index = bar.group.findIndex(
                    item => item.name === 'saveRow'
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
                    item => item.name === 'saveRow'
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
    /**------------------------------------------------------------------------------ */






    // 获取 文本值，当前选中行数据
    public async loadByselect( ajaxConfig, componentValue?, selecttempValue?, cascadeValue?) {
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
        const loadData = await this.apiResource.get(url, params).toPromise();
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                if (loadData.data.length > 0) {
                    selectrowdata = loadData.data[0];
                }
            }
        }
        console.log('异步获取当前值:', selectrowdata);
        return selectrowdata;
    }

    // 构建获取文本值参数
    private _buildParametersByselect( paramsConfig, componentValue?, selecttempValue?, cascadeValue?) {
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

    // 定位行选中 liu 20181024

    public setSelectRow() {
        // console.log('setSelectRow', this.value);

        // 遍历
        for (const key in this.expandDataCache) {
            if (this.expandDataCache.hasOwnProperty(key)) {
                if (this.expandDataCache[key]) {
                    this.expandDataCache[key].forEach(element => {
                        element.selected = false; // 取消行选中
                    });
                    this.expandDataCache[key].forEach(element => {
                        if (element['Id'] === this.value) {
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
    // private _addTreeData(parentId, newRowData, parent) {
    //     if (parentId) {
    //         // 子节点数据
    //         for (let i = 0, len = parent.length; i < len; i++) {
    //             if (parentId === parent[i].Id) {
    //                 if (!parent[i]['children']) {
    //                     parent[i]['children'] = [];
    //                 }
    //                 parent[i]['children'].push(newRowData);
    //                 return parent;
    //             } else {
    //                 if (
    //                     parent[i]['children'] &&
    //                     parent[i]['children'].length > 0
    //                 ) {
    //                     this._addTreeData(
    //                         parentId,
    //                         newRowData,
    //                         parent[i]['children']
    //                     );
    //                 }
    //             }
    //         }
    //     }
    //     return parent;
    // }

    /**
     * 查找根节点ID
     * @param dataList
     * @param Id
     */
    // private findRootId(dataList, Id) {
    //     for (let i = 0, len = dataList.length; i < len; i++) {
    //         if (dataList[i].Id === Id) {
    //             return dataList[i]['rootId']
    //                 ? dataList[i]['rootId']
    //                 : dataList[i]['Id'];
    //         }
    //     }
    // }

    
    /** --------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/







    public searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load();
    }

    //  服务区端交互
    private async _load(url, params) {
        return this.apiResource.get(url, params).toPromise();
    }

    // private async post(url, body) {
    //     return this.apiResource.post(url, body).toPromise();
    // }

    // private async put(url, body) {
    //     return this.apiResource.put(url, body).toPromise();
    // }

    // private async delete(url, params) {
    //     return this.apiResource.delete(url, params).toPromise();
    // }

    // private async get(url, params) {
    //     return this.apiResource.get(url, params).toPromise();
    // }

    public searchRow(option) {
        if (option['type'] === 'addSearchRow') {
            this.addSearchRow();
        } else if (option['type'] === 'cancelSearchRow') {
            this.cancelSearchRow();
        }
    }

    public addSearchRow() {
        let isSearch = true;
        for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i]['row_status'] === 'search') {
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
                if (this.dataList[i]['row_status'] === 'search') {
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
    public createSearchRow() {
        if (this.is_Search) {
            this.dataList = [this.search_Row, ...this.dataList];
            // this.dataList.push(this.rowContent);
            this._updateEditCache();
            this._startRowEdit(this.search_Row['key'].toString());
        } else {
            const newSearchContent = JSON.parse(
                JSON.stringify(this.rowContent)
            );
            const fieldIdentity = CommonTools.uuID(6);
            newSearchContent['key'] = fieldIdentity;
            newSearchContent['checked'] = false;
            newSearchContent['row_status'] = 'search';

            this.expandDataCache[fieldIdentity] = [newSearchContent];
            this.dataList = [newSearchContent, ...this.dataList];
            // this.dataList = [newSearchContent, ...this.dataList];
            this._addEditCache();
            this._startAdd(fieldIdentity);

            this.search_Row = newSearchContent;
        }
    }

    // 取消查询
    public cancelSearchRow() {
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            if (this.dataList[i]['row_status'] === 'search') {
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
            if (this.dataList[i]['row_status'] === 'search') {
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

    // //  表格操作
    // public _getAllItemList() {
    //     let list = [];
    //     if (this.expandDataCache) {
    //         for (const r in this.expandDataCache) {
    //             list = list.concat([...this.expandDataCache[r]]);
    //         }
    //     }
    //     return list;
    // }

    


    public executeSelectedRow(option) {
        if (!this._selectRow) {
            this.baseMessage.create('info', '请选选择要执行的数据');
            return false;
        }
        this.baseModal.confirm({
            nzTitle: '是否将选中的数据执行当前操作？',
            nzContent: '',
            nzOnOk: () => {
                if (this._selectRow['row_status'] === 'adding') {
                    this.baseMessage.create('info', '当前数据未保存无法进行处理');
                    return false;
                }

                this.executeSelectedAction(this._selectRow, option);
            },
            nzOnCancel() { }
        });
    }

    public executeCheckedRow(option) {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this.baseMessage.create('info', '请选择要执行的数据');
            return false;
        }
        this.baseModal.confirm({
            nzTitle: '是否将选中的数据执行当前操作？',
            nzContent: '',
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
                        item['row_status'] !== 'adding' &&
                        item['row_status'] !== 'updating' &&
                        item['row_status'] !== 'search'
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
            nzOnCancel() { }
        });
    }

    public async executeSelectedAction(selectedRow, option) {
        let isSuccess;
        if (selectedRow) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.findIndex(
                        item => item.action === 'EXECUTE_SELECTED'
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
                        item => item.action === 'EXECUTE_SELECTED'
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

    public async _executeSelectedAction(selectedRow, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                const newParam = {};
                cfg[i].params.forEach(param => {
                    newParam[param['name']] = selectedRow[param['valueName']];
                });
                const response = await this[option.type](cfg[i].url, newParam);
                if (response && response.status === 200 && response.isSuccess) {
                    this.baseMessage.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
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

    public async executeCheckedAction(items, option) {
        let isSuccess;
        if (items && items.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.findIndex(
                        item => item.action === 'EXECUTE_CHECKED'
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
                        item => item.action === 'EXECUTE_CHECKED'
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

    public async _executeCheckedAction(items, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                // 构建参数
                const params = [];
                if (cfg[i].params) {
                    items.forEach(item => {
                        const newParam = {};
                        cfg[i].params.forEach(param => {
                            newParam[param['name']] = item[param['valueName']];
                        });
                        params.push(newParam);
                    });
                }
                const response = await this[option.type](cfg[i].url, params);
                if (response && response.status === 200 && response.isSuccess) {
                    this.baseMessage.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
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

   

    // private _deleteEdit(i: string): void {
    //     const dataSet = this._getAllItemList().filter(d => d.key !== i);
    //     // 需要特殊处理层级问题
    //     this.dataList = dataSet;
    // }

    

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
    // public updateRow() {
    //     this.dataList.forEach(item => {
    //         if (item.checked) {
    //             if (item['row_status'] && item['row_status'] === 'adding') {
    //             } else if (
    //                 item['row_status'] &&
    //                 item['row_status'] === 'search'
    //             ) {
    //             } else {
    //                 item['row_status'] = 'updating';
    //             }
    //             this._startRowEdit(item.key);
    //         }
    //     });
    //     // console.log(this.editCache);
    //     return true;
    // }

    // private _saveEdit(key: string): void {
    //     const itemList = this.dataList;
    //     const index = itemList.findIndex(item => item.key === key);
    //     let checked = false;
    //     let selected = false;

    //     if (itemList[index].checked) {
    //         checked = itemList[index].checked;
    //     }
    //     if (itemList[index].selected) {
    //         selected = itemList[index].selected;
    //     }

    //     itemList[index] = this.editCache[key].data;
    //     itemList[index].checked = checked;
    //     itemList[index].selected = selected;

    //     this.editCache[key].edit = false;

    //     this.editCache = this.editCache;
    // }

    // public cancelRow() {
    //     // debugger;
    //     // for (let i = 0, len = this.dataList.length; i < len; i++) {
    //     //     if (this.dataList[i].checked) {
    //     //         if (this.dataList[i]['row_status'] === 'adding') {
    //     //             if (this.editCache[this.dataList[i].key]) {
    //     //                 delete this.editCache[this.dataList[i].key];
    //     //             }
    //     //             this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
    //     //             i--;
    //     //             len--;
    //     //         }

    //     //     }
    //     // }
    //     const cancelKeys = [];
    //     this.treeData.map(dataItem => {
    //         this.expandDataCache[dataItem.Id].map(item => {
    //             if (item['checked']) {
    //                 cancelKeys.push(item['key']);
    //             }
    //         });
    //     });
    //     // const cancelList = this.dataList.filter(item => cancelKeys.findIndex(key => key === item.key) > -1);

    //     for (let i = 0, len = this.dataList.length; i < len; i++) {
    //         const __key = this.dataList[i].key;
    //         if (cancelKeys.findIndex(key => key === __key) > -1) {
    //             if (this.dataList[i]['row_status'] === 'adding') {
    //                 if (this.editCache[__key]) {
    //                     delete this.editCache[__key];
    //                 }
    //                 this.dataList.splice(
    //                     this.dataList.indexOf(this.dataList[i]),
    //                     1
    //                 );
    //                 // 删除数结果集中的数据
    //                 this._cancelTreeDataByKey(this.treeData, __key);

    //                 i--;
    //                 len--;
    //             } else if (this.dataList[i]['row_status'] === 'search') {
    //                 this.dataList.splice(
    //                     this.dataList.indexOf(this.dataList[i]),
    //                     1
    //                 );
    //                 this.is_Search = false;
    //                 this.search_Row = {};
    //                 i--;
    //                 len--;
    //             } else {
    //                 this._cancelEdit(this.dataList[i].key);
    //             }
    //         }

    //         // if (this.dataList[i]['checked']) {
    //         //     // // const key = this.dataList[i].key;
    //         //     // // if (this.dataList[i]['row_status'] === 'adding') {
    //         //     // //     if (this.editCache[key]) {
    //         //     // //         delete this.editCache[key];
    //         //     // //     }
    //         //     // //     this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
    //         //     // //     // 删除数结果集中的数据
    //         //     // //     this._cancelTreeDataByKey(this.treeData, key);
    //         //     // //     i--;
    //         //     // //     len--;

    //         //     // } else if (this.dataList[i]['row_status'] === 'search') {
    //         //     //     this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
    //         //     //     this.is_Search = false;
    //         //     //     this.search_Row = {};
    //         //     //     i--;
    //         //     //     len--;
    //         //     // } else {
    //         //     //     this._cancelEdit(this.dataList[i].key);
    //         //     // }
    //         // }
    //     }
    //     if (cancelKeys.length > 0) {
    //         this.treeData.map(row => {
    //             row['key'] = row[this.config.keyId]
    //                 ? row[this.config.keyId]
    //                 : 'Id';
    //             this.expandDataCache[row.Id] = this.convertTreeToList(row);
    //         });
    //     }
    //     this.refChecked();
    //     return true;
    // }

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

   

    // public addRow() {
    //     const rowContentNew = { ...this.rowContent };
    //     const fieldIdentity = CommonTools.uuID(6);
    //     rowContentNew['key'] = fieldIdentity;
    //     rowContentNew['Id'] = fieldIdentity;
    //     rowContentNew['checked'] = true;
    //     rowContentNew['row_status'] = 'adding';
    //     // 针对查询和新增行处理
    //     if (this.is_Search) {
    //         this.dataList.splice(1, 0, rowContentNew);
    //     } else {
    //         this.expandDataCache[fieldIdentity] = [rowContentNew];
    //         this.dataList = [rowContentNew, ...this.dataList];
    //         this.treeData = [rowContentNew, ...this.treeData];
    //         // this.dataList = [rowContentNew, ...this.dataList];
    //         // this.treeData.map(row => {
    //         //     row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
    //         //     this.expandDataCache[row.Id] = this.convertTreeToList(row);
    //         // });
    //     }
    //     // 需要特殊处理层级问题
    //     // this.dataList.push(this.rowContent);
    //     this._addEditCache();
    //     this._startAdd(fieldIdentity);
    //     return true;
    // }

    // public addChildRow() {
    //     const rowContentNew = { ...this.rowContent };
    //     const fieldIdentity = CommonTools.uuID(6);
    //     let parentId;
    //     if (this.selectedItem['Id']) {
    //         parentId = this.selectedItem['Id'];
    //     } else {
    //         console.log('未获取父节点数据');
    //         return;
    //     }
    //     rowContentNew['key'] = fieldIdentity;
    //     rowContentNew['checked'] = true;
    //     rowContentNew['row_status'] = 'adding';
    //     rowContentNew['Id'] = fieldIdentity;

    //     // 向数据集中添加子节点数据
    //     this._setChildRow(rowContentNew, parentId);
    //     // this.treeData[0].children.push(rowContentNew);

    //     // 重新生成树表的数据格式
    //     // 查找添加节点的数据根节点
    //     this.treeData.map(row => {
    //         row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
    //         this.expandDataCache[row.Id] = this.convertTreeToList(row);
    //     });
    //     this.dataList = [...this._setDataList(this.expandDataCache)];
    //     this._updateChildRowEditCache();
    //     this._startChildRowAdd(fieldIdentity);
    //     return true;
    // }

    // private _setExpandDataCache(cacheData, newRowData, parentId) {
    //     if (cacheData) {
    //         for (const p in cacheData) {
    //             if (cacheData[p] && cacheData[p].length > 0) {
    //                 for (let i = 0, len = cacheData[p].length; i < len; i++) {
    //                     if (cacheData[p][i]['Id'] === parentId) {
    //                         // 向该节点下添加下级节点
    //                         if (!cacheData[p][i]['children']) {
    //                             cacheData[p][i]['children'] = [];
    //                         }
    //                         newRowData['parent'] = cacheData[p][i];
    //                         cacheData[p][i]['children'].push(newRowData);
    //                         return cacheData;
    //                     } else {
    //                         if (
    //                             cacheData[p][i]['children'] &&
    //                             cacheData[p][i].length > 0
    //                         ) {
    //                             this._setExpandChildData(
    //                                 cacheData[p][i]['children'],
    //                                 newRowData,
    //                                 parentId
    //                             );
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return cacheData;
    // }

    // private _setDataList(cacheData) {
    //     const resultList = [];
    //     if (cacheData) {
    //         for (const p in cacheData) {
    //             if (cacheData && cacheData[p].length > 0) {
    //                 // for (let i = 0, len = cacheData[p].length; i < len; i++) {
    //                 //     resultList.push(cacheData[p][i]);
    //                 //     if (cacheData[p][i]['children'] && cacheData[p][i]['children'].length > 0) {
    //                 //         resultList.push(...this._setChildDataList(cacheData[p][i]['children']));
    //                 //     }
    //                 // }
    //                 resultList.push({ ...cacheData[p][0] });
    //                 if (
    //                     cacheData[p][0]['children'] &&
    //                     cacheData[p][0]['children'].length > 0
    //                 ) {
    //                     resultList.push(
    //                         ...this._setChildDataList(
    //                             cacheData[p][0]['children']
    //                         )
    //                     );
    //                 }
    //             }
    //         }
    //     }
    //     return resultList;
    // }
    // private _setChildDataList(parentRowData) {
    //     const childResultList = [];
    //     for (let i = 0, len = parentRowData.length; i < len; i++) {
    //         childResultList.push({ ...parentRowData[i] });
    //         if (parentRowData[i]['children'] && parentRowData[i].length > 0) {
    //             childResultList.push(
    //                 ...this._setChildDataList(parentRowData[i]['children'])
    //             );
    //         }
    //     }
    //     return childResultList;
    // }

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
        this.editCache[key]['edit'] = true;
    }

    public valueChange(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
        this.editCache[data.key].data[data.name] = JSON.parse(
            JSON.stringify(this.editCache[data.key].data[data.name])
        );
        // 第一步，知道是谁发出的级联消息（包含信息： field、json、组件类别（类别决定取值））
        // { key:行标识,name: this.config.name, value: name }
        const rowCasade = data.key;
        const sendCasade = data.name;
        // const changeConfig_new = {};

        // {hang：[name:{具体属性}]}
        if (this.cascadeList[sendCasade]) {
            // 判断当前组件是否有级联
            if (!this.changeConfig_new[rowCasade]) {
                this.changeConfig_new[rowCasade] = {};
            }
            // console.log('当前组件有被级联的子对象');
            for (const key in this.cascadeList[sendCasade]) {
                // 处理当前级联
                //  console.log('处理当前级联', key);
                if (!this.changeConfig_new[rowCasade][key]) {
                    this.changeConfig_new[rowCasade][key] = {};
                }

                if (this.cascadeList[sendCasade][key]['dataType']) {
                    this.cascadeList[sendCasade][key]['dataType'].forEach(
                        caseItem => {
                            // console.log('dataType-caseItem', caseItem);
                            // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                            if (caseItem['type'] === 'option') {
                                // 在做判断前，看看值是否存在，如果在，更新，值不存在，则创建新值
                                this.changeConfig_new[rowCasade][key][
                                    'options'
                                ] = caseItem['option'];
                            } else {
                                if (
                                    this.changeConfig_new[rowCasade][key][
                                    'options'
                                    ]
                                ) {
                                    delete this.changeConfig_new[rowCasade][
                                        key
                                    ]['options'];
                                }
                            }
                            if (caseItem['type'] === 'ajax') {
                                // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                // 解析参数

                                // const cascadeValue = {};
                                if (
                                    !this.changeConfig_new[rowCasade][key][
                                    'cascadeValue'
                                    ]
                                ) {
                                    this.changeConfig_new[rowCasade][key][
                                        'cascadeValue'
                                    ] = {};
                                }
                                caseItem['ajax'].forEach(ajaxItem => {
                                    if (ajaxItem['type'] === 'value') {
                                        // 静态数据
                                        this.changeConfig_new[rowCasade][key][
                                            'cascadeValue'
                                        ][ajaxItem['name']] = ajaxItem['value'];
                                    }
                                    if (ajaxItem['type'] === 'selectValue') {
                                        // 选中行数据[这个是单值]
                                        this.changeConfig_new[rowCasade][key][
                                            'cascadeValue'
                                        ][ajaxItem['name']] =
                                            data[ajaxItem['valueName']];
                                    }
                                    if (ajaxItem['type'] === 'selectObjectValue') {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            if (data.dataItem.hasOwnProperty(ajaxItem['valueName'])) {
                                                this.changeConfig_new[rowCasade][key]['cascadeValue'][ajaxItem['name']] =
                                                    data.dataItem[ajaxItem['valueName']];
                                            }
                                        }
                                    }

                                    // 其他取值【日后扩展部分】value
                                });
                                // changeConfig_new[rowCasade][key]['cascadeValue'] = cascadeValue;
                            } /*  else {
                            if (this.changeConfig_new[rowCasade][key]['cascadeValue'] ) {
                                delete this.changeConfig_new[rowCasade][key]['cascadeValue'];
                            }
                        } */
                            if (caseItem['type'] === 'setValue') {
                                // console.log('setValueinput' , caseItem['setValue'] );

                                if (caseItem['setValue']['type'] === 'value') {
                                    // 静态数据
                                    this.changeConfig_new[rowCasade][key][
                                        'setValue'
                                    ] = caseItem['setValue']['value'];
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'selectValue'
                                ) {
                                    // 选中行数据[这个是单值]
                                    this.changeConfig_new[rowCasade][key][
                                        'setValue'
                                    ] = data[caseItem['setValue']['valueName']];
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'selectObjectValue'
                                ) {
                                    // 选中行对象数据
                                    if (data.dataItem) {
                                        this.changeConfig_new[rowCasade][key][
                                            'setValue'
                                        ] =
                                            data.dataItem[
                                            caseItem['setValue'][
                                            'valueName'
                                            ]
                                            ];
                                    }
                                }
                                if (data.data === null) {
                                    this.changeConfig_new[rowCasade][key][
                                        'setValue'
                                    ] = null;
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'notsetValue'
                                ) {
                                    // 选中行对象数据
                                    if (
                                        this.changeConfig_new[rowCasade][
                                            key
                                        ].hasOwnProperty('setValue')
                                    ) {
                                        delete this.changeConfig_new[rowCasade][
                                            key
                                        ]['setValue'];
                                    }
                                }
                            } else {
                                if (
                                    this.changeConfig_new[rowCasade][
                                        key
                                    ].hasOwnProperty('setValue')
                                ) {
                                    delete this.changeConfig_new[rowCasade][
                                        key
                                    ]['setValue'];
                                }
                            }

                            // 扩充：判断当前字段是否有 edit ，如果无编辑，则将该字段赋值
                            if (this.changeConfig_new[rowCasade][key]) {
                                if (this.changeConfig_new[rowCasade][key]) {
                                    //
                                    if (this.isEdit(key)) {
                                        this.editCache[data.key].data[
                                            key
                                        ] = this.changeConfig_new[rowCasade][
                                        key
                                        ]['setValue'];
                                    }
                                }
                            }

                            // endregion  解析结束
                        }
                    );
                }
                if (this.cascadeList[sendCasade][key]['valueType']) {
                    this.cascadeList[sendCasade][key]['valueType'].forEach(
                        caseItem => {
                            // console.log('分析' + key, caseItem);
                            // region: 解析开始  正则表达
                            const reg1 = new RegExp(caseItem.regular);
                            let regularData;
                            if (caseItem.regularType) {
                                if (
                                    caseItem.regularType === 'selectObjectValue'
                                ) {
                                    if (data['dataItem']) {
                                        regularData =
                                            data['dataItem'][
                                            caseItem['valueName']
                                            ];
                                    } else {
                                        regularData = data.data;
                                    }
                                } else {
                                    regularData = data.data;
                                }
                            } else {
                                regularData = data.data;
                            }
                            const regularflag = reg1.test(regularData);
                            // console.log('正则结果：', regularflag);
                            // endregion  解析结束 正则表达
                            if (regularflag) {
                                // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                if (caseItem['type'] === 'option') {
                                    this.changeConfig_new[rowCasade][key][
                                        'options'
                                    ] = caseItem['option'];
                                } else {
                                    if (
                                        this.changeConfig_new[rowCasade][key][
                                        'options'
                                        ]
                                    ) {
                                        delete this.changeConfig_new[rowCasade][
                                            key
                                        ]['options'];
                                    }
                                }
                                if (caseItem['type'] === 'ajax') {
                                    // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                    if (
                                        !this.changeConfig_new[rowCasade][key][
                                        'cascadeValue'
                                        ]
                                    ) {
                                        this.changeConfig_new[rowCasade][key][
                                            'cascadeValue'
                                        ] = {};
                                    }
                                    caseItem['ajax'].forEach(ajaxItem => {
                                        if (ajaxItem['type'] === 'value') {
                                            // 静态数据
                                            this.changeConfig_new[rowCasade][
                                                key
                                            ]['cascadeValue'][
                                                ajaxItem['name']
                                            ] = ajaxItem['value'];
                                        }
                                        if (
                                            ajaxItem['type'] === 'selectValue'
                                        ) {
                                            // 选中行数据[这个是单值]
                                            this.changeConfig_new[rowCasade][
                                                key
                                            ]['cascadeValue'][
                                                ajaxItem['name']
                                            ] = data[ajaxItem['valueName']];
                                        }
                                        if (
                                            ajaxItem['type'] ===
                                            'selectObjectValue'
                                        ) {
                                            // 选中行对象数据
                                            if (data.dataItem) {
                                                this.changeConfig_new[
                                                    rowCasade
                                                ][key]['cascadeValue'][
                                                    ajaxItem['name']
                                                ] =
                                                    data.dataItem[
                                                    ajaxItem['valueName']
                                                    ];
                                            }
                                        }

                                        // 其他取值【日后扩展部分】value
                                    });
                                }
                                /*   else {
                                 if (this.changeConfig_new[rowCasade][key]['cascadeValue'] ) {
                                     delete this.changeConfig_new[rowCasade][key]['cascadeValue'];
                                 }
                               
                             } */
                                if (caseItem['type'] === 'show') {
                                    if (caseItem['show']) {
                                        //
                                        // control['hidden'] = caseItem['show']['hidden'];
                                    }
                                    // changeConfig_new[rowCasade]['show'] = caseItem['option'];
                                }
                                if (caseItem['type'] === 'setValue') {
                                    console.log(
                                        'setValue2',
                                        caseItem['setValue']
                                    );
                                    if (
                                        caseItem['setValue']['type'] === 'value'
                                    ) {
                                        // 静态数据
                                        this.changeConfig_new[rowCasade][key][
                                            'setValue'
                                        ] = caseItem['setValue']['value'];
                                    }
                                    if (
                                        caseItem['setValue']['type'] ===
                                        'selectValue'
                                    ) {
                                        // 选中行数据[这个是单值]
                                        this.changeConfig_new[rowCasade][key][
                                            'setValue'
                                        ] =
                                            data[
                                            caseItem['setValue'][
                                            'valueName'
                                            ]
                                            ];
                                    }
                                    if (
                                        caseItem['setValue']['type'] ===
                                        'selectObjectValue'
                                    ) {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            this.changeConfig_new[rowCasade][
                                                key
                                            ]['setValue'] =
                                                data.dataItem[
                                                caseItem['setValue'][
                                                'valueName'
                                                ]
                                                ];
                                        }
                                    }
                                    if (data.data === null) {
                                        this.changeConfig_new[rowCasade][key][
                                            'setValue'
                                        ] = null;
                                    }
                                    if (
                                        caseItem['setValue']['type'] ===
                                        'notsetValue'
                                    ) {
                                        // 选中行对象数据
                                        if (
                                            this.changeConfig_new[rowCasade][
                                                key
                                            ].hasOwnProperty('setValue')
                                        ) {
                                            delete this.changeConfig_new[
                                                rowCasade
                                            ][key]['setValue'];
                                        }
                                    }
                                } else {
                                    if (
                                        this.changeConfig_new[rowCasade][
                                            key
                                        ].hasOwnProperty('setValue')
                                    ) {
                                        delete this.changeConfig_new[rowCasade][
                                            key
                                        ]['setValue'];
                                    }
                                }
                            }
                            // endregion  解析结束
                            // 扩充：判断当前字段是否有 edit ，如果无编辑，则将该字段赋值
                            if (this.changeConfig_new[rowCasade][key]) {
                                if (this.changeConfig_new[rowCasade][key]) {
                                    //
                                    if (this.isEdit(key)) {
                                        this.editCache[data.key].data[
                                            key
                                        ] = this.changeConfig_new[rowCasade][
                                        key
                                        ]['setValue'];
                                    }
                                }
                            }
                        }
                    );
                }
                // if (!this.isEmptyObject(this.changeConfig_new[rowCasade][key])) { }

                this.changeConfig_new[rowCasade][key] = JSON.parse(
                    JSON.stringify(this.changeConfig_new[rowCasade][key])
                );
            }
            // console.log('级联结果数据集', this.changeConfig_new);
        }

        // console.log('*********', this.changeConfig_new[rowCasade]);
    }

    public caseLoad() {
        this.cascadeList = {};
        // region: 解析开始
        if (this.config.cascade)
            this.config.cascade.forEach(c => {
                this.cascadeList[c.name] = {}; // 将关系维护到一个对象中
                // region: 解析具体对象开始
                c.CascadeObjects.forEach(cobj => {
                    // 具体对象
                    this.cascadeList[c.name][cobj.cascadeName] = {};

                    const dataType = [];
                    const valueType = [];
                    cobj['cascadeDataItems'].forEach(item => {
                        // 数据关联 （只是单纯的数据关联，内容只有ajax）
                        // cobj.data
                        const dataTypeItem = {};
                        if (item['caseValue']) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            dataTypeItem['regularType'] = item.caseValue.type;
                            dataTypeItem['valueName'] =
                                item.caseValue.valueName;
                            dataTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] =
                            item.data.type;
                        dataTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                'option'
                            ] = item.data.option_data.option;
                            dataTypeItem['option'] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] =
                                item.data.ajax_data.option;
                            dataTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                'setValue'
                            ] = item.data.setValue_data.option;
                            dataTypeItem['setValue'] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] =
                                item.data.show_data.option;
                            dataTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                'relation'
                            ] = item.data.relation_data.option;
                            dataTypeItem['relation'] =
                                item.data.relation_data.option;
                        }

                        dataType.push(dataTypeItem);
                    });

                    cobj['cascadeValueItems'].forEach(item => {
                        const valueTypeItem = {};
                        if (item.caseValue) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            valueTypeItem['regularType'] = item.caseValue.type;
                            valueTypeItem['valueName'] =
                                item.caseValue.valueName;
                            valueTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] =
                            item.data.type;
                        valueTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                'option'
                            ] = item.data.option_data.option;
                            valueTypeItem['option'] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] =
                                item.data.ajax_data.option;
                            valueTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                'setValue'
                            ] = item.data.setValue_data.option;
                            valueTypeItem['setValue'] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] =
                                item.data.show_data.option;
                            valueTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                'relation'
                            ] = item.data.relation_data.option;
                            valueTypeItem['relation'] =
                                item.data.relation_data.option;
                        }
                        valueType.push(valueTypeItem);
                    });

                    this.cascadeList[c.name][cobj.cascadeName][
                        'dataType'
                    ] = dataType;
                    this.cascadeList[c.name][cobj.cascadeName][
                        'valueType'
                    ] = valueType;
                });
                // endregion: 解析对象结束
            });
        // endregion： 解析结束

        // console.log("级联配置简析", this.cascadeList);
    }

    public isEdit(fieldname) {
        let isEditState = false;
        this.config.columns.forEach(column => {
            if (column.field === fieldname) {
                if (column.hidden) {
                    isEditState = true;
                }
                if (!column.editor) {
                    isEditState = true;
                }
                if (column.editor) {
                    // 20181020 liu
                    if (fieldname !== column.editor.field) {
                        isEditState = true;
                    }
                }
            }
        });
        return isEditState;
    }

    public convertTreeToList(root: object): any[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });
        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        ...node.children[i],
                        level: node.level + 1,
                        expand: false,
                        parent: node,
                        key: node.children[i][this.config.keyId],
                        rootId: root['Id']
                    });
                }
            }
        }
        return array;
    }

    public visitNode(node: any, hashMap: object, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    public dialog(option) {
        if (this.config.dialog && this.config.dialog.length > 0) {
            const index = this.config.dialog.findIndex(
                item => item.name === option.actionName
            );
            this.showForm(this.config.dialog[index]);
        }
    }

    public windowDialog(option) {
        if (this.config.windowDialog && this.config.windowDialog.length > 0) {
            const index = this.config.windowDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showLayout(this.config.windowDialog[index]);
        }
    }

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
}

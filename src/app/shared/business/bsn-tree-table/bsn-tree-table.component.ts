import { Component, OnInit, ViewChild, Input, OnDestroy, Type, Inject } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CommonTools } from '@core/utility/common-tools';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer, Subscription } from 'rxjs';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent
};
@Component({
    selector: 'bsn-tree-table,[bsn-tree-table]',
    templateUrl: './bsn-tree-table.component.html',
    styles: [
        `
            .table-operations {
                margin-bottom: 16px;
            }
            .table-operations > button {
                margin-right: 8px;
            }
            .selectedRow{
                color: blue;
            }
        `
    ]
})
export class BsnTreeTableComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() config;
    @Input() permissions = [];
    @Input() dataList = []; // 表格数据集合
    allDataList = [];

    //  分页默认参数
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 1;

    //  表格操作
    allChecked = false;
    indeterminate = false;
    _sortName;
    _sortType = true;
    _columnFilterList = [];
    _focusId;
    expandDataCache = {};
    is_Search;
    search_Row;

    editCache;
    _editDataCache;
    _editDataList = [];

    //  业务对象
    _selectRow = {};
    _tempParameters = {};
    _searchParameters = {};
    _relativeResolver;
    _toolbar;
    editRootCache = {};
    editCacheData = {};
    rowContent = {};
    dataSet = {};
    checkedCount = 0;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;


    constructor(
        private _http: ApiService,
        private message: NzMessageService,
        private modalService: NzModalService,
        @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
    ) { super(); }

    // 生命周期事件
    ngOnInit() {
        console.log(this.config);
        this.resolverRelation();
        if (this.config.dataSet) {
            (async () => {
                for (let i = 0, len = this.config.dataSet.length; i < len; i++) {
                    const url = this._buildURL(this.config.dataSet[i].ajaxConfig.url);
                    const params = this._buildParameters(this.config.dataSet[i].ajaxConfig.params);
                    const data = await this.get(url, params);
                    if (data.length > 0 && data.status === 200) {
                        if (this.config.dataSet[i].fields) {
                            const dataSetObjs = [];
                            data.data.map(d => {
                                const setObj = {};
                                this.config.dataSet[i].fields.map(fieldItem => {
                                    if (d[fieldItem.field]) {
                                        setObj[fieldItem.name] = d[fieldItem.field];
                                    }
                                });
                                dataSetObjs.push(setObj);
                            });
                            this.dataSet[this.config.dataSet[i].name] = dataSetObjs;
                        } else {
                            this.dataSet[this.config.dataSet[i].name] = data.Data;
                        }

                    }
                }
            })();
        }
        this.pageSize = this.config.pageSize ? this.config.pageSize : this.pageSize;
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            }
        } else {
            this.load();
        }
    }
    ngOnDestroy() {
        if (this._relativeResolver) {
            this._relativeResolver.unsubscribe();
        }
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
                        this.addRow();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        this.updateRow();
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        this.cancelRow();
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
                    case BSN_COMPONENT_MODES.WINDOW:
                        this.windowDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.searchRow(option);
                        break;
                }
            }
        });
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
        if (this.config.componentType && this.config.componentType.parent === true) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, 'selectRow', () => {
                this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD, this.config.viewId, {
                    data: this._selectRow
                }));
            });
        }
        if (this.config.componentType && this.config.componentType.child === true) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(cascadeEvent => {
                // 解析子表消息配置
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
                                    this._tempParameters[param['cid']] = option.data[param['pid']];
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
            });
        }
    }

    // 创建查询参数
    private _buildSearch() {
        const search = {};
        if (this.search_Row) {
            const searchData = JSON.parse(JSON.stringify(this.search_Row));
            delete searchData['key'];
            delete searchData['checked'];
            delete searchData['row_status'];
            delete searchData['selected'];

            for (const p in searchData) {
                search[`_root.${p}`] = searchData[p];
            }
        }
        return search;
    }

    private _buildFilter(filterConfig) {
        const filter = {};
        if (filterConfig) {
            filterConfig.map(param => {
                if (this._tempParameters[param['valueName']]) {
                    filter[param['name']] = this._tempParameters[param['valueName']];
                }

            });
        }
        return filter;
    }

    private _buildParameters(paramsConfig) {
        const params = {};
        if (paramsConfig) {
            paramsConfig.map(param => {
                if (param['type'] === 'tempValue') {
                    params[param['name']] = this._tempParameters[param['valueName']];
                } else if (param['type'] === 'value') {
                    params[param.name] = param.value;
                } else if (param['type'] === 'GUID') {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param['type'] === 'componentValue') {
                    // params[param.name] = componentValue[param.valueName];
                } else if (param['type'] === 'searchValue') {
                    if (this._searchParameters[param['name']]) {
                        params[param['name']] = this._searchParameters[param['valueName']];
                    }
                }
            });
        }
        return params;
    }

    private _buildURL(urlConfig) {
        let url = '';
        if (urlConfig && this._isUrlString(urlConfig)) {
            url = urlConfig;
        } else if (urlConfig) {
            let parent = '';
            urlConfig.params.map(param => {
                if (param['type'] === 'tempValue') {
                    parent = this._tempParameters[param.value];
                } else if (param['type'] === 'value') {
                    if (param.value === 'null') {
                        param.value = null;
                    }
                    parent = param.value;
                } else if (param['type'] === 'GUID') {
                    // todo: 扩展功能
                } else if (param['type'] === 'componentValue') {
                    // parent = componentValue[param['valueName']];
                }
            });
        }
        return url;
    }

    private _buildPaging() {
        const params = {};
        if (this.config['pagination']) {
            params['_page'] = this.pageIndex;
            params['_rows'] = this.pageSize;
        }
        return params;
    }

    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === '[object String]';
    }

    private _buildSort() {
        const sortObj = {};
        if (this._sortName && this._sortType) {
            sortObj['_sort'] = this._sortName;
            sortObj['_order'] = sortObj['_order'] ? 'DESC' : 'ASC';
        }
        return sortObj;
    }

    private _buildFocusId() {
        const focusParams = {};
        // 服务器端待解决
        // if (this._selectRow && this._selectRow['Id']) {
        //     focusParams['_focusedId'] = this._selectRow['Id'];
        // }
        return focusParams;
    }

    private _buildColumnFilter() {
        const filterParams = {};
        if (this._columnFilterList && this._columnFilterList.length > 0) {
            this._columnFilterList.map(filter => {
                const valueStr = [];
                filter.value.map(value => {
                    valueStr.push(`'${value}'`);
                });
                filterParams[filter.field] = `in(${valueStr.join(',')})`;
            });
        }
        return filterParams;
    }

    private _buildRecursive() {
        return { _recursive: true };
    }

    //  功能实现
    private load(pageIndex = 1) {
        // this._selectRow = {};
        this.pageIndex = pageIndex;
        this.loading = true;
        this.allChecked = false;
        this.checkedCount = 0;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildPaging(),
            ...this._buildFilter(this.config.ajaxConfig.filter),
            ...this._buildSort(),
            ...this._buildColumnFilter(),
            ...this._buildFocusId(),
            ...this._buildRecursive(),
            ...this._buildSearch()
        };
        this.expandDataCache = {};
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.status === 200) {
                if (loadData.data && loadData.data.rows) {
                    loadData.data.rows.map(row => {
                        row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                        this.expandDataCache[row.Id] = this.convertTreeToList(row);
                    });
                    this._editDataList = this._getAllItemList();
                    this._initEditDataCache();


                    this.dataList = loadData.data.rows;
                    this.total = loadData.data.total;
                    if (this.is_Search) {
                        // this.createSearchRow();
                    }
                } else {
                    // this._updateEditCacheByLoad([]);
                    this.dataList = loadData.data;
                    this.total = 0;
                    if (this.is_Search) {
                        // this.createSearchRow();
                    }
                }
            } else {
                // this._updateEditCacheByLoad([]);
                this.dataList = [];
                this.total = 0;
                if (this.is_Search) {
                    // this.createSearchRow();
                }
            }

            console.log('dataList', this.dataList);
            console.log('editDataCache', this._editDataCache);
            console.log('editDataList', this._editDataList);
            this.loading = false;
        })();
    }

    // 初始化可编辑的数据结构
    private _initEditDataCache() {
        this._editDataCache = {};
        this._editDataList.forEach(item => {
            if (!this._editDataCache[item.key]) {
                this._editDataCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });

        // 将编辑数据帮定至页面
        this.editCache = this._editDataCache;
    }

    // 将选中行改变为编辑状态
    updateRow() {
        this._editDataList.forEach(item => {
            if (item.checked) {
                if (item['row_status'] && item['row_status'] === 'adding') {

                } else if (item['row_status'] && item['row_status'] === 'search') {

                } else {
                    item['row_status'] = 'updating';
                }
                this._startEdit(item.key);
            }
        });
        return true;
    }

    private _startEdit(key: string): void {
        this._editDataCache[key]['edit'] = true;
        this.editCache = this._editDataCache;
    }

    private _saveEdit(key: string): void {
        const itemList = this._editDataList;
        const index = itemList.findIndex(item => item.key === key);
        let checked = false;
        let selected = false;

        if (itemList[index].checked) {
            checked = itemList[index].checked;
        }
        if (itemList[index].selected) {
            selected = itemList[index].selected;
        }

        itemList[index] = this._editDataCache[key].data;
        itemList[index].checked = checked;
        itemList[index].selected = selected;

        this._editDataCache[key].edit = false;

        this.editCache = this._editDataCache;
    }

    cancelRow() {
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            if (this.dataList[i].checked) {
                if (this.dataList[i]['row_status'] === 'adding') {
                    if (this._editDataCache[this.dataList[i].key]) {
                        delete this._editDataCache[this.dataList[i].key];
                    }
                    this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
                    i--;
                    len--;
                }
                
            }
        }

        for (let i = 0, len = this._editDataList.length; i < len; i++) {
            if (this._editDataList[i]['checked']) {
                if (this._editDataList[i]['row_status'] === 'adding') {
                    this._editDataList.splice(this._editDataList.indexOf(this._editDataList[i]), 1);
                    i--;
                    len--;
                } else if (this._editDataList[i]['row_status'] === 'search') {
                    this._editDataList.splice(this._editDataList.indexOf(this._editDataList[i]), 1);
                    this.is_Search = false;
                    this.search_Row = {};
                    i--;
                    len--;
                } else {
                    this._cancelEdit(this._editDataList[i].key);
                }
            }
        }
        return true;
    }

    private _cancelEdit(key: string): void {
        const itemList = this._editDataList;
        const index = itemList.findIndex(item => item.key === key);
        this._editDataCache[key].edit = false;
        this._editDataCache[key].data = JSON.parse(JSON.stringify(itemList[index]));

        this.editCache = this._editDataCache;

    }

    addRow() {
        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonTools.uuID(6);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        rowContentNew['row_status'] = 'adding';
        // 针对查询和新增行处理
        if (this.is_Search) {
            this._editDataList.splice(1, 0, rowContentNew);
        } else {
            this.expandDataCache[fieldIdentity] = [rowContentNew];
            this._editDataList = [rowContentNew, ...this._editDataList];
            this.dataList = [rowContentNew, ...this.dataList];

        }
        // 需要特殊处理层级问题
        // this.dataList.push(this.rowContent);
        this._addEditCache();
        this._startAdd(fieldIdentity);
        return true;
    }

    private _addEditCache(): void {
        this._editDataList.forEach(item => {
            if (!this._editDataCache[item.key]) {
                this._editDataCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
        this.editCache = this._editDataCache;
    }

    private _startAdd(key: string): void {
        this._editDataCache[key]['edit'] = true;
        this.editCache = this._editDataCache;
    }

    private selectRow(data, $event) {
        if ($event.srcElement.type === 'checkbox' || $event.target.type === 'checkbox') {
            return;
        }
        $event.stopPropagation();


        for (const r in this.expandDataCache) {
            this.expandDataCache[r].map(row => {
                row['selected'] = false;
            });
        }
        data['selected'] = true;
        this._selectRow = data;
    }

    searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load(this.pageIndex);
    }

    sort(sort: { key: string, value: string }) {
        this._sortName = sort.key;
        this._sortType = !this._sortType;
        this.load();
    }

    columnFilter(field: string, values: string[]) {
        const filter = {};
        if (values.length > 0 && field) {
            filter['field'] = field;
            filter['value'] = values;
            this._columnFilterList.push(filter);
        } else {
            this._columnFilterList = [];
        }

        this.load();
    }

    //  表格操作
    _getAllItemList() {
        let list = [];
        if (this.expandDataCache) {
            for (const r in this.expandDataCache) {
                list = list.concat(this.expandDataCache[r]);
            }
        }
        return list;
    }

    checkAll(value) {
        for (const r in this.expandDataCache) {
            this.expandDataCache[r].map(data => {
                if (!data['disabled']) {
                    data['checked'] = value;
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
            this.checkedCount += this.expandDataCache[r].filter(c => c.checked).length;
            allCount += this.expandDataCache[r].length;
        }

        this.allChecked = this.checkedCount === allCount;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
    }

    async saveRow() {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this._editDataList.map(item => {
            delete item['$type'];
            if (item.checked && item['row_status'] === 'adding') {
                addRows.push(item);
            } else if (item.checked && item['row_status'] === 'updating') {
                updateRows.push(item);
            }
        });
        if (addRows.length > 0) {
            // save add;
            console.log(addRows);

            isSuccess = await this.executeSave(addRows, 'post');
        }

        if (updateRows.length > 0) {
            // update 
            console.log(updateRows);
            isSuccess = await this.executeSave(updateRows, 'put');
        }
        return isSuccess;
    }

    async executeSave(rowsData, method) {
        // Todo: 优化配置
        const index = this.config.toolbar.findIndex(item => item.name === 'saveRow');
        const postConfig = this.config.toolbar[index].ajaxConfig[method];
        let isSuccess = false;
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = {};
                    postConfig[i].params.map(param => {
                        if (param.type === 'tempValue') {
                            submitItem[param['name']] = this._tempParameters[param['valueName']];
                        } else if (param.type === 'componentValue') {
                            submitItem[param['name']] = rowData[param['valueName']];
                        } else if (param.type === 'GUID') {

                        } else if (param.type === 'value') {
                            submitItem[param['name']] = rowData[param['value']];
                        }
                    });
                    submitData.push(submitItem);
                });

                const response = await this[method](postConfig[i].url, submitData);
                if (response && response.status === 200) {
                    this.message.create('success', '保存成功');
                    isSuccess = true;
                } else {
                    this.message.create('error', response.message);
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

    async executeDelete(ids) {
        let isSuccess = false;
        if (ids && ids.length > 0) {
            const index = this.config.toolbar.findIndex(item => item.name === 'deleteRow');
            const deleteConfig = this.config.toolbar[index].ajaxConfig['delete'];
            if (deleteConfig) {
                for (let i = 0, len = deleteConfig.length; i < len; i++) {
                    const params = {
                        Id: ids.join(',')
                    };
                    const response = await this['delete'](deleteConfig[i].url, params);
                    if (response && response.status === 200) {
                        this.message.create('success', '删除成功');
                        isSuccess = true;
                    } else {
                        this.message.create('error', response.Message);
                    }
                }
                if (isSuccess) {
                    this.load();
                }
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

    private _deleteEdit(i: string): void {
        const dataSet = this._getAllItemList().filter(d => d.key !== i);
        // 需要特殊处理层级问题
        this.dataList = dataSet;
    }

    private _updateEditCache(): void {
        this.allDataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
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

    



    deleteRow() {
        this.modalService.confirm({
            nzTitle: '确认删除选中的记录？',
            nzContent: '',
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                const e = this._editDataList;
                const d = this._editDataCache;

                for (let i = 0, len = this.dataList.length; i < len; i++) {
                    if (this.dataList[i].checked && this.dataList[i]['row_status'] === 'adding') {
                        if (this._editDataCache[this.dataList[i].key]) {
                            delete this._editDataCache[this.dataList[i].key];
                        }
                        this.dataList.splice(this.dataList.indexOf(d), 1);
                        i--;
                        len--;
                    }
                }

                for (let i = 0, len = this._editDataList.length; i < len; i++) {
                    if (this._editDataList[i]['checked']) {
                        if (this._editDataList[i]['row_status'] === 'adding') {
                            this._editDataList.splice(this._editDataList.indexOf(this._editDataList[i]), 1);
                            i--;
                            len--;
                        } else if (this._editDataList[i]['row_status'] === 'search') {
                            this._editDataList.splice(this._editDataList.indexOf(this._editDataList[i]), 1);
                            this.is_Search = false;
                            this.search_Row = {};
                            i--;
                            len--;
                        } else {
                            serverData.push(this._editDataList[i].key);
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
            nzOnCancel() {
            }
        });
    }

    toolbarAction(btn) {
        if (this[btn.name]) {
            this[btn.name]() && this._toolbarEnables(btn.enables);
        } else if (this[btn.type]) {
            const buttons = this.config.toolbar.filter(button => button.type === btn.type);
            const index = buttons.findIndex(button => button.name === btn.name);
            if (index >= 0) {
                this[buttons[index].type](buttons[index].dialogConfig);

            }
        }
    }

    valueChange(data) {
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    private _toolbarEnables(enables) {

        return true;
        // this.config.toolbar.map(btn => {
        //     if (!enables[btn.name]) {
        //         delete btn['disabled'];
        //     } else {
        //         btn['disabled'] = '';
        //     }
        // });
    }


    //  弹出UI
    private showForm(dialog) {
        const footer = [];
        const obj = {
            _id: this._selectRow[dialog.keyId]
        };
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: component['form'],
            nzComponentParams: {
                config: dialog,
                ref: obj
            },
            nzFooter: footer
        });

        if (dialog.buttons) {
            dialog.buttons.forEach(btn => {
                const button = {};
                button['label'] = btn.text;
                button['type'] = btn.type ? btn.type : 'default';
                button['onClick'] = (componentInstance) => {
                    if (btn['name'] === 'save') {
                        (async () => {
                            const result = await componentInstance.buttonAction(btn);
                            if (result) {
                                modal.close();
                                // todo: 操作完成当前数据后需要定位
                                this.load();
                            }
                        })();
                    } else if (btn['name'] === 'saveAndKeep') {
                        (async () => {
                            const result = await componentInstance.buttonAction(btn);
                            if (result) {
                                // todo: 操作完成当前数据后需要定位
                                this.load();
                            }
                        })();
                    } else if (btn['name'] === 'close') {
                        modal.close();
                    } else if (btn['name'] === 'reset') {
                        this._resetForm(componentInstance);
                    }

                };
                footer.push(button);
            });

        }
    }

    private _resetForm(comp: FormResolverComponent) {
        comp.resetForm();
    }

    private showLayout(dialog) {
        const footer = [];
        this._http.getLocalData(dialog.layoutName).subscribe(data => {
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: component['layout'],
                nzComponentParams: {
                    config: data
                },
                nzFooter: footer
            });
            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button['label'] = btn.text;
                    button['type'] = btn.type ? btn.type : 'default';
                    button['show'] = true;
                    button['onClick'] = (componentInstance) => {
                        if (btn['name'] === 'save') {
                            (async () => {
                                const result = await componentInstance.buttonAction(btn);
                                if (result) {
                                    modal.close();
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn['name'] === 'saveAndKeep') {
                            (async () => {
                                const result = await componentInstance.buttonAction(btn);
                                if (result) {
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn['name'] === 'close') {
                            modal.close();
                        } else if (btn['name'] === 'reset') {
                            this._resetForm(componentInstance);
                        } else if (btn['name'] === 'ok') {
                            // 
                        }

                    };
                    footer.push(button);
                });

            }
        });

    }


    //  服务区端交互
    private async _load(url, params) {
        return this._http.getProj(url, params).toPromise();
    }

    private async post(url, body) {
        return this._http.postProj(url, body).toPromise();
    }

    private async put(url, body) {
        return this._http.putProj(url, body).toPromise();
    }

    private async delete(url, params) {
        return this._http.deleteProj(url, params).toPromise();
    }

    private async get(url, params) {
        return this._http.getProj(url, params).toPromise();
    }


    //  格式化单元格
    setCellFont(value, format) {
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

    expandChange(array: any[], data: any, $event: boolean) {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    d['key'] = d[this.config.keyId];
                    const target = array.find(a => a[this.config.keyId] === d['key']);
                    if (target) {
                        target['expand'] = false;
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


    // async expandLoad(componentValue?) {
    //     let childs = [];
    //     const url = this._buildURL(this.config.ajaxConfig.url);
    //     const params = {
    //         ...this._buildParameters(this.config.ajaxConfig.params, componentValue),
    //     };

    //     const loadData = await this._load(url, params);
    //     console.log('#数表展开节点异步返回#', loadData);
    //     if (loadData && loadData.Status === 200) {

    //         if (loadData.Data && loadData.Data) {
    //             loadData.Data.forEach(row => {
    //                 row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
    //                 if (this.config.ShowName) {
    //                     this.config.ShowName.forEach(col => {
    //                         row[col['field']] = row[col['valueName']];
    //                     });
    //                 }
    //                 row['Children'] = [];
    //             });
    //             // this.dataToTreetable(loadData.Data);
    //             childs = loadData.Data;

    //         }
    //     }
    //     return childs;

    // }

    searchRow(option) {
        if (option['type'] === 'addSearchRow') {
            this.addSearchRow();
        } else if (option['type'] === 'cancelSearchRow') {
            this.cancelSearchRow();
        }
    }

    addSearchRow() {
        let isSearch = true;
        for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i]['row_status'] === 'search') {
                isSearch = false;
            }
        }
        if (isSearch) {
            this.createSearchRow();
        } else {

            // 执行行查询
            console.log('行查询', this.search_Row);
            this.load(1); // 查询后将页面置1
        }
        this.is_Search = true;
        console.log('SearchRow结果', this.dataList);
    }

    // 生成查询行 
    createSearchRow() {
        if (this.is_Search) {
            this.dataList = [this.search_Row, ...this.dataList];
            // this.dataList.push(this.rowContent);
            this._updateEditCache();
            this._startEdit(this.search_Row['key'].toString());
        } else {
            const newSearchContent = JSON.parse(JSON.stringify(this.rowContent));
            const fieldIdentity = CommonTools.uuID(6);
            newSearchContent['key'] = fieldIdentity;
            newSearchContent['checked'] = false;
            newSearchContent['row_status'] = 'search';
          
            this.expandDataCache[fieldIdentity] = [newSearchContent];
            this.dataList = [newSearchContent, ...this.dataList];
            this._editDataList = [newSearchContent, ...this._editDataList];
            this._addEditCache();
            this._startAdd(fieldIdentity);
           
            this.search_Row = newSearchContent;
        }
        console.log('SearchRow', this.search_Row);
    }

    // 取消查询
    cancelSearchRow() {
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            if (this.dataList[i]['row_status'] === 'search') {
                delete this._editDataCache[this.dataList[i].key];
                this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
                i--;
                len--;
            }
        }

        for (let i = 0, len = this._editDataList.length; i < len ; i++) {
            if (this._editDataList[i]['row_status'] === 'search') {
                this._editDataList.splice(this._editDataList.indexOf(this._editDataList[i]), 1);
                i--;
                len--;
            }
        }

        this.is_Search = false;
        this.search_Row = {};
        this.load(1); // 查询后将页面置1
        return true;
    }

    convertTreeToList(root: object): any[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });
        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push(
                        {
                            ...node.children[i],
                            level: node.level + 1,
                            expand: false,
                            parent: node,
                            key: node.children[i][this.config.keyId]
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
            const index = this.config.dialog.findIndex(item => item.name === option.name);
            this.showForm(this.config.dialog[index]);
        }
    }

    windowDialog(option) {
        if (this.config.windowDialog && this.config.windowDialog.length > 0) {
            const index = this.config.windowDialog.findIndex(item => item.name === option.name);
            this.showLayout(this.config.windowDialog[index]);
        }
    }

    formDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(item => item.name === option.name);
            this.showForm(this.config.formDialog[index]);
        }
    }

}

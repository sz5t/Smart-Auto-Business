import { Observable } from 'rxjs';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE } from './../../../core/relative-Service/BsnTableStatus';

import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { LayoutResolverComponent } from './../../resolver/layout-resolver/layout-resolver.component';
import { TypeOperationComponent } from './../../../routes/system/data-manager/type-operation.component';
import { Component, OnInit, Input, OnDestroy, Type, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonTools } from '../../../core/utility/common-tools';
import { ApiService } from '../../../core/utility/api-service';
import { APIResource } from '../../../core/utility/api-resource';
import { RelativeService, RelativeResolver, BsnTableRelativeMessageService } from '../../../core/relative-Service/relative-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { Observer } from 'rxjs';
import { Subscription } from 'rxjs';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent
};

@Component({
    selector: 'cn-bsn-table,[cn-bsn-table]',
    templateUrl: './bsn-table.component.html',
    styles: [
        `
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}
.selectedRow{
    color:blue;
}
`
    ]
})
export class BsnTableComponent extends CnComponentBase implements OnInit, OnDestroy {

    @Input() config; // dataTables 的配置参数
    @Input() permissions = [];
    @Input() dataList = []; // 表格数据集合

    // region: 分页默认参数
    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    // endregion

    // region: 表格操作
    allChecked = false;
    indeterminate = false;
    _sortName;
    _sortType = true;
    _sortOrder = ' Desc';
    _columnFilterList = [];
    _focusId;
    // endregion

    // region: 业务对象
    _selectRow = {};
    _tempParameters = {};
    _searchParameters = {};
    _relativeResolver;
    selfEvent = {
        selectRow: [],
        selectRowBySetValue: [],
        load: [],
        saveRow: [],
        deleteRow: [],
        delete: [],
        post: [],
        put: [],
        get: []
    };
    _toolbar;
    editCache = {};
    rowContent = {};
    dataSet = {};
    checkedCount = 0;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    // endregion

    constructor(
        private _http: ApiService,
        private message: NzMessageService,
        private modalService: NzModalService,
        private relativeMessage: RelativeService,
        @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>

    ) {
        super();

    }

    // region: 生命周期事件
    ngOnInit() {
        // this._relativeResolver = new RelativeResolver();
        // if (this.config.relations && this.config.relations.length > 0) {
        //     this._relativeResolver.reference = this;
        //     this._relativeResolver.relativeService = this.relativeMessage;
        //     this._relativeResolver.relations = this.config.relations;
        //     this._relativeResolver.initParameterEvents = [this.load];
        //     this._relativeResolver.tempParameter = this._tempParameters;
        //     this._relativeResolver.resolverRelation();
        // }
        this.resolverRelation();
        if (this.config.dataSet) {
            (async () => {
                for (let i = 0, len = this.config.dataSet.length; i < len; i++) {
                    const url = this._buildURL(this.config.dataSet[i].ajaxConfig.url);
                    const params = this._buildParameters(this.config.dataSet[i].ajaxConfig.params);
                    const data = await this.get(url, params);
                    if (data && data.Status === 200) {
                        if (this.config.dataSet[i].fields) {
                            const dataSetObjs = [];
                            data.Data.map(d => {
                                const setObj = {};
                                this.config.dataSet[i].fields.forEach((fieldItem, index) => {
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
                        this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.SEARCH:
                        this.SearchRow(option);
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
    // endregion

    // region: 解析消息

    // endregion

    // region: 功能实现
    load(pageIndex = 1) {
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
            ...this._buildSearch()
        };
        // console.log('url params', params);
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.status === 200) {
                if (loadData.data && loadData.data.rows) {
                    // 设置聚焦ID
                    // 默认第一行选中，如果操作后有focusId则聚焦ID为FocusId
                    let focusId;
                    if (loadData.FocusId) {
                        focusId = loadData.FocusId;
                    } else {
                        loadData.data.rows.length > 0 && (focusId = loadData.data.rows[0].Id);
                    }
                    loadData.data.rows.forEach((row, index) => {
                        row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                        if (row.Id === focusId) {
                            this.selectRow(row);
                        }
                        if (loadData.data.page === 1) {
                            row['_serilize'] = index + 1;
                        } else {
                            row['_serilize'] = (loadData.data.page - 1) * loadData.data.pageSize + index + 1;
                        }
                    });
                    this._updateEditCacheByLoad(loadData.data.rows);
                    this.dataList = loadData.data.rows;
                    this.total = loadData.data.total;
                    if (this.is_Search) {
                        this.createSearchRow();
                    }
                } else {
                    this._updateEditCacheByLoad([]);
                    this.dataList = loadData.data;
                    this.total = 0;
                    if (this.is_Search) {
                        this.createSearchRow();
                    }
                }
            } else {
                this._updateEditCacheByLoad([]);
                this.dataList = [];
                this.total = 0;
                if (this.is_Search) {
                    this.createSearchRow();
                }
            }

            this.loading = false;
        })();

       
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

    private _buildURL(ajaxUrl) {
        let url = '';
        if (ajaxUrl && this._isUrlString(ajaxUrl)) {
            url = ajaxUrl;
        } else if (ajaxUrl) {
            const parent = {};
            ajaxUrl.params.map(param => {
                if (param['type'] === 'tempValue') {
                    parent[param['name']] = this._tempParameters[param.valueName];
                } else if (param['type'] === 'value') {
                    if (param.value === 'null') {
                        param.value = null;
                    }
                    parent[param['name']] = param.value;
                } else if (param['type'] === 'GUID') {
                    // todo: 扩展功能
                } else if (param['type'] === 'componentValue') {
                    // parent[param['name']] = componentValue[param['valueName']];
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
        // if (this._sortName && this._sortType) {
        if (this._sortName && this._sortOrder) {

            sortObj['_sort'] = this._sortName + this._sortOrder;
            // sortObj['_order'] = sortObj['_order'] ? 'DESC' : 'ASC';
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

    private _updateEditCacheByLoad(dataList) {
        this.editCache = {};
        dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }

    private selectRow(data?, $event?) {
        if ($event) {
            if ($event.srcElement.type === 'checkbox' || $event.target.type === 'checkbox') {
                return;
            }
            $event.stopPropagation();
        }

        this.dataList.map(row => {
            row.selected = false;
        });
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
        console.log('点击排序', sort);
        this._sortName = sort.key;
        if (sort.value === 'ascend') {
            this._sortOrder = ' Asc';
        } else if (sort.value === 'descend') {
            this._sortOrder = ' Desc';
        } else {
            this._sortOrder = '';
        }

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

    // endregion

    // region: 表格操作

    checkAll(value) {
        this.dataList.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refChecked();
    }

    refChecked() {
        this.checkedCount = this.dataList.filter(w => w.checked).length;
        this.allChecked = this.checkedCount === this.dataList.length;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
    }

    async saveRow() {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'adding') {
                addRows.push(item);
            } else if (item['row_status'] === 'updating') {
                updateRows.push(item);
            }
        });
        if (addRows.length > 0) {
            // save add;
            // console.log(addRows);

            isSuccess = await this.executeSave(addRows, 'post');
        }

        if (updateRows.length > 0) {
            // 
            // console.log(updateRows);
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
                            submitItem[param['name']] = param.value;
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

    async executeSelectedAction(selectedRow, option) {
        let isSuccess = false;
        if (selectedRow) {
            const execButtons = this.config.toolbar.filter(item => item.action === 'EXECUTE_SELECTED');
            const index = execButtons.findIndex(item => item.actionName === option.name);
            const cfg = execButtons[index].ajaxConfig[option.type];

            if (cfg) {
                for (let i = 0, len = cfg.length; i < len; i++) {
                    const newParam = {};
                    cfg[i].params.forEach(param => {
                        newParam[param['name']] = selectedRow[param['valueName']];
                    });
                    const response = await this[option.type](cfg[i].url, newParam);
                    if (response && response.status === 200) {
                        this.message.create('success', '执行成功');
                        isSuccess = true;
                    } else {
                        this.message.create('error', response.message);
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
    }

    async executeCheckedAction(items, option) {
        let isSuccess = false;
        if (items && items.length > 0) {
            const execButtons = this.config.toolbar.filter(item => item.action = 'EXECUTE_SELECTED');
            const index = execButtons.findIndex(item => item.actionName = option.name);
            const cfg = execButtons[index].ajaxConfig[option.type];
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
                    if (response && response.status === 200) {
                        this.message.create('success', '执行成功');
                        isSuccess = true;
                    } else {
                        this.message.create('error', response.message);
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
                        this.message.create('error', response.message);
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

    cancelRow() {
        let len = this.dataList.length;
        for (let i = 0; i < len; i++) {
            if (this.dataList[i]['checked']) {
                if (this.dataList[i]['row_status'] === 'adding') {
                    this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
                    i--;
                    len--;
                } else if (this.dataList[i]['row_status'] === 'search') {
                    this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
                    this.is_Search = false;
                    this.search_Row = {};
                    i--;
                    len--;
                } else {
                    this._cancelEdit(this.dataList[i].key);
                }

            }
        }

        return true;
    }

    private _startEdit(key: string): void {
        // console.log('start edit', key);
        this.editCache[key].edit = true;
    }

    private _cancelEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(JSON.stringify(this.dataList[index]));

    }

    private _saveEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        let checked = false;
        let selected = false;

        if (this.dataList[index].checked) {
            checked = this.dataList[index].checked;
        }
        if (this.dataList[index].selected) {
            selected = this.dataList[index].selected;
        }

        this.dataList[index] = this.editCache[key].data;
        this.dataList[index].checked = checked;
        this.dataList[index].selected = selected;

        this.editCache[key].edit = false;
    }

    private _deleteEdit(i: string): void {
        const dataSet = this.dataList.filter(d => d.key !== i);
        this.dataList = dataSet;
    }

    private _updateEditCache(): void {
        this.dataList.forEach(item => {
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

    addRow() {
        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonTools.uuID(6);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        rowContentNew['row_status'] = 'adding';
        // 针对查询和新增行处理
        if (this.is_Search) {
            this.dataList.splice(1, 0 , rowContentNew);        
        } else {
            this.dataList = [rowContentNew, ...this.dataList];
        }
        // this.dataList.push(this.rowContent);
        this._updateEditCache();
        this._startEdit(fieldIdentity.toString());

        return true;
    }

    SearchRow(option) {

        if (option['type'] === 'addSearchRow') {
            this.addSearchRow();
        } else if (option['type'] === 'cancelSearchRow') {
            this.cancelSearchRow();
        }
    }

    // 查询标识
    is_Search = false;
    search_Row = {};
    // 新增查询
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
        console.log('SearchRow结果' , this.dataList);
    }
    // 生成查询行 
    createSearchRow() {
        if (this.is_Search) {
            this.dataList = [this.search_Row, ...this.dataList];
            // this.dataList.push(this.rowContent);
            this._updateEditCache();
            this._startEdit(this.search_Row['key'].toString());
        } else {
            const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
            const fieldIdentity = CommonTools.uuID(6);
            rowContentNew['key'] = fieldIdentity;
            rowContentNew['checked'] = false;
            rowContentNew['row_status'] = 'search';
            this.dataList = [rowContentNew, ...this.dataList];
            // this.dataList.push(this.rowContent);
            this._updateEditCache();
            this._startEdit(fieldIdentity.toString());
            this.search_Row = rowContentNew;
        }
        console.log('SearchRow' , this.search_Row);
    }
    // 取消查询
    cancelSearchRow() {
        let len = this.dataList.length;
        for (let i = 0; i < len; i++) {
            if (this.dataList[i]['row_status'] === 'search') {
                this.dataList.splice(this.dataList.indexOf(this.dataList[i]), 1);
                i--;
                len--;
            }
        }
        this.is_Search = false;
        this.search_Row = {};
        this.load(1); // 查询后将页面置1
        return true;
    }
    // 创建查询参数
    _buildSearch() {
       let search = {};
       if (this.search_Row) {
           const searchData =  JSON.parse(JSON.stringify(this.search_Row));
           delete searchData['key'];
           delete searchData['checked'];
           delete searchData['row_status'];
           delete searchData['selected'];
     
           search = searchData;
       }
       return search;
    }

    updateRow() {
        this.dataList.forEach(item => {
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

    executeSelectedRow(option) {
        if (!this._selectRow) {
            this.message.create('info', '请选选择要执行的数据');
            return false;
        }
        this.modalService.confirm({
            nzTitle: '是否将选中的数据执行当前操作？',
            nzContent: '',
            nzOnOk: () => {
                if (this._selectRow['row_status'] === 'adding') {
                    this.message.create('info', '当前数据未保存无法进行处理');
                    return false;
                }

                this.executeSelectedAction(this._selectRow, option);
            },
            nzOnCancel() {
            }
        });
    }

    executeCheckedRow(option) {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this.message.create('info', '请选选择要执行的数据');
            return false;
        }
        this.modalService.confirm({
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
                    if (item.checked === true && item['row_status'] !== 'adding') {
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
            nzOnCancel() {
            }
        });
    }

    deleteRow() {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this.message.create('info', '请选选择要删除的数据');
            return false;
        }
        this.modalService.confirm({
            nzTitle: '确认删除选中的记录？',
            nzContent: '',
            nzOnOk: () => {
                const newData = [];
                const serverData = [];
                this.dataList.forEach(item => {
                    if (item.checked === true && item['row_status'] === 'adding') {
                        // 删除新增临时数据
                        newData.push(item.key);
                    }
                    if (item.checked === true) {
                        // 删除服务端数据
                        serverData.push(item.Id);
                    }
                });
                if (newData.length > 0) {
                    newData.forEach(d => {
                        this.dataList.splice(this.dataList.indexOf(d), 1);
                    });
                }
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
            this[btn.name]();
        } else if (this[btn.type]) {
            const buttons = this.config.toolbar.filter(button => button.type === btn.type);
            const index = buttons.findIndex(button => button.name === btn.name);
            if (index >= 0) {
                if (buttons[index].dialogConfig) {
                    this[buttons[index].type](buttons[index].dialogConfig);
                } else if (buttons[index].context) {
                    this[buttons[index].type](buttons[index].context);
                }
            }
        }
    }

    valueChange(data) {
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    private injectFunction(context) {
        let arr = [];
        if (context.arguments && context.arguments.length > 0) {
            arr = context.arguments;
        }
        if (context.content) {
            arr = arr.concat(context.content);
        }

        const func = new Function(...arr);
        func();
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
    // endregion

    // region: 弹出UI
    private showBatchForm(dialog) {
        const footer = [];
        const checkedItems = [];
        this.dataList.map(item => {
            if (item.checked) {
                checkedItems.push(item);
            }
        });
        if (checkedItems.length > 0) {
            const obj = {
                _checkedItems: checkedItems
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
        } else {
            this.message.create('warning', '请先选中需要处理的数据');
        }

    }
    private showForm(dialog) {
        const footer = [];
        const obj = {
            _id: this._selectRow[dialog.keyId],
            _parentId: this._tempParameters['_parentId']
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
    // endregion

    // region: 服务区端交互
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
    // endregion

    // region: 格式化单元格
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

    log($event) {

    }
    // endregion

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

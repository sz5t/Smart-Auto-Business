import {Observable} from 'rxjs';
import {
    BSN_COMPONENT_MODES,
    BSN_COMPONENT_CASCADE_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE, BSN_PARAMETER_TYPE, BSN_EXECUTE_ACTION
} from '@core/relative-Service/BsnTableStatus';

import {FormResolverComponent} from '@shared/resolver/form-resolver/form-resolver.component';
import {ComponentSettingResolverComponent} from '@shared/resolver/component-resolver/component-setting-resolver.component';
import {LayoutResolverComponent} from '@shared/resolver/layout-resolver/layout-resolver.component';
import {TypeOperationComponent} from '../../../routes/system/data-manager/type-operation.component';
import {Component, OnInit, Input, OnDestroy, Type, Inject} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CommonTools} from '@core/utility/common-tools';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {
    RelativeService,
    RelativeResolver,
    BsnTableRelativeMessageService
} from '@core/relative-Service/relative-service';
import {CnComponentBase} from '@shared/components/cn-component-base';
import {Observer} from 'rxjs';
import {Subscription} from 'rxjs';
import {BsnUploadComponent} from '@shared/business/bsn-upload/bsn-upload.component';
import {CnFormWindowResolverComponent} from '@shared/resolver/form-resolver/form-window-resolver.component';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: CnFormWindowResolverComponent,
    upload: BsnUploadComponent
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

            .selectedRow {
                color: blue;
            }
            .text-center{
                text-align: center;
            },
            .text-right{
                text-align: right;
            }
        `
    ]
})
export class BsnTableComponent extends CnComponentBase implements OnInit, OnDestroy {

    @Input() config; // dataTables 的配置参数
    @Input() permissions = [];
    @Input() dataList = []; // 表格数据集合
    // tempValue = {};

    loading = false;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    focusIds;

    allChecked = false;
    indeterminate = false;
    _sortName;
    _sortType = true;
    _sortOrder = ' Desc';
    _columnFilterList = [];
    _focusId;

    _selectRow;

    _searchParameters = {};
    _relativeResolver;

    editCache = {};
    rowContent = {};
    dataSet = {};
    checkedCount = 0;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;

    constructor(private _http: ApiService,
                private _message: NzMessageService,
                private modalService: NzModalService,
                @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>) {
        super();

    }

    ngOnInit() {
        this.resolverRelation();
        if (this.config.dataSet) {
            (async () => {
                for (let i = 0, len = this.config.dataSet.length; i < len; i++) {
                    const url = this._buildURL(this.config.dataSet[i].ajaxConfig.url);
                    const params = this._buildParameters(this.config.dataSet[i].ajaxConfig.params);
                    const data = await this.get(url, params);
                    if (data.isSuccess) {
                        if (this.config.dataSet[i].fields) {
                            const dataSetObjs = [];
                            data.data.map(d => {
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
                            this.dataSet[this.config.dataSet[i].name] = data.data;
                        }

                    }
                }
            })();
        }
        this.pageSize = this.config.pageSize ? this.config.pageSize : this.pageSize;
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            } else if (this.config.componentType.own === true) {
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
                    case BSN_COMPONENT_MODES.REFRESH:
                        this.load();
                        break;
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
                        this.saveRow(option);
                        break;
                    case BSN_COMPONENT_MODES.DELETE:
                        this.deleteRow(option);
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
                        this.SearchRow(option);
                        break;
                    case BSN_COMPONENT_MODES.UPLOAD:
                        this.uploadDialog(option);
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
                            if (option) {
                                // 解析参数
                                if (relation.params && relation.params.length > 0) {
                                    relation.params.forEach(param => {
                                        if (!this.tempValue) {
                                            this.tempValue = {};
                                        }
                                        this.tempValue[param['cid']] = option.data[param['pid']];
                                    });
                                }
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
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    load() {
        // this._selectRow = {};
        //this.pageIndex = pageIndex;
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
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.status === 200 && loadData.isSuccess) {
                if (loadData.data && loadData.data.rows) {
                    // 设置聚焦ID
                    // 默认第一行选中，如果操作后有focusId则聚焦ID为FocusId
                    let focusId;
                    if (loadData.FocusId) {
                        focusId = loadData.FocusId;
                    } else {
                        loadData.data.rows.length > 0 && (focusId = loadData.data.rows[0].Id);
                    }
                    if (loadData.data.rows.length > 0) {
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
                    }

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

    private _hasProperty(obj, propertyName) {
        let result = false;
        for (const p in obj) {
            if (obj.hasOwnProperty(p) && p === propertyName) {
                result = true;
            }
        }
        return result;
    }

    private _buildCurrentPage() {

    }

    private _buildFilter(filterConfig) {
        let filter = {};
        if (filterConfig) {
            filter = CommonTools.parametersResolver(filterConfig, this.tempValue);
            // filterConfig.forEach(param => {
            //     if (!this.tempValue) {
            //         this.tempValue = {};
            //     }
            //     if (this.tempValue[param['valueName']]) {
            //         filter[param['name']] = this.tempValue[param['valueName']];
            //     }
            // });
        }
        return filter;
    }

    private _buildParameters(paramsConfig) {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver(paramsConfig, this.tempValue);
            // paramsConfig.map(param => {
            //     if (param['type'] === 'tempValue') {
            //         if (!this.tempValue) {
            //             this.tempValue = {};
            //         }
            //         params[param['name']] = this.tempValue[param['valueName']];
            //     } else if (param['type'] === 'value') {
            //         params[param.name] = param.value;
            //     } else if (param['type'] === 'GUID') {
            //         const fieldIdentity = CommonTools.uuID(10);
            //         params[param.name] = fieldIdentity;
            //     } else if (param['type'] === 'componentValue') {
            //         // params[param.name] = componentValue[param.valueName];
            //     } else if (param['type'] === 'searchValue') {
            //         if (this._searchParameters[param['name']]) {
            //             params[param['name']] = this._searchParameters[param['valueName']];
            //         }
            //     }
            // });
        }
        return params;
    }

    private _buildURL(ajaxUrl) {
        let url = '';
        if (ajaxUrl && this._isUrlString(ajaxUrl)) {
            url = ajaxUrl;
        } else if (ajaxUrl) {
            // 适用于URL主子表操作的配置
            // const parent = this._paramsResolver(ajaxUrl.params);
            // ajaxUrl.params.map(param => {
            //     if (param['type'] === 'tempValue') {
            //         if (!this.tempValue) {
            //             this.tempValue = {};
            //         }
            //         parent[param['name']] = this.tempValue[param.valueName];
            //     } else if (param['type'] === 'value') {
            //         if (param.value === 'null') {
            //             param.value = null;
            //         }
            //         parent[param['name']] = param.value;
            //     } else if (param['type'] === 'GUID') {
            //         // todo: 扩展功能
            //     } else if (param['type'] === 'componentValue') {
            //         // parent[param['name']] = componentValue[param['valueName']];
            //     }
            // });
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
        if (this.focusIds) {
            focusParams['_focusedId'] = this.focusIds;
        }
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

    // 创建查询参数
    _buildSearch() {
        let search = {};
        if (this.search_Row) {
            const searchData = JSON.parse(JSON.stringify(this.search_Row));
            delete searchData['key'];
            delete searchData['checked'];
            delete searchData['row_status'];
            delete searchData['selected'];

            search = searchData;
        }
        return search;
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
            const src = $event.srcElement || $event.target;
            if (src.type === 'checkbox') {
                return;
            }
            $event.stopPropagation();
        }

        this.dataList && this.dataList.map(row => {
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

    async saveRow(option) {
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
            isSuccess = await this.executeSave(addRows, 'post');
        }

        if (updateRows.length > 0) {
            isSuccess = await this.executeSave(updateRows, 'put');
        }
        return isSuccess;
    }

    async _execute(rowsData, method, postConfig) {
        let isSuccess = false;
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = CommonTools.parametersResolver(postConfig[i].params, this.tempValue, rowData);
                    submitData.push(submitItem);
                });
                const response = await this[method](postConfig[i].url, submitData);
                if (response && response.status === 200 && response.isSuccess) {
                    this._message.create('success', '保存成功');
                    this.focusIds = this._getFocusIds(response.data);
                    isSuccess = true;
                } else {
                    this._message.create('error', response.message);
                }
            }
            if (isSuccess) {
                rowsData.map(row => {
                    this._saveEdit(row.key);
                });
                // 获取返回的focusId

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
                const index = bar.group.findIndex(item => item.name === 'saveRow');
                if (index !== -1) {
                    const postConfig = bar.group[index].ajaxConfig[method];
                    result = this._execute(rowsData, method, postConfig);
                }

            }
            if (bar.dropdown && bar.dropdown.buttons && bar.dropdown.buttons.length > 0) {
                const index = bar.dropdown.buttons.findIndex(item => item.name === 'saveRow');
                if (index !== -1) {
                    const postConfig = bar.dropdown.buttons[index].ajaxConfig[method];
                    result = this._execute(rowsData, method, postConfig);
                }

            }
        });

        return result;


    }

    async executeSelectedAction(selectedRow, option) {
        let isSuccess;
        if (selectedRow) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.filter(item => item.action === 'EXECUTE_SELECTED');
                    const index = execButtons.findIndex(item => item.actionName = option.name);
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeSelectedAction(selectedRow, option, cfg);
                    }

                }
                if (bar.dropdown && bar.dropdown.buttons && bar.dropdown.buttons.length > 0) {

                    const execButtons = bar.dropdown.button.findIndex(item => item.action === 'EXECUTE_SELECTED');
                    const index = execButtons.findIndex(item => item.actionName = option.name);
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeSelectedAction(selectedRow, option, cfg);
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
                const newParam = CommonTools.parametersResolver(cfg[i].params, this.tempValue, selectedRow);
                const response = await this[option.type](cfg[i].url, newParam);
                if (response.isSuccess) {
                    this._message.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this._message.create('error', response.message);
                }
            }
            this.load();
            if (this.config.componentType && this.config.componentType.parent === true) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }
    }

    async executeCheckedAction(items, option) {
        let isSuccess;
        if (items && items.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.filter(item => item.action === 'EXECUTE_CHECKED');
                    const index = execButtons.findIndex(item => item.actionName = option.name);
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(items, option, cfg);
                    }

                }
                if (bar.dropdown && bar.dropdown.buttons && bar.dropdown.buttons.length > 0) {

                    const execButtons = bar.dropdown.button.filter(item => item.action === 'EXECUTE_CHECKED');
                    const index = execButtons.findIndex(item => item.actionName = option.name);
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeCheckedAction(items, option, cfg);
                    }

                }
            });
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
        this.refChecked();
        return true;
    }

    private _startEdit(key: string): void {
        this.editCache[key].edit = true;
    }

    private _cancelEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        this.dataList[index].checked = false;
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
            this.dataList.splice(1, 0, rowContentNew);
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
            this.is_Search = true;
        } else {

            // 执行行查询
            this.load(1); // 查询后将页面置1
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
        }
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

    updateRow() {
        let checkedCount = 0;
        this.dataList.forEach(item => {
            if (item.checked) {
                if (item['row_status'] && item['row_status'] === 'adding') {

                } else if (item['row_status'] && item['row_status'] === 'search') {

                } else {
                    item['row_status'] = 'updating';
                }
                this._startEdit(item.key);
                checkedCount++;
            }
        });
        if (checkedCount === 0) {
            this._message.info('请勾选数据记录后进行编辑');
        }
    }

    valueChange(data) {
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

    executeSelectedRow(option) {
        if (!this._selectRow) {
            this._message.create('info', '请选选择要执行的数据');
            return false;
        }
        this.modalService.confirm({
            nzTitle: '是否将选中的数据执行当前操作？',
            nzContent: '',
            nzOnOk: () => {
                if (this._selectRow['row_status'] === 'adding') {
                    this._message.create('info', '当前数据未保存无法进行处理');
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
            this._message.create('info', '请选择要执行的数据');
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
                    if (item.checked === true
                        && item['row_status'] !== 'adding'
                        && item['row_status'] !== 'updating'
                        && item['row_status'] !== 'search'
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
            nzOnCancel() {
            }
        });
    }

    deleteRow(option) {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this._message.create('info', '请选择要删除的数据');
        } else {
            if (option.ajaxConfig.delete && option.ajaxConfig.delete.length > 0) {
                option.ajaxConfig.delete.map(async delConfig => {
                    this.modalService.confirm({
                        nzTitle: delConfig.title ? delConfig.title : '提示' ,
                        nzContent: delConfig.message ? delConfig.message : '',
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
                                // 目前对应单个操作可以正确执行，多个操作由于异步的问题，需要进一步调整实现方式
                                this._executeDelete(delConfig, serverData);
                            }
                        },
                        nzOnCancel: () => {}
                    });
                });
            }
        }

    }

    async _executeDelete(deleteConfig, ids) {
        let isSuccess;
        // 默认删除数据，无需进行参数的设置，删除数据的ids将会从列表勾选中自动获得
        const params = {
            _ids: ids.join(',')
        };
        const response = await this['delete'](deleteConfig.url, params);
        if (response && response.status === 200 && response.isSuccess) {
            this._message.create('success', '删除成功');
            isSuccess = true;
            this.focusIds = null;
            this.load();
            if (this.config.componentType && this.config.componentType.parent === true) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        } else {
            this._message.create('error', response.message);
        }

        return isSuccess;
    }

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
            this._message.create('warning', '请先选中需要处理的数据');
        }

    }

    // region 批量确认提交数据，未完成与服务端的批量测试功能
    // 关于相关配置的问题需要进一步进行讨论
    private async  _resolveAjaxConfig(option) {
        if (option.ajaxConfig && option.ajaxConfig.length > 0) {
            option.ajaxConfig.map(async c => {
                let msg;
                if (c.action) {
                    let handleData;
                    // 所有获取数据的方法都会将数据保存至tempValue
                    // 使用时可以通过临时变量定义的固定属性访问
                    // 使用时乐意通过内置的参数类型进行访问
                    switch (c.action) {
                        case BSN_EXECUTE_ACTION.EXECUTE_CHECKED:
                            if (this.dataList.filter(item => item.checked === true).length <= 0) {
                                this._message.create('info', '请选择要执行的数据');
                                return false;
                            }
                            handleData = this._getCheckedItems();
                            msg = '操作完成';
                            break;
                        case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                            if (this._selectRow['row_status'] === 'adding') {
                                this._message.create('info', '当前数据未保存无法进行处理');
                                return false;
                            }
                            handleData = this._getSelectedItem();
                            msg = '操作完成';
                            break;
                        case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                            if (this.dataList.filter(item => item.checked === true).length <= 0) {
                                this._message.create('info', '请选择要执行的数据');
                                return false;
                            }
                            handleData = this._getCheckItemsId();
                            msg = '操作完成';
                            break;
                        case BSN_EXECUTE_ACTION.EXECUTE_EDIT_ROW:
                            // 获取保存状态的数据
                            handleData = this._getEditedRows();
                            msg = '编辑数据保存成功';
                            if(handleData && handleData.length <= 0) {
                                return ;
                            }
                            break;
                        case BSN_EXECUTE_ACTION.EXECUTE_SAVE_ROW:
                            // 获取更新状态的数据
                            handleData = this._getAddedRows();
                            msg = '新增数据保存成功';
                            if(handleData && handleData.length <= 0) {
                                return ;
                            }
                            break;
                    }
                    if(c.message) {
                        this.modalService.confirm({
                            nzTitle: c.title ? c.title : '提示',
                            nzContent: c.message ? c.message : '',
                            nzOnOk: async () => {
                                const response = await this._executeAjaxConfig(c, handleData);
                                if(response.isSuccess) {
                                    this._message.success(msg);
                                    this.focusIds = this._getFocusIds(response.data);
                                    this.load();
                                } else {
                                    this._message.error(response.message);
                                }
                            },
                            nzOnCancel() {
                            }
                        });
                    } else {
                        const response = await this._executeAjaxConfig(c, handleData);
                        if(response.isSuccess) {
                            this._message.success(msg);
                            this.focusIds = this._getFocusIds(response.data);
                            this.load();
                        } else {
                            this._message.error(response.message);
                        }
                    }

                }
            });
        }

        // 执行一般API资源
        // 执行自建SQL
        // 执行存储过程
    }

    private _getFocusIds(data) {
        const Ids = [];
        if(Array.isArray(data)) {
            data.forEach(d => {
                Ids.push(d['$focusedOper$']);
            });
        } else {
            Ids.push(data['$focusedOper$']);
        }
        return Ids.join(',');
    }

    private async _executeAjaxConfig(ajaxConfigObj, handleData) {
        if (Array.isArray(handleData)) {
            return this._executeBatchAction(ajaxConfigObj, handleData);
        } else {
            return this._executeAction(ajaxConfigObj, handleData);
        }
    }

    private async _executeAction(ajaxConfigObj, handleData) {
        const executeParam = CommonTools.parametersResolver(ajaxConfigObj.params, this.tempValue, handleData);
        // 执行数据操作
        return this._executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParam
        );
        // if (response.isSuccess) {
        //     this._message.success('操作成功');
        //     this.load();
        // } else {
        //     this._message.error(`操作失败 ${response.message}`);
        // }
    }

    private async _executeBatchAction(ajaxConfigObj, handleData) {
        const executeParams = [];
        if (Array.isArray(handleData)) {
            if (ajaxConfigObj.params) {
                handleData.forEach(dataItem => {
                    const newParam = CommonTools.parametersResolver(ajaxConfigObj.params, this.tempValue, dataItem);
                    executeParams.push(newParam);
                });
            }
        } else {
            executeParams.push(CommonTools.parametersResolver(ajaxConfigObj.params, this.tempValue, handleData));
        }
        // 执行数据操作
        return this._executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParams
        );
        // if (response.isSuccess) {
        //     this._message.success('操作成功');
        //     this.load();
        // } else {
        //     this._message.error(`操作失败 ${response.message}`);
        // }
    }

    async _executeCheckedAction(items, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                // 构建参数
                const params = [];
                if (cfg[i].params) {
                    items.forEach(item => {
                        const newParam = CommonTools.parametersResolver(cfg[i].params, this.tempValue, item);
                        params.push(newParam);
                    });
                }
                const response = await this[option.type](cfg[i].url, params);
                if (response.isSuccess) {
                    this._message.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this._message.create('error', response.message);
                }
            }
            this.load();
            if (this.config.componentType && this.config.componentType.parent === true) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }

    }

    private _executeNextAction() {

    }

    private _getCheckedItems() {
        const serverData = [];
        this.dataList.forEach(item => {
            // if (item.checked === true && item['row_status'] === 'adding') {
            //     // 删除新增临时数据
            //     newData.push(item.key);
            // }
            if (item.checked === true
                && item['row_status'] !== 'adding'
                && item['row_status'] !== 'updating'
                && item['row_status'] !== 'search'
            ) {
                // 删除服务端数据
                serverData.push(item);
            }
        });
        this.tempValue['_checkedItems'] = serverData;
        return serverData;
    }

    private _getSelectedItem() {
        this.tempValue['_selectedItem'] = this.selectRow;
        return this._selectRow;
    }

    private _getCheckItemsId() {
        const serverData = [];
        this.dataList.forEach(item => {
            // if (item.checked === true && item['row_status'] === 'adding') {
            //     // 删除新增临时数据
            //     newData.push(item.key);
            // }
            if (item.checked === true
                && item['row_status'] !== 'adding'
                && item['row_status'] !== 'updating'
                && item['row_status'] !== 'search'
            ) {
                // 删除服务端数据
                serverData.push(item['Id']);
            }
        });
        this.tempValue['_checkedIds'] = serverData.join(',');
        return serverData.join(',');
    }

    private _getAddedRows() {
        const addedRows = [];
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'adding') {
                addedRows.push(item);
            }
        });
        return addedRows;
    }

    private _getEditedRows() {
        const updatedRows = [];
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'updating') {
                updatedRows.push(item);
            }
        });
        return updatedRows;
    }

    private async _executeRequest(url, method, body) {
        return this._http[method](url, body).toPromise();

    }
    // endregion

    private showForm(dialog) {
        let obj;
        if (dialog.type === 'add') {

        } else if (dialog.type === 'edit') {
            if (!this._selectRow) {
                this._message.warning('请选中一条需要添加附件的记录！');
                return false;
            }

        }
        obj = {
            _id: this._selectRow[dialog.keyId] ? this._selectRow[dialog.keyId] : '',
            _parentId: this.tempValue['_parentId'] ? this.tempValue['_parentId'] : ''
        };

        const footer = [];
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

    private openUploadDialog(dialog) {
        if (!this._selectRow) {
            this._message.warning('请选中一条需要添加附件的记录！');
            return false;
        }
        const footer = [];
        const obj = {
            _id: this._selectRow[dialog.keyId],
            _parentId: this.tempValue['_parentId']
        };
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: component['upload'],
            nzComponentParams: {
                config: dialog,
                refObj: obj
            },
            nzFooter: footer
        });
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

    private async _load(url, params) {
        return this._http.get(url, params).toPromise();
    }

    private async post(url, body) {
        return this._http.post(url, body).toPromise();
    }

    private async put(url, body) {
        return this._http.put(url, body).toPromise();
    }

    private async delete(url, params) {
        return this._http.delete(url, params).toPromise();
    }

    private async get(url, params) {
        return this._http.get(url, params).toPromise();
    }

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

    uploadDialog(option) {
        if (this.config.uploadDialog && this.config.uploadDialog.length > 0) {
            const index = this.config.uploadDialog.findIndex(item => item.name === option.name);
            this.openUploadDialog(this.config.uploadDialog[index]);
        }
    }

    formDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(item => item.name === option.name);
            this.showForm(this.config.formDialog[index]);
        }
    }

    /**
     *
     * @param ids
     * @returns {Promise<any>}

    async executeDelete(ids) {
        let result;
        if (ids && ids.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const index = bar.group.findIndex(item => item.name === 'deleteRow');
                    if (index !== -1) {
                        const deleteConfig = bar.group[index].ajaxConfig['delete'];
                        result = this._executeDelete(deleteConfig, ids);
                    }

                }
                if (bar.dropdown && bar.dropdown.buttons && bar.dropdown.buttons.length > 0) {
                    const index = bar.dropdown.buttons.findIndex(item => item.name === 'deleteRow');
                    if (index !== -1) {
                        const deleteConfig = bar.dropdown.buttons[index].ajaxConfig['delete'];
                        result = this._executeDelete(deleteConfig, ids);
                    }

                }
            });
        }

        return result;
    }*/

    /*
    toolbarAction(btn) {
        if (this[btn.name]) {
            this[btn.name]();
        } else if (this[btn.type]) {
            this.config.toolbar.forEach(btnGroup => {
                let index;
                let buttons;
                if (btnGroup.group) {
                    buttons = btnGroup.group.filter(button => button.type === btn.type);
                    index = buttons.findIndex(button => button.name === btn.name);
                }
                if (btnGroup.dropdown) {
                    buttons = btnGroup.dropdown.buttons.filter(button => button.type === btn.type);
                    index = buttons.findIndex(button => button.name === btn.name);
                }
                if (index >= 0) {
                    if (buttons[index].dialogConfig) {
                        this[buttons[index].type](buttons[index].dialogConfig);
                    } else if (buttons[index].context) {
                        this[buttons[index].type](buttons[index].context);
                    }
                }
            });
        }
    }*/
}

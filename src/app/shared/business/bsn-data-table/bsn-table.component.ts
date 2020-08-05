import { BsnImportExcelComponent } from './../bsn-import-excel/bsn-import-excel.component';
import { BSN_OPERATION_LOG_TYPE, BSN_DB_INSTANCE, BSN_OPERATION_LOG_RESULT } from './../../../core/relative-Service/BsnTableStatus';
import { CacheService } from '@delon/cache';
import { Observable } from 'rxjs';
import {
    BSN_COMPONENT_MODES,
    BSN_COMPONENT_CASCADE_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_PARAMETER_TYPE,
    BSN_EXECUTE_ACTION,
    BSN_OUTPOUT_PARAMETER_TYPE
} from '@core/relative-Service/BsnTableStatus';

import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit,
    Output,
    EventEmitter,
    TemplateRef
} from '@angular/core';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { Observer } from 'rxjs';
import { Subscription } from 'rxjs';
import { BsnUploadComponent } from '@shared/business/bsn-upload/bsn-upload.component';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { BeforeOperation } from '../before-operation.base';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { ActivatedRoute } from '@angular/router';
import { XlsxService } from '@delon/abc';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: CnFormWindowResolverComponent,
    upload: BsnUploadComponent,
    importExcel: BsnImportExcelComponent
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-bsn-table,[cn-bsn-table]',
    templateUrl: './bsn-table.component.html',
    styles: [
        `
            .table-operations {
                margin-bottom: 8px;
            }

            .table-operations > button {
                margin-right: 8px;
            }

            .selectedRow {
                color: #fff;
                font-weight:600;
                background-color: rgb(100, 149, 222);
            }
            .text-center {
                text-align: center;
            }
            ,
            .text-right {
                text-align: right;
            }

        `
    ]
})
export class BsnTableComponent extends CnComponentBase
    implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config; // dataTables 的配置参数
    @Input()
    public permissions = [];
    @Input()
    public dataList = []; // 表格数据集合
    @Input()
    public initData;
    @Input()
    public casadeData; // 级联配置 liu 20181023
    @Input()
    public value;
    @Input()
    public bsnData;
    @Input()
    public ref;
    // tempValue = {};
    @Output() public updateValue = new EventEmitter();
    public loading = false;
    public pageIndex = 1;
    public pageSize = 10;
    public total = 1;
    public focusIds;

    public allChecked = false;
    public indeterminate = false;
    public _sortName;
    public _sortType = true;
    public _sortOrder = ' Desc';
    public _columnFilterList = [];
    public _focusId;

    public _selectRow = {};

    public _searchParameters = {};
    public _relativeResolver;

    public editCache = {};
    public rowContent = {};
    public dataSet = {};
    public checkedCount = 0;

    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;

    // 自动加载数据和刷新数据
    public autoLoad = false;
    public autoLoadDataList;

    // 查询标识
    public is_Search = false;
    public search_Row = {};
    public cascadeList = {};

    // 下拉属性 liu
    public is_Selectgrid = true;
    public cascadeValue = {}; // 级联数据
    public selectGridValueName;
    public changeConfig_new = {};
    public changeConfig_newSearch = {};
    public checkedWidth = '10px';
    // 前置条件集合
    public beforeOperation;
    private _currentModuleName;
    constructor(
        private _http: ApiService,
        private _message: NzMessageService,
        private modalService: NzModalService,
        private cacheService: CacheService,
        private _dropdownService: NzDropdownService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        private _router: ActivatedRoute,
        private xlsx: XlsxService
    ) {
        super();
        this.apiResource = this._http;
        this.baseMessage = this._message;
        this.baseModal = this.modalService;
        this.cacheValue = this.cacheService;
        this.cascadeBase = this.cascade;
    }
    public loadData = {
        rows: [],
        total: 0
    };

    // public width = '50px';

    public ngOnInit() {
        this.showprocdata();
    }

    public async showprocdata() {
        if (this.initData) {
            this.initValue = this.initData;
        }

        if (this.config.ajaxproc) {
            const url = this._buildURL(this.config.ajaxConfig.url);
            const params = {
                ...this._buildParameters(this.config.ajaxConfig.params),
                // ...this._buildPaging(),
                ...this._buildFilter(this.config.ajaxConfig.filter),
                ...this._buildSort(),
                ...this._buildColumnFilter(),
                ...this._buildFocusId(),
                ...this._buildSearch()
            };

            const aloadData = await this._load(url, params, 'proc');
            if (aloadData && aloadData.status === 200 && aloadData.isSuccess) {
                this.loadData.rows = aloadData.data.dataSet1;
                const keyIdCode = this.config.keyId ? this.config.keyId : 'Id';
                const length = aloadData.data.dataSet1.length
                for (let i = 0; i < length; i++) {
                    this.loadData.rows[i]['_serilize'] = i + 1;
                    aloadData.data.dataSet1[i]['key'] = aloadData.data.dataSet1[i][keyIdCode]
                }
                this.loadData.total = this.loadData.rows.length;
                this.total = this.loadData.total;
                // console.log('this.loadData:', this.loadData);
                if (this.config.select) {
                    this.config.select.forEach(selectItem => {
                        this.config.columns.forEach(columnItem => {
                            if (columnItem.editor) {
                                if (columnItem.editor.field === selectItem.name) {
                                    // if (selectItem.type === 'selectGrid') {
                                    columnItem.editor.options['select'] =
                                        selectItem.config;
                                    // }
                                }
                            }
                        });
                    });
                }

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
                // 当前作为子组件出现 临时变量值
                if (this.bsnData) {
                    for (const key in this.bsnData) {
                        if (this.bsnData.hasOwnProperty(key)) {
                            this.tempValue[key] = this.bsnData[key];
                        }
                    }
                }
                // liu 测试动态表格
                if (this.config.columnsAjax) {
                    // await this.loadDynamicColumns();
                }

                this.resolverRelation();
                if (this.initData) {
                    this.initValue = this.initData;
                }
                if (this.ref) {
                    for (const p in this.ref) {
                        this.tempValue[p] = this.ref[p];
                    }
                }
                if (this.cacheService) {
                    this.cacheValue = this.cacheService;
                }
                if (this.config.dataSet) {
                    (async () => {
                        for (
                            let i = 0, len = this.config.dataSet.length;
                            i < len;
                            i++
                        ) {
                            const urlset = this._buildURL(
                                this.config.dataSet[i].ajaxConfig.url
                            );
                            const paramsset = this._buildParameters(
                                this.config.dataSet[i].ajaxConfig.params
                            );
                            const data = await this.get(urlset, paramsset);
                            if (data.isSuccess) {
                                if (this.config.dataSet[i].fields) {
                                    const dataSetObjs = [];
                                    data.data.map(d => {
                                        const setObj = {};
                                        this.config.dataSet[i].fields.forEach(
                                            (fieldItem, index) => {
                                                if (d[fieldItem.field]) {
                                                    setObj[fieldItem.name] =
                                                        d[fieldItem.field];
                                                }
                                            }
                                        );
                                        dataSetObjs.push(setObj);
                                    });
                                    this.dataSet[
                                        this.config.dataSet[i].name
                                    ] = dataSetObjs;
                                } else {
                                    this.dataSet[this.config.dataSet[i].name] =
                                        data.data;
                                }
                            }
                        }
                    })();
                }
                // liu 20181022 特殊处理行定位
                if (this.config.isSelectGrid) {
                    this.is_Selectgrid = false;
                }
                if (this.config.selectGridValueName) {
                    this.selectGridValueName = this.config.selectGridValueName;
                }

                this.pageSize = this.config.pageSize
                    ? this.config.pageSize
                    : this.pageSize;
                if (this.config.componentType) {
                    if (!this.config.componentType.child) {
                        this.loadbypage();
                    } else if (this.config.componentType.own === true) {
                        this.loadbypage();
                    }
                } else {
                    this.loadbypage();
                }

                // 初始化级联
                this.caseLoad();
            }
        } else {
            this.tempValue['moduleName'] = this._router.snapshot.params['name'] ? this._router.snapshot.params['name'] : '';
            if (this.config.checkedConfig) {
                if (this.config.checkedConfig.width) {
                    this.checkedWidth = this.config.checkedConfig.width;
                }
            }
            if (this.config.select) {
                this.config.select.forEach(selectItem => {
                    this.config.columns.forEach(columnItem => {
                        if (columnItem.editor) {
                            if (columnItem.editor.field === selectItem.name) {
                                // if (selectItem.type === 'selectGrid') {
                                columnItem.editor.options['select'] =
                                    selectItem.config;
                                // }
                            }
                        }
                    });
                });
            }

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
            // 当前作为子组件出现 临时变量值
            if (this.bsnData) {
                for (const key in this.bsnData) {
                    if (this.bsnData.hasOwnProperty(key)) {
                        this.tempValue[key] = this.bsnData[key];
                    }
                }
            }

            this.resolverRelation();
            if (this.initData) {
                this.initValue = this.initData;
            }
            if (this.ref) {
                for (const p in this.ref) {
                    this.tempValue[p] = this.ref[p];
                }
            }
            if (this.config.dataSet) {
                (async () => {
                    for (
                        let i = 0, len = this.config.dataSet.length;
                        i < len;
                        i++
                    ) {
                        const url = this._buildURL(
                            this.config.dataSet[i].ajaxConfig.url
                        );
                        const params = this._buildParameters(
                            this.config.dataSet[i].ajaxConfig.params
                        );
                        const data = await this.get(url, params);
                        if (data.isSuccess) {
                            if (this.config.dataSet[i].fields) {
                                const dataSetObjs = [];
                                data.data.map(d => {
                                    const setObj = {};
                                    this.config.dataSet[i].fields.forEach(
                                        (fieldItem, index) => {
                                            if (d[fieldItem.field]) {
                                                setObj[fieldItem.name] =
                                                    d[fieldItem.field];
                                            }
                                        }
                                    );
                                    dataSetObjs.push(setObj);
                                });
                                this.dataSet[
                                    this.config.dataSet[i].name
                                ] = dataSetObjs;
                            } else {
                                this.dataSet[this.config.dataSet[i].name] =
                                    data.data;
                            }
                        }
                    }
                })();
            }
            // liu 20181022 特殊处理行定位
            if (this.config.isSelectGrid) {
                this.is_Selectgrid = false;
            }
            if (this.config.selectGridValueName) {
                this.selectGridValueName = this.config.selectGridValueName;
            }

            this.pageSize = this.config.pageSize
                ? this.config.pageSize
                : this.pageSize;

        }
    }

    public ngAfterViewInit() {
        if (!this.config.ajaxproc) {
            if (this.config.componentType) {
                if (!this.config.componentType.child) {
                    this.load();
                } else if (this.config.componentType.own === true) {
                    this.load();
                }
            } else {
                this.load();
            }
            if (this.config.autoLoad) {
                this.autoLoadData();
            }
            // 初始化级联
            this.caseLoad();
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
            this.GetToolbarEvents();
        }
    }
    private resolverRelation() {
        // 注册按钮状态触发接收器
        if (!this._statusSubscription) {
            this._statusSubscription = this.stateEvents.subscribe(updateState => {
                if (updateState._viewId === this.config.viewId) {
                    const option = updateState.option;
                    switch (updateState._mode) {
                        case BSN_COMPONENT_MODES.REFRESH:
                            this.load();
                            break;
                        case BSN_COMPONENT_MODES.CREATE:
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.addRow();
                            break;
                        // case BSN_COMPONENT_MODES.ADD_ROW_DATA:
                        //     !this.beforeOperation.beforeItemDataOperation(option) &&
                        //     this._resolveAjaxConfig(option);
                        //     break;
                        case BSN_COMPONENT_MODES.CANCEL_SELECTED:
                            this.cancelSelectRow();
                            break;
                        case BSN_COMPONENT_MODES.EDIT:
                            if (
                                this.dataList.filter(item => item.checked === true)
                                    .length <= 0
                            ) {
                                this.baseMessage.create('info', '请选择要执行的数据');
                                return;
                            }
                            this.beforeOperation.operationItemsData = this._getCheckedItems();
                            !this.beforeOperation.beforeItemsDataOperation(
                                option
                            ) && this.updateRow();
                            break;
                        case BSN_COMPONENT_MODES.CANCEL:
                            this.cancelRow();
                            break;
                        case BSN_COMPONENT_MODES.SAVE:
                            this.beforeOperation.operationItemsData = [
                                ...this._getCheckedItems(),
                                ...this._getAddedRows()
                            ];
                            !this.beforeOperation.beforeItemsDataOperation(
                                option
                            ) && this.saveRow(option);
                            break;
                        case BSN_COMPONENT_MODES.DELETE:
                            this.beforeOperation.operationItemsData = this._getCheckedItems();
                            !this.beforeOperation.beforeItemsDataOperation(
                                option
                            ) && this.deleteRow(option);
                            break;
                        case BSN_COMPONENT_MODES.DIALOG:
                            this.beforeOperation.operationItemData = this._selectRow;
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.dialog(option);
                            break;
                        case BSN_COMPONENT_MODES.EXECUTE:
                            // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
                            this._resolveAjaxConfig(option);
                            break;
                        case BSN_COMPONENT_MODES.WINDOW:
                            this.beforeOperation.operationItemData = this._selectRow;
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.windowDialog(option);
                            break;
                        case BSN_COMPONENT_MODES.FORM:
                            this.beforeOperation.operationItemData = this._selectRow;
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.formDialog(option);
                            break;
                        case BSN_COMPONENT_MODES.SEARCH:
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.SearchRow(option);
                            break;
                        case BSN_COMPONENT_MODES.UPLOAD:
                            this.beforeOperation.operationItemData = this._selectRow;
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.uploadDialog(option);
                            break;
                        case BSN_COMPONENT_MODES.FORM_BATCH:
                            if (
                                this.dataList.filter(item => item.checked === true)
                                    .length <= 0
                            ) {
                                this.baseMessage.create('info', '请选择要执行的数据');
                                return;
                            }
                            this.beforeOperation.operationItemsData = this._getCheckedItems();
                            if (!this.beforeOperation.beforeItemsDataOperation(
                                option
                            )) {
                                this.formBatchDialog(option);
                                this.load();
                            }
                            break;
                        case BSN_COMPONENT_MODES.IMPORT_EXCEL:
                            this.importExcelDialog(option);
                            break;
                        case BSN_COMPONENT_MODES.EXPORT:
                            this.exportExcel(option);
                            break;
                    }
                }
            });
        }

        if (
            this.config.componentType &&
            this.config.componentType.sub === true
        ) {
            this.after(this, 'selectRow', () => {
                this._selectRow &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                            this.config.viewId,
                            {
                                data: {
                                    ...this.initValue,
                                    ...this._selectRow
                                },
                                initValue: this.initValue ? this.initValue : {},
                                tempValue: this.tempValue ? this.tempValue : {},
                                subViewId: () => {
                                    let id = '';
                                    this.config.subMapping.forEach(sub => {
                                        const mappingVal = this._selectRow[sub['field']];
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


        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, 'selectRow', () => {
                // 编辑行数据时,不进行消息发送
                if (this.editCache && this._selectRow && this.editCache.hasOwnProperty(this._selectRow['Id']) && this.editCache[this._selectRow['Id']]['edit']) {
                    return false;
                }
                if (this.config.componentType.sendIds) {
                    // this.sendCheckedRowData();
                } else {
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                            this.config.viewId,
                            {
                                data: { ...this._selectRow, ...this.tempValue }
                            }
                        )
                    );
                }

            });
        }
        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            if (!this._cascadeSubscription) {
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
                                    if (option) {
                                        // 解析参数
                                        if (
                                            relation.params &&
                                            relation.params.length > 0
                                        ) {
                                            relation.params.forEach(param => {
                                                if (!this.tempValue) {
                                                    this.tempValue = {};
                                                }
                                                this.tempValue[param['cid']] =
                                                    option.data[param['pid']];
                                            });

                                        }
                                        // console.log('495 tempvalue:', this.tempValue);
                                    }

                                    // 匹配及联模式
                                    if (cascadeEvent._mode === mode) {
                                        switch (mode) {
                                            case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                                this.load();
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                                this.focusIds = null;
                                                this.pageIndex = 1;
                                                this.load();
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN:
                                                this.focusIds = null;
                                                this.load();
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                                                break;
                                            case BSN_COMPONENT_CASCADE_MODES.REFRESH_BY_IDS:

                                                this.focusIds = null;
                                                this.load();
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

    private emptyLoad() {
        this._selectRow = {};
        this.cascade.next(
            new BsnComponentMessage(
                BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                this.config.viewId,
                {
                    data: {}
                }
            )
        );
    }

    public pageIndexPlan() {
        if (this.pageIndex > 1) {
            const p_pindex = ((this.pageIndex - 1) * this.pageSize);
            if (this.loadData.total <= p_pindex) {
                this.pageIndex = this.pageIndex - 1;
                this.loadbypage();
            } else {
                this.loadbypage();
            }
        }
    }

    public loadbypage() {
        if (typeof this.pageIndex !== 'undefined') {
            this.pageIndex = this.pageIndex || 1;
        }
        // 当前页无数据则退回到上一页
        if (this.pageIndex > 1) {
            const p_pindex = ((this.pageIndex - 1) * this.pageSize);
            if (this.loadData.total <= p_pindex) {
                this.pageIndex = this.pageIndex - 1;
                this.pageIndexPlan();
            }
        }

        const pagedata = [];
        let j = 0;
        for (let i = 0; i < this.pageSize; i++) {
            j = ((this.pageIndex - 1) * this.pageSize) + i;
            if (j < this.loadData.total) {
                pagedata.push(this.loadData.rows[j]);
            }
        }
        this._updateEditCacheByLoad(pagedata);
        this.dataList = pagedata;
          // liu 20200728 行列合并
          if(this.config.mergeconfig)
          this._createMapd_new(this.config.mergeconfig,this.dataList);
    }

    public load(sd?: boolean) {
        this.changeConfig_new = {};
        // this._selectRow = {};
        // this.pageIndex = pageIndex;
        setTimeout(() => {
            this.loading = true;
        });
        this.allChecked = false;
        this.checkedCount = 0;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const method = this.config.ajaxConfig.ajaxType;
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildPaging(),
            ...this._buildFilter(this.config.ajaxConfig.filter),
            ...this._buildSort(),
            ...this._buildColumnFilter(),
            ...this._buildFocusId(sd),
            ...this._buildSearch()
        };
        (async () => {
            const loadData = await this._load(url, params, method);
            if (loadData.isSuccess) {
                let resData;
                if (method === 'proc') {
                    resData = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
                } else {
                    resData = loadData.data.rows;
                }
                // console.log('579 resdata:', resData);
                if (resData) {
                    let focusId;
                    if (loadData.data.focusedId) {
                        focusId = loadData.data.focusedId[0];
                    } else {
                        const slcId = this._selectRow['key'];
                        if (slcId) {
                            if (resData.length > 0 &&
                                resData.filter(s => s[this.config.keyId] === slcId).length > 0
                            ) {
                                focusId = slcId;
                            } else {
                                resData.length > 0 &&
                                    (focusId = resData[0].Id);
                            }
                        } else {
                            resData.length > 0 &&
                                (focusId = resData[0].Id);
                        }

                    }
                    if (resData.length > 0) {
                        this.dataList = resData;
                        resData.forEach((row, index) => {
                            row['key'] = row[this.config.keyId]
                                ? row[this.config.keyId]
                                : 'Id';
                            if (this.is_Selectgrid) {
                                if (row.Id === focusId) {
                                    if (this.editCache[row['key']]) {
                                        this.editCache[row['key']]['edit'] = false;
                                    }
                                    this.selectRow(row);
                                }
                            }
                            if (loadData.data.page === 1) {
                                row['_serilize'] = index + 1;
                            } else {
                                row['_serilize'] =
                                    (loadData.data.page - 1) *
                                    loadData.data.pageSize +
                                    index +
                                    1;
                            }

                            if (this.config.checkedMapping) {
                                this.config.checkedMapping.forEach(m => {
                                    if (
                                        row[m.name] &&
                                        row[m.name] === m.value
                                    ) {
                                        row['checked'] = true;
                                    }
                                });
                            }
                        });
                    } else {
                        this.dataList = [];
                        this._selectRow = {};
                        this.emptyLoad();
                    }

                    this._updateEditCacheByLoad(resData);
                    // this.dataList = loadData.data.rows;
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
                    this.emptyLoad();
                }



                // if (method === 'proc') {


                // } else {
                //     if (loadData.data && loadData.data.rows) {
                //         // 设置聚焦ID
                //         // 默认第一行选中，如果操作后有focusId则聚焦ID为FocusId
                //         let focusId;
                //         if (loadData.data.focusedId) {
                //             focusId = loadData.data.focusedId[0];
                //         } else {
                //             const slcId = this._selectRow['key'];
                //             if (slcId) {
                //                 if (loadData.data.rows.length > 0 &&
                //                     loadData.data.rows.filter(s => s[this.config.keyId] === slcId).length > 0
                //                 ) {
                //                     focusId = slcId;
                //                 } else {
                //                     loadData.data.rows.length > 0 &&
                //                         (focusId = loadData.data.rows[0].Id);
                //                 }
                //             } else {
                //                 loadData.data.rows.length > 0 &&
                //                     (focusId = loadData.data.rows[0].Id);
                //             }

                //         }
                //         if (loadData.data.rows.length > 0) {
                //             this.dataList = loadData.data.rows;
                //             loadData.data.rows.forEach((row, index) => {
                //                 row['key'] = row[this.config.keyId]
                //                     ? row[this.config.keyId]
                //                     : 'Id';
                //                 if (this.is_Selectgrid) {
                //                     if (row.Id === focusId) {
                //                         this.selectRow(row);
                //                     }
                //                 }
                //                 if (loadData.data.page === 1) {
                //                     row['_serilize'] = index + 1;
                //                 } else {
                //                     row['_serilize'] =
                //                         (loadData.data.page - 1) *
                //                         loadData.data.pageSize +
                //                         index +
                //                         1;
                //                 }

                //                 if (this.config.checkedMapping) {
                //                     this.config.checkedMapping.forEach(m => {
                //                         if (
                //                             row[m.name] &&
                //                             row[m.name] === m.value
                //                         ) {
                //                             row['checked'] = true;
                //                         }
                //                     });
                //                 }
                //             });
                //         } else {
                //             this.dataList = [];
                //             this._selectRow = {};
                //         }

                //         this._updateEditCacheByLoad(loadData.data.rows);
                //         // this.dataList = loadData.data.rows;
                //         this.total = loadData.data.total;
                //         if (this.is_Search) {
                //             this.createSearchRow();
                //         }
                //     } else {
                //         this._updateEditCacheByLoad([]);
                //         this.dataList = loadData.data;
                //         this.total = 0;
                //         if (this.is_Search) {
                //             this.createSearchRow();
                //         }
                //     }
                // }

            } else {
                this._updateEditCacheByLoad([]);
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

            // liu 20200728 行列合并
            if(this.config.mergeconfig){
                this._createMapd_new(this.config.mergeconfig,this.dataList);
            } 
            else {
                console.log('查看当前结构',this.editCache);
            }


            setTimeout(() => {
                this.loading = false;
            });
        })();
    }

    // 根据配置按照时间间隔load数据
    /**
     * autoLoad 是否加载
     */
    public autoLoadData() {
        if (this.autoLoad) {
            this.autoLoadDataList = setInterval(() => {
                this.load()
            }, this.config.autoLoadTime);
        } else {
            this.autoLoad = true;
            this.autoLoadDataList = setInterval(() => {
                this.load()
            }, this.config.autoLoadTime);
        }
    }

    // 获取 文本值，当前选中行数据
    public async loadByselect(
        ajaxConfig,
        componentValue?,
        selecttempValue?,
        cascadeValue?,
        initData?
    ) {
        const url = this._buildURL(ajaxConfig.url);
        const method = ajaxConfig.ajaxType;
        const params = {
            ...this._buildParametersByselect(
                ajaxConfig.params,
                componentValue,
                selecttempValue,
                cascadeValue,
                initData
            )
        };
        let selectrowdata = {};
        const loadData = await this._load(url, params, method);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                if (loadData.data.length > 0) {
                    selectrowdata = loadData.data[0];
                }
            }
        }
        return selectrowdata;
    }

    // liu 20181212 获取 文本值，当前选中多行数据 返回的是数据集
    public async loadByselectMultiple(
        ajaxConfig,
        componentValue?,
        selecttempValue?,
        cascadeValue?
    ) {
        const url = this._buildURL(ajaxConfig.url);
        const params = {
            ...this._buildParametersByselect(
                ajaxConfig.params,
                componentValue,
                selecttempValue,
                cascadeValue
            )
        };
        let selectrowdata = [];
        const loadData = await this._load(url, params, ajaxConfig.ajaxType);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                if (loadData.data.length > 0) {
                    selectrowdata = loadData.data;
                }
            }
        }
        return selectrowdata;
    }
    // 构建获取文本值参数
    private _buildParametersByselect(
        paramsConfig,
        componentValue?,
        selecttempValue?,
        cascadeValue?,
        initData?
    ) {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: selecttempValue,
                componentValue: componentValue,
                initValue: {...this.initValue, ...initData},
                cacheValue: this.cacheService,
                cascadeValue: cascadeValue,
                router: this._router
            });
        }
        return params;
    }

    // 获取当前选中的值 liu 扩展部分，目前不实现，原因是会多请求数据（主要是对级联赋值的扩充）
    public selectload(selectparams?: any[], selectvalue?) {
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params)
            // ...selectparams
        };

        (async () => {
            const loadData = await this._load(url, params, this.config.ajaxConfig.ajaxType);
            if (loadData && loadData.status === 200 && loadData.isSuccess) {
                if (loadData.data && loadData.data.rows) {

                    if (loadData.data.rows.length > 0) {
                        // loadData.data.rows.forEach((row, index) => {
                        //     row['key'] = row[this.config.keyId] ? row[this.config.keyId] : 'Id';
                        // });
                    } else {
                    }
                } else {
                }
            } else {
            }
        })();
    }

    public async saveRow(option) {
        const addRows = [];
        const updateRows = [];
        let isSuccess = false;
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'adding') {
                addRows.push(item);
            } else if (item['row_status'] === 'updating') {
                item = JSON.parse(
                    JSON.stringify(this.editCache[item.key].data)
                );
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

    public async _execute(rowsData, method, postConfig) {
        let isSuccess = false;
        const desc = postConfig.description ? postConfig.description : '保存数据,';
        if (postConfig) {
            for (let i = 0, len = postConfig.length; i < len; i++) {
                const submitData = [];
                rowsData.map(rowData => {
                    const submitItem = CommonTools.parametersResolver({
                        params: postConfig[i].params,
                        tempValue: this.tempValue,
                        componentValue: rowData,
                        item: rowData,
                        initValue: this.initValue,
                        cacheValue: this.cacheService,
                        router: this._router
                    });
                    submitData.push(submitItem);
                });
                const response = await this[method](
                    postConfig[i].url,
                    submitData
                );
                if (response && response.status === 200 && response.isSuccess) {
                    // 返回批量的处理结果
                    if (Array.isArray(response.data)) {
                        const messages = [];
                        for (let j = 0, jlen = response.data.length; j < jlen; j++) {
                            if (response.data[j].Message && response.data[j].Message.split(':').length > 0) {
                                const msg = response.data[j].Message.split(':');
                                switch (msg[0]) {
                                    case 'success':
                                        rowsData[j]['isSuccess'] = true;
                                        break;
                                    case 'error':
                                        messages.push(msg[1]);
                                        rowsData[j]['isSuccess'] = false;
                                        break;
                                    case 'info':
                                        messages.push(msg[1]);
                                        rowsData[j]['isSuccess'] = false;
                                        break;
                                    case 'warning':
                                        messages.push(msg[1]);
                                        rowsData[j]['isSuccess'] = false;
                                        break;
                                }
                            }
                        }
                        if (messages.length > 0) {
                            this.baseMessage.create('error', messages.join('<br/>'));
                        }

                    } else { // 单条处理结果
                        this.baseMessage.create('success', '保存成功');
                        this.focusIds = this._getFocusIds(response.data);
                    }
                    this.sendCascadeMessage(response.data);
                    isSuccess = true;
                    // 日志记录
                    this.apiResource.addOperationLog({
                        eventId: BSN_OPERATION_LOG_TYPE.DELETE,
                        eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                        funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                        description: `${desc} [执行成功] 数据为: ${JSON.stringify(rowsData)}`
                    }).subscribe(result => { })
                } else {
                    this.baseMessage.create('error', response.message);
                    // 日志记录
                    this.apiResource.addOperationLog({
                        eventId: BSN_OPERATION_LOG_TYPE.DELETE,
                        eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                        funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                        description: `${desc} [执行失败] 数据为, ${response.message}`
                    }).subscribe(result => { })
                }
            }
            if (isSuccess) {
                rowsData.map(row => {
                    if (row.isSuccess) {
                        this._saveEdit(row.key);
                    }

                });
                // 获取返回的focusId

                this.load();
            }
        }
        // if (isSuccess === true) {
        //     this.cascade.next(
        //         new BsnComponentMessage(
        //             BSN_COMPONENT_CASCADE_MODES.REFRESH,
        //             this.config.viewId
        //         )
        //     );
        // }
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

    public async executeSelectedAction(selectedRow, option) {
        let isSuccess;
        if (selectedRow) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.filter(
                        item => item.action === 'EXECUTE_SELECTED'
                    );
                    const index = execButtons.findIndex(
                        item => (item.actionName = option.name)
                    );
                    if (index !== -1) {
                        const cfg = execButtons[index].ajaxConfig[option.type];
                        isSuccess = this._executeSelectedAction(
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
                        isSuccess = this._executeSelectedAction(
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
                const newParam = CommonTools.parametersResolver({
                    params: cfg[i].params,
                    tempValue: this.tempValue,
                    item: selectedRow,
                    initValue: this.initValue,
                    cacheValue: this.cacheService,
                    router: this._router
                });
                const response = await this[option.type](cfg[i].url, newParam);
                if (response.isSuccess) {
                    this.baseMessage.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
                }
            }
            this.load();
            if (
                this.config.componentType &&
                this.config.componentType.parent === true
            ) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }
    }

    public async executeCheckedAction(items, option) {
        let isSuccess;
        if (items && items.length > 0) {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const execButtons = bar.group.filter(
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
                    const execButtons = bar.dropdown.button.filter(
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

    // 获取行内编辑是行填充数据
    private _getContent() {
        this.rowContent['key'] = null;
        this.config.columns.forEach(element => {
            const colsname = element.field.toString();
            this.rowContent[colsname] = '';
        });
    }

    public addRow() {
        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonTools.uuID(32);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        rowContentNew['row_status'] = 'adding';
        // 针对查询和新增行处理
        if (this.is_Search) {
            this.dataList.splice(1, 0, rowContentNew);
        } else {
            const CopyDataList = [...this.dataList]
            const count = CopyDataList.reverse().findIndex(e => e['row_status'] === 'adding');
            if (count === -1) {
                this.dataList.splice(0, 0, rowContentNew);
            } else {
                const index = this.dataList.length - count;
                this.dataList.splice(index, 0, rowContentNew);
            }
            this.dataList = this.dataList.filter(e => e['key'] !== null);
            // this.dataList = [rowContentNew, ...this.dataList];
        }
        if (!this.changeConfig_new[fieldIdentity]) {
            this.changeConfig_new[fieldIdentity] = {};
        }
        // this.dataList.push(this.rowContent);
        this._updateEditCache();
        this._startEdit(fieldIdentity.toString());
        return true;
    }

    public SearchRow(option) {
        if (option['type'] === 'addSearchRow') {
            this.addSearchRow();
        } else if (option['type'] === 'cancelSearchRow') {
            this.cancelSearchRow();
        }
    }

    // 新增查询
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
            // this.load(); // 查询后将页面置1 liu 20181204 去除查询按钮的load功能
            // let len = this.dataList.length;
            // for (let i = 0; i < len; i++) {
            //     if (this.dataList[i]['row_status'] === 'search') {
            //         this.dataList.splice(
            //             this.dataList.indexOf(this.dataList[i]),
            //             1
            //         );
            //         i--;
            //         len--;
            //     }
            // }

            // this.is_Search = false;
            // this.search_Row = {};
            this.cancelSearchRow();
        }
    }

    // 生成查询行
    public createSearchRow() {
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
    public cancelSearchRow() {
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
        this.load(); // 查询后将页面置1
        return true;
    }

    public updateRow() {
        let checkedCount = 0;
        this.dataList.forEach(item => {
            if (item.checked) {
                if (item['row_status'] && item['row_status'] === 'adding') {
                } else if (
                    item['row_status'] &&
                    item['row_status'] === 'search'
                ) {
                } else {
                    item['row_status'] = 'updating';
                }
                this._startEdit(item.key);
                // liu 20180927
                if (!this.changeConfig_new[item.key]) {
                    this.changeConfig_new[item.key] = {};
                }
                checkedCount++;
            }
        });
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
            for (const key in this.cascadeList[sendCasade]) {
                // 处理当前级联
                if (!this.changeConfig_new[rowCasade][key]) {
                    this.changeConfig_new[rowCasade][key] = {};
                }

                if (this.cascadeList[sendCasade][key]['dataType']) {
                    this.cascadeList[sendCasade][key]['dataType'].forEach(
                        caseItem => {
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
                                    if (
                                        ajaxItem['type'] === 'selectObjectValue'
                                    ) {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            this.changeConfig_new[rowCasade][
                                                key
                                            ]['cascadeValue'][
                                                ajaxItem['name']
                                            ] =
                                                data.dataItem[
                                                ajaxItem['valueName']
                                                ];
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
                            this.editCache[data.key].data[ key] = this.changeConfig_new[rowCasade][key ]['setValue'];

                            // endregion  解析结束
                        }
                    );
                }
                if (this.cascadeList[sendCasade][key]['valueType']) {
                    this.cascadeList[sendCasade][key]['valueType'].forEach(
                        caseItem => {
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
                            if (regularData === null) {
                                regularData = '';
                            }
                            const regularflag = reg1.test(regularData);
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
                                    if (
                                        caseItem['setValue']['type'] === 'value'
                                    ) {
                                        // 静态数据
                                        this.changeConfig_new[rowCasade][key]['setValue'] = caseItem['setValue']['value'];
                                    }
                                    if (
                                        caseItem['setValue']['type'] ==='selectValue' ) {
                                        // 选中行数据[这个是单值]
                                        this.changeConfig_new[rowCasade][key]['setValue'] =data[caseItem['setValue']['valueName']];
                                    }
                                    if ( caseItem['setValue']['type'] ==='selectObjectValue') {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            this.changeConfig_new[rowCasade][key]['setValue'] =data.dataItem[caseItem['setValue']['valueName' ]];
                                        }
                                    }
                                    if (data.data === null) {
                                        this.changeConfig_new[rowCasade][key]['setValue'] = null;
                                    }
                                    if (caseItem['setValue']['type'] === 'notsetValue') {
                                        // 选中行对象数据
                                        if ( this.changeConfig_new[rowCasade][ key].hasOwnProperty('setValue')) {
                                            delete this.changeConfig_new[ rowCasade ][key]['setValue'];
                                        }
                                    }
                                  
                                } else {
                                    if (
                                        this.changeConfig_new[rowCasade][key].hasOwnProperty('setValue')
                                    ) {
                                        delete this.changeConfig_new[rowCasade][key ]['setValue'];
                                    }
                                }
                            }
                            // endregion  解析结束
                            // 扩充：判断当前字段是否有 edit ，如果无编辑，则将该字段赋值
                            if (this.changeConfig_new[rowCasade][key]) {
                                if (this.changeConfig_new[rowCasade][key]) {
                                    //
                                    if (this.isEdit(key)) {
                                        this.editCache[data.key].data[ key] = this.changeConfig_new[rowCasade][key ]['setValue'];
                                    }
                                }
                            }
                            this.editCache[data.key].data[ key] = this.changeConfig_new[rowCasade][key ]['setValue'];
                        }
                    );
                }
                // if (!this.isEmptyObject(this.changeConfig_new[rowCasade][key])) { }

                this.changeConfig_new[rowCasade][key] = JSON.parse(
                    JSON.stringify(this.changeConfig_new[rowCasade][key])
                );
            }

        }
        // this.changeConfig_new = JSON.parse(JSON.stringify(this.changeConfig_new));
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

    public deleteRow(option) {
        if (this.dataList.filter(item => item.checked === true).length <= 0) {
            this.baseMessage.create('info', '请选择要删除的数据');
        } else {
            if (
                option.ajaxConfig.delete &&
                option.ajaxConfig.delete.length > 0
            ) {
                option.ajaxConfig.delete.map(async delConfig => {
                    this.baseModal.confirm({
                        nzTitle: delConfig.title ? delConfig.title : '提示',
                        nzContent: delConfig.message ? delConfig.message : '',
                        nzOnOk: () => {
                            const newData = [];
                            const serverData = [];
                            this.dataList.forEach(item => {
                                if (
                                    item.checked === true &&
                                    item['row_status'] === 'adding'
                                ) {
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
                                    this.dataList.splice(
                                        this.dataList.indexOf(d),
                                        1
                                    );
                                });
                            }
                            if (serverData.length > 0) {
                                // 目前对应单个操作可以正确执行，多个操作由于异步的问题，需要进一步调整实现方式
                                this._executeDelete(delConfig, serverData);
                            }
                        },
                        nzOnCancel: () => { }
                    });
                });
            }
        }
    }

    public async _executeDelete(deleteConfig, ids) {
        let isSuccess;
        // 默认删除数据，无需进行参数的设置，删除数据的ids将会从列表勾选中自动获得
        const params = {
            _ids: ids.join(',')
        };
        const desc = deleteConfig.description ? deleteConfig.description : '删除数据,';
        const response = await this['delete'](deleteConfig.url, params);
        if (response && response.status === 200 && response.isSuccess) {
            this.baseMessage.create('success', '删除成功');
            isSuccess = true;
            this.focusIds = null;
            this.load();
            this.sendCascadeMessage(response.data);

            // 操作日志
            this.apiResource.addOperationLog({
                eventId: BSN_OPERATION_LOG_TYPE.DELETE,
                eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                description: `${desc} [执行成功] ID为: ${ids.join(',')}`
            }).subscribe(result => {

            })
        } else {
            this.baseMessage.create('error', response.message);
            // 操作日志
            this.apiResource.addOperationLog({
                eventId: BSN_OPERATION_LOG_TYPE.DELETE,
                eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
                funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                description: `${desc} [执行失败] ID为: ${ids.join(',')}`
            }).subscribe(result => {

            });
        }

        return isSuccess;
    }

    /**
     * 弹出页面
     * @param dialog
     */
    private showLayout(dialog) {
        const footer = [];
        this._http.getLocalData(dialog.layoutName).subscribe(data => {
            const selectedRow = this._selectRow ? this._selectRow : {};
            const checkedIds = { 'checkedIds': this._getCheckItemsId() ? this._getCheckItemsId() : '' };
            const tmpValue = this.tempValue ? this.tempValue : {};
            const iniVal = this.initValue ? this.initValue : {};
            tmpValue['moduleName'] = this._router.snapshot.params['name'] ? this._router.snapshot.params['name'] : '';
            const modal = this.baseModal.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzClosable: dialog.closable ? dialog.closable : false,
                nzContent: component['layout'],
                nzComponentParams: {
                    permissions: this.permissions,
                    config: data,
                    initData: { ...iniVal, ...tmpValue, ...selectedRow, ...checkedIds }
                },
                nzFooter: footer
            });
            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button['label'] = btn.text;
                    button['type'] = btn.type ? btn.type : 'default';
                    button['show'] = true;
                    button['onClick'] = componentInstance => {
                        if (btn['name'] === 'save') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn,
                                    () => {
                                        modal.close();
                                        // todo: 操作完成当前数据后需要定位
                                        this.load();
                                        this.sendCascadeMessage();
                                    }
                                );
                            })();
                        } else if (btn['name'] === 'saveAndKeep') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn,
                                    () => {
                                        // todo: 操作完成当前数据后需要定位
                                        this.load();
                                        this.sendCascadeMessage();
                                    }
                                );
                                if (result) {

                                }
                            })();
                        } else if (btn['name'] === 'close') {
                            modal.close();
                            this.load();
                            this.sendCascadeMessage();
                        } else if (btn['name'] === 'reset') {
                            this._resetForm(componentInstance);
                        } else if (btn['name'] === 'ok') {
                            modal.close();
                            this.load();
                            this.sendCascadeMessage();
                            //
                        }
                    };
                    footer.push(button);
                });
            }
        });
    }

    private sendCascadeMessage(returnValue?: any) {
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            this.cascade.next(
                new BsnComponentMessage(
                    BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                    this.config.viewId,
                    {
                        data: this._selectRow
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
                            paramData = { _add_ids: r_val.ids.join(',') };
                            break;
                        case 'edit':
                            mode = BSN_COMPONENT_CASCADE_MODES.EDIT_ASNYC_TREE_NODE;
                            paramData = { _edit_ids: r_val.ids.join(',') };
                            break;
                        case 'delete':
                            mode = BSN_COMPONENT_CASCADE_MODES.DELETE_ASYNC_TREE_NODE;
                            paramData = { _del_ids: r_val.ids.join(',') };
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

    // region 批量确认提交数据，未完成与服务端的批量测试功能
    // 关于相关配置的问题需要进一步进行讨论

    private _resolveAjaxConfig(option) {
        if (option.ajaxConfig && option.ajaxConfig.length > 0) {
            option.ajaxConfig.filter(c => !c.parentName).map(c => {
                this._getAjaxConfig(c, option);
            });
        }
    }

    private _getAjaxConfig(c, option) {
        let msg;
        if (c.action) {
            let handleData;
            // 所有获取数据的方法都会将数据保存至tempValue
            // 使用时可以通过临时变量定义的固定属性访问
            // 使用时乐意通过内置的参数类型进行访问
            switch (c.action) {
                case BSN_EXECUTE_ACTION.EXECUTE_ADD_ROW_DATA:
                    if (c.ajaxType !== 'post') {
                        return;
                    }
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    handleData = {};
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getCheckedItems();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                    if (this._selectRow['row_status'] === 'adding') {
                        this.baseMessage.create(
                            'info',
                            '当前数据未保存无法进行处理'
                        );
                        return;
                    }
                    handleData = this._getSelectedItem();
                    this.beforeOperation.operationItemData = handleData;
                    if (this.beforeOperation.beforeItemDataOperation(option)) {
                        return;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {

                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    handleData = this._getCheckItemsId();
                    this.beforeOperation.operationItemsData = this._getCheckedItems();
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_EDIT_ROW:

                    if (c.ajaxType !== 'put') {
                        return;
                    }

                    handleData = this._getEditedRows();
                    msg = '编辑数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }

                    // 获取保存状态的数据
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    this.beforeOperation.operationItemsData = this._getCheckedItems();
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }

                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SAVE_ROW:
                    if (c.ajaxType !== 'post') {
                        return;
                    }
                    handleData = this._getAddedRows();
                    msg = '新增数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }

                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return;
                    }
                    this.beforeOperation.operationItemsData = this._getCheckedItems();
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return;
                    }
                    // 获取更新状态的数据

                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_MESSAGE:
                    handleData = {};
                    break;
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
                                        this.sendCascadeMessage(response.data);
                                        // this.cascade.next(
                                        //     new BsnComponentMessage(
                                        //         BSN_COMPONENT_CASCADE_MODES.REFRESH,
                                        //         this.config.viewId
                                        //     )
                                        // );
                                        this.focusIds = this._getFocusIds(
                                            response.data
                                        );
                                        this.load();
                                    }
                                );
                            } else if (c.executeNext) {
                                const nextConfig = option.ajaxConfig.filter(
                                    f => f.parentName && f.parentName === c.name
                                );
                                nextConfig &&
                                    nextConfig.map(currentAjax => {
                                        this._getAjaxConfig(
                                            currentAjax,
                                            c
                                        );
                                    });
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(response, msg, () => {
                                    this.focusIds = this._getFocusIds(
                                        response.data
                                    );
                                    this.sendCascadeMessage(response.data);
                                    // this.cascadeBase.next(
                                    //     new BsnComponentMessage(
                                    //         BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                                    //         this.config.viewId,
                                    //         {
                                    //             data: this._selectRow
                                    //         }
                                    //     )
                                    // );
                                    this.load();
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
                                this.sendCascadeMessage(response.data);
                                // this.cascade.next(
                                //     new BsnComponentMessage(
                                //         BSN_COMPONENT_CASCADE_MODES.REFRESH,
                                //         this.config.viewId
                                //     )
                                // );
                                this.focusIds = this._getFocusIds(
                                    response.data
                                );
                                this.load();
                            }
                        );
                    } else if (c.executeNext) {
                        const nextConfig = option.ajaxConfig.filter(
                            f => f.parentName && f.parentName === c.name
                        );
                        nextConfig &&
                            nextConfig.map(currentAjax => {
                                this._getAjaxConfig(
                                    currentAjax,
                                    c
                                );
                            });
                    } else {
                        // 没有输出参数，进行默认处理
                        this.showAjaxMessage(response, msg, () => {
                            this.sendCascadeMessage(response.data);
                            // this.cascade.next(
                            //     new BsnComponentMessage(
                            //         BSN_COMPONENT_CASCADE_MODES.REFRESH,
                            //         this.config.viewId
                            //     )
                            // );
                            this.focusIds = this._getFocusIds(response.data);
                            this.load();
                        }, c);


                    }
                })();
            }
        }
    }

    /**
    *
    * @param outputParams
    * @param response
    * @param callback
    * @returns {Array}
    * @private
    * 1、输出参数的配置中，消息类型的参数只能设置一次
    * 2、值类型的结果可以设置多个
    * 3、表类型的返回结果可以设置多个
    */
    public outputParametersResolver(c, response, ajaxConfig, callback = function () { }) {
        const result = false;
        if (response.isSuccess && !Array.isArray(response.data)) {
            const msg =
                c.outputParams[
                c.outputParams.findIndex(
                    m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.MESSAGE
                )
                ];
            const value =
                c.outputParams[
                c.outputParams.findIndex(
                    m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.VALUE
                )
                ];
            const table =
                c.outputParams[
                c.outputParams.findIndex(
                    m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.TABLE
                )
                ];
            const msgObj = msg
                ? response.data[msg.name].split(':')
                : null;
            const valueObj = response.data ? response.data : null;
            // const tableObj = response.data[table.name] ? response.data[table.name] : [];
            if (msgObj && msgObj.length > 1) {
                const messageType = msgObj[0];
                let options;
                switch (messageType) {
                    case 'info':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.baseModal[messageType](options);
                        break;
                    case 'error':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.baseModal[messageType](options);
                        break;
                    case 'confirm':
                        options = {
                            nzTitle: '提示',
                            nzContent: msgObj[1],
                            nzOnOk: () => {
                                // 是否继续后续操作，根据返回状态结果
                                const childrenConfig = ajaxConfig.filter(
                                    f => f.parentName && f.parentName === c.name
                                );
                                //  目前紧支持一次执行一个分之步骤
                                this._getAjaxConfig(childrenConfig[0], ajaxConfig);
                                // childrenConfig &&
                                //     childrenConfig.map(currentAjax => {
                                //         this.getAjaxConfig(
                                //             currentAjax,
                                //             ajaxConfig,
                                //             callback
                                //         );
                                //     });
                            },
                            nzOnCancel: () => { }
                        };
                        this.baseModal[messageType](options);
                        break;
                    case 'warning':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.baseModal[messageType](options);
                        break;
                    case 'success':
                        options = {
                            nzTitle: '',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.baseMessage.success(msgObj[1]);
                        callback();
                        break;
                }
                // if(options) {
                //     this.modalService[messageType](options);
                //
                //     // 如果成功则执行回调
                //     if(messageType === 'success') {
                //         callback && callback();
                //     }
                // }
            }
            // if(options) {
            //     this.baseMessage[messageType](options);
            //
            //     // 如果成功则执行回调
            //     if(messageType === 'success') {
            //         callback && callback();
            //     }
            // }
            if (valueObj) {
                this.returnValue = valueObj;
                const childrenConfig = ajaxConfig.filter(
                    f => f.parentName && f.parentName === c.name
                );
                //  目前紧支持一次执行一个分之步骤
                if (childrenConfig && childrenConfig.length > 0) {
                    this._getAjaxConfig(childrenConfig[0], ajaxConfig);
                }

            }

        } else if (response.isSuccess && Array.isArray(response.data)) {
            const messages = [];
            for (let j = 0, jlen = response.data.length; j < jlen; j++) {
                if (response.data[j].Message && response.data[j].Message.split(':').length > 0) {
                    const msg = response.data[j].Message.split(':');
                    switch (msg[0]) {
                        case 'success':
                            // rowsData[j]['isSuccess'] = true;
                            break;
                        case 'error':
                            messages.push(msg[1]);
                            // rowsData[j]['isSuccess'] = false;
                            break;
                        case 'info':
                            messages.push(msg[1]);
                            // rowsData[j]['isSuccess'] = false;
                            break;
                        case 'warning':
                            messages.push(msg[1]);
                            // rowsData[j]['isSuccess'] = false;
                            break;
                    }
                }
            }
            if (messages.length > 0) {
                this.baseMessage.create('error', messages.join('<br/>'));
            }
            callback();
        } else {
            this.baseMessage.error('操作异常:', response.message);
        }
    }

    private async _executeAjaxConfig(ajaxConfigObj, handleData) {
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
            cacheValue: this.cacheService,
            returnValue: this.returnValue,
            router: this._router
        });
        // 执行数据操作
        return this._executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParam
        );
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
                        componentValue: dataItem,
                        initValue: this.initValue,
                        cacheValue: this.cacheService,
                        returnValue: this.returnValue,
                        router: this._router
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
                    componentValue: handleData,
                    initValue: this.initValue,
                    cacheValue: this.cacheService,
                    returnValue: this.returnValue,
                    router: this._router
                })
            );
        }
        // 执行数据操作
        return this._executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParams
        );
    }

    public async _executeCheckedAction(items, option, cfg) {
        let isSuccess;
        if (cfg) {
            for (let i = 0, len = cfg.length; i < len; i++) {
                // 构建参数
                const params = [];
                if (cfg[i].params) {
                    items.forEach(item => {
                        const newParam = CommonTools.parametersResolver({
                            params: cfg[i].params,
                            tempValue: this.tempValue,
                            item: item,
                            initValue: this.initValue,
                            cacheValue: this.cacheService,
                            router: this._router
                        });
                        params.push(newParam);
                    });
                }
                const response = await this[option.type](cfg[i].url, params);
                if (response.isSuccess) {
                    this.baseMessage.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
                }
            }
            this.load();
            if (
                this.config.componentType &&
                this.config.componentType.parent === true
            ) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }
    }

    private _getCheckedItems() {
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
        this.tempValue['checkedRow'] = serverData;
        return serverData;
    }

    private _getSelectedItem() {
        this.tempValue['selectedRow'] = this._selectRow;
        return this._selectRow;
    }

    private _getCheckItemsId() {
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
                item = JSON.parse(
                    JSON.stringify(this.editCache[item.key].data)
                );
                updatedRows.push(item);
            }
        });
        return updatedRows;
    }

    private async _executeRequest(url, method, body) {
        return this._http[method](url, body).toPromise();
    }
    // endregion

    private _updateEditCacheByLoad(dataList) {
        this.editCache = {};
        // 按照行主键划分每行的组件
        // 根据配置构建编辑组的配置表单组件
        // 处理每组表单内部的交互
        dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: JSON.parse(JSON.stringify(item)),
                    mergeData:{}
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

        this.dataList &&
            this.dataList.map(row => {
                row.selected = false;
                if (row['row_status'] === 'updating' || row['row_status'] === 'adding') {
                } else {
                    row['checked'] = false;
                }

            });


        if (data['row_status'] === 'updating' || data['row_status'] === 'adding') {
            data['selected'] = true;
            data['checked'] = true;
        } else {
            data['selected'] = true;
            if (data['checked']) {
                data['checked'] = false;
            } else {
                data['checked'] = true;
            }
        }

        if (this.dataList.length > 0)
            this.refChecked();


        this._selectRow = data;
        if (!this.is_Selectgrid) {
            this.value = this._selectRow[
                this.config.selectGridValueName
                    ? this.config.selectGridValueName
                    : 'Id'
            ];
            // liu 20181210
            if (this.config.multiple) {
                // liu 20190111 选中行发消息
                const sendData = {};
                sendData['ROW'] = this._selectRow;
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES['SELECTED_ROW'],
                        this.config.viewId,
                        {
                            data: sendData
                        }
                    )
                );
            } else {
                // console.log('222', this._selectRow);
                this.updateValue.emit(this._selectRow);
            }
        }

    }

    private sendCheckedRowData() {
        const checkedIds = this._getCheckItemsId();
        this.cascade.next(
            new BsnComponentMessage(
                BSN_COMPONENT_CASCADE_MODES['REFRESH_BY_IDS'],
                this.config.viewId,
                {
                    data: checkedIds
                }
            )
        );
    }

    // liu 赋值选中
    private setSelectRow(rowValue?) {
        let r_value = this.value;
        if (rowValue) {
            r_value = rowValue;
        }
        if (r_value) {
            this.dataList &&
                this.dataList.map(row => {
                    row.selected = false;
                });
            this.dataList.forEach(row => {
                if (row[this.selectGridValueName] === r_value) {
                    row.selected = true;
                }
            });
        }

    }
    // 取消选中行 liu20181023
    private cancelSelectRow() {
        this.dataList &&
            this.dataList.map(row => {
                row.selected = false;
            });
        this._selectRow = {};
    }

    public searchData(reset: boolean = false) {
        if (this.config.ajaxproc) {
            if (reset) {
                this.pageIndex = 1
                this.loadbypage();
            } else {
                this.loadbypage();
            }
        } else if (reset) {
            this.pageIndex = 1;
            this.load();
        } else {
            this.load();
        }
    }

    public sort(sort: { key: string; value: string }) {
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

    public columnFilter(field: string, values: string[]) {
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

    public checkAll(value) {
        this.dataList.forEach(data => {
            if (!data.disabled) {
                data.checked = value;
            }
        });
        this.refChecked(value);
    }

    public refChecked($event?) {

        this.checkedCount = this.dataList.filter(w => w.checked).length;
        this.allChecked = this.checkedCount === this.dataList.length;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
        if (this.config.showCheckBox && this.config.componentType.sendIds) {
            this.sendCheckedRowData();
        }
        // console.log('datalist', this.dataList);
    }

    public cancelRow() {
        // let len = this.dataList.length;
        // for (let i = 0; i < len; i++) {
        //     if (this.dataList[i]['checked']) {
        //         if (this.dataList[i]['row_status'] === 'adding') {
        //             this.dataList.splice(
        //                 this.dataList.indexOf(this.dataList[i]),
        //                 1
        //             );
        //             i--;
        //             len--;
        //         } else if (this.dataList[i]['row_status'] === 'search') {
        //             this.dataList.splice(
        //                 this.dataList.indexOf(this.dataList[i]),
        //                 1
        //             );
        //             this.is_Search = false;
        //             this.search_Row = {};
        //             i--;
        //             len--;
        //         } else {
        //             this._cancelEdit(this.dataList[i].key);
        //         }
        //     }
        // }
        this.dataList = this.dataList.filter(d => {
            if (d['checked']) {
                if (d['row_status'] === 'adding') {
                    return false;
                } else if (d['row_status'] === 'search') {
                    this.is_Search = false;
                    this.search_Row = {};
                    return false;
                } else {
                    this._cancelEdit(d.key);
                    return true;
                }
            } else {
                return true;
            }
        });
        this.refChecked();
        //   this.dataList = JSON.parse(JSON.stringify(this.dataList));
        return true;
    }

    /**
     * 开始编辑状态
     * @param key
     * @private
     */
    private _startEdit(key: string): void {
        this.editCache[key].edit = true;
    }
    /**
     * 退出编辑状态
     * @param key
     * @private
     */
    private _cancelEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        this.dataList[index].checked = false;
        this.dataList[index]['row_status'] = '';
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(
            JSON.stringify(this.dataList[index])
        );
    }
    /**
     * 保存编辑状态的数据
     * @param key
     * @private
     */
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

        this.dataList[index] = JSON.parse(
            JSON.stringify(this.editCache[key].data)
        );
        this.dataList[index].checked = checked;
        this.dataList[index].selected = selected;


        this.editCache[key].edit = false;
    }
    /**
     * 删除编辑
     */
    private _deleteEdit(i: string): void {
        const dataSet = this.dataList.filter(d => d.key !== i);
        this.dataList = dataSet;
    }
    /**
     * 更新编辑状态的缓存数据
     * @private
     */
    private _updateEditCache(): void {
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item,
                    mergeData: {}
                };
            }
        });
    }
    /**
     * 获取需要聚焦的Ids
     * @param data
     * @returns {string}
     * @private
     */
    private _getFocusIds(data) {
        const Ids = [];
        if (data && Array.isArray(data)) {
            data.forEach(d => {
                d['$focusedOper$'] && Ids.push(d['$focusedOper$']);
            });
        } else if (data) {
            data['$focusedOper$'] && Ids.push(data['$focusedOper$']);
        }
        return Ids.join(',');
    }
    /**
     * 构建查询过滤参数
     * @param filterConfig
     * @returns {{}}
     * @private
     */
    private _buildFilter(filterConfig) {
        let filter = {};
        if (filterConfig) {
            filter = CommonTools.parametersResolver({
                params: filterConfig,
                tempValue: this.tempValue,
                cacheValue: this.cacheService
            });
        }
        return filter;
    }
    /**
     * 构建URL参数
     * @param paramsConfig
     * @returns {{}}
     * @private
     */
    private _buildParameters(paramsConfig) {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: this.tempValue,
                initValue: this.initValue,
                cacheValue: this.cacheService,
                cascadeValue: this.cascadeValue,
                router: this._router
            });
        }
        return params;
    }
    /**
     * 构建URL
     * @param ajaxUrl
     * @returns {string}
     * @private
     */
    private _buildURL(ajaxUrl) {
        let url = '';
        if (ajaxUrl && this._isUrlString(ajaxUrl)) {
            url = ajaxUrl;
        } else if (ajaxUrl) {
        }
        return url;
    }
    /**
     * 构建分页
     * @returns {{}}
     * @private
     */
    private _buildPaging() {
        const params = {};
        if (this.config['pagination']) {
            params['_page'] = this.pageIndex;
            params['_rows'] = this.pageSize;
        }
        return params;
    }
    /**
     * 处理URL格式
     * @param url
     * @returns {boolean}
     * @private
     */
    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === '[object String]';
    }
    /**
     * 构建排序
     * @returns {{}}
     * @private
     */
    private _buildSort() {
        const sortObj = {};
        // if (this._sortName && this._sortType) {
        if (this._sortName && this._sortOrder) {
            sortObj['_sort'] = this._sortName + this._sortOrder;
            // sortObj['_order'] = sortObj['_order'] ? 'DESC' : 'ASC';
        }
        return sortObj;
    }
    /**
     * 构建查询焦点
     * @returns {{}}
     * @private
     */
    private _buildFocusId(sd?: boolean) {
        const focusParams = {};
        if (!sd) {
            // 服务器端待解决
            if (this.focusIds) {
                focusParams['_focusedId'] = this.focusIds;
            }
        }
        return focusParams;
    }
    /**
     * 构建查询字段
     * @returns {{}}
     * @private
     */
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
    /**
     * 构建查询参数
     */
    public _buildSearch() {
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

    /**
     * 批量编辑表单
     * @param dialog
     */
    private showBatchForm(dialog) {
        const footer = [];
        // const checkedItems = [];
        // this.dataList.map(item => {
        //     if (item.checked) {
        //         checkedItems.push(item);
        //     }
        // });

        const checkedIds = this._getCheckItemsId();

        if (checkedIds.length > 0) {
            const obj = {
                ...this.tempValue,
                checkedId: checkedIds
            };
            const modal = this.baseModal.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: component['form'],
                nzComponentParams: {
                    config: dialog,
                    tempValue: obj
                },
                nzFooter: footer
            });

            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button['label'] = btn.text;
                    button['type'] = btn.type ? btn.type : 'default';
                    button['onClick'] = componentInstance => {
                        if (btn['name'] === 'batchSave') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn,
                                    () => {
                                        modal.close();
                                        this.load();
                                    },
                                    dialog
                                );

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
            this.baseMessage.create('warning', '请先选中需要处理的数据');
        }
    }
    /**
     * 数据访问返回消息处理
     * @param result
     * @param message
     * @param callback
     */
    public showAjaxMessage(result, message?, callback?, cfg?) {
        const rs: { success: boolean; msg: string[] } = {
            success: true,
            msg: []
        };
        const desc = cfg.description ? cfg.description : '执行操作,';
        if (result && Array.isArray(result)) {
            result.forEach(res => {
                rs['success'] = rs['success'] && res.isSuccess;
                if (!res.isSuccess) {
                    rs.msg.push(res.message);
                }
            });
            if (rs.success) {
                this.baseMessage.success(message);
                if (callback) {
                    callback();
                }

                this.apiResource.addOperationLog({
                    eventId: BSN_OPERATION_LOG_TYPE.SQL,
                    eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                    funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                    description: `${desc} [执行成功] 数据为: ${JSON.stringify(result['data'])}`
                }).subscribe(result => { });
            } else {
                this.baseMessage.error(rs.msg.join('<br/>'));
                this.apiResource.addOperationLog({
                    eventId: BSN_OPERATION_LOG_TYPE.SQL,
                    eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
                    funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                    description: `${desc} [操作失败] 数据为: ${rs.msg.join('<br/>')}`
                }).subscribe(result => { });
            }
        } else {
            if (result.isSuccess) {
                this.baseMessage.success(message);
                if (callback) {
                    callback();
                }
                this.apiResource.addOperationLog({
                    eventId: BSN_OPERATION_LOG_TYPE.SQL,
                    eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                    funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                    description: `${desc} [操作成功] 数据: ${JSON.stringify(result['data'])}`
                }).subscribe(result => { });
            } else {
                this.baseMessage.error(result.message);
                this.apiResource.addOperationLog({
                    eventId: BSN_OPERATION_LOG_TYPE.SQL,
                    eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
                    funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                    description: `${desc} [操作失败] 数据为: ${result.message}`
                }).subscribe(result => { });
            }
        }
    }
    /**
     * 单条数据表单
     * @param dialog
     * @returns {boolean}
     */
    private showForm(dialog) {
        let obj;
        if (dialog.type === 'add') {
        } else if (dialog.type === 'edit') {
            if (!this._selectRow) {
                this.baseMessage.warning('请选中一条需要添加附件的记录！');
                return false;
            }
        }

        obj = {
            ...this.tempValue,
            ...this._selectRow,
            _id: this._selectRow[dialog.keyId]
                ? this._selectRow[dialog.keyId]
                : ''
        };
        const footer = [];
        const modal = this.baseModal.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzClosable: dialog.closable ? dialog.closable : false,
            nzContent: component['form'],
            nzComponentParams: {
                config: dialog,
                tempValue: obj,
                initData: this.initValue ? this.initValue : {},
                editable: dialog.type === 'add' ? 'post' : 'put'
            },
            nzFooter: footer
        });

        if (dialog.buttons) {
            dialog.buttons.forEach(btn => {
                const button = {};
                button['label'] = btn.text;
                button['type'] = btn.type ? btn.type : 'default';
                button['onClick'] = componentInstance => {
                    if (btn['name'] === 'save') {
                        componentInstance.buttonAction(
                            btn,
                            () => {
                                modal.close();
                                this.load();
                            }, dialog
                        );
                    } else if (btn['name'] === 'saveAndKeep') {
                        componentInstance.buttonAction(
                            btn,
                            () => {
                                this._resetForm(componentInstance);
                                this.load();
                            }, dialog
                        );
                    } else if (btn['name'] === 'close') {
                        this.load();
                        modal.close();
                    } else if (btn['name'] === 'reset') {
                        this._resetForm(componentInstance);
                    }
                };
                footer.push(button);
            });
        }
    }
    /**
     * 重置表单
     * @param comp
     * @private
     */
    private _resetForm(comp: FormResolverComponent) {
        comp.resetForm();
    }
    /**
     * 弹出上传表单
     * @param dialog
     * @returns {boolean}
     */
    private openUploadDialog(dialog) {
        if (!this._selectRow) {
            this.baseMessage.warning('请选中一条需要添加附件的记录！');
            return false;
        }
        const footer = [];
        const obj = {
            _id: this._selectRow[dialog.keyId],
            _parentId: this.tempValue['_parentId']
        };
        const modal = this.baseModal.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: component['upload'],
            nzComponentParams: {
                config: dialog.ajaxConfig,
                refObj: obj
            },
            nzFooter: footer
        });
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
     * 导入excel
     * @param option
     */
    public importExcelDialog(option) {
        if (this.config.importExcel && this.config.importExcel.length > 0) {
            const index = this.config.importExcel.findIndex(
                item => item.name === option.actionName
            );
            this.openImportExcelDialog(this.config.importExcel[index]);
        }
    }

    private openImportExcelDialog(dialog) {
        const modal = this.baseModal.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: component['importExcel'],
            nzComponentParams: {
                config: dialog.ajaxConfig,
                // refObj: obj
            },
            nzFooter: [
                {
                    label: '关闭',
                    type: 'default',
                    show: true,
                    onClick: () => {
                        this.load();
                        modal.close();
                    }
                }
            ]
        });
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
    /**
     * 设置单元格样式
     * @param value
     * @param format
     * @returns {string}
     */
    public setCellFont(value, format, row) {
        let fontColor = '';
        if (format) {
            format.map(color => {
                if (color.caseValue) {
                    const reg1 = new RegExp(color.caseValue.regular);
                    let regularData;
                    if (color.caseValue.type) {
                        if (color.caseValue.type === 'row') {
                            if (row) {
                                regularData = row[color.caseValue['valueName']];
                            } else {
                                regularData = value;
                            }
                        } else {
                            regularData = value;
                        }
                    } else {
                        regularData = value;
                    }
                    const regularflag = reg1.test(regularData);
                    if (regularflag) {
                        fontColor = color.fontcolor;
                    }
                } else if (color.value === value) {
                    fontColor = color.fontcolor;
                }
            });
        }

        return fontColor;
    }

    private async _load(url, params, method) {
        const mtd = method === 'proc' ? 'post' : method;
        return this._http[mtd](url, params).toPromise();
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

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }

        if (this.autoLoadDataList) {
            clearInterval(this.autoLoadDataList);
        }
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

    // 级联


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
    }

    public isEmptyObject(e) {
        let t;
        for (t in e) return !1;
        return !0;
    }

    // liu 2018 12 04
    public valueChangeSearch(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        if (data.data === null) {
            if (this.search_Row.hasOwnProperty(data.name)) {
                delete this.search_Row[data.name];
            }
        } else {
            this.search_Row[data.name] = data.data;
        }
        const rowCasade = data.key;
        const sendCasade = data.name;
        // const changeConfig_new = {};

        // {hang：[name:{具体属性}]}
        if (this.cascadeList[sendCasade]) {
            // 判断当前组件是否有级联
            if (!this.changeConfig_newSearch[rowCasade]) {
                this.changeConfig_newSearch[rowCasade] = {};
            }
            for (const key in this.cascadeList[sendCasade]) {
                // 处理当前级联
                if (!this.changeConfig_newSearch[rowCasade][key]) {
                    this.changeConfig_newSearch[rowCasade][key] = {};
                }

                if (this.cascadeList[sendCasade][key]['dataType']) {
                    this.cascadeList[sendCasade][key]['dataType'].forEach(
                        caseItem => {
                            // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                            if (caseItem['type'] === 'option') {
                                // 在做判断前，看看值是否存在，如果在，更新，值不存在，则创建新值
                                this.changeConfig_newSearch[rowCasade][key][
                                    'options'
                                ] = caseItem['option'];
                            } else {
                                if (
                                    this.changeConfig_newSearch[rowCasade][key][
                                    'options'
                                    ]
                                ) {
                                    delete this.changeConfig_newSearch[rowCasade][
                                        key
                                    ]['options'];
                                }
                            }
                            if (caseItem['type'] === 'ajax') {
                                // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                // 解析参数

                                // const cascadeValue = {};
                                if (
                                    !this.changeConfig_newSearch[rowCasade][key][
                                    'cascadeValue'
                                    ]
                                ) {
                                    this.changeConfig_newSearch[rowCasade][key][
                                        'cascadeValue'
                                    ] = {};
                                }
                                caseItem['ajax'].forEach(ajaxItem => {
                                    if (ajaxItem['type'] === 'value') {
                                        // 静态数据
                                        this.changeConfig_newSearch[rowCasade][key][
                                            'cascadeValue'
                                        ][ajaxItem['name']] = ajaxItem['value'];
                                    }
                                    if (ajaxItem['type'] === 'selectValue') {
                                        // 选中行数据[这个是单值]
                                        this.changeConfig_newSearch[rowCasade][key][
                                            'cascadeValue'
                                        ][ajaxItem['name']] =
                                            data[ajaxItem['valueName']];
                                    }
                                    if (
                                        ajaxItem['type'] === 'selectObjectValue'
                                    ) {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            this.changeConfig_newSearch[rowCasade][
                                                key
                                            ]['cascadeValue'][
                                                ajaxItem['name']
                                            ] =
                                                data.dataItem[
                                                ajaxItem['valueName']
                                                ];
                                        }
                                    }

                                    // 其他取值【日后扩展部分】value
                                });
                                // changeConfig_newSearch[rowCasade][key]['cascadeValue'] = cascadeValue;
                            } /*  else {
                            if (this.changeConfig_newSearch[rowCasade][key]['cascadeValue'] ) {
                                delete this.changeConfig_newSearch[rowCasade][key]['cascadeValue'];
                            }
                        } */
                            if (caseItem['type'] === 'setValue') {

                                if (caseItem['setValue']['type'] === 'value') {
                                    // 静态数据
                                    this.changeConfig_newSearch[rowCasade][key][
                                        'setValue'
                                    ] = caseItem['setValue']['value'];
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'selectValue'
                                ) {
                                    // 选中行数据[这个是单值]
                                    this.changeConfig_newSearch[rowCasade][key][
                                        'setValue'
                                    ] = data[caseItem['setValue']['valueName']];
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'selectObjectValue'
                                ) {
                                    // 选中行对象数据
                                    if (data.dataItem) {
                                        this.changeConfig_newSearch[rowCasade][key][
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
                                    this.changeConfig_newSearch[rowCasade][key][
                                        'setValue'
                                    ] = null;
                                }
                                if (
                                    caseItem['setValue']['type'] ===
                                    'notsetValue'
                                ) {
                                    // 选中行对象数据
                                    if (
                                        this.changeConfig_newSearch[rowCasade][
                                            key
                                        ].hasOwnProperty('setValue')
                                    ) {
                                        delete this.changeConfig_newSearch[rowCasade][
                                            key
                                        ]['setValue'];
                                    }
                                }
                            } else {
                                if (
                                    this.changeConfig_newSearch[rowCasade][
                                        key
                                    ].hasOwnProperty('setValue')
                                ) {
                                    delete this.changeConfig_newSearch[rowCasade][
                                        key
                                    ]['setValue'];
                                }
                            }

                            // 扩充：判断当前字段是否有 edit ，如果无编辑，则将该字段赋值
                            if (this.changeConfig_newSearch[rowCasade][key]) {
                                if (this.changeConfig_newSearch[rowCasade][key]) {
                                    //
                                    if (this.isEdit(key)) {
                                        this.editCache[data.key].data[
                                            key
                                        ] = this.changeConfig_newSearch[rowCasade][
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
                            // endregion  解析结束 正则表达
                            if (regularflag) {
                                // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                if (caseItem['type'] === 'option') {
                                    this.changeConfig_newSearch[rowCasade][key][
                                        'options'
                                    ] = caseItem['option'];
                                } else {
                                    if (
                                        this.changeConfig_newSearch[rowCasade][key][
                                        'options'
                                        ]
                                    ) {
                                        delete this.changeConfig_newSearch[rowCasade][
                                            key
                                        ]['options'];
                                    }
                                }
                                if (caseItem['type'] === 'ajax') {
                                    // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                    if (
                                        !this.changeConfig_newSearch[rowCasade][key][
                                        'cascadeValue'
                                        ]
                                    ) {
                                        this.changeConfig_newSearch[rowCasade][key][
                                            'cascadeValue'
                                        ] = {};
                                    }
                                    caseItem['ajax'].forEach(ajaxItem => {
                                        if (ajaxItem['type'] === 'value') {
                                            // 静态数据
                                            this.changeConfig_newSearch[rowCasade][key]['cascadeValue'][ajaxItem['name']] = ajaxItem['value'];
                                        }
                                        if (
                                            ajaxItem['type'] === 'selectValue'
                                        ) {
                                            // 选中行数据[这个是单值]
                                            this.changeConfig_newSearch[rowCasade][key]['cascadeValue'][ajaxItem['name']] = data[ajaxItem['valueName']];
                                        }
                                        if (
                                            ajaxItem['type'] ===
                                            'selectObjectValue'
                                        ) {
                                            // 选中行对象数据
                                            if (data.dataItem) {
                                                this.changeConfig_newSearch[
                                                    rowCasade
                                                ][key]['cascadeValue'][
                                                    ajaxItem['name']
                                                ] = data.dataItem[ajaxItem['valueName']];
                                            }
                                        }

                                        // 其他取值【日后扩展部分】value
                                    });
                                }
                                /*   else {
                                 if (this.changeConfig_newSearch[rowCasade][key]['cascadeValue'] ) {
                                     delete this.changeConfig_newSearch[rowCasade][key]['cascadeValue'];
                                 }

                             } */
                                if (caseItem['type'] === 'show') {
                                    if (caseItem['show']) {
                                        //
                                        // control['hidden'] = caseItem['show']['hidden'];
                                    }
                                    // changeConfig_newSearch[rowCasade]['show'] = caseItem['option'];
                                }
                                if (caseItem['type'] === 'setValue') {
                                    if (
                                        caseItem['setValue']['type'] === 'value'
                                    ) {
                                        // 静态数据
                                        this.changeConfig_newSearch[rowCasade][key]['setValue'] = caseItem['setValue']['value'];
                                    }
                                    if (
                                        caseItem['setValue']['type'] === 'selectValue'
                                    ) {
                                        // 选中行数据[这个是单值]
                                        this.changeConfig_newSearch[rowCasade][key]['setValue'] = data[caseItem['setValue']['valueName']];
                                    }
                                    if (
                                        caseItem['setValue']['type'] === 'selectObjectValue'
                                    ) {
                                        // 选中行对象数据
                                        if (data.dataItem) {
                                            this.changeConfig_newSearch[rowCasade][key]['setValue'] =
                                                data.dataItem[caseItem['setValue']['valueName']];
                                        }
                                    }
                                    if (data.data === null) {
                                        this.changeConfig_newSearch[rowCasade][key]['setValue'] = null;
                                    }
                                    if (caseItem['setValue']['type'] === 'notsetValue') {
                                        // 选中行对象数据
                                        if (this.changeConfig_newSearch[rowCasade][key].hasOwnProperty('setValue')) {
                                            delete this.changeConfig_newSearch[rowCasade][key]['setValue'];
                                        }
                                    }
                                } else {
                                    if (
                                        this.changeConfig_newSearch[rowCasade][key].hasOwnProperty('setValue')
                                    ) {
                                        delete this.changeConfig_newSearch[rowCasade][key]['setValue'];
                                    }
                                }
                            }
                            // endregion  解析结束
                            // 扩充：判断当前字段是否有 edit ，如果无编辑，则将该字段赋值
                            if (this.changeConfig_newSearch[rowCasade][key]) {
                                if (this.changeConfig_newSearch[rowCasade][key]) {
                                    //
                                    if (this.isEdit(key)) {
                                        this.editCache[data.key].data[key] = this.changeConfig_newSearch[rowCasade][key]['setValue'];
                                    }
                                }
                            }
                        }
                    );
                }
                this.changeConfig_newSearch[rowCasade][key] = JSON.parse(
                    JSON.stringify(this.changeConfig_newSearch[rowCasade][key])
                );
            }

        }
        this.load();

    }


    // 【表格高级设置】
    // tslint:disable-next-line:member-ordering
    public dropdown; // NzDropdownContextComponent;
    // tslint:disable-next-line:member-ordering
    public isVisible = false;
    // tslint:disable-next-line:member-ordering
    public c_data = [];
    // tslint:disable-next-line:member-ordering
    public d_row = {};
    // tslint:disable-next-line:member-ordering
    public is_drag = true;
    // tslint:disable-next-line:member-ordering
    public tablewidth;
    // tslint:disable-next-line:member-ordering
    public tableheight;
    // tslint:disable-next-line:member-ordering
    public s_scroll; // config.scroll ? config.scroll : {}
    // tslint:disable-next-line:member-ordering
    public menus = [
        [
            {
                icon: 'setting',
                color: 'blue',
                text: '设置',
            }
        ]
    ];
    public contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this._dropdownService.create($event, template);
    }

    public selectMenu(btn?, group?) {
        this.showModal();
        this.dropdown.close();
    }


    public showModal(): void {
        this.isVisible = true;
        this.c_data = JSON.parse(JSON.stringify(this.config.columns));
        this.is_drag = true;
        this.s_scroll = this.config.scroll ? this.config.scroll : {};
        // { x:'1300px',y: '240px' }
        if (this.s_scroll['x']) {
            this.tablewidth = this.s_scroll['x'];
        }
        if (this.s_scroll['y']) {
            this.tableheight = this.s_scroll['y'];
        }
    }

    public handleOk(): void {
        this.config.columns = this.c_data;
        this.isVisible = false;
        // { x:'1300px',y: '240px' }
        if (this.tablewidth) {
            this.s_scroll['x'] = this.tablewidth;
        }
        if (this.tableheight) {
            this.s_scroll['y'] = this.tableheight;
        }
        this.config['scroll'] = this.s_scroll ? this.s_scroll : {};
    }

    public handleCancel(): void {
        this.isVisible = false;
    }

    // 拖动行

    public f_ondragstart(e?, d?) {
        this.d_row = d;
    }


    public f_ondrop(e?, d?) {
        e.preventDefault();
        const c_config = this.c_data;
        const index = c_config.findIndex(
            item => item.field === this.d_row['field']
        );
        const tindex = c_config.findIndex(
            item => item.field === d['field']
        );
        this.c_data = JSON.parse(JSON.stringify(this.droparr(c_config, index, tindex)));
    }

    // index是当前元素下标，tindex是拖动到的位置下标。
    public droparr(arr, index, tindex) {
        // 如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
        // 我们再把数组之前的那个拖动的元素删除掉，所以要len+1
        if (index > tindex) {
            arr.splice(tindex, 0, arr[index]);
            arr.splice(index + 1, 1);
        } else {
            // 如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
            // 这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
            arr.splice(tindex + 1, 0, arr[index]);
            arr.splice(index, 1);
        }
        return arr;
    }



    public f_ondragover(e?, d?) {
        // 进入，就设置可以拖放进来（设置不执行默认：【默认的是不可以拖动进来】）
        if (this.is_drag)
            e.preventDefault();
        // --05--设置具体效果copy
        e.dataTransfer.dropEffect = 'copy';
    }

    // ondrag 事件在元素或者选取的文本被拖动时触发。
    public f_drag(e?) {

    }

    public onblur(e?, d?) {
        this.is_drag = true;
    }
    public onfocus(e?, d?) {
        this.is_drag = false;
    }

    // 表格导出excel
    private async exportExcel(option) {
        setTimeout(() => {
            this.loading = true;
        });

        let url, col, data;
        /**
         * exportColumns: {title: '标题',field: '字段名称'}
         */
        if (option.ajaxConfig && this.config.exportColumns) {
            // 自定义导出结果
            url = this._buildURL(option.ajaxConfig.url);
            col = this.config.exportColumns;
            data = [col.map(c => { c.title })];
        } else {
            // 导出表格结果
            url = this._buildURL(this.config.ajaxConfig.url);
            col = this.config.columns.filter(function (item) {　　// 使用filter方法
                if (item.hidden) {
                } else {
                    return item;
                }
            });
            data = [col.map(i => { if (i.hidden) { } else return i.title; })];
        }

        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildFilter(this.config.ajaxConfig.filter),
            ...this._buildSort(),
            ...this._buildColumnFilter(),
            ...this._buildSearch()
        };

        const loadData = await this._load(url, params, 'get');
        if (loadData.isSuccess && loadData.data.length > 0) {
            let i = 0;
            for (const d of loadData.data) {
                i++;
                data.push(col.map(c => {
                    if (c.hidden) { } else {
                        if (c.field === '_serilize') {
                            return i.toString();
                        } else {
                            return d[c.field as string];
                        }

                    }
                }))
            }

        } else {
            this.modalService.warning({ nzTitle: '没有可以导出的数据' });
        }
        const json = data;
        // console.log('data:', data, loadData);
        // 这个nameList (随便起的名字)，是要导出的json数据
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // 这里类型如果不正确，下载出来的可能是类似xml文件的东西或者是类似二进制的东西等
        this.saveAsExcelFile(excelBuffer, 'nameList');

        // this.xlsx.export({
        //     sheets: [
        //         {
        //             data: data,
        //             name: 'sheet name'
        //         }
        //     ]
        // });

        setTimeout(() => {
            this.loading = false;
        });


    }

    public download() {

        const col = this.config.columns.filter(function (item) {　　// 使用filter方法
            if (item.hidden) {
            } else {
                return item;
            }
        });
        const data = [col.map(i => { if (i.hidden) { } else return i.title; })];

        const url = this._buildURL(this.config.ajaxConfig.url);
        const method = this.config.ajaxConfig.ajaxType;
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
            ...this._buildFilter(this.config.ajaxConfig.filter),
            ...this._buildSort(),
            ...this._buildColumnFilter(),
            ...this._buildFocusId(),
            ...this._buildSearch()
        };


        this.dataList.forEach(i =>
            data.push(col.map(c => { if (c.hidden) { } else return i[c.field as string]; }))
        );

        const json = data;
        // console.log('data:', data, loadData);
        // 这个nameList (随便起的名字)，是要导出的json数据
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // 这里类型如果不正确，下载出来的可能是类似xml文件的东西或者是类似二进制的东西等
        this.saveAsExcelFile(excelBuffer, 'nameList');
        // this.xlsx.export({
        //     sheets: [
        //         {
        //             data: data,
        //             name: 'sheet name'
        //         }
        //     ]
        // });
    }
    public _isArray(a) {
        return (Object.prototype.toString.call(a) === '[object Array]');
    }

    private saveAsExcelFile(buffer: any, fileName: string) {
        const data: Blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
        // 如果写成.xlsx,可能不能打开下载的文件，这可能与Excel版本有关
    }


    
    public _createMapd_new(mergeconfig?,listOfData?) {

        // 生成group字段

        const mergeData={};
  

        listOfData.forEach(
            row => {
                this.editCache[row['key']]['mergeData'] = {};
            }
        );


        // 按照 group 分组顺序进行  merge


        mergeconfig.rowConfig && mergeconfig.rowConfig.length>0  && mergeconfig.rowConfig.forEach(r_c => {


            listOfData.forEach(row => {

                if (!this.editCache[row['key']]['mergeData'][r_c.colName]) {
                    this.editCache[row['key']]['mergeData'][r_c.colName] = {};
                }
                let new_data=[...listOfData];
                r_c.groupCols.forEach(group_col=>{

                    new_data = new_data.filter(d => d[group_col.groupColName] === row[group_col.groupColName]);
                });

                new_data = new_data.filter(d => d[r_c.groupName] === row[r_c.groupName]);
                let group_num = new_data.length;
                let group_index = new_data.findIndex(d => d['key'] === row['key']);
                this.editCache[row['key']]['mergeData'][r_c.colName]['groupNum'] = group_num;
                this.editCache[row['key']]['mergeData'][r_c.colName]['groupIndex'] = group_index + 1;
                this.editCache[row['key']]['mergeData'][r_c.colName]['colgroupIndex'] = 1;
                this.editCache[row['key']]['mergeData'][r_c.colName]['colgroupNum'] = 1;


            });

        }
        );



        mergeconfig.colConfig && mergeconfig.colConfig.length>0 && listOfData.forEach(
            row => {
                // this.mapd[row.id]={}; // 初始化

                mergeconfig.colConfig.forEach(col_c => {

                    col_c.mergeItems.forEach(item => {
                        

                        let regularflag = true;
                        if (item.caseValue && item.type === "condition") {
                            const reg1 = new RegExp(item.caseValue.regular);
                            let regularData;
                            if (item.caseValue.type) {
                                if (item.caseValue.type === 'value') {
                                    regularData = item.caseValue['value'];
                                }
                                if (item.caseValue['type'] === 'rowValue') {
                                    // 选中行对象数据
                                    if (row) {
                                        regularData = row[item.caseValue['valueName']];
                                    }
                                }
        
                            } else {
                                regularData = null;
                            }
                            regularflag = reg1.test(regularData);
                        }
                        if (regularflag) {

                            let group_num = item.mergeCols.length;
                            item.mergeCols.forEach(merge_col=>{
                                if (!this.editCache[row['key']]['mergeData'][merge_col['mergeColName']]) {
                                    this.editCache[row['key']]['mergeData'][merge_col['mergeColName']] = {};
                                }
                                let group_index = item.mergeCols.findIndex(d => d['mergeColName'] === merge_col['mergeColName']);
                                this.editCache[row['key']]['mergeData'][merge_col['mergeColName']]['colgroupIndex'] = group_index+1;
                                this.editCache[row['key']]['mergeData'][merge_col['mergeColName']]['colgroupNum'] = group_num;
                            });

                           
                            
                            

                        }


                    });


                });

       

            }
        );


        console.log('new生成分组信息', this.editCache);

    }

    public showbutton(value, format) {
        let result = true;
        if (format) {
            format.map(e => {
                if (e.value === value) {
                    result = false;
                }
            });
        }
        return result;
    }

    public execFun(name?, key?) {
        switch (name) {
            case 'deleteRow':
                // this.config.actions['deleteRow'] ? this.config.actions['deleteRow'] : null
                this.deleteRowOnSelected(key);
                break;
            case 'executeRow':
                // this.config.actions['deleteRow'] ? this.config.actions['deleteRow'] : null
                this.executeRowOnSelected(key);
                break;
            default:
                break;
        }
    }

    // 行内删除
    public deleteRowOnSelected(key) {
        const row = this.dataList.filter(item => item.key === key)[0];
        // console.log('删除行', row, this.config.events);
        if (this.config.events) {
            const index = this.config.events.findIndex(item => item['onTrigger'] === 'deleteRow');
            let c_eventConfig = {};
            if (index > -1) {
                c_eventConfig = this.config.events[index];
            } else {
                return true;
            }
            const isField = true; // 列变化触发
            // 首先适配类别、字段，不满足的时候 看是否存在default 若存在 取default
            if (isField) {
                c_eventConfig['onEvent'].forEach(eventConfig => {
                    // 无配置 的默认项
                    if (eventConfig.type === 'default') {
                        this.ExecRowEvent(eventConfig.action, row);
                    }
                });
            }
        }
        // console.log('行内删除', key);
        // 注意，末页删除需要将数据页数上移


    }

    // 行内操作
    public executeRowOnSelected(key) {
        const row = this.dataList.filter(item => item.key === key)[0];
        // console.log('删除行', row, this.config.events);
        if (this.config.events) {
            const index = this.config.events.findIndex(item => item['onTrigger'] === 'executeRow');
            let c_eventConfig = {};
            if (index > -1) {
                c_eventConfig = this.config.events[index];
            } else {
                return true;
            }
            const isField = true; // 列变化触发
            // 首先适配类别、字段，不满足的时候 看是否存在default 若存在 取default
            if (isField) {
                c_eventConfig['onEvent'].forEach(eventConfig => {
                    // 无配置 的默认项
                    if (eventConfig.type === 'default') {
                        this.ExecRowEvent(eventConfig.action, row);
                    }
                });
            }
        }
        // console.log('行内删除', key);
        // 注意，末页删除需要将数据页数上移


    }

    //  执行行内事件【】,不展示的按钮事件，日后扩充
    public ExecRowEvent(eventname?, row?) {
        //  name
        // const option = updateState.option;
        let option = {};
        let model = '';
        const index = this.toolbarConfig.findIndex(
            item => item['name'] === eventname
        );
        if (index > -1) {
            option = this.toolbarConfig[index];
        }
        if (!option['action']) {
            model = BSN_COMPONENT_MODES['EXECUTE'];
        } else {
            model = BSN_COMPONENT_MODES[option['action']] ? BSN_COMPONENT_MODES[option['action']] : option['action'];
        }
        // option 操作的详细配置
        // 根据当前行绑定操作名称-》找到对应的操作配置
        // const model_c = '';
        switch (model) {
            case BSN_COMPONENT_MODES.REFRESH:
                this.load();
                break;
            case BSN_COMPONENT_MODES.CREATE:
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.addRow();
                break;
            // case BSN_COMPONENT_MODES.ADD_ROW_DATA:
            //     !this.beforeOperation.beforeItemDataOperation(option) &&
            //     this._resolveAjaxConfig(option);
            //     break;
            case BSN_COMPONENT_MODES.CANCEL_SELECTED:
                this.cancelSelectRow();
                break;
            case BSN_COMPONENT_MODES.EDIT:
                this.beforeOperation.operationItemsData = this._getCheckedItems();
                !this.beforeOperation.beforeItemsDataOperation(
                    option
                ) && this.updateRow();
                break;
            case BSN_COMPONENT_MODES.CANCEL:
                this.cancelRow();
                break;
            case BSN_COMPONENT_MODES.SAVE:
                this.beforeOperation.operationItemsData = [
                    ...this._getCheckedItems(),
                    ...this._getAddedRows()
                ];
                !this.beforeOperation.beforeItemsDataOperation(
                    option
                ) && this.saveRow(option);
                break;
            case BSN_COMPONENT_MODES.DELETE:
                this.beforeOperation.operationItemsData = this._getCheckedItems();
                !this.beforeOperation.beforeItemsDataOperation(
                    option
                ) && this.deleteRow(option);
                break;
            case BSN_COMPONENT_MODES.DIALOG:
                this.beforeOperation.operationItemData = this._selectRow;
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.dialog(option);
                break;
            case BSN_COMPONENT_MODES.EXECUTE:
                // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
                // console.log('执行列3665：', option);
                this._resolveAjaxConfig(option);
                break;
            case BSN_COMPONENT_MODES.WINDOW:
                this.beforeOperation.operationItemData = this._selectRow;
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.windowDialog(option);
                break;
            case BSN_COMPONENT_MODES.FORM:
                this.beforeOperation.operationItemData = this._selectRow;
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.formDialog(option);
                break;
            case BSN_COMPONENT_MODES.SEARCH:
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.SearchRow(option);
                break;
            case BSN_COMPONENT_MODES.UPLOAD:
                this.beforeOperation.operationItemData = this._selectRow;
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.uploadDialog(option);
                break;
            case BSN_COMPONENT_MODES.FORM_BATCH:
                this.beforeOperation.operationItemsData = this._getCheckedItems();
                !this.beforeOperation.beforeItemsDataOperation(
                    option
                ) && this.formBatchDialog(option);
                break;
        }

    }

    // tslint:disable-next-line:member-ordering
    public toolbarConfig = [];
    //  获取event 事件的配置
    public GetToolbarEvents() {
        if (this.config.toolbarEvent && Array.isArray(this.config.toolbarEvent)) {
            this.config.toolbarEvent.forEach(item => {
                if (item.group) {
                    item.group.forEach(g => {
                        this.toolbarConfig.push(g);
                    });


                } else if (item.dropdown) {
                    const dropdown = [];
                    item.dropdown.forEach(b => {
                        const down = {};
                        const { name, text, icon } = b;
                        down['name'] = name;
                        down['text'] = text;
                        down['icon'] = icon;
                        down['buttons'] = [];
                        b.buttons.forEach(btn => {
                            this.toolbarConfig.push(btn);
                        });
                    });

                }
            });
        }


    }


}

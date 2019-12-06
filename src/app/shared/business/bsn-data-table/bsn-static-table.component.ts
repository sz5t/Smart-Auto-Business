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
    Output,
    EventEmitter
} from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { Observer } from 'rxjs';
import { Subscription } from 'rxjs';
import { BsnUploadComponent } from '@shared/business/bsn-upload/bsn-upload.component';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: CnFormWindowResolverComponent,
    upload: BsnUploadComponent
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-bsn-static-table,[cn-bsn-static-table]',
    templateUrl: './bsn-static-table.component.html',
    styles: [
        `
            .table-operations {
                margin-bottom: 8px;
            }

            .table-operations > button {
                margin-right: 8px;
            }

            .selectedRow {
                color: blue;
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
export class BsnStaticTableComponent extends CnComponentBase
    implements OnInit, OnDestroy {
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
    @Output()
    public updateValue = new EventEmitter();
    // tempValue = {};

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

    // 查询标识
    public is_Search = false;
    public search_Row = {};

    // 下拉属性 liu
    public is_Selectgrid = true;
    public cascadeValue = {}; // 级联数据
    public selectGridValueName;
    public changeConfig_new = {};
    // 级联
    public cascadeList = {};
    constructor(
        private _http: ApiService,
        private _message: NzMessageService,
        private modalService: NzModalService,
        private cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    public loadData = {
        rows: [],
        total: 0
    };
    public async ngOnInit() {
        // console.log("ngOnInit");

        // for (let i = 0; i < 46; i++) {
        //     this.loadData.rows.push({
        //         Id: `${i}`,
        //         key: `${i}`,
        //         code: `${i}`,
        //         name: `Edward King ${i}`,
        //         age: 32,
        //         address: `London, Park Lane no. ${i}`,
        //         checked: false
        //     });
        // }
        // this.Initload();


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

        const aloadData = await this._load(url, params);
        if (aloadData && aloadData.status === 200 && aloadData.isSuccess) {
            this.loadData.rows = aloadData.data;
            const keyIdCode = this.config.keyId ? this.config.keyId : 'Id';
            aloadData.data.forEach(element => {
                element['key'] = element[keyIdCode];
                if (this.config['Edit']) {
                    element['$operDataType$'] = 'edit';
                    if (this.config['Add']) {
                        element['$operDataType$'] = 'add';
                    }
                }

            });
        }
        this.loadData.total = this.loadData.rows.length;
        this.total = this.loadData.total;
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
        this.pageSize = this.config.pageSize
            ? this.config.pageSize
            : this.pageSize;
        if (this.config.componentType) {
            if (!this.config.componentType.child) {
                this.load();
            } else if (this.config.componentType.own === true) {
                this.load();
            }
        } else {
            this.load();
        }

        // 初始化级联
        this.caseLoad();
        this.scanCodeValueChange();
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
                    case BSN_COMPONENT_MODES.CANCEL_SELECTED:
                        this.cancelSelectRow();
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
                    case BSN_COMPONENT_MODES.FORM_BATCH:
                        this.formBatchDialog(option);
                        break;
                }
            }
        });
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器
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
                            data: this._selectRow
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
                                const modeold =
                                    BSN_COMPONENT_CASCADE_MODES[
                                    relation.cascadeMode
                                    ];
                                const mode = cascadeEvent._mode;

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
                                }
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.Scan_Code_ROW:
                                        // ScanCodeObject
                                        this.scanCodeROW();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.Scan_Code_Locate_ROW:
                                        // ScanCodeObject
                                        this.locateRow();
                                        break;

                                }
                            }
                        });
                    }
                }
            );
        }
    }

    public load1() {
        this.changeConfig_new = {};
        // this._selectRow = {};
        // this.pageIndex = pageIndex;
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
                        loadData.data.rows.length > 0 &&
                            (focusId = loadData.data.rows[0].Id);
                    }
                    if (loadData.data.rows.length > 0) {
                        loadData.data.rows.forEach((row, index) => {
                            row['key'] = row[this.config.keyId]
                                ? row[this.config.keyId]
                                : 'Id';
                            if (this.is_Selectgrid) {
                                if (row.Id === focusId) {
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
                        this._selectRow = {};
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

            // liu
            if (!this.is_Selectgrid) {
                this.setSelectRow();
            }

            this.loading = false;
        })();
    }

    public async Initload() {
        this.changeConfig_new = {};
        this.loading = true;
        this.allChecked = false;
        this.checkedCount = 0;
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

        const loadData = await this._load(url, params);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                // 设置聚焦ID
                // 默认第一行选中，如果操作后有focusId则聚焦ID为FocusId
                if (loadData.data.length > 0) {
                    this.loadData.rows = loadData.data;
                    this.loadData.total = this.loadData.rows.length;
                    this.total = this.loadData.total;
                } else {
                    this.loadData.rows = [];
                    this.loadData.total = this.loadData.rows.length;
                    this.total = this.loadData.total;
                }
            } else {
                this.loadData.rows = [];
                this.loadData.total = this.loadData.rows.length;
                this.total = this.loadData.total;
            }
        } else {
            this.loadData.rows = [];
            this.loadData.total = this.loadData.rows.length;
            this.total = this.loadData.total;
        }
        this.loading = false;
    }

    public pageIndexPlan() {
        if (this.pageIndex > 1) {
            const p_pindex = ((this.pageIndex - 1) * this.pageSize);
            if (this.loadData.total <= p_pindex) {
                this.pageIndex = this.pageIndex - 1;
                this.load();
            } else {
                this.load();
            }
        }
    }
    public load() {
        // console.log('datalist:', this.dataList);
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
    }

    // load 分组
    // 原始数据【olddata】 数据缓存【update】
    // 注意 撤销、删除 对数据的影响
    public loadStatic() {

    }

    public scanCodeROW() {
        this.scanCodeaddRow();
    }

    public locateRow() {
        // 定位行
        // this.loadData.rows.push(rowContentNew);
        const code = this.config.ScanCode.locateRow.columns[0]['field'];
        const codeName = this.config.ScanCode.locateRow.columns[0]['valueName'];
        const codeValue = this.tempValue[codeName];

        const index = this.loadData.rows.findIndex(item => item[code] === codeValue);
        if (index !== -1) {
            const rowValue = this.loadData.rows[index]['key'];
            this.pageIndex = Math.ceil((index + 1) / this.pageSize);
            this.load();
            this.scanCodeSetSelectRow(rowValue);
            // 如果有操作，再选中行后执行
        } else {
            this._message.info('当前扫码未能匹配到数据！');
        }
    }

    // 行定位，先计算出行数据的索引，定位到页面，然后选中数据
    private scanCodeSetSelectRow(rowValue?) {

        this.dataList &&
            this.dataList.map(row => {
                row.selected = false;
            });
        this.dataList.forEach(row => {
            if (row['key'] === rowValue) {
                row.selected = true;
            }
        });
    }

    public scanCodeaddRow() {
        //  'judge':{'name':'_ScanCodeObject'},
        let _ScanCode = '_ScanCode';
        if (this.config.ScanCode.addRow.judge) {
            _ScanCode = this.config.ScanCode.addRow.judge.name;
        }
        if (this.tempValue[_ScanCode]) {
            if (this.tempValue[_ScanCode].length <= 0) {
                this._message.info('扫码没有匹配到数据！');
                return true;
            }
        }

        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonTools.uuID(6);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        rowContentNew['row_status'] = 'adding';
        rowContentNew['$operDataType$'] = 'add';
        rowContentNew['edit'] = true;
        let isback = false;
        if (this.config.ScanCode.addRow.type) {
            if (this.config.ScanCode.addRow.type === 'distinct') {
                let distinctValue = null;
                if (this.config.ScanCode.addRow.distinct.type === 'tempValue') {
                    if (this.config.ScanCode.addRow.distinct.valueType === 'value') {
                        distinctValue = this.tempValue[this.config.ScanCode.addRow.distinct.valueName];
                    } else if (this.config.ScanCode.addRow.distinct.valueType === 'array') {
                        if (this.config.ScanCode.addRow.distinct.arrayName) {
                            if (this.tempValue[this.config.ScanCode.addRow.distinct.arrayName].length > 0) {
                                distinctValue = this.tempValue[this.config.ScanCode.addRow.distinct.arrayName][0][this.config.ScanCode.addRow.distinct.valueName];
                            }
                        }
                    }
                } else if (this.config.ScanCode.addRow.distinct.type === 'value') {
                    distinctValue = this.config.ScanCode.addRow.distinct['value'];
                }
                const index = this.loadData.rows.findIndex(
                    item => item[this.config.ScanCode.addRow.distinct['field']] === distinctValue
                );
                if (index !== -1) {
                    isback = true;
                    if (this.config.ScanCode.addRow.superposition) {
                        this.config.ScanCode.addRow.superposition.forEach(element => {
                            let superpositionValue = null;
                            if (element.superpositionType === 'identity') {
                                superpositionValue = element.superpositionNumber;
                            } else {
                                if (element.type === 'tempValue') {
                                    if (element.valueType === 'value') {
                                        superpositionValue = this.tempValue[element.valueName];
                                    } else if (element.valueType === 'array') {
                                        if (element.arrayName) {
                                            if (this.tempValue[element.arrayName].length > 0) {
                                                superpositionValue = this.tempValue[element.arrayName][0][element.valueName];
                                            }
                                        }
                                    }
                                } else if (this.config.ScanCode.addRow.distinct.type === 'value') {
                                    superpositionValue = this.config.ScanCode.addRow.distinct['value'];
                                }
                            }
                            if (element.dataType === 'number') {
                                if (!this.loadData.rows[index][element.field]) {
                                    this.loadData.rows[index][element.field] = element.defaultValue;
                                    // this. editCache[ this.loadData.rows[index]['key']].data[element.field] =  this.loadData.rows[index][element.field]; // 1214
                                }
                            }

                            this.loadData.rows[index][element.field] = this.loadData.rows[index][element.field] + superpositionValue;
                            // liu 20181214 注释 字段叠加 有问题，编辑状态无响应
                            for (const CacheItem in this.editCache) {
                                if (this.editCache.hasOwnProperty(CacheItem)) {
                                    const element1 = this.editCache[CacheItem];
                                    if (element1.data[this.config.ScanCode.addRow.distinct['field']] === distinctValue) {

                                        this.editCache[CacheItem].data[element.field] = this.loadData.rows[index][element.field];
                                        //   this.editCache[CacheItem] = JSON.parse(JSON.stringify(this.editCache[CacheItem]));
                                        // this._cancelEdit(CacheItem);
                                        //  this._startEdit(CacheItem);
                                        if (!this.changeConfig_new[CacheItem].hasOwnProperty(element.field)) {
                                            this.changeConfig_new[CacheItem][element.field] = {};
                                        }
                                        this.changeConfig_new[CacheItem][element.field]['setValue'] = this.loadData.rows[index][element.field];
                                    }
                                }
                            }

                            //  this. editCache[ this.loadData.rows[index]['key']].data[element.field] =  this.loadData.rows[index][element.field]; // 1214
                        });
                    }
                    // this.pageIndex = Math.ceil((index + 1) / this.pageSize);
                    // this.load();
                    // this.scanCodeSetSelectRow(this.loadData.rows[index]['key'] ? this.loadData.rows[index]['key'] : this.loadData.rows[index][this.config['keyId']] );
                    // this._updateEditCache();
                    // this._startEdit(this.loadData.rows[index]['key'] ? this.loadData.rows[index]['key'] : this.loadData.rows[index][this.config['keyId']] );

                } else {
                    if (this.config.ScanCode.addRow.superposition) {
                        this.config.ScanCode.addRow.superposition.forEach(element => {
                            let superpositionValue = null;
                            if (element.superpositionType === 'identity') {
                                superpositionValue = element.superpositionNumber;
                            } else {
                                if (element.type === 'tempValue') {
                                    if (element.valueType === 'value') {
                                        superpositionValue = this.tempValue[element.valueName];
                                    } else if (element.valueType === 'array') {
                                        if (element.arrayName) {
                                            if (this.tempValue[element.arrayName].length > 0) {
                                                superpositionValue = this.tempValue[element.arrayName][0][element.valueName];
                                            }
                                        }
                                    }
                                } else if (this.config.ScanCode.addRow.distinct.type === 'value') {
                                    superpositionValue = this.config.ScanCode.addRow.distinct['value'];
                                }
                            }
                            if (element.dataType === 'number') {
                                if (!rowContentNew[element.field]) {
                                    rowContentNew[element.field] = element.defaultValue;
                                }
                            }
                            rowContentNew[element.field] = superpositionValue;
                        });
                    }

                }
            }
        }

        if (isback) {
            if (this.config.ScanCode.addRow.superposition) {
            } else {
                this._message.info('重复扫码！');
            }
            return true;
        }

        if (this.config.ScanCode.addRow) {

            this.config.ScanCode.addRow.columns.forEach(column => {
                if (column.type === 'tempValue') {
                    if (column.valueType === 'value') {
                        rowContentNew[column.field] = this.tempValue[column.valueName];
                    } else if (column.valueType === 'array') {
                        if (column.arrayName) {
                            if (this.tempValue[column.arrayName].length > 0) {
                                rowContentNew[column.field] = this.tempValue[column.arrayName][0][column.valueName];
                            }
                        }
                    }
                } else if (column.type === 'value') {
                    rowContentNew[column.field] = column['value'];
                }
            });
        }
        // rowContentNew['code'] = this.tempValue['_ScanCode'];
        // if (this.tempValue['_ScanCodeObject'].length > 0) {
        //     rowContentNew['name'] = this.tempValue['_ScanCodeObject'][0]['name'];
        // }
        // 针对查询和新增行处理
        if (this.is_Search) {
            this.dataList.splice(1, 0, rowContentNew);
        } else {
            this.dataList = [rowContentNew, ...this.dataList];
        }
        if (!this.changeConfig_new[fieldIdentity]) {
            this.changeConfig_new[fieldIdentity] = {};
        }
        // this.dataList.push(this.rowContent);
        this._updateEditCache();
        this._startEdit(fieldIdentity.toString());

        this.loadData.rows.unshift(rowContentNew);
        this.loadData.total = this.loadData.rows.length;
        this.total = this.loadData.total;
        // console.log('scanCodeValueChange', this.loadData)
        this.scanCodeValueChange(); // 扫码后将结果返回
        this.pageIndex = 1; // 【目前只新增在最前，日后扩充可前可后】
        this.load(); // 扫码后页数切换【目前未考虑排序】
      
        return true;

    }

    // 静态数据发生变化的时候，反馈给form 表单
    // 行内所有的操作，均将数据反馈回form 表单
    public scanCodeValueChange() {
        // liu 【重点返回信息】
        this.updateValue.emit(this.loadData.rows);
        // console.log('saomafanhui',this.loadData.rows);
    }

    // 获取 文本值，当前选中行数据
    public async loadByselect(
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
        let selectrowdata = {};
        const loadData = await this._load(url, params);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                if (loadData.data.length > 0) {
                    selectrowdata = loadData.data[0];
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
        cascadeValue?
    ) {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: selecttempValue,
                componentValue: componentValue,
                initValue: this.initValue,
                cacheValue: this.cacheService,
                cascadeValue: cascadeValue
            });
        }
        return params;
    }

    // 行内删除
    public deleteRowStatic() {
        this.dataList.forEach(d => {
            this.dataList.splice(
                this.dataList.indexOf(d),
                1
            );
        });
    }
    // 获取当前选中的值 liu 扩展部分，目前不实现，原因是会多请求数据（主要是对级联赋值的扩充）
    public selectload(selectparams?: any[], selectvalue?) {
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params)
            // ...selectparams
        };

        (async () => {
            const loadData = await this._load(url, params);
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
                        cacheValue: this.cacheService
                    });
                    submitData.push(submitItem);
                });
                const response = await this[method](
                    postConfig[i].url,
                    submitData
                );
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
                    cacheValue: this.cacheService
                });
                const response = await this[option.type](cfg[i].url, newParam);
                if (response.isSuccess) {
                    this._message.create('success', '执行成功');
                    isSuccess = true;
                } else {
                    this._message.create('error', response.message);
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
            this.load(); // 查询后将页面置1
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
        if (checkedCount === 0) {
            this._message.info('请勾选数据记录后进行编辑');
        }
    }

    public valueChange(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        if (this.editCache[data.key].data[data.name] !== data.data) {
            if (this.changeConfig_new[data.key].hasOwnProperty(data.name)) {
                if (this.changeConfig_new[data.key][data.name].hasOwnProperty('setValue')) {
                    delete this.changeConfig_new[data.key][data.name]['setValue'];
                }
            }
        }
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
                                        regularData = data['dataItem'][caseItem['valueName']];
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
        }
        const index = this.loadData.rows.findIndex(
            item => item['key'] === data.key
        );
        if (index > -1) {
            this.loadData.rows[index][data.name] = data.data;
        }
        this.scanCodeValueChange(); // 回写数据
    }

    public valueChangeSearch(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        this.search_Row[data.name] = data.data;
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
            nzOnCancel() { }
        });
    }

    public executeCheckedRow(option) {
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
            this._message.create('info', '请选择要删除的数据');
        } else {
            if (
                option.ajaxConfig.delete &&
                option.ajaxConfig.delete.length > 0
            ) {
                option.ajaxConfig.delete.map(async delConfig => {
                    this.modalService.confirm({
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
        const response = await this['delete'](deleteConfig.url, params);
        if (response && response.status === 200 && response.isSuccess) {
            this._message.create('success', '删除成功');
            isSuccess = true;
            this.focusIds = null;
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
        } else {
            this._message.create('error', response.message);
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
            const tmpValue = this.tempValue ? this.tempValue : {};
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: component['layout'],
                nzComponentParams: {
                    permissions: this.permissions,
                    config: data,
                    initData: { ...selectedRow, ...tmpValue }
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
                                    btn
                                );
                                if (result) {
                                    modal.close();
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn['name'] === 'saveAndKeep') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn
                                );
                                if (result) {
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn['name'] === 'close') {
                            modal.close();
                            this.load();
                        } else if (btn['name'] === 'reset') {
                            this._resetForm(componentInstance);
                        } else if (btn['name'] === 'ok') {
                            modal.close();
                            this.load();
                            //
                        }
                    };
                    footer.push(button);
                });
            }
        });
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
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this._message.create('info', '请选择要执行的数据');
                        return false;
                    }
                    handleData = this._getCheckedItems();
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                    if (this._selectRow['row_status'] === 'adding') {
                        this._message.create(
                            'info',
                            '当前数据未保存无法进行处理'
                        );
                        return false;
                    }
                    handleData = this._getSelectedItem();
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
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
                    if (handleData && handleData.length <= 0) {
                        return;
                    }
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SAVE_ROW:
                    // 获取更新状态的数据
                    handleData = this._getAddedRows();
                    msg = '新增数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }
                    break;
            }
            if (c.message) {
                this.modalService.confirm({
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
                                this._outputParametersResolver(
                                    c,
                                    response,
                                    option.ajaxConfig,
                                    () => {
                                        this.focusIds = this._getFocusIds(
                                            response.data
                                        );
                                        this.load();
                                    }
                                );
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(response, msg, () => {
                                    this.focusIds = this._getFocusIds(
                                        response.data
                                    );
                                    this.load();
                                });
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
                        this._outputParametersResolver(
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
                                this.focusIds = this._getFocusIds(
                                    response.data
                                );
                                this.load();
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
                            this.focusIds = this._getFocusIds(response.data);
                            this.load();
                        });
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
    private _outputParametersResolver(c, response, ajaxConfig, callback) {
        const result = false;
        if (response.isSuccess) {
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
            const msgObj = response.data[msg.name]
                ? response.data[msg.name].split(':')
                : '';
            // const valueObj = response.data[value.name] ? response.data[value.name] : [];
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
                        this.modalService[messageType](options);
                        break;
                    case 'error':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.modalService[messageType](options);
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
                                childrenConfig &&
                                    childrenConfig.map(currentAjax => {
                                        this._getAjaxConfig(
                                            currentAjax,
                                            ajaxConfig
                                        );
                                    });
                            },
                            nzOnCancel: () => { }
                        };
                        this.modalService[messageType](options);
                        break;
                    case 'warning':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this.modalService[messageType](options);
                        break;
                    case 'success':
                        options = {
                            nzTitle: '',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this._message.success(msgObj[1]);
                        callback && callback();
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
            } else {
                this._message.error(
                    '存储过程返回结果异常：未获得输出的消息内容'
                );
            }
        } else {
            this._message.error('操作异常：', response.message);
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
            cacheValue: this.cacheService
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
                        cacheValue: this.cacheService
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
                    cacheValue: this.cacheService
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
                            cacheValue: this.cacheService
                        });
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
        this.tempValue['selectedRow'] = this.selectRow;
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
        if (this.config.Edit) {
            dataList.forEach(item => {
                if (!this.editCache[item.key]) {
                    if (item.edit) {
                        this.editCache[item.key] = {
                            edit: true, // liu 20181117 false
                            data: JSON.parse(JSON.stringify(item))
                        };
                    } else {
                        this.editCache[item.key] = {
                            edit: true, // liu 20181117 false
                            data: JSON.parse(JSON.stringify(item))
                        };
                    }
                }

                if (!this.changeConfig_new[item.key]) {
                    this.changeConfig_new[item.key] = {};
                }
            });
        } else {
            dataList.forEach(item => {
                if (!this.editCache[item.key]) {
                    if (item.edit) {
                        this.editCache[item.key] = {
                            edit: true, // liu 20181117 false
                            data: JSON.parse(JSON.stringify(item))
                        };
                        if (!this.changeConfig_new[item.key]) {
                            this.changeConfig_new[item.key] = {};
                        }
                    } else {
                        this.editCache[item.key] = {
                            edit: false, // liu 20181117 false
                            data: JSON.parse(JSON.stringify(item))
                        };
                    }
                }
            });
        }
        // dataList.forEach(item => {

        //     if (!this.editCache[item.key]) {
        //         if (item.edit) {
        //             this.editCache[item.key] = {
        //                 edit: true, // liu 20181117 false
        //                 data: JSON.parse(JSON.stringify(item))
        //             };
        //         } else {
        //             this.editCache[item.key] = {
        //                 edit: false, // liu 20181117 false
        //                 data: JSON.parse(JSON.stringify(item))
        //             };
        //         }
        //     }
        // });
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
            });
        data['selected'] = true;
        this._selectRow = data;
        if (!this.is_Selectgrid) {
            this.value = this._selectRow[
                this.config.selectGridValueName
                    ? this.config.selectGridValueName
                    : 'Id'
            ];
        }
    }

    // liu 赋值选中
    private setSelectRow(rowValue?) {
        let r_value = this.value;
        if (rowValue) {
            r_value = rowValue;
        }
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
    // 取消选中行 liu20181023
    private cancelSelectRow() {
        this.dataList &&
            this.dataList.map(row => {
                row.selected = false;
            });
        this._selectRow = {};
    }

    public searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load();
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
        this.refChecked();
    }

    public refChecked() {
        this.checkedCount = this.dataList.filter(w => w.checked).length;
        this.allChecked = this.checkedCount === this.dataList.length;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
    }

    public cancelRow() {
        let len = this.dataList.length;
        for (let i = 0; i < len; i++) {
            if (this.dataList[i]['checked']) {
                if (this.dataList[i]['row_status'] === 'adding') {
                    this.dataList.splice(
                        this.dataList.indexOf(this.dataList[i]),
                        1
                    );
                    i--;
                    len--;
                } else if (this.dataList[i]['row_status'] === 'search') {
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
        }
        this.refChecked();
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
                    data: item
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
                cascadeValue: this.cascadeValue
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
    private _buildFocusId() {
        const focusParams = {};
        // 服务器端待解决
        if (this.focusIds) {
            focusParams['_focusedId'] = this.focusIds;
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
        const checkedItems = [];
        this.dataList.map(item => {
            if (item.checked) {
                checkedItems.push(item);
            }
        });
        if (checkedItems.length > 0) {
            const obj = {
                checkedRow: checkedItems,
                ...this.tempValue
            };
            const modal = this.modalService.create({
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
                                    btn
                                );
                                this.showAjaxMessage(result, '保存成功', () => {
                                    modal.close();
                                    this.load();
                                });
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
    /**
     * 数据访问返回消息处理
     * @param result
     * @param message
     * @param callback
     */
    public showAjaxMessage(result, message?, callback?) {
        const rs: { success: boolean; msg: string[] } = {
            success: true,
            msg: []
        };
        if (result && Array.isArray(result)) {
            result.forEach(res => {
                rs['success'] = rs['success'] && res.isSuccess;
                if (!res.isSuccess) {
                    rs.msg.push(res.message);
                }
            });
            if (rs.success) {
                this._message.success(message);
                if (callback) {
                    callback();
                }
            } else {
                this._message.error(rs.msg.join('<br/>'));
            }
        } else {
            if (result.isSuccess) {
                this._message.success(message);
                if (callback) {
                    callback();
                }
            } else {
                this._message.error(result.message);
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
                this._message.warning('请选中一条需要添加附件的记录！');
                return false;
            }
        }
        obj = {
            ...this._selectRow,
            _id: this._selectRow[dialog.keyId]
                ? this._selectRow[dialog.keyId]
                : '',
            // _parentId: this.tempValue['_parentId'] ? this.tempValue['_parentId'] : ''
            ...this.tempValue
        };

        const footer = [];
        const modal = this.modalService.create({
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
                    if (btn['name'] === 'save') {
                        (async () => {
                            const result = await componentInstance.buttonAction(
                                btn
                            );
                            this.showAjaxMessage(result, '保存成功', () => {
                                modal.close();
                                this.load();
                            });
                        })();
                    } else if (btn['name'] === 'saveAndKeep') {
                        (async () => {
                            const result = await componentInstance.buttonAction(
                                btn
                            );
                            this.showAjaxMessage(result, '保存成功', () => {
                                modal.close();
                                this.load();
                            });
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

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
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

    public execFun(name?, key?) {
        switch (name) {
            case 'deleteRow':
                // this.config.actions['deleteRow'] ? this.config.actions['deleteRow'] : null
                this.deleteRowOnSelected(key);
                break;
            default:
                break;
        }
    }

    // 行内删除
    public deleteRowOnSelected(key) {
        // 注意，末页删除需要将数据页数上移
        const index = this.loadData.rows.findIndex(item => item['key'] === key);
        if (index !== -1) {
            const rowValue = this.loadData.rows[index];
            this.loadData.rows.splice(this.loadData.rows.indexOf(rowValue), 1);
            this.loadData.total = this.loadData.rows.length;
            this.total = this.loadData.total;
            this.load();
        }
        this.scanCodeValueChange();


    }
}

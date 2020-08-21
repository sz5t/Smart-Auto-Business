import { Router } from '@angular/router';
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
    TemplateRef,
    ViewChild,
    ElementRef
} from '@angular/core';
import { NzMessageService, NzModalService, NzDropdownService, NzDrawerService } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { Observer } from 'rxjs';
import { Subscription } from 'rxjs';
import { BsnUploadComponent } from '@shared/business/bsn-upload/bsn-upload.component';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { BeforeOperation } from '../before-operation.base';
import { isArray } from 'util';
import { SettingsService, MenuService } from '@delon/theme';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { create } from 'domain';
import { timeout } from 'q';
import { setTimeout } from 'core-js';
import { CnVideoPlayComponent } from '../cn-video-play/cn-video-play.component';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: CnFormWindowResolverComponent,
    upload: BsnUploadComponent,
    video: CnVideoPlayComponent
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ts-data-table',
    templateUrl: './ts-data-table.component.html',
    styleUrls: [`ts-data-table.component.less`]
})
export class TsDataTableComponent extends CnComponentBase
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
    public pageSize = 5;
    public total = 0;
    public focusIds;
    public autoPlaySwitch = true;
    public temple = 0;
    public pagetotal = 1;

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
    public cascadeList = {};

    // 下拉属性 liu
    public is_Selectgrid = true;
    public cascadeValue = {}; // 级联数据
    public selectGridValueName;
    public changeConfig_new = {};
    public changeConfig_newSearch = {};
    public ajaxColumns; // 动态列
    // 自动播放的变量
    public loadautotime;
    public messageautotime;
    // 前置条件集合
    public beforeOperation;
    constructor(
        private _http: ApiService,
        private _message: NzMessageService,
        private modalService: NzModalService,
        private cacheService: CacheService,
        private router: Router,
        private drawerService: NzDrawerService,
        private _dropdownService: NzDropdownService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        public settings: SettingsService,
        private menuService: MenuService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
        super();
        this.apiResource = this._http;
        this.baseMessage = this._message;
        this.baseModal = this.modalService;
        this.cacheValue = this.cacheService;
        this.baseDrawer = this.drawerService;
    }
    public loadData = {
        rows: [],
        total: 0
    };

    public async ngOnInit() {
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
                // aloadData.data.dataSet1.forEach(element => {
                //     element['key'] = element[keyIdCode];
                // });
                const length = aloadData.data.dataSet1.length
                for (let i = 0; i < length; i++) {
                    this.loadData.rows[i]['_serilize'] = i + 1;
                    aloadData.data.dataSet1[i]['key'] = aloadData.data.dataSet1[i][keyIdCode]
                }
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
                await this.loadDynamicColumns();
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
        } else {
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
                this.loadDynamicColumns();
            }
            this.resolverRelation();

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

    public async ngAfterViewInit() {
        if (!this.config.ajaxproc) {
            if (this.config.componentType) {
                if (!this.config.componentType.child) {
                    await this.load();
                    this.loadAutoPlay();
                } else if (this.config.componentType.own === true) {
                    this.load();
                }
            } else {
                this.load();
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
        }
        //  初始化 事件 liu 20181226
        this.GetToolbarEvents();
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
                    case BSN_COMPONENT_MODES.DELETE_SELECTED:
                        this.beforeOperation.operationItemData = this._getSelectedItem();
                        !this.beforeOperation.beforeItemsDataOperation(
                            option
                        ) && this.deleteRowSelected(option, this._getSelectedItem());
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
                        this.beforeOperation.operationItemsData = this._getCheckedItems();
                        !this.beforeOperation.beforeItemsDataOperation(
                            option
                        ) && this.formBatchDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.AUTO_PLAY:
                        this.startAutoPlay();
                        return;
                    case BSN_COMPONENT_MODES.CALL_INTERFACE:
                        this.CallInterface(option);
                        return;
                }
            }
        });
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
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
                // if (this.config.drawerDialog) {
                //     if (this.config.drawerDialog.drawerType === 'condition' && this.config.drawerDialog.drawerMapping.length > 0) {
                //         this.config.drawerDialog.drawerMapping.forEach(m => {
                //             if (this._selectRow[m['field']] && this._selectRow[m['field']] === m['value']) {
                //                 const drawer = this.config.drawerDialog.drawers.find(d => d.name === m['name']);
                //                 this.showDrawer(drawer);
                //                 return;
                //             }
                //         });
                //     } else {
                //         this.showDrawer(this.config.drawerDialog.drawers[0]);
                //     }
                // }

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
                                && cascadeEvent._mode === BSN_COMPONENT_CASCADE_MODES[
                                relation.cascadeMode
                                ]
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
                                        this.scanCodeROW();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.Scan_Code_Locate_ROW:
                                        this.locateRow();
                                        // this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.START_AUTO_PLAY:
                                        if (this.loadautotime !== null) {
                                            clearInterval(this.loadautotime)
                                            this.messageAutoPlay();
                                        }
                                        // this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.CREATE_DYNAMIC_TABLE:
                                        this.loadDynamicColumns();
                                        this.load();
                                        break;

                                }
                            }
                        });
                    }
                }
            );
        }
    }

    public locateRow() {
        // 定位行
        // this.loadData.rows.push(rowContentNew);
        const code = this.config.ScanCode.locateRow.columns[0]['field'];
        const codeName = this.config.ScanCode.locateRow.columns[0]['valueName'];
        const codeValue = this.tempValue[codeName];

        // const index = this.loadData.rows.findIndex(item => item[code] === codeValue);
        const index = this.dataList.findIndex(item => item[code] === codeValue);
        if (index !== -1) {
            // const rowValue = this.loadData.rows[index]['key'];
            const rowValue = this.dataList[index]['key'];
            this.pageIndex = Math.ceil((index + 1) / this.pageSize);
            // this.load();
            this.scanCodeSetSelectRow(rowValue);
            // this.load();
            // 如果有操作，再选中行后执行
            // console.log('执行方法！，调用后执行load方法，并且定位到当前数据');
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
                this.selectRow(row);
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
            }
        });

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
    /**
     * 根据表单组件routeParams属性配置参数,执行页面跳转
     * @param option 按钮操作配置参数
     */
    private linkToPage(option, handleData) {
        const params = CommonTools.parametersResolver({
            params: this.config.routeParams,
            // componentValue: this.loadData ? this.loadData : this.value,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue,
            item: handleData
        });
        // 判断跳转页面是否为根据跳转跳转不同页面
        if (Array.isArray(option.link)) {
            option.link.forEach(elem => {
                if (handleData[elem.field] && (handleData[elem.field] === elem.value)) {
                    this.router.navigate([elem.linkName], { queryParams: params });
                }
            });
        } else {
            this.router.navigate([option.link], { queryParams: params });
        }
    }

    private linkToCenter(option) {
        const params = CommonTools.parametersResolver({
            params: this.config.routeParams,
            componentValue: option.data ? option.data : {},
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        this.router.navigate(['/ts/entry'], { queryParams: params });
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
             if(this.config.mergeconfig) {
                this._createMapd_new(this.config.mergeconfig,this.dataList);
            } 
    }



    public async load() {
        this.changeConfig_new = {};
        // this._selectRow = {};
        // this.pageIndex = pageIndex;
        setTimeout(() => {
            this.loading = true;
        });
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
        // (async () => {
        const method = this.config.ajaxConfig.ajaxType;
        const loadData = await this._load(url, params, this.config.ajaxConfig.ajaxType);
        if (loadData.isSuccess) {
            let resData;

            if (method === 'proc') {
                resData = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
                this.loadbypage();
            } else {
                resData = loadData.data.rows;
            }
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
                        // if (loadData.data.page) {
                        if (loadData.data.page === 1) {
                            row['_serilize'] = index + 1;
                        } else {
                            row['_serilize'] =
                                (loadData.data.page - 1) *
                                loadData.data.pageSize +
                                index +
                                1;
                        }
                        // if (index >= this.config.pageSize) {
                        //     loadData.data.page = loadData.data.page + 1;
                        //     row['_serilize'] = index - this.config.pageSize + 1;
                        // }
                        // } else {
                        //     loadData.data.page = 1;
                        //     row['_serilize'] = index + 1;
                        // }

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

            // let data;
            // if (method === 'proc') {
            //     data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
            //     this.dataList = data;
            //     this.dataList.forEach(d => {
            //         d['key'] = d[this.config.keyId]
            //             ? d[this.config.keyId]
            //             : 'Id';
            //     })
            // } else {
            //     data = loadData.data.rows;
            //     if (data) {
            //         // 设置聚焦ID
            //         // 默认第一行选中，如果操作后有focusId则聚焦ID为FocusId
            //         let focusId;
            //         if (loadData.FocusId) {
            //             focusId = loadData.FocusId;
            //         } else {
            //             loadData.data.rows.length > 0 &&
            //                 (focusId = loadData.data.rows[0].Id);
            //         }
            //         if (loadData.data.rows.length > 0) {
            //             loadData.data.rows.forEach((row, index) => {
            //                 row['key'] = row[this.config.keyId]
            //                     ? row[this.config.keyId]
            //                     : 'Id';
            //                 if (this.is_Selectgrid) {
            //                     if (row.Id === focusId) {
            //                         !this.config.isDefaultNotSelected && this.selectRow(row);
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
            //             this._selectRow = {};
            //         }

            //         this._updateEditCacheByLoad(loadData.data.rows);
            //         this.dataList = loadData.data.rows;
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

        // 初始化datagrid 编辑状态 liu 20181226
        // this.dataList.forEach(row => {
        //     this._startEdit(row['key'].toString());
        // });

        setTimeout(() => {
            this.loading = false;
        });
             // liu 20200728 行列合并
             if(this.config.mergeconfig) {
                this._createMapd_new(this.config.mergeconfig,this.dataList);
            } 
        //   })();
        // console.log('load:', this.dataList);

    }

    public loadAutoPlay() {
        this.pagetotal = Math.ceil(this.total / this.pageSize);
        if (!this.autoPlaySwitch) {
            this.temple = this.pageIndex;
        }
        if (this.config.autoPlay && this.autoPlaySwitch) {
            if (this.config.autosingle) {
                this.loadautotime = setInterval(() => {
                    this.load()
                }, this.config.timeInterval)
            } else {
                this.loadautotime = setInterval(() => {
                    if (this.pageIndex >= this.pagetotal) {
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex = this.pageIndex + 1;
                    }
                    this.load();
                }, this.config.timeInterval)
            }
        }
    }

    public messageAutoPlay() {
        if (this.messageautotime) {
            clearInterval(this.messageautotime);
        }
        // this.pagetotal = Math.ceil(this.dataList.length / this.pageSize);
        if (!this.autoPlaySwitch) {
            this.temple = this.pageIndex;
        }
        if (this.config.autoPlay && this.autoPlaySwitch) {
            if (this.config.autosingle) {
                this.messageautotime = setInterval(() => {
                    this.load()
                }, this.config.timeInterval)
            } else {
                this.messageautotime = setInterval(() => {
                    this.pagetotal = Math.ceil(this.total / this.pageSize);
                    // console.log('pagetotal:', this.pagetotal, 'pageIndex:', this.pageIndex);
                    if (this.pageIndex >= this.pagetotal) {
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex = this.pageIndex + 1;
                    }
                    this.load();
                }, this.config.timeInterval)
            }
        }
    }

    // 开启或关闭自动轮播
    public startAutoPlay() {
        this.temple = this.pageIndex;
        if (this.messageautotime) {
            clearInterval(this.messageautotime);
        }
        if (this.loadautotime) {
            clearInterval(this.loadautotime);
        }
        if (this.autoPlaySwitch) {
            this.autoPlaySwitch = false;
        } else {
            this.autoPlaySwitch = true;
        }
        this.pageIndex = this.temple;
        this.loadAutoPlay();
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
        const loadData = await this._load(url, params, ajaxConfig.ajaxType);
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
        console.log('异步获取当前值集合[]:', selectrowdata);
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
                    // console.log('loadData.data', loadData.data);

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
                    this.baseMessage.create('success', '保存成功');
                    this.focusIds = this._getFocusIds(response.data);
                    isSuccess = true;
                } else {
                    this.baseMessage.create('error', response.message);
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
                console.log(index);
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
        this.dataList.map(item => {
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
            this.baseMessage.info('请勾选数据记录后进行编辑');
        }
        // console.log('edit', this.dataList);
    }

    public valueChange(data) {
        // console.log('data:', data);
        // const index = this.dataList.findIndex(item => item.key === data.key);
        //  console.log('值变化', data, 'this.editCache[data.key].data[data.name] :', this.editCache[data.key]);
        let isValueChange = true;
        if (data.data === undefined) {
            data.data = null;
        }
        let _editCacheValue = this.editCache[data.key].data[data.name];
        let _data = data.data;
        if (!_editCacheValue) {
            _editCacheValue = 'null';
        }
        if (!_data) {
            _data = 'null';
        }
        if (_editCacheValue === _data) {
            isValueChange = false;
        }
        // console.log('值变化比较', isValueChange, this.editCache[data.key].data[data.name], data.data);
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
                            this.editCache[data.key].data[key] =  this.changeConfig_new[rowCasade][key]['setValue'];

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
                            this.editCache[data.key].data[key] =  this.changeConfig_new[rowCasade][key]['setValue'];
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
        // console.log('级联结果数据集', this.changeConfig_new[rowCasade]);
        // this.changeConfig_new = JSON.parse(JSON.stringify(this.changeConfig_new));
        // console.log('当前编辑缓存行内容', this.editCache[data.key].data);


        //  开始解析 当前feild 的适配条件【重点】 参数 conditions  返回 true/false
        // this.beforeOperation.handleOperationConditions([]);
        // 执行列事件
        // console.log('值变化比较', this.config.events)
        if (this.config.events) {
            //  console.log('值变化比较', isValueChange)
            if (isValueChange) {
                this.ExecEventByValueChange(data);
            }
        }




    }

    /**
     * 执行值变化触发的事件 liu 20181226
     * @param data
     */
    public ExecEventByValueChange(data?) {
        const ss = {
            events: [  // 行事件、列事件
                {
                    // 首先 判断 onTrigger 什么类别触发，其次 ，看当前是新增、修改， 最后 执行onEvent
                    name: '', // 名称唯一，为日后扩充权限做准备
                    onTrigger: 'onColumnValueChange',  // 什么条件触发  例如：oncolumnValueChange   onSelectedRow  on CheckedRow
                    type: 'EditableSave',  // 需要区分 新增 修改
                    actiontype: 'add、update', // 不满足条件的 均可
                    onEvent: [
                        {
                            type: 'field',
                            field: 'code',
                            action: '',
                            execEvent: [  // 【预留目前不实现】 当前字段的 执行事件，如果 没有 conditions 则执行action
                                {
                                    conditions: [
                                        // 描述 ：【】 之间 或者or {} 之间 并且 and 条件
                                        [
                                            {
                                                name: 'enabled',
                                                value: '[0-1]',
                                                checkType: 'regexp'  //  'value'  'regexp' 'tempValue' 'initValue'  'cacheValue'
                                            }
                                        ]
                                    ],
                                    action: '', // action 就是 toolbar 里配置的执行操作配置
                                }
                            ]

                        },
                        {
                            type: 'default',
                            action: '', // 方法名称
                        }
                    ]
                }
            ]
        }
        // console.log('ExecEventByValueChange');
        const vc_field = data.name;
        //  ts_saveEdit data.key
        const vc_rowdata = this.ts_getEditRow(data.key, data.name);
        this.EditSelectedRow = [];
        this.EditSelectedRow.push(vc_rowdata);
        console.log('当前行数据：', vc_rowdata);
        // 判断是否存在配置
        if (this.config.events) {
            const index = this.config.events.findIndex(item => item['onTrigger'] === 'onColumnValueChange');
            let c_eventConfig = {};
            if (index > -1) {
                c_eventConfig = this.config.events[index];
            } else {
                return true;
            }

            let isField = true; // 列变化触发
            // 首先适配类别、字段，不满足的时候 看是否存在default 若存在 取default
            c_eventConfig['onEvent'].forEach(eventConfig => {
                // 指定具体feild的操作
                if (eventConfig.type === 'field') {
                    if (eventConfig.field === vc_field) {
                        isField = false;
                        // 调用 执行方法，方法
                        this.ExecRowEvent(eventConfig.action, vc_rowdata);
                        return true;
                    }
                }
            });
            if (isField) {
                c_eventConfig['onEvent'].forEach(eventConfig => {
                    // 无配置 的默认项
                    if (eventConfig.type === 'default') {
                        this.ExecRowEvent(eventConfig.action, vc_rowdata);
                    }
                });
            }



        }

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

    public deleteRowSelected(option, row) {
        if (this.dataList.filter(item => item.key === row.key).length <= 0) {
            this.baseMessage.create('info', '请选择要删除的数据');
        } else {
            if (option.ajaxConfig.length > 0) {
                option.ajaxConfig.map(async delConfig => {
                    this.baseModal.confirm({
                        nzTitle: delConfig.title ? delConfig.title : '提示',
                        nzContent: delConfig.message ? delConfig.message : '',
                        nzOnOk: () => {
                            const newData = [];
                            const serverData = [];
                            this.dataList.forEach(item => {
                                if (item.key === row.key) {
                                    if (item['row_status'] === 'adding') {
                                        // 删除新增临时数据
                                        newData.push(item.key);
                                    } else {
                                        // 删除服务端数据
                                        serverData.push(item.Id);
                                    }
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
            this.baseMessage.create('success', '删除成功');
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
            this.baseMessage.create('error', response.message);
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
            this._getCheckItemsId();
            const tmpValue = this.tempValue ? this.tempValue : {};
            const initCheckedIds = this.initValue['_checkedIds'] ? this.initValue['_checkedIds'] : null;
            const tempCheckedIds = tmpValue['_checkedIds'] ? tmpValue['_checkedIds'] : null;
            const checkedIds = { initCheckedIds: initCheckedIds, tempCheckedIds: tempCheckedIds };
            const modal = this.baseModal.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: component['layout'],
                nzComponentParams: {
                    permissions: this.permissions,
                    config: data,
                    dialog: dialog,
                    initData: { ...this.initValue, ...tmpValue, ...selectedRow, ...checkedIds }
                },
                nzFooter: footer
            });
            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button['label'] = btn.text;
                    button['type'] = btn.type ? btn.type : 'default';
                    button['size'] = btn.size ? btn.size : 'default';
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

    private sendCascadeMessage() {
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
    }

    // region 批量确认提交数据，未完成与服务端的批量测试功能
    // 关于相关配置的问题需要进一步进行讨论

    private _resolveAjaxConfig(option, row?) {
        if (option.ajaxConfig && option.ajaxConfig.length > 0) {
            option.ajaxConfig.filter(c => !c.parentName).map(c => {
                this._getAjaxConfig(c, option, row);
            });
        }
    }

    private _getAjaxConfig(c, option, row?) {
        let msg;
        if (c.action) {
            let handleData;
            // 所有获取数据的方法都会将数据保存至tempValue
            // 使用时可以通过临时变量定义的固定属性访问
            // 使用时乐意通过内置的参数类型进行访问
            switch (c.action) {
                case BSN_EXECUTE_ACTION.EXECUTE_ADD_ROW_DATA:
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return false;
                    }
                    handleData = {};
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return false;
                    }
                    handleData = this._getCheckedItems();
                    this.beforeOperation.operationItemsData = handleData;
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return false;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                    if (this._selectRow['row_status'] === 'adding') {
                        this.baseMessage.create(
                            'info',
                            '当前数据未保存无法进行处理'
                        );
                        return false;
                    }
                    handleData = this._getSelectedItem();
                    this.beforeOperation.operationItemData = handleData;
                    if (this.beforeOperation.beforeItemDataOperation(option)) {
                        return false;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                    if (
                        this.dataList.filter(item => item.checked === true)
                            .length <= 0
                    ) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return false;
                    }
                    handleData = this._getCheckItemsId();
                    this.beforeOperation.operationItemsData = this._getCheckItemsId();
                    if (this.beforeOperation.beforeItemsDataOperation(option)) {
                        return false;
                    }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_EDIT_ROW:
                    // 获取保存状态的数据
                    handleData = this._getEditedRows();
                    // console.log('简析参数1838 ', handleData);
                    msg = '编辑数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_EDIT_SELECTED_ROW:
                    // 获取保存状态的数据
                    this._getSelectedItem();
                    handleData = row;
                    //  console.log('简析参数1838 ', handleData);
                    msg = '操作完成';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }
                    break;
                // liu 20181226
                // handleData = this._getSelectedItem();
                // msg = '编辑数据保存成功';
                // if (handleData && handleData.length <= 0) {
                //     return;
                // }
                // break;
                case BSN_EXECUTE_ACTION.EXECUTE_SAVE_ROW:
                    // 获取更新状态的数据
                    handleData = this._getAddedRows();
                    msg = '新增数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return;
                    }
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_AND_LOAD:
                    // 获取更新状态的数据
                    handleData = {};
                    msg = '新增数据保存成功';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_EDIT_ALL_ROW:
                    // 获取更新状态的数据
                    handleData = this._getAllEditRows();
                    msg = '编辑数据保存成功';
                    break;

            }

            // console.log('简析参数1860 ', handleData);

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
                                this.focusIds = this._getFocusIds(
                                    response.data
                                );
                                if (this.config.ajaxConfig.ajaxType === 'proc') {
                                    this.loadbypage();
                                } else {
                                    this.load();
                                }
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
    public outputParametersResolver(c, response, ajaxConfig, callback) {
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
            const msgObj = msg
                ? response.data[msg.name].split(':')
                : null;
            const valueObj = response.data ? response.data : {};
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
                if (childrenConfig.length > 0) {
                    //  目前紧支持一次执行一个分之步骤
                    this._getAjaxConfig(childrenConfig[0], ajaxConfig);
                }
            }

        } else {
            this.baseMessage.error('操作异常：', response.message);
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
            returnValue: this.returnValue
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
                        returnValue: this.returnValue
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
                    returnValue: this.returnValue
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

    private _getNormalCheckedItemsId() {
        const serverData = [];
        this.dataList.forEach(item => {

            if (
                item.checked === true
            ) {
                // 删除服务端数据
                serverData.push(item['Id']);
            }
        });
        this.tempValue['_normalCheckedIds'] = serverData.join(',');
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
                // console.log('edititem:', item);
                const newitem = JSON.parse(
                    JSON.stringify(this.editCache[item.key].data)
                );
                newitem['row_status'] = item['row_status'];
                newitem['checked'] = item['checked'];
                updatedRows.push(newitem);
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
                    this.editCache[item.key] = {
                        edit: true,
                        data: JSON.parse(JSON.stringify(item)),
                        mergeData:{}
                    };
                }
            });
        } else {
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
        // console.log('this.editCache', this.editCache)
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

        // liu 20181210
        this.updateValue.emit(this._selectRow);
    }

    // liu 赋值选中
    private setSelectRow(rowValue?) {
        // console.log('setSelectRow', this.value);
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

    // 表格的静态分页 20190703
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
        if(this.config.mergeconfig) {
            this._createMapd_new(this.config.mergeconfig,this.dataList);
        } 
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
        // console.log('取消行数据', this.editCache[key].data);
        if(this.config.mergeconfig) {
            this._createMapd_new(this.config.mergeconfig,this.dataList);
        } 
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
                item: this._selectRow,
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
            delete searchData['__state__'];
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
                                    }
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
                this.baseMessage.success(message);
                if (callback) {
                    callback();
                }
            } else {
                this.baseMessage.error(rs.msg.join('<br/>'));
            }
        } else {
            if (result.isSuccess) {
                this.baseMessage.success(message);
                if (callback) {
                    callback();
                }
            } else {
                this.baseMessage.error(result.message);
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
            nzContent: component['form'],
            nzComponentParams: {
                config: dialog,
                tempValue: obj,
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
                            }
                        );
                    } else if (btn['name'] === 'saveAndKeep') {
                        componentInstance.buttonAction(
                            btn,
                            () => {
                                this._resetForm(componentInstance);
                                this.load();
                            }
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
            nzFooter: footer,
            nzOnOk: () => {
                new Promise(resolve => (setTimeout(resolve, 0)));
            }
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
     * 弹出抽屉
     * @param option
     */
    public drawerDialog(option) {
        if (this.config.drawerDialog.drawers && this.config.drawerDialog.drawers.length > 0) {
            const index = this.config.drawerDialog.drawers.findIndex(
                item => item.name === option.actionName
            );
            this.showDrawer(this.config.drawerDialog.drawers[index]);
        }
    }

    /**
  * 弹出页面
  * @param dialog
  */
    private showDrawer(dialog, handleData?) {
        const footer = [];
        let drawer;
        this._http.getLocalData(dialog.layoutName).subscribe(data => {
            const selectedRow = this._selectRow ? this._selectRow : {};
            const tmpValue = this.tempValue ? this.tempValue : {};
            const handle = handleData ? handleData : {};
            this._getNormalCheckedItemsId();
            drawer = this.baseDrawer.create({
                // nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: LayoutResolverComponent,
                nzMaskClosable: true,
                nzPlacement: 'right',
                nzHeight: dialog.height,
                // nzBodyStyle: {
                //     'padding' : '8px',
                //     'background': 'hsla(0,0%,100%,.3)',
                //     'overflow': 'hidden',
                //     'scroll-y': true
                // },
                nzClosable: false,
                nzContentParams: {
                    permissions: this.permissions,
                    config: data,
                    initData: { ...tmpValue, ...selectedRow, ...handle, ...this.initValue }
                }
            });



            drawer.afterOpen.subscribe(() => {

            });

            drawer.afterClose.subscribe(() => {
                if (this.config.ajaxproc) {
                    this.showprocdata();
                } else {
                    this.load();
                }

            });

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
    public showVideo(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.openVideo(this.config.formDialog[index]);
        }
    }

    private openVideo(dialog) {
        let obj;
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
                nzContent: component['video'],
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
                        if (btn['name'] === 'close') {
                            this.load();
                            modal.close();
                        }
                    };
                    footer.push(button);
                });
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
                    // console.log(color.caseValue.regular,regularData,regularflag,color);
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
    // "formatter": [
    //     {
    //         caseValue: { type: "selectValue", valueName: "value", regular: "^1$" }, // 哪个字段的值触发，正则表达 type：selectValue （当前值） selectObjectValue（当前选中对象）
    //         "value": "起草",
    //         "bgcolor": "",
    //         "fontcolor": "text-blue",
    //         "valueas": "起草"
    //     },

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
        if (this.loadautotime) {
            clearInterval(this.loadautotime);
        }

        if (this.messageautotime) {
            clearInterval(this.messageautotime);
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
        // console.log('级联配置简析', this.cascadeList);
    }

    public isEmptyObject(e) {
        let t;
        for (t in e) return !1;
        return !0;
    }

    public _isArray(a) {
        return (Object.prototype.toString.call(a) === '[object Array]');
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
            // console.log('当前组件有被级联的子对象');
            for (const key in this.cascadeList[sendCasade]) {
                // 处理当前级联
                //  console.log('处理当前级联', key);
                if (!this.changeConfig_newSearch[rowCasade][key]) {
                    this.changeConfig_newSearch[rowCasade][key] = {};
                }

                if (this.cascadeList[sendCasade][key]['dataType']) {
                    this.cascadeList[sendCasade][key]['dataType'].forEach(
                        caseItem => {
                            // console.log('dataType-caseItem', caseItem);
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
                                // console.log('setValueinput' , caseItem['setValue'] );

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
                                    console.log(
                                        'setValue2',
                                        caseItem['setValue']
                                    );
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
            // console.log('级联结果数据集', this.changeConfig_new);
        }

        // console.log('值变化后的数据结构', this.search_Row, this._buildSearch(), this.changeConfig_newSearch);
        // console.log('查询缓存数据', this.editCache[data.key]);
        this.load();

    }


    // 触摸屏配置草稿

    // 将操作统一配置在 toolbar  中 ，属性是hidden：true  这样渲染不会有影响
    // 权限也可控制，类别是执行事件，非toolbar操作
    // 【需要调整部分】，toolbar 的模板 添加 ng-if  config.hidden
    // 【难点调整】其他组件中，无法对操作权限控制，【这部分影响以后扩充灵活性，目前难度大，日后扩充】

    // tslint:disable-next-line:member-ordering
    public new_config = {

        supplementaryline: true, // 是否进行行补充【当前页数据不够时动态填充空行】
        // 问题：需要有新的行状态，当前行是不能有其他操作
        //           当有新增或者其他对行有影响的操作，则不允许取补充行信息（多选取值）
        //  注意：删除后的补充，新增前的计算，如果有补充行，则先删除一行
        columnsAjax: {
            'url': 'common/guagedaterecord',
            'ajaxType': 'get',
            'params': [
                {
                    'name': 'bid',
                    'type': 'initValue',
                    'valueName': 'Id'
                }
            ]
        },
        columnsConfig: [
            { 'name': 'title', 'feild': '' },
            { 'name': 'field', 'feild': '' },
            { 'name': 'width', 'feild': '' },
            { 'name': 'hidden', 'feild': '' },
            { 'name': 'isEdit', 'feild': '' },
            { 'name': 'editType', 'feild': '' },
            { 'name': 'editConfig', 'feild': '' },
            { 'name': 'sort', 'feild': '' }
        ],
        defaultcolumns: [
            {
                'title': '序号',
                'field': '_serilize',
                'width': '20%',
                'hidden': false
            },
            {
                'title': 'ID',
                'field': 'Id',
                'width': '20%',
                'hidden': false
            }
        ],
        columns: [
            {
                title: 'Id',
                field: 'Id',
                width: 80,
                hidden: true,
                editor: {
                    type: 'input',
                    field: 'Id',
                    options: {
                        type: 'input',
                        labelSize: '6',
                        controlSize: '18',
                        inputType: 'text'
                    }
                },
                ts_editor: [  // 数组 表示当前行有多种组件 一行多组件，需要有条件来适配
                    {
                        // 正则表达 根据状态渲染组件，默认处理模式只支持第一个满足条件的
                        caseValue: { valueName: 'value', regular: '^2$' },
                        // 问题？特殊描述 多字段组合条件，新增行处理？呈现什么状态
                        type: 'input',
                        field: 'Id',
                        options: {
                            type: 'input',
                            labelSize: '6',
                            controlSize: '18',
                            inputType: 'text'
                        }
                    },
                    {
                        default: '', // 默认编辑结构
                    }
                ]
            }],
        // 事件 配置
        toolbarEvent: [
            {
                gutter: 24,
                offset: 12,
                span: 10,
                position: 'right',
                group: [
                    {
                        name: 'Tab1_GYGC_refresh',
                        class: 'editable-add-btn',
                        text: '刷新',
                        icon: 'anticon anticon-reload',
                        color: 'text-primary',
                        toolbartype: 'action ',  // 此类别标识当前组件属性，操作、按钮
                        hidden: true   //  此属性
                    }
                ]
            }
        ],
        events: [  // 行事件、列事件
            {
                // 首先 判断 onTrigger 什么类别触发，其次 ，看当前是新增、修改， 最后 执行onEvent
                name: '', // 名称唯一，为日后扩充权限做准备
                onTrigger: 'onColumnValueChange',  // 什么条件触发  例如：oncolumnValueChange   onSelectedRow  on CheckedRow
                type: 'EditableSave',  // 需要区分 新增 修改
                actiontype: 'add、update', // 不满足条件的 均可
                onEvent: [
                    {
                        type: 'field',
                        field: 'code',
                        execEvent: [  // 当前字段的 执行事件，如果 没有 conditions 则执行action
                            {
                                conditions: [
                                    // 描述 ：【】 之间 或者or {} 之间 并且 and 条件
                                    [
                                        {
                                            name: 'enabled',
                                            value: '[0-1]',
                                            checkType: 'regexp'  //  'value'  'regexp' 'tempValue' 'initValue'  'cacheValue'
                                        }
                                    ]
                                ],
                                action: '', // action 就是 toolbar 里配置的执行操作配置
                            }
                        ]

                    },
                    {
                        type: 'default',
                        action: '', // 方法名称
                    }
                ]
            }

        ]
    };
    // 一列 多组件，需要类似查询，需要一个中间组件来简析当前组件
    // tslint:disable-next-line:member-ordering

    // handleOperationConditions  // 选中行消息简析

    //  执行行内事件【】,不展示的按钮事件，日后扩充
    public ExecRowEvent(enentname?, row?) {
        //  name
        // const option = updateState.option;
        let option = {};
        let model = '';
        const index = this.toolbarConfig.findIndex(
            item => item['name'] === enentname
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
            case BSN_COMPONENT_MODES.DELETE_SELECTED:
                this.beforeOperation.operationItemData = row;
                this.deleteRowSelected(option, row);
                break;
            case BSN_COMPONENT_MODES.DIALOG:
                this.beforeOperation.operationItemData = this._selectRow;
                !this.beforeOperation.beforeItemDataOperation(option) &&
                    this.dialog(option);
                break;
            case BSN_COMPONENT_MODES.EXECUTE:
                // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
                // console.log('执行列3665：', option);
                this._resolveAjaxConfig(option, row);
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
            case BSN_COMPONENT_MODES.SHOW_VIDEO:
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



    // tslint:disable-next-line:member-ordering
    public EditSelectedRow = [];
    /**
    * 列保存数据
    * @param key
    * @private
    */
    private ts_getEditRow(key: string, name: string) {
        const index = this.dataList.findIndex(item => item.key === key);
        this.dataList[index] = JSON.parse(
            JSON.stringify(this.editCache[key].data)
        );
        const row = this.dataList[index];
        row['currentValue'] = this.dataList[index][name];
        row['currentName'] = name;
        return row;
    }


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
        //  console.log('右键事件');
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
        //  console.log('Button ok clicked!');
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
        //  console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    // 拖动行

    public f_ondragstart(e?, d?) {
        this.d_row = d;
        // opacity:0.5;
        // console.log('3852', e);
        //  e.target.style.transition = 'all 0.1s';
        // e.target.style.opacity = '1';
        //  style="transition: all 0.1s"
        // background-color':data.selected?'rgb(236, 246, 253)':
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
        // console.log('拖放后的位置：', index, tindex);
        this.c_data = JSON.parse(JSON.stringify(this.droparr(c_config, index, tindex)));
        // console.log('最终数据：', this.c_data );
    }

    // index是当前元素下标，tindex是拖动到的位置下标。
    public droparr(arr, index, tindex) {
        // 如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
        // 我们再把数组之前的那个拖动的元素删除掉，所以要len+1
        if (index > tindex) {
            arr.splice(tindex, 0, arr[index]);
            arr.splice(index + 1, 1)
        } else {
            // 如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
            // 这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
            arr.splice(tindex + 1, 0, arr[index]);
            arr.splice(index, 1)
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
        console.log('f_drag', e);
        //     e.target.style.opacity = '1';
        //     // background-color':data.selected?'rgb(236, 246, 253)':
        //    e.target.style['background-color'] = 'rgb(236, 246, 253)';

    }

    public onblur(e?, d?) {
        //  console.log('onblur', e, d);
        this.is_drag = true;
    }
    public onfocus(e?, d?) {
        // console.log('onfocus', e, d);
        this.is_drag = false;
    }



    // tslint:disable-next-line:member-ordering
    public tTD; // 用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题
    // tslint:disable-next-line:member-ordering
    @ViewChild('bt') public bt: ElementRef;

    /**
     * th_onmousedown
     */
    public th_onmousedown(event?) {
        this.tTD = event.target;
        if (event.offsetX > this.tTD.offsetWidth - 10) {
            this.tTD.mouseDown = true;
            this.tTD.oldX = event.x;
            this.tTD.oldWidth = this.tTD.offsetWidth;
        }
    }

    /**
     * th_onmouseup
     */
    public th_onmouseup(event?) {
        console.log('th_onmouseup');
        if (this.tTD === undefined) {
            this.tTD = event.target;
        }
        this.tTD.mouseDown = false;
        this.tTD.style.cursor = 'default';
    }

    /**
     * th_onmousemove
     */
    public th_onmousemove(event?, col?) {
        // console.log('th_onmousemove');
        // 更改鼠标样式
        if (event.offsetX > event.target.offsetWidth - 10) {
            event.target.style.cursor = 'col-resize';
        } else {
            event.target.style.cursor = 'default';
        }

        // 取出暂存的Table Cell
        if (this.tTD === undefined) {
            this.tTD = event.target;
        }
        // 调整宽度
        if (this.tTD.mouseDown != null && this.tTD.mouseDown === true) {
            this.tTD.style.cursor = 'default';
            console.log('原来宽度', this.tTD.oldWidth, col.width);
            if (this.tTD.oldWidth + (event.x - this.tTD.oldX) > 0)
                this.tTD.width = this.tTD.oldWidth + (event.x - this.tTD.oldX);
            // 调整列宽
            this.tTD.style.width = this.tTD.width;
            this.tTD.style.cursor = 'col-resize';
            col.width = this.tTD.width + 'px';
            console.log('移动的宽度', this.tTD.width, col.width);

        }
    }

    // [
    //     {
    //      name:'列属性',
    //      feild:'属性取值字段'，
    //      是否显示，
    //      是否编辑，
    //      编辑组件类别【input、number、datetime、select(目前只支持静态)】
    //    }
    //  ]
    // tslint:disable-next-line:member-ordering
    public fieldConfig = [
        {
            name: '',
            title: '温度',
            field: 'value001',
            width: '100',
            hidden: false,
            isEdit: true,
            editType: 'input',
            sort: 1
        },
        {
            name: '',
            title: '湿度',
            field: 'value002',
            width: '100',
            hidden: false,
            isEdit: true,
            editType: 'input',
            sort: 2
        }
    ];

    // tslint:disable-next-line:member-ordering
    public defaultcolumns =
        [
            {
                'title': '序号',
                'field': '_serilize',
                'width': '150px',
                'hidden': false
            },
            {
                'title': 'ID',
                'field': 'Id',
                'width': '150px',
                'hidden': false
            },
        ];
    /**
     * setFieldBycou
     */
    public setFieldByColumns(fieldConfig?) {
        const cf_config = [];
        fieldConfig.forEach(f => {
            const cf = {};
            cf['title'] = f.title;
            cf['subtitle'] = f.subtitle ? f.subtitle : null;
            cf['subtitletext'] = f.subtitletext ? f.subtitletext : null;
            cf['text'] = f.text ? f.text : null;
            cf['field'] = f.field;
            cf['width'] = f.width;
            cf['titlewidth'] = f.titlewidth;
            cf['hidden'] = f.hidden;
            cf['titleField'] = f.titleField;
            cf['fieldAlign'] = f.fieldAlign ? f.field.Align : 'text-center'
            if (f.isEdit) {
                cf['editor'] = this.setEditConfig(f);
            }
            cf_config.push(cf);
        });
        return cf_config;
    }

    /**
     * setEditConfig
     */
    public setEditConfig(d?) {
        let c;
        if (d.editType === 'input') {
            c = {
                'type': 'input',
                'field': d.field,
                'options': {
                    'type': 'input',
                    'width': d.width,
                    'inputType': 'text'
                }
            }
        } else if (d.editType === 'select') {
            // 无法实现动态数据源，这部分信息只能由视图补充
            c = {
                'type': 'select',
                'field': d.field,
                'options': {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '18',
                    'inputType': 'submit',
                    'disabled': false,
                    'size': 'default',
                    'width': d.width,
                    'defaultValue': '1',
                    'options': [
                        {
                            'label': '合格',
                            'value': '1',
                            'disabled': false
                        },
                        {
                            'label': '不合格',
                            'value': '2',
                            'disabled': false
                        }
                    ]
                }
            }
        }
        return c;

    }
    // editor 分两部分，以视图信息为主，缺省值则由内置配置自动补齐

    /**
     * mergedColumns 合并列【默认列+异步生成列】 重复异步覆盖默认列
     */
    public mergedColumns(fieldConfig?) {
        const dynamicColumns = this.setFieldByColumns(fieldConfig);
        const dynamicdefaultcolumns = [];
        this.config.defaultcolumns.forEach(c => {
            const index = dynamicColumns.findIndex(item => item.feild === c.field);
            if (index > -1) {
                // 动态列重复，覆盖默认列
            } else {
                dynamicdefaultcolumns.push(c);
            }
        });

        const columns = [...dynamicdefaultcolumns, ...dynamicColumns];
        // console.log('最终生成列', columns);
        return columns;
    }

    public async loadDynamicColumns() {
        const url = this._buildURL(this.config.columnsAjax.url);
        const params = {
            ...this._buildParameters(this.config.columnsAjax.params)
            // ...selectparams
        };
        const loadColumns = [];
        const loadData = await this.get(url, params);
        if (loadData && loadData.status === 200 && loadData.isSuccess) {
            if (loadData.data) {
                // console.log('异步请求列信息', loadData.data);
                if (loadData.data.length > 0) {
                    if (loadData.data.length < 50) { // 异常处理，超过50个
                        this.ajaxColumns = loadData.data;
                        loadData.data.forEach(element => {
                            const column = {};
                            this.config.columnsConfig.forEach(cc => {
                                if (cc.feild) {
                                    column[cc.name] = element[cc.feild];
                                } else {
                                    column[cc.name] = cc['value'];
                                }
                            });
                            loadColumns.push(column);
                        });
                    }
                }
            }
        }
        const Columns = this.mergedColumns(loadColumns);
        this.config.columns = Columns;
    }

    public swichChecked(d?) {
        const index = this.dataList.findIndex(item => item.key === d.key);
        this.dataList[index].checked = !d.checked;
        this.checkedCount = this.dataList.filter(w => w.checked).length;
        this.allChecked = this.checkedCount === this.dataList.length;
        this.indeterminate = this.allChecked ? false : this.checkedCount > 0;
        // console.log('datalist', this.dataList);
    }

    /**
         * 标题操作 titletToolbarAction  liu 20191017
         */
    public titleToolbarAction(col?) {
        //  this. ajaxColumns;  // 动态列信息，也就是检测项目信息
        if (this.ajaxColumns && this.ajaxColumns.length > 0) {
            const d = this.ajaxColumns.findIndex(c => c['Id'] === col['titleField']);
            console.log('ajaxColumns', this.ajaxColumns);
            console.log('d', d);
            console.log('col', col);
            if (d > -1) {
                // 找到当前点击标题按钮后的数据
                // 解析配置执行具体跳转或者切换、抽屉等页面操作
                this.ExecEventByTitleClick(this.ajaxColumns[d]);
            }
        }
        // const sendData = {
        //     autoResize: [{
        //         viewId: 'col001',
        //         span: 0,
        //         size: {
        //             nzXs: 0,
        //             nzSm: 0,
        //             nzMd: 0,
        //             nzLg: 0,
        //             ngXl: 0
        //         }
        //     }]
        // };

        // this.cascade.next(
        //     new BsnComponentMessage(
        //         BSN_COMPONENT_CASCADE_MODES['AUTO_RESIZE'],
        //         this.config.viewId,
        //         {
        //             data: sendData
        //         }
        //     )
        // );
        // console.log('sendData', sendData);
    }

    /**
 * 执行值变化触发的事件 liu 20181226
 * @param data
 */
    public ExecEventByTitleClick(data?) {
        // console.log(data);
        const vc_field = data.name;
        //  ts_saveEdit data.key
        // const vc_rowdata = this.ts_getEditRow(data.key, data.name);
        // this.EditSelectedRow = [];
        // this.EditSelectedRow.push(vc_rowdata);

        // console.log('当前行数据：', vc_rowdata);
        // 判断是否存在配置
        if (this.config.events) {
            const index = this.config.events.findIndex(item => item['onTrigger'] === 'onTitleClick');
            let c_eventConfig = {};
            if (index > -1) {
                c_eventConfig = this.config.events[index];
            } else {
                return true;
            }

            let isField = true; // 列变化触发
            // 首先适配类别、字段，不满足的时候 看是否存在default 若存在 取default
            c_eventConfig['onEvent'].forEach(eventConfig => {
                // 指定具体feild的操作
                if (eventConfig.type === 'field') {
                    if (eventConfig.field === vc_field) {
                        isField = false;
                        // 调用 执行方法，方法
                        this.ExecRowEvent(eventConfig.action);
                        return true;
                    }
                }
            });
            if (isField) {
                c_eventConfig['onEvent'].forEach(eventConfig => {
                    // 无配置 的默认项
                    if (eventConfig.type === 'default') {
                        const checkedItems = this._getCheckedItems();
                        this._getCheckItemsId();
                        if (eventConfig.beforeOperation) {
                            !this.beforeOperation.beforeItemsDataOperation(checkedItems) &&
                                this.resolverOperation(data);
                        } else {
                            this.resolverOperation(data);
                        }
                    }
                });
            }



        }

    }

    public resolverOperation(handleData) {
        if (this.config.operationMapping) {
            this.config.operationMapping.forEach(operation => {
                if (handleData[operation['field']] && handleData[operation['field']] === operation['value']) {
                    this[operation['operation']](handleData);
                }
            });
        } else if (this.config.drawerDialog) {
            this.drawerDialogs(handleData);
        } else if (this.config.linkConfig) {
            this.link(handleData);
        }
    }


    private drawerDialogs(handleData) {
        if (this.config.drawerDialog) {
            if (this.config.drawerDialog.drawerType === 'condition') {
                this.config.drawerDialog.drawers.forEach(drawer => {
                    let isMatch;
                    if (drawer.fieldMapping) {
                        drawer.fieldMapping.forEach(m => {
                            if (handleData[m['field']] && handleData[m['field']] === m['value']) {
                                isMatch = true;
                            }
                        });
                    }
                    if (isMatch === true) {
                        this.showDrawer(drawer, handleData);
                    }
                });
            } else {
                this.showDrawer(this.config.drawerDialog.drawers[0]);
            }

        }
    }

    private link(handleData) {
        this.config.linkConfig.forEach(link => {
            let isMapping = false;
            if (link.fieldMapping) {
                link.fieldMapping.forEach(field => {
                    if (handleData[field['field']] && handleData[field['field']] === field['value']) {
                        isMapping = true;
                    }
                });
            }
            if (isMapping) {
                this.linkToPages({ data: handleData, link: link.link, params: link.routeParams }, link)
            }
        });
    }

    /**
     * 根据表单组件routeParams属性配置参数,执行页面跳转
     * @param option 按钮操作配置参数
     */
    private linkToPages(option, link?) {
        const params = CommonTools.parametersResolver({
            params: link.routeParams ? link.routeParams : {},
            componentValue: option.data ? option.data : {},
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        this.router.navigate([option.link], { queryParams: params });
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

    // 扫码响应
    public scanCodeROW() {
        const _ScanCode = '_ScanCode';
        if (this.tempValue[_ScanCode]) {
            if (this.tempValue[_ScanCode].length <= 0) {
                //  this._message.info('扫码没有匹配到数据！');
                return true;
            }
        }
        if (this.config.events) {
            const index = this.config.events.findIndex(item => item['onTrigger'] === 'scanCodeROW');
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
                        this.ExecRowEvent(eventConfig.action);
                    }
                });
            }
        }
    }

    public logout() {
        this.baseModal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                this.tokenService.clear();
                this.cacheValue.clear();
                this.menuService.clear();
                // console.log(this.tokenService.login_url);
                // this.router.navigateByUrl(this.tokenService.login_url);
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                this.router.navigateByUrl('/passport/ts-login').catch(() => {
                    this.apiResource.post('login_out');
                });
                // }).catch(() => console.log('Oops errors!'));
            }
        });
    }

    public CallInterface(callConfig) {
        let result = true;
        let url: string;
        if (callConfig.ajaxConfig[0].urlobj) {
            url = this.buildUrl(callConfig.ajaxConfig[0].url, callConfig.ajaxConfig[0].urlobj);
        } else {
            url = this.buildUrl(callConfig.ajaxConfig[0].url, '');
        }
        const params = this._buildParameters(callConfig.ajaxConfig[0].params);
        if (document.getElementById('tag1')) {
            const tag = document.getElementById('tag1');
            tag.parentNode.removeChild(tag);
        }
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('id', 'tag1');
        let requestString = '';
        for (let p in params) {
            if (params.hasOwnProperty(p) && p !== undefined) {
                requestString += p + '=' + params[p] + '&';
            }
            script.src = url + '?' + requestString;
        }
        document.body.appendChild(script);
    }

    public buildUrl(urlConfig, urlobj?) {
        let url;
        if (urlobj) {
            const ip = CommonTools.parametersResolver({
                params: urlobj.params,
                item: this._selectRow,
                tempValue: this.tempValue,
                initValue: this.initValue,
                cacheValue: this.cacheValue,
            });
            url = 'http://' + ip['IP'] + ':' + ip['sort'] + '/' + urlConfig;
        } else {
            if (CommonTools.isString(urlConfig)) {
                url = urlConfig;
            } else {
                const pc = CommonTools.parametersResolver({
                    params: urlConfig.params,
                    tempValue: this.tempValue,
                    initValue: this.initValue,
                    cacheValue: this.cacheValue
                });
                url = `${urlConfig.url['parent']}/${pc}/${urlConfig.url['child']}`;
            }
        }
        return url;
    }

    public _getAllEditRows() {
        const updatedRows = [];
        this.dataList.map(item => {
            let newitem
            // console.log('edititem:', item);
            if (JSON.stringify(item) !== JSON.stringify(this.editCache[item.key].data)) {
                newitem = JSON.parse(
                    JSON.stringify(this.editCache[item.key].data)
                )
                updatedRows.push(newitem);
            };
        });
        return updatedRows
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

                    // new_data = new_data.filter(d => d[group_col.groupColName] === row[group_col.groupColName]);
                    let _SingleEdit =true;
                    if(group_col.hasOwnProperty('singleEdit')) {
                        _SingleEdit=group_col['singleEdit'];
                    }  
                    
                    new_data = [...this._createMapd_array(new_data, group_col.groupColName, row, _SingleEdit)];
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


        // console.log('new生成分组信息', this.editCache);

    }

        /**
 * 
 * @param new_data  范围数组
 * @param feildName 分组字段
 * @param row       当前行
 * @param isSingleEdit 分组字段是否启用单独编辑
 */
public _createMapd_array(new_data?, feildName?, row?, isSingleEdit?) {

    // 总方法，将数据集合 拷贝 可补充解析字段在当前结构下是否计算
    // 数组构建 
    // 将原数据对比编辑状态数据，计算出当前数据的状态
    // 1.判断是否启用独立编辑
    // 1.1 启用独立编辑 计算出当前行所在位置
    // 按当前行开始，向下找，满足分组标识一致，并且行不能是edit 若有一个不满足循环结束
    // 当前行向上找, 满足分组条件，并且不能是edit（逆序查找，查找结束后，反转）
    // 将上下两部分数据加上本身行合并，生成满足条件的新数据 
    // 返回当前数组
    // 2.当前列未启用编辑，则按照原始处理

    //1 将当前数组集合的edit状态写入
    // state: 'new' 'edit',
    //console.log('xxxxxxxxx====>', feildName, new_data);
    new_data.forEach(row => {
        row['__state__'] = this.editCache[row['key']]['edit'];
    });

    //2 数组分割
    //2.1 计算出当前行所在
    let row_index = new_data.findIndex(d => d['key'] === row['key']);
    //2.2 计算出前数组
    let BeforeArr = new_data.slice(0, row_index).reverse();
    let OwnArr = new_data.slice(row_index, row_index + 1);
    let AftertArr = new_data.slice(row_index + 1);

   // console.log('xxxxxxxxx分割====>', row_index, BeforeArr, OwnArr, AftertArr);
    //2.2 计算出后数组
    // reverse() 反转

    let new_BeforeArr = [];
    let Before_index = 0;
    for (let i = 0; i < BeforeArr.length; i++) {
        // 序号不能断，状态不能断 
        if (Before_index === i && BeforeArr[i][feildName] === row[feildName]) {
            if (isSingleEdit) {
                if (BeforeArr[i]['__state__']) {
                    Before_index = -1;
                } else {
                    new_BeforeArr.push(BeforeArr[i]);
                    Before_index++;
                }

            } else {
                new_BeforeArr.push(BeforeArr[i]);
                Before_index++;
            }
        } else {
            break;
        }

    }

    let new_AftertArr = [];
    let Aftert_index = 0;
    for (let i = 0; i < AftertArr.length; i++) {
        // 序号不能断，状态不能断 
        if (Aftert_index === i && AftertArr[i][feildName] === row[feildName]) {
            if (isSingleEdit) {
                if (AftertArr[i]['__state__']) {
                    Aftert_index = -1;
                } else {
                    new_AftertArr.push(AftertArr[i]);
                    Aftert_index++;
                }

            } else {
                new_AftertArr.push(AftertArr[i]);
                Aftert_index++;
            }
        } else {
            break;
        }

    }

    if (isSingleEdit) {
        if (OwnArr[0]['__state__']) {
            new_BeforeArr = [];
            new_AftertArr = [];
        }

    }

    //3 合并数组，返回

    let back_data = [];
    back_data = [...new_BeforeArr.reverse(), ...OwnArr, ...new_AftertArr];

    return back_data;

}

}


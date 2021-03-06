import { ApiService } from './../../../core/utility/api-service';
import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Type,
    AfterViewInit,
    TemplateRef
} from '@angular/core';
import {
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES,
    BSN_OPERATION_LOG_TYPE,
    BSN_OPERATION_LOG_RESULT,
    BSN_COMPONENT_MODE
} from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
import { CacheService } from '@delon/cache';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { Observable, Observer, Subscription } from 'rxjs';
import { BeforeOperation } from '../before-operation.base';
import { TreeGridBase } from '../treegrid.base';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { BsnUploadComponent } from '../bsn-upload/bsn-upload.component';
import { BsnImportExcelComponent } from '../bsn-import-excel/bsn-import-excel.component';
const component: { [type: string]: Type<any> } = {
    layout: LayoutResolverComponent,
    form: FormResolverComponent,
    upload: BsnUploadComponent,
    importExcel: BsnImportExcelComponent
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
export class BsnAsyncTreeTableComponent extends TreeGridBase
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
    public dataList = [];
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

    // 过滤标识
    public searchCount = 0;

    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;

    // 下拉属性 liu
    public is_Selectgrid = true;
    public cascadeValue = {}; // 级联数据
    public selectGridValueName;
    public changeConfig_newSearch = {};

    public beforeOperation;
    constructor(
        private _api: ApiService,
        private _msg: NzMessageService,
        private _modal: NzModalService,
        private modalService: NzModalService,
        private _dropdownService: NzDropdownService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODE)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        private _router: ActivatedRoute
    ) {
        super();
        this.baseMessage = this._msg;
        this.baseModal = this._modal;
        this.cascadeBase = this.cascade;
        this.cfg = this.config;

        this.apiResource = this._api;

        this.operationCallback = (focusId?) => {
            // this.load();
            // const oldarray = focusId.split(',');
            // oldarray;
            // let addchildofparent;
            // let addchildrenIds;
            if (!focusId.data) {
                // this.finishAddTreeNode(focusId);
                // this.dataList.forEach(d => {
                //     if (d.row_status && d.row_status === 'adding' && d.parentId) {
                //         if (addchildrenIds) {
                //             addchildrenIds = addchildrenIds + d.Id + ',';
                //         } else {
                //             addchildrenIds = d.Id + ',';
                //         }
                //         if (addchildofparent) {
                //             addchildofparent = addchildofparent + d.parentId + ',';
                //         } else {
                //             addchildofparent = d.parentId + ',';
                //         }
                //         const childId = oldarray.indexOf(a => a.Id === d.Id)
                //         oldarray.splice(childId, 1);
                //     }
                // });
                // oldarray.forEach(e => {
                //     focusId = e + ','
                // });
                // focusId = focusId.substring(0, focusId.length - 1);
                // if (addchildrenIds) {
                //     addchildrenIds = addchildrenIds.substring(0, addchildrenIds.length - 1);
                //     addchildofparent = addchildofparent.substring(0, addchildofparent.length - 1);
                //     this.finishAddChild(addchildrenIds, addchildofparent);
                // }
                const editdata = focusId.length > 36 ? focusId.split(',') : focusId;
                // let addNumber = 0;
                if (editdata) {
                    if (typeof (editdata) === 'string') {
                        const array = editdata.split('_');
                        if (array[1] === 'edit') {
                            this.editCache[array[0]]['edit'] = false;
                            // } else if (array[1] === 'add') {
                            //     this.load();
                            //     this.finishAddTreeNode(array[0]);
                        } else {
                            this.load();
                        }
                    } else {
                        editdata.forEach(e => {
                            const array = e.split('_');
                            if (array[1] === 'edit') {
                                this.editCache[array[0]]['edit'] = false;
                                // } else if (array[1] === 'add') {
                                //     if (addNumber < 1) {
                                //         this.load();
                                //         this.finishAddTreeNode(array[0]);
                                //     }
                                //     addNumber += 1;
                            } else {
                                this.load();
                            }
                        });
                    }
                }
            } else {
                this.load();
            }
        }

        this.callback = focusId => {
            this._cancelSavedRow();
        };

        this.windowCallback = (reload?) => {
            if (this.selectedItem && !reload) {
                this.expandCurrentRow();
            } else {
                this.load();
            }

        }
    }

    // 生命周期事件
    public ngOnInit() {
        if (this.initData) {
            this.initValue = this.initData;
        }
        this.tempValue['moduleName'] = this._router.snapshot.params['name'] ? this._router.snapshot.params['name'] : '';
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
        // this._getContent();
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
            } else if (this.config.componentType.own === true) {
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
            cacheValue: this.cacheValue.getNone('userInfo')
                ? this.cacheValue.getNone('userInfo')
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
                                this.addNewRow();
                            break;
                        case BSN_COMPONENT_MODES.CREATE_CHILD:

                            this.beforeOperation.operationItemData = this.selectedItem;
                            !this.beforeOperation.beforeItemDataOperation(option) &&
                                this.addNewChildRow();
                            break;
                        case BSN_COMPONENT_MODES.EDIT:
                            // this.beforeOperation.operationItemData = [
                            //     // ...this.getAddedRows(),
                            //     // ...this.getEditedRows()

                            // ];
                            this.beforeOperation.operationItemsData = this.getCheckedItems();
                            !this.beforeOperation.beforeItemsDataOperation(option) &&
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
                            if (!this.selectedItem) {
                                this.beforeOperation.operationItemsData = this.getCheckedItems();
                                !this.beforeOperation.beforeItemsDataOperation(option) &&
                                    this.formDialog(option);
                            } else {
                                this.beforeOperation.operationItemData = this.selectedItem;
                                !this.beforeOperation.beforeItemDataOperation(option) &&
                                    this.formDialog(option);
                            }
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
                if (this.editCache && this.selectedItem && this.editCache.hasOwnProperty(this.selectedItem['Id']) && this.editCache[this.selectedItem['Id']]['edit']) {
                    return false;
                }
                // if (this.editCache && (this.editCache[this.selectedItem['Id']] === this.selectedItem['Id']) {

                //     return false;
                // }
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
                                    if (cascadeEvent._mode === mode) {
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

                                }
                            });
                        }
                    }
                );
            }

        }
    }

    // 加载数据
    private async load(type?) {
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
            // ...this.buildSearch(),
            ...this.buildRootSearch()
        };
        // console.log('datalist', this.dataList);
        // console.log('editcache', this.editCache);
        this.expandDataCache = {};
        // (async () => {
        if (params['_root.expand'] || params['_root.expand'] === false) {
            delete params['_root.parentId'];
            delete params['_root.expand'];
        }
        const loadData = await this.apiResource.get(url, params).toPromise();
        if (loadData && loadData.status === 200) {
            if (loadData.data && loadData.data.rows) {
                this.treeDataOrigin = loadData.data.rows;
                this.treeData = CommonTools.deepCopy(loadData.data.rows);
                this.treeData.map(row => {
                    this.setChildExpand(row, 0);
                });
                this.total = loadData.data.total;
                if (type) {
                    for (let i = 0; i < this.treeData.length;) {
                        if (this.treeData[i].parentId) {
                            const index = this.treeData.findIndex(t => t.Id === this.treeData[i].parentId);
                            if (index !== -1) {
                                this.treeData.splice(i, 1);
                            } else {
                                i += 1;
                            }
                        } else {
                            i += 1;
                        }
                        // this.treeData.forEach(e => {
                        //     if (this.treeData.findIndex(t => t.Id === e.parentId) !== -1) {
                        //         this.treeData.splice(this.treeData.findIndex(t => t.Id === e.Id), 1);
                        //     }
                        // });
                        // if (this.treeData[i].children.length === 0) {
                        //     this.treeData.splice(i, 1)
                        // }
                    }
                    this.treeData = this.treeData.filter(t => t.Id !== null);
                    // this.dataList = this.treeData;
                    // this.treeData.forEach(e => {
                    //     if ((!e['expand'] || e['expand'] === false)) {
                    //         e['expand'] = true;
                    //     }
                    // //    await this.expandChange(e.children, e, true);
                    //     if (e.children.length > 0) {
                    //        this.searchExpandChildren(e.children, e);
                    //     }
                    // });
                    for (let i = 0; i < this.treeData.length; i++) {
                        if ((!this.treeData[i]['expand'] || this.treeData[i]['expand'] === false)) {
                            this.treeData[i]['expand'] = true;
                        }
                        // this.expandChange(this.treeData[i].children, this.treeData[i], true);
                        if (this.treeData[i].children) {
                            if (this.treeData[i].children.length > 0) {
                                await this.searchExpandChildren(this.treeData[i].children, this.treeData[i]);
                            }
                        }
                    }
                    // this.treeData = this.treeData.filter(t => t.Id !== null);
                    this.treeData = JSON.parse(JSON.stringify(this.treeData));
                }
                this.dataList = this.treeData;
                if (this.is_Search) {
                    this.dataList = [this.search_Row, ...this.dataList];
                }
                // console.log(this.dataList);
                // if (this.editCache) {
                //     for (const x in this.editCache) {
                //         this.editCache[x].data.checked = false;
                //         this.editCache[x].data.selected = false;
                //         this.editCache[x].edit = false;
                //     }
                //     this.editCache = JSON.parse(JSON.stringify(this.editCache));
                // }
            }
            // this.dataList = loadData.data.rows;
            // if (this.is_Search) {
            //     this.createSearchRow();
            // }
        } else {
            this._updateEditCacheByLoad([]);
            this.dataList = loadData.data;
            this.total = 0;
            if (this.is_Search) {
                this.createSearchRow();
            }
            this.emptyLoad();
        }
        // liu
        if (!this.is_Selectgrid) {
            this.setSelectRow();
        }
        this.loading = false;
        //  })();
    }

    private async searchExpandChildren(children, parent) {
        if (!parent['expand'] || parent['expand'] === false) {
            parent['expand'] = true;
        }
        if (!parent['parent']) {
            parent['parent'] = { 'expand': true };
        }
        this.expandChange(children, parent, true);
        children.forEach(e => {
            if (!e.level) {
                e.level = parent.level + 1;
            }
            if (e.children && e.children.length > 0) {
                this.searchExpandChildren(e.children, e);
            }

        })
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

    public expandCurrentRow() {
        if (this.selectedItem) {
            const children = this.selectedItem['children'] ? this.selectedItem['children'] : null;
            this.expandChange(children, this.selectedItem, true);
        }

    }

    public async expandChange(childrenData, data: any, $event: boolean) {
        // console.log(this.dataList);
        // this.loading = true;
        if ($event === true) {
            const response = await this.expandLoad(data);
            if (response.isSuccess && response.data.length > 0) {
                response.data.forEach(d => {
                    this.setChildExpand(d, data['level'] + 1);
                });
                // childrenData = data;
                this.insertChildrenListToTree(data, response.data);
            }
            // this.loading = false;
        } else {
            if (childrenData) {
                childrenData.forEach(d => {
                    const target = this.dataList.find(t => t.Id === d.Id);
                    if (target && target.parent) {
                        target.parent.expand = false;
                    }
                    if (target && target.children) {
                        this.expandChange(target.children, target, false)
                    }

                })
            }
            // this.loading = false;
        }
    }

    private setChildExpand(data, level) {
        data['parent'] = {};
        data['parent']['expand'] = true;
        data['level'] = level;
        data['key'] = data['Id'];
        // data['edit'] = false;
        // 将当前行数据添加到编辑缓存对象当中
        this.editCache[data['key']] = { edit: false, data: data };
    }

    private insertChildrenListToTree(parent, childrenList) {
        // *重写当前节点的子节点数据,保证折叠之后数据完整性
        parent['children'] = childrenList;
        const index = this.dataList.findIndex(d => d.Id === parent.Id);
        // 删除重复添加的子节点数据
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            childrenList.forEach(child => {
                if (this.dataList[i].Id === child.Id) {
                    this.dataList.splice(i, 1);
                    i--;
                    len--;
                }
            });
        }
        // 更新数据集之前的数据状态
        // if (this.dataList[index] !== parent) {
        //     this.dataList.splice(index , 1, ...parent);
        // }
        this.dataList.splice(index + 1, 0, ...childrenList);
        this.dataList = JSON.parse(JSON.stringify(this.dataList));
    }

    private expandLoad(parentData) {
        const url = this.buildURL(this.config.ajaxConfig.url);
        const params = this.buildParameters(this.config.ajaxConfig.childrenParams, parentData);
        const searchparams = this.buildRootSearch();
        if (searchparams) {
            delete searchparams['_root.expand'];
            this.searchCount = this.searchCount + 1;
            // console.log(this.searchCount);
            if (this.searchCount) {
                return this.apiResource.get(url, { ...params, ...this.buildRecursive(), ...searchparams }).toPromise();
            } else {
                return this.apiResource.get(url, { ...params, ...this.buildRecursive() }).toPromise();
            }
        } else {
            return this.apiResource.get(url, { ...params, ...this.buildRecursive() }).toPromise();
        }
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

        if ($event.srcElement.className === 'ant-table-row-expand-icon ng-star-inserted ant-table-row-collapsed') {
            return;
        }
        if (
            $event.srcElement.type === 'checkbox' ||
            $event.target.type === 'checkbox'
        ) {
            return;
        }
        $event.stopPropagation();

        this.dataList.map(t => {
            t['selected'] = false;
            if (this.editCache[t.key].edit) {

            } else {
                t['checked'] = false;
            }
        });
        // this.treeData.forEach(t => t['selected'] = false);
        data['selected'] = true;
        if (this.editCache[data.key].edit) {
            // if (data['row_status'] === 'updating' || data['row_status'] === 'adding') {
            data['selected'] = true;
            data['checked'] = true;
            // }
        } else {
            if (data['checked']) {
                data['checked'] = false;
            } else {
                data['checked'] = true;
            }
        }
        if (this.dataList.length > 0)
            this.refChecked();

        this.selectedItem = data;
        // liu  子组件
        if (!this.is_Selectgrid) {
            this.value = this.selectedItem[
                this.config.selectGridValueName
                    ? this.config.selectGridValueName
                    : 'Id'
            ];
        }
        // this.selectedItem.expand = true;
        if (data['expand'] === true) {
            data['expand'] = false;
            this.expandChange(data.children, data, false);
        } else {
            data['expand'] = true;
            this.expandChange(data.children, data, true);
        }
    }

    /**
     * 创建新行数据
     */
    public createNewRowData(parentId?) {
        const newRow = { ...this.rowContent };
        const newRowId = CommonTools.uuID(32);
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
        this.editCache[newRow['Id']] = { edit: true, data: newRow };
        // this.dataList.splice(0, 0, newRow);
        this.dataList = [newRow, ...this.dataList];
        this.treeDataOrigin.push(newRow);
        if (!this.changeConfig_new[newRow['key']]) {
            this.changeConfig_new[newRow['key']] = {};
        }
        this.dataList = this.dataList.filter(d => d.key !== null);
        // console.log('addNewRow:', this.dataList);
        return newRow;
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
            newRow['level'] = this.selectedItem.level ? this.selectedItem + 1 : 1;
            this.editCache[newRow['Id']] = { edit: true, data: newRow };
            // 数据添加到具体选中行的下方
            this.dataList = this._setChildRow(newRow, parentId);
            if (!this.changeConfig_new[newRow['key']]) {
                this.changeConfig_new[newRow['key']] = {};
            }
            this.dataList = this.dataList.filter(d => d.key !== null);
        } else {
            // console.log('未选择任何行,无法添加下级');
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

    private _cancelSavedRow() {
        const cancelRowMap = this._getCheckedRowStatusMap();
        for (let i = 0, len = this.dataList.length; i < len; i++) {
            const key = this.dataList[i].key;
            const checkedRow = cancelRowMap.get(key);
            if (checkedRow) {
                delete this.dataList[i]['row_status'];
                this._cancelEdit(key);
            }

        }
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
                // this.dataList.filter(e => e.Id !== key);
                i--;
                len--;
            } else if (
                checkedRowStatus &&
                checkedRowStatus.status === 'updating'
            ) {
                this._cancelEdit(key);
            } else {
                this._cancelEdit(key);
            }
        }
        // console.log(this.dataList);
        this.dataList = JSON.parse(JSON.stringify(this.dataList));
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
                            : ''
                    });
                }
            })
        return cancelRowMap;
    }

    private _editRowData() {
        const checkedRowStatusMap = this._getCheckedRowStatusMap();
        checkedRowStatusMap.forEach(item => {
            if (item.status === 'updating' || item.status === '') {
                item.status = 'updating';
                this._startRowEdit(item.key);
            }
        });
        return true;
    }

    private _cancelEdit(key: string): void {
        let itemList = this.treeDataOrigin;
        // 检查当前原始列表中是否存在编辑对象(不包含子节点集合)
        const index = itemList.findIndex(item => item.Id === key);
        let childIndex;
        if (index === -1) {
            // 如果不存在,检查当前列表中是否存在编辑对象(包含所有子节点集合)
            itemList = this.treeData;
            childIndex = this.treeData.findIndex(item => item.Id === key);
            // 包含子节点对象,则将编辑状态进行取消, 并重新绑定之前数据
            if (childIndex && childIndex !== -1) {
                this.editCache[key].data = JSON.parse(JSON.stringify(itemList[childIndex]));
            }
        }
        this.editCache[key].edit = false;


    }

    public checkAll(value) {
        this.dataList.forEach(d => {
            d.checked = value;
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
        // if (this.config.checked) {
        //     this._getCheckItemsId();
        // }
        // this.tempValue['_checkedIds'];
    }

    // private sendCheckedRowData() {
    //     const checkedIds = this._getCheckItemsId();
    //     this.cascade.next(
    //         new BsnComponentMessage(
    //             BSN_COMPONENT_CASCADE_MODES['REFRESH_BY_IDS'],
    //             this.config.viewId,
    //             {
    //                 data: checkedIds
    //             }
    //         )
    //     );
    // }

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
        this.tempValue['checkedIds'] = serverData.join(',');
        return serverData.join(',');
    }

    private _getAddedAndUpdatingRows() {
        const checkedRows = this._getCheckedRowStatusMap();
        this.addedTreeRows = [];
        this.editTreeRows = [];
        checkedRows.forEach(item => {
            if (item.status === 'adding') {
                this.addedTreeRows.push(this.editCache[item.key].data);
            } else if (item.status === 'updating' || item.status === '') {
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
        const desc = deleteConfig.description ? deleteConfig.description : '删除数据,';
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
                        eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                        funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                        description: `${desc} [操作失败] ID为: ${response.message}`
                    }).subscribe(result => {

                    })
                }
            }
            if (isSuccess) {
                //
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
            } else if (item.checked && item['row_status'] === 'updating' && item['row_status'] === '') {
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
        const desc = postConfig.description ? postConfig.description : '执行操作,';
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
                    // 操作日志
                    this.apiResource.addOperationLog({
                        eventId: BSN_OPERATION_LOG_TYPE.SAVE,
                        eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                        funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                        description: `${desc} [执行成功] 数据为: ${JSON.stringify(response['data'])}`
                    }).subscribe(result => { });
                } else {
                    // 操作日志
                    this.baseMessage.create('error', response.message);
                    this.apiResource.addOperationLog({
                        eventId: BSN_OPERATION_LOG_TYPE.SAVE,
                        eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
                        funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
                        description: `${desc} [执行失败] 数据为:${response.message}`
                    }).subscribe(result => { });
                }
            }
            if (isSuccess) {
                rowsData.forEach(d => {
                    d['row_status'] = '';
                });
                // rowsData.map(row => {
                //     this._saveEdit(row.key);
                // });
                // this.load();
                // 取消编辑状态
                this._cancelEditRows();
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
                    const postConfig = bar.group[index].ajaxConfig;
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
                        bar.dropdown.buttons[index].ajaxConfig;
                    result = this._execute(rowsData, method, postConfig);
                }
            }
        });

        return result;
    }
    /**------------------------------------------------------------------------------ */






    // 获取 文本值，当前选中行数据
    public async loadByselect(ajaxConfig, componentValue?, selecttempValue?, cascadeValue?) {
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
        return selectrowdata;
    }

    // 构建获取文本值参数
    private _buildParametersByselect(paramsConfig, componentValue?, selecttempValue?, cascadeValue?) {
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

    private async post(url, body) {
        return this.apiResource.post(url, body).toPromise();
    }

    private async put(url, body) {
        return this.apiResource.put(url, body).toPromise();
    }

    private async delete(url, params) {
        return this.apiResource.delete(url, params).toPromise();
    }

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
            // // 执行行查询
            // this.load(); // 查询后将页面置1
            // // 执行行查询
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
            this._startRowEdit(this.search_Row['key'].toString());
        } else {
            const newSearchContent = JSON.parse(
                JSON.stringify(this.rowContent)
            );
            const fieldIdentity = CommonTools.uuID(32);
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
            this.searchCount = 0;
        }

        // for (let i = 0, len = this.dataList.length; i < len; i++) {
        //     if (this.dataList[i]['row_status'] === 'search') {
        //         this.dataList.splice(
        //             this.dataList.indexOf(this.dataList[i]),
        //             1
        //         );
        //         i--;
        //         len--;
        //     }
        // }

        this.is_Search = false;
        this.search_Row = {};
        this.dataList = JSON.parse(JSON.stringify(this.dataList));
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
        if (data.data) {
            this.editCache[data.key].data[data.name] = JSON.parse(
                JSON.stringify(this.editCache[data.key].data[data.name])
            );
        }
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
    }

    public valueChangeSearch(data) {
        // const index = this.dataList.findIndex(item => item.key === data.key);
        if (data.data === null || data.data === '') {
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
        this.load('change');
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
        const checkdata = this._getCheckItemsId();
        this.tempValue['checkedIds'] = checkdata;
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

    public _isArray(a) {
        return (Object.prototype.toString.call(a) === '[object Array]');
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

    // 更新真实数据
    private _updateEditCacheByLoad(dataList) {
        this.editCache = {};
        // 按照行主键划分每行的组件
        // 根据配置构建编辑组的配置表单组件
        // 处理每组表单内部的交互
        dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: JSON.parse(JSON.stringify(item))
                };
            }
        });
    }

    // 空数据读取
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
     * 处理URL格式
     * @param url
     * @returns {boolean}
     * @private
     */
    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === '[object String]';
    }

    // excel导出
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
            ...this.buildParameters(this.config.ajaxConfig.exportParams),
            ...this.buildFilter(this.config.ajaxConfig.filter),
            ...this.buildSort(),
            ...this.buildColumnFilter(),
            ...this.buildSearch()
        };

        const loadData = await this._load(url, params);
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
                }));
                if (d.children.length > 0) {
                    let j = 0;
                    for (const aa of d['children']) {
                        j++;
                        data.push(col.map(c => {
                            if (c.hidden) { } else {
                                if (c.field === '_serilize') {
                                    return j.toString();
                                } else {
                                    return aa[c.field as string];
                                }
                            }
                        }));
                    }
                }
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

    private saveAsExcelFile(buffer: any, fileName: string) {
        const data: Blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
        // 如果写成.xlsx,可能不能打开下载的文件，这可能与Excel版本有关
    }

    // 在拿到新增的行之后，完成相关状态和数据的组装替换
    private async finishAddTreeNode(returnId) {
        this.loading = true;
        this.allChecked = false;
        this.checkedCount = 0;
        const urlarray = this.config.ajaxConfig.url.split('/')
        const url = this.buildURL(urlarray[0] + '/' + urlarray[1]);
        // const params = {
        //     ...this.buildParameters(this.config.ajaxConfig.params),
        //     ...this.buildPaging(this.config.pagination),
        //     ...this.buildFilter(this.config.ajaxConfig.filter),
        //     ...this.buildSort(),
        //     ...this.buildColumnFilter(),
        //     ...this.buildFocusId(),
        //     ...this.buildRecursive(),
        //     ...this.buildSearch()
        // };
        const params = { 'Id': returnId };
        // console.log('datalist', this.dataList);
        // console.log('editcache', this.editCache);
        this.expandDataCache = {};
        const loadData = await this.apiResource.get(url, params).toPromise();
        if (loadData && loadData.status === 200) {
            // if (loadData.data && loadData.data.rows) {
            //     this.treeDataOrigin = loadData.data.rows;
            //     this.treeData = CommonTools.deepCopy(loadData.data.rows);
            //     this.treeData.map(row => {
            //         this.setChildExpand(row, 0);
            //     });
            if (loadData.data) {
                this.treeDataOrigin = loadData.data;
                if (this.treeDataOrigin.findIndex(t => t.Id === returnId) !== -1) {
                    this.dataList.forEach(d => {
                        if (d.Id === returnId) {
                            const index = this.dataList.findIndex(e => e.Id === returnId);
                            const stateData = this.dataList.find(e => e.Id === returnId);
                            // console.log('stateData', stateData);
                            this.dataList.splice(index, 1, this.treeDataOrigin.find(t => t.Id === returnId));
                            this.dataList[index]['checked'] = true;
                            if (!this.dataList[index]['key']) {
                                this.dataList[index]['key'] = this.dataList[index]['Id'];
                            }
                            this.dataList[index]['children'] = [];
                            this.dataList[index]['level'] = stateData['level'];
                            this.dataList[index]['parent'] = { 'expand': true };
                            this.dataList[index]['selected'] = stateData['selected'];
                            const parentindex = this.dataList.findIndex(e => e.Id === this.dataList[index]['parentId']);
                            if (this.dataList[index]['parentId']) {
                                if (!this.dataList[parentindex]['expand']) {
                                    this.dataList[parentindex]['expand'] = true;
                                }
                                this.dataList[parentindex]['children'].splice(0, 0, this.dataList[index]);
                            }
                        }
                    })
                }
                // console.log(this.dataList);
                this.dataList = this.dataList.filter(a => a.Id !== null);
                if (this.editCache[returnId]) {
                    this.editCache[returnId]['data'] = loadData.data.find(t => t.Id === returnId);
                    this.editCache[returnId]['edit'] = false;
                }
                // delete this.editCache[returnId];
                this.total = loadData.data.total;
                this.loading = false;
                // // 对之前操作过的缓存数据进行状态处理
                // let deleteCacheIds;
                // this.dataList.forEach(e => {
                //     const idx = this.treeData.findIndex(t => t.Id === e.Id)
                //     if (idx === -1) {
                //         if (deleteCacheIds) {
                //             deleteCacheIds = deleteCacheIds + e.Id + ',';
                //         } else {
                //             deleteCacheIds = e.Id + ',';
                //         }
                //     }
                // });
                // deleteCacheIds = deleteCacheIds.substring(0, deleteCacheIds.length - 1);
                // const array = deleteCacheIds.split(',');
                // array.forEach(a => {
                //     delete this.editCache[a];
                // });

                // // 对之前操作过的数据进行状态处理
                // let checkeddataIds;
                // this.treeData.forEach(r => {
                //     const idx = this.dataList.findIndex(d => d.Id === r.Id)
                //     if (idx === -1) {
                //         if (checkeddataIds) {
                //             checkeddataIds = checkeddataIds + r.Id + ',';
                //         } else {
                //             checkeddataIds = r.Id + ',';
                //         }
                //     }
                // });
                // checkeddataIds = checkeddataIds.substring(0, checkeddataIds.length - 1);
                // const checkedarray = checkeddataIds.split(',');
                // this.dataList = this.treeData;
                // if (checkedarray.length === 1) {
                //     checkedarray.forEach(a => {
                //         this.dataList.forEach(e => {
                //             if (e.Id === a) {
                //                 e['checked'] = true;
                //                 e['selected'] = true;
                //             }
                //         })
                //     });
                // } else {
                //     checkedarray.forEach(a => {
                //         this.dataList.forEach(e => {
                //             if (e.Id === a) {
                //                 e['checked'] = true;
                //             }
                //         })
                //     });
                // }
                // this.loading = false;
            }
        }
    }

    private async finishAddChild(childIds, parentIds) {
        if (childIds.length > 32) {

        } else {
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
            // console.log('datalist', this.dataList);
            // console.log('editcache', this.editCache);
            this.expandDataCache = {};
            if (!params['_root.parentId']) {
                params['_root.parentId'] = parentIds
            }
            if (!params['_sort']) {
                params['_sort'] = 'createDate asc'
            }
            let currentRoot;
            const loadData = await this.apiResource.get(url, params).toPromise();
            if (loadData && loadData.status === 200) {
                if (loadData.data && loadData.data.rows) {
                    this.treeDataOrigin = loadData.data.rows;
                    this.treeData = CommonTools.deepCopy(loadData.data.rows);
                    this.treeData.map(row => {
                        this.setChildExpand(row, 0);
                    });
                    // this.total = loadData.data.total;
                    this.editCache;
                    let deleteCacheIds;
                    this.dataList.forEach(e => {
                        if (e.parentId === parentIds) {
                            const idx = this.treeData.findIndex(t => t.Id === e.Id)
                            if (idx === -1) {
                                if (deleteCacheIds) {
                                    deleteCacheIds = deleteCacheIds + e.Id + ',';
                                } else {
                                    deleteCacheIds = e.Id + ',';
                                }
                            }
                        }
                        if (e.Id === parentIds) {
                            currentRoot = e;
                        }
                    });
                    this.dataList;
                    deleteCacheIds = deleteCacheIds.substring(0, deleteCacheIds.length - 1);
                    const array = deleteCacheIds.split(',');
                    array.forEach(a => {
                        delete this.editCache[a];
                    });
                    this.dataList.forEach(d => {
                        if (d.Id === parentIds) {
                            d.children = loadData.data.rows;
                        }
                    })
                    this.loading = false;
                    this.dataList = this.dataList.filter(a => a['row_status'] !== 'adding');
                    if (!currentRoot['expand']) {
                        currentRoot['expand'] = true;
                    }
                    this.expandChange(loadData.data.rows, currentRoot, true);
                    const expandParent = [];
                    this.dataList.forEach(a => {
                        let parent;
                        if (a.parentId) {
                            const idx = expandParent.findIndex(d => d === a.parentId);
                            if (idx === -1) {
                                parent = this.dataList.find(d => d.Id === a.parentId);
                                if (!parent['expand']) {
                                    parent['expand'] = true;
                                }
                                if (parent !== currentRoot) {
                                    this.expandChange(parent.children, parent, true);
                                }
                                expandParent.push(parent.Id);
                            }
                        }
                    });
                }
            }
        }
    }

    /**
   * 导入数据
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
}

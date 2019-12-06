import { TreeNodeInterface } from 'app/routes/cn-test/list/list.component';
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
  BSN_COMPONENT_MODES,
  BSN_OPERATION_LOG_TYPE,
  BSN_OPERATION_LOG_RESULT
} from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
import { CacheService } from '@delon/cache';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable, Observer, Subscription } from 'rxjs';
import { BeforeOperation } from '../before-operation.base';
import { TreeGridBase } from '../treegrid.base';
import { ActivatedRoute } from '@angular/router';
const component: { [type: string]: Type<any> } = {
  layout: LayoutResolverComponent,
  form: FormResolverComponent
};

@Component({
  selector: 'bsn-new-tree-table',
  templateUrl: './bsn-new-tree-table.component.html',
  styleUrls: ['./bsn-new-tree-table.component.less']
})
export class BsnNewTreeTableComponent extends TreeGridBase
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
  // 成树需要的属性
  public KEY_ID: string;
  public PARENT_ID: string;
  public mapOfDataExpanded: { [key: string]: any[] } = {};
  public ROWS_ADDED: any[] = [];
  public ROWS_EDITED: any[] = [];
  public ROW_SELECTED: any;
  public ROWS_CHECKED: any[] = [];
  public checkedNumber = 0;
  public checkedId;
  // 数据结构
  public mapOfDataState: {
    [key: string]: {
      disabled: boolean,
      checked: boolean,
      selected: boolean,
      state: string,
      data: any,
      originData: any,
      parent?: any,
      children?: any[]
    }
  } = {};

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
    private cascadeEvents: Observable<BsnComponentMessage>,
    private _router: ActivatedRoute
  ) {
    super();
    this.baseMessage = this._msg;
    this.baseModal = this._modal;
    this.cascadeBase = this.cascade;
    this.cfg = this.config;
    this.cacheValue = this._cacheService;
    this.apiResource = this._api;

    this.operationCallback = focusId => {
      if (!focusId.data) {
        const oprationData = focusId.length > 39 ? focusId.split(',') : focusId;
        const editData = [];
        const addData = [];
        const deleteData = [];
        if (oprationData) {
          if (typeof (oprationData) === 'string') {
            const array = oprationData.split('_');
            if (array[1] === 'add') {
              this.changeAddedRowsToText(array[0]);
            } else if (array[1] === 'edit') {
              this.changeEditedRowsToText(array[0]);
            } else if (array[1] === 'delete') {
              deleteData.push({ Id: array[0] });
              this.deleteCheckedRows(deleteData);
            }
          } else {
            oprationData.forEach(e => {
              const array = e.split('_');
              if (array[1] === 'add') {
                addData.push(array[0]);
              } else if (array[1] === 'edit') {
                editData.push(array[0]);
              } else if (array[1] === 'delete') {
                deleteData.push({ Id: array[0] });
              }
            });
            if (addData.length > 0) {
              const add = this.getCheckedIds(addData);
              this.changeAddedRowsToText(add);
            }
            if (editData.length > 0) {
              const edit = this.getCheckedIds(editData);
              this.changeEditedRowsToText(edit);
            }
            if (deleteData.length > 0) {
              const deletedata = this.getCheckedIds(deleteData);
              this.deleteCheckedRows(deletedata);
            }
          }
        }
      } else {
        if (focusId.isSuccess && focusId.status === 200) {
          if (focusId.data.Ids) {
            this.afterProcedure(focusId.data.Ids);
          } else {
            const state = focusId.data.Message.split(':')
            if (state[0] === 'success') {
              this.load();
            }
          }
        } else { }
      }
    }

    this.callback = focusId => {
      // this._cancelSavedRow();
    };

    this.windowCallback = (focusId?, reload?) => {
      if (!focusId.data && focusId !== 'close') {
        const oprationData = focusId.length > 39 ? focusId.split(',') : focusId;
        const editData = [];
        const addData = [];
        const deleteData = [];
        if (oprationData) {
          if (typeof (oprationData) === 'string') {
            const array = oprationData.split('_');
            if (array[1] === 'add') {
              this.addRowFromForm(array[0]);
            } else if (array[1] === 'edit') {
              this.editRowFromForm(array[0]);
            } else if (array[1] === 'delete') {
              deleteData.push({ Id: array[0] });
              this.deleteCheckedRows(deleteData);
            }
          } else {
            oprationData.forEach(e => {
              const array = e.split('_');
              if (array[1] === 'add') {
                addData.push(array[0]);
              } else if (array[1] === 'edit') {
                editData.push(array[0]);
              } else if (array[1] === 'delete') {
                deleteData.push({ Id: array[0] });
              }
            });
            if (addData.length > 0) {
              const add = this.getCheckedIds(addData);
              this.addRowFromForm(add);
            }
            if (editData.length > 0) {
              const edit = this.getCheckedIds(editData);
              this.editRowFromForm(edit);
            }
            if (deleteData.length > 0) {
              this.deleteCheckedRows(editData);
            }
          }
        }
      } else if (focusId.data) {
        if (focusId.isSuccess && focusId.status === 200) {
          const state = focusId.data.Message.split(':')
          if (state[0] === 'success') {
            this.load();
          }
        } else { }
      } else if (focusId === 'close') {
      }
    }
  }
  public ngOnInit(): void {
    this.cfg = this.config;
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'id';
    this.PARENT_ID = 'parentId';
    // 解析及联配置
    this.resolverRelation();
    this.load();
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
                this.addRootRow();
              break;
            case BSN_COMPONENT_MODES.CREATE_CHILD:
              this.beforeOperation.operationItemData = this.selectedItem;
              !this.beforeOperation.beforeItemDataOperation(option) &&
                this.addChildRow();
              break;
            case BSN_COMPONENT_MODES.EDIT:
              // this.beforeOperation.operationItemData = [
              //     // ...this.getAddedRows(),
              //     // ...this.getEditedRows()

              // ];
              this.beforeOperation.operationItemsData = this.getNewCheckedItems(this.mapOfDataExpanded);
              !this.beforeOperation.beforeItemsDataOperation(option) &&
                this.editRows(this.getNewCheckedItems(this.mapOfDataExpanded));
              break;
            case BSN_COMPONENT_MODES.CANCEL:
              this._cancelEditRows();
              break;
            // case BSN_COMPONENT_MODES.SAVE:
            //     !this.beforeOperation.beforeItemDataOperation(option) &&
            //         this.saveRow();
            //     break;
            // case BSN_COMPONENT_MODES.DELETE:
            //   this.beforeOperation.operationItemsData = this.getNewCheckedItems(this.mapOfDataExpanded);
            //   if (!this.beforeOperation.beforeItemsDataOperation(
            //     option
            //   )) {
            //     this.newResolver(option, this.ROWS_ADDED, this.ROWS_EDITED, this.ROWS_CHECKED, this.ROW_SELECTED);
            //   }
            //   break;
            // case BSN_COMPONENT_MODES.DIALOG:
            //     this.beforeOperation.operationItemData = this.selectedItem;
            //     !this.beforeOperation.beforeItemDataOperation(option) &&
            //         this.dialog(option);
            //     break;
            case BSN_COMPONENT_MODES.EXECUTE:
              // this._getAddedAndUpdatingRows();
              this.newResolver(option, this.ROWS_ADDED, this.ROWS_EDITED, this.ROWS_CHECKED, this.ROW_SELECTED, this.mapOfDataExpanded);
              break;
            // case BSN_COMPONENT_MODES.EXECUTE_SELECTED:
            //     this.beforeOperation.operationItemData = this.selectedItem;
            //     !this.beforeOperation.beforeItemDataOperation(option) &&
            //         this.executeSelectedRow(option);
            //     break;
            // case BSN_COMPONENT_MODES.EXECUTE_CHECKED:
            //     this.beforeOperation.operationItemsData = this.getCheckedItems();
            //     !this.beforeOperation.beforeItemsDataOperation(
            //         option
            //     ) && this.executeCheckedRow(option);
            //     break;
            case BSN_COMPONENT_MODES.WINDOW:
              this.beforeOperation.operationItemData = this.selectedItem;
              !this.beforeOperation.beforeItemDataOperation(option) &&
                this.windowDialog(option, this.ROW_SELECTED, this.ROWS_CHECKED);
              break;
            case BSN_COMPONENT_MODES.FORM:
              // if (!this.ROW_SELECTED) {
              //     this.beforeOperation.operationItemsData = this.getNewCheckedItems();
              //     !this.beforeOperation.beforeItemsDataOperation(option) &&
              //         this.formDialog(option, this.ROWS_CHECKED);
              // } else {
              this.beforeOperation.operationItemData = this.ROW_SELECTED;
              !this.beforeOperation.beforeItemDataOperation(option) &&
                this.formDialog(option, this.ROW_SELECTED);
              // }
              break;
            // case BSN_COMPONENT_MODES.SEARCH:
            //     this.searchRow(option);
            //     break;
            // case BSN_COMPONENT_MODES.UPLOAD:
            //     this.beforeOperation.operationItemData = this.selectedItem;
            //     !this.beforeOperation.beforeItemDataOperation(option) &&
            //         this.uploadDialog(option);
            //     break;
            case BSN_COMPONENT_MODES.FORM_BATCH:
              this.checkedId = this.getCheckedIds(this.ROWS_CHECKED);
              this.beforeOperation.operationItemsData = this.ROWS_CHECKED;
              !this.beforeOperation.beforeItemsDataOperation(option) &&
                this.formBatchDialog(option, this.ROWS_CHECKED);
              break;
            // case BSN_COMPONENT_MODES.EXPORT:
            //     this.exportExcel(option);
            //     break;
          }
        }
      });
    }

    // // 通过配置中的组件关系类型设置对应的事件接受者
    // // 表格内部状态触发接收器
    // if (
    //     this.config.componentType &&
    //     this.config.componentType.parent === true
    // ) {
    //     // 注册消息发送方法
    //     // 注册行选中事件发送消息
    //     this.after(this, 'selectRow', () => {
    //         // 编辑行数据时,不进行消息发送
    //         if (this.editCache && this.selectedItem && this.editCache.hasOwnProperty(this.selectedItem['Id']) && this.editCache[this.selectedItem['Id']]['edit']) {
    //             return false;
    //         }
    //         // if (this.editCache && (this.editCache[this.selectedItem['Id']] === this.selectedItem['Id']) {

    //         //     return false;
    //         // }
    //         this.cascade.next(
    //             new BsnComponentMessage(
    //                 BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
    //                 this.config.viewId,
    //                 {
    //                     data: this.selectedItem
    //                 }
    //             )
    //         );
    //     });
    // }
    // if (
    //     this.config.componentType &&
    //     this.config.componentType.child === true
    // ) {
    //     if (!this._cascadeSubscription) {
    //         this._cascadeSubscription = this.cascadeEvents.subscribe(
    //             cascadeEvent => {
    //                 // 解析子表消息配置
    //                 if (
    //                     this.config.relations &&
    //                     this.config.relations.length > 0
    //                 ) {
    //                     this.config.relations.forEach(relation => {
    //                         if (
    //                             relation.relationViewId === cascadeEvent._viewId
    //                         ) {
    //                             // 获取当前设置的级联的模式
    //                             const mode =
    //                                 BSN_COMPONENT_CASCADE_MODES[
    //                                 relation.cascadeMode
    //                                 ];
    //                             // 获取传递的消息数据
    //                             const option = cascadeEvent.option;
    //                             // 解析参数
    //                             if (
    //                                 relation.params &&
    //                                 relation.params.length > 0
    //                             ) {
    //                                 relation.params.forEach(param => {
    //                                     this.tempValue[param['cid']] =
    //                                         option.data[param['pid']];
    //                                 });
    //                             }
    //                             if (cascadeEvent._mode === mode) {
    //                                 // 匹配及联模式
    //                                 switch (mode) {
    //                                     case BSN_COMPONENT_CASCADE_MODES.REFRESH:
    //                                         this.load();
    //                                         break;
    //                                     case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
    //                                         this.load();
    //                                         break;
    //                                     case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
    //                                         break;
    //                                     case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
    //                                         break;
    //                                 }
    //                             }

    //                         }
    //                     });
    //                 }
    //             }
    //         );
    //     }

    // }
  }

  public async load() {
    this.loading = true;
    const response = await this._getAsyncData(this.config.ajaxConfig);
    if (response && response.data && response.data.rows) {
      response.data.rows.map((d, index) => {

        this.mapOfDataState[d[this.KEY_ID]] = {
          disabled: false,
          checked: false, // index === 0 ? true : false,
          selected: false, // index === 0 ? true : false,
          state: 'text',
          data: d,
          originData: { ...d }
        };

        this.mapOfDataExpanded[d[this.KEY_ID]] = this._convertTreeToList(d);
        // const dsa = this._convertTreeToList(d);

        // this.mapOfDataState[d[this.KEY_ID]].children = this._convertTreeToList(d);

        index === 0 && (this.ROW_SELECTED = d);
      });
      this.dataList = response.data.rows;
      this.total = response.data.total;
      // 更新
      // this.dataCheckedStatusChange();
      // 默认设置选中第一行, 初始数据的选中状态和选中数据,均通过setSelectRow方法内实现
      this.setSelectRow(this.ROW_SELECTED);
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  private async _getAsyncData(ajaxConfig = null, nodeValue = null, isPaging = true) {
    let params = CommonTools.parametersResolver({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      item: nodeValue
    });

    if (isPaging) {
      params = { ...params, ...this._buildPaging(), ...this.buildRecursive() };
    }

    const ajaxData = await this.apiResource
      .get(
        ajaxConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  private async _getAsyncChildrenData(ajaxConfig = null, nodeValue = null, isPaging = true) {
    let params = CommonTools.parametersResolver({
      params: ajaxConfig.childrenParams,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      item: nodeValue
    });

    if (isPaging) {
      params = { ...params, ...this._buildPaging(), ...this.buildRecursive() };
    }
    const ajaxData = await this.apiResource
      .get(
        ajaxConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  private _convertTreeToList(_root: any, _level = 0): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hasMap = {};
    stack.push(
      {
        level: _level,
        expand: false,
        disabled: false,
        checked: false, // index === 0 ? true : false,
        selected: false, // index === 0 ? true : false,
        state: 'text',
        data: _root,
        originData: { ..._root },
        children: [],
        isNewRow: false
      });

    while (stack.length !== 0) {
      const node = stack.pop();
      this._visitNode(node, hasMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(
            {
              level: node.level + 1,
              expand: false,
              parent: node,
              disabled: false,
              checked: false, // index === 0 ? true : false,
              selected: false, // index === 0 ? true : false,
              state: 'text',
              data: node.children[i],
              originData: { ...node.children[i] }
            })
        }
      }
    }

    return array;
  }

  private _visitNode(node, hasMap: { [key: string]: any }, array: any[]) {
    if (!hasMap[node[this.KEY_ID]]) {
      hasMap[node[this.KEY_ID]] = true;
      array.push(node);
    }
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

  public setSelectRow(rowData?, $event?) {
    if (!rowData) {
      return false;
    }
    if ($event) {
      const src = $event.srcElement || $event.target;
      if (src.type !== undefined) {
        return false;
      }
      $event.stopPropagation();
      $event.preventDefault();
    }

    this.ROW_SELECTED = rowData;

    // 选中当前行
    this.dataList.map(row => {
      this.mapOfDataExpanded[row[this.KEY_ID]].map(mItem => {
        mItem['selected'] = false;
      })
    });

    this.mapOfDataExpanded[rowData[this.KEY_ID]].map(mItem => {
      if (mItem.data[this.KEY_ID] === rowData[this.KEY_ID]) {
        mItem['selected'] = true;
        mItem['expand'] = !mItem['expand'];
        this.expandRow(mItem, mItem['expand']);
      }
    });

    // this.mapOfDataExpanded[rowData[this.KEY_ID]]['selected'] = true;

    // 勾选/取消当前行勾选状态
    this.mapOfDataExpanded[rowData[this.KEY_ID]]['checked'] = !this.mapOfDataExpanded[rowData[this.KEY_ID]]['checked'];
    this.dataCheckedStatusChange();
    return true;
  }

  public dataCheckedStatusChange() {
    this.allChecked = this.dataList.every(
      item => {
        return this.mapOfDataExpanded[item[this.KEY_ID]]
          .filter(mItem => !mItem['disabled'])
          .every(mItem => mItem['checked']);
      }
    )

    this.indeterminate = this.dataList.some(
      item => {
        return this.mapOfDataExpanded[item[this.KEY_ID]]
          .filter(mItem => !mItem['disabled'])
          .some(mItem => mItem['checked'] && !this.allChecked);
      }
    )

    this.checkedNumber = 0;
    this.ROWS_CHECKED = [];
    this.dataList.map(item => {
      const itemLength = this.mapOfDataExpanded[item[this.KEY_ID]]
        .filter(mItem => mItem['checked']).length;
      this.checkedNumber = this.checkedNumber + itemLength;

      this.ROWS_CHECKED.push(...this.mapOfDataExpanded[item[this.KEY_ID]].filter(mItem => mItem['checked']));
    })
  }

  protected buildRecursive() {
    return { _recursive: true };
  }

  /**
     * 全选
     */
  public checkAll($value: boolean): void {
    this.dataList.map(
      item => {
        this.mapOfDataExpanded[item[this.KEY_ID]]
          .filter(mItem => !mItem['disabled'])
          .map(mItem => mItem['checked'] = $value);
      }
    )

    this.dataCheckedStatusChange();

  }

  public expandRow(item, $event: boolean) {
    if ($event) {
      (async () => {
        const response = await this._getAsyncChildrenData(this.config.ajaxConfig, item.data, false);
        if (response.data && response.data) {
          const appendedChildrenData: any[] = [];
          response.data.map(data => {
            this.mapOfDataExpanded[data[this.KEY_ID]] = this._convertTreeToList(data, item.level + 1);
            appendedChildrenData.push(data);
            this.total = this.total + 1;
          })
          item['children'] = appendedChildrenData;
          this._appendChildrenToList(item.data, appendedChildrenData);
        }
      })();
    } else {
      if (item['children'] && item['children'].length > 0) {
        item['children'].map(c => {
          if (this.mapOfDataExpanded[c[this.KEY_ID]] && this.mapOfDataExpanded[c[this.KEY_ID]].length > 0) {
            this.mapOfDataExpanded[c[this.KEY_ID]].map(s => {
              this.expandRow(s, false);
            })
          }
          this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== c[this.KEY_ID]);
          delete this.mapOfDataExpanded[c[this.KEY_ID]];
          this.total = this.total - 1;
        });
      }
    }
    this.dataCheckedStatusChange();
    // if ($event === false) {
    //     if (item.children) {
    //         item.children.map(d => {
    //             const target = array.find(arr => arr[this.KEY_ID] === d[this.KEY_ID]);
    //             target.expand = false;
    //             this.expandRow(array, target, false);
    //         })
    //     }
    // } else {
    //     return;
    // }
  }

  private _appendChildrenToList(parent, childrenList) {
    const index = this.dataList.findIndex(d => d[this.KEY_ID] === parent[this.KEY_ID]);
    for (let i = 0, len = this.dataList.length; i < len; i++) {
      childrenList.forEach(child => {
        if (this.dataList[i][this.KEY_ID] === child[this.KEY_ID]) {
          this.dataList.splice(i, 1);
          i--;
          len--;
        }
      });
    }
    this.dataList.splice(index + 1, 0, ...childrenList);
    this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== null);
  }

  public _isArray(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
  }

  public addRootRow() {
    // 创建空数据对象
    const newId = CommonTools.uuID(32);
    const newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;

    // 新增数据加入原始列表,才能够动态新增一行编辑数据
    this.dataList = [newData, ...this.dataList];
    // this.mapOfDataExpanded[newId] = [];
    this.mapOfDataExpanded[newId] = [{
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'new',
      level: 0,
      children: [],
      expand: false
    }]

    if (!this.changeConfig_new[newData[this.KEY_ID]]) {
      this.changeConfig_new[newData[this.KEY_ID]] = {};
    }
    this.ROWS_ADDED = [newData, ...this.ROWS_ADDED];

    // 更新状态
  }

  private createNewRowData() {
    const newData = {}
    this.config.columns.filter(c => c.field).map(col => {
      newData[col.field] = null
    });
    return newData;
  }

  public addChildRow() {
    // 创建空数据对象
    const newId = CommonTools.uuID(32);
    const parentId = this.ROW_SELECTED[this.KEY_ID];
    const newData = this.createNewRowData();
    newData[this.PARENT_ID] = parentId;
    newData[this.KEY_ID] = newId;

    // 新增数据加入原始列表,才能够动态新增一行编辑数据
    this.dataList = this._setNewChildRow(newData, parentId);
    const parentLevel = this.mapOfDataExpanded[parentId][0].level;

    this.mapOfDataExpanded[newId] = [
      {
        data: newData,
        originData: { ...newData },
        disabled: false,
        checked: true, // index === 0 ? true : false,
        selected: false, // index === 0 ? true : false,
        state: 'new',
        level: parentLevel + 1,
        children: [],
        expand: false
      }
    ]

    if (!this.changeConfig_new[newData[this.KEY_ID]]) {
      this.changeConfig_new[newData[this.KEY_ID]] = {};
    }
    this.mapOfDataExpanded[parentId][0].children.push(newData);
    this.mapOfDataExpanded[parentId][0].expand = true;
    // 组装状态数据

    this.ROWS_ADDED = [newData, ...this.ROWS_ADDED];

    // 更新状态
  }

  private _setNewChildRow(newRowData, parentId) {
    if (this.dataList) {
      const parentIndex = this.dataList.findIndex(d => d[this.KEY_ID] === parentId);
      if (parentIndex > -1) {
        // const level = this.dataList[parentIndex]['level'];
        // if (level > 0) {
        //     newRowData['level'] = level + 1;
        // }
        this.dataList.splice(parentIndex + 1, 0, newRowData);
      }
    }
    return this.dataList.filter(d => d[this.KEY_ID] !== null);
  }

  public editRows(option) {
    option.forEach(o => {
      this.mapOfDataExpanded[o.Id][0].state = 'edit'
      if (!this.changeConfig_new[o[this.KEY_ID]]) {
        this.changeConfig_new[o[this.KEY_ID]] = {};
      }
    });
    this.ROWS_CHECKED.map(
      item => {
        this.addEditRows(item.data);
      }
    )
  }

  private addEditRows(item) {
    const index = this.ROWS_EDITED.findIndex(r => r[this.KEY_ID] === item[this.KEY_ID]);
    if (index < 0) {
      this.ROWS_EDITED = [item, ...this.ROWS_EDITED];
    }
  }

  private _cancelEditRows() {
    this.cancelNewRows();
    this.cancelEditRows()
  }

  public cancelNewRows() {
    this.ROWS_ADDED.map(
      item => {
        this.removeNewRow(item);
      }
    )
    return true;
  }

  private removeNewRow(item) {
    this.dataList = this.dataList.filter(r => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.ROWS_ADDED = this.ROWS_ADDED.filter(r => r[this.KEY_ID] !== item[this.KEY_ID]);
    delete this.mapOfDataExpanded[item[this.KEY_ID]];
  }

  public cancelEditRows() {
    this.ROWS_CHECKED.map(
      item => {
        this.removeEditRow(item.data);
      }
    )
    return true;
  }

  private removeEditRow(item) {
    if (this.mapOfDataExpanded[item.Id]) {
      this.mapOfDataExpanded[item.Id][0].state = 'text';
    }
    this.ROWS_EDITED = this.ROWS_EDITED.filter(r => r[this.KEY_ID] !== item[this.KEY_ID]);
  }

  // 初始化样式
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

  public valueChange(data) {
    // const index = this.dataList.findIndex(item => item.key === data.key);
    this.mapOfDataExpanded[data.key][0].data[data.name] = data.data;
    if (data.data) {
      this.mapOfDataExpanded[data.key][0].data[data.name] = JSON.parse(
        JSON.stringify(this.mapOfDataExpanded[data.key][0].data[data.name])
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
                    this.mapOfDataExpanded[data.key][0].data[
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
                    this.mapOfDataExpanded[data.key][0].data[
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

  public async changeAddedRowsToText(Ids?) {
    this.loading = true;
    const array = this.config.ajaxConfig.url.split('/');
    const url = array[0] + '/' + array[1];
    const params = { 'Id': 'IN(' + Ids + ')' };
    const response = await this.apiResource.get(url, params).toPromise();
    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i][this.KEY_ID] === response.data[0][this.KEY_ID]) {
        this.dataList[i] = response.data[0];
      }
    }
    this.total = this.dataList.length;
    if (response && Array.isArray(response.data)) {
      response.data.map(opt => {
        if (this.mapOfDataExpanded[opt[this.KEY_ID]]) {
          this.ROWS_ADDED = this.ROWS_ADDED.filter(r => r[this.KEY_ID] !== opt[this.KEY_ID]);
          const children = this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'];
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] = opt;
          if (children) {
            this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'] = children;
          }
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['originData'] = { ...this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] };
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['state'] = 'text';
        }
      })
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  public async changeEditedRowsToText(Ids?) {
    this.loading = true;
    const array = this.config.ajaxConfig.url.split('/');
    const url = array[0] + '/' + array[1];
    const params = { 'Id': 'IN(' + Ids + ')' };
    const response = await this.apiResource.get(url, params).toPromise();
    if (response && Array.isArray(response.data)) {
      response.data.map(opt => {
        if (this.mapOfDataExpanded[opt[this.KEY_ID]]) {
          this.ROWS_EDITED = this.ROWS_EDITED.filter(r => r[this.KEY_ID] !== opt[this.KEY_ID]);
          const children = this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'];
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] = opt;
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'] = children;
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['originData'] = { ...this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] };
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['state'] = 'text';
        }
      })
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  public deleteCheckedRows(option) {
    // if (option['ids'] && option['ids'].length > 0) {
    // option['ids'].split(',').forEach(id => {
    option.forEach(id => {
      const rowId = {};
      rowId[this.KEY_ID] = id['Id'];
      this.deleteCurrentRow(rowId);
    });
    this.total = this.dataList.length;
    // }

  }

  public deleteCurrentRow(option) {
    if (option[this.KEY_ID]) {
      // 为了保证树表在数据内容的一致性 , 需要递归删除所有子节点数据
      // 删除子节点数据时,只需要删除dataList上对应的数据项, 而mapOfDataExpanded 通过delete 删除的时候,能够将结构内的所有数据全部删除
      this._recursiveDeleteRow(option[this.KEY_ID]);
      // 如果选择的当前选中行,则需要重新选中定位
      // 区分跟节点的选中删除和子节点的选中删除、包括最后一个节点的选中删除
      if (option[this.KEY_ID] === this.ROW_SELECTED[this.KEY_ID]) {

        this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== option[this.KEY_ID]);
        delete this.mapOfDataExpanded[option[this.KEY_ID]];

        // 如果选中的是根结点
        if (!this.ROW_SELECTED[this.PARENT_ID] || this.ROW_SELECTED[this.PARENT_ID] === '') {
          // parentMapOfData['selected'] = true;
          const parentList = this.dataList.filter(d => (!d[this.PARENT_ID] || d[this.PARENT_ID] === ''));
          parentList && parentList.length > 0 && this.setSelectRow(parentList[0]);
        } else { // 选中的子节点

          const parentMapOfData = this.mapOfDataExpanded[this.ROW_SELECTED[this.PARENT_ID]][0];
          const parentData = parentMapOfData.data;
          const deleteItemIndex = parentMapOfData.children.findIndex(c => c[this.KEY_ID] === option[this.KEY_ID]);
          if (deleteItemIndex > -1) {
            parentMapOfData.children.splice(deleteItemIndex, 1);
          }

          if (parentMapOfData.children.length > 0) {
            // 选中子节点中第一个
            // parentMapOfData.children[0][this.KEY_ID];
            this.setSelectRow(parentMapOfData.children[0]);

          } else {
            // 选中父节点
            // parentMapOfData.selected = true;
            this.setSelectRow(parentData);
          }
        }
      } else {
        this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== option[this.KEY_ID]);
        delete this.mapOfDataExpanded[option[this.KEY_ID]];
        if (option[this.PARENT_ID] && option[this.PARENT_ID].length > 0) {
          const parentMapOfData = this.mapOfDataExpanded[option[this.PARENT_ID]][0];
          const deleteItemIndex = parentMapOfData.children.findIndex(c => c[this.KEY_ID] === option[this.KEY_ID]);
          if (deleteItemIndex > -1) {
            parentMapOfData.children.splice(deleteItemIndex, 0);
          }
        }
      }
    } else {
      console.log('delete current row data', option);
    }
  }

  private _recursiveDeleteRow(recID) {

    if (this.mapOfDataExpanded[recID] && this.mapOfDataExpanded[recID][0].children) {
      this.mapOfDataExpanded[recID][0].children.forEach(d => {
        this._recursiveDeleteRow(d[this.KEY_ID]);
        this.dataList = this.dataList.filter(s => s[this.KEY_ID] !== recID);
      })
    } else {
      this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== recID);
    }
  }

  public formDialog(option, selected) {
    this.selectedItem = selected;
    this.tempValue['selected'] = selected;
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
  public formBatchDialog(option, checked) {
    this.checkedItems = checked
    if (this.config.formDialog && this.config.formDialog.length > 0) {
      const index = this.config.formDialog.findIndex(
        item => item.name === option.actionName
      );
      this.showBatchForm(this.config.formDialog[index]);
    }
  }

  private getCheckedIds(checked) {
    let checkedIds: string;
    if (checked.length > 0) {
      checked.forEach(e => {
        if (checkedIds) {
          checkedIds = checkedIds + e.data.Id + ',';
        } else {
          checkedIds = e.data.Id + ',';
        }
      });
      checkedIds = checkedIds.substring(0, checkedIds.length - 1);
    }
    return checkedIds;
  }

  /**
   * Ids 新增的数据Id
   */
  public async addRowFromForm(Ids) {
    this.loading = true;
    const array = this.config.ajaxConfig.url.split('/');
    const url = array[0] + '/' + array[1];
    const params = { 'Id': 'IN(' + Ids + ')' };
    const response = await this.apiResource.get(url, params).toPromise();
    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i][this.KEY_ID] === response.data[0][this.KEY_ID]) {
        this.dataList[i] = response.data[0];
      }
    }
    if (response && Array.isArray(response.data)) {
      response.data.map(opt => {
        if (opt.parentId === null) {
          const newData = opt;

          // 新增数据加入原始列表,才能够动态新增一行编辑数据
          this.dataList = [newData, ...this.dataList];
          // this.mapOfDataExpanded[newId] = [];
          this.mapOfDataExpanded[opt.Id] = [{
            data: newData,
            originData: { ...newData },
            disabled: false,
            checked: true, // index === 0 ? true : false,
            selected: false, // index === 0 ? true : false,
            state: 'text',
            level: 0,
            children: [],
            expand: false
          }]

          if (!this.changeConfig_new[newData[this.KEY_ID]]) {
            this.changeConfig_new[newData[this.KEY_ID]] = {};
          }
        } else if (opt.parentId !== null) {
          const parentId = opt.parentId;
          const newData = opt;
          newData[this.PARENT_ID] = parentId;
          newData[this.KEY_ID] = opt.Id;

          // 新增数据加入原始列表,才能够动态新增一行编辑数据
          this.dataList = this._setNewChildRow(newData, parentId);
          const parentLevel = this.mapOfDataExpanded[parentId][0].level;

          this.mapOfDataExpanded[opt.Id] = [
            {
              data: newData,
              originData: { ...newData },
              disabled: false,
              checked: true, // index === 0 ? true : false,
              selected: false, // index === 0 ? true : false,
              state: 'text',
              level: parentLevel + 1,
              children: [],
              expand: false
            }
          ]

          if (!this.changeConfig_new[newData[this.KEY_ID]]) {
            this.changeConfig_new[newData[this.KEY_ID]] = {};
          }
          this.mapOfDataExpanded[parentId][0].children.push(newData);
          this.mapOfDataExpanded[parentId][0].expand = true;
        }
      })
      this.dataCheckedStatusChange();
      this.total = this.dataList.length;
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  /**
   * Ids 编辑的数据Id
   */
  public async editRowFromForm(Ids) {
    this.loading = true;
    const array = this.config.ajaxConfig.url.split('/');
    const url = array[0] + '/' + array[1];
    const params = { 'Id': 'IN(' + Ids + ')' };
    const response = await this.apiResource.get(url, params).toPromise();
    if (response && Array.isArray(response.data)) {
      response.data.map(opt => {
        if (this.mapOfDataExpanded[opt[this.KEY_ID]]) {
          if (opt.parentId !== null) {
            if (this.mapOfDataExpanded[opt[this.KEY_ID]]) {
              delete this.mapOfDataExpanded[opt[this.KEY_ID]];
            }
            this.mapOfDataExpanded[opt.parentId][0]['data']['children'] = [opt, ...this.mapOfDataExpanded[opt.parentId][0]['data']['children']];
            this.mapOfDataExpanded[opt.parentId][0]['originData'] = { ...this.mapOfDataExpanded[opt.parentId][0]['data'] };
            this.mapOfDataExpanded[opt.parentId][0]['expand'] = true;
            this.expandRow(this.mapOfDataExpanded[opt.parentId][0]['data'], true);
          }
          // else {
          //   const children = this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'];
          //   this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] = opt;
          //   this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'] = children;
          //   this.mapOfDataExpanded[opt[this.KEY_ID]][0]['originData'] = { ...this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] };
          // }
        }
      });
      this.total = this.dataList.length;
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  /**
   * 处理存储过程返回的数据
   */
  public async afterProcedure(Ids) {
    this.loading = true;
    const array = this.config.ajaxConfig.url.split('/');
    const url = array[0] + '/' + array[1];
    const params = { 'Id': 'IN(' + Ids + ')' };
    const response = await this.apiResource.get(url, params).toPromise();
    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i][this.KEY_ID] === response.data[0][this.KEY_ID]) {
        this.dataList[i] = response.data[0];
      }
    }
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      response.data.map(opt => {
        if (this.mapOfDataExpanded[opt[this.KEY_ID]]) {
          const children = this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'];
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] = opt;
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data']['children'] = children;
          this.mapOfDataExpanded[opt[this.KEY_ID]][0]['originData'] = { ...this.mapOfDataExpanded[opt[this.KEY_ID]][0]['data'] };
        } else {
          if (opt.parentId === null) {
            const newData = opt;
  
            // 新增数据加入原始列表,才能够动态新增一行编辑数据
            this.dataList = [newData, ...this.dataList];
            // this.mapOfDataExpanded[newId] = [];
            this.mapOfDataExpanded[opt.Id] = [{
              data: newData,
              originData: { ...newData },
              disabled: false,
              checked: true, // index === 0 ? true : false,
              selected: false, // index === 0 ? true : false,
              state: 'text',
              level: 0,
              children: [],
              expand: false
            }]
  
            if (!this.changeConfig_new[newData[this.KEY_ID]]) {
              this.changeConfig_new[newData[this.KEY_ID]] = {};
            }
          } else if (opt.parentId !== null) {
            const parentId = opt.parentId;
            const newData = opt;
            newData[this.PARENT_ID] = parentId;
            newData[this.KEY_ID] = opt.Id;
  
            // 新增数据加入原始列表,才能够动态新增一行编辑数据
            this.dataList = this._setNewChildRow(newData, parentId);
            const parentLevel = this.mapOfDataExpanded[parentId][0].level;
  
            this.mapOfDataExpanded[opt.Id] = [
              {
                data: newData,
                originData: { ...newData },
                disabled: false,
                checked: true, // index === 0 ? true : false,
                selected: false, // index === 0 ? true : false,
                state: 'text',
                level: parentLevel + 1,
                children: [],
                expand: false
              }
            ]
  
            if (!this.changeConfig_new[newData[this.KEY_ID]]) {
              this.changeConfig_new[newData[this.KEY_ID]] = {};
            }
            this.mapOfDataExpanded[parentId][0].children.push(newData);
            this.mapOfDataExpanded[parentId][0].expand = true;
          }
        }
      });
      this.dataCheckedStatusChange();
      this.total = this.dataList.length;
      this.loading = false;
    } else {
      const procId = Ids.split(',');
      for (const prop in this.mapOfDataExpanded) {
        if (procId.find(d => d === prop)) {
          const index = this.dataList.findIndex(d => d.Id === prop);
          delete this.mapOfDataExpanded[prop];
          this.dataList.splice(index, 1);
          // this.checkedNumber -= 1;
          this.dataCheckedStatusChange();
          this.dataList = this.dataList.filter(d => d.Id !== null);
        }
      }
      this.total = this.dataList.length;
      this.loading = false;
    }
  }

  /**
   * 弹出布局
   */
  public windowDialog(option, selected, checked) {
    this.checkedId = this.getCheckedIds(checked);
    this.selectedItem = selected;
    this.checkedItems = checked
    if (this.config.windowDialog && this.config.windowDialog.length > 0) {
      const index = this.config.windowDialog.findIndex(
        item => item.name === option.actionName
      );
      this.showLayout(this.config.windowDialog[index]);
    }
  }

  private showNewLayout(dialog, checkedIds) {
    const footer = [];
    this.apiResource.getLocalData(dialog.layoutName).subscribe(data => {
      const temp = this.tempValue ? this.tempValue : {};
      const iniValue = this.initValue ? this.initValue : {};
      const showcheckedids = { 'checkedIds': checkedIds ? checkedIds : '' }
      const modal = this.baseModal.create({
        nzTitle: dialog.title,
        nzWidth: dialog.width,
        nzContent: LayoutResolverComponent,
        nzClosable: dialog.closable ? dialog.closable : false,
        nzComponentParams: {
          config: data,
          permissions: this.permission,
          initData: { ...temp, ...this.selectedItem, ...iniValue, ...showcheckedids }
        },
        nzFooter: footer
      });
      // console.log('modal', modal.nzComponentParams);
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
                    this.windowCallback();
                  }
                );
              })();
            } else if (btn['name'] === 'saveAndKeep') {
              (async () => {
                const result = await componentInstance.buttonAction(
                  btn,
                  () => {
                    // todo: 操作完成当前数据后需要定位
                    this.windowCallback();
                  }
                );
              })();
            } else if (btn['name'] === 'close') {
              modal.close();
              this.windowCallback(true);
            } else if (btn['name'] === 'ok') {
              modal.close();
              this.windowCallback();
            } else if (btn['name'] === 'close_refresh_parent') {
              modal.close();
              this.operationCallback();
            }
          };
          footer.push(button);
        });
      }
    });
  }
}

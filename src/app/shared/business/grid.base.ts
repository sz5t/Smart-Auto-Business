import { BsnUploadComponent } from './bsn-upload/bsn-upload.component';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { BSN_COMPONENT_CASCADE, BSN_EXECUTE_ACTION, BSN_OUTPOUT_PARAMETER_TYPE } from '@core/relative-Service/BsnTableStatus';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { CommonTools } from '@core/utility/common-tools';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';

export class GridBase extends CnComponentBase {
    private _dataList;
    public get dataList() {
        return this._dataList;
    }
    public set dataList(value) {
        this._dataList = value;
    }
    private _modalService: NzModalService;
    public get modalService(): NzModalService {
        return this._modalService;
    }
    public set modalService(value: NzModalService) {
        this._modalService = value;
    }
    private _message: NzMessageService;
    public get message(): NzMessageService {
        return this._message;
    }
    public set message(value: NzMessageService) {
        this._message = value;
    }
    private _apiService: ApiService;
    public get apiService(): ApiService {
        return this._apiService;
    }
    public set apiService(value: ApiService) {
        this._apiService = value;
    }
    private _callback: Function;
    public get callback(): Function {
        return this._callback;
    }
    public set callback(value: Function) {
        this._callback = value;
    }

    private _checkedItems: any[];
    public get checkedItems(): any[] {
        return this._checkedItems;
    }
    public set checkedItems(value: any[]) {
        this._checkedItems = value;
    }
    private _selectedItem: any;
    public get selectedItem(): any {
        return this._selectedItem;
    }
    public set selectedItem(value: any) {
        this._selectedItem = value;
    }
    private _checkedItemsId: string;
    public get checkedItemsId(): string {
        return this._checkedItemsId;
    }
    public set checkedItemsId(value: string) {
        this._checkedItemsId = value;
    }
    private _editedRows: any[];
    public get editedRows(): any[] {
        return this._editedRows;
    }
    public set editedRows(value: any[]) {
        this._editedRows = value;
    }
    private _addedRows: any[];
    public get addedRows(): any[] {
        return this._addedRows;
    }
    public set addedRows(value: any[]) {
        this._addedRows = value;
    }

    private _sortName;
    public get sortName() {
        return this._sortName;
    }
    public set sortName(value) {
        this._sortName = value;
    }
    private _sortOrder;
    public get sortOrder() {
        return this._sortOrder;
    }
    public set sortOrder(value) {
        this._sortOrder = value;
    }

    private _cfg;
    public get cfg() {
        return this._cfg;
    }
    public set cfg(value) {
        this._cfg = value;
    }
    private _pageIndex;
    public get pageIndex() {
        if (!this._pageIndex) {
            this._pageIndex = 1;
        }
        return this._pageIndex;
    }
    public set pageIndex(value) {
        this._pageIndex = value;
    }
    private _pageSize;
    public get pageSize() {
        if (!this._pageSize) {
            this._pageSize = 10;
        }
        return this._pageSize;
    }
    public set pageSize(value) {
        this._pageSize = value;
    }

    private _focusIds;
    public get focusedIds() {
        return this._focusIds;
    }
    public set focusIds(value) {
        this._focusIds = value;
    }

    private _sortType;
    public get sortType() {
        return this._sortType;
    }
    public set sortType(value) {
        this._sortType = value;
    }

    private _search_Row;
    public get search_Row() {
        return this._search_Row;
    }
    public set search_Row(value) {
        this._search_Row = value;
    }

    private _columnFilterList;
    public get columnFilterList() {
        return this._columnFilterList;
    }
    public set columnFilterList(value) {
        this._columnFilterList = value;
    }


    constructor() {
        super();
    }

    resolver(ajaxConfigs) {
        if (ajaxConfigs && ajaxConfigs.length > 0) {
            ajaxConfigs.filter(c => !c.parentName).map(c => {
                this.getAjaxConfig(c, ajaxConfigs);
            });
        }
    }

    protected getAjaxConfig(c, ajaxConfigs) {
        let msg;
        if (c.action) {
            let handleData;
            switch (c.action) {
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED:
                    if (this.dataList.filter(item => item.checked === true).length <= 0) {
                        this._message.create('info', '请选择要执行的数据');
                            return false;
                    }
                    handleData = this.getCheckedItems();
                    msg = '操作完成';
                break;
                case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                    if (this.selectedItem['row_status'] === 'adding') {
                        this.message.create('info', '当前数据未保存无法进行处理');
                        return false;
                    }
                    handleData = this.getSelectedItem();
                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                    if (this.dataList.filter(item => item.checked === true).length <= 0) {
                        this._message.create('info', '请选择要执行的数据');
                        return false;
                    }
                    handleData = this.getCheckItemsId();
                    msg = '操作完成';
                break;
                case BSN_EXECUTE_ACTION.EXECUTE_EDIT_ROW:
                    handleData = this.getEditedRows();
                    msg = '编辑数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return ;
                    }
                break;
                case BSN_EXECUTE_ACTION.EXECUTE_SAVE_ROW:
                    // 获取更新状态的数据
                    handleData = this.getAddedRows();
                    msg = '新增数据保存成功';
                    if (handleData && handleData.length <= 0) {
                        return ;
                    }
                break;
            }
            this.buildConfirm(c, ajaxConfigs, handleData, msg);
        }
    }

    protected buildConfirm(c, ajaxConfigs, handleData, msg) {
        if (c.message) {
            this._modalService.confirm({
                nzTitle: c.title ? c.title : '提示',
                nzContent: c.message ? c.message : '',
                nzOnOk: () => {
                    (async() => {
                        const response = await this.executeAjaxConfig(c, handleData);
                        // 处理输出参数
                        if (c.outputParams) {
                            this.outputParametersResolver(c, response, ajaxConfigs, () => {
                                const focusIds = this.getFocusIds(response.data);
                                this._callback(focusIds);
                            });
                        } else { // 没有输出参数，进行默认处理
                            this.showAjaxMessage(response, msg, () => {
                                const focusIds = this.getFocusIds(response.data);
                                this._callback(focusIds);
                            });
                        }

                    })();
                },
                nzOnCancel() {
                }
            });
        } else {
            (async() => {
                const response = await this.executeAjaxConfig(c, handleData);
                // 处理输出参数
                if (c.outputParams) {
                    this.outputParametersResolver(c, response, ajaxConfigs, () => {
                        const focusIds = this.getFocusIds(response.data);
                        this._callback(focusIds);
                    });
                } else {// 没有输出参数，进行默认处理
                    this.showAjaxMessage(response, msg, () => {
                        const focusIds = this.getFocusIds(response.data);
                        this._callback(focusIds);
                    });
                }
            })();


        }
    }

    protected executeAjaxConfig(ajaxConfigObj, handleData) {
        if (Array.isArray(handleData)) {
            return this.executeBatchAction(ajaxConfigObj, handleData);
        } else {
            return this.executeAction(ajaxConfigObj, handleData);
        }
    }

    protected executeBatchAction(ajaxConfigObj, handleData) {
        const executeParams = [];
        if (Array.isArray(handleData)) {
            if (ajaxConfigObj.params) {
                handleData.forEach(dataItem => {
                    const newParam = CommonTools.parametersResolver({
                        params: ajaxConfigObj.params,
                        tempValue: this.tempValue,
                        item: {},
                        componentValue: dataItem,
                        initValue: this.initValue
                    });
                    executeParams.push(newParam);
                });
            }
        } else {
            executeParams.push(CommonTools.parametersResolver({
                params: ajaxConfigObj.params,
                tempValue: this.tempValue,
                item: {} ,
                componentValue: handleData,
                initValue: this.initValue
            }));
        }
        // 执行数据操作
        return this.executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParams
        );
    }

    protected executeAction(ajaxConfigObj, handleData) {
        const executeParam = CommonTools.parametersResolver({
            params: ajaxConfigObj.params,
            tempValue: this.tempValue,
            item: handleData,
            initValue: this.initValue
        });
        // 执行数据操作
        return this.executeRequest(
            ajaxConfigObj.url,
            ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
            executeParam
        );
    }

    private getCheckedItems() {
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
        this.tempValue['checkedRow'] = serverData;
        return serverData;
    }

    private getSelectedItem() {
        this.tempValue['selectedRow'] = this.selectedItem;
        return this.selectedItem;
    }

    private getCheckItemsId() {
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

    private getAddedRows() {
        const addedRows = [];
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'adding') {
                addedRows.push(item);
            }
        });
        return addedRows;
    }

    private getEditedRows() {
        const updatedRows = [];
        this.dataList.map(item => {
            delete item['$type'];
            if (item['row_status'] === 'updating') {
                updatedRows.push(item);
            }
        });
        return updatedRows;
    }

    protected async executeRequest(url, method, body) {
        return this.apiService[method](url, body).toPromise();

    }

    protected getFocusIds(data) {
        const Ids = [];
        if (Array.isArray(data)) {
            data.forEach(d => {
                Ids.push(d['$focusedOper$']);
            });
        } else {
            Ids.push(data['$focusedOper$']);
        }
        return Ids.join(',');
    }

    /**
     *
     * @param outputParams
     * @param response
     * @param callback
     * @returns {Array}
     * @protected
     * 1、输出参数的配置中，消息类型的参数只能设置一次
     * 2、值类型的结果可以设置多个
     * 3、表类型的返回结果可以设置多个
     */
    protected outputParametersResolver(c, response, ajaxConfig, callback): void {
        const result = false;
        if (response.isSuccess) {
            const msg = c.outputParams[c.outputParams.findIndex(m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.MESSAGE)];
            const value = c.outputParams[c.outputParams.findIndex(m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.VALUE)];
            const table = c.outputParams[c.outputParams.findIndex(m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.TABLE)];
            const msgObj = response.data[msg.name] ? response.data[msg.name].split(':') : '';
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
                        this._modalService[messageType](options);
                        break;
                    case 'error':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this._modalService[messageType](options);
                        break;
                    case 'confirm':
                        options = {
                            nzTitle: '提示',
                            nzContent: msgObj[1],
                            nzOnOk: () => {
                                // 是否继续后续操作，根据返回状态结果
                                const childrenConfig = ajaxConfig.filter(f => f.parentName && f.parentName === c.name);
                                childrenConfig && childrenConfig.map(currentAjax => {
                                    this.getAjaxConfig(currentAjax, ajaxConfig);
                                });
                            },
                            nzOnCancel: () => {

                            }
                        };
                        this._modalService[messageType](options);
                        break;
                    case 'warning':
                        options = {
                            nzTitle: '提示',
                            nzWidth: '350px',
                            nzContent: msgObj[1]
                        };
                        this._modalService[messageType](options);
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
                this._message.error('存储过程返回结果异常：未获得输出的消息内容');
            }

        } else {
            this._message.error('操作异常：', response.message);
        }
    }

    /**
     * 数据访问返回消息处理
     * @param result
     * @param message
     * @param callback
     */
    protected showAjaxMessage(result, message?, callback?) {
        const rs: {success: boolean, msg: string[]} = {success: true, msg: []};
        if (result && Array.isArray(result)) {
            result.forEach(res => {
                rs['success'] = (rs['success'] && res.isSuccess);
                if (!res.isSuccess) {
                    rs.msg.push(res.message);
                }
            });
            if (rs.success) {
                this._message.success(message);
            } else {
                this._message.error(rs.msg.join('<br/>'));
            }
        } else {
            if (result.isSuccess) {
                this._message.success(message);
            } else {
                this._message.error(result.message);
            }
        }
        if (callback) {
            callback();
        }
    }

    protected showLayout(dialog) {
        const footer = [];
        this._apiService.getLocalData(dialog.layoutName).subscribe(data => {
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: LayoutResolverComponent,
                nzComponentParams: {
                    config: data,
                    initData: this.selectedItem
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
                                    this.callback();
                                }
                            })();
                        } else if (btn['name'] === 'saveAndKeep') {
                            (async () => {
                                const result = await componentInstance.buttonAction(btn);
                                if (result) {
                                    // todo: 操作完成当前数据后需要定位
                                    this.callback();
                                }
                            })();
                        } else if (btn['name'] === 'close') {
                            modal.close();
                            this.callback();
                        } else if (btn['name'] === 'ok') {
                            modal.close();
                            this.callback();
                            //
                        }

                    };
                    footer.push(button);
                });

            }
        });
    }

    /**
     * 批量编辑表单
     * @param dialog
     */
    protected showBatchForm(dialog) {
        const footer = [];
        const checkedItems = [];
        this.dataList.map(item => {
            if (item.checked) {
                checkedItems.push(item);
            }
        });
        if (checkedItems.length > 0) {
            const obj = {
                checkedRow: checkedItems
            };
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: CnFormWindowResolverComponent,
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
                        if (btn['name'] === 'batchSave') {
                            (async () => {
                                const result = await componentInstance.buttonAction(btn);
                                this.showAjaxMessage(result, '保存成功', () => {
                                    modal.close();
                                    this.callback();
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
     * 单条数据表单
     * @param dialog
     * @returns {boolean}
     */
    protected showForm(dialog) {
        let obj;
        if (dialog.type === 'add') {

        } else if (dialog.type === 'edit') {
            if (!this.selectedItem) {
                this._message.warning('请选中一条需要添加附件的记录！');
                return false;
            }

        }
        obj = {
            _id: this.selectedItem[dialog.keyId] ? this.selectedItem[dialog.keyId] : '',
            _parentId: this.tempValue['_parentId'] ? this.tempValue['_parentId'] : ''
        };

        const footer = [];
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: CnFormWindowResolverComponent,
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
                            this.showAjaxMessage(result, '保存成功', () => {
                                modal.close();
                                this.callback();
                            });
                        })();
                    } else if (btn['name'] === 'saveAndKeep') {
                        (async () => {
                            const result = await componentInstance.buttonAction(btn);
                            this.showAjaxMessage(result, '保存成功', () => {
                                modal.close();
                                this.callback();
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
     * @protected
     */
    protected _resetForm(comp: FormResolverComponent) {
        comp.resetForm();
    }
    /**
     * 弹出上传表单
     * @param dialog
     * @returns {boolean}
     */
    protected openUploadDialog(dialog): boolean {
        if (!this.selectedItem) {
            this._message.warning('请选中一条需要添加附件的记录！');
            return false;
        }
        const footer = [];
        const obj = {
            _id: this.selectedItem[dialog.keyId],
            _parentId: this.tempValue['_parentId']
        };
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: BsnUploadComponent,
            nzComponentParams: {
                config: dialog,
                refObj: obj
            },
            nzFooter: footer
        });
    }

    /**
     * 构建查询过滤参数
     * @param filterConfig
     * @returns {{}}
     * @protected
     */
    protected buildFilter(filterConfig): {} {
        let filter = {};
        if (filterConfig) {
            filter = CommonTools.parametersResolver({
                params: filterConfig,
                tempValue: this.tempValue});
        }
        return filter;
    }
    /**
     * 构建URL参数
     * @param paramsConfig
     * @returns {{}}
     * @protected
     */
    protected buildParameters(paramsConfig): {} {
        let params = {};
        if (paramsConfig) {
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: this.tempValue,
                initValue: this.initValue
            });
        }
        return params;
    }
    /**
     * 构建URL
     * @param ajaxUrl
     * @returns {string}
     * @protected
     */
    protected buildURL(ajaxUrl): string {
        let url = '';
        if (ajaxUrl && this.isUrlString(ajaxUrl)) {
            url = ajaxUrl;
        } else if (ajaxUrl) {

        }
        return url;
    }
    /**
     * 构建分页
     * @returns {{}}
     * @protected
     */
    protected buildPaging(isPaging): {} {
        const params = {};
        if (isPaging) {
            params['_page'] = this.pageIndex;
            params['_rows'] = this.pageSize;
        }
        return params;
    }
    /**
     * 处理URL格式
     * @param url
     * @returns {boolean}
     * @protected
     */
    protected isUrlString(url): boolean {
        return Object.prototype.toString.call(url) === '[object String]';
    }
    /**
     * 构建排序
     * @returns {{}}
     * @protected
     */
    protected buildSort(): {} {
        const sortObj = {};
        if (this.sortName && this.sortOrder) {
            sortObj['_sort'] = this.sortName + this.sortOrder;
        }
        return sortObj;
    }
    /**
     * 构建查询焦点
     * @returns {{}}
     * @protected
     */
    protected buildFocusId(): {} {
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
     * @protected
     */
    protected buildColumnFilter(): {} {
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
    protected buildSearch() {
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

    protected buildRecursive() {
        return { _recursive: true, _deep: -1 };
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
        this.callback();
    }

    columnFilter(field: string, values: string[]) {
        const filter = {};
        if (values.length > 0 && field) {
            filter['field'] = field;
            filter['value'] = values;
            this.columnFilterList.push(filter);
        } else {
            this.columnFilterList = [];
        }

        this.callback();
    }
}

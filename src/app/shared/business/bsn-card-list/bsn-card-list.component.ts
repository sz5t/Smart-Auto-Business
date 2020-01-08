import { EventEmitter } from '@angular/core';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit,
    Output
} from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_FORM_STATUS,
    BSN_EXECUTE_ACTION,
    BSN_OUTPOUT_PARAMETER_TYPE
} from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { CommonTools } from '@core/utility/common-tools';
import { FormGroup } from '@angular/forms';
import { BeforeOperation } from '../before-operation.base';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { SettingsService, MenuService } from '@delon/theme';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-card-list',
    templateUrl: './bsn-card-list.component.html',
    styleUrls: [`bsn-card-list.less`]
})
export class BsnCardListComponent extends CnComponentBase
    implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public viewId;
    @Input()
    public initData;
    public count = 0;
    public formConfig = {};
    public isLoading = true;
    public data;
    public _statusSubscription;
    public _cascadeSubscription;
    public title;
    public switchAll = false;
    public _lastItem;
    public selectedItems;
    public total = 1;
    public pageIndex = 1;
    public pageSize = 5;
    public pageCount;
    public loadautotime;
    public autoPlaySwitch = true;
    public temple = 0;
    public beforeOperation: BeforeOperation;

    @Output() public updateValue = new EventEmitter();
    constructor(
        private _apiService: ApiService,
        private _cacheService: CacheService,
        private _message: NzMessageService,
        private _modal: NzModalService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        private router: Router,
        public settings: SettingsService,
        private menuService: MenuService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
        super();
        this.apiResource = this._apiService;
        this.cacheValue = this._cacheService;
        this.baseModal = this._modal;
        this.baseMessage = this._message;

    }

    public ngOnInit() {
        // this.formConfig['viewId'] = this.config.viewId;
        // this.formConfig['forms'] = this.config.forms;
        // this.formConfig['editable'] = 'text';
        this.pageSize = this.config.pageSize ? this.config.pageSize : 5;
        this.initValue = this.initData ? this.initData : {};
        this.load();
        this.resolverRelation();
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

    public resolverRelation() {
        this.statusSubscriptions = this.stateEvents.subscribe(updateState => {
            if (updateState._viewId === this.config.viewId) {
                const option = updateState.option;
                this.beforeOperation.operationItemData = option.data;
                if (!this.beforeOperation.beforeItemDataOperation(option)) {
                    switch (updateState._mode) {
                        case BSN_COMPONENT_MODES.EXECUTE:
                            setTimeout(() => {
                                this.isLoading = true;
                            });
                            // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
                            this._resolveAjaxConfig(option);
                            break;
                    }
                }
            }
        });


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
                                        if (!this.tempValue) {
                                            this.tempValue = {};
                                        }
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
                                }
                            }
                        });
                    }
                }
            );
        }
    }


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
                    handleData = this.getSelectedItems();
                    if (handleData.length <= 0) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return false;
                    }
                    // this.beforeOperation.operationItemsData = handleData;
                    // if (this.beforeOperation.beforeItemsDataOperation(option)) {
                    //     return false;
                    // }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_SELECTED:
                    if (!option.data) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return false;
                    }
                    handleData = option.data;
                    // this.beforeOperation.operationItemData = handleData;
                    // if (this.beforeOperation.beforeItemDataOperation(option)) {
                    //     return false;
                    // }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_CHECKED_ID:
                    // if (
                    //     this.dataList.filter(item => item.checked === true)
                    //         .length <= 0
                    // ) {
                    //     this.baseMessage.create('info', '请选择要执行的数据');
                    //     return false;
                    // }

                    handleData = this.getCheckedItemsId();
                    if (handleData.length <= 0) {
                        this.baseMessage.create('info', '请选择要执行的数据');
                        return false;
                    }
                    // this.beforeOperation.operationItemsData = this._getCheckItemsId();
                    // if (this.beforeOperation.beforeItemsDataOperation(option)) {
                    //     return false;
                    // }

                    msg = '操作完成';
                    break;
                case BSN_EXECUTE_ACTION.EXECUTE_AND_LOAD:
                    // 获取更新状态的数据
                    handleData = {};
                    msg = '新增数据保存成功';
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
                                    option.ajaxConfig1,
                                    () => {
                                        this.load();
                                    }
                                );
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(response, msg, () => {
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
                            this.load();
                        });
                    }
                })();
            }
        }
    };

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
        setTimeout(() => {
            this.isLoading = false;
        });
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
            if (valueObj) {
                this.returnValue = valueObj;
                const childrenConfig = ajaxConfig.filter(
                    f => f.parentName && f.parentName === c.name
                );
                //  目前紧支持一次执行一个分之步骤
                this._getAjaxConfig(childrenConfig[0], ajaxConfig);
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
            cacheValue: this.cacheValue,
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
                        cacheValue: this.cacheValue,
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
                    cacheValue: this.cacheValue,
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

    private async _executeRequest(url, method, body) {
        return this.apiResource[method](url, body).toPromise();
    }
    /**
     * 根据表单组件routeParams属性配置参数,执行页面跳转
     * @param option 按钮操作配置参数
     */
    private linkToPage(option) {
        const params = CommonTools.parametersResolver({
            params: this.config.routeParams,
            componentValue: option.data ? option.data : {},
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        this.router.navigate([option.link], { queryParams: params });
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

    public ngOnDestroy() {
        this.unsubscribe();
        if (this.loadautotime) {
            clearInterval(this.loadautotime);
        }
    }

    public async load() {
        // this.pageIndex = 1;
        // this.pageSize = this.config.pageSize ? this.config.pageSize : 6;
        const response = await this.get();
        if (response.isSuccess) {
            // 构建数据源
            // response.data.forEach(item => {
            //     item['checked'] = false;
            //     item['selected'] = false;
            // });
            this.data = response.data.rows;
            this.total = response.data.total;
            this.pageCount = response.data.pageCount;
            this.getSelectedItems();
            this.isLoading = false;
        } else {
            this.isLoading = false;
        }
    }

    public async get() {
        const url = this.config.ajaxConfig.url;
        let params = CommonTools.parametersResolver({
            params: this.config.ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        if (this.config.pagination) {
            params = { ...params, ...this.buildPaging(this.config.pagination) };
        }
        return this._apiService
            .get(url, params).toPromise();
    }


    public getItemValue(name, item) {
        let result;
        if (Array.isArray(this.config.fieldMapping)) {
            const index = this.config.fieldMapping.findIndex(s => s.name === name);
            index > -1 && (result = item[this.config.fieldMapping[index].field]);
        }
        return result;
    }

    public getMappingField(item, field) {
        let result;
        const excludeName = ['name', 'title', 'icon'];
        if (!excludeName.includes(field.name)) {
            result = item[field.field];
        }
        return result;
    }

    public selectItem(item) {
        if (item.selected) {
            // item.selected = !item.selected;
        } else {
            if (!this._lastItem) {
                this._lastItem = item;
            } else {
                this._lastItem['selected'] = false;
            }
            item['selected'] = !item['selected'];
            this._lastItem = item;
        }
        this.getSelectedItems();
    }

    public selectItems(item) {
        item.selected = !item.selected;
        this.getSelectedItems();
    }

    public ngAfterViewInit() {
        if (this.config.autoPlay) {
            this.loadAutoPlay();
        }
        // this.load();
    }

    public switch() {
        this.data.forEach(d => d.selected = !!this.switchAll);
        this.getSelectedItems();
    }

    private getSelectedItems() {
        if (this.config.selectionSwitch) {
            this.selectedItems = this.data.rows.filter(d => d.selected);
            this.updateValue.emit(this.selectedItems);
        }
    }

    private getCheckedItemsId() {
        const ids = [];
        this.selectedItems = this.data.rows.filter(d => d.selected);
        if (this.selectedItems.length > 0) {
            this.selectedItems.forEach(item => {
                ids.push(item['Id']);
            });
        }
        return ids.join(',');
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

    protected buildPaging(isPaging): {} {
        const params = {};
        if (isPaging) {
            params['_page'] = this.pageIndex;
            params['_rows'] = this.pageSize;
        }
        return params;
    }

    public searchData(page) {
        this.pageIndex = page;
        this.load();
    }

    public startAutoPlay() {
        this.temple = this.pageIndex;
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

    public loadAutoPlay() {
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
                    if (this.pageIndex >= this.pageCount) {
                        this.pageIndex = 1;
                    } else {
                        this.pageIndex = this.pageIndex + 1;
                    }
                    this.load();
                }, this.config.timeInterval)
            }
        }
    }
}

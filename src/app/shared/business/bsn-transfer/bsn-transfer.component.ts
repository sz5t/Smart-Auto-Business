import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {NzMessageService, NzModalService, TransferItem} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {Observer} from 'rxjs';
import {Subscription} from 'rxjs';
import {
    BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES,
    BsnComponentMessage
} from '@core/relative-Service/BsnTableStatus';
import {CommonTools} from '@core/utility/common-tools';
import {CnComponentBase} from '@shared/components/cn-component-base';

@Component({
    selector: 'bsn-transfer',
    templateUrl: './bsn-transfer.component.html'
})
export class BsnTransferComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() config;
    @Input() initData;
    dataList: any[] = [];
    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    constructor(private _apiService: ApiService,
                private _message: NzMessageService,
                private modalService: NzModalService,
                @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>) {
        super();
    }

    ngOnInit() {
        if (this.initData) {
            this.initValue = this.initData;
        }
        this.resolverRelation();
        this.load();
    }

    async load() {
        const url = this.config.ajaxConfig.url;
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params)
        };
        const response = await this.get(url, params);
        const list = [];
        if (response.isSuccess) {
            response.data.map(dataItem => {
                const listItem = {};
                listItem['Id'] = dataItem.Id;
                // 转换数据
                this.config.columns.forEach(column => {
                    if (dataItem[column['field']] && column.name === 'title') {
                        listItem['title'] = dataItem[column['field']];
                    }
                    if (dataItem[column['field']] && column.name === 'description') {
                        listItem['description'] = dataItem[column['field']];
                    }
                    listItem['icon'] = column['icon'];
                });

                // 区分左右数据
                // this.config.separator.left.forEach(left => {
                //     let isLeft;
                //     if (dataItem[left['field']] && dataItem[left['field']] === left['value']) {
                //         isLeft = true;
                //     }
                //     if (isLeft) {
                //         listItem['direction'] = 'left';
                //     }
                // });
                let selectedFlag = false;
                if (this.separatorData(dataItem, this.config.separator.left)) {
                    listItem['direction'] = 'left';
                    selectedFlag = true;

                } else if (this.separatorData(dataItem, this.config.separator.right)) {
                    listItem['direction'] = 'right';
                    selectedFlag = true;
                } else {
                    selectedFlag = false;
                }

                // this.config.separator.right.forEach(right => {
                //     let isRight;
                //     if (dataItem[right['field']] && dataItem[right['field']] === right['value']) {
                //         isRight = true;
                //     }
                //     if (isRight) {
                //         listItem['direction'] = 'right';
                //     }
                // });
                selectedFlag && list.push(listItem);
            });
        }
        this.dataList = list;
    }

    private separatorData(dataItem, params) {
        const result = [];
        params.forEach(left => {
            if (left['type'] === 'tempValue') {
                result.push(dataItem[left['field']] === this.tempValue[left['valueName']]);
            } else if (left['type'] === 'initValue') {
                result.push(dataItem[left['field']] === this.initValue[left['valueName']]);
            } else {
                result.push(dataItem[left['field']] && dataItem[left['field']] === left['value']);
            }
        });
        return result.every(r => r === true);
    }

    private resolverRelation() {
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
                            }
                        }
                    });
                }
            });
        }
    }

    private _buildParameters(params, items?) {
        let newParam = {};
        if (params) {
            newParam = CommonTools.parametersResolver({
                params: params,
                tempValue: this.tempValue,
                item: items ? items : {},
                componentValue: items,
                initValue: this.initValue
            });
        }
        return newParam;
    }

    filterOption(inputValue: string, item: any): boolean {
        return item.title.indexOf(inputValue) > -1;
    }

    search(ret: {}) {

    }

    select(ret) {

    }

    change(ret) {
        this[ret.from](ret.list);
    }

    async right(list) {
        const result = [];
        const ajaxConfig = this.config.rightToLeft.ajaxConfig;
        if (ajaxConfig) {
            ajaxConfig.map(async config => {
                const params = [];
                let ids = {};
                let itemtemp = {};
                if (Array.isArray(list) && list.length > 0) {
                    list.forEach(listItem => {
                        const param = this._buildParameters(config.params, listItem);
                        params.push(param['Id']);
                        itemtemp = param;
                        // if (ids['ids']) {
                        //     ids = {ids : ids['ids'] + ',' + param['Id']};
                        // } else {
                        //     ids = {ids : param['Id']};
                        // }
                    });
                }
                itemtemp['ids'] = params.join(',');
                const response = await this[config.ajaxType](
                    config.url,
                    itemtemp
                );
                result.push(response);
            });
            Promise.all(result).then(() => {
                this.load();
            });
        }
    }

    async left(list) {
        const result = [];
        const ajaxConfig = this.config.leftToRight.ajaxConfig;
        if (ajaxConfig) {
            ajaxConfig.map(async config => {
                const params = [];
                let itemtemp = {};
                if (Array.isArray(list) && list.length > 0) {
                    list.forEach(listItem => {
                        const param = this._buildParameters(config.params, listItem);
                        params.push(param['Id']);
                        itemtemp = param;
                    });
                }
                itemtemp['ids'] = params.join(',');
                result.push(await this[config.ajaxType](config.url, itemtemp));
            });
            Promise.all(result).then(() => {
                this.load();
            })
        }
        return result;
    }

    private async get(url, params) {
        return this._apiService.get(url, params).toPromise();
    }

    private async post(url, params) {
        return this._apiService.post(url, params).toPromise();
    }

    private async put(url, params) {
        return this._apiService.put(url, params).toPromise();
    }

    ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

}

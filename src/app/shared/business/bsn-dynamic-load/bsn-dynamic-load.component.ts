import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer, Subscription } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'bsn-dynamic-load',
  templateUrl: './bsn-dynamic-load.component.html'
})
export class BsnDynamicLoadComponent extends CnComponentBase
  implements OnInit, OnDestroy {

  @Input()
  public config;
  public title;
  public permissions;
  public initData;
  public _cascadeSubscription: Subscription;
  public pageJsonConfig = {
    rows: []
  };
  public isLoadLayout = false;
  constructor(
    private _api: ApiService,
    private _msg: NzMessageService,
    private _modal: NzModalService,
    private _cacheService: CacheService,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>  ) {
    super();
    this.baseMessage = this._msg;
    this.baseModal = this._modal;
    this.cascadeBase = this.cascade;
    this.cacheValue = this._cacheService;
    this.apiResource = this._api;
  }

  public ngOnInit() {
    this.resolverRelation();
    if (this.config.componentType && this.config.componentType.own === true) {
      this.loadPage();
    }

    if (this.config.toolbar) {
      this.cacheValue.set('ApprovalToolBar', this.config.toolbar);
    }

    if (this.config.formDialog) {
      this.cacheValue.set('ApprovalFormDialog', this.config.formDialog);
    }

    if (this.config.ajaxParams) {
      this.cacheValue.set('ApprovalAjaxParams', this.config.ajaxParams);
    }

    if (this.config.paramsConfig) {
      this.loadAjaxParams();
    }
  }

  public ngOnDestroy(): void {
    this.pageJsonConfig = null;
    if (this._cascadeSubscription) {
      this._cascadeSubscription.unsubscribe();
    }
  }

  /**
   * resolverRelation 接到消息之后的反应
   */
  public resolverRelation() {
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
                        break;
                      case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                        this.loadPage();
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

  /**
   * loadPage 动态加载页面配置
   */
  public async loadPage() {
    let jsonName = await this.loadJsonName();
    let jsonConfig;
    if (this.config.carrierConfig) {
      const filedName = this.config.carrierConfig.name
      const conditionArray = this.config.carrierConfig.condition
      const index = conditionArray.findIndex(e => e['value'] === this.initData[filedName])
      jsonConfig = conditionArray[index];
    }
    if (jsonConfig) {
      if (jsonConfig.replaceJson) {
        if (jsonConfig.ajaxJsonName) {
          const changeJsonName = await this.changeJsonName();
          jsonName = changeJsonName;
        } else {
          jsonName = jsonConfig.replaceJsonName
        }
      } else {
        if (jsonConfig.excessJsonAdd) {
          if (jsonConfig.prefixName) {
            jsonName = jsonConfig.prefixName + jsonName;
          }
          if (jsonConfig.suffixName) {
            jsonName += jsonConfig.suffixName
          }
        }
      }

    }
    if (jsonName) {
      this._api.getLocalData(jsonName).subscribe(data => {
        this.isLoadLayout = true;
        this.pageJsonConfig = data;
      });
    }
  }

  /**
   * loadJsonName 读取库中对应的json名称
   */
  public async loadJsonName() {
    if (this.config.getAsncData) {
      const response = await this._getAsyncData();
      if (response && response.data.length > 0) {
        const jsonName = response.data[0]['tyseResouceJson']
        return jsonName;
      } else {
        return this.config.defaultJson;
      }
    } else {
      return this.config.jsonName;
    }
  }

  public async _getAsyncData() {
    const params = CommonTools.parametersResolver({
      params: this.config.ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.apiResource
      .get(
        this.config.ajaxConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  /**
   * changeJsonName 读取替换json的名称
   */
  public async changeJsonName() {
    const response = await this._getAsyncChangeData();
    if (response && response.data.length > 0) {
      const jsonName = response.data[0]['tyseResouceJson']
      return jsonName;
    } else {
      return this.config.defaultJson;
    }
  }

  /**
   * _getAsyncChangeData
   */
  public async _getAsyncChangeData() {
    const params = CommonTools.parametersResolver({
      params: this.config.changeJsonNameConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.apiResource
      .get(
        this.config.changeJsonNameConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  /**
   * loadAjaxParams 向切换之后的组件进行传值
   */
  public async loadAjaxParams() {
    const ajaxParams = await this.getAjaxParams()
    delete ajaxParams.data[0].Id;
    this.tempValue = { ...this.tempValue, ...ajaxParams.data[0] }
  }



  public async getAjaxParams() {
    const params = CommonTools.parametersResolver({
      params: this.config.paramsConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.apiResource
      .get(
        this.config.paramsConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }
}

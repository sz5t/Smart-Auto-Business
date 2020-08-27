import { Component, OnInit, AfterViewInit, OnDestroy, Inject, Input } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observer } from 'rxjs';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'bsn-time-line',
  templateUrl: './bsn-time-line.component.html',
  styleUrls: ['./bsn-time-line.component.less']
})
export class BsnTimeLineComponent extends CnComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public config; // 配置参数
  @Input()
  public dataList = []; // 数据集
  @Input()
  public initData // 数据集
  public sendData = {}

  constructor(
    private _http: ApiService,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private cacheService: CacheService,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>
  ) {
    super();
    this.apiResource = this._http;
    this.baseMessage = this._message;
    this.baseModal = this.modalService;
    this.cacheValue = this.cacheService;
    this.cascadeBase = this.cascade;
  }

  public ngOnInit() {
    if (this.config.componentType) {
      if (this.config.componentType.own) {
        this.loadData();
      }
    }

    this.resolverRelation();
  }

  public ngAfterViewInit() {

  }

  public ngOnDestroy() {

  }

  /**
   * loadData 读取数据
   */
  public async loadData() {
    const response = await this.getAsyncData(this.config.ajaxConfig);
    // console.log(response);
    if (response.isSuccess) {
      this.dataList = response.data
    }

    this.dataList.forEach(data => {
      if (data.hasOwnProperty('mark')) {
        if (data['mark'] === 0) {
          data['color'] = 'blue'
        } else if (data['mark'] === 1) {
          data['color'] = 'green'
        } else if (data['mark'] === 2) {
          data['color'] = 'red'
        } else if (data['mark'] === 4) {
          data['color'] = 'orange'
        } else {
          data['color'] = 'blue'
        }
      }
    });

    this.dataList = this.dataList.filter(e => e.Id !== null)
    // console.log(this.dataList)
  }

  /**
   * getAsyncData 得到异步数据
   */
  public async getAsyncData(ajaxConfig) {
    const params = CommonTools.parametersResolver({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.apiResource
      .get(
        ajaxConfig.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  public showDetails(data) {
    this.sendData = data;
  }

  /**
   * resolverRelation 基础解析
   */
  public resolverRelation() {
    if (this.config.componentType.parent) {
      // 注册消息发送方法
      // 注册行选中事件发送消息
      this.after(this, 'showDetails', () => {
        if (this.config.componentType.sendIds) {
          // this.sendCheckedRowData();
        } else {
          this.cascade.next(
            new BsnComponentMessage(
              BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
              this.config.viewId,
              {
                data: { ...this.sendData}
              }
            )
          );
        }

      });
    }
  }
}

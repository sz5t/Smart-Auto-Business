
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from './../../../core/utility/common-tools';
import { Subscription, Observer, Observable } from 'rxjs';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import 'zone.js';
import 'reflect-metadata';
import { Component, NgModule, AfterViewInit, OnInit, ViewEncapsulation, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
@Component({
  selector: 'bar-chart',
  encapsulation: ViewEncapsulation.None,
  template: `
   <div #barContainer></div>
  `,
  styles: [
    `
    `
  ]
})
export class BarChartComponent extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() layoutId;
  @Input() blockId;
  @Input() config;
  
  @ViewChild('barContainer') chartElement: ElementRef;
  data;
  loading = false;
  _cascadeSubscription: Subscription;
  constructor(
    private _http: ApiService,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
  ) {
    super();
  }



  ngOnInit(): void {
    this.resolverRelation();
  }
  ngAfterViewInit(): void {
    this.data = [
      { value: 10, time: '2015-03-01T16:00:00.000Z' },
      { value: 15, time: '2015-03-01T16:10:00.000Z' },
      { value: 26, time: '2015-03-01T16:20:00.000Z' },
      { value: 9, time: '2015-03-01T16:30:00.000Z' },
      { value: 12, time: '2015-03-01T16:40:00.000Z' },
      { value: 23, time: '2015-03-01T16:50:00.000Z' },
      { value: 18, time: '2015-03-01T17:00:00.000Z' },
      { value: 21, time: '2015-03-01T17:10:00.000Z' },
      { value: 22, time: '2015-03-01T17:20:00.000Z' }
    ]; 
    // Step 1: 创建 Chart 对象
    const chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      forceFit: true,
      width : 500, // 指定图表宽度
      height : 500 // 指定图表高度
    });
    // chart.forceFit();
    // Step 2: 载入数据源
    chart.source(this.data, {
      'time': {
        type: 'time',
        nice: true,
        mask: 'HH:mm'
      },
      'value': {
        formatter: val => {
          return val + ' k';
        }
      }
    });
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart.point().position('time*value').color('value').size(2).shape('value', [ 'circle', 'triangle-down', 'square', 'diamond' ]);
    // Step 4: 渲染图表
    chart.render();
  }

  async load() {
    this.loading = true;
    const url = this._buildURL(this.config.ajaxConfig.url);
    const params = {
      ...this._buildParameters(this.config.ajaxConfig.params),
    };
    const loadData = await this._load(url, params);
    if (loadData && loadData.status === 200) {
      if (loadData.data && loadData.data && loadData.isSuccess) {
        this.data = loadData.data;
      } else {
        this.data = [];
      }
    } else {
      this.data = [];
    }

    this.loading = false;
  }

  resolverRelation() {
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
              // 解析参数
              if (relation.params && relation.params.length > 0) {
                relation.params.forEach(param => {
                  this.tempValue[param['cid']] = option.data[param['pid']];
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
                case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                  break;
                case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                  break;
              }
            }
          });
        }
      });
    }
  }

  // region: build params
  private _buildParameters(paramsConfig) {
    let params;
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        tempValue: this.tempValue,
        initValue: this.initValue
      });
    }
    return params;
  }
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
      const parent = CommonTools.parametersResolver({
        params: ajaxUrl.params,
        tempValue: this.tempValue,
        initValue: this.initValue
      });
    }
    return url;
  }
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }
  private async _load(url, params) {
    return this._http.get(url, params).toPromise();
  }
  // endregion
}

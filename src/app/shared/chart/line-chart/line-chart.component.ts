import { Subscription ,  Observer ,  Observable } from 'rxjs';
// import { DataSet } from '../../../../node_modules/@antv/data-set';
import 'zone.js';
import 'reflect-metadata';
import { Component, NgModule, AfterViewInit, OnInit, ViewEncapsulation, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';
import { BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Chart } from 'viser-ng/lib/Chart';
@Component({
  selector: 'line-chart',
  encapsulation: ViewEncapsulation.None,
  template: `
    <v-chart #chartContainer [forceFit]="config.forceFit" [width]="config.width" [height]="config.height" [data]="data">
      <v-tooltip 
      [g2Tooltip]="g2Tooltip"
      [g2TooltipList]="g2TooltipList"
      [containerTpl]="containerTpl"
      [itemTpl]="itemTpl"
      ></v-tooltip>
        <v-axis></v-axis>
        <v-legend></v-legend>
        <v-line position="{{config.dataKey}}*{{config.value}}" [scale]="config.scale" [color]="config.key"></v-line>
        <v-point position="{{config.dataKey}}*{{config.value}}" shape="{{config.sharp}}" [size]="config.size" [style]="config.style"></v-point>
        
    </v-chart>
  `,
  styles: [
    `
    `
  ]
})
export class LineChartComponent implements OnInit, AfterViewInit {
  @Input() layoutId;
  @Input() blockId;
  @Input() config;

  @ViewChild('chartContainer') chartElement: Chart;

  width;
  data;
  containerTpl = `
  <div class="g2-tooltip">
    <p class="g2-tooltip-title"></p>
    <table class="g2-tooltip-list"></table>
  </div>`;
  itemTpl = `
  <tr class="g2-tooltip-list-item">
    <td style="color:{color}">{name}</td>
    <td>{value}</td>
  </tr>
`;
  g2TooltipList = {
    margin: '10px'
  };
  g2Tooltip = {
    position: 'absolute',
    visibility: 'hidden',
    border: '1px solid #efefef',
    backgroundColor: 'white',
    color: '#000',
    opacity: '0.8',
    padding: '5px 5px',
    transition: 'top 100ms,left 100ms'
  };
  // defaultPoint = { name: 'm2', month: '二月', tem: 9.5, city: '东京' };
  _tempParameters = {};
  _searchParameters = {};
  loading = false;
  _cascadeSubscription: Subscription;
  constructor(
    private _http: ApiService,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
  ) {

  }



  ngOnInit(): void {
    this.width = 500;
    this.resolverRelation();
    // 初始化数据源对象
    // const ds = new DataSet();
    // const dv = ds.createView().source(this.config.data);

    // 转换数据源属性
    // dv.transform({
    //   type: 'fold',
    //   fields: this.config.fields,
    //   key: this.config.key,
    //   value: this.config.value
    // });

    // // 指定数据对象
    // this.data = dv.rows;

    // this.data = this.config.data;

  }
  ngAfterViewInit(): void {

  }

  async load() {
        this.loading = true;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params),
        };
        // console.log('url params', params);
        (async () => {
            const loadData = await this._load(url, params);
            if (loadData && loadData.Status === 200) {
                if (loadData.Data && loadData.Data) {
                    this.data = loadData.Data;
                } else {
                    this.data = [];
                }
            } else {
                this.data = [];
            }
            this.loading = false;
        })();
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
                  this._tempParameters[param['cid']] = option.data[param['pid']];
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
    const params = {};
    if (paramsConfig) {
      paramsConfig.map(param => {
        if (param['type'] === 'tempValue') {
          params[param['name']] = this._tempParameters[param['valueName']];
        } else if (param['type'] === 'value') {
          params[param.name] = param.value;
        } else if (param['type'] === 'GUID') {
          const fieldIdentity = CommonTools.uuID(10);
          params[param.name] = fieldIdentity;
        } else if (param['type'] === 'componentValue') {
          // params[param.name] = componentValue[param.valueName];
        } else if (param['type'] === 'searchValue') {
          if (this._searchParameters[param['name']]) {
            params[param['name']] = this._searchParameters[param['valueName']];
          }
        }
      });
    }
    return params;
  }
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
      const parent = {};
      ajaxUrl.params.map(param => {
        if (param['type'] === 'tempValue') {
          parent[param['name']] = this._tempParameters[param.valueName];
        } else if (param['type'] === 'value') {
          if (param.value === 'null') {
            param.value = null;
          }
          parent[param['name']] = param.value;
        } else if (param['type'] === 'GUID') {
          // todo: 扩展功能
        } else if (param['type'] === 'componentValue') {
          // parent[param['name']] = componentValue[param['valueName']];
        }
      });
    }
    return url;
  }
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }
  private async _load(url, params) {
    return this._http.getProj(url, params).toPromise();
  }
  // endregion
}


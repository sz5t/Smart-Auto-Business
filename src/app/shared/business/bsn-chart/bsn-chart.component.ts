import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit, AfterContentInit } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage } from '@core/relative-Service/BsnTableStatus';
import { Observer, Observable } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'bsn-chart',
  templateUrl: './bsn-chart.component.html',
  // styleUrls: ['./bsn-chart.component.css']
})
export class BsnChartComponent extends CnComponentBase implements OnInit, AfterViewInit, AfterContentInit {
  @Input() public config; // 配置参数
  @Input() public permissions = [];
  @Input() public dataList = []; // 表格数据集合
  @Input() public initData;
  @Input() public casadeData; // 级联配置 liu 20181023
  @Input() public value;
  @Input() public bsnData;
  @Input() public ref;
  // tempValue = {};
  @Output() public updateValue = new EventEmitter();
  @ViewChild('chartContainer') public chartElement: ElementRef;
  public chart;
  cascadeValue: any;
  constructor(
    private _http: ApiService,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private cacheService: CacheService,
    private _dropdownService: NzDropdownService,
    @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
  ) {
    super();
    this.apiResource = this._http;
    this.baseMessage = this._message;
    this.baseModal = this.modalService;
    this.cacheValue = this.cacheService;
  }

  public ngOnInit() {
    console.log('ngOnInit');

  }

  public ngAfterViewInit() {
    console.log('ngAfterViewInit');

    console.log('宽度：', this.chartElement.nativeElement.scrollHeight);
    this.CreateChart();
    console.log('宽度new：', this.chartElement.nativeElement.scrollHeight);
  }
  public ngAfterContentInit() {
    console.log('ngAfterContentInit');

  }

  public async CreateChart() {

    await this.load();
    console.log('准备数据', this.dataList);
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: 400
      // width: this.config.width ? this.config.width : 300, // 指定图表宽度
      //   height: this.config.height ? this.config.height : 300, // 指定图表高度
      // options: this.config.options ? this.config.options : {}
    });
    this.chart.source(this.dataList);
    this.chart.scale(this.config.y, {
      alias: this.config.scale.alias,
      //  tickInterval: 20
    });

    if (this.config.groupName) {
      this.chart.interval().position(this.config.x + '*' + this.config.y).color(this.config.groupName).opacity(1).adjust([{
        type: 'dodge',
        marginRatio: 1 / 32
      }]);  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
    } else {
      this.chart.interval().position(this.config.x + '*' + this.config.y);  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
    }

    this.chart.render();
    console.log('*******');
  }




  public async load() {

    const url = this._buildURL(this.config.ajaxConfig.url);
    const params = {
      ...this._buildParameters(this.config.ajaxConfig.params),
      ...this._buildFilter(this.config.ajaxConfig.filter)
    };

    const method = this.config.ajaxConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.ajaxConfig.ajaxType);
    console.log('执行：', loadData);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
        this.dataList = data;
      } else {
        data = loadData.data;  // data 是数组
        if (data) {
          this.dataList = data;
        } else {
          this.dataList = [];
        }
      }
    } else {
      this.dataList = [];
    }

    console.log('数据', this.dataList);
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
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheService,
        cascadeValue: this.cascadeValue
      });
    }
    return params;
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
  private async _load(url, params, method) {
    const mtd = method === 'proc' ? 'post' : method;
    return this._http[mtd](url, params).toPromise();
  }

}

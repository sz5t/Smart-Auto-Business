import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observer, Observable, Subscription } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'bsn-chart',
  templateUrl: './bsn-chart.component.html',
  // styleUrls: ['./bsn-chart.component.css']
})
export class BsnChartComponent extends CnComponentBase implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
  public cascadeValue: any;
  public _statusSubscription: Subscription;
  public _cascadeSubscription: Subscription;
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
    this.resolverRelation();
  }

  public ngAfterViewInit() {
    this.load();
  }
  public ngAfterContentInit() {


  }

  public async load() {

    await this.load_data();
 
    if (this.config.type) {
      const key = this.config.type;
      switch (key) {
        case 'bar':
          this.CreateChart_Bar()
          break;
        case 'pie':
          this.CreateChart_Pie()
          break;
        case 'line':
          this.CreateChart_Line()
          break;

        default:
          break;
      }
    }
  }

  /**
   * CreateChart_Bar  生成柱状图
   */
  public CreateChart_Bar() {
    console.log('****生成柱状图***');
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      // width: 600,  // 当 forceFit: true  时宽度配置不生效
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.chart.source(this.dataList);
    if (this.config.y.scale) {
      this.chart.scale(this.config.y.name, this.config.y.scale);
    }
    if (this.config.x.scale) {
      this.chart.scale(this.config.x.name, this.config.x.scale);
    }
    if (this.config.x.axis) {
      this.chart.axis(this.config.x.name, this.config.x.axis);
    }
    if (this.config.y.axis) {
      this.chart.axis(this.config.y.name, this.config.y.axis);
    }

    if (this.config.legend) {
      this.chart.legend(this.config.legend);
    }

    if (this.config.groupName) {
      this.chart.interval().position(this.config.x.name + '*' + this.config.y.name).color(this.config.groupName).opacity(1).adjust([{
        type: 'dodge',
        marginRatio: 1 / 32
      }]);  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
    } else {
      this.chart.interval().position(this.config.x.name + '*' + this.config.y.name);  // 创建柱图特殊写法  X*Y  'caseName*caseCount' year*sales
    }

    this.chart.render();
  }
  /**
   * CreateChart_Pie  生成饼图
   */
  public CreateChart_Pie() {
    console.log('****生成饼图***');
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      forceFit: true,
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.chart.source(this.dataList, {
      percent: {
        formatter: function formatter(val) {
          val = val * 100 + '%';
          return val;
        }
      }
    });
    this.chart.coord('theta', {
      radius: 0.75
    });
    this.chart.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });

    if (this.config.legend) {
      this.chart.legend(this.config.legend);
    }
    this.chart.intervalStack().position(this.config.y.name).color(this.config.x.name).label(this.config.y.name, {
      formatter: (val, item) => {
        return item.point[this.config.x.name] + ': ' + val;
      }
    }).tooltip(this.config.x.name + '*' + this.config.y.name, function (item, percent) {
      percent = percent * 100 + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    this.chart.render();
  }

  /**
   * CreateChart_Line  生成折线图
   */
  public CreateChart_Line() {
    console.log('****生成折线图***');

    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.chart.source(this.dataList);
    if (this.config.y.scale) {
      this.chart.scale(this.config.y.name, this.config.y.scale);
    }
    if (this.config.x.scale) {
      this.chart.scale(this.config.x.name, this.config.x.scale);
    }
    if (this.config.x.axis) {
      this.chart.axis(this.config.x.name, this.config.x.axis);
    }
    if (this.config.y.axis) {
      this.chart.axis(this.config.y.name, this.config.y.axis);
    }


    if (this.config.legend) {
      this.chart.legend(this.config.legend);
    }
    this.chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });

    if (this.config.groupName) {
      this.chart.line().position(this.config.x.name + '*' + this.config.y.name).color(this.config.groupName).shape(this.config.shape ? this.config.shape : 'circle');
      this.chart.point().position(this.config.x.name + '*' + this.config.y.name).color(this.config.groupName).size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });

    } else {
      this.chart.line().position(this.config.x.name + '*' + this.config.y.name).shape(this.config.shape ? this.config.shape : 'circle');
      this.chart.point().position(this.config.x.name + '*' + this.config.y.name).size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
    }

    this.chart.render();
  }


  public async load_data() {

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


  private resolverRelation() {
    // 注册按钮状态触发接收器
    this._statusSubscription = this.stateEvents.subscribe(updateState => {
      if (updateState._viewId === this.config.viewId) {
        const option = updateState.option;
        switch (updateState._mode) {
          case BSN_COMPONENT_MODES.REFRESH:
            this.load();
            break;
        }
      }
    });
    // 通过配置中的组件关系类型设置对应的事件接受者
    // 表格内部状态触发接收器console.log(this.config);

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
                if (option) {
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
                }

                // 匹配及联模式
                switch (mode) {
                  case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                    this.load();
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                    this.load();
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN:
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
        }
      );
    }
  }

  public ngOnDestroy() {
    if (this._statusSubscription) {
      this._statusSubscription.unsubscribe();
    }
    if (this._cascadeSubscription) {
      this._cascadeSubscription.unsubscribe();
    }
  }
}

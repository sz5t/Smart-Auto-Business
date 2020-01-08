import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES, BSN_OUTPOUT_PARAMETER_TYPE, BSN_OPERATION_LOG_TYPE, BSN_OPERATION_LOG_RESULT } from '@core/relative-Service/BsnTableStatus';
import { Observer, Observable, Subscription, config } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { getISOYear, getMonth, getDate, getHours, getTime, getMinutes, getSeconds } from 'date-fns';
import { async } from 'q';

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
  public originDv;
  public showdata = []; // 展示的数组
  public showguide = []; // 辅助线的数组
  public guidedataList = []; // 辅助线的数据集合
  public ruledataList = []; // 规则算出的标准值的集合
  public stageRuleDatalist = []; // 阶段开始的标准
  public stageCurrentDatalist = []; // 当前阶段的数组
  public curStage; // 自动播放的阶段变量
  public autoPlay;
  public ds; // 读取的全部数据
  public dv; // 根据要求过滤出的视图
  public datalength; // 真实的数据长度
  public next = 1; // 自动播放的标识变量
  public curNum = 1; // 默认的设备数据阶段
  public StageTime; // 启动阶段的时间
  public Shape; // 自定义样式效果
  public test = []; // 辅助线的图例数组

  public offlineChartData = [
    { 'x': 1570690460771, 'y1': 31, 'y2': 78 },
    { 'x': 1570692260771, 'y1': 15, 'y2': 107 }, { 'x': 1570694060771, 'y1': 68, 'y2': 74 }, { 'x': 1570695860771, 'y1': 107, 'y2': 32 }, { 'x': 1570697660771, 'y1': 43, 'y2': 63 }, { 'x': 1570699460771, 'y1': 45, 'y2': 42 }, { 'x': 1570701260771, 'y1': 93, 'y2': 94 }, { 'x': 1570703060771, 'y1': 12, 'y2': 53 }, { 'x': 1570704860771, 'y1': 108, 'y2': 100 }, { 'x': 1570706660771, 'y1': 56, 'y2': 73 }, { 'x': 1570708460771, 'y1': 48, 'y2': 83 }, { 'x': 1570710260771, 'y1': 67, 'y2': 106 }, { 'x': 1570712060771, 'y1': 52, 'y2': 47 }, { 'x': 1570713860771, 'y1': 89, 'y2': 68 }, { 'x': 1570715660771, 'y1': 44, 'y2': 55 }, { 'x': 1570717460771, 'y1': 80, 'y2': 59 }, { 'x': 1570719260771, 'y1': 86, 'y2': 17 }, { 'x': 1570721060771, 'y1': 26, 'y2': 56 }, { 'x': 1570722860771, 'y1': 78, 'y2': 69 }, { 'x': 1570724660771, 'y1': 46, 'y2': 67 }]

  // tempValue = {};
  @Output() public updateValue = new EventEmitter();
  @ViewChild('chartContainer') public chartElement: ElementRef;
  public chart;
  public slider;
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
    if (this.config.componentType &&
      this.config.componentType.own === true) {
      this.load();
    }

  }
  public ngAfterContentInit() {


  }

  public async load() {

    await this.load_data(1);
    if (this.config.ruleConfig) {
      await this.load_rule_data();
      if (this.config.curStageConfig) {
        await this.load_current_stage_data();
      }
    }
    if (this.config.haveGuide && this.config.showGuide && this.config.guideConfig) {
      await this.load_guide();
    }
    if (this.config.showPointStyle) {
      this.writePointStyle();
    }


    // setTimeout(() => {
    if (this.config.type) {
      // if (this.chart) {
      //   this.chart.clear();
      // }
      const key = this.config.type;
      switch (key) {
        case 'bar':
          this.CreateChart_Bar()
          break;
        case 'mini_bar':
          this.CreateChart_MiniBar()
          break;
        case 'pie':
          this.CreateChart_Pie()
          break;
        case 'timeline':
          this.CreateChart_Time_Line()
          break;
        case 'line':
          this.CreateChart_Line()
          break;
        case 'mini_line':
          this.CreateChart_MiniLine()
          break;
        default:
          break;
      }
    }
    // }, 3000);

  }

  /**
   * CreateChart_Bar  生成柱状图
   */
  public CreateChart_Bar() {
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

  public CreateChart_MiniBar() {
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
    if (this.config.tooltipMini) {
      this.chart.legend(false);
      this.chart.axis(false);
      this.chart.tooltip(
        this.config.tooltipMini
      );
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
    if (this.config.tooltipMini) {
      this.chart.legend(false);
      this.chart.axis(false);
      this.chart.tooltip(
        this.config.tooltipMini
      );
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

  private CreateChart_Time_Line() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    const x = this.config.x.name;
    const data = this.showdata;
    if (data.length < this.config.showDataLength) {
      this.ds = new DataSet({
        state: {
          from: new Date(this.dataList[0][x]).getTime(),
          to: new Date(this.dataList[data.length - 1][x]).getTime()
        }
      });
    } else {
      this.ds = new DataSet({
        state: {
          from: new Date(this.dataList[0][x]).getTime(),
          to: new Date(this.dataList[this.config.showDataLength - 1][x]).getTime()
        }
      });
    }
    if (this.config.y.scale) {
      this.chart.scale(this.config.y.name, this.config.y.scale);
    }
    if (this.config.x.scale) {
      this.chart.scale(this.config.x.name, this.config.x.scale);
    }
    if (this.config.y1) {
      if (this.config.y1.scale) {
        this.chart.scale(this.config.y1.name, this.config.y1.scale);
      }
      if (this.config.y1.axis) {
        this.chart.axis(this.config.y1.name, this.config.y1.axis);
      }
    }
    if (this.config.x.axis) {
      const format = {
        label: {
          formatter: val => {
            // console.log(this.stageCurrentDatalist);
            let xformat;
            this.stageCurrentDatalist.forEach(s => {
              if (s.starttime) {
                if (s.endtime) {
                  if (this.transStringTime(val) >= this.transStringTime(s.starttime) && this.transStringTime(val) < this.transStringTime(s.endtime)) {
                    xformat = s.stage
                  }
                } else {
                  if (this.transStringTime(val) >= this.transStringTime(s.starttime)) {
                    xformat = s.stage
                  }
                }
              }
            })
            if (!xformat) {
              // xformat = 1;
              return val;
            }
            return val + '  ' + '第' + xformat + '阶段'; // 格式化坐标轴显示文本
          },
        }
      }
      this.config.x.axis = { ...this.config.x.axis, ...format }
      this.chart.axis(this.config.x.name, this.config.x.axis);
    }
    if (this.config.y.axis) {
      this.chart.axis(this.config.y.name, this.config.y.axis);
    }
    this.dv = this.ds.createView();

    if (this.config.guideConfig && this.config.showGuide && this.config.guideConfig.guideType !== 'line') {
      if (this.config.guideScale) {
        if (this.config.guideScale.y) {
          let grouptext;
          for (let i = 0; i < this.config.guideScale.y.length; i++) {
            if (grouptext) {
              grouptext += this.config.guideScale.y[i]['name'] + ','
            } else {
              grouptext = this.config.guideScale.y[i]['name'] + ','
            }
          }
          grouptext = grouptext.substring(0, grouptext.length - 1);
          this.test = grouptext.split(',');
          this.dv.source(data)
            .transform({
              type: 'filter',
              callback: obj => {
                const a = new Date(obj[x]);
                return (new Date(obj[x])).getTime() >= this.ds.state.from && (new Date(obj[x])).getTime() <= this.ds.state.to;
              }
            })
            .transform({
              type: 'fold',
              fields: [this.config.y.name, this.test[0], this.test[1]], // 展开字段集
              key: 'city', // key字段
              value: 'value' // value字段
            });
        }
      }
    } else {
      this.dv.source(data)
        .transform({
          type: 'filter',
          callback: obj => {
            const a = new Date(obj[x]);
            return (new Date(obj[x])).getTime() >= this.ds.state.from && (new Date(obj[x])).getTime() <= this.ds.state.to;
          }
        });
    }
    const max = this.config.y.max ? this.config.y.max : 300;
    const min = this.config.y.min ? this.config.y.min : 0;
    if (this.config.y1) {
      const y1max = this.config.y1.max ? this.config.y1.max : 300;
      const y1min = this.config.y1.min ? this.config.y1.min : 0;
      this.chart.source(this.dv, {
        [this.config.y1.name]: {
          min: [y1min],
          max: [y1max],
          tickInterval: [this.config.y1.scale.tickInterval],
          alias: [this.config.y1.scale.alias]
        }
      });
    }

    this.chart.source(this.dv, {
      [this.config.y.name]: {
        min: [min],
        max: [max],
        tickInterval: [this.config.y.scale.tickInterval],
        alias: [this.config.y.scale.alias]
      }
    });
    if (this.config.guideConfig && this.config.showGuide && this.config.guideConfig.guideType !== 'line') {
      if (this.config.guideScale) {
        if (this.config.guideScale.y) {
          this.config.guideScale.y.forEach(e => {
            this.chart.line().position(this.config.x.name + '*' + this.config.y.name).color('city').shape(this.config.shape ? this.config.shape : 'circle');
            // this.chart.point().position(this.config.x.name + '*' + this.config.y.name).color(e.name).size(4).shape('circle').style({
            //   stroke: '#fff',
            //   lineWidth: 1
            // });
          });
        }
      }
    } else {
      this.chart.line().position(this.config.x.name + '*' + this.config.y.name).shape(this.config.shape ? this.config.shape : 'circle');
      if (this.config.showPointStyle) {
        if (this.config.guideConfig) {
          this.chart.point().position(this.config.x.name + '*' + this.config.y.name).size(4).shape('overyGuide').style({
            stroke: '#fff',
            lineWidth: 1
          });
        }
        if (this.config.ruleConfig && this.config.ruleConfig.rule) {
          this.chart.point().position(this.config.x.name + '*' + this.config.y.name).size(4).shape('notEqualPlan').style({
            stroke: '#fff',
            lineWidth: 1
          });
        }
      } else {
        this.chart.point().position(this.config.x.name + '*' + this.config.y.name).size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        });
      }
      if (this.config.y1) {
        this.chart.line().position(this.config.x.name + '*' + this.config.y1.name).shape(this.config.shape ? this.config.shape : 'circle').color(this.config.y1color ? this.config.y1color : '#FFCC00');
        if (this.config.ruleConfig && this.config.ruleConfig.y1max) {
          this.chart.point().position(this.config.x.name + '*' + this.config.y1.name).size(4).shape('overy1Guide').style({
            stroke: '#fff',
            lineWidth: 1
          })
        } else {
          this.chart.point().position(this.config.x.name + '*' + this.config.y1.name).color(this.config.y1color ? this.config.y1color : '#FFCC00').size(4).shape('circle').style({
            stroke: '#fff',
            lineWidth: 1
          });
        }
      }
    };
    if (this.config.groupName) {
      this.chart.line().position(this.config.x.name + '*' + this.config.y.name).color(this.config.groupName).shape(this.config.shape ? this.config.shape : 'circle');
      this.chart.point().position(this.config.x.name + '*' + this.config.y.name).color(this.config.groupName).size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
    }
    // 有图表标记，最值，辅助线，超标点的样式等
    if (this.config.haveGuide) {
      this.allGuide(this.chart);
    }
    // 没有自动加载数据的滑块
    if (this.config.showSlider && !this.config.autoPlay) {
      this.slider = new Slider({
        container: document.getElementById('slider'),
        padding: [0, 100, 0],
        start: this.ds.state.from,
        end: this.ds.state.to,
        data,
        xAxis: this.config.x.name,
        yAxis: this.config.y.name,
        backgroundChart: {
          type: 'line',
          color: 'grey'
        },
        scales:
        {
          [x]: {
            formatter: (val) => {
              return `${getISOYear(val)}-${getMonth(val) + 1}-${getDate(val)}${' '}${getHours(getTime(val))}${':'}${getMinutes(getTime(val))}${':'}${getSeconds(getTime(val))}`;
            }
          }
        },
        onChange: (_ref) => {
          const startValue = _ref.startValue, endValue = _ref.endValue;
          this.ds.setState('from', startValue);
          this.ds.setState('to', endValue);
          setTimeout(() => {
            // this.chart.guide().clear();
            this.allGuide(this.chart, startValue, endValue);
            // this.chart.render();
          });

        }
      });

      this.slider.render();
    }
    // 有自动加载数据的滑块
    if (this.config.showSlider && this.config.autoPlay) {
      // this.originDv = this.ds.createView('origin');
      // this.originDv.source(this.showdata).transform({
      //   type: 'fold',
      //   fields: [this.config.y.name],
      //   retains: [this.config.y.name, this.config.x.name]
      // }).transform({
      //   type: 'filter',
      //   callback: (obj) => {
      //     const time = new Date(obj.monitortime).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
      //     return time >= this.ds.state.from && time <= this.ds.state.to;
      //   }
      // });
      this.slider = new Slider({
        container: 'slider',
        start: this.ds.state.from, // 和状态量对应
        end: this.ds.state.to,
        xAxis: this.config.x.name,
        yAxis: this.config.y.name,
        data: this.showdata,
        backgroundChart: {
          type: 'line',
          color: 'grey'
        },
        scales:
        {
          [x]: {
            formatter: (val) => {
              return `${getISOYear(val)}-${getMonth(val) + 1}-${getDate(val)}${' '}${getHours(getTime(val))}${':'}${getMinutes(getTime(val))}${':'}${getSeconds(getTime(val))}`;
            }
          }
        },
        onChange: (_ref) => {
          const startValue = _ref.startValue, endValue = _ref.endValue;
          this.ds.setState('from', startValue);
          this.ds.setState('to', endValue);
          setTimeout(() => {
            // this.chart.guide().clear();
            this.allGuide(this.chart, startValue, endValue);
            // this.chart.render();
          });
        }
      });
      this.slider.render();
      // this.chart.interact('slider', this.slider);
    }

    this.chart.render();
    if (this.config.autoPlay) {
      const that = this;
      this.autoPlay = setInterval(async () => {
        await that.load_data(2);
        this.next = this.next + 1;
        if (this.showdata[this.config.showDataLength - 1]) {
          if (this.dataList[this.dataList.length - 1] !== this.showdata[this.config.showDataLength - 1]) {
            this.showdata.shift();
            // if (this.next === 2) {
            this.showdata.push(this.dataList[this.config.showDataLength - 2 + this.next]);
            // } else {
            //   this.showdata.push(this.dataList[this.config.showDataLength - 1 + this.next]);
            // }
            if (this.config.stageRuleConfig) {
              if (!this.curStage) {
                this.curStage = 1;
              }
              const tempStage = this.curStage;
              if (this.showdata[this.config.showDataLength - 1]) {
                this.setDataStage('dynamic', this.showdata[this.config.showDataLength - 1], this.curStage);
              }
              if (this.config.curStageConfig) {
                await this.load_current_stage_data();
              }

              // for (let i = 0; i < this.stageCurrentDatalist.length; i++) {
              //   if (!this.stageCurrentDatalist[i]['starttime']) {
              //     this.curStage = this.stageCurrentDatalist[i]['stage'];
              //     break;
              //   } else {
              //     this.curStage = this.stageCurrentDatalist[this.stageCurrentDatalist.length - 1]['stage'];
              //   }
              // }
              // console.log('tempStage', tempStage);
              // console.log('this.curStage', this.curStage);
              if (this.curStage !== 1 && tempStage === this.curStage) {
                this.curNum += 1;
              } else {
                this.curNum = 1;
              }
              // console.log('this.curNum', this.curNum);
              // if (this.curStage === 2 ) {
              this.showdata[this.config.showDataLength - 1]['stage'] = this.curStage - 1;
              this.showdata[this.config.showDataLength - 1]['number'] = this.curNum;
              // } else {
              //   this.showdata[this.config.showDataLength - 1]['stage'] = this.curStage;
              //   this.showdata[this.config.showDataLength - 1]['number'] = this.curNum;
              // }
              // console.log(this.showdata[this.config.showDataLength - 1]);
            }
            this.slider.start = new Date(this.showdata[0][this.config.x.name].replace(/-/g, '/')).getTime();
            this.slider.end = new Date(this.showdata[this.config.showDataLength - 1][this.config.x.name].replace(/-/g, '/')).getTime();
            if (this.config.guideConfig.guideType !== 'line') {
              this.ds.state.from = new Date(this.showdata[0][that.config.x.name]).getTime();
              this.ds.state.to = new Date(this.showdata[this.showdata.length - 1][that.config.x.name]).getTime();
              this.dv.source(this.showdata);
              this.chart.changeData(this.dv);
            } else {
              this.chart.changeData(this.showdata);
            }
            setTimeout(() => {
              // this.chart.guide().clear();
              this.allGuide(this.chart, this.slider.start, this.slider.end);
              this.chart.repaint();
            });
            this.slider.changeData(this.showdata);
          }
        } else {
          this.operationAjax(this.showdata[this.config.showDataLength - 2][this.config.x.name], 'finish');
          if (this.autoPlay) {
            clearInterval(this.autoPlay);
          }
        }
      }, this.config.intervalTime)
    }
  }

  public CreateChart_MiniLine() {

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
    if (this.config.tooltipMini) {
      this.chart.legend(false);
      this.chart.axis(false);
      this.chart.tooltip(
        this.config.tooltipMini
      );
      this.chart.guide().html({
        position: ['120%', '0%'],
        html: '<div class="g2-guide-html"><p class="title">总计</p><p class="value">' + '' + '</p></div>'
      });
    }


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

  public async load_data(temp) {
    const url = this._buildURL(this.config.ajaxConfig.url);
    const params = {
      ...this._buildParameters(this.config.ajaxConfig.params),
      ...this._buildFilter(this.config.ajaxConfig.filter)
    };
    const method = this.config.ajaxConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.ajaxConfig.ajaxType);
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
    if (temp === 1) {
      if (this.config.showDataLength && this.config.autoPlay) {
        if (this.dataList.length > this.config.showDataLength) {
          for (let i = 0; i < this.config.showDataLength; i++) {
            this.showdata.push(this.dataList[i]);
          }
        } else {
          this.showdata = this.dataList;
        }
      } else {
        this.showdata = this.dataList;
      }
    }
    if (this.config.stageRuleConfig) {
      await this.load_stage_rule_data();
    }
    if (this.config.haveStage && temp === 1) {
      this.curStage = 1;
      this.setDataStage('static', this.showdata, this.curStage);
    }

    if (this.config.haveStage && !this.config.autoPlay) {
      this.setDataStage('static', this.showdata);
    }
  }

  public async load_guide() {
    const url = this._buildURL(this.config.guideConfig.url);
    const params = {
      ...this._buildParameters(this.config.guideConfig.params),
      ...this._buildFilter(this.config.guideConfig.filter)
    };
    const method = this.config.guideConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.guideConfig.ajaxType);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
        this.guidedataList = data;
      } else {
        data = loadData.data;  // data 是数组
        if (data) {
          this.guidedataList = data;
        } else {
          this.guidedataList = [];
        }
      }
    } else {
      this.guidedataList = [];
    }
    if (this.config.showDataLength) {
      if (this.guidedataList.length > this.config.showDataLength) {
        for (let i = 0; i < this.config.showDataLength; i++) {
          this.showguide.push(this.guidedataList[i]);
        }
      } else {
        this.showguide = this.guidedataList;
      }
    } else {
      this.showguide = this.guidedataList;
    }
  }

  public async load_rule_data() {
    const url = this._buildURL(this.config.ruleConfig.url);
    const params = {
      ...this._buildParameters(this.config.ruleConfig.params),
      ...this._buildFilter(this.config.ruleConfig.filter)
    };
    const method = this.config.ruleConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.ruleConfig.ajaxType);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
        this.ruledataList = data;
      } else {
        data = loadData.data;  // data 是数组
        if (data) {
          this.ruledataList = data;
        } else {
          this.ruledataList = [];
        }
      }
    } else {
      this.ruledataList = [];
    }
  }

  public async load_stage_rule_data() {
    const url = this._buildURL(this.config.stageRuleConfig.url);
    const params = {
      ...this._buildParameters(this.config.stageRuleConfig.params),
      ...this._buildFilter(this.config.stageRuleConfig.filter)
    };
    const method = this.config.stageRuleConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.ruleConfig.ajaxType);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
        this.stageRuleDatalist = data;
      } else {
        data = loadData.data;  // data 是数组
        if (data) {
          this.stageRuleDatalist = data;
        } else {
          this.stageRuleDatalist = [];
        }
      }
    } else {
      this.stageRuleDatalist = [];
    }
  }

  public async load_current_stage_data() {
    const url = this._buildURL(this.config.curStageConfig.url);
    const params = {
      ...this._buildParameters(this.config.curStageConfig.params),
      ...this._buildFilter(this.config.curStageConfig.filter)
    };
    const method = this.config.curStageConfig.ajaxType;
    const loadData = await this._load(url, params, this.config.ruleConfig.ajaxType);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
        this.stageCurrentDatalist = data;
      } else {
        data = loadData.data;  // data 是数组
        if (data) {
          this.stageCurrentDatalist = data;
        } else {
          this.stageCurrentDatalist = [];
        }
      }
    } else {
      this.stageCurrentDatalist = [];
    }
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
        initValue: this.initData,
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
    // 表格内部状态触发接收器

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
                    if (this.chart) {
                      this.chart.destroy();
                    }
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
    if (this.autoPlay) {
      clearInterval(this.autoPlay);
    }
  }

  // 静态图表计算峰值
  public findMaxMin(start?, end?, e?) {
    if (start && end) {
      if (!e) {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        // const length = this.dataList.length > this.config.showDataLength ? this.config.showDataLength : this.dataList.length
        const length = this.dataList.length;
        for (let i = 0; i < length; i++) {
          // 日期转时间戳进行比较
          const d = this.dataList[i];
          let date = this.dataList[i][this.config.x.name];
          date = date.replace(/-/g, '/');
          date = new Date(date).getTime();
          if (date >= start && date <= end) {
            if (d[this.config.y.name] >= maxValue) {
              maxValue = d[this.config.y.name];
              maxObj = d;
            }
            if (d[this.config.y.name] < minValue) {
              minValue = d[this.config.y.name];
              minObj = d;
            }
          }
        }
        return {
          max: maxObj,
          min: minObj
        };
      } else {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        const length = this.dataList.length > this.config.showDataLength ? this.config.showDataLength : this.dataList.length
        for (let i = 0; i < length; i++) {
          const d = this.dataList[i];
          if (d[this.config.groupName] === e) {
            if (d[this.config.y.name] >= maxValue) {
              maxValue = d[this.config.y.name];
              maxObj = d;
            }
            if (d[this.config.y.name] < minValue) {
              minValue = d[this.config.y.name];
              minObj = d;
            }
          }
        }
        return {
          max: maxObj,
          min: minObj
        };
      }
    } else {
      if (start) {
        e = start
      }
      if (!e) {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        const length = this.dataList.length > this.config.showDataLength ? this.config.showDataLength : this.dataList.length
        for (let i = 0; i < length - 1; i++) {
          const d = this.dataList[i];
          if (d[this.config.y.name] >= maxValue) {
            maxValue = d[this.config.y.name];
            maxObj = d;
          }
          if (d[this.config.y.name] < minValue) {
            minValue = d[this.config.y.name];
            minObj = d;
          }
        }
        return {
          max: maxObj,
          min: minObj
        };
      } else {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        const length = this.dataList.length > this.config.showDataLength ? this.config.showDataLength : this.dataList.length
        for (let i = 0; i < length - 1; i++) {
          const d = this.dataList[i];
          if (d[this.config.groupName] === e) {
            if (d[this.config.y.name] >= maxValue) {
              maxValue = d[this.config.y.name];
              maxObj = d;
            }
            if (d[this.config.y.name] < minValue) {
              minValue = d[this.config.y.name];
              minObj = d;
            }
          }
        }
        return {
          max: maxObj,
          min: minObj
        };
      }
    }
  }

  // 动态轮播最大值最小值计算
  public findMax() {
    let maxValue = 0;
    let maxObj = null;
    for (let i = 0; i < this.showdata.length; i++) {
      let d = this.showdata[i];
      if (d[this.config.y.name] > maxValue) {
        maxValue = d[this.config.y.name];
        maxObj = d;
      }
    }
    return maxObj;
  }

  public findMin() {
    let minValue = 50000;
    let minObj = null;
    for (let i = 0; i < this.showdata.length; i++) {
      let d = this.showdata[i];
      if (d[this.config.y.name] < minValue) {
        minValue = d[this.config.y.name];
        minObj = d;
      }
    }
    return minObj;
  }

  // 辅助标记的总方法
  public allGuide(charts?, start?, end?) {
    charts.guide().clear();
    if (this.config.showGuide) {
      this.writeguide(charts, start, end);
    }
    if (this.config.peakValue || this.config.eachPeakValue) {
      this.writepoint(charts, start, end);
    }
  }

  // 绘制最值标记点
  public writepoint(charts?, start?, end?) {
    if (!this.config.autoPlay) {
      if (this.config.peakValue) {
        if (!this.config.eachPeakValue) {
          const max_min = this.findMaxMin(start, end);
          const max = max_min.max;
          const min = max_min.min;
          if (max_min) {
            charts.guide().dataMarker({
              top: true,
              content: '峰值：' + max[this.config.y.name],
              position: [max[this.config.x.name], max[this.config.y.name]],
              style: {
                text: {
                  fontSize: 13,
                  stroke: 'white',
                  lineWidth: 2
                }
              },
              lineLength: 40
            });
            charts.guide().dataMarker({
              top: true,
              content: '谷值：' + min[this.config.y.name],
              position: [min[this.config.x.name], min[this.config.y.name]],
              style: {
                text: {
                  fontSize: 13,
                  stroke: 'white',
                  lineWidth: 2
                }
              },
              lineLength: 50
            });
          }
        } else {
          const group = [];
          group.push(this.dataList[0][this.config.groupName]);
          for (let i = 0; i < this.dataList.length; i++) {
            for (let j = 0; j < group.length; j++) {
              if (!group.includes(this.dataList[i][this.config.groupName])) {
                // if (this.dataList[i][this.config.groupName] !== group[group.length - 1]) {
                group.push(this.dataList[i][this.config.groupName]);
              }
            }
          }
          group.forEach(element => {
            const max_min = this.findMaxMin(start, end, element);
            const max = max_min.max;
            const min = max_min.min;
            if (max_min) {
              charts.guide().dataMarker({
                top: true,
                content: element + '的峰值：' + max[this.config.y.name],
                position: [max[this.config.x.name], max[this.config.y.name]],
                style: {
                  text: {
                    fontSize: 13,
                    stroke: 'white',
                    lineWidth: 2
                  }
                },
                lineLength: 30
              });
              charts.guide().dataMarker({
                top: true,
                content: element + '的谷值：' + min[this.config.y.name],
                position: [min[this.config.x.name], min[this.config.y.name]],
                style: {
                  text: {
                    fontSize: 13,
                    stroke: 'white',
                    lineWidth: 2
                  }
                },
                lineLength: 50
              });

            }
          });
        }
      }
    } else {
      // 标记最大值
      const maxobj = this.findMax();
      const minobj = this.findMin();
      charts.guide().dataMarker({
        top: true,
        content: '当前峰值:' + maxobj[this.config.y.name],
        position: () => {
          if (maxobj) {
            return [maxobj[this.config.x.name], maxobj[this.config.y.name]];
          }
          return [0, 0];
        },
        style: {
          text: {
            fontSize: 13
          },
          point: {
            stroke: '#606060'
          }
        },
        lineLength: 50
      });

      // 标记最小值
      charts.guide().dataMarker({
        top: true,
        content: '当前谷值:' + minobj[this.config.y.name],
        position: () => {
          if (minobj) {
            return [minobj[this.config.x.name], minobj[this.config.y.name]];
          }
          return [0, 0];
        },
        style: {
          text: {
            fontSize: 13
          },
          point: {
            stroke: '#606060'
          }
        },
        lineLength: 50
      });
    }
  }

  // 绘制辅助线
  public writeguide(charts?, start?, end?) {
    // 动态的辅助线
    if (this.config.guideConfig) {
      // 解析相关字段
      const maxvalue = this.config.guide.maxvalue;
      const minvalue = this.config.guide.minvalue;
      const starttime = this.config.guide.start;
      const endtime = this.config.guide.end;
      const type = this.config.guide.type;
      // 辅助线展示的起始
      let lineStartTime;
      let lineEndTime;
      if (!start) {
        start = this.dv.rows[0][this.config.x.name];
        end = this.dv.rows[this.dv.rows.length - 1][this.config.x.name];
        if (this.config.guideConfig.guideType === 'line') {
          this.showguide.forEach(e => {
            if (e[starttime] <= end) {
              lineEndTime = e[endtime] < end ? e[endtime] : end
              const toptext = this.config.guideConfig.toptext ? this.config.guideConfig.toptext : '预警上限';
              const floortext = this.config.guideConfig.floortext ? this.config.guideConfig.floortext : '预警下限';
              const textcolor = this.config.guideConfig.textcolor ? this.config.guideConfig.textcolor : '#F5222D';
              const guidelinecolor = this.config.guideConfig.guidelinecolor ? this.config.guideConfig.guidelinecolor : '#F5222D';
              charts.guide().line({
                top: true,
                start: [e[starttime], e[maxvalue]],
                end: [lineEndTime, e[maxvalue]],
                lineStyle: {
                  stroke: guidelinecolor,
                  lineWidth: 2
                },
                text: {
                  content: [toptext],
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: textcolor,
                    opacity: 0.5
                  }
                }
              });
              charts.guide().line({
                top: true,
                start: [e[starttime], e[minvalue]],
                end: [lineEndTime, e[minvalue]],
                lineStyle: {
                  stroke: guidelinecolor,
                  lineWidth: 2
                },
                text: {
                  content: [floortext],
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: textcolor,
                    opacity: 0.5
                  }
                }
              });
              // 对相关曲线进行染色处理
              // if (this.config.guideColor) {
              //   const areacolor = this.config.guideColor.color ? this.config.guideColor.color : '#FF4D4F';
              //   charts.guide().regionFilter({
              //     top: true,
              //     start: [e[starttime], e[maxvalue]],
              //     end: [lineEndTime, 'max'],
              //     color: areacolor
              //   });
              //   charts.guide().regionFilter({
              //     top: true,
              //     start: [e[starttime], e[minvalue]],
              //     end: [lineEndTime, 'min'],
              //     color: areacolor
              //   });
              // }
            }
          });
        } else if (this.config.guideConfig && this.config.guideConfig.guideType === 'circle') {
          this.chart.point().position(this.config.x.name + '*' + 'value').color('city').shape('overyGuide');
        }
      } else {
        // 带状区域的辅助线
        if (this.config.guideConfig.guideType === 'line') {
          // 库里面的基线的起始
          let dataStartTime;
          let dataEndTime;
          // 用时间戳的判断
          this.showguide.forEach(e => {
            dataStartTime = new Date(e[starttime].replace(/-/g, '/')).getTime();
            dataEndTime = new Date(e[endtime].replace(/-/g, '/')).getTime();
            if (dataStartTime <= end) {
              if (dataEndTime > start) {
                lineStartTime = start > dataStartTime ? start : dataStartTime;
                lineEndTime = end > dataEndTime ? dataEndTime : end;
                lineStartTime = this.transTimeString(lineStartTime);
                lineEndTime = this.transTimeString(lineEndTime);
                const toptext = this.config.guideConfig.toptext ? this.config.guideConfig.toptext : '预警上限';
                const floortext = this.config.guideConfig.floortext ? this.config.guideConfig.floortext : '预警下限';
                const textcolor = this.config.guideConfig.textcolor ? this.config.guideConfig.textcolor : '#F5222D';
                const guidelinecolor = this.config.guideConfig.guidelinecolor ? this.config.guideConfig.guidelinecolor : '#F5222D';
                charts.guide().line({
                  top: true,
                  start: [lineStartTime, e[maxvalue]],
                  end: [lineEndTime, e[maxvalue]],
                  lineStyle: {
                    stroke: guidelinecolor,
                    lineWidth: 2
                  },
                  text: {
                    content: [toptext],
                    position: 'start',
                    offsetX: 20,
                    offsetY: -5,
                    style: {
                      fontSize: 14,
                      fill: textcolor,
                      opacity: 0.5
                    }
                  }
                });
                charts.guide().line({
                  top: true,
                  start: [lineStartTime, e[minvalue]],
                  end: [lineEndTime, e[minvalue]],

                  lineStyle: {
                    stroke: guidelinecolor,
                    lineWidth: 2
                  },
                  text: {
                    content: [floortext],
                    position: 'start',
                    offsetX: 20,
                    offsetY: -5,
                    style: {
                      fontSize: 14,
                      fill: textcolor,
                      opacity: 0.5
                    }
                  }
                });
                // if (this.config.guideColor) {
                //   const areacolor = this.config.guideColor.color ? this.config.guideColor.color : '#FF4D4F';
                //   charts.guide().regionFilter({
                //     top: true,
                //     start: [e[starttime], e[maxvalue]],
                //     end: [lineEndTime, 'max'],
                //     color: areacolor
                //   });
                //   charts.guide().regionFilter({
                //     top: true,
                //     start: [e[starttime], e[minvalue]],
                //     end: [lineEndTime, 'min'],
                //     color: areacolor
                //   });
                // }
              }
            }
          });
        } else if (this.config.guideConfig.guideType === 'circle') {
          // this.chart.point().position(this.config.x.name + '*' + 'value').color('city').shape('overGuide');
        }
      }
    }
  }

  // 时间戳转时间字符串
  public transTimeString(time) {
    return `${getISOYear(time)}-${getMonth(time) + 1}-${getDate(time)}${' '}${getHours(getTime(time))}${':'}${getMinutes(getTime(time))}${':'}${getSeconds(getTime(time))}`;
  }

  // 字符串转时间戳
  public transStringTime(string) {
    return new Date(string.replace(/-/g, '/')).getTime();
  }

  // 对点，线的样式进行自定义
  public writePointStyle() {
    this.Shape = G2.Shape;
    const that = this;
    const lineguide = this.showguide;
    // y辅助线超过的部分标识点的样式
    if (this.config.guideConfig) {
      this.Shape.registerShape('point', 'overyGuide', {
        draw(cfg, container) {
          const data = cfg.origin._origin;
          // console.log('cfg', cfg);
          // console.log('data', data);
          const point = {
            x: cfg.x,
            y: cfg.y
          };
          const guideColor = that.config.guideConfig.pointColor ? that.config.guideConfig.pointColor : '#DC143C'
          if (that.config.guideConfig.guideType !== 'line') {
            if (data.city === that.config.y.name) {
              that.showdata.forEach(e => {
                if (e[that.config.y.name] > e[that.test[1]] || e[that.config.y.name] < e[that.test[0]]) {
                  const search = that.showdata.find(s => s.Id === e.Id);
                  if (data.Id === search.Id) {
                    const decorator1 = container.addShape('circle', {
                      attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: guideColor,
                        opacity: 0.5
                      }
                    });
                    const decorator2 = container.addShape('circle', {
                      attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: guideColor,
                        opacity: 0.5
                      }
                    });
                    const decorator3 = container.addShape('circle', {
                      attrs: {
                        x: point.x,
                        y: point.y,
                        r: 10,
                        fill: guideColor,
                        opacity: 0.5
                      }
                    });
                    decorator1.animate({
                      r: 20,
                      opacity: 0,
                      repeat: true
                    }, 1500, 'easeLinear');
                    decorator2.animate({
                      r: 20,
                      opacity: 0,
                      repeat: true
                    }, 1500, 'easeLinear', function () { }, 600);
                    decorator3.animate({
                      r: 20,
                      opacity: 0,
                      repeat: true
                    }, 1500, 'easeLinear', function () { }, 1200);
                    container.addShape('circle', {
                      attrs: {
                        x: point.x,
                        y: point.y,
                        r: 6,
                        fill: guideColor,
                        opacity: 0.7
                      }
                    });
                    container.addShape('circle', {
                      attrs: {
                        x: point.x,
                        y: point.y,
                        r: 1.5,
                        fill: guideColor
                      }
                    });
                  }
                }
              });
            }
          } else {
            that.showdata.forEach(e => {
              lineguide.forEach(t => {
                const btime = that.transStringTime(t[that.config.guide.start]);
                const etime = that.transStringTime(t[that.config.guide.end]);
                const datatime = that.transStringTime(e[that.config.x.name]);
                if (datatime >= btime && datatime <= etime) {
                  if (e[that.config.y.name]) {
                    if (e[that.config.y.name] > t[that.config.guide.maxvalue] || e[that.config.y.name] < t[that.config.guide.minvalue]) {
                      const search = that.showdata.find(s => s.Id === e.Id);
                      if (data.Id === search.Id) {
                        const decorator1 = container.addShape('circle', {
                          attrs: {
                            x: point.x,
                            y: point.y,
                            r: 10,
                            fill: guideColor,
                            opacity: 0.5
                          }
                        });
                        const decorator2 = container.addShape('circle', {
                          attrs: {
                            x: point.x,
                            y: point.y,
                            r: 10,
                            fill: guideColor,
                            opacity: 0.5
                          }
                        });
                        const decorator3 = container.addShape('circle', {
                          attrs: {
                            x: point.x,
                            y: point.y,
                            r: 10,
                            fill: guideColor,
                            opacity: 0.5
                          }
                        });
                        decorator1.animate({
                          r: 20,
                          opacity: 0,
                          repeat: true
                        }, 1800, 'easeLinear');
                        decorator2.animate({
                          r: 20,
                          opacity: 0,
                          repeat: true
                        }, 1800, 'easeLinear', function () { }, 600);
                        decorator3.animate({
                          r: 20,
                          opacity: 0,
                          repeat: true
                        }, 1800, 'easeLinear', function () { }, 1200);
                        container.addShape('circle', {
                          attrs: {
                            x: point.x,
                            y: point.y,
                            r: 6,
                            fill: guideColor,
                            opacity: 0.7
                          }
                        });
                        container.addShape('circle', {
                          attrs: {
                            x: point.x,
                            y: point.y,
                            r: 1.5,
                            fill: guideColor
                          }
                        });
                      }
                    }
                  }
                }
              })
            });
          }
        }
      });
    }

    // y1辅助线超过的部分标识点的样式
    if (this.config.ruleConfig.y1max) {
      this.Shape.registerShape('point', 'overy1Guide', {
        draw(cfg, container) {
          const data = cfg.origin._origin;
          // console.log('cfg', cfg);
          // console.log('data', data);
          const point = {
            x: cfg.x,
            y: cfg.y
          };
          let y1max;
          that.stageRuleDatalist.forEach(r => {
            if (r.filed === that.config.y1.name) {
              y1max = r.filedvalue
            }
          });
          const y1Color = that.config.ruleConfig.overy1color ? that.config.ruleConfig.overy1color : '#FF6600'
          that.showdata.forEach(e => {
            if (e[that.config.y1.name]) {
              if (e[that.config.y1.name] > y1max) {
                const search = that.showdata.find(s => s.Id === e.Id);
                if (data.Id === search.Id) {
                  const decorator1 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: y1Color,
                      opacity: 0.5
                    }
                  });
                  const decorator2 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: y1Color,
                      opacity: 0.5
                    }
                  });
                  const decorator3 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: y1Color,
                      opacity: 0.5
                    }
                  });
                  decorator1.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear');
                  decorator2.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 600);
                  decorator3.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 1200);
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 6,
                      fill: y1Color,
                      opacity: 0.7
                    }
                  });
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 1.5,
                      fill: y1Color
                    }
                  });
                }
              }
            }
          });
        }
      });
    }

    // 不符合规则的点的样式
    if (this.config.ruleConfig && this.config.ruleConfig.rule) {
      this.Shape.registerShape('point', 'notEqualPlan', {
        draw(cfg, container) {
          const data = cfg.origin._origin;
          // console.log('cfg', cfg);
          // console.log('data', data);
          const point = {
            x: cfg.x,
            y: cfg.y
          };
          if (that.config.ruleConfig.rule) {
            const ruleColor = that.config.ruleConfig.pointColor ? that.config.ruleConfig.pointColor : '#008000'
            for (let i = 0; i < that.ruledataList.length; i++) {
              if (data['stage'] === that.ruledataList[i]['stage']
                && data['number'] === that.ruledataList[i]['number']) {
                if (data[that.config.y.name] !== that.ruledataList[i][that.config.ruleConfig.y]) {
                  const decorator1 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  const decorator2 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  const decorator3 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  decorator1.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear');
                  decorator2.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 600);
                  decorator3.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 1200);
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 6,
                      fill: ruleColor,
                      opacity: 0.7
                    }
                  });
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 1.5,
                      fill: ruleColor
                    }
                  });
                }
              } else if ((data['stage'] === that.ruledataList[i]['stage']
                && !that.ruledataList.find(r => r['number'] === data['number']))) {
                if (data[that.config.y.name] !== that.ruledataList[i][that.config.ruleConfig.y]) {
                  const decorator1 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  const decorator2 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  const decorator3 = container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 10,
                      fill: ruleColor,
                      opacity: 0.5
                    }
                  });
                  decorator1.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear');
                  decorator2.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 600);
                  decorator3.animate({
                    r: 20,
                    opacity: 0,
                    repeat: true
                  }, 1800, 'easeLinear', function () { }, 1200);
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 6,
                      fill: ruleColor,
                      opacity: 0.7
                    }
                  });
                  container.addShape('circle', {
                    attrs: {
                      x: point.x,
                      y: point.y,
                      r: 1.5,
                      fill: ruleColor
                    }
                  });
                }
                break;
              }
            }
          }
        }
      });
    }


    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 }
    ];

    // this.chart = new G2.Chart({
    //   container: this.chartElement.nativeElement, // 指定图表容器 ID
    //   animate: true, // 动画 默认true
    //   forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
    //   height: this.config.height ? this.config.height : 300, // 指定图表高度
    //   padding: 'auto'
    // });
    // this.chart.source(data);
    // this.chart.line().position('genre*sold').shape('line');
    // this.chart.point().position('genre*sold').shape('overGuide');
    // this.chart.render();
  }

  // 静态数据判断点的阶段，回写阶段时间
  /**
   * data 需要判断的数据集
   */
  public setDataStage(kind, data, curStage?) {
    const stage = this.config.stageRuleConfig.stageFiled;
    const currentStage = [];
    let stageRule = {};
    curStage = curStage ? curStage : this.curStage
    for (let i = 0; i < this.stageRuleDatalist.length; i++) {
      if (this.stageRuleDatalist[i][stage] === curStage) {
        currentStage.splice(0, 0, this.stageRuleDatalist[i]);
      }
    }
    currentStage.forEach(s => {
      const field = s['filed'];
      const value = s['filedvalue'];
      const obj = { [field]: value }
      stageRule = { ...stageRule, ...obj }
    })
    // console.log(Object.keys(stageRule));
    if (kind === 'static') {
      let num = 0;
      data.forEach(e => {
        num += 1;
        const field = Object.keys(stageRule)[0];
        const value = stageRule[Object.keys(stageRule)[0]];
        let field1;
        let value1;
        if (Object.keys(stageRule).length > 1) {
          field1 = Object.keys(stageRule)[1];
          value1 = stageRule[Object.keys(stageRule)[1]];
        }
        if (Object.keys(stageRule).length === 1) {
          if (e[field] && e[field] === value) {
            this.operationAjax(e[this.config.x.name]);
            this.curStage += 1;
          }
        } else if (e[field] && e[field] === value && e[field1] && e[field1] === value1) {
          this.operationAjax(e[this.config.x.name]);
          this.curStage += 1;
        }
        e['stage'] = this.curStage - 1;
        e['number'] = num;
      });
    } else if (kind === 'dynamic') {
      const field = Object.keys(stageRule)[0];
      const value = stageRule[Object.keys(stageRule)[0]];
      let field1;
      let value1;
      if (Object.keys(stageRule).length > 1) {
        field1 = Object.keys(stageRule)[1];
        value1 = stageRule[Object.keys(stageRule)[1]];
      }
      if (Object.keys(stageRule).length === 1) {
        if (data[field] && data[field] === value) {
          this.operationAjax(data[this.config.x.name]);
          this.curStage += 1;
        }
      } else if (data[field] && data[field] === value && data[field1] && data[field1] === value1) {
        this.operationAjax(data[this.config.x.name]);
        this.curStage += 1;
      }
    }
  }

  /**
   * 执行相关的SQL操作
   */
  public async operationAjax(time, finish?) {
    let response;
    if (!finish) {
      response = await this._executeAjaxConfig(
        this.config.stageRuleConfig.operateConfig,
        time
      );
    } else {
      response = await this._executeAjaxConfig(
        this.config.stageRuleConfig.finishConfig,
        time
      );
    }
    this.StageTime = time;
    // 处理输出参数
    if (this.config.stageRuleConfig.operateConfig.outputParams) {
      this.outputParametersResolver(
        this.config.stageRuleConfig.operateConfig,
        response,
        this.config.stageRuleConfig.operateConfig,
        () => {
          // this.sendCascadeMessage(response.data);
          // // this.cascade.next(
          // //     new BsnComponentMessage(
          // //         BSN_COMPONENT_CASCADE_MODES.REFRESH,
          // //         this.config.viewId
          // //     )
          // // );
          // this.focusIds = this._getFocusIds(
          //   response.data
          // );
          // this.load();
        }
      );
    } else {
      // 没有输出参数，进行默认处理
      this.showAjaxMessage(response, '操作成功', () => {
        // this.sendCascadeMessage(response.data);
        // // this.cascade.next(
        // //     new BsnComponentMessage(
        // //         BSN_COMPONENT_CASCADE_MODES.REFRESH,
        // //         this.config.viewId
        // //     )
        // // );
        // this.focusIds = this._getFocusIds(response.data);
        // this.load();
      }, this.config.stageRuleConfig.operateConfig);


    }
  }

  public outputParametersResolver(c, response, ajaxConfig, callback = function () { }) {
    const result = false;
    if (response.isSuccess && !Array.isArray(response.data)) {
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
      const valueObj = response.data ? response.data : null;
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
                // const childrenConfig = ajaxConfig.filter(
                //     f => f.parentName && f.parentName === c.name
                // );
                // //  目前紧支持一次执行一个分之步骤
                // this._getAjaxConfig(childrenConfig[0], ajaxConfig);
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
            callback();
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
      // if(options) {
      //     this.baseMessage[messageType](options);
      //
      //     // 如果成功则执行回调
      //     if(messageType === 'success') {
      //         callback && callback();
      //     }
      // }
      if (valueObj) {
        // this.returnValue = valueObj;
        // const childrenConfig = ajaxConfig.filter(
        //     f => f.parentName && f.parentName === c.name
        // );
        // //  目前紧支持一次执行一个分之步骤
        // if (childrenConfig && childrenConfig.length > 0) {
        //     this._getAjaxConfig(childrenConfig[0], ajaxConfig);
        // }

      }

    } else if (response.isSuccess && Array.isArray(response.data)) {
      const messages = [];
      for (let j = 0, jlen = response.data.length; j < jlen; j++) {
        if (response.data[j].Message && response.data[j].Message.split(':').length > 0) {
          const msg = response.data[j].Message.split(':');
          switch (msg[0]) {
            case 'success':
              // rowsData[j]['isSuccess'] = true;
              break;
            case 'error':
              messages.push(msg[1]);
              // rowsData[j]['isSuccess'] = false;
              break;
            case 'info':
              messages.push(msg[1]);
              // rowsData[j]['isSuccess'] = false;
              break;
            case 'warning':
              messages.push(msg[1]);
              // rowsData[j]['isSuccess'] = false;
              break;
          }
        }
      }
      if (messages.length > 0) {
        this.baseMessage.create('error', messages.join('<br/>'));
      }
      callback();
    } else {
      this.baseMessage.error('操作异常:', response.message);
    }
  }

  public showAjaxMessage(result, message?, callback?, cfg?) {
    const rs: { success: boolean; msg: string[] } = {
      success: true,
      msg: []
    };
    const desc = cfg.description ? cfg.description : '执行操作,';
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

        this.apiResource.addOperationLog({
          eventId: BSN_OPERATION_LOG_TYPE.SQL,
          eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
          funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
          description: `${desc} [执行成功] 数据为: ${JSON.stringify(result['data'])}`
        }).subscribe(result => { });
      } else {
        this.baseMessage.error(rs.msg.join('<br/>'));
        this.apiResource.addOperationLog({
          eventId: BSN_OPERATION_LOG_TYPE.SQL,
          eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
          funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
          description: `${desc} [操作失败] 数据为: ${rs.msg.join('<br/>')}`
        }).subscribe(result => { });
      }
    } else {
      if (result.isSuccess) {
        this.baseMessage.success(message);
        if (callback) {
          callback();
        }
        this.apiResource.addOperationLog({
          eventId: BSN_OPERATION_LOG_TYPE.SQL,
          eventResult: BSN_OPERATION_LOG_RESULT.SUCCESS,
          funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
          description: `${desc} [操作成功] 数据: ${JSON.stringify(result['data'])}`
        }).subscribe(result => { });
      } else {
        this.baseMessage.error(result.message);
        this.apiResource.addOperationLog({
          eventId: BSN_OPERATION_LOG_TYPE.SQL,
          eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
          funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
          description: `${desc} [操作失败] 数据为: ${result.message}`
        }).subscribe(result => { });
      }
    }
  }

  private async _executeAjaxConfig(ajaxConfigObj, handleData) {
    return this._executeAction(ajaxConfigObj, handleData);
  }

  private async _executeAction(ajaxConfigObj, handleData) {
    let executeParam = CommonTools.parametersResolver({
      params: ajaxConfigObj.params,
      tempValue: this.tempValue,
      item: handleData,
      initValue: this.initData,
      cacheValue: this.cacheService,
      returnValue: this.returnValue,
    });
    const tempCondition = { 'time': handleData, 'stage': this.curStage }
    executeParam = { ...executeParam, ...tempCondition }
    // 执行数据操作
    return this._executeRequest(
      ajaxConfigObj.url,
      ajaxConfigObj.ajaxType ? ajaxConfigObj.ajaxType : 'post',
      executeParam
    );
  }

  private async _executeRequest(url, method, body) {
    return this._http[method](url, body).toPromise();
  }
}

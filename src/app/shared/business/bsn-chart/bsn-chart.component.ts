import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observer, Observable, Subscription, config } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { getISOYear, getMonth, getDate, getHours, getTime, getMinutes, getSeconds } from 'date-fns';

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
  public autoPlay;
  public ds; // 读取的全部数据
  public dv; // 根据要求过滤出的视图
  public datalength; // 真实的数据长度
  public next = 1; // 自动播放的标识变量

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
    // this.load();
  }

  public ngAfterViewInit() {
    this.load();
  }
  public ngAfterContentInit() {


  }

  public async load() {

    await this.load_data();
    if (this.config.haveGuide) {
      await this.load_guide();
    }

    // setTimeout(() => {
    if (this.config.type) {
      if (this.chart) {
        this.chart.clear();
      }
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
  public CreateChart_Line1() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    this.ds = new DataSet({
      state: {
        start: new Date(this.dataList[5]['monitortime']).getTime(),
        end: new Date(this.dataList[10]['monitortime']).getTime()
      }
    });
    // console.log(this.ds, datads);
    if (this.config.showSlider) {
      this.originDv = this.ds.createView('origin');
      this.originDv.source(this.showdata).transform({
        type: 'fold',
        fields: [this.config.y.name],
        retains: [this.config.y.name, this.config.x.name]
      }).transform({
        type: 'filter',
        callback: (obj) => {
          const time = new Date(obj.monitortime).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
          return time >= this.ds.state.start && time <= this.ds.state.end;
        }
      });
      this.chart.interact('slider', {
        container: 'slider',
        start: this.ds.state.start, // 和状态量对应
        end: this.ds.state.end,
        xAxis: this.config.x.name,
        yAxis: this.config.y.name,
        data: this.showdata,
        backgroundChart: {
          type: 'line',
          color: 'grey'
        },
        onChange: (_ref) => {
          const startValue = _ref.startValue, endValue = _ref.endValue;
          this.ds.setState('start', startValue);
          this.ds.setState('end', endValue);
        }
      });
    } else {
      this.originDv = this.showdata;
    }
    this.chart.source(this.originDv.origin);
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
    if (this.config.autoPlay) {
      let next = 1;
      this.autoPlay = setInterval(() => {
        if (this.dataList[this.dataList.length - 1] !== this.showdata[this.config.showDataLength - 1]) {
          // console.log(111);
          this.showdata.shift();
          this.showdata.push(this.dataList[this.config.showDataLength - 1 + next])
          this.chart.changeData(this.showdata);
          next = next + 1;
        }
      }, this.config.intervalTime)
    }
  }

  private CreateChart_Line() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: 'auto'
    });
    const x = this.config.x.name;
    const data = this.showdata;
    // console.log(data.length);
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
    if (this.config.x.axis) {
      this.chart.axis(this.config.x.name, this.config.x.axis);
    }
    if (this.config.y.axis) {
      this.chart.axis(this.config.y.name, this.config.y.axis);
    }
    this.dv = this.ds.createView();

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
      let test = grouptext.filter(',')
      console.log(test);
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
          fields: [this.config.y.name, grouptext], // 展开字段集
          key: 'city', // key字段
          value: 'value' // value字段
        });
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
    this.chart.source(this.dv);
    if (this.config.guideScale.y) {
      this.config.guideScale.y.forEach(e => {
        this.chart.line().position(this.config.x.name + '*' + 'value').color('city').shape(this.config.shape ? this.config.shape : 'circle');
        // this.chart.point().position(this.config.x.name + '*' + this.config.y.name).color(e.name).size(4).shape('circle').style({
        //   stroke: '#fff',
        //   lineWidth: 1
        // });
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

    if (this.config.haveGuide) {
      this.allGuide(this.chart);
    }
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
      this.autoPlay = setInterval(() => {
        this.next = this.next + 1;
        if (this.dataList[this.dataList.length - 1] !== this.showdata[this.config.showDataLength - 1]) {
          this.showdata.shift();
          this.showdata.push(this.dataList[this.config.showDataLength - 1 + this.next]);
          this.slider.start = new Date(this.showdata[0][this.config.x.name].replace(/-/g, '/')).getTime();
          this.slider.end = new Date(this.showdata[this.config.showDataLength - 1][this.config.x.name].replace(/-/g, '/')).getTime();
          this.chart.changeData(this.showdata);
          setTimeout(() => {
            // this.chart.guide().clear();
            this.allGuide(this.chart, this.slider.start, this.slider.end);
            this.chart.repaint();
          });
          this.slider.changeData(this.showdata);
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

  public async load_data() {
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
        const length = this.dataList.length > this.config.showDataLength ? this.config.showDataLength : this.dataList.length
        for (let i = 0; i < length; i++) {
          // 日期转时间戳进行比较
          const d = this.dataList[i];
          let date = this.dataList[i][this.config.x.name];
          date = date.replace(/-/g, '/');
          date = new Date(date).getTime();
          if (date > start && date < end) {
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
          // console.log(max[this.config.x.name], min[this.config.x.name]);
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
              charts.guide().line({
                top: true,
                start: [e[starttime], e[maxvalue]],
                end: [lineEndTime, e[maxvalue]],

                lineStyle: {
                  stroke: '#F5222D',
                  lineWidth: 2
                },
                text: {
                  content: '预警上限',
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: '#F5222D',
                    opacity: 0.5
                  }
                }
              });
              charts.guide().line({
                top: true,
                start: [e[starttime], e[minvalue]],
                end: [lineEndTime, e[minvalue]],

                lineStyle: {
                  stroke: '#F5222D',
                  lineWidth: 2
                },
                text: {
                  content: '预警下限',
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: '#F5222D',
                    opacity: 0.5
                  }
                }
              });
              // 对相关曲线进行染色处理
              if (this.config.guideColor) {
                charts.guide().regionFilter({
                  top: true,
                  start: [e[starttime], e[maxvalue]],
                  end: [lineEndTime, 'max'],
                  color: '#FF4D4F'
                });
                charts.guide().regionFilter({
                  top: true,
                  start: [e[starttime], e[minvalue]],
                  end: [lineEndTime, 'min'],
                  color: '#FF4D4F'
                });
              }
            }
          });
        } else if (this.config.guideConfig.guideType === 'circle') {

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
            if (dataEndTime > start) {
              lineStartTime = start > dataStartTime ? start : dataStartTime;
              lineEndTime = end > dataEndTime ? dataEndTime : end;
              lineStartTime = this.transTimeString(lineStartTime);
              lineEndTime = this.transTimeString(lineEndTime);
              charts.guide().line({
                top: true,
                start: [lineStartTime, e[maxvalue]],
                end: [lineEndTime, e[maxvalue]],

                lineStyle: {
                  stroke: '#F5222D',
                  lineWidth: 2
                },
                text: {
                  content: '预警上限',
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: '#F5222D',
                    opacity: 0.5
                  }
                }
              });
              charts.guide().line({
                top: true,
                start: [lineStartTime, e[minvalue]],
                end: [lineEndTime, e[minvalue]],

                lineStyle: {
                  stroke: '#F5222D',
                  lineWidth: 2
                },
                text: {
                  content: '预警下限',
                  position: 'start',
                  offsetX: 20,
                  offsetY: -5,
                  style: {
                    fontSize: 14,
                    fill: '#F5222D',
                    opacity: 0.5
                  }
                }
              });
              if (this.config.guideColor) {
                charts.guide().regionFilter({
                  top: true,
                  start: [e[starttime], e[maxvalue]],
                  end: [lineEndTime, 'max'],
                  color: '#FF4D4F'
                });
                charts.guide().regionFilter({
                  top: true,
                  start: [e[starttime], e[minvalue]],
                  end: [lineEndTime, 'min'],
                  color: '#FF4D4F'
                });
              }
            }
          });
        } else { // 折线辅助线
          this.showguide.forEach(e => {

          });
        }
      }
    }
  }

  // 时间戳转时间字符串
  public transTimeString(time) {
    return `${getISOYear(time)}-${getMonth(time) + 1}-${getDate(time)}${' '}${getHours(getTime(time))}${':'}${getMinutes(getTime(time))}${':'}${getSeconds(getTime(time))}`;
  }
}

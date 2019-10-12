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
  public ds; // 展示的部分数据源
  public datalength; // 真实的数据长度

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
    const datads = new DataSet({
      state: {
        start: new Date(this.dataList[0]['monitortime']).getTime(),
        end: new Date(this.dataList[this.dataList.length - 1]['monitortime']).getTime()
      }
    });
    console.log(this.ds, datads);
    if (this.config.showSlider) {
      this.originDv = datads.createView('origin');
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

    // if (this.config.showGuide) {
    //   // 直线的辅助线
    //   if (this.config.guideLine) {
    //     this.chart.guide().line({
    //       top: true,
    //       start: ['min', this.config.guideLine.start],
    //       end: ['max', this.config.guideLine.end],
    //       lineStyle: {
    //         stroke: '#F5222D',
    //         lineWidth: 2
    //       },
    //       text: {
    //         content: this.config.text.content,
    //         position: 'start',
    //         offsetX: 20,
    //         offsetY: -5,
    //         style: {
    //           fontSize: 14,
    //           fill: '#F5222D',
    //           opacity: 0.5
    //         }
    //       }
    //     })
    //   }

    //   // 动态的辅助线
    //   if (this.config.guideAjax) {
    //     this.load_guide();
    //     this.showguide.forEach(e => {

    //     });
    //   }
    // }
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
    this.ds = new DataSet({
      state: {
        from: new Date(this.dataList[0][x]).getTime(),
        to: new Date(this.dataList[this.config.showDataLength - 1][x]).getTime()
      }
    });
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
    const dv = this.ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const a = new Date(obj[x]);
          return (new Date(obj[x])).getTime() >= this.ds.state.from && (new Date(obj[x])).getTime() <= this.ds.state.to;
        }
      });
    this.chart.source(dv);
    this.chart.line().position(this.config.x.name + '*' + this.config.y.name).shape(this.config.shape ? this.config.shape : 'circle');
    this.chart.point().position(this.config.x.name + '*' + this.config.y.name).size(4).shape('circle').style({
      stroke: '#fff',
      lineWidth: 1
    });
    this.writepoint(this.chart);
    this.chart.render();
    if (this.config.showSlider) {
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
            this.writepoint(this.chart, startValue, endValue);
           // this.chart.render();
          }, 10);
        }
      });

      this.slider.render();
    }

    if (this.config.autoPlay) {
      let next = 1;
      this.autoPlay = setInterval(() => {
        if (this.dataList[this.dataList.length - 1] !== this.showdata[this.config.showDataLength - 1]) {
          // console.log(111);
          this.showdata.shift();
          this.showdata.push(this.dataList[this.config.showDataLength - 1 + next])
          this.chart.changeData(this.showdata);
          this.slider.changeData(this.showdata);
          next = next + 1;
        }
      }, this.config.intervalTime)
    }

    // const data = [
    //   {'title': 'Unforgettable', 'artist': 'Nat \'King\' Cole', 'release': 1951, 'year': '1999', 'rank': '1188', 'count': 20}, 
    //   {'title': 'La Mer', 'artist': 'Charles Trenet', 'release': 1952, 'year': '1999', 'rank': '1249', 'count': 24}, {'title': 'White Christmas', 'artist': 'Bing Crosby', 'release': 1954, 'year': '1999', 'rank': '218', 'count': 10}, {'title': '(We\'re gonna) Rock Around The Clock', 'artist': 'Bill Haley & The Comets', 'release': 1955, 'year': '1999', 'rank': '239', 'count': 19}, {'title': 'Heartbreak Hotel', 'artist': 'Elvis Presley', 'release': 1956, 'year': '1999', 'rank': '558', 'count': 109}, {'title': 'Jailhouse Rock', 'artist': 'Elvis Presley', 'release': 1957, 'year': '1999', 'rank': '247', 'count': 188}, {'title': 'Johnny B. Goode', 'artist': 'Chuck Berry', 'release': 1958, 'year': '1999', 'rank': '714', 'count': 89}, {'title': 'One Night', 'artist': 'Elvis Presley', 'release': 1959, 'year': '1999', 'rank': '622', 'count': 71}, {'title': 'It\'s Now Or Never', 'artist': 'Elvis Presley', 'release': 1960, 'year': '1999', 'rank': '285', 'count': 221}, {'title': 'Non Je Ne Regrette Rien', 'artist': 'Edith Piaf', 'release': 1961, 'year': '1999', 'rank': '106', 'count': 178}, {'title': 'Take Five', 'artist': 'Dave Brubeck', 'release': 1962, 'year': '1999', 'rank': '279', 'count': 204}, {'title': 'Blowing In The Wind', 'artist': 'Bob Dylan', 'release': 1963, 'year': '1999', 'rank': '94', 'count': 323}, {'title': 'House Of The Rising Sun', 'artist': 'The Animals', 'release': 1964, 'year': '1999', 'rank': '13', 'count': 543}, {'title': 'Yesterday', 'artist': 'The Beatles', 'release': 1965, 'year': '1999', 'rank': '6', 'count': 909}, {'title': 'Paint It Black', 'artist': 'The Rolling Stones', 'release': 1966, 'year': '1999', 'rank': '33', 'count': 1077}, {'title': 'A Whiter Shade Of Pale', 'artist': 'Procol Harum', 'release': 1967, 'year': '1999', 'rank': '10', 'count': 1190}, {'title': 'Hey Jude', 'artist': 'The Beatles', 'release': 1968, 'year': '1999', 'rank': '11', 'count': 1037}, {'title': 'Space Oddity', 'artist': 'David Bowie', 'release': 1969, 'year': '1999', 'rank': '59', 'count': 1344}, {'title': 'Bridge Over Troubled Water', 'artist': 'Simon & Garfunkel', 'release': 1970, 'year': '1999', 'rank': '9', 'count': 1111}, {'title': 'Stairway To Heaven', 'artist': 'Led Zeppelin', 'release': 1971, 'year': '1999', 'rank': '4', 'count': 1132}, {'title': 'Child In Time', 'artist': 'Deep Purple', 'release': 1972, 'year': '1999', 'rank': '3', 'count': 1117}, {'title': 'Angie', 'artist': 'The Rolling Stones', 'release': 1973, 'year': '1999', 'rank': '8', 'count': 1183}, {'title': 'School', 'artist': 'Supertramp', 'release': 1974, 'year': '1999', 'rank': '26', 'count': 1011}, {'title': 'Bohemian Rhapsody', 'artist': 'Queen', 'release': 1975, 'year': '1999', 'rank': '1', 'count': 978}, {'title': 'Dancing Queen', 'artist': 'ABBA', 'release': 1976, 'year': '1999', 'rank': '16', 'count': 1111}, {'title': 'Hotel California', 'artist': 'Eagles', 'release': 1977, 'year': '1999', 'rank': '2', 'count': 1284}, {'title': 'Paradise By The Dashboard Light', 'artist': 'Meat Loaf', 'release': 1978, 'year': '1999', 'rank': '5', 'count': 1187}, {'title': 'Another Brick In The Wall', 'artist': 'Pink Floyd', 'release': 1979, 'year': '1999', 'rank': '17', 'count': 1266}, {'title': 'The Winner Takes It All', 'artist': 'ABBA', 'release': 1980, 'year': '1999', 'rank': '35', 'count': 926}, {'title': 'The River', 'artist': 'Bruce Springsteen', 'release': 1981, 'year': '1999', 'rank': '48', 'count': 723}, {'title': 'Old And Wise', 'artist': 'The Alan Parsons Project', 'release': 1982, 'year': '1999', 'rank': '24', 'count': 945}, {'title': 'Goodnight Saigon', 'artist': 'Billy Joel', 'release': 1983, 'year': '1999', 'rank': '14', 'count': 748}, {'title': 'Over De Muur', 'artist': 'Klein Orkest', 'release': 1984, 'year': '1999', 'rank': '32', 'count': 1166}, {'title': 'Sunday Bloody Sunday', 'artist': 'U2', 'release': 1985, 'year': '1999', 'rank': '18', 'count': 1087}, {'title': 'Who Wants To Live Forever', 'artist': 'Queen', 'release': 1986, 'year': '1999', 'rank': '30', 'count': 836}, {'title': 'With Or Without You', 'artist': 'U2', 'release': 1987, 'year': '1999', 'rank': '51', 'count': 816}, {'title': 'Wonderful Tonight', 'artist': 'Eric Clapton', 'release': 1988, 'year': '1999', 'rank': '91', 'count': 515}, {'title': 'Eternal Flame', 'artist': 'Bangles', 'release': 1989, 'year': '1999', 'rank': '96', 'count': 495}, {'title': 'Nothing Compares 2 U', 'artist': 'Sinead O\'Connor', 'release': 1990, 'year': '1999', 'rank': '90', 'count': 426}, {'title': 'Losing My Religion', 'artist': 'R.E.M.', 'release': 1991, 'year': '1999', 'rank': '25', 'count': 415}, {'title': 'Tears In Heaven', 'artist': 'Eric Clapton', 'release': 1992, 'year': '1999', 'rank': '21', 'count': 435}, {'title': 'Everybody Hurts', 'artist': 'R.E.M.', 'release': 1993, 'year': '1999', 'rank': '31', 'count': 301}, {'title': 'Stil In Mij', 'artist': 'Van Dik Hout', 'release': 1994, 'year': '1999', 'rank': '65', 'count': 373}, {'title': 'Conquest Of Paradise', 'artist': 'Vangelis', 'release': 1995, 'year': '1999', 'rank': '157', 'count': 315}, {'title': 'Con Te Partiro', 'artist': 'Andrea Bocelli', 'release': 1996, 'year': '1999', 'rank': '109', 'count': 362}, {'title': 'Candle In The Wind (1997)', 'artist': 'Elton John', 'release': 1997, 'year': '1999', 'rank': '37', 'count': 451}, {'title': 'My Heart Will Go On', 'artist': 'Celine Dion', 'release': 1998, 'year': '1999', 'rank': '41', 'count': 415}, {'title': 'The Road Ahead', 'artist': 'City To City', 'release': 1999, 'year': '1999', 'rank': '1999', 'count': 262}, {'title': 'What It Is', 'artist': 'Mark Knopfler', 'release': 2000, 'year': '2000', 'rank': '545', 'count': 291}, {'title': 'Overcome', 'artist': 'Live', 'release': 2001, 'year': '2001', 'rank': '879', 'count': 111}, {'title': 'Mooie Dag', 'artist': 'Blof', 'release': 2002, 'year': '2003', 'rank': '147', 'count': 256}, {'title': 'Clocks', 'artist': 'Coldplay', 'release': 2003, 'year': '2003', 'rank': '733', 'count': 169}, {'title': 'Sunrise', 'artist': 'Norah Jones', 'release': 2004, 'year': '2004', 'rank': '405', 'count': 256}, {'title': 'Nine Million Bicycles', 'artist': 'Katie Melua', 'release': 2005, 'year': '2005', 'rank': '23', 'count': 250}, {'title': 'Rood', 'artist': 'Marco Borsato', 'release': 2006, 'year': '2006', 'rank': '17', 'count': 159}, {'title': 'If You Were A Sailboat', 'artist': 'Katie Melua', 'release': 2007, 'year': '2007', 'rank': '101', 'count': 256}, {'title': 'Dochters', 'artist': 'Marco Borsato', 'release': 2008, 'year': '2009', 'rank': '25', 'count': 268}, {'title': 'Viva La Vida', 'artist': 'Coldplay', 'release': 2009, 'year': '2009', 'rank': '11', 'count': 228}, {'title': 'Need You Now', 'artist': 'Lady Antebellum', 'release': 2010, 'year': '2010', 'rank': '210', 'count': 121}, {'title': 'Someone Like You', 'artist': 'Adele', 'release': 2011, 'year': '2011', 'rank': '6', 'count': 187}, {'title': 'I Follow Rivers', 'artist': 'Triggerfinger', 'release': 2012, 'year': '2012', 'rank': '79', 'count': 167}, {'title': 'Get Lucky', 'artist': 'Daft Punk', 'release': 2013, 'year': '2013', 'rank': '357', 'count': 141}, {'title': 'Home', 'artist': 'Dotan', 'release': 2014, 'year': '2014', 'rank': '82', 'count': 76}, {'title': 'Hello', 'artist': 'Adele', 'release': 2015, 'year': '2015', 'rank': '23', 'count': 29}];
    // const this.ds = new DataSet({
    //   state: {
    //     from: 1970,
    //     to: 1990
    //   }
    // });
    // const dv = this.ds.createView();
    // dv.source(data)
    //   .transform({
    //     type: 'filter',
    //     callback: obj => {
    //       return obj.release >= this.ds.state.from && obj.release <= this.ds.state.to;
    //     }
    //   });

    // const chart = new G2.Chart({
    //   container: this.chartElement.nativeElement,
    //   forceFit: true,
    //   height: 350,
    //   animate: false,
    //   padding: [ 20, 100, 60 ]
    // });
    // chart.source(dv, { 
    //   count: {
    //     alias: 'top2000 唱片总量'
    //   },
    //   release: {
    //     alias: '唱片发行年份'
    //   }
    // });
    // chart.interval().position('release*count').color('#e50000');
    // chart.render();

    // const slider = new Slider({
    //   container: document.getElementById('slider'),
    //   padding: [ 20, 100, 60 ],
    //   start: this.ds.state.from,
    //   end: this.ds.state.to,
    //   data,
    //   xAxis: 'release',
    //   yAxis: 'count',
    //   scales: {
    //     release: {
    //       formatter: (val) => {
    //         return parseInt(val, 10);
    //       }
    //     }
    //   },
    //   backgroundChart: {
    //     type: 'interval',
    //     color: 'rgba(0, 0, 0, 0.3)'
    //   },
    //   onChange: ({ startText, endText }) => {
    //     // !!! 更新状态量
    //     this.ds.setState('from', startText);
    //     this.ds.setState('to', endText);
    //   }
    // });

    // slider.render();

    // 更新数据源示例
    // $('#changeData').click( ev => {
    //   const newData = data.slice(10, 90);
    //   this.ds.setState('from', 2000);
    //   this.ds.setState('to', 2015);
    //   dv.source(newData); // dv 重新装载数据即可
    //   slider.start = 2000;
    //   slider.end = 2015;
    //   slider.changeData(newData);
    // });

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
    this.config.guideAjax.forEach(async e => {
      const url = this._buildURL(this.config.guideAjax.url);
      const params = {
        ...this._buildParameters(this.config.guideAjax.params),
        ...this._buildFilter(this.config.guideAjax.filter)
      };
      const method = this.config.guideAjax.ajaxType;
      const loadData = await this._load(url, params, this.config.ajaxConfig.ajaxType);
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
    });
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
        for (let i = 0; i < this.dataList.length; i++) {
          // 日期转时间戳进行比较
          const d = this.dataList[i];
          let date = this.dataList[i][this.config.x.name];
          date = date.replace(/-/g, '/');
          date = new Date(date).getTime();
          if (date > start && date < end) {
            if (d[this.config.y.name] > maxValue) {
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
        for (let i = 0; i < this.config.showDataLength - 1; i++) {
          const d = this.dataList[i];
          if (d[this.config.groupName] === e) {
            if (d[this.config.y.name] > maxValue) {
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
        for (let i = 0; i < this.config.showDataLength - 1; i++) {
          const d = this.dataList[i];
          if (d[this.config.y.name] > maxValue) {
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
        for (let i = 0; i < this.config.showDataLength - 1; i++) {
          const d = this.dataList[i];
          if (d[this.config.groupName] === e) {
            if (d[this.config.y.name] > maxValue) {
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

  // 绘制最值标记点
  public writepoint(charts?, start?, end?) {
    charts.guide().clear();
    if (!this.config.autoPlay) {
      if (this.config.peakValue) {
        if (!this.config.eachPeakValue) {
          const max_min = this.findMaxMin(start, end);
          const max = max_min.max;
          const min = max_min.min;
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
          });
        }
      }
    } else {
      // 标记最大值
      charts.guide().dataMarker({
        top: true,
        content: '当前峰值',
        position: () => {
          const obj = this.findMax();
          if (obj) {
            return [obj[this.config.x.name], obj[this.config.y.name]];
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
        content: '当前谷值',
        position: () => {
          const obj = this.findMin();
          if (obj) {
            return [obj[this.config.x.name], obj[this.config.y.name]];
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
}

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES, BSN_OUTPOUT_PARAMETER_TYPE, BSN_OPERATION_LOG_TYPE, BSN_OPERATION_LOG_RESULT, BSN_COMPONENT_MODE } from '@core/relative-Service/BsnTableStatus';
import { Observable, Subscription } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { getISOYear, getMonth, getDate, getHours, getTime, getMinutes, getSeconds } from 'date-fns';
import { isArray } from 'util';
import { Formatter } from 'tslint/lib/formatters/jsonFormatter';

@Component({
  selector: 'bsn-time-axis-chart',
  templateUrl: './bsn-time-axis-chart.component.html',
  styleUrls: ['./bsn-time-axis-chart.component.less']
})
export class BsnTimeAxisChartComponent extends CnComponentBase implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @Input() public config; // 配置参数
  @Input() public dataList = []; // 表格数据集合
  @Input() public initData;
  // public originDv;
  public showdata = []; // 展示的数组
  public showguide = []; // 辅助线的数组
  public guidedataList = []; // 辅助线的数据集合
  public ruledataList = []; // 规则算出的标准值的集合
  public rulenameList = []; // 规则转换的展示值集合
  public stageRuleDatalist = []; // 阶段开始的标准
  public stageCurrentDatalist = []; // 当前阶段的数组


  public curStage; // 自动播放的阶段变量
  public refreshNumber = 1; // 分组自动刷新的增量
  public autoPlay;
  public next = 1; // 自动播放的标识变量
  public curNum = 1; // 默认的设备数据阶段
  public StageTime; // 启动阶段的时间

  public ds; // 读取的全部数据
  public dv; // 根据要求过滤出的视图
  public datalength; // 真实的数据长度
  public Shape; // 自定义样式效果
  public test = []; // 辅助线的图例数组
  public filedName = []; // 图表Y轴的字段数组
  public filedShowName = []; // 图表展示的字段数组

  public groupMax = []; // 分组每组最大值的数组
  public groupMin = []; // 分组每组最小值的数组
  public itemName = []; // 分组名称的数组
  public chartName; // 图表的名称
  public showDataLength; // 分组的展示数据长度（暂时只有分组折线使用）
  public y1andgroup = false; // 分组+双轴的标识
  public yDataArray = []; // 需要画图的y轴字段数组
  public yField = []; // y轴字段的数据

  // 初始化的属性
  public x; // 横轴的字段
  public y; // y左轴的字段
  public yType;
  public color = [];
  public y1;
  public minValue;
  public maxValue;
  public end;
  public start;
  public intervalTime;
  public groupName;

  // tempValue = {};
  @Output() public updateValue = new EventEmitter();
  @ViewChild('chartContainer') public chartElement: ElementRef;
  @ViewChild('sliderContainer') public sliderElement: ElementRef;
  @ViewChild('chartNameContainer') public chartNameElement: ElementRef;
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
    @Inject(BSN_COMPONENT_MODE) private stateEvents: Observable<BsnComponentMessage>,
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
      // this.createChartTest();
    }

    this.x = this.config.x.name;

    this.y = this.config.yDataArray[0].name;

    // yDataArray控制画图数据，生成Y轴
    this.yDataArray = this.config.yDataArray;
    if (this.yDataArray) {
      for (let i = 0; i < this.yDataArray.length; i++) {
        this.yField.push(this.yDataArray[i].name)
      }
    }

    if (this.config.guide) {
      this.maxValue = this.config.guide.max ? this.config.guide.maxvalue : 'maxvalue';

      this.minValue = this.config.guide.min ? this.config.guide.minvalue : 'minvalue';

      this.start = this.config.guide.start ? this.config.guide.start : 'starttime'

      this.end = this.config.guide.end ? this.config.guide.end : 'endtime'
    }

    if (this.config.autoPlay) {
      this.intervalTime = this.config.intervalTime ? this.config.intervalTime : 2000;
    }

    if (this.config.showDataLength) {
      this.datalength = this.config.showDataLength
    }

    if (this.config.groupName) {
      this.groupName = this.config.groupName
    }

  }
  public ngAfterContentInit() {
  }

  public async load() {
    if (this.config.itemConfig) {
      this.itemName = await this.loadData(this.config.itemConfig);
      this.datalength = this.itemName.length * this.config.itemLength;
    } else {
      this.datalength = this.config.showDataLength;
    }
    if (this.config.ajaxConfig) {
      this.dataList = await this.loadData(this.config.ajaxConfig);
      this.sourceModify(this.datalength);
    }
    // await this.load_data(1);
    if (this.config.ruleConfig) {
      this.ruledataList = await this.loadData(this.config.ruleConfig);
      if (this.config.curStageConfig) {
        this.stageCurrentDatalist = await this.loadData(this.config.curStageConfig);
      }
    }
    if (this.config.ruleNameConfig) {
      this.rulenameList = await this.loadData(this.config.ruleNameConfig);
    }
    if (this.config.haveGuide && this.config.showGuide && this.config.guideConfig) {
      this.showguide = await this.loadData(this.config.guideConfig);
    }

    if (this.config.itemConfig) {
      // await this.getGroupPeakValue();
    }

    if (this.config.showPointStyle) {
      this.registerPointStyle();
    }

    if (this.config.stageRuleConfig) {
      this.stageRuleDatalist = await this.loadData(this.config.stageRuleConfig);
    }

    if (this.config.showChartName) {
      this.chartName = await this.loadData(this.config.showChartName);
      this.chartName = this.chartName[0][this.config.chartNameField];
      const el = this.chartNameElement.nativeElement;
      const ipt = el.querySelector('input');
      ipt.hidden = false;
      ipt.value = this.chartName;
      ipt.style.textAlign = 'center';
    }
    this.CreateChart_Time_Line();
  }

  private CreateChart_Time_Line() {
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      animate: true, // 动画 默认true
      forceFit: true,  // 图表的宽度自适应开关，默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度。
      height: this.config.height ? this.config.height : 300, // 指定图表高度
      padding: [60, 90, 60, 160]
    });

    // 创建DS数据源
    if (this.datalength) {
      if (this.showdata.length < this.datalength) {
        this.ds = new DataSet({
          state: {
            from: new Date(this.dataList[0][this.x]).getTime(),
            to: new Date(this.dataList[this.showdata.length - 1][this.x]).getTime()
          }
        });
      } else {
        this.ds = new DataSet({
          state: {
            from: new Date(this.dataList[0][this.x]).getTime(),
            to: new Date(this.dataList[this.datalength - 1][this.x]).getTime()
          }
        });
      }
    } else {
      if (this.config.refreshFrequency) {
        this.ds = new DataSet({
          state: {
            from: new Date(this.dataList[0][this.x]).getTime(),
            to: new Date(this.dataList[this.showdata.length][this.x]).getTime()
          }
        });
      }
    }

    // 坐标轴的初始化
    this.axisInit();

    this.dv = this.ds.createView();

    // dv数据源赋值
    this.setDvData();
    // console.log(this.dv);
    this.chart.source(this.dv);

    this.createLegend();

    this.createLineAndPoint();

    // 有图表标记，最值，辅助线，超标点的样式等
    if (this.config.haveGuide) {
      this.allGuide(this.chart);
    }
    // 没有自动加载数据的滑块，数据源是datalist
    if (this.config.showSlider && !this.config.autoPlay) {
      this.slider = new Slider({
        container: this.sliderElement.nativeElement,
        padding: [60, 90, 60, 160],
        start: this.ds.state.from,
        end: this.ds.state.to,
        data: this.dataList,
        xAxis: this.config.x.name,
        yAxis: this.y,
        backgroundChart: {
          type: 'line',
          color: 'grey'
        },
        scales:
        {
          [this.x]: {
            formatter: (val) => {
              return `${getISOYear(val)}-${getMonth(val) + 1}-${getDate(val)}${' '}${getHours(getTime(val))}${':'}${getMinutes(getTime(val))}${':'}${getSeconds(getTime(val))}`;
            }
          }
        },
        onChange: (_ref) => {
          const startValue = _ref.startValue, endValue = _ref.endValue;
          this.ds.setState('from', startValue);
          this.ds.setState('to', endValue);
          this.showdata = this.dataList.filter(e => this.transStringTime(e[this.x]) >= startValue && this.transStringTime(e[this.x]) <= endValue);
          setTimeout(() => {
            // this.chart.guide().clear();
            this.allGuide(this.chart, startValue, endValue);
            this.chart.repaint();
          });

        }
      });

      this.slider.render();
    }
    // 有自动加载数据的滑块，数据源是截取过后的showdata
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
        container: this.sliderElement.nativeElement,
        start: this.ds.state.from, // 和状态量对应
        end: this.ds.state.to,
        xAxis: this.config.x.name,
        yAxis: this.y,
        data: this.showdata,
        padding: [60, 90, 60, 160],
        backgroundChart: {
          type: 'line',
          color: 'grey'
        },
        scales:
        {
          [this.x]: {
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
        this.dataList = await this.loadData(this.config.ajaxConfig);
        this.next = this.next + 1;
        if (this.config.refreshFrequency) {
          this.datalength = this.showdata.length
        }
        if (this.showdata[this.datalength - 1]) {
          if (this.dataList[this.dataList.length - 1] !== this.showdata[this.datalength - 1]) {
            if (this.refreshNumber === 1) {
              if (this.y1andgroup) {
                let nextStart = this.transStringTime(this.showdata[0][this.config.x.name]);
                let nextEnd = nextStart + this.config.refreshTime;
                const timeInterval = this.config.refreshFrequency ? this.config.refreshFrequency : 180000;
                nextStart = nextStart + timeInterval;
                nextEnd = nextEnd + timeInterval;
                this.showdata = this.dataList.filter(e => nextStart <= this.transStringTime(e[this.config.x.name]) && this.transStringTime(e[this.config.x.name]) <= nextEnd);
                this.showdata = JSON.parse(JSON.stringify(this.showdata));
              } else {
                for (let aa = 0; aa < this.refreshNumber; aa++) {
                  this.showdata.shift();
                  this.showdata.push(this.dataList[this.datalength - 2 + this.next + aa]);
                }
              }
            } else {
              for (let aa = 0; aa < this.refreshNumber; aa++) {
                this.showdata.shift();
                this.showdata.push(this.dataList[this.datalength + (this.next - 2) * this.refreshNumber + aa]);
              }
            }
            if (this.config.stageRuleConfig) {
              if (!this.curStage) {
                this.curStage = 1;
              }
              const tempStage = this.curStage;
              if (this.config.refreshFrequency) {
                this.setDataStage('dynamic', this.showdata, this.curStage);
              } else {
                if (this.showdata[this.datalength - 1]) {
                  this.setDataStage('dynamic', this.showdata[this.datalength - 1], this.curStage);
                }
              }
              if (this.config.curStageConfig) {
                this.stageCurrentDatalist = await this.loadData(this.config.curStageConfig);
              }
              if (this.curStage !== 1 && tempStage === this.curStage) {
                this.curNum += 1;
              } else {
                this.curNum = 1;
              }
              if (this.config.refreshFrequency) {
                this.showdata[this.showdata.length - 1]['stage'] = this.curStage - 1;
                this.showdata[this.showdata.length - 1]['number'] = this.curNum;
              } else {
                this.showdata[this.datalength - 1]['stage'] = this.curStage - 1;
                this.showdata[this.datalength - 1]['number'] = this.curNum;
              }
            }
            this.slider.start = new Date(this.showdata[0][this.config.x.name].replace(/-/g, '/')).getTime();
            if (this.config.refreshFrequency) {
              this.slider.end = new Date(this.showdata[this.showdata.length - 1][this.config.x.name].replace(/-/g, '/')).getTime();
            } else {
              this.slider.end = new Date(this.showdata[this.datalength - 1][this.config.x.name].replace(/-/g, '/')).getTime();
            }
            if (this.config.guideConfig && this.config.guideConfig.guideType !== 'line') {
              this.ds.state.from = new Date(this.showdata[0][that.config.x.name]).getTime();
              this.ds.state.to = new Date(this.showdata[this.showdata.length - 1][that.config.x.name]).getTime();
              this.dv.source(this.showdata);
              this.chart.changeData(this.dv);
            } else {
              this.chart.changeData(this.showdata);
            }
            setTimeout(async () => {
              // if (this.config.groupName && !(this.config.peakValue || this.config.eachPeakValue)) {
              // await this.getGroupPeakValue();
              // }
              this.allGuide(this.chart, this.slider.start, this.slider.end);
              this.chart.repaint();
            });
            this.slider.changeData(this.showdata);
          }
        } else {
          this.operationAjax(this.showdata[this.datalength - 2][this.config.x.name], 'finish');
          if (this.autoPlay) {
            clearInterval(this.autoPlay);
          }
        }
      }, this.config.intervalTime)
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
      let maxValue = 0;
      let minValue = 50000;
      let maxObj = null;
      let minObj = null;
      // const length = this.dataList.length > this.datalength ? this.datalength : this.dataList.length
      const data = this.dataList.filter(_e => this.transStringTime(_e[this.x]) >= start && this.transStringTime(_e[this.x]) <= end);
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d[e] && d[e] >= maxValue) {
          maxValue = d[e];
          maxObj = d;
        }
        if (d[e] && d[e] < minValue) {
          minValue = d[e];
          minObj = d;
        }
      }
      return {
        max: maxObj,
        min: minObj
      };
    } else {
      if (start) {
        e = start
      } else {
        let maxValue = 0;
        let minValue = 50000;
        let maxObj = null;
        let minObj = null;
        const length = this.dataList.length > this.datalength ? this.datalength : this.dataList.length
        // const data = this.dataList.filter(e => this.transStringTime(e[this.x]) >= start && this.transStringTime(e[this.x]) <= end);
        for (let i = 0; i < length; i++) {
          const d = this.dataList[i];
          if (d[e] >= maxValue) {
            maxValue = d[e];
            maxObj = d;
          }
          if (d[e] < minValue) {
            minValue = d[e];
            minObj = d;
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
  public findMax(element) {
    if (element) {
      let maxValue = 0;
      let maxObj = null;
      for (let i = 0; i < this.showdata.length; i++) {
        const d = this.showdata[i];
        if (d[element] >= maxValue) {
          maxValue = d[element];
          maxObj = d;
        }
      }
      return maxObj;
    }
  }

  public findMin(element) {
    if (element) {
      let minValue = 50000;
      let minObj = null;
      for (let i = 0; i < this.showdata.length; i++) {
        const d = this.showdata[i];
        if (d[element] && d[element] <= minValue) {
          minValue = d[element];
          minObj = d;
        }
      }
      return minObj;
    }
  }

  // 辅助标记的总方法
  public allGuide(charts?, start?, end?) {
    charts.guide().clear();
    if (this.config.showGuide) {
      this.writeguide(charts, start, end);
    }
    if (this.config.eachPeakValue) {
      this.writepoint(charts, start, end);
    }
  }

  // 绘制最值标记点
  public writepoint(charts?, start?, end?) {
    if (!this.config.autoPlay) {
      const group = this.yField;
      group.forEach(element => {
        const max_min = this.findMaxMin(start, end, element);
        const max = max_min.max;
        const min = max_min.min;
        if (max_min) {
          if (max && min) {
            charts.guide().dataMarker({
              top: true,
              content: max[element],
              position: { [this.x]: max[this.x], [element]: max[element] },
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
              content: min[element],
              position: { [this.x]: min[this.x], [element]: min[element] },
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
        }
      });
    } else {
      if (this.config.eachPeakValue) {
        const group = this.yField;
        group.forEach(element => {
          const max = this.findMax(element);
          const min = this.findMin(element);
          if (max && min) {
            charts.guide().dataMarker({
              top: true,
              content: max[element],
              position: { [this.x]: max[this.x], [element]: max[element] }, // [max[this.x], max[element]],
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
              content: min[element],
              position: { [this.x]: min[this.x], [element]: min[element] }, // [min[this.x], min[element]],
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
  }

  // 绘制辅助线
  public writeguide(charts?, start?, end?) {
    // 动态的辅助线
    if (this.config.guideConfig) {
      // 解析相关字段
      const maxvalue = this.maxValue;
      const minvalue = this.minValue;
      const starttime = this.start;
      const endtime = this.end;
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
                start: { [this.x]: e[starttime], [e['type']]: e[maxvalue] }, // [e[starttime], e[maxvalue]],
                end: { [this.x]: lineEndTime, [e['type']]: e[maxvalue] }, // [lineEndTime, e[maxvalue]],
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
                start: { [this.x]: e[starttime], [e['type']]: e[minvalue] },
                end: { [this.x]: lineEndTime, [e['type']]: e[minvalue] },
                // start: [e[starttime], e[minvalue]],
                // end: [lineEndTime, e[minvalue]],
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
                const guideContent = this.config.guideContent.find(g => g.name === e.type);
                const toptext = guideContent.toptext ? guideContent.toptext : '预警上限';
                const floortext = guideContent.floortext ? guideContent.floortext : '预警下限';
                const textcolor = guideContent.textcolor ? guideContent.textcolor : '#F5222D';
                const guidelinecolor = guideContent.guidelinecolor ? guideContent.guidelinecolor : '#F5222D';
                if (e[maxvalue]) {
                  charts.guide().line({
                    top: true,
                    // start: [lineStartTime, e[maxvalue]],
                    // end: [lineEndTime, e[maxvalue]],
                    start: { [this.x]: lineStartTime, [e['type']]: e[maxvalue] },
                    end: { [this.x]: lineEndTime, [e['type']]: e[maxvalue] },
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
                }
                if (e[minvalue]) {
                  charts.guide().line({
                    top: true,
                    // start: [lineStartTime, e[minvalue]],
                    // end: [lineEndTime, e[minvalue]],
                    start: { [this.x]: lineStartTime, [e['type']]: e[minvalue] },
                    end: { [this.x]: lineEndTime, [e['type']]: e[minvalue] },
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
                }
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
  public registerPointStyle() {
    this.Shape = G2.Shape;
    const that = this;
    const lineguide = this.showguide;
    const yArray = this.yDataArray;
    // y辅助线超过的部分标识点的样式
    if (this.config.guideConfig) {
      this.Shape.registerShape('point', 'overyGuide', {
        draw(cfg, container) {
          const data = cfg.origin._origin;
          const point = {
            x: cfg.x,
            y: cfg.y
          };
          const field = cfg.style.field;
          const type = cfg.style.type;
          let condition = 0; // 判断规则值数组和数据源的条件关系
          const guideColor = that.config.guideConfig.pointColor ? that.config.guideConfig.pointColor : '#DC143C'
          if (that.config.guideConfig.guideType !== 'line') {
            if (data.city === that.config.y.name) {
              that.showdata.forEach(e => {
                if (e[that.config.y.name] > e[that.test[1]] || e[that.config.y.name] < e[that.test[0]]) {
                  const search = that.showdata.find(s => s.Id === e.Id);
                  if (data.Id === search.Id) {
                    condition = 1;
                  }
                }
              });
            }
          } else {
            that.showdata.forEach(e => {
              lineguide.forEach(t => {
                const btime = that.transStringTime(t[that.start]);
                const etime = that.transStringTime(t[that.end]);
                const datatime = that.transStringTime(e[that.config.x.name]);
                if (datatime >= btime && datatime <= etime) {
                  if (e[field] && type === t.type) {
                    if ((t[that.maxValue] && e[field] > t[that.maxValue]) || (t[that.minValue] && e[field] < t[that.minValue])) {
                      const search = that.showdata.find(s => s.Id === e.Id);
                      if (data.Id === search.Id) {
                        condition = 1;
                      }
                    }
                  }
                }
              })
            });
          }
          if (condition === 1) {
            that.writePointStyle(container, point, guideColor);
          }
        }
      });
    }

    // y1辅助线超过的部分标识点的样式
    // if (this.config.ruleConfig) {
    //   if (this.config.ruleConfig.y1max) {
    //     this.Shape.registerShape('point', 'overy1Guide', {
    //       draw(cfg, container) {
    //         const data = cfg.origin._origin;
    //         const point = {
    //           x: cfg.x,
    //           y: cfg.y
    //         };
    //         let condition = 0; // 判断规则值数组和数据源的条件关系
    //         let y1max;
    //         that.stageRuleDatalist.forEach(r => {
    //           if (r.filed === that.config.y1.name) {
    //             y1max = r.filedvalue
    //           }
    //         });
    //         const y1Color = that.config.ruleConfig.overy1color ? that.config.ruleConfig.overy1color : '#FF6600'
    //         that.showdata.forEach(e => {
    //           for (let i = 0; i < yArray.length; i++) {
    //             if (e[that.config.y1.name]) {
    //               if (e[that.config.y1.name] > y1max) {
    //                 const search = that.showdata.find(s => s.Id === e.Id);
    //                 if (data.Id === search.Id) {
    //                   condition = 1
    //                 }
    //               }
    //             }
    //           }
    //         });
    //         if (condition === 1) {
    //           that.writePointStyle(container, point, y1Color);
    //         }
    //       }
    //     });
    //   }
    // }

    // 不符合规则的点的样式
    if (this.config.ruleConfig && this.config.ruleConfig.rule) {
      this.Shape.registerShape('point', 'notEqualPlan', {
        draw(cfg, container) {
          const data = cfg.origin._origin;
          const point = {
            x: cfg.x,
            y: cfg.y
          };
          const field = cfg.style.type;
          let condition = 0; // 判断规则值数组和数据源的条件关系
          if (that.config.ruleConfig.rule) {
            const ruleColor = that.config.ruleConfig.pointColor ? that.config.ruleConfig.pointColor : '#008000'
            for (let i = 0; i < that.ruledataList.length; i++) {
              if (data['stage'] === that.ruledataList[i]['stage']
                && data['number'] === that.ruledataList[i]['number']) {
                if (field === 'value' && data[field] !== that.ruledataList[i][that.config.ruleConfig.y]) {
                  condition = 1;
                }
              } else if ((data['stage'] === that.ruledataList[i]['stage']
                && !that.ruledataList.find(r => r['number'] === data['number'])) || !data['stage']) {
                if (field === 'value' && data[field] !== that.ruledataList[i][that.config.ruleConfig.y]) {
                  condition = 1;
                }
                break;
              }
            }
            if (condition === 1) {
              that.writePointStyle(container, point, ruleColor);
            }
          }
        }
      });
    }
  }

  // 标记点的方法
  public writePointStyle(container, point, color) {
    const decorator1 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
        opacity: 0.5
      }
    });
    const decorator2 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
        opacity: 0.5
      }
    });
    const decorator3 = container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 10,
        fill: color,
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
    }, 1800, 'easeLinear', () => { }, 600);
    decorator3.animate({
      r: 20,
      opacity: 0,
      repeat: true
    }, 1800, 'easeLinear', () => { }, 1200);
    container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 6,
        fill: color,
        opacity: 0.7
      }
    });
    container.addShape('circle', {
      attrs: {
        x: point.x,
        y: point.y,
        r: 1.5,
        fill: color
      }
    });
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
        if (!isArray(data)) {
          if (data[field] && data[field] === value) {
            this.operationAjax(data[this.config.x.name]);
            this.curStage += 1;
          }
        } else {
          data.forEach(d => {
            if (d[field] && d[field] === value) {
              this.operationAjax(d[this.config.x.name]);
              this.curStage += 1;
            }
          })
        }
      } else {
        if (!isArray(data)) {
          if (data[field] && data[field] === value && data[field1] && data[field1] === value1) {
            this.operationAjax(data[this.config.x.name]);
            this.curStage += 1;
          }
        } else {
          data.forEach(d => {
            if (d[field] && d[field] === value && d[field1] && d[field1] === value1) {
              this.operationAjax(d[this.config.x.name]);
              this.curStage += 1;
            }
          })
        }
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
        }
      );
    } else {
      // 没有输出参数，进行默认处理
      this.showAjaxMessage(response, '操作成功', () => {
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
      }
      if (valueObj) {
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
        }).subscribe(_result => { });
      } else {
        this.baseMessage.error(rs.msg.join('<br/>'));
        this.apiResource.addOperationLog({
          eventId: BSN_OPERATION_LOG_TYPE.SQL,
          eventResult: BSN_OPERATION_LOG_RESULT.ERROR,
          funcId: this.tempValue['moduleName'] ? this.tempValue['moduleName'] : '',
          description: `${desc} [操作失败] 数据为: ${rs.msg.join('<br/>')}`
        }).subscribe(_result => { });
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

  /**
   * loadData
   */
  public async loadData(config) {
    const url = this._buildURL(config.url);
    const params = {
      ...this._buildParameters(config.params),
      ...this._buildFilter(config.filter)
    };
    const method = config.ajaxType;
    const loadData = await this._load(url, params, method);
    if (loadData.isSuccess) {
      let data;
      if (method === 'proc') {
        data = loadData.data.dataSet1 ? loadData.data.dataSet1 : [];
      } else {
        data = loadData.data ? loadData.data : [];
      }
      return data;
    } else {
      return;
    }
  }

  /**
   * sourceModify 数据源根据配置展示一部分
   */
  public sourceModify(length) {
    if (this.datalength) {
      if (this.dataList.length > length) {
        for (let i = 0; i < length; i++) {
          this.showdata.push(this.dataList[i]);
        }
      } else {
        this.showdata = this.dataList;
      }
    } else {
      if (this.config.refreshTime) {
        const startTime = this.transStringTime(this.dataList[0][this.config.x.name]);
        const endTime = startTime + this.config.refreshTime;
        this.showdata = this.dataList.filter(e => this.transStringTime(e[this.config.x.name]) >= startTime && this.transStringTime(e[this.config.x.name]) <= endTime);
        this.showdata = JSON.parse(JSON.stringify(this.showdata));
      }
    }
  }

  /**
   * axisInit 坐标轴初始化
   */
  public axisInit() {
    if (this.config.x.scale) {
      this.chart.scale(this.x, this.config.x.scale);
    }
    if (this.config.x.axis) {
      this.chart.axis(this.x, this.config.x.axis);
      // if (this.config.formatConfig && this.config.formatConfig.x) {
      this.axisFormatter(this.x, this.config.x.axis);
      // }
    }
    if (this.yDataArray) {
      for (let i = 0; i < this.yDataArray.length; i++) {
        this.chart.axis(this.yDataArray[i].name, this.yDataArray[i].axis);
        if (this.yDataArray[i].scale) {
          this.chart.scale(this.yDataArray[i].name, this.yDataArray[i].scale);
        }
        // if (this.yDataArray[i].formatter) {
        this.axisFormatter(this.yDataArray[i].name, this.yDataArray[i].axis, this.yDataArray[i].color, i, this.yDataArray[i].formatter);
        // }
      }
    }
  }

  /**
   * axisFormatter 坐标轴自定义初始化
   */
  public axisFormatter(axis, axisConfig, color?, temp?, formatter?) {
    const that = this;
    let format;
    if (axis === this.x) {
      format = {
        label: {
          formatter: val => {
            let xformat;
            this.stageCurrentDatalist.forEach(s => {
              if (s[that.start]) {
                if (s[that.end]) {
                  if (this.transStringTime(val) >= this.transStringTime(s[that.start]) && this.transStringTime(val) < this.transStringTime(s[that.end])) {
                    xformat = s['STAGE']
                  }
                } else {
                  if (this.transStringTime(val) >= this.transStringTime(s[that.start])) {
                    xformat = s['STAGE']
                  }
                }
              }
            });
            if (!xformat) {
              // xformat = 1;
              return val;
            } else {
              let stageName;
              if (this.rulenameList.length > 0) {
                this.rulenameList.forEach(e => {
                  if (e['STAGE'] === xformat) {
                    stageName = e['SHOW_NAME'];
                  }
                })
              }
              if (stageName) {
                return val + '  ' + stageName + '阶段';
              } else {
                return val + '  ' + '第' + xformat + '阶段'; // 格式化坐标轴显示文本
              }
            }
          },
        }
      }
    } else {
      if (formatter) {
        format = {
          label: {
            formatter: val => {
              return val + formatter; // 格式化坐标轴显示
            }
            // ,
            // textStyle: {
            //   fill: color
            // }
          }
        }
      // } else {
      //   format = {
      //     label: {
      //       textStyle: {
      //         fill: color
      //       }
      //     }
      //   }
      }
      // if (temp > 1) {
      //   const value = 80 * (temp - 1);
      //   format.label = { ...format.label, ...{ 'offset': value } };
      // }
    }
    axisConfig = { ...axisConfig, ...format }
    this.chart.axis(axis, axisConfig);
  }

  /**
   * setDvData 给数据源dv赋值
   **/
  public setDvData() {
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
          this.dv.source(this.showdata)
            .transform({
              type: 'filter',
              callback: obj => {
                const a = new Date(obj[this.x]);
                return (new Date(obj[this.x])).getTime() >= this.ds.state.from && (new Date(obj[this.x])).getTime() <= this.ds.state.to;
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
      if (this.config.yLegendGroup) {
        let filedName;
        let filedShowName;
        for (let i = 0; i < this.config.yLegendGroup.length; i++) {
          if (filedName && filedShowName) {
            filedName += this.config.yLegendGroup[i]['name'] + ','
            filedShowName += this.config.yLegendGroup[i]['alias'] + ','
          } else {
            filedName = this.config.yLegendGroup[i]['name'] + ','
            filedShowName = this.config.yLegendGroup[i]['alias'] + ','
          }
        }
        filedName = filedName.substring(0, filedName.length - 1);
        filedShowName = filedShowName.substring(0, filedShowName.length - 1);
        this.filedName = filedName.split(',');
        this.filedShowName = filedShowName.split(',');
        this.dv.source(this.showdata)
          .transform({
            type: 'filter',
            callback: obj => {
              const a = new Date(obj[this.x]);
              return (new Date(obj[this.x])).getTime() >= this.ds.state.from && (new Date(obj[this.x])).getTime() <= this.ds.state.to;
            }
          })
          .transform({
            type: 'rename',
            map: {
              [this.filedName[0]]: this.filedShowName[0], // row.xxx 会被替换成 row.yyy
              [this.filedName[1]]: this.filedShowName[1],
              [this.filedName[2]]: this.filedShowName[2]
            }
          })
          .transform({
            type: 'fold',
            fields: [this.filedShowName[0], this.filedShowName[1], this.filedShowName[2]], // 展开字段集
            key: 'detectionValue', // key字段
            value: 'value' // value字段
          });
      } else {
        this.dv.source(this.dataList)
          .transform({
            type: 'filter',
            callback: obj => {
              const a = new Date(obj[this.x]);
              return (new Date(obj[this.x])).getTime() >= this.ds.state.from && (new Date(obj[this.x])).getTime() <= this.ds.state.to;
            }
          });
      }
    }
  }

  /**
   * createLegend 构建图例
   */
  public createLegend() {
    if (this.config.legend) {
      this.chart.legend(this.config.legend);
    }
  }

  /**
   * createLineAndPoint 创建线和点
   */
  public createLineAndPoint() {
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
      // this.chart.line().position(this.config.x.name + '*' + 'value').color('#0066FF').shape(this.config.shape ? this.config.shape : 'circle');
      // this.chart.line().position(this.config.x.name + '*' + 'value1').color('#66CC00').shape(this.config.shape ? this.config.shape : 'circle');
      // // this.chart.point().position(this.config.x.name + '*' + 'value').size(4).shape('overyGuide').style({
      // //   stroke: '#fff',
      // //   lineWidth: 1
      // // });
      // this.chart.point().position(this.config.x.name + '*' + 'value').size(4).shape('notEqualPlan').style({
      //   stroke: '#fff',
      //   lineWidth: 1,
      //   type: 'value'
      // });
      // this.chart.point().position(this.config.x.name + '*' + 'value1').size(4).shape('notEqualPlan').style({
      //   stroke: '#fff',
      //   lineWidth: 1,
      //   type: 'value1'
      // });
      for (let i = 0; i < this.yDataArray.length; i++) {
        this.chart.line().position(this.config.x.name + '*' + this.yDataArray[i].name).color(this.yDataArray[i].color).shape(this.config.shape ? this.config.shape : 'circle');
        if (this.config.showPointStyle) {
          if (this.config.guideConfig) {
            this.chart.point().position(this.config.x.name + '*' + this.yDataArray[i].name).size(4).shape('overyGuide').style({
              stroke: '#fff',
              lineWidth: 1,
              field: this.yDataArray[i].name,
              type: this.yDataArray[i].type
            });
          }
          if (this.config.ruleConfig && this.config.ruleConfig.rule) {
            this.chart.point().position(this.config.x.name + '*' + this.yDataArray[i].name).size(4).shape('notEqualPlan').style({
              stroke: '#fff',
              lineWidth: 1,
              type: this.yDataArray[i].type
            });
          }
        } else {
        }
      }
    }
  }
}

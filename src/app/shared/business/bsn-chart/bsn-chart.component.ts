import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Inject, AfterViewInit } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage } from '@core/relative-Service/BsnTableStatus';
import { Observer, Observable } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
  selector: 'bsn-chart',
  templateUrl: './bsn-chart.component.html',
  styleUrls: ['./bsn-chart.component.css']
})
export class BsnChartComponent  extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() public config; // 配置参数
  @Input() public permissions = [];
  @Input() public dataList = []; // 表格数据集合
  @Input() public initData;
  @Input() public casadeData; // 级联配置 liu 20181023
  @Input()  public value;
  @Input() public bsnData;
  @Input()  public ref;
  // tempValue = {};
  @Output() public updateValue = new EventEmitter();
  @ViewChild('chartContainer') public chartElement: ElementRef;
  public chart;
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

  }

  public ngAfterViewInit() {

      this.CreateChart();
  }

  public CreateChart() {
    const data = [{
      year: '1951 年',
      sales: 38
    }, {
      year: '1952 年',
      sales: 52
    }, {
      year: '1956 年',
      sales: 61
    }, {
      year: '1957 年',
      sales: 145
    }, {
      year: '1958 年',
      sales: 48
    }, {
      year: '1959 年',
      sales: 38
    }, {
      year: '1960 年',
      sales: 38
    }, {
      year: '1962 年',
      sales: 38
    }];
    this.chart = new G2.Chart({
      container: this.chartElement.nativeElement, // 指定图表容器 ID
      forceFit: true,
      width: 400,
      height: 400,
      // width: this.config.width ? this.config.width : 300, // 指定图表宽度
      //   height: this.config.height ? this.config.height : 300, // 指定图表高度
      // options: this.config.options ? this.config.options : {}
      // data: [{ genre: 'Sports', sold: 275 },
      // { genre: 'Strategy', sold: 115 },
      // { genre: 'Action', sold: 120 },
      // { genre: 'Shooter', sold: 350 },
      // { genre: 'Other', sold: 150 }]
    });
    this.chart.source(data);
    this.chart.scale('sales', {
      // alias: '销售额(万)',
        tickInterval: 20
    });

    this.chart.interval().position('year*sales');  // 创建柱图特殊写法  X*Y 
    this.chart.render();
    console.log('*******');
  }

}

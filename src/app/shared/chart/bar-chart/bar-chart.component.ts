import { CnComponentBase } from "@shared/components/cn-component-base";
import { CommonTools } from "./../../../core/utility/common-tools";
import { Subscription, Observer, Observable } from "rxjs";
import "zone.js";
import "reflect-metadata";
import {
    Component,
    AfterViewInit,
    OnInit,
    ViewEncapsulation,
    Input,
    Inject,
    ViewChild,
    ElementRef
} from "@angular/core";
import { ApiService } from "@core/utility/api-service";
import {
    BSN_COMPONENT_CASCADE,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE_MODES
} from "@core/relative-Service/BsnTableStatus";
@Component({
    selector: "bar-chart",
    encapsulation: ViewEncapsulation.None,
    template: `
   <div #barContainer></div>
  `,
    styles: [``]
})
export class BarChartComponent extends CnComponentBase
    implements OnInit, AfterViewInit {
    @Input()
    layoutId;
    @Input()
    blockId;
    @Input()
    config;

    @ViewChild("barContainer")
    chartElement: ElementRef;
    data;
    loading = false;
    _cascadeSubscription: Subscription;
    chart;
    constructor(
        private _http: ApiService,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngOnInit(): void {
        this.resolverRelation();
    }
    ngAfterViewInit(): void {
        this.chart = new G2.Chart({
            container: this.chartElement.nativeElement, // 指定图表容器 ID
            forceFit: true,
            width: this.config.width ? this.config.width : 300, // 指定图表宽度
            height: this.config.height ? this.config.height : 300, // 指定图表高度
            options: this.config.options ? this.config.options : {}
            // data: [{ genre: 'Sports', sold: 275 },
            // { genre: 'Strategy', sold: 115 },
            // { genre: 'Action', sold: 120 },
            // { genre: 'Shooter', sold: 350 },
            // { genre: 'Other', sold: 150 }]
        });

        // this.chart.render();
    }

    createChart(data) {
        // this.chart.clear(); // 清理所有
        this.chart.source(data);
        this.chart.render();
    }

    async load() {
        this.loading = true;
        const url = this._buildURL(this.config.ajaxConfig.url);
        const params = {
            ...this._buildParameters(this.config.ajaxConfig.params)
        };
        const loadData = await this._load(url, params);
        if (loadData && loadData.status === 200) {
            if (loadData.data && loadData.data && loadData.isSuccess) {
                this.createChart(loadData.data);
            } else {
                this.data = [];
            }
        } else {
            this.data = [];
        }
        this.loading = false;
    }

    resolverRelation() {
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
                                // 解析参数
                                if (
                                    relation.params &&
                                    relation.params.length > 0
                                ) {
                                    relation.params.forEach(param => {
                                        this.tempValue[param["cid"]] =
                                            option.data[param["pid"]];
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
                }
            );
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
        let url = "";
        if (ajaxUrl && this._isUrlString(ajaxUrl)) {
            url = ajaxUrl;
        } else if (ajaxUrl) {
        }
        return url;
    }
    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === "[object String]";
    }
    private async _load(url, params) {
        return this._http.get(url, params).toPromise();
    }
    // endregion
}

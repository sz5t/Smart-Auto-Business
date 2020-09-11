import { GanttResolver } from './gantt-resolver';
import { CnComponentBase } from '@shared/components/cn-component-base';
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Input,
    Inject,
    OnDestroy
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import 'anychart';
import '../../../../assets/vender/anychart/zh-cn';
import { Subscription, Observable, Observer } from 'rxjs';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODE } from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
declare var anychart: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-gantt',
    templateUrl: './bsn-gantt.component.html',
    styleUrls: ['./bsn-gantt.less']
})
export class BsnGanttComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('container')
    // @Input() 
    public config;
    @Input()
    public initData;

    private _statusSubscription: Subscription;
    private _cascadeSubscription: Subscription;

    public container: ElementRef;
    private scale;
    private timeline;
    public change = false;
    private chart: any;
    constructor(
        private _api: ApiService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODE)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiResource = _api;
        this.cacheValue = this._cacheService
    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
        // this.config = {
        //     viewId: 'ganttDemo',
        //     splitterPosition: 250,
        //     defaultRowHeight: 32,
        //     ajaxConfig: {
        //         url: 'common/GETWORKORDER/_root/GETWORKORDER',
        //         ajaxType: 'get',
        //         params: [
        //             {
        //                 "name": "_root.parentId",
        //                 "type": "value",
        //                 "value": null
        //             },
        //             {
        //                 "name": "_deep",
        //                 "type": "value",
        //                 "value": -1
        //             }
        //         ]
        //     },
        //     componentType: {
        //         parent: false,
        //         child: false,
        //         own: true
        //     },
        //     columnField: 'taskname',
        //     actualStart: 'planbegindate',
        //     actualEnd: 'planenddate',
        //     columns: [
        //         {
        //             title: '任务名称',
        //             field: 'taskname',
        //             isCollapseExpand: true,
        //             width: 100
        //         },
        //         {
        //             title: '产品名称',
        //             field: 'productname',
        //             isCollapseExpand: false,
        //             width: 100
        //         }
        //     ]
        // };
        this.resolverRelation();
    }

    public ngAfterViewInit(): void {

        this.load();
    }

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }   
    }

    private load() {
        this.getAsyncData().then(result => {
            if (result.isSuccess) {
                const data = [];
                this.recurceData(data, result.data);
                this.initChart(data);
            }
        });
    }

    private recurceData(data, result , parentId = null) {
        if (Array.isArray(result) && result.length > 0) {
            result.forEach(r => {
                r['id'] = r['Id'];
                if (parentId === null) {
                    delete r['parentId'];
                } else {
                    r['parent'] = parentId;
                }
                data.push(r);
                if (Array.isArray(r.children) && r.children.length > 0) {
                    this.recurceData(data, r.children, r['Id']);
                    delete r.children;
                }
            });
        }
    }

    private async getAsyncData() {
        // 尝试采用加载多个数据源配置,异步加载所有数据后,进行数据整合,然后进行绑定
        const url = this.buildUrl(this.config.ajaxConfig.url);
        const params = this.resolverParameters(this.config.ajaxConfig.params);
        params['_recursive'] = true;
        return this.apiResource[this.config.ajaxConfig.ajaxType](url, params).toPromise();
    }

    private resolverParameters(config) {
        let params = this.buildParameter(config);
        config.forEach(cfg => {
            if (Array.isArray(cfg.children) && cfg.children.length > 0) {
                const p = {};
                p[cfg.name] = this.resolverParameters(cfg.children);
                params = { ...params, ...p };
            }
        });
        return params;
    }

    public buildParameter(parameters) {
        const params = CommonTools.parametersResolver({
            params: parameters,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        return params;
    }

    public buildUrl(urlConfig) {
        let url;
        if (CommonTools.isString(urlConfig)) {
            url = urlConfig;
        }
        return url;
    }

    private resolverRelation() {
        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            if (!this._cascadeSubscription) {
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
                                            this.tempValue[param['cid']] =
                                                option.data[param['pid']];
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
                                    }
                                }
                            });
                        }
                    }
                );
            }
            
        }
    }

    public changeDate() {
        // this.change = !this.change;
        // if (this.change) {
        //     this.getGantt_1();
        // } else {
        //     this.getGantt_2();
        // }
    }

    private initChart(data) {
        const that = this;
        anychart.theme('lightBlue');
        anychart.format.inputLocale('zh-cn');
        // anychart.format.inputDateTimeFormat('yyyy-MM-dd'); // Like '2015.03.12'
        anychart.format.outputLocale('zh-cn');
        const chartData = anychart.data.tree(data, 'as-table');
        const mapping = chartData.mapAs({
            'actualStart': this.config.actualStart,
            'actualEnd': this.config.actualEnd,
            'id': 'Id',
            // 'name': this.config.columnField,
            'parent': 'parentId'
        });

        this.chart = anychart.ganttProject();
        this.chart.data(mapping);
        this.chart.defaultRowHeight(this.config.defaultRowHeight);
        this.chart.splitterPosition(this.config.splitterPosition);
        const dataGrid = this.chart.dataGrid();
        dataGrid
            .column(0)
            .width(30)
            .labels({
                hAlign: 'center'
            });
        if (this.config.columns) {
            this.config.columns.forEach((col: any, index: number) => {
                dataGrid.column(index + 1)
                    .title(this.config.columns[index]['title'])
                    .collapseExpandButtons(this.config.columns[index]['isCollapseExpand'])
                    .width(this.config.columns[index]['width']);
                
                dataGrid.column(index + 1)
                .labels()
                .format(function() {
                    return this.item.get(that.config.columns[index]['field']);
                })
            });
            // for (let i = 0, len = this.config.columns.length; i < len; i++) {
            //     if (len - 1 === i) {
            //         break;
            //     }
            //     dataGrid.column(i + 1)
            //         .title(this.config.columns[i + 1]['title'])
            //         .collapseExpandButtons(this.config.columns[i]['isCollapseExpand'])
            //         .width(this.config.columns[i + 1]['width']);
            // }
        }

        dataGrid.tooltip().useHtml(true);
        dataGrid.tooltip().format(function () {
            if (!this.item.numChildren()) { // formatter for the timeline task
                const begin: any = new Date(this.item.get(that.config.actualStart));
                const end: any = new Date(this.item.get(that.config.actualEnd));
                return '<h4 style="color: #80A291">计划周期: (' +
                    Math.round((end - begin) / (24 * 60 * 60 * 1000)) +
                    ' 天):</h4><ul><li>开始: - ' +
                    anychart.format.dateTime(this.item.get(that.config.actualStart), 'yyyy年MM月dd日') +
                    '</li><li>结束 - ' +
                    anychart.format.dateTime(this.item.get(that.config.actualEnd), 'yyyy年MM月dd日') +
                    '</li></ul>' + '<hr>';
                // '<h4 style="color: #00A6DA">Most Likely (' +
                // Math.round((this.item.get('mostLikelyEnd') - this.item.get('mostLikelyStart')) / (24 * 60 * 60 * 1000)) +
                // ' days):</h4><ul><li>Start - ' +
                // anychart.format.dateTime(this.item.get('mostLikelyStart'), 'dd.MM.yyyy') +
                // '</li><li>End - ' +
                // anychart.format.dateTime(this.item.get('mostLikelyEnd'), 'dd.MM.yyyy') +
                // '</li></ul><hr>' +
                // '<h4 style="color: #E24B26">Pessimistic (' +
                // Math.round((this.item.get('pessimisticEnd') - this.item.get('pessimisticStart')) / (24 * 60 * 60 * 1000)) +
                // ' days):</h4><ul><li>Start - ' +
                // anychart.format.dateTime(this.item.get('pessimisticStart'), 'dd.MM.yyyy') +
                // '</li><li>End - ' +
                // anychart.format.dateTime(this.item.get('pessimisticEnd'), 'dd.MM.yyyy') +
                // '</li></ul>'
            } else { // formatter for the grouping task
                return '计划周期: ' + Math.round((this.autoEnd - this.autoStart) / (24 * 60 * 60 * 1000)) + ' 天'
            }
        });

        this.timeline = this.chart.getTimeline();
        this.timeline.tooltip().useHtml(true);
        this.timeline.tooltip().format(function () {
            if (!this.item.numChildren()) { // formatter for the timeline task
                const begin: any = new Date(this.item.get(that.config.actualStart));
                const end: any = new Date(this.item.get(that.config.actualEnd));
                return '<h4 style="color: #80A291">周期: (' +
                    Math.round((end - begin) / (24 * 60 * 60 * 1000)) +
                    ' 天):</h4><ul><li>开始 - ' +
                    anychart.format.dateTime(this.item.get(that.config.actualStart), 'yyyy年MM月dd日') +
                    '</li><li>结束 - ' +
                    anychart.format.dateTime(this.item.get(that.config.actualEnd), 'yyyy年MM月dd日') +
                    '</li></ul>' + '<hr>';
                // '<h4 style="color: #00A6DA">Most Likely (' +
                // Math.round((this.item.get('mostLikelyEnd') - this.item.get('mostLikelyStart')) / (24 * 60 * 60 * 1000)) +
                // ' days):</h4><ul><li>Start - ' +
                // anychart.format.dateTime(this.item.get('mostLikelyStart'), 'dd.MM.yyyy') +
                // '</li><li>End - ' +
                // anychart.format.dateTime(this.item.get('mostLikelyEnd'), 'dd.MM.yyyy') +
                // '</li></ul><hr>' +
                // '<h4 style="color: #E24B26">Pessimistic (' +
                // Math.round((this.item.get('pessimisticEnd') - this.item.get('pessimisticStart')) / (24 * 60 * 60 * 1000)) +
                // ' days):</h4><ul><li>Start - ' +
                // anychart.format.dateTime(this.item.get('pessimisticStart'), 'dd.MM.yyyy') +
                // '</li><li>End - ' +
                // anychart.format.dateTime(this.item.get('pessimisticEnd'), 'dd.MM.yyyy') +
                // '</li></ul>'
            } else { // formatter for the grouping task
                return '周期: ' + Math.round((this.autoEnd - this.autoStart) / (24 * 60 * 60 * 1000)) + ' 天'
            }
        });
        this.timeline.tasks().selected().fill('#DAA520 .8');
        this.timeline.tasks().progress().selected().fill('#D8BFD8 .8');
        this.timeline.groupingTasks()
            .labels()
            .padding(0, 0, 5, 0)
            .position('center')
            .anchor('center');

        this.timeline.groupingTasks().labels().format(function () {
            return `周期: ${Math.round((this.autoEnd - this.autoStart) / (24 * 60 * 60 * 1000))} 天`;
        });

        // set shapes for timeline tasks rendering
        this.timeline.tasks().rendering().shapes([
            {
                name: 'planTask',
                shapeType: 'path',
                disablePointerEvents: false
            },
            {
                name: 'actualTask',
                shapeType: 'path',
                disablePointerEvents: false
            }
            // {
            //     name: 'optimisticTask',
            //     shapeType: 'path',
            //     disablePointerEvents: false
            // }
        ]);

        this.timeline.groupingTasks().rendering().shapes([{
            name: 'actualTask',
            shapeType: 'path',
            disablePointerEvents: false
        }]);

        this.scale = this.timeline.scale();

        // get timeline's scale

        // setup custom drawer for timeline tasks

        this.timeline.tasks().rendering().drawer(function () {
            let path, shift,
                left, top, width, height,
                itemBounds, startRatio, endRatio

            // get timeline width and left border coordinates
            const tlBounds = that.timeline.getPixelBounds();
            const tlWidth = tlBounds.width;
            const tlLeft = tlBounds.left;

            // get recommended bounds for drawing
            const bounds = this.predictedBounds;

            // get bar height
            const barHeight = Math.round(bounds.height / 2) + that.config.defaultRowHeight / 6;

            if (that.config.planStart && that.config.planEnd) {
                /* OPTIMISTIC BAR */
                // get path from shapes
                path = this.shapes['planTask'];

                // set path's fill and stroke settings
                path.fill('#90D6C1 .6');
                path.stroke('#80A291 .8');

                // get shift value
                shift = that.halfShift(path.strokeThickness());


                // calculate start and end ratio for the optimistic bar using it's data
                startRatio = that.scale.transform(this.item.get(that.config.planStart));
                endRatio = that.scale.transform(this.item.get(that.config.planEnd));

                // calculate X coordinate for the optimistic bar
                left = Math.round(tlWidth * startRatio + tlLeft) + shift;

                // calculate Y coordinate for the optimistic bar
                top = Math.round(bounds.top) - 4 + shift;

                // calculate optimistic bar's width
                width = Math.round(tlWidth * (endRatio - startRatio));

                // set optimistic bar's height
                height = barHeight;

                // set optimistic bar's bounds
                itemBounds = anychart.math.rect(left, top, width, height);

                // draw rounded rectangle on the path
                anychart.graphics.vector.primitives.roundedRect(path, itemBounds, 3);
            }

            if (that.config.actualStart && that.config.actualEnd) {
                /* MOST LIKELY BAR */
                // get path prom shapes
                path = this.shapes['actualTask'];

                // set stroke color and opacity
                path.stroke('#666');
                path.fill('#00BFFF .8');

                // get shift value
                shift = that.halfShift(path.strokeThickness());

                // calculate start and end ratio for the most-likely bar using it's data
                startRatio = that.scale.transform(this.item.get(that.config.actualStart));
                endRatio = that.scale.transform(this.item.get(that.config.actualEnd));

                // calculate X coordinate for the most-likely bar
                left = Math.round(tlWidth * startRatio + tlLeft) + shift;

                // calculate Y coordinate for the most-likely bar
                top = Math.round(bounds.top + (bounds.height - barHeight) / 2) - 1 + shift;

                // calculate most-likely bar's width
                width = Math.round(tlWidth * (endRatio - startRatio));

                // set most-likely bar's height
                height = barHeight;

                // set most-likely bar's bounds
                itemBounds = anychart.math.rect(left, top, width, height);

                // draw rounded rectangle on the path
                anychart.graphics.vector.primitives.roundedRect(path, itemBounds, 3);
            }

            /*
            
            // get path from shapes
            path = this.shapes['planTask'];

            // set path's fill and stroke settings
            path.fill('#FF4B12 .4');
            path.stroke('#6F5264 .6');

            // get shift value
            shift = this.halfShift(path.strokeThickness());

            // calculate start and end ratio for the pessimistic bar using it's data
            startRatio = this.scale.transform(this.item.get('pessimisticStart'));
            endRatio = this.scale.transform(this.item.get('pessimisticEnd'));

            // calculate X coordinate for the pessimistic bar
            left = Math.round(tlWidth * startRatio + tlLeft) + shift;

            // calculate Y coordinate for the pessimistic bar
            top = Math.round(bounds.top + bounds.height - barHeight + 2) + shift;

            // calculate pessimistic bar's width
            width = Math.round(tlWidth * (endRatio - startRatio)) + shift;

            // set pessimistic bar's height
            height = barHeight;

            // set pessimistic bar's bounds
            itemBounds = anychart.math.rect(left, top, width, height);

            // draw rounded rectangle on the path
            anychart.graphics.vector.primitives.roundedRect(path, itemBounds, 3);
            */
        });

        // setup custom drawer for timeline grouping tasks
        this.timeline.groupingTasks().rendering().drawer(function () {


            // get path prom shapes
            const path = this.shapes['actualTask'];

            // set path stroke settings
            path.fill('#FFA500 .6');
            path.stroke('#80A291 .8');

            // get shift value
            const shift = that.halfShift(path.strokeThickness());

            // get recommended bounds for drawing
            const bounds = this.predictedBounds;

            // get parameters for the element drawer
            const left = Math.round(bounds.left) + shift;
            const height = Math.round(bounds.height) + that.config.defaultRowHeight / 5;
            const center = Math.round(height / 2);
            const top = Math.round(bounds.top + center - 2) + shift;
            const width = Math.round(bounds.width);
            const right = left + width;
            const bottom = top + height;

            const itemBounds = anychart.math.rect(left, top, width, height);

            // draw rounded rectangle on the path
            anychart.graphics.vector.primitives.roundedRect(path, itemBounds, 3);

            // // draw grouping task
            // path.moveTo(left, top + center)
            //     .lineTo(right, top + center)
            //     .close();
        });

        // set task progress' settings
        this.timeline.tasks().progress()
            .height('15%')
            .selected().stroke('#666 .6');

        // set grouping task progress' settings
        this.timeline.groupingTasks().progress()
            .height('50%')
            .fill('#0078CD .7')
            .offset('50%')
            .selected().fill('#47B7F1 .7');

        // set container id for the chart
        this.chart.container('container');
        
        // initiate chart drawing
        this.chart.draw(true);

        // Set scale maximum and minimum.
        this.scale.minimumGap(0.08);
        this.scale.maximumGap(0.15);

        // zoom chart all dates range
        this.chart.fitAll();
    }

    private halfShift(strokeThickness) {
        return (strokeThickness % 2) ? .5 : 0;
    }

    public zoomIn() {
        this.chart.zoomIn();
    }

    public zoomOut() {
        this.chart.zoomOut();
    }

    public fitAll() {
        this.chart.fitAll();
    }
}
// anychart-credits-text

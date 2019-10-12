import { SystemResource } from '@core/utility/system-resource';
import { CnComponentBase } from './../../components/cn-component-base';
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input,
    Inject,
    OnDestroy
} from '@angular/core';
import G6 from '@antv/g6';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES
} from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { CommonTools } from '@core/utility/common-tools';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { AdNumberToChineseModule } from '@delon/abc';
import { NzCarouselComponent } from 'ng-zorro-antd';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-carousel',
    template: `
    
  <nz-spin [nzSpinning]="isLoading" nzTip='加载中...'>
    <nz-carousel #carousel [nzEffect]="'fade'" [nzAutoPlay]="config.autoPlay" [nzEnableSwipe]="config.enableSwipe" >
        <div nz-carousel-content *ngFor="let img of imgList">
            <img class="image" alt="{{img.alt}}" src="{{serverPath + img.src}}"/>
        </div>
    </nz-carousel>
    </nz-spin>
    
    
  
  
    `,
    styleUrls: [`./bsn-carousel.less`]
})
export class BsnCarouselComponent extends CnComponentBase
    implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public initData;
    @Input()
    public tempValue;
    @ViewChild('carousel')
    private carousel: NzCarouselComponent;
    public isLoading = true;
    public imgList = [];
    public _statusSubscription;
    public _cascadeSubscription;
    public serverPath = SystemResource.appSystem.Server;
    constructor(
        private _apiService: ApiService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    public ngOnInit() {
        if (this.initData) {
            this.initValue = this.initData;
        }
        this.resolverRelation();
    }

    public async load() {
        this.imgList = [];
        // this.get().then(response => {
        //     if (response.isSuccess) {
        //         // 构建数据源
        //         response.data.forEach(d => {
        //             const imgItem = {};
        //             this.config.dataMapping.forEach(element => {
        //                 if (element['field'] === 'urlPath') {
        //                     if(d[element['field']]){
        //                         imgItem[element['name']] = (d[element['field']]).replace('/^\\/$', function(s) {
        //                             return s = '/';
        //                        });  
        //                     }              
        //                 } else {
        //                     imgItem[element['name']] = d[element['field']];                    
        //                 }

        //             });
        //             this.imgList.push(imgItem);
        //         });

        //         setTimeout(() => {
        //             this.isLoading = false;
        //         })
        //         // this.carousel.activeIndex = 0;
        //         this.carousel.goTo(0);
        //     }
        // });
        (async () => {
            const response = await this.get();
            if (response.isSuccess) {
                // 构建数据源
                response.data.forEach(d => {
                    const imgItem = {};
                    this.config.dataMapping.forEach(element => {
                        if (element['field'] === 'urlPath') {
                            if (d[element['field']]) {
                                imgItem[element['name']] = (d[element['field']]).replace('/^\\/$', function (s) {
                                    return s = '/';
                                });
                            }
                        } else {
                            imgItem[element['name']] = d[element['field']];
                        }

                    });
                    this.imgList.push(imgItem);
                });
                this.isLoading = false;

                // this.carousel.activeIndex = 0;
                this.carousel.goTo(0);
            }
            window.setTimeout(() => { this.showImage(); }, 1000);
        })();

    }

    public async get() {
        const url = this.config.ajaxConfig.url;
        const params = CommonTools.parametersResolver({
            params: this.config.ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this._cacheService
        });
        return this._apiService
            .get(url, params).toPromise();
    }

    public resolverRelation() {
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
                                        if (!this.tempValue) {
                                            this.tempValue = {};
                                        }
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

    public ngAfterViewInit() {
        if (this.config.componentType.own) {
            this.load();
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

    /**
     * showImage
     */
    public showImage() {
        const elements = document.querySelectorAll('.image');
        if (elements.length > 0) {
            Intense(elements);
        }
    }
}

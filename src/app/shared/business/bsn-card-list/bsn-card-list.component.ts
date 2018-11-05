import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit
} from "@angular/core";
import { ApiService } from "@core/utility/api-service";
import { CacheService } from "@delon/cache";
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES
} from "@core/relative-Service/BsnTableStatus";
import { Observable, Observer } from "rxjs";
import { CnComponentBase } from "@shared/components/cn-component-base";
import { initDomAdapter } from "@angular/platform-browser/src/browser";
import { CommonTools } from "@core/utility/common-tools";
import { FormGroup } from "@angular/forms";
@Component({
    selector: "bsn-card-list",
    templateUrl: "./bsn-card-list.component.html",
    styles: [``]
})
export class BsnCardListComponent extends CnComponentBase
    implements OnInit, AfterViewInit {
    @Input()
    config;
    @Input()
    viewId;
    @Input()
    initData;

    formConfig;
    isLoading = true;
    data;
    _statusSubscription;
    _cascadeSubscription;
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

    ngOnInit() {
        this.formConfig = this.config.forms;
        this.resolverRelation();
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
                                        if (!this.tempValue) {
                                            this.tempValue = {};
                                        }
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
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    async load() {
        const response = await this.get();
        if (response.isSuccess) {
            // 构建数据源
            // response.data.forEach(d => {
            //     const imgItem = {};
            //     this.config.dataMapping.forEach(element => {
            //         imgItem[d["name"]] = element[d["field"]];
            //         this.imgList.push(imgItem);
            //     });
            // });
            this.data = response.data;

            this.isLoading = false;
        } else {
            this.isLoading = false;
        }
    }

    async get() {
        return this._apiService
            .get(
                this.config.ajaxConfig.url,
                CommonTools.parametersResolver({
                    params: this.config.ajaxConfig.params,
                    tempValue: this.tempValue,
                    initValue: this.initValue,
                    cacheValue: this._cacheService
                })
            )
            .toPromise();
    }

    ngAfterViewInit() {
        this.load();
    }
}

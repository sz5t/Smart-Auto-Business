import { CnComponentBase } from "./../../components/cn-component-base";
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject
} from "@angular/core";
import { instantiateDefaultStyleNormalizer } from "@angular/platform-browser/animations/src/providers";
import { Subscription, Observable, Observer } from "rxjs";
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_CASCADE } from "@core/relative-Service/BsnTableStatus";
import { NzTabComponent, NzTabChangeEvent } from "ng-zorro-antd";
@Component({
    selector: "bsn-tabs",
    templateUrl: "./bsn-tabs.component.html",
    styles: [``]
})
export class BsnTabsComponent extends CnComponentBase implements OnInit {
    @Input()
    config;
    @Input()
    viewId;
    @Input()
    permissions = [];
    @Input()
    initData;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    _currentIndex;
    constructor(
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
        this.initValue = this.initData ? this.initData : {};
        this.resolverRelation();
        // const activeIndex = this.config.tabs.findIndex(tab => tab.active);
        // this.cascade.next(
        //     new BsnComponentMessage(
        //         BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
        //         this.config.viewId,
        //         {
        //             data: this.tempValue
        //         }
        //     )
        // );
    }

    tabChange(tab: NzTabChangeEvent) {
        this.config.tabs[tab.index]['active'] = true;
    }

    tabActive(tab) {
        setTimeout(() => {
            tab['active'] = true;
        })
        
    }

    tabDisactive(tab) {
        setTimeout(() => {
            tab['active'] = false;
        });
        
    }

    private resolverRelation() {
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
                                        const t = {}
                                        relation.params.forEach(param => {
                                            t[param["cid"]] =
                                                option.data[param["pid"]];
                                        });
                                        this.tempValue = t;
                                    }
                                    
                                }

                                // 匹配及联模式
                                // switch (mode) {
                                //     case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                //         this.load();
                                //         break;
                                //     case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                //         this.load();
                                //         break;
                                //     case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN:
                                //         this.load();
                                //         break;
                                //     case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                                //         break;
                                //     case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                                //         break;
                                // }
                            }
                        });
                    }
                }
            );
        }
    }
}

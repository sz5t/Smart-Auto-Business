import { CnComponentBase } from './../../components/cn-component-base';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject
} from '@angular/core';
import { instantiateDefaultStyleNormalizer } from '@angular/platform-browser/animations/src/providers';
import { Subscription, Observable, Observer } from 'rxjs';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_CASCADE } from '@core/relative-Service/BsnTableStatus';
import { NzTabComponent, NzTabChangeEvent } from 'ng-zorro-antd';
import { CommonTools } from '@core/utility/common-tools';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-tabs',
    templateUrl: './bsn-tabs.component.html',
    styles: [``]
})
export class BsnTabsComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public viewId;
    @Input()
    public permissions = [];
    @Input()
    public initData;

    public _currentIndex;
    public handleIndexs;
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

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
        this.resolverRelation();
        this.config = CommonTools.deepCopy(this.config);

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

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public tabChange(tab: NzTabChangeEvent) {
        setTimeout(() => {
            const currentTab = this.config.tabs[tab.index];
            currentTab['active'] = true;
            this._currentIndex = tab.index;
        });

    }

    public tabActive(tab) {
        // setTimeout(() => {
        //     tab['active'] = true;
        // });

    }

    public tabDisactive(tab) {
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
            this.cascadeSubscriptions = this.cascadeEvents.subscribe(
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
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        if (option) {
                                            // 解析参数
                                            if (
                                                relation.params &&
                                                relation.params.length > 0
                                            ) {
                                                const t = {};
                                                relation.params.forEach(param => {
                                                    t[param['cid']] =
                                                        option.data[param['pid']];
                                                });
                                                this.tempValue = t;
                                            }
                                            // 刷新当前页签，重新设置激活状态
                                            this.config = CommonTools.deepCopy(this.config);
                                        }
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD:
                                        // 获取相关配置，该配置获取所有标签页
                                        // 找出标签页中设置替换刷新的配置标签
                                        // console.log(option, this.config);
                                        // this.handleIndexs = [];
                                        //
                                        // this.config.tabs.forEach((tab, index) => {
                                        //    if (tab.handle && tab.handle === 'single') {
                                        //         this.handleIndexs.push(index);
                                        //    }
                                        // });
                                        // const viewCfg = this.config.viewCfg;
                                        // if (
                                        //     viewCfg &&
                                        //     cascadeEvent._mode ===
                                        //     BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD
                                        // ) {
                                        //
                                        //     // 接收替换节点消息, 根据消息重新指定切换标签页的方式
                                        //     // viewCfg.forEach(cfg => {
                                        //     //     const option = cascadeEvent.option;
                                        //     //     const subViewId = option.subViewId();
                                        //     //     if (option && cfg.config.viewId === subViewId) {
                                        //     //         this.buildComponent(
                                        //     //             cfg,
                                        //     //             option.data,
                                        //     //             option['tempValue'] ? option['tempValue'] : {},
                                        //     //             option['initValue'] ? option['initValue'] : {}
                                        //     //         );
                                        //     //     }
                                        //     // });
                                        // }
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    // public handleSingle(tab){
    //     let cfg = {};
    //     if ( tab.handleMapping) {
    //         const data = {...this.tempValue, ... this.initValue}
    //         for (const m of tab.handleMapping) {
    //         // field, value, viewId? mulitple field
    //             let match;
    //             for (const mp of m.mappings) {
    //                 if (data[mp.name] === mp.value) {
    //                     match = true;
    //                 } else {
    //                     match = false;
    //                 }
    //                 if (!match) {
    //                     return true;
    //                 }
    //             }
    //             if (match) {
    //                 cfg = tab.viewCfg.find(c => m.viewId = c.config.viewId);
    //                 console.log(cfg);
    //             }
    //         }
    //     }
    //     return cfg;
    // }
}

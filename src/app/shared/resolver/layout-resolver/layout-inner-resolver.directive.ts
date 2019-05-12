import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Type,
    ViewContainerRef
} from '@angular/core';
import { ComponentResolverComponent } from '@shared/resolver/component-resolver/component-resolver.component';
import { Observable, Observer, Subscription } from 'rxjs/index';
import {
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES,
    BsnComponentMessage
} from '@core/relative-Service/BsnTableStatus';
import { IBlockExclusionDescriptor } from 'tslint/lib/rules/completed-docs/blockExclusion';
import {CommonTools} from '@core/utility/common-tools';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[cnLayoutInnerResolverDirective]'
})
export class LayoutInnerResolverDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public layoutId;
    @Input()
    public tempValue;
    @Input()
    public initData;
    @Input()
    public permissions;
    public component: ComponentRef<any>;
    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;
    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {}

    public ngOnChanges() {}

    public ngOnInit() {
         // this.resolveRelation();
        this.buildComponent(this.config);
    }

    // public resolveRelation() {
    //     this._cascadeSubscription = this.cascadeEvents.subscribe(
    //         cascadeEvent => {
    //             const viewCfg = this.config.viewCfg;
    //             if (
    //                 viewCfg &&
    //                 cascadeEvent._mode ===
    //                     BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD
    //             ) {
    //                 // 接收替换节点消息, 根据消息重新指定切换标签页的方式
    //                 viewCfg.forEach(cfg => {
    //                     const option = cascadeEvent.option;
    //                     const subViewId = option.subViewId();
    //                     if (option && cfg.config.viewId === subViewId) {
    //                         this.buildComponent(
    //                             cfg,
    //                             option.data,
    //                             option['tempValue'] ? option['tempValue'] : {},
    //                             option['initValue'] ? option['initValue'] : {}
    //                         );
    //                     }
    //                 });
    //             }
    //             if (
    //                 viewCfg &&
    //                 cascadeEvent._mode ===
    //                     BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_SUBMAPPING
    //             ) {
    //                 const option = cascadeEvent.option;
    //                 const sendViewId = cascadeEvent._viewId;
    //                 viewCfg.forEach(cfg => {
    //                     if (cfg.config.subMapping) {
    //                         if (
    //                             cfg.config.subMapping['sendViewId'] ===
    //                                 sendViewId &&
    //                             option.data.mappingData[
    //                                 cfg.config.subMapping['field']
    //                             ] === cfg.config.subMapping['value']
    //                         ) {
    //                             const data = option.data.mappingData
    //                                 ? option.data.mappingData
    //                                 : {};
    //                             const tempValue = option.data.tempValueData
    //                                 ? option.data.tempValueData
    //                                 : {};
    //                             const initValue = option.data.initValueData
    //                                 ? option.data.initValueData
    //                                 : {};
    //                             this.buildComponent(
    //                                 cfg,
    //                                 { ...data, ...tempValue },
    //                                 tempValue,
    //                                 initValue
    //                             );
    //                         }
    //                     }
    //                 });
    //             }
    //         }
    //     );
    // }

    public buildComponent(config) {
        let cfg;
        const comp = this.resolver.resolveComponentFactory<any>(
            ComponentResolverComponent
        );
        this.container.clear();
        this.component = this.container.createComponent(comp);
        if ( config.handleMapping) {
            
            const d = {...this.tempValue, ... this.initData}
            for (const m of config.handleMapping) {
            // field, value, viewId? mulitple field
                let match;
                for (const mp of m.mappings) {
                    if (d[mp.name] === undefined) {

                    } else if (d[mp.name] === mp.value) {
                        match = true;
                    } else {
                        match = false;
                    }
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    cfg = config.viewCfg.find(c => m.viewId === c.config.viewId);
                } else if (match === undefined) {
                    cfg = config.viewCfg[0];
                }
            }
        }

        this.component.instance.config = CommonTools.deepCopy(cfg ? cfg : {});
        this.component.instance.tempValue = this.tempValue ? this.tempValue : {};
        this.component.instance.initData = this.initData ? this.initData : {};
        this.component.instance.permissions = this.permissions;
    }

    public ngOnDestroy() {
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
        if (this.component) {
            this.component.destroy();
        }
    }
}

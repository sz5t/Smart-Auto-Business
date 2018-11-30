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

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[cnLayoutResolverDirective]'
})
export class LayoutResolverDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public layoutId;
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
        this.resolveRelation();
        this.buildComponent(this.config.viewCfg[0]);
    }

    public resolveRelation() {
        this._cascadeSubscription = this.cascadeEvents.subscribe(
            cascadeEvent => {
                const viewCfg = this.config.viewCfg;
                if (
                    viewCfg &&
                    cascadeEvent._mode ===
                        BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD
                ) {
                    viewCfg.forEach(cfg => {
                        const option = cascadeEvent.option;
                        const subViewId = option.subViewId();
                        if (option && cfg.config.viewId === subViewId) {
                            this.buildComponent(
                                cfg,
                                option.data,
                                option['tempValue'] ? option['tempValue'] : {},
                                option['initValue'] ? option['initValue'] : {}
                            );
                        }
                    });
                }
                if (
                    viewCfg &&
                    cascadeEvent._mode ===
                        BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_SUBMAPPING
                ) {
                    const option = cascadeEvent.option;
                    const sendViewId = cascadeEvent._viewId;
                    viewCfg.forEach(cfg => {
                        if (cfg.config.subMapping) {
                            if (
                                cfg.config.subMapping['sendViewId'] ===
                                    sendViewId &&
                                option.data.mappingData[
                                    cfg.config.subMapping['field']
                                ] === cfg.config.subMapping['value']
                            ) {
                                const data = option.data.mappingData
                                    ? option.data.mappingData
                                    : {};
                                const tempValue = option.data.tempValueData
                                    ? option.data.tempValueData
                                    : {};
                                const initValue = option.data.initValueData
                                    ? option.data.initValueData
                                    : {};
                                this.buildComponent(
                                    cfg,
                                    { ...data, ...tempValue },
                                    tempValue,
                                    initValue
                                );
                            }
                        }
                    });
                }
            }
        );
    }

    public buildComponent(config, data?, tempValue?, initValue?) {
        const comp = this.resolver.resolveComponentFactory<any>(
            ComponentResolverComponent
        );
        this.container.clear();
        this.component = this.container.createComponent(comp);
        this.component.instance.config = config;
        this.component.instance.tempValue = data;
        this.component.instance.initData = initValue ? initValue : data;
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

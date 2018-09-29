import {
    ComponentFactoryResolver, ComponentRef, Directive, Inject, Input, OnChanges, OnDestroy, OnInit, Type,
    ViewContainerRef
} from '@angular/core';
import {ComponentResolverComponent} from '@shared/resolver/component-resolver/component-resolver.component';
import {Observable, Observer, Subscription} from 'rxjs/index';
import {
    BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES,
    BsnComponentMessage
} from '@core/relative-Service/BsnTableStatus';
import {IBlockExclusionDescriptor} from 'tslint/lib/rules/completed-docs/blockExclusion';

@Directive({
    selector: '[cnLayoutResolverDirective]'
})
export class LayoutResolverDirective implements OnInit, OnChanges, OnDestroy {
    @Input() config;
    @Input() layoutId;
    component: ComponentRef<any>;
    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
        @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
    ) {
    }

    ngOnChanges() {
    }

    ngOnInit() {
        this.resolveRelation();
    }

    resolveRelation() {
        this._cascadeSubscription = this.cascadeEvents.subscribe(cascadeEvent => {
            const viewCfg = this.config.viewCfg;
            if (viewCfg && cascadeEvent._mode === BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD) {
                viewCfg.forEach(cfg => {
                    const option = cascadeEvent.option;
                    if (option && (cfg.config.viewId === option.subViewId())) {
                        this.buildComponent(cfg, option.data);
                    }
                });
            }

        });
    }

    buildComponent(config, data) {
        const comp = this.resolver.resolveComponentFactory<any>(ComponentResolverComponent);
        this.container.clear();
        this.component = this.container.createComponent(comp);
        this.component.instance.config = config;
        this.component.instance.tempValue = data;
    }

    ngOnDestroy() {
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
        if (this.component) {
            this.component.destroy();
        }
    }
}

import {
    ComponentFactoryResolver, ComponentRef, Directive, Inject, Input, OnChanges, OnInit, Type,
    ViewContainerRef
} from '@angular/core';
import {ComponentResolverComponent} from '@shared/resolver/component-resolver/component-resolver.component';
import {Observable, Observer, Subscription} from "rxjs/index";
import {
    BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES,
    BsnComponentMessage
} from "@core/relative-Service/BsnTableStatus";

@Directive({
    selector: '[cnLayoutResolverDirective]'
})
export class LayoutResolverDirective implements OnInit, OnChanges {
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
            this.container.clear();
            if(viewCfg) {
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
        this.component = this.container.createComponent(comp);
        this.component.instance.config = config;
        this.component.instance.tempValue = data;
    }


}

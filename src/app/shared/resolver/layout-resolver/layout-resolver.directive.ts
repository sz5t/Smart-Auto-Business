import {
    ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
    ViewContainerRef
} from '@angular/core';
import {ComponentResolverComponent} from '@shared/resolver/component-resolver/component-resolver.component';

const components: { [type: string]: Type<any> } = {
    component: ComponentResolverComponent,
};
@Directive({
    selector: '[cnLayoutResolverDirective]'
})
export class LayoutResolverDirective implements OnInit, OnChanges {
    @Input() config;
    @Input() layoutId;
    component: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
    }

    ngOnChanges() {
    }

    ngOnInit() {
        if (!components[this.config.type]) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
            );
        }
        const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        if (this.config.type !== 'submit' || this.config.type !== 'button' || this.config.type !== 'search') {
            this.component.instance.formGroup = this.formGroup;
        }
        if (this.config.type === 'search') {
            // 测试事件上抛
            // (<CnFormSearchComponent>this.component.instance).searchEmitter.subscribe(() => {
            //   // console.log('search');
            // });


        }
        // if (this.component.instance.expandEmitter) {
        //   this.component.instance.expandEmitter.subscribe(expand => {
        //     this.setExpandForm(expand);
        //   });
        // }
        // 级联数据接受 liu
        if (this.component.instance.updateValue) {
            this.component.instance.updateValue.subscribe(event => {
                this.setValue(event);
            });
        }


    }

}

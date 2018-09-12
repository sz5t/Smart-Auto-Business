import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
  ViewContainerRef,
  Output,
  EventEmitter
} from '@angular/core';
import {CnFormLabelComponent} from '@shared/components/cn-form-label/cn-form-label.component';
const components: {[type: string]: Type<any>} = {
    label: CnFormLabelComponent
};
@Directive({
  selector: '[cnFormLabelDirective]'
})
export class CnFormLabelDirective implements OnInit, OnChanges {
    @Input() config;
    @Input() formGroup;
    @Input() changeConfig;
    @Input() tempValue;
    @Output() updateValue = new EventEmitter();
    component: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
    }

    ngOnChanges() {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.formGroup = this.formGroup;
            // if (this.component.instance.bsnData) {
            //   this.component.instance.bsnData = this.tempValue;
            // }
        }
        // if (this.changeConfig) {
        //   // 判断是否是自己的级联对象
        //   this.changeConfig.forEach(changeConfig => {
        //     if (this.config.name === changeConfig.name) {
        //
        //       this.config = changeConfig;
        //       this.container.clear();
        //       if (!components[this.config.type]) {
        //         const supportedTypes = Object.keys(components).join(', ');
        //         throw new Error(
        //           `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
        //         );
        //       }
        //       const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
        //       this.component = this.container.createComponent(comp);
        //       this.component.instance.config = this.config;
        //       if (this.component.instance.bsnData) {
        //         this.component.instance.bsnData = this.tempValue;
        //       }
        //
        //       if (this.config.type !== 'submit' || this.config.type !== 'button') {
        //         this.component.instance.formGroup = this.formGroup;
        //       }
        //       if (this.config.type === 'search') {
        //
        //         // 测试事件上抛
        //         // (<CnFormSearchComponent>this.component.instance).searchEmitter.subscribe(() => {
        //         //   console.log('search');
        //         // });
        //
        //
        //
        //       }
        //       // 级联数据接受 liu
        //       if (this.component.instance.updateValue) {
        //         this.component.instance.updateValue.subscribe(event => {
        //           this.setValue(event);
        //         });
        //       }
        //       // console.log('变化' , this.changeConfig );
        //      }
        //   });
        //
        //
        //
        // }
    }

    ngOnInit() {
        const comp = this.resolver.resolveComponentFactory<any>(components['label']);
        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        this.component.instance.formGroup = this.formGroup;
    }
}
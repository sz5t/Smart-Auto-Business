import { CnFormRadioGroupComponent } from './../../components/cn-form-radio-group/cn-form-radio-group.component';
import { CnFormInputComponent } from './../../components/cn-form-input/cn-form-input.component';
import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    OnInit,
    Type,
    ViewContainerRef,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { CnFormLabelComponent } from '@shared/components/cn-form-label/cn-form-label.component';
import { CnFormCheckboxComponent } from '@shared/components/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormHiddenComponent } from '@shared/components/cn-form-hidden/cn-form-hidden.component';
import { CnFormImgComponent } from '@shared/components/cn-form-img/cn-form-img.component';
const components: { [type: string]: Type<any> } = {
    label: CnFormLabelComponent,
    checkbox: CnFormCheckboxComponent,
    hidden: CnFormHiddenComponent,
    img: CnFormImgComponent,
    radioGroup: CnFormRadioGroupComponent
};
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[cnFormLabelDirective]'
})
export class CnFormLabelDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public formGroup;
    @Input()
    public changeConfig;
    @Input()
    public tempValue;
    @Input()
    public value;
    @Output()
    public updateValue = new EventEmitter();
    public component: ComponentRef<any>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) {}

    public ngOnChanges() {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.formGroup = this.formGroup;
        }
    }

    public ngOnInit() {
        let comp;
        if (this.config.type === 'checkbox') {
            comp = this.resolver.resolveComponentFactory<any>(
                components['checkbox']
            );
        } else if (this.config.type === 'img') {
            comp = this.resolver.resolveComponentFactory<any>(
                components['img']
            );
        }  else if (this.config.type === 'hidden') {
            comp = this.resolver.resolveComponentFactory<any>(
                components['hidden']
            );
        }  else if (this.config.type === 'radioGroup') {
            comp = this.resolver.resolveComponentFactory<any>(
                components['radioGroup']
            );
        } else {
            comp = this.resolver.resolveComponentFactory<any>(
                components['label']
            );
        }
        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        this.component.instance.formGroup = this.formGroup;
    }
    public ngOnDestroy() {
        this.component.destroy();
    }
}

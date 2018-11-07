import { CnFormInputComponent } from "./../../components/cn-form-input/cn-form-input.component";
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
} from "@angular/core";
import { CnFormLabelComponent } from "@shared/components/cn-form-label/cn-form-label.component";
import { CnFormCheckboxComponent } from "@shared/components/cn-form-checkbox/cn-form-checkbox.component";
import { CnFormHiddenComponent } from "@shared/components/cn-form-hidden/cn-form-hidden.component";
const components: { [type: string]: Type<any> } = {
    label: CnFormLabelComponent,
    checkbox: CnFormCheckboxComponent,
    hidden: CnFormHiddenComponent
};
@Directive({
    selector: "[cnFormLabelDirective]"
})
export class CnFormLabelDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    config;
    @Input()
    formGroup;
    @Input()
    changeConfig;
    @Input()
    tempValue;
    @Input()
    value;
    @Output()
    updateValue = new EventEmitter();
    component: ComponentRef<any>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) {}

    ngOnChanges() {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.formGroup = this.formGroup;
        }
    }

    ngOnInit() {
        let comp;
        if (this.config.type === "checkbox") {
            comp = this.resolver.resolveComponentFactory<any>(
                components["checkbox"]
            );
        } else if (this.config.type === "hidden") {
            comp = this.resolver.resolveComponentFactory<any>(
                components["hidden"]
            );
        } else {
            comp = this.resolver.resolveComponentFactory<any>(
                components["label"]
            );
        }
        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        this.component.instance.formGroup = this.formGroup;
    }
    ngOnDestroy() {
        this.component.destroy();
    }
}

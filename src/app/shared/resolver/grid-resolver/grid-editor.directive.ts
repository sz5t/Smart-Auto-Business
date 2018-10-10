import {
    ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
    ViewContainerRef,
    forwardRef,
    Output,
    EventEmitter, OnDestroy
} from '@angular/core';
import {
    NzCheckboxComponent,
    NzCheckboxGroupComponent,
    // NzDatePickerComponent,
    // NzInputComponent,
    NzRadioComponent,
    // NzRangePickerComponent,
    NzSelectComponent,
    // NzTimePickerComponent
} from 'ng-zorro-antd';
import { CnGridInputComponent } from '@shared/components/cn-grid-input/cn-grid-input.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CnGridSelectComponent } from '@shared/components/cn-grid-select/cn-grid-select.component';
import { CnGridSelectTreeComponent } from '@shared/components/cn-grid-select-tree/cn-grid-select-tree.component';
import { CnGridDatePickerComponent } from '@shared/components/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridNumberComponent } from '@shared/components/cn-grid-munber/cn-grid-number.component';
const components: { [type: string]: Type<any> } = {
    input: CnGridInputComponent,
    select: CnGridSelectComponent,
    // datePicker: NzDatePickerComponent,
    // timePicker: NzTimePickerComponent,
    // rangePicker: NzRangePickerComponent,
    checkbox: NzCheckboxComponent,
    checkboxGroup: NzCheckboxGroupComponent,
    radioGroup: NzRadioComponent,
    selectTree: CnGridSelectTreeComponent,
    datePicker: CnGridDatePickerComponent,
    number: CnGridNumberComponent

};
export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GridEditorDirective),
    multi: true
};
@Directive({
    selector: '[CnGridEditorDirective]',
    providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class GridEditorDirective implements OnInit, OnChanges, OnDestroy {
    @Input() config;
    @Input() value;
    @Input() rowData;
    @Input() bsnData;
    @Input() dataSet;
    @Input() changeConfig;
    @Output() updateValue = new EventEmitter();
    component: ComponentRef<any>;

    constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
    }

    ngOnChanges() {
        if (this.component) {
        }
     
        if (this.config) {
            if (!components[this.config.type]) {
                const supportedTypes = Object.keys(components).join(', ');
                throw new Error(
                    `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
                );
            }
            this.container.clear();
            const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
            this.component = this.container.createComponent(comp);
            // const c_config = JSON.parse(JSON.stringify(this.config));
            this.component.instance.config = this.config;
            this.component.instance.value = this.value;
            this.component.instance.bsnData = this.bsnData;
            this.component.instance.rowData = this.rowData;
            if (this.component.instance.casadeData) {
                const c_changeConfig = JSON.parse(JSON.stringify(this.changeConfig));
                this.component.instance.casadeData = c_changeConfig;
               
            }
            if (this.dataSet) {
                this.component.instance.dataSet = this.dataSet;
            }
            this.component.instance.updateValue.subscribe(event => {
                this.setValue(event);
            });
        }
        if (this.changeConfig ) {  // && !this.isEmptyObject(this.changeConfig)
           // console.log('ngOnChanges', this.changeConfig);
           // console.log('ngOnChangesvalue', this.value);
           // console.log('ngOnChangesvalueconfig', this.config);
           this.container.clear();
           if (!components[this.config.type]) {
               const supportedTypes = Object.keys(components).join(', ');
               throw new Error(
                   `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
               );
           }
           const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
           this.component = this.container.createComponent(comp);
           // const c_config = JSON.parse(JSON.stringify(this.config));
           this.component.instance.config = this.config;
           this.component.instance.value = this.value;
           this.component.instance.bsnData = this.bsnData;
           this.component.instance.rowData = this.rowData;
           // if (this.component.instance.casadeData) {
           //  console.log('ngOnInit', this.changeConfig);
     
           const c_changeConfig = JSON.parse(JSON.stringify(this.changeConfig));
           this.component.instance.casadeData = c_changeConfig;
          
           // }

           if (this.dataSet) {
               this.component.instance.dataSet = this.dataSet;
           }
           this.component.instance.updateValue.subscribe(event => {
               this.setValue(event);
           });
      
       }
    }

    ngOnInit() {
      

    }

    // 组件将值写回
    setValue(data?) {
        this.value = data;
        this.updateValue.emit(data);
    }

    ngOnDestroy() {
        if (this.component) {
            this.component.destroy();
        }
    }

    isEmptyObject(e) {
        let t;
        for (t in e)
            return !1;
        return !0;

    }
}



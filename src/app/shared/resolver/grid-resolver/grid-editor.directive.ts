import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    OnInit,
    Type,
    ViewContainerRef,
    forwardRef,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import {
    NzCheckboxComponent,
    NzCheckboxGroupComponent,
    // NzDatePickerComponent,
    // NzInputComponent,
    NzRadioComponent,
    // NzRangePickerComponent,
    NzSelectComponent
    // NzTimePickerComponent
} from 'ng-zorro-antd';
import { CnGridInputComponent } from '@shared/components/cn-grid-input/cn-grid-input.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CnGridSelectComponent } from '@shared/components/cn-grid-select/cn-grid-select.component';
import { CnGridSelectTreeComponent } from '@shared/components/cn-grid-select-tree/cn-grid-select-tree.component';
import { CnGridDatePickerComponent } from '@shared/components/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridNumberComponent } from '@shared/components/cn-grid-munber/cn-grid-number.component';
import { CnGridSelectGridComponent } from '@shared/components/cn-grid-select-grid/cn-grid-select-grid.component';
import { CnGridSelectTreegridComponent } from '@shared/components/cn-grid-select-treegrid/cn-grid-select-treegrid.component';
import { CnGridSearchComponent } from '@shared/components/cn-grid-search/cn-grid-search.component';
import { CnGridSelectMultipleComponent } from '@shared/components/cn-grid-select-multiple/cn-grid-select-multiple.component';
import { CnGridSelectGridMultipleComponent } from '@shared/components/cn-grid-select-grid-multiple/cn-grid-select-grid-multiple.component';
import { CnGridSelectCustomComponent } from '@shared/components/cn-grid-select-custom/cn-grid-select-custom.component';
import { CnGridSelectCustomMultipleComponent } from '@shared/components/cn-grid-select-custom-multiple/cn-grid-select-custom-multiple.component';
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
    number: CnGridNumberComponent,
    selectGrid: CnGridSelectGridComponent,
    selectTreeGrid: CnGridSelectTreegridComponent,
    search: CnGridSearchComponent,
    selectMultiple: CnGridSelectMultipleComponent,
    selectGridMultiple: CnGridSelectGridMultipleComponent,
    selectCustom: CnGridSelectCustomComponent,
    selectCustomMultiple: CnGridSelectCustomMultipleComponent
};

// export const EXE_COUNTER_VALUE_ACCESSOR: any = {
//     provide: NG_VALUE_ACCESSOR,
//     useExisting: forwardRef(() => GridEditorDirective),
//     multi: true
// };

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[CnGridEditorDirective]'
    // providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class GridEditorDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public value;
    @Input()
    public rowData;
    @Input()
    public bsnData;
    @Input()
    public dataSet;
    @Input()
    public changeConfig;
    @Input()
    public initData;
    @Output()
    public updateValue = new EventEmitter();
    public component: ComponentRef<any>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) {}

    public changecount = 'first';
    public ngOnChanges() {
        if (this.component) {
        }

        if (this.config) {
        }
        if (this.changeConfig) {
            // && !this.isEmptyObject(this.changeConfig)
            // console.log('ngOnChanges', this.changeConfig);
            // console.log('ngOnChangesvalue', this.value);
            // console.log('ngOnChangesvalueconfig', this.config);
            this.changecount = 'repeat';
            this.container.clear();
            if (!components[this.config.type]) {
                const supportedTypes = Object.keys(components).join(', ');
                throw new Error(
                    `不支持此类型的组件 (${
                        this.config.type
                    }).可支持的类型为: ${supportedTypes}`
                );
            }
            const comp = this.resolver.resolveComponentFactory<any>(
                components[this.config.type]
            );
            this.component = this.container.createComponent(comp);
            // const c_config = JSON.parse(JSON.stringify(this.config));
            this.component.instance.config = this.config;
            this.component.instance.value = this.value;
            this.component.instance.bsnData = this.bsnData;
            this.component.instance.rowData = this.rowData;
            this.component.instance.initData = this.initData;
            // if (this.component.instance.casadeData) {
            //  console.log('ngOnInit', this.changeConfig);

            const c_changeConfig = JSON.parse(
                JSON.stringify(this.changeConfig)
            );
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

    public ngOnInit() {
        console.log('ngOnChangesvalue', this.changecount);
        if (this.changecount === 'first') {
            if (!components[this.config.type]) {
                const supportedTypes = Object.keys(components).join(', ');
                throw new Error(
                    `不支持此类型的组件 (${
                        this.config.type
                    }).可支持的类型为: ${supportedTypes}`
                );
            }
            this.container.clear();
            const comp = this.resolver.resolveComponentFactory<any>(
                components[this.config.type]
            );
            this.component = this.container.createComponent(comp);
            // const c_config = JSON.parse(JSON.stringify(this.config));
            this.component.instance.config = this.config;
            this.component.instance.value = this.value;
            this.component.instance.bsnData = this.bsnData;
            this.component.instance.rowData = this.rowData;
            this.component.instance.initData = this.initData;
            if (this.component.instance.casadeData) {
                const c_changeConfig = JSON.parse(
                    JSON.stringify(this.changeConfig)
                );
                this.component.instance.casadeData = c_changeConfig;
            }
            if (this.dataSet) {
                this.component.instance.dataSet = this.dataSet;
            }
            this.component.instance.updateValue.subscribe(event => {
                this.setValue(event);
            });
        } else {
            this.container.clear();
            if (!components[this.config.type]) {
                const supportedTypes = Object.keys(components).join(', ');
                throw new Error(
                    `不支持此类型的组件 (${
                        this.config.type
                    }).可支持的类型为: ${supportedTypes}`
                );
            }
            const comp = this.resolver.resolveComponentFactory<any>(
                components[this.config.type]
            );
            this.component = this.container.createComponent(comp);
            // const c_config = JSON.parse(JSON.stringify(this.config));
            this.component.instance.config = this.config;
            this.component.instance.value = this.value;
            this.component.instance.bsnData = this.bsnData;
            this.component.instance.rowData = this.rowData;
            this.component.instance.initData = this.initData;
            // if (this.component.instance.casadeData) {
            //  console.log('ngOnInit', this.changeConfig);

            const c_changeConfig = JSON.parse(
                JSON.stringify(this.changeConfig)
            );
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

    // 组件将值写回
    public setValue(data?) {
        this.value = data;
        this.updateValue.emit(data);
    }

    public ngOnDestroy() {
        if (this.component) {
            this.component.destroy();
        }
    }

    public isEmptyObject(e) {
        let t;
        for (t in e) return !1;
        return !0;
    }
}

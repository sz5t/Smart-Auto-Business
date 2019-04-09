import { CnMonthPickerComponent } from './../../components/cn-date-picker/cn-month-picker.component';
import { CnYearPickerComponent } from './../../components/cn-date-picker/cn-year-picker.component';
import { CnWeekPickerComponent } from './../../components/cn-date-picker/cn-week-picker.component';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CnFormHiddenComponent } from '@shared/components/cn-form-hidden/cn-form-hidden.component';
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
import { CnFormInputComponent } from '@shared/components/cn-form-input/cn-form-input.component';
import { CnFormSubmitComponent } from '@shared/components/cn-form-submit/cn-form-submit.component';
import { CnFormSelectComponent } from '@shared/components/cn-form-select/cn-form-select.component';
import { CnDatePickerComponent } from '@shared/components/cn-date-picker/cn-date-picker.component';
import { CnTimePickerComponent } from '@shared/components/cn-time-picker/cn-time-picker.component';
import { CnFormRangePickerComponent } from '@shared/components/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormCheckboxComponent } from '@shared/components/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormCheckboxGroupComponent } from '@shared/components/cn-form-checkbox-group/cn-form-checkbox-group.component';
import { CnFormRadioGroupComponent } from '@shared/components/cn-form-radio-group/cn-form-radio-group.component';
import { CnFormSearchComponent } from '@shared/components/cn-form-search/cn-form-search.component';
import { CnFormSelectTreeComponent } from '@shared/components/cn-form-select-tree/cn-form-select-tree.component';
import { CnFormTextareaComponent } from '@shared/components/cn-form-textarea/cn-form-textarea.component';
import { CnFormNumberComponent } from '@shared/components/cn-form-number/cn-form-number.component';
import { CnFormSelectMultipleComponent } from '@shared/components/cn-form-select-multiple/cn-form-select-multiple.component';
import { CnFormSelectTreeMultipleComponent } from '@shared/components/cn-form-select-tree-multiple/cn-form-select-tree-multiple.component';
import { CnFormSelectGridComponent } from '@shared/components/cn-form-select-grid/cn-form-select-grid.component';
import { CnFormSelectTreegridComponent } from '@shared/components/cn-form-select-treegrid/cn-form-select-treegrid.component';
import { CnFormScancodeComponent } from '@shared/components/cn-form-scancode/cn-form-scancode.component';
import { CnFormGridComponent } from '@shared/components/cn-form-grid/cn-form-grid.component';
import { CnFormSelectGridMultipleComponent } from '@shared/components/cn-form-select-grid-multiple/cn-form-select-grid-multiple.component';
import { CnFormSelectCustomComponent } from '@shared/components/cn-form-select-custom/cn-form-select-custom.component';
import { CnFormSelectCustomMultipleComponent } from '@shared/components/cn-form-select-custom-multiple/cn-form-select-custom-multiple.component';
import { CnFormImgComponent } from '@shared/components/cn-form-img/cn-form-img.component';
import { CnFormSearchInputComponent } from '@shared/components/cn-form-search-input/cn-form-search-input.component';

const components: { [type: string]: Type<any> } = {
    input: CnFormInputComponent,
    submit: CnFormSubmitComponent,
    select: CnFormSelectComponent,
    selectMultiple: CnFormSelectMultipleComponent,
    datePicker: CnDatePickerComponent,
    timePicker: CnTimePickerComponent,
    rangePicker: CnFormRangePickerComponent,
    checkbox: CnFormCheckboxComponent,
    checkboxGroup: CnFormCheckboxGroupComponent,
    radioGroup: CnFormRadioGroupComponent,
    search: CnFormSearchComponent,
    selectTree: CnFormSelectTreeComponent,
    selectTreeMultiple: CnFormSelectTreeMultipleComponent,
    textarea: CnFormTextareaComponent,
    hidden: CnFormHiddenComponent,
    number: CnFormNumberComponent,
    selectGrid: CnFormSelectGridComponent,
    selectTreeGrid: CnFormSelectTreegridComponent,
    yearPicker: CnYearPickerComponent,
    monthPicker: CnMonthPickerComponent,
    weekPicker: CnWeekPickerComponent,
    scanCode: CnFormScancodeComponent,
    datagrid: CnFormGridComponent,
    selectGridMultiple: CnFormSelectGridMultipleComponent,
    selectCustom: CnFormSelectCustomComponent,
    selectCustomMultiple: CnFormSelectCustomMultipleComponent,
    img: CnFormImgComponent,
    searchInput: CnFormSearchInputComponent,
    numberInput: CnFormSearchInputComponent
};
@Directive({
    selector: '[cnFormResolverDirective]'
})
export class FormResolverDirective extends CnComponentBase
    implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public formGroup;
    @Input()
    public changeConfig;
    @Input()
    public tempValue;
    @Input()
    public initValue;
    @Output()
    public updateValue = new EventEmitter();
    public component: ComponentRef<any>;
    public value;
    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) {
        super();
    }

    public ngOnChanges() {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.formGroup = this.formGroup;
            // if (this.component.instance.bsnData) {
            this.component.instance.bsnData = this.tempValue;
            // }
        }
        if (this.changeConfig) {
            if (this.component) {
               // console.log('ngOnChanges', this.changeConfig);
                this.container.clear();
                const comp = this.resolver.resolveComponentFactory<any>(
                    components[this.config.type]
                );
                this.component = this.container.createComponent(comp);
                this.component.instance.config = this.config;
                this.component.instance.changeConfig = this.changeConfig;
                // console.log('164' , this.changeConfig);
                // if (this.component.instance.bsnData) {
                this.component.instance.bsnData = this.tempValue;
                this.component.instance.initValue = this.initValue;
                this.component.instance.value = this.value;
                // }
                if (
                    this.config.type !== 'submit' ||
                    this.config.type !== 'button' ||
                    this.config.type !== 'search'
                ) {
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
                        if ( event ) {
                            this.value = event.value;
                        }
                        this.setValue(event);
                    });
                }
            }

        }
        // if (this.changeConfig) {
        //     // 判断是否是自己的级联对象
        //     this.changeConfig.forEach(changeConfig => {
        //         if (this.config.name === changeConfig.name) {
        //             this.config = changeConfig;
        //             this.container.clear();
        //             if (!components[this.config.type]) {
        //                 const supportedTypes = Object.keys(components).join(
        //                     ", "
        //                 );
        //                 throw new Error(
        //                     `不支持此类型的组件 (${
        //                         this.config.type
        //                     }).可支持的类型为: ${supportedTypes}`
        //                 );
        //             }
        //             const comp = this.resolver.resolveComponentFactory<any>(
        //                 components[this.config.type]
        //             );
        //             this.component = this.container.createComponent(comp);
        //             this.component.instance.config = this.config;
        //             //  if (this.component.instance.bsnData) {
        //             this.component.instance.bsnData = this.tempValue;
        //             this.component.instance.initValue = this.initValue;
        //             // }

        //             if (
        //                 this.config.type !== "submit" ||
        //                 this.config.type !== "button"
        //             ) {
        //                 this.component.instance.formGroup = this.formGroup;
        //             }
        //             if (this.config.type === "search") {
        //                 // 测试事件上抛
        //                 // (<CnFormSearchComponent>this.component.instance).searchEmitter.subscribe(() => {
        //                 //   console.log('search');
        //                 // });
        //             }
        //             // 级联数据接受 liu
        //             if (this.component.instance.updateValue) {
        //                 this.component.instance.updateValue.subscribe(event => {
        //                     this.setValue(event);
        //                 });
        //             }
        //         }
        //     });
        // }
    }

    public ngOnInit() {
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
        this.component.instance.config = this.config;
        this.component.instance.changeConfig = this.changeConfig;
        // if (this.component.instance.bsnData) {
        this.component.instance.bsnData = this.tempValue;
        this.component.instance.initValue = this.initValue;
        // }
        if (
            this.config.type !== 'submit' ||
            this.config.type !== 'button' ||
            this.config.type !== 'search'
        ) {
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
                if ( event ) {
                    this.value = event.value;
                }
                this.setValue(event);
            });
        }
    }

    // 组件将值写回、级联数据-》回写 liu
    public setValue(data?) {
        this.updateValue.emit(data);
    }

    public ngOnDestroy() {
        if (this.component) {
            this.component.destroy();
        }
    }

    //  setExpandForm(expand?) {
    //    this.expandSearchForm.emit(expand);
    //  }
}

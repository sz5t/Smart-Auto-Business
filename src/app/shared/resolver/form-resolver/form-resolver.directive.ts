import { CnFormHiddenComponent } from '@shared/components/cn-form-hidden/cn-form-hidden.component';
import {
    ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
    ViewContainerRef,
    Output,
    EventEmitter, OnDestroy
} from '@angular/core';
import {CnFormInputComponent} from '@shared/components/cn-form-input/cn-form-input.component';
import {CnFormSubmitComponent} from '@shared/components/cn-form-submit/cn-form-submit.component';
import {CnFormSelectComponent} from '@shared/components/cn-form-select/cn-form-select.component';
import {CnDatePickerComponent} from '@shared/components/cn-date-picker/cn-date-picker.component';
import {CnTimePickerComponent} from '@shared/components/cn-time-picker/cn-time-picker.component';
import {CnFormRangePickerComponent} from '@shared/components/cn-form-range-picker/cn-form-range-picker.component';
import {CnFormCheckboxComponent} from '@shared/components/cn-form-checkbox/cn-form-checkbox.component';
import {CnFormCheckboxGroupComponent} from '@shared/components/cn-form-checkbox-group/cn-form-checkbox-group.component';
import {CnFormRadioGroupComponent} from '@shared/components/cn-form-radio-group/cn-form-radio-group.component';
import {CnFormSearchComponent} from '@shared/components/cn-form-search/cn-form-search.component';
import {CnFormSelectTreeComponent} from '@shared/components/cn-form-select-tree/cn-form-select-tree.component';
import {CnFormTextareaComponent} from '@shared/components/cn-form-textarea/cn-form-textarea.component';
import { CnFormNumberComponent } from '@shared/components/cn-form-number/cn-form-number.component';
import { CnFormSelectMultipleComponent } from '@shared/components/cn-form-select-multiple/cn-form-select-multiple.component';
import { CnFormSelectTreeMultipleComponent } from '@shared/components/cn-form-select-tree-multiple/cn-form-select-tree-multiple.component';

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
    number: CnFormNumberComponent
};
@Directive({
    selector: '[cnFormResolverDirective]'
})
export class FormResolverDirective implements OnInit, OnChanges, OnDestroy {
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
                this.component.instance.bsnData = this.tempValue;
           // }
        }
        if (this.changeConfig) {
            // 判断是否是自己的级联对象
            this.changeConfig.forEach(changeConfig => {
                if (this.config.name === changeConfig.name) {

                    this.config = changeConfig;
                    this.container.clear();
                    if (!components[this.config.type]) {
                        const supportedTypes = Object.keys(components).join(', ');
                        throw new Error(
                            `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
                        );
                    }
                    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
                    this.component = this.container.createComponent(comp);
                    this.component.instance.config = this.config;
                  //  if (this.component.instance.bsnData) {
                        this.component.instance.bsnData = this.tempValue;
                   // }

                    if (this.config.type !== 'submit' || this.config.type !== 'button') {
                        this.component.instance.formGroup = this.formGroup;
                    }
                    if (this.config.type === 'search') {

                        // 测试事件上抛
                        // (<CnFormSearchComponent>this.component.instance).searchEmitter.subscribe(() => {
                        //   console.log('search');
                        // });


                    }
                    // 级联数据接受 liu
                    if (this.component.instance.updateValue) {
                        this.component.instance.updateValue.subscribe(event => {
                            this.setValue(event);
                        });
                    }
                    // console.log('变化' , this.changeConfig );
                }
            });


        }
    }

    ngOnInit() {
        if (!components[this.config.type]) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`
            );
        }
        this.container.clear();
        const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
       // if (this.component.instance.bsnData) {
            this.component.instance.bsnData = this.tempValue;
       // }
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


    // 组件将值写回、级联数据-》回写 liu
    setValue(data?) {
        this.updateValue.emit(data);
        // console.log('级联数据回写触发后', data);
    }

    ngOnDestroy() {
        if (this.component) {
            this.component.destroy();
        }
    }

    //  setExpandForm(expand?) {
    //    this.expandSearchForm.emit(expand);
    //  }

}

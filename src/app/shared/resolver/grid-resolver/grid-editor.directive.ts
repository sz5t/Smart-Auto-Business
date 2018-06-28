import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type,
  ViewContainerRef,
  forwardRef,
  Output,
  EventEmitter
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
import {CnGridInputComponent} from '@shared/components/cn-grid-input/cn-grid-input.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CnGridSelectComponent } from '@shared/components/cn-grid-select/cn-grid-select.component';
const components: {[type: string]: Type<any>} = {
  input: CnGridInputComponent,
  select: CnGridSelectComponent,
  // datePicker: NzDatePickerComponent,
  // timePicker: NzTimePickerComponent,
  // rangePicker: NzRangePickerComponent,
  checkbox: NzCheckboxComponent,
  checkboxGroup: NzCheckboxGroupComponent,
  radioGroup: NzRadioComponent
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
export class GridEditorDirective implements OnInit, OnChanges {
  @Input() config;
  @Input() value;
  @Input() rowData;
  @Input() bsnData;
  @Input() dataSet;
  @Output() updateValue = new EventEmitter();
  component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }
  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.value = this.value;
    }
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
    this.component.instance.value = this.value;
    this.component.instance.bsnData = this.bsnData;
    this.component.instance.rowData = this.rowData;
    if (this.dataSet) {
      this.component.instance.dataSet = this.dataSet;
    }
    this.component.instance.updateValue.subscribe(event => {
      this.setValue(event);
    });

  }
  // 组件将值写回
  setValue(data?) {
   // console.log('resolverupdateValue触发', data);
   this.value = data;
   this.updateValue.emit(data);
   // console.log('resolverupdateValue触发后', data);
  }
}



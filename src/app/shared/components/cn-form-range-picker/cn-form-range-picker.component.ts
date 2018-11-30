import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-range-picker',
  templateUrl: './cn-form-range-picker.component.html',
})
export class CnFormRangePickerComponent implements OnInit {
    @Input() public config;
    public formGroup: FormGroup;
    public date;
    @Output()
    public updateValue = new EventEmitter();
    constructor(
    ) { }

    public ngOnInit() {
    }
    public valueChange(name?) {
      if (name) {
          const backValue = { name: this.config.name, value: name };
          this.updateValue.emit(backValue);
      } else {
          const backValue = { name: this.config.name, value: name };
          this.updateValue.emit(backValue);
      }
  }

}

import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cn-form-input',
  templateUrl: './cn-form-input.component.html',
  styles: [
    `
    .anticon-close-circle {
      cursor: pointer;
      color: #ccc;
      transition: color 0.3s;
      font-size: 12px;
    }

    .anticon-close-circle:hover {
      color: #999;
    }

    .anticon-close-circle:active {
      color: #666;
    }
    `
  ]
})
export class CnFormInputComponent implements OnInit {
  @Input() config;
  @Input() formGroup: FormGroup;
  @Output()
  public updateValue = new EventEmitter();
  model;
  public inputReadonly = false;
  constructor(
  ) { }

  ngOnInit() {
    if (!this.config['disabled']) {
      this.config['disabled'] = false;
    }
    if (!this.config['readonly']) {
      this.config['readonly'] = false;
    }
    if (this.config.readonly) {
      this.inputReadonly = true;
    }
          // 未知是否有错误
          if (!this.model) {
            if (this.formGroup.value[this.config.name]) {
                this.model = this.formGroup.value[this.config.name];
            } else {
                if (this.config.hasOwnProperty('defaultValue')) {
                    this.model = this.config.defaultValue;
                } 
            }
        }
  }

  public valueChange(name?) {
    const backValue = { name: this.config.name, value: name };
    this.updateValue.emit(backValue);
}

public onblur(e?, type?) {
    this.assemblyValue();

}
public onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
        this.assemblyValue();
    }
}

// 组装值
public assemblyValue() {
   // this._value = this._value.trim();
    this.valueChange(this.model);
}

}

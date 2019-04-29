import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

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
    console.log(this.config);
  }

}

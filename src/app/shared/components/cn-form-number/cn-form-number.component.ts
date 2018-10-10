import { FormGroup } from '@angular/forms';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cn-form-number',
  templateUrl: './cn-form-number.component.html',
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
export class CnFormNumberComponent implements OnInit {
    @Input() config;
    @Input() formGroup: FormGroup;
    model;
    constructor(
    ) { }
    
    ngOnInit() {
      
    }

    formatter = value => {
      if (this.config.beforeFormatter) {
        return `${this.config.beforeFormatter ? this.config.beforeFormatter : ''}${value ? value : ''}`;
      } else if (this.config.afterFormatter) {
        return `${value ? value : ''}${this.config.afterFormatter ? this.config.afterFormatter : ''}`;
      } else {
        return value;
      }
    }

    parser = value => {
      if (this.config.beforeFormatter) {
        return value.replace(this.config.beforeFormatter, '');
      } else if (this.config.afterFormatter) {
        return value.replace(this.config.afterFormatter, '');
      } else {
        return value;
      }
      
    }



}

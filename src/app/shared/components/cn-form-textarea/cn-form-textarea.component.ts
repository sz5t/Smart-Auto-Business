import { FormGroup } from '@angular/forms';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cn-form-textarea',
  templateUrl: './cn-form-textarea.component.html',
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
export class CnFormTextareaComponent implements OnInit {
    @Input() config;
    @Input() formGroup: FormGroup;
    model;
    constructor(
    ) { }

    ngOnInit() {

    }

}

import { FormGroup } from '@angular/forms';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cn-form-hidden',
  templateUrl: './cn-form-hidden.component.html'
})
export class CnFormHiddenComponent implements OnInit {
    @Input() config;
    @Input() formGroup: FormGroup;
    model;
    constructor(
    ) { }

    ngOnInit() {
      
    }

}

import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-checkbox',
  templateUrl: './cn-form-checkbox.component.html',
})
export class CnFormCheckboxComponent implements OnInit {
    @Input() config;
    formGroup: FormGroup;
    model;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}

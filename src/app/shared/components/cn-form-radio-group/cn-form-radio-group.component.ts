import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-radio-group',
  templateUrl: './cn-form-radio-group.component.html',
})
export class CnFormRadioGroupComponent implements OnInit {
    @Input() config;
    formGroup: FormGroup;
    model;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}

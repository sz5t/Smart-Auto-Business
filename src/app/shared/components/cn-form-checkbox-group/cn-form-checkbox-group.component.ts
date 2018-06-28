import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-checkbox-group',
  templateUrl: './cn-form-checkbox-group.component.html',
})
export class CnFormCheckboxGroupComponent implements OnInit {
    @Input() config;
    formGroup: FormGroup;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}

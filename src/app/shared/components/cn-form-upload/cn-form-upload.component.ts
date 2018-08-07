import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-upload',
  templateUrl: './cn-form-upload.component.html',
})
export class CnFormUploadComponent implements OnInit {
    @Input() config;
    formGroup: FormGroup;
    model;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}

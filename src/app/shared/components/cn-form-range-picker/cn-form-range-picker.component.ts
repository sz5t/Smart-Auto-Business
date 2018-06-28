import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-range-picker',
  templateUrl: './cn-form-range-picker.component.html',
})
export class CnFormRangePickerComponent implements OnInit {
    @Input() config;
    formGroup: FormGroup;
    date;
    constructor(
    ) { }

    ngOnInit() {
    }

}

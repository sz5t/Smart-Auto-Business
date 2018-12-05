import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getMonth, getISOYear } from 'date-fns';

@Component({
    selector: 'cn-month-picker',
    templateUrl: './cn-month-picker.component.html'
})
export class CnMonthPickerComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input() public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public month = new Date();
    constructor() {}

    public ngOnInit() {

    }

    public ngAfterViewInit () {

    }

    public monthChange(date: Date) {
        const backValue = { name: this.config.name, value: `${getISOYear(this.month)}-${getMonth(this.month) + 1 }` };
        this.updateValue.emit(backValue);
    }
}

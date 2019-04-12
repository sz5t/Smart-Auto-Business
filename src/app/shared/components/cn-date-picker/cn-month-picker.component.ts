import { CommonTools } from './../../../core/utility/common-tools';
import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getMonth, getISOYear } from 'date-fns';

@Component({
    // tslint:disable-next-line:component-selector
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
        let backValue;
        if (this.config.sep) {
            backValue = { name: this.config.name, value: `${getISOYear(date)}${this.config.sep}${getMonth(date) + 1 }` };
        } else {
            backValue = { name: this.config.name, value: `${getISOYear(date)}${this.getNewMonth(getMonth(date) + 1) }` };
        }
        console.log(backValue);
        this.updateValue.emit(backValue);
    }

    public getNewMonth(d: any) {
        if (d <= 9) {
            d = '0' + d;
        }
        return d;
    }
}

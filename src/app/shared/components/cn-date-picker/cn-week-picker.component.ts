import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISOWeek, getISOYear } from 'date-fns';  

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-week-picker',
    templateUrl: './cn-week-picker.component.html'
})
export class CnWeekPickerComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input() public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public week = new Date();
    constructor() {}

    public ngOnInit() {}

    public ngAfterViewInit() {
        // setTimeout(() => {
        //     this.week = `${getISOYear(Date.now())}-${getISOWeek(new Date())}`;
        // })

    }

    public getWeek(date: Date): void {
        // this.week = getISOWeek(result);
        const backValue = { name: this.config.name, value: `${getISOYear(date)}-${getISOWeek(date)}` };
        this.updateValue.emit(backValue);
    }
}

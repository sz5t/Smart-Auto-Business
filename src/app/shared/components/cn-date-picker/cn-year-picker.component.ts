import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISOYear } from 'date-fns';

@Component({
    selector: 'cn-year-picker',
    templateUrl: './cn-year-picker.component.html'
})
export class CnYearPickerComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input() public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public year = new Date();
    constructor() {}

    public ngOnInit() {}

    public ngAfterViewInit() {
        
    }

    public changeYear(date: Date) {
        // this.year = getISOYear(date);
        const backValue = { name: this.config.name, value: `${getISOYear(date)}` };
        this.updateValue.emit(backValue);
    }
}

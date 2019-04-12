import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cn-date-picker',
    templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
    @Input()
    public config;
    @Input()
    public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public date = new Date();
    constructor() {}

    public ngOnInit() {}

    public valueChange(val?: Date) {
        if (val) {
            const year = val.getFullYear();
            const month = this.getNewDate(val.getMonth() + 1);
            const date = this.getNewDate(val.getDate());
            const backValue = {
                name: this.config.name,
                value: `${year}${
                    this.config.sep1 ? this.config.sep1 : '-'
                }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date}`
            };
            this.updateValue.emit(backValue);
        }
    }

    public getNewDate(d: any) {
        if (d <= 9) {
            d = '0' + d;
        }
        return d;
    }
}

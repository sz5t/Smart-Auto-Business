import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISODay, differenceInDays, getISOYear, getMonth, getDate, getDay, getTime } from 'date-fns';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-form-range-picker',
    templateUrl: './cn-form-range-picker.component.html',
})
export class CnFormRangePickerComponent implements OnInit {
    @Input() public config;
    public formGroup: FormGroup;
    public date;
    @Output()
    public updateValue = new EventEmitter();
    constructor(
    ) { }

    public ngOnInit() {
    }
    public valueChange(name?) {
        if (name) {
           
            const backValue = { name: this.config.name, value: name };
            if (name.length >= 2) {
                const s3 = getTime(name[0]);
                const s4 = getTime(name[1]);
                const date3 = s4 - s3;
    
                const days = Math.floor(date3 / (24 * 3600 * 1000)) + 1;
                backValue['dataItem'] = {days: days}; 
            }
            this.updateValue.emit(backValue);
        } else {
            const backValue = { name: this.config.name, value: name };
            this.updateValue.emit(backValue);
        }

       

    }

}

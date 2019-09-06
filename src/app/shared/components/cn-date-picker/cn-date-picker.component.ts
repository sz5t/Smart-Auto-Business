import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISOYear, getMonth, getISODay, getDate, getHours, getMinutes, getSeconds } from 'date-fns';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cn-date-picker',
    templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
    @Input()
    public config;
    public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public date = new Date();
    public controlValue;
    constructor() { }

    public ngOnInit() {
        if (!this.controlValue) {
            if (this.formGroup.value[this.config.name]) {
                this.value = this.formGroup.value[this.config.name];
            } else {
                const year = getISOYear(this.date);
                const month = this.getNewDate(getMonth(this.date) + 1);
                const date = this.getNewDate(getDate(this.date));
                const hour = this.getNewDate(getHours(this.date));
                const minute = this.getNewDate(getMinutes(this.date));
                const second = this.getNewDate(getSeconds(this.date));
                setTimeout(s => {
                    // this.controlValue = this.date;
                    this.controlValue = `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                        }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                        }${' '}${hour}${':'}${minute}${':'}${second}`
                    this.value = `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                        }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                        }${' '}${hour}${':'}${minute}${':'}${second}`
                }, 0);
            }
        }
    }

    public valueChange(val?: Date) {
        if (val) {
            const year = getISOYear(val);
            const month = this.getNewDate(getMonth(val) + 1);
            const date = this.getNewDate(getDate(val));
            const hour = this.getNewDate(getHours(val));
            const minute = this.getNewDate(getMinutes(val));
            const second = this.getNewDate(getSeconds(val));
            const backValue = {
                name: this.config.name,
                value: `${year}${
                    this.config.sep1 ? this.config.sep1 : '-'
                    }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                    }${' '}${hour}${':'}${minute}${':'}${second}`
            };
            setTimeout(s => {
                this.value = backValue.value;
                this.updateValue.emit(backValue);
            }, 0)
        }
    }

    public changeControlValue(val) {
        this.controlValue = val;
    }

    public getNewDate(d: any) {
        if (d <= 9) {
            d = '0' + d;
        }
        return d;
    }
}

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getMonth, getISOYear } from "date-fns";

@Component({
    selector: "cn-month-picker",
    templateUrl: "./cn-month-picker.component.html"
})
export class CnMonthPickerComponent implements OnInit {
    @Input()
    config;
    @Input() value;
    @Output()
    updateValue = new EventEmitter();
    formGroup: FormGroup;
    month;
    constructor() {}

    ngOnInit() {}

    monthChange(date: Date) {
        const backValue = { name: this.config.name, value: `${getISOYear(this.month)}-${getMonth(this.month) + 1 }` };
        this.updateValue.emit(backValue);
    }
}

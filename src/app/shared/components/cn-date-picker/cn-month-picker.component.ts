import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getMonth } from "date-fns";

@Component({
    selector: "cn-month-picker",
    templateUrl: "./cn-month-picker.component.html"
})
export class CnMonthPickerComponent implements OnInit {
    @Input()
    config;
    formGroup: FormGroup;
    month;
    constructor() {}

    ngOnInit() {}

    monthChange(date: Date) {
        this.month = getMonth(this.month);
    }
}

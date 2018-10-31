import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getISOWeek } from "date-fns";

@Component({
    selector: "cn-week-picker",
    templateUrl: "./cn-week-picker.component.html"
})
export class CnWeekPickerComponent implements OnInit {
    @Input()
    config;
    formGroup: FormGroup;
    week;
    constructor() {}

    ngOnInit() {}

    getWeek(result: Date): void {
        this.week = getISOWeek(result);
    }
}

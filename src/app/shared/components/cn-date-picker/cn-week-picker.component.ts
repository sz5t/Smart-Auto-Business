import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getISOWeek } from "date-fns";

@Component({
    selector: "cn-week-picker",
    templateUrl: "./cn-week-picker.component.html"
})
export class CnWeekPickerComponent implements OnInit {
    @Input()
    config;
    @Input() value;
    @Output()
    updateValue = new EventEmitter();
    formGroup: FormGroup;
    week;
    constructor() {}

    ngOnInit() {}

    getWeek(result: Date): void {
        this.week = getISOWeek(result);
        const backValue = { name: this.config.name, value: this.week };
        this.updateValue.emit(backValue);
    }
}

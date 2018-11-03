import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getISOYear } from "date-fns";

@Component({
    selector: "cn-year-picker",
    templateUrl: "./cn-year-picker.component.html"
})
export class CnYearPickerComponent implements OnInit {
    @Input()
    config;
    @Input() value;
    @Output()
    updateValue = new EventEmitter();
    formGroup: FormGroup;
    year;
    constructor() {}

    ngOnInit() {}

    changeYear(date: Date) {
        this.year = getISOYear(date);
        const backValue = { name: this.config.name, value: this.year };
        this.updateValue.emit(backValue);
    }
}

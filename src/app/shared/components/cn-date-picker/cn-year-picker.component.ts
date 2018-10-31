import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { getISOYear } from "date-fns";

@Component({
    selector: "cn-year-picker",
    templateUrl: "./cn-year-picker.component.html"
})
export class CnYearPickerComponent implements OnInit {
    @Input()
    config;
    formGroup: FormGroup;
    year;
    constructor() {}

    ngOnInit() {}

    changeYear(date: Date) {
        this.year = getISOYear(date);
    }
}

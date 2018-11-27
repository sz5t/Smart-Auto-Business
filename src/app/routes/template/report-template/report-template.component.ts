import {
    Component,
    OnInit,
    AfterViewInit,
    ViewEncapsulation
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
@Component({
    selector: "cn-report-template",
    templateUrl: "./report-template.component.html"
})
export class ReportTemplateComponent implements OnInit, AfterViewInit {
    constructor(private http: _HttpClient) {}

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }
    // region: init
    ngAfterViewInit() {}

    // endregion
}

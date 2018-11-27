import {
    Component,
    OnInit,
    Input
} from "@angular/core";
import { DataService } from "app/model/app-data.service";
@Component({
    selector: "bsn-report",
    templateUrl: "./bsn-report.component.html",
    styles: [``]
})
export class BsnReportComponent implements OnInit {
    @Input()
    config;
    @Input()
    viewId;
    data: any;
    autoGenerateColumns;
    hostStyle = {
        width: '100%',
        height: '500px'
    }
    constructor(
        private _appData: DataService,
    ) {

        this.data = _appData.getAirpotsData();
    }

    ngOnInit() {

    }

}

import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import { DataService } from 'app/model/app-data.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-report',
    templateUrl: './bsn-report.component.html',
    styles: [``]
})
export class BsnReportComponent implements OnInit {
    @Input()
    public config;
    @Input()
    public viewId;
    public data: any;
    public autoGenerateColumns;
    public hostStyle = {
        width: '100%',
        height: '500px'
    }
    constructor(
        private _appData: DataService,
    ) {

        this.data = _appData.getAirpotsData();
    }

    public ngOnInit() {

    }

}

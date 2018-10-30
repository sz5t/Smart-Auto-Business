import { CnComponentBase } from "./../../components/cn-component-base";
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject
} from "@angular/core";
@Component({
    selector: "bsn-tabs",
    templateUrl: "./bsn-tabs.component.html",
    styles: [``]
})
export class BsnTabsComponent extends CnComponentBase implements OnInit {
    @Input()
    config;
    @Input()
    viewId;
    @Input()
    permissions = [];
    constructor() {
        super();
    }

    ngOnInit() {
        console.log(this.tempValue);
        // console.log('tab_permissions:', this.permissions);
    }
}

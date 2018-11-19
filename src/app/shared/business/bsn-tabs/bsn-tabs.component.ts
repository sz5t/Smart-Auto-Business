import { CnComponentBase } from "./../../components/cn-component-base";
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject
} from "@angular/core";
import { instantiateDefaultStyleNormalizer } from "@angular/platform-browser/animations/src/providers";
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
    @Input()
    initData;
    constructor() {
        super();
    }

    ngOnInit() {
        console.log(this.tempValue);
        console.log(this.initData);
        // console.log('tab_permissions:', this.permissions);
    }
}

import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit
} from "@angular/core";
import { ApiService } from "@core/utility/api-service";
import { CacheService } from "@delon/cache";
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES
} from "@core/relative-Service/BsnTableStatus";
import { Observable, Observer } from "rxjs";
import { CnComponentBase } from "@shared/components/cn-component-base";
import { initDomAdapter } from "@angular/platform-browser/src/browser";
import { CommonTools } from "@core/utility/common-tools";
import { FormGroup } from "@angular/forms";
import { valueFunctionProp } from "ng-zorro-antd";
@Component({
    selector: "bsn-card-list-item",
    templateUrl: "./bsn-card-list-item.component.html",
    styles: [``]
})
export class BsnCardListItemComponent extends CnComponentBase
    implements OnInit, AfterViewInit {
    @Input()
    config;
    @Input()
    value;
    form: FormGroup;
    isLoading = true;
    data;
    _statusSubscription;
    _cascadeSubscription;
    constructor(
        private _apiService: ApiService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngOnInit() {}

    ngAfterViewInit() {
        if (this.value) {
            this.form.setValue(this.value);
        }
    }
}

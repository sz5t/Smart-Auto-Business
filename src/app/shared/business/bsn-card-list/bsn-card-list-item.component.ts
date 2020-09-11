import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit
} from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import {
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_MODE
} from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { CommonTools } from '@core/utility/common-tools';
import { FormGroup } from '@angular/forms';
import { valueFunctionProp } from 'ng-zorro-antd';
@Component({
    selector: 'bsn-card-list-item',
    templateUrl: './bsn-card-list-item.component.html',
    styles: [``]
})
export class BsnCardListItemComponent extends CnComponentBase
    implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input()
    public value;
    public form: FormGroup;
    public isLoading = true;
    public data;
    public _statusSubscription;
    public _cascadeSubscription;
    constructor(
        @Inject(BSN_COMPONENT_MODE)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    public ngOnInit() {}

    public ngAfterViewInit() {
        if (this.value) {
            this.form.setValue(this.value);
        }
    }
}

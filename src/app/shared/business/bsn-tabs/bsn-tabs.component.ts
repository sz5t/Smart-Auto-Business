import {Component, OnInit, Input, OnDestroy, Type, Inject} from '@angular/core';
@Component({
    selector: 'bsn-tabs',
    templateUrl: './bsn-tabs.component.html',
    styles: [
            ``
    ]
})
export class BsnTabsComponent implements OnInit {
    @Input() config;
    @Input() viewId;
    constructor() {

    }

    ngOnInit() {

    }
}

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
    @Input() permissions = [];
    constructor() {

    }

    ngOnInit() {
      // console.log('tab_permissions:', this.permissions);
    }
}

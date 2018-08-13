import {Component, OnInit, Input, OnDestroy, Type, Inject} from '@angular/core';
@Component({
    selector: 'bsn-accordion',
    templateUrl: './bsn-accordion.component.html',
    styles: [
            ``
    ]
})
export class BsnAccordionComponent implements OnInit {
    @Input() config;
    @Input() viewId;
    constructor() {

    }

    ngOnInit() {

    }
}

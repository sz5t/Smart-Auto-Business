import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'cn-layout-resolver',
    templateUrl: './layout-resolver.component.html',
    styles:[
        `
            :host ::ng-deep .ant-card-head {
                min-height:36px;
            }
        `
    ]
})
export class LayoutResolverComponent implements OnInit {
    @Input() config;
    @Input() layoutId;
    @Input() editable = false;

    constructor() {
    }

    ngOnInit() {

    }

    switch() {
        this.editable = !this.editable;
    }
}

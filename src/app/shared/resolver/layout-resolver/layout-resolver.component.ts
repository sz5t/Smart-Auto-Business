import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "cn-layout-resolver",
    templateUrl: "./layout-resolver.component.html",
    styles: [
        `
            :host ::ng-deep .ant-card-head {
                min-height: 36px;
            }
        `
    ]
})
export class LayoutResolverComponent implements OnInit {
    @Input()
    config;
    @Input()
    permissions;
    @Input()
    layoutId;
    @Input()
    initData;
    @Input()
    tempValue;
    @Output()
    public updateValue = new EventEmitter();
    public value;
    constructor() {}

    ngOnInit() {
    }

    public valueChange(data?) {
       this.value = data;
        console.log('布局信息返回');

    }
}

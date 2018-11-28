import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-form-label',
    templateUrl: './cn-form-label.component.html',
    styles: [
        `
            .anticon-close-circle {
                cursor: pointer;
                color: #ccc;
                transition: color 0.3s;
                font-size: 12px;
            }

            .anticon-close-circle:hover {
                color: #999;
            }

            .anticon-close-circle:active {
                color: #666;
            }
        `
    ]
})
export class CnFormLabelComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input()
    public formGroup: FormGroup;
    public model = '';
    public modelText = '';
    constructor() {}

    public ngOnInit() {}
    public ngAfterViewInit() {
        // if (this.config.textName) {
        //   this.modelText = this.formGroup.controls[this.config.textName].value;
        // }
    }
}

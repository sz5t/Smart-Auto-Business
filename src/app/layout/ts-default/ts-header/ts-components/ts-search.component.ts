import { Component, HostBinding, ViewChild, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'ts-header-search',
    template: `
    <nz-input-group nzAddOnBeforeIcon="anticon anticon-search">
        <input nz-input [(ngModel)]="q" (focus)="qFocus()" (blur)="qBlur()"
            [placeholder]="'搜索'">
    </nz-input-group>
    `
})
export class TsHeaderSearchComponent implements AfterViewInit {

    public q: string;

    public qIpt: HTMLInputElement;

    @HostBinding('class.header-search__focus')
    public focus = false;

    @HostBinding('class.header-search__toggled')
    public searchToggled = false;

    @Input()
    set toggleChange(value: boolean) {
        if (typeof value === 'undefined') return;
        this.searchToggled = true;
        this.focus = true;
        setTimeout(() => this.qIpt.focus(), 300);
    }

    constructor(private el: ElementRef) {}

    public ngAfterViewInit() {
        this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement;
    }

    public qFocus() {
        this.focus = true;
    }

    public qBlur() {
        this.focus = false;
        this.searchToggled = false;
    }
}

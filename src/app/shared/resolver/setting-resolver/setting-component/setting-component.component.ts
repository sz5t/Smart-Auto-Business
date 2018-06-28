import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';

@Component({
    selector: 'cn-setting-component',
    templateUrl: './setting-component.component.html',
})
export class SettingComponentComponent implements OnInit {

    @Input() config;
    @Input() layoutId;
    @ViewChild(ComponentSettingResolverComponent)
    componentsettingResolver: ComponentSettingResolverComponent;
    _isRows = false;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
        // this._isRows = Array.isArray(this.config.rows);
    }

}

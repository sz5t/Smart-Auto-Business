import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Validators } from '@angular/forms';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';

@Component({
  selector: 'cn-layout-setting-resolver',
  templateUrl: './layout-setting-resolver.component.html',
})
export class LayoutSettingResolverComponent implements OnInit, OnChanges {
  @Input() config;
  @Input() layoutId;
  @ViewChild(ComponentSettingResolverComponent)
  componentsettingResolver: ComponentSettingResolverComponent;
  _isRows = false;
  constructor(
    private http: _HttpClient
  ) { }

  ngOnChanges() {

  }

  ngOnInit() {
    this._isRows = Array.isArray(this.config.rows);
  }


}

import { NzMessageService } from 'ng-zorro-antd';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { SettingComponentEditorComponent } from '@shared/resolver/setting-resolver/setting-component/setting-component-editor.component';

@Component({
  selector: 'cn-setting-layout',
  templateUrl: './setting-layout.component.html',
})
export class SettingLayoutComponent implements OnInit {

  @Input() config;
  @Input() layoutId;
  @ViewChild(SettingComponentEditorComponent)
  componentsettingResolver: ComponentSettingResolverComponent;
  _isRows = false;
  isVisible = false;
  isConfirmLoading = false;
  blockEntity;
  title;
  icon;
  id;
  metadata;
  constructor(
    private _http: ApiService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    if (this.config) {
      this._isRows = Array.isArray(this.config.rows);
    }
  }

  edit() {
    if (this.config) {
      (async () => {
        const block: any = await this._loadBlockData();
        this.title = block.Data.Title ? block.Data.Title : '';
        this.icon = block.Data.Icon ? block.Data.Icon : '';
        this.id = block.Data.Id ? block.Data.Id : '';
        this.metadata = block.Data.Metadata ? JSON.parse(block.Data.Metadata) : {};
        this.isVisible = true;
      })();
    }
  }

  delete() {

  }

  async _loadBlockData() {
    return this._http.getProj(`${APIResource.BlockSetting}/${this.config.id}`).toPromise();
  }

  _updateBlockData() {
    this.metadata.title = this.title;
    this.metadata.icon = this.icon;
    const body = {
      Title: this.title, 
      Icon: this.icon, 
      Id: this.id,
      Metadata: JSON.stringify(this.metadata)
    };
    this._http.putProj(APIResource.BlockSetting, body).subscribe(result => {
      if (result && result.Status === 200) {
        this.message.create('success', '保存成功');
        this.isVisible = false;
        this.config.icon = this.icon;
        this.config.title = this.title;
        // Todo: 调用列表刷新功能
      } else {
        this.message.create('info', '保存失败');
      }
    }, error => {
      this.message.create('error', error.Message);
    }
    );
  }

  handleOk() {
    this._updateBlockData();
  }

  handleCancel() {
    this.isVisible = false;
  }

}

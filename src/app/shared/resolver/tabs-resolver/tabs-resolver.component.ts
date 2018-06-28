import { NzMessageService } from 'ng-zorro-antd';
import { APIResource } from './../../../core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';
import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-tabs-resolver',
  templateUrl: './tabs-resolver.component.html',
})
export class TabsResolverComponent implements OnInit {
  @Input() layoutId;
  @Input() config;
  @Input() blockId;
  @Input() tabsId;
  isVisible = false;
  _tabName;
  isEdit = false;
  _tab;
  _index;
  constructor(
    private _http: ApiService,
    private _nzMessage: NzMessageService
  ) { }

  ngOnInit() {
  }

  uuID(w) {
    let s = '';
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < w; i++) {
      s += str.charAt(Math.round(Math.random() * (str.length - 1)));
    }
    return s;
  }

  showModal = (type) => {
    if (type === 'new') {
      this.isEdit = false;
      // this._tabName = this._tab.name;
    } else if (type === 'edit') {
      this.isEdit = true;
      // this._tabName = name;
    }
    this.isVisible = true;
  }

  handleOk = (e) => {
    if (this.isEdit) {
      this._tab.name = this._tabName;
    } else {
      const id = `tab_${this.uuID(6)}`;
      this.config.push({
        id: id,
        name: this._tabName
      });
      this._index = this.config.length - 1;
      const body = {
        LayoutId: this.layoutId,
        ParentId: this.tabsId,
        Title: this._tabName,
        Icon: '',
        ShowTitle: true,
        Type: 'tab'
      };
      this.save(body);
    }

    this.isVisible = false;
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }


  selectedTab = (tab) => {
    this._tab = tab;
  }

  closeTab(tab: any): void {
    this.config.splice(this.config.indexOf(tab), 1);
  }

  save(body) {
    this._http.postProj(APIResource.BlockSetting, body).subscribe(result => {
      if (result && result.Status === 200 ) {
        this._nzMessage.create('success', '标签保存成功');
      }
    }, error => {
      this._nzMessage.create('error', error.Message);
    });
  }

  delete (param) {

  }

  update (body) {

  }

}

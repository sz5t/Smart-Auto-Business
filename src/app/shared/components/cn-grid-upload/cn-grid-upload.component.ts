import { Component, OnInit, Type, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { BsnUploadComponent } from '@shared/business/bsn-upload/bsn-upload.component';
const component: { [type: string]: Type<any> } = {
  layout: LayoutResolverComponent,
  form: CnFormWindowResolverComponent,
  upload: BsnUploadComponent
};
@Component({
  selector: 'cn-grid-upload',
  templateUrl: './cn-grid-upload.component.html',
  styleUrls: ['./cn-grid-upload.component.css']
})
export class CnGridUploadComponent extends CnComponentBase implements OnInit {
  @Input()
  public config;
  @Input()
  public value;
  @Input()
  public bsnData;
  @Input()
  public rowData;
  @Input()
  public dataSet;
  @Input()
  public casadeData;
  @Input()
  public initData;

  @Output()
  public updateValue = new EventEmitter();
  public isUpload = true;
  constructor(private modalService: NzModalService) {
    super();
    this.baseModal = this.modalService;
  }

  public ngOnInit() {
    if (this.bsnData) {
      for (const key in this.bsnData) {
        if (this.bsnData.hasOwnProperty(key)) {
          this.tempValue[key] = this.bsnData[key];
        }
      }
    }
    // if (this.rowData) {
    //   if (this.rowData.row_status === 'updating') {
    //     this.isUpload = true;
    //   } else {
    //     this.isUpload = false;
    //   }
    // } else {
    //   this.isUpload = false;
    // }

  }

  /**
 * 弹出上传表单
 * @param dialog
 * @returns {boolean}
 */
  public openUploadDialog() {
    const dialog = this.config.select.upload;
    if (!dialog) {
      return false;
    }
    if (!this.rowData) {
      this.baseMessage.warning('请选中一条需要添加附件的记录！');
      return false;
    }
    const footer = [];
    const obj = {
      _id: this.rowData[dialog.keyId],
      _parentId: this.tempValue['_parentId']
    };
    const modal = this.baseModal.create({
      nzTitle: dialog.title,
      nzWidth: dialog.width,
      nzContent: component['upload'],
      nzComponentParams: {
        config: dialog.ajaxConfig,
        refObj: obj
      },
      nzFooter: footer
    });
  }

}

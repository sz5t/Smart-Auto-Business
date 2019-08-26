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
  selector: 'cn-grid-markdownlabel',
  templateUrl: './cn-grid-markdownlabel.component.html',
  styleUrls: ['./cn-grid-markdownlabel.component.css']
})
export class CnGridMarkdownlabelComponent extends CnComponentBase implements OnInit {
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
  public _value;
  public isUpload = false;
  public height;
  constructor(private modalService: NzModalService) {
    super();
    this.baseModal = this.modalService;
  }

  public ngOnInit() {
    if (this.config.height) {
      this.height = this.config.height
    } else {
      this.height = '100px'
    }
    if (this.bsnData) {
      for (const key in this.bsnData) {
        if (this.bsnData.hasOwnProperty(key)) {
          this.tempValue[key] = this.bsnData[key];
        }
      }
    }
    if (this.value) {
      this._value = this.value.data;
      if (this.value) {
          if (this.config.hasOwnProperty('defaultValue')) {
              this.value = this.config.defaultValue;
          }
      }

  }


  }



}

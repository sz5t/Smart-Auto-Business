import { Component, OnInit, Input, Output, EventEmitter, Type } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CnComponentBase } from '../cn-component-base';
import { CnVideoPlayComponent } from '@shared/business/cn-video-play/cn-video-play.component';

const component: { [type: string]: Type<any> } = {
  video: CnVideoPlayComponent
};

@Component({
  selector: 'cn-grid-video',
  templateUrl: './cn-grid-video.component.html',
  styleUrls: ['./cn-grid-video.component.css']
})
export class CnGridVideoComponent extends CnComponentBase implements OnInit {

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
  public btnTitle = '查看';
  private dialog: any;
  private playType: string;
  constructor(private modalService: NzModalService) {
    super();
    this.baseModal = this.modalService;
  }
  public ngOnInit() {
    if (this.config.video) {
      this.dialog = this.config.video;
      if (this.dialog.videoMapping.mapping && this.dialog.videoMapping.mapping.length > 0) {
        this.dialog.videoMapping.mapping.forEach(element => {
          const value = this.rowData[this.dialog.videoMapping.field];
          const matchValue = element.value;
          if (value === matchValue) {
             try {
              this.btnTitle = element.title;
              this.playType = element.type;
              throw new Error();
             } catch {

             }
          }
        });
      }
    }
  }

  public openVideoDialog() {
    if (!this.dialog) {
      return false;
    }
    if (!this.rowData) {
      this.baseMessage.warning('请选中一条需要查看视频的记录！');
      return false;
    }
    const footer = [];
    const obj = {
      _id: this.rowData[this.dialog.keyId],
      _parentId: this.tempValue['_parentId'],
      Id: this.rowData['Id']
    };

    const urlObj = {
      token: '6170--33',
      stream: 'sub',
      session: 'c1782caf-b670-42d8-ba90-2244d0b0ee80',
      playType: this.playType,
      url: this.config.video.url
    };
    const modal = this.baseModal.create({
      nzTitle: this.dialog.title,
      nzWidth: this.dialog.width,
      nzContent: component['video'],
      nzComponentParams: {
        config:   urlObj,
        initData: {...obj, ...this.rowData}
      },
      nzFooter: footer,
      nzOnOk: () => {
        new Promise(resolve => (setTimeout(resolve, 0)));
      } 
    });
  }

}

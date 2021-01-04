import { Component, OnInit, Input, Output, EventEmitter, Type } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CnComponentBase } from '../cn-component-base';
import { CnVideoPlayComponent } from '@shared/business/cn-video-play/cn-video-play.component';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';

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

  public equipments: any[];
  public btnTitle: string = '实时视频';

  @Output()
  public updateValue = new EventEmitter();
  public isUpload = true;
  private dialog: any;
  private playType: string = 'play';

  constructor(private modalService: NzModalService, private _http: ApiService) {
    super();
    this.baseModal = this.modalService;
  }

  public async loadEquipments()
  {
    const params = CommonTools.parametersResolver({
      params: this.config.ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue
    });
    return this._http.get(this.config.ajaxConfig.url, params).toPromise();
  }

  private initComponent() {
    if(!this.tempValue) {
      this.tempValue = {};
    }
    if(this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
    if(this.rowData) {
      this.initValue = {...this.initValue, ...this.rowData}
    }
  }

  public async ngOnInit() {
    this.initComponent();
    if (this.config.video) {
      this.dialog = this.config.video;
      if (this.dialog.videoMapping.mapping && this.dialog.videoMapping.mapping.length > 0) {
        this.dialog.videoMapping.mapping.forEach(element => {
          const value = this.rowData[this.dialog.videoMapping.field];
          const matchValue = element.value;
          if (value === matchValue) {
             try {
              this.btnTitle = '回看';
              this.playType = 'playback';
              throw new Error();
             } catch {

             }
          } else {
            try{
              throw new Error();
            } catch {}
          }
        });
      }

      const data = await this.loadEquipments();
      if(data) {
        if(data.data && data.status === 200 && data.isSuccess) {
          this.equipments = data.data;
        }
      }
    }
  }

  public openVideoDialog(eqmt: any) {
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
      token: eqmt.token,
      stream: 'main',
      session: eqmt.sessionid,
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

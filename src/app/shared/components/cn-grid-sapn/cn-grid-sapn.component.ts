import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
  selector: 'cn-grid-sapn',
  templateUrl: './cn-grid-sapn.component.html',
  styleUrls: ['./cn-grid-sapn.component.css']
})
export class CnGridSapnComponent extends CnComponentBase implements OnInit {

  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData;
  @Input() public initData;

  @Output() public updateValue = new EventEmitter();

  public isShow = false;
  public showAll = false;
  public showLable;
  public showShortLable;
  public showTitle;


  constructor() {
    super();
  }

  public ngOnInit() {
    if (this.bsnData) {
      for (const key in this.bsnData) {
        if (this.bsnData.hasOwnProperty(key)) {
          this.tempValue[key] = this.bsnData[key];
        }
      }
    }


    if (this.config.formatConfig) {
      this.config.formatConfig.forEach(formatConfig => {

        let regularData;
        if (formatConfig.type) {
          if (formatConfig.type === 'row') {
            if (this.rowData) {
              regularData = this.rowData[formatConfig['valueName']];
            }
          }
        }
        this.showTitle = regularData;
        this.showLable = regularData;
        const regularflag = formatConfig.responseConfig.substrlength ? formatConfig.responseConfig.substrlength : 50;
        if (regularData.length <= regularflag) {
          this.isShow = true;
          return true;
        } else {
          this.isShow = false;
          this.showShortLable = regularData.substring(1, regularflag);
          return true;
        }

      });


    }

  }

  // 展开文本
  public openSapn() {
    this.showAll = !this.showAll;

  }

  // 收缩文本
  public closeSapn() {
    this.showAll = !this.showAll;

  }

  // tslint:disable-next-line:member-ordering
  public p_config = {
    "showFormat": {
      "type": "sapn",
      "field": "physicalname",
      "options": {
        "type": "sapn",
        "labelSize": "6",
        "name": "code1",
        "controlSize": "18",
        "inputType": "text",
        "formatConfig": [
          {
            "type": "row",
            "valueName": "filedata",
            "responseConfig": {
              "substrlength": 200  // 截取长度（当超过这个长度进行字符截取）
            }
          }
        ],
      }
    }
  }


}

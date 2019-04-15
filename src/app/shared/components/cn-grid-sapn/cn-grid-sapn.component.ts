import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
  selector: 'cn-grid-sapn',
  templateUrl: './cn-grid-sapn.component.html',
  styleUrls: ['./cn-grid-sapn.component.css']
})
export class CnGridSapnComponent extends CnComponentBase implements OnInit  {

  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData;
  @Input() public initData;

  @Output()  public updateValue = new EventEmitter();
  public isUpload = false;

  public showLable;
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
        const reg1 = new RegExp(formatConfig.regular);
        let regularData;
        if (formatConfig.type) {
          if (formatConfig.type === 'row') {
            if (this.rowData) {
              regularData = this.rowData[formatConfig['valueName']];
            }
          }
        }
        const regularflag = reg1.test(regularData);
        if (regularflag) {
          this.isUpload = formatConfig.responseConfig.hidden;
          return true;
        }

      });


    }

  }

// 展开文本
public openSapn() {

}

// 收缩文本
public closeSapn() {

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
          "regular": "^-$",
          "responseConfig": {
            "hidden": true,
            "substrlength":200  // 截取长度（当超过这个长度进行字符截取）
          }
        }
      ],
    }
  }
}


}

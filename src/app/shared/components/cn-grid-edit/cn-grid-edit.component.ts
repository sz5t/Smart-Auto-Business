import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-grid-edit',
  templateUrl: './cn-grid-edit.component.html',
  styleUrls: ['./cn-grid-edit.component.css']
})
export class CnGridEditComponent implements OnInit {
  @Input() public searchConfigType;
  @Input() public config;
  @Input() public value;
  @Input() public rowData;
  @Input() public bsnData;
  @Input() public dataSet;
  @Input() public changeConfig;
  @Input() public initData;
  @Output() public updateValue = new EventEmitter();
  public edit_config;
  constructor() { }

  public ngOnInit() {
    // console.log('列多组件：', this.config);
   // console.log('变化列初始化：', this.value);
    // 此处做处理，动态简析条件
   // console.log('变化列配置', this.value.data, this.config.editor, this.rowData);
    this.edit_config = this.setCellFont(this.value.data, this.config.editor, this.rowData);

  }

  // 简析出当前应该展示的组件
  public setCellFont(value, format, row) {
    let fontColor = '';
    if (format) {
      format.map(color => {
        if (color.caseValue) {
          const reg1 = new RegExp(color.caseValue.regular);
          let regularData;
          if (color.caseValue.type) {
            if (color.caseValue.type === 'row') {
              if (row) {
                regularData = row[color.caseValue['valueName']];
              } else {
                regularData = value;
              }
            } else {
              regularData = value;
            }
          } else {
            regularData = value;
          }
          const regularflag = reg1.test(regularData);
          // console.log(color.caseValue.regular,regularData,regularflag,color);
          if (regularflag) {
            fontColor = color.options;
          }
        }
      });
    }

    if (!fontColor) {
      fontColor = format[0].options;
    }

    return fontColor;
  }

  // 值返回
  public valueChange(name?) {
    // console.log('变化列返回：', this.value);

    // this.value.data = name;
    this.updateValue.emit(name);
  }

}

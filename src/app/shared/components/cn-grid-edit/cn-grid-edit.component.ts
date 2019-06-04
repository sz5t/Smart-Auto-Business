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

    this.value.data =  this.rowData[this.value.name];
    this.edit_config = this.setCellFont(this.value.data, this.config.editor, this.rowData);

console.log('grid-edit:', this.value, this.rowData);
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

    // this.value.data = name;
    this.updateValue.emit(name);
  }

  // editor: [
  //   {
  // caseValue: { type: 'row', valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
  //     options: {
  //         type: 'input',
  //         labelSize: '6',
  //         controlSize: '18',
  //         inputType: 'text'
  //     }
  //   }
  // ]

}

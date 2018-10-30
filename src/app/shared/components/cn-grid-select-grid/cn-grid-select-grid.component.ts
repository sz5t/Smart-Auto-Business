import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';

@Component({
  selector: 'cn-grid-select-grid,[cn-grid-select-grid]',
  templateUrl: './cn-grid-select-grid.component.html',
  styleUrls: ['./cn-grid-select-grid.component.css']
})
export class CnGridSelectGridComponent implements OnInit {


  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  @Input() casadeData;
  @Input() initData;

  @Output() updateValue = new EventEmitter();

  @ViewChild('table') table: BsnTableComponent;

  resultData;
  cascadeValue = {};
  cascadeSetValue = {};

  isVisible = false;
  isConfirmLoading = false;
  _value;
  _valuetext;
  constructor() { }

  // 模板配置
  pz = {
    title: 'Id', field: 'Id', width: 80, hidden: true,
    editor: {
      type: 'selectgrid',
      field: 'Id',
      options: {
        'type': 'input',
        'labelSize': '6',
        'controlSize': '18',
        'inputType': 'text',
      }
    }
  };

  ngOnInit(): void {

    this._value = null;
    // console.log('被级联数据', this.casadeData);
    if (this.casadeData) {

      for (const key in this.casadeData) {
        // 临时变量的整理
        if (key === 'cascadeValue') {
          for (const casekey in this.casadeData['cascadeValue']) {
            if (this.casadeData['cascadeValue'].hasOwnProperty(casekey)) {
              this.cascadeValue[casekey] = this.casadeData['cascadeValue'][casekey];

            }
          }
        } else if (key === 'options') { // 目前版本，静态数据集 优先级低
          this.config.options = this.casadeData['options'];
        } else if (key === 'setValue') {
          this.cascadeSetValue['setValue'] = JSON.parse(JSON.stringify(this.casadeData['setValue']));
          delete this.casadeData['setValue'];

        }


      }
    }

     if (!this.config.select.nzWidth) {
      this.config.select.nzWidth = 768;

     }
     if (!this.config.select.title) {
      this.config.select.title = '弹出列表';

     }
    // 修改配置列表配置，修改ajax配置，将配置

    if (!this.config.labelName) {
      this.config.labelName = 'name';
    }
    if (!this.config.valueName) {
      this.config.labelName = 'Id';
    }
   //  console.log('ngOnInit this.value:', this.value);
    this.config.width = this.config.width - 30;
    this.resultData = this.table.dataList;

    if (this.cascadeSetValue.hasOwnProperty('setValue')) {
      this.selectedBycascade();
    } else {

      this.selectedByLoaded();
    }

  }

  showModal(): void {
    this.isVisible = true;
    this.table.value = this._value ;
  }

  handleOk(): void {
  
    this.isVisible = false;

    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
    // console.log('选中行', this.table.dataList);
    // console.log('选中行', this.table._selectRow);

    if (this.table._selectRow) {
      this._valuetext = this.table._selectRow[this.config.labelName];
      this._value = this.table._selectRow[this.config.valueName];
    } else {
      this._valuetext = null;
      this._value = null;
    }



    // this.valueChange(this._value);
    this.valueChange(this._value);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  selectedByLoaded() {
    let selected;
    if (this.value && this.value.hasOwnProperty('data') && this.value['data'] !== undefined) {
      // this._options.forEach(element => {
      //     if (element.value === this.value.data) {
      //         selected = element;
      //     }
      // });
      selected = this.value.data;
    } else {
      // this._options.forEach((element => {
      //     if (element.value === this.config.defaultValue) {
      //         selected = element;
      //     }
      // }));
      selected = this.config.defaultValue;
    }
    // this._selectedOption = selected;
    this._value = selected;
    // if (this._selectedOption) {
    //     this.valueChange(this._selectedOption);
    // }

    // this.table.selectRow();
    if (this.value && this.value.hasOwnProperty('dataText') && this.value['dataText'] !== undefined) {
      this._valuetext = this.value['dataText'];
    }
    if (this._value) {
      this.valueChange(this._value);
      // console.log('调用selectload');
      //  this.table.selectload();
    }
  }

  // 级联赋值
  selectedBycascade() {
    // 假如有级联赋值，则需要取文本值
    let selected;
    if (this.cascadeSetValue.hasOwnProperty('setValue')) {
      selected = this.cascadeSetValue['setValue'];
      this._value = selected;
      delete this.cascadeSetValue['setValue'];
    }

    this.valueChange(this._value);

  }





  valueChange(name?) {

    // console.log('值变化', name);
    this.resultData = this.table.dataList;
   
    if (name) {
      this.value.data = name;
      // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
      if (this.resultData) { // valueName
        const index = this.resultData.findIndex(item => item[this.config['valueName']] === name);
        this.resultData && (this.value['dataItem'] = this.resultData[index]);

      }
      this.value['dataText'] = this._valuetext;
      this.updateValue.emit(this.value);
    } else {
      this.value.data = null;
      this.value.dataText = null;
      this.updateValue.emit(this.value);
    }
   // console.log('弹出表格返回数据', this.value);
  }

}

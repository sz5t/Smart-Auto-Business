import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-select-grid-multiple,[cn-form-select-grid-multiple]',
  templateUrl: './cn-form-select-grid-multiple.component.html',
  styleUrls: ['./cn-form-select-grid-multiple.component.css']
})
export class CnFormSelectGridMultipleComponent implements OnInit {
  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData = {};
  @Input() public changeConfig;
  @Output() public updateValue = new EventEmitter();
  public formGroup: FormGroup;
  @ViewChild('table') public table: BsnTableComponent;
  public resultData;
  public cascadeValue = {};
  public cascadeSetValue = {};

  public isVisible = false;
  public isConfirmLoading = false;
  public _value;
  public _valuetext;
  public permissions = [];

  public tags = [];
  // 缓存
  public tags_mode = [];
  public inputVisible = false;
  private inputValue1 = '';

  constructor() { }
  public nzWidth = 1024;

  // 模板配置

  public ngOnInit(): void {
    // console.log('ngOnInitvalue: ', this.value);
    // this._value = this.formGroup.value[this.config.name];
    // console.log('被级联数据', this.casadeData);
    if (this.changeConfig) {
      if (this.changeConfig['cascadeValue']) {
        // cascadeValue
        for (const key in this.changeConfig['cascadeValue']) {
          if (this.changeConfig['cascadeValue'].hasOwnProperty(key)) {
            this.cascadeValue[key] = this.changeConfig['cascadeValue'][key];
          }
        }
      }
    }

    if (this.cascadeValue) {
      if (this.casadeData) {
        this.casadeData = {};
      }
      this.casadeData['cascadeValue'] = this.cascadeValue;
    }
    if (this.casadeData) {
      for (const key in this.casadeData) {
        // 临时变量的整理
        if (key === 'cascadeValue') {
          for (const casekey in this.casadeData['cascadeValue']) {
            if (
              this.casadeData['cascadeValue'].hasOwnProperty(
                casekey
              )
            ) {
              this.cascadeValue[casekey] = this.casadeData[
                'cascadeValue'
              ][casekey];
            }
          }
        } else if (key === 'options') {
          // 目前版本，静态数据集 优先级低
          this.config['options'] = this.casadeData['options'];
        } else if (key === 'setValue') {
          this.cascadeSetValue['setValue'] = JSON.parse(
            JSON.stringify(this.casadeData['setValue'])
          );
          delete this.casadeData['setValue'];
        }
      }
    }

    if (this.config.select) {
      if (!this.config.select.nzWidth) {
        this.config.select.nzWidth = 768;
      }
      if (!this.config.select.title) {
        this.config.select.title = '弹出列表';
      }
    }

    // 修改配置列表配置，修改ajax配置，将配置

    if (!this.config.labelName) {
      this.config.labelName = 'name';
    }
    if (!this.config.valueName) {
      this.config.valueName = 'Id';
    }
    //  console.log('ngOnInit this.value:', this.value);


    if (this.cascadeSetValue.hasOwnProperty('setValue')) {
      // this.selectedBycascade();
      // 表单的级联赋值在上层，控制方式待定
    } else {
      // this.selectedByLoaded();
    }
  }

  public showModal(): void {
    this.isVisible = true;
    this.tags_mode = this.tags;
    // this.table.value = this._value;
  }

  public handleOk(): void {
    this.tags = this.tags_mode;
    this.isVisible = false;
    // console.log('选中行' , this.table._selectRow);
    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
    let labels = '';
    let values = '';
    this.tags.forEach(element => {
      labels = labels + element.label + ',';
      values = values + element.value + ',';
    });
    this._valuetext = labels;
    this._value = values;
    if (this._valuetext.length > 0) {
      this._valuetext = this._valuetext.substring(0, this._valuetext.length - 1);
    }
    if (this._value.length > 0) {
      this._value = this._value.substring(0, this._value.length - 1);
    }
    // console.log('数据', this._value);
  }

  // 获取多选文本值
  public getMultipleValue() {
    let labels = '';
    let values = '';
    this.tags.forEach(element => {
      labels = labels + element.label + ',';
      values = values + element.value + ',';
    });
    if (labels.length > 0) {
      this._valuetext = this._valuetext.substring(0, labels.length - 1);
    } else {
      this._valuetext = null;
    }
    if (values.length > 0) {
      this._value = this._value.substring(0, values.length - 1);
    } else {
      this._value = null;
    }
  }

  public getMultipleTags(dlist?) {
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    dlist.array.forEach(data => {
      const b_lable = data[labelName];
      const b_value = data[valueName]; // 取值时动态读取的
      const newobj = { label: b_lable, value: b_value };

      let isInsert = true;
      this.tags.forEach(element => {
        if (element.value === b_value) {
          isInsert = false;
        }
      });
      if (newobj && isInsert) {
        this.tags.push(newobj);
      }
    });

  }

  public handleCancel(): void {
    // console.log('点击取消');
    this.isVisible = false;
  }

  public async valueChange(name?) {
    // console.log('valueChangeSelectGridMultiple', name);

    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    if (name) {
      const backValue = { name: this.config.name, value: name };
      // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
      // console.log('this.resultData:', this.resultData);
      if (this.tags) {
        // valueName
        const index = this.tags.length;
        if (this.tags) {
          if (index >= 0) {
            this.getMultipleValue();
          } else {
            // 取值
            const componentvalue = {};
            componentvalue[valueName] = name;
            if (this.config.ajaxConfig) {
              const backselectdata = await this.table.loadByselectMultiple(
                this.config.ajaxConfig,
                componentvalue,
                this.bsnData,
                this.casadeData
              );
              this.getMultipleTags(backselectdata);
              this.getMultipleValue();

            } else {
              this._valuetext = this._value;
            }
            // console.log('loadByselect: ',  backselectdata) ;
          }
        }

        // console.log('iftrue弹出表格返回数据', backValue);
      }
      // this.value['dataText'] = this._valuetext;
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
      // console.log('iffalse弹出表格返回数据', backValue);
    }
  }

  // tslint:disable-next-line:member-ordering
  public ck_value;
  public valueChangeByModal(data?) {
    // console.log('树选中', data);
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    const b_label = data[labelName];
    const b_value = data[valueName]; // 取值时动态读取的
    const newobj = { label: b_label, value: b_value };

    let isInsert = true;
    this.tags_mode.forEach(element => {
      if (element.value === b_value) {
        isInsert = false;
      }
    });
    if (newobj && isInsert) {
      this.tags_mode.push(newobj);
    }
  }


  public handleClose(removedTag: {}): void {
    this.tags_mode = this.tags_mode.filter(tag => tag !== removedTag);
  }

  public handleClosetag(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    this.getMultipleValue();
    this.valueChange(this._value);
  }


  public sliceTagName(tag: any): string {
    const isLongTag = tag['label'].length > 20;
    return isLongTag ? `${tag['label'].slice(0, 20)}...` : tag['label'];
  }

  // 问题：多选初值？？？？ 需要异步取值，处理成json数组

}

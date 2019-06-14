import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsnMarkdownComponent } from '@shared/business/bsn-markdown/bsn-markdown.component';

@Component({
  selector: 'cn-form-markdown',
  templateUrl: './cn-form-markdown.component.html',
  styleUrls: ['./cn-form-markdown.component.css']
})
export class CnFormMarkdownComponent implements OnInit {

  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData = {};
  @Input() public changeConfig;
  @Output() public updateValue = new EventEmitter();
  @Input() public initValue;
  public formGroup: FormGroup;

  public resultData;
  public cascadeValue = {};
  public cascadeSetValue = {};

  public isVisible = false;
  public isConfirmLoading = false;
  public _value = '';
  public _valuetext;
  public permissions = [];
  constructor() { }
  public nzWidth = 1024;

  public m_value = '';

  public isload = true;
  // 模板配置
  @ViewChild('BsnMarkdown') public BsnMarkdown: BsnMarkdownComponent;
  public ngOnInit(): void {
   // console.log('ngOnInit', this.formGroup.value, this.config);
    // this._value = this.formGroup.value[this.config.name];
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
        if (key === "cascadeValue") {
          for (const casekey in this.casadeData["cascadeValue"]) {
            if (
              this.casadeData["cascadeValue"].hasOwnProperty(casekey)
            ) {
              this.cascadeValue[casekey] = this.casadeData["cascadeValue"][casekey];
            }
          }
        } else if (key === "options") {
          // 目前版本，静态数据集 优先级低
          this.config["options"] = this.casadeData["options"];
        } else if (key === "setValue") {
          this.cascadeSetValue["setValue"] = JSON.parse(
            JSON.stringify(this.casadeData["setValue"])
          );
          delete this.casadeData["setValue"];
        }
      }
    }
    // 修改配置列表配置，修改ajax配置，将配置

    if (!this.config.labelName) {
      this.config.labelName = "name";
    }
    if (!this.config.valueName) {
      this.config.valueName = "Id";
    }

    if (this.cascadeSetValue.hasOwnProperty("setValue")) {
      // this.selectedBycascade();
      // 表单的级联赋值在上层，控制方式待定
    } else {
      // this.selectedByLoaded();
    }
    // 未知是否有错误
    // if (!this._value) {
    //   if (this.formGroup.value[this.config.name]) {
    //     this._value = this.formGroup.value[this.config.name];
    //   } else {
    //     if (this.config.hasOwnProperty('defaultValue')) {
    //       this._value = this.config.defaultValue;
    //     }
    //   }
    // }
    // let dataItem;
    // if (this.config.markdownlist) {
    //    dataItem = this.formGroup.value[this.config.markdownlist];
    // }
    // const mvalue = { value: this._value, dataItem: dataItem ? dataItem : null };
    // console.log('富文本编辑器的初始化参数', mvalue);
    // this.valueChange(mvalue);
  }




  public valueChange(name?) {
    // console.log('M-valueChange', name);
    if (name) {
      this.m_value = name.value;
      this._value = name.value;
      const backValue = { name: this.config.name, value: name.value, dataItem: name.dataItem };
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name.value ? name.value : '', dataItem: name.dataItem };
      this.updateValue.emit(backValue);
    }
  }

  /**
   * valueChangeTest
   */
  public valueChangeTest(name) {
    if (name) {
      this._value = name;
      this.m_value = name;
      let dataItem;
      if (this.config.markdownlist) {
        dataItem = this.formGroup.value[this.config.markdownlist];
      }
      const mvalue = { value: this._value, dataItem: dataItem ? dataItem : null };
      // console.log('富文本编辑器的初始化参数', mvalue, this.isload);
      this.BsnMarkdown.value = this._value ? this._value : '';
      if (this.isload) {
        this.isload = false;
        this.BsnMarkdown.myChanges();
        // this.valueChange(mvalue);
      }
    }
  }

}

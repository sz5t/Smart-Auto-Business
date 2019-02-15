import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnChanges, AfterViewInit, AfterContentInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsnTreeTableComponent } from '@shared/business/bsn-tree-table/bsn-tree-table.component';
import { BsnAsyncTreeTableComponent } from '@shared/business/bsn-treeTable/bsn-treeTable.component';

@Component({
  selector: 'cn-form-select-treegrid',
  templateUrl: './cn-form-select-treegrid.component.html',
  styleUrls: ['./cn-form-select-treegrid.component.css']
})
export class CnFormSelectTreegridComponent implements OnInit, OnChanges {
  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  @Input() casadeData = {};
  @Input() changeConfig;
  @Output() updateValue = new EventEmitter();
  formGroup: FormGroup;
  @ViewChild("table") table:BsnAsyncTreeTableComponent ;  //;BsnTreeTableComponent
  resultData;
  cascadeValue = {};
  cascadeSetValue = {};

  isVisible = false;
  isConfirmLoading = false;
  isAfterContentChecked = true;
  _value = null;
  _valuetext;
  permissions = [];
  constructor() { }
  nzWidth = 1024;
  // 模板配置

  ngOnInit() {
    // console.log('config:  ', this.config);
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
              this.casadeData["cascadeValue"].hasOwnProperty(
                casekey
              )
            ) {
              this.cascadeValue[casekey] = this.casadeData[
                "cascadeValue"
              ][casekey];
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

    if (this.config.select) {
      if (!this.config.select.nzWidth) {
        this.config.select.nzWidth = 768;
      }
      if (!this.config.select.title) {
        this.config.select.title = "弹出列表";
      }
    }

    // 修改配置列表配置，修改ajax配置，将配置

    if (!this.config.labelName) {
      this.config.labelName = "name";
    }
    if (!this.config.valueName) {
      this.config.valueName = "Id";
    }
    console.log('labelName valueName 222', this._value);
    //  console.log('ngOnInit this.value:', this.value);
    this.resultData = this.table.dataList;
  }

  ngOnChanges() {

    console.log('ngOnChanges :', this._value);

  }

  // ngAfterContentChecked() {
  //   if (this.isAfterContentChecked) {
  //     if (this._value) {
  //       console.log('ngAfterContentChecked :', this._value);
  //       // this.valueChange(this._value);
  //       this.isAfterContentChecked = false;
  //     }
  //   }
  // }
  ngOnDestory() {
    console.log('ngOnDestory :', this._value);
  }
  showModal(): void {
    this.isVisible = true;
    this.table.value = this._value;
    console.log('showModal _value :', this._value);
  }

  handleOk(): void {
    this.isVisible = false;
    console.log('选中行', this.table.selectedItem);
    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
    if (this.table.selectedItem) {
      this._valuetext = this.table.selectedItem[this.config.labelName];
      this._value = this.table.selectedItem[this.config.valueName];
    } else {
      this._valuetext = null;
      this._value = null;
    }
    console.log('数据labelName valueName ', this.config.labelName, this.config.valueName);
    console.log('数据', this._valuetext, this._value);
  }

  handleCancel(): void {
    // console.log('点击取消');
    this.isVisible = false;
  }

  async valueChange(name?) {

    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config["valueName"] ? this.config["valueName"] : "Id";
    this.resultData = this.table.dataList ? this.table.dataList : [];

    if (name) {
      const backValue = { name: this.config.name, value: name };
      // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
      // console.log('this.resultData:', this.resultData);
      if (this.resultData) {
        // valueName
        const index = this.resultData.findIndex(
          item => item[valueName] === name
        );
        if (this.resultData) {
          if (index >= 0) {
            if (this.resultData[index][labelName]) {
              this._valuetext = this.resultData[index][labelName];
            }
            backValue["dataItem"] = this.resultData[index];
          } else {
            // 取值
            const componentvalue = {};
            componentvalue[valueName] = name;
            if (this.config.ajaxConfig) {
              const backselectdata = await this.table.loadByselect(
                this.config.ajaxConfig,
                componentvalue,
                this.bsnData,
                this.casadeData
              );
              if (backselectdata.hasOwnProperty(labelName)) {
                this._valuetext = backselectdata[labelName];
              } else {
                this._valuetext = this._value;
              }
              backValue["dataItem"] = backselectdata;
            } else {
              this._valuetext = this._value;
            }
            // console.log('_valuetext: ', this._valuetext);
          }
        }

        console.log('iftrue弹出表格返回数据', backValue);
      }
      // this.value['dataText'] = this._valuetext;
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
      console.log('iffalse弹出表格返回数据', backValue);
    }
  }



}

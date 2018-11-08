import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '@core/utility/api-service';

@Component({
  selector: 'cn-form-grid,[cn-form-grid]',
  templateUrl: './cn-form-grid.component.html',
  styleUrls: ['./cn-form-grid.component.css']
})
export class CnFormGridComponent implements OnInit {
  @Input()
  config;
  @Input()
  value;
  @Input()
  bsnData;
  @Input()
  rowData;
  @Input()
  dataSet;
  // formGroup: FormGroup;
  // @Output() updateValue = new EventEmitter();
  @Output()
  updateValue = new EventEmitter();
  _options = [];
  cascadeValue = {};
  resultData;
  _value;
  @ViewChild('ceshi') minimap: ElementRef;
  config1 = {
    viewId: "businesskey_Table",
    component: "bsnTable",
    keyId: "Id",
    pagination: true, // 是否分页
    showTotal: true, // 是否显示总数据量
    pageSize: 5, // 默pageSizeOptions认每页数据条数
    isSelectGrid: true, // 【弹出表格时用】弹出表格值为true
    selectGridValueName: "Id", // 【弹出表格时用】指定绑定的value值
    "": [
      5,
      10,
      20,
      30,
      40,
      50
    ],
    ajaxConfig: {
      url: "common/CfgTable",
      ajaxType: "get",
      params: [
        {
          name: "_sort",
          type: "value",
          valueName: "",
          value: "createDate desc"
        }
      ]
    },
    componentType: {
      parent: false,
      child: true,
      own: true
    },
    relations: [
      {
        relationViewId: "Scan_Code_ROW",
        cascadeMode: "Scan_Code_ROW",
        params: [
          { pid: "ScanCode", cid: "_ScanCode" },
          { pid: "ScanCodeObject", cid: "_ScanCodeObject" }
        ],
        relationReceiveContent: []
      }
    ],
    columns: [
      {
        title: "Id",
        field: "Id",
        width: 80,
        hidden: true,
        editor: {
          type:
            "input",
          field: "Id",
          options: {
            type:
              "input",
            labelSize:
              "6",
            controlSize:
              "18",
            inputType:
              "text"
          }
        }
      },
      {
        title: "名称",
        field: "name",
        width: 80,
        showFilter: false,
        showSort: false,
        editor: {
          type:
            "input",
          field:
            "name",
          options: {
            type:
              "input",
            labelSize:
              "6",
            controlSize:
              "18",
            inputType:
              "text"
          }
        }
      },
      {
        title: "编号",
        field: "code",
        width: 80,
        showFilter: false,
        showSort: false,
        editor: {
          type:
            "input",
          field:
            "code",
          options: {
            type:
              "input",
            labelSize:
              "6",
            controlSize:
              "18",
            inputType:
              "text"
          }
        }
      },
      {
        title: "备注",
        field: "remark",
        width: 80,
        hidden: false,
        editor: {
          type:
            "input",
          field:
            "remark",
          options: {
            type:
              "input",
            labelSize:
              "6",
            controlSize:
              "18",
            inputType:
              "text"
          }
        }
      },
      {
        title:
          "创建时间",
        field:
          "createDate",
        width: 80,
        hidden: false,
        showSort: true,
        editor: {
          type:
            "input",
          field:
            "createDate",
          options: {
            type:
              "input",
            labelSize:
              "6",
            controlSize:
              "18",
            inputType:
              "text"
          }
        }
      }
    ],
    toolbar: [
      {
        group: [
          {
            name:
              "refresh",
            class:
              "editable-add-btn",
            text:
              "刷新",
            cancelPermission: true
          },
          {
            name:
              "addSearchRow",
            class:
              "editable-add-btn",
            text:
              "查询",
            action:
              "SEARCH",
            actionType:
              "addSearchRow",
            actionName:
              "addSearchRow",
            cancelPermission: true
          },
          {
            name:
              "cancelSearchRow",
            class:
              "editable-add-btn",
            text:
              "取消查询",
            action:
              "SEARCH",
            actionType:
              "cancelSearchRow",
            actionName:
              "cancelSearchRow",
            cancelPermission: true
          },
          {
            name:
              "cancelSelectRow",
            class:
              "editable-add-btn",
            text:
              "取消选中",
            action:
              "CANCEL_SELECTED",
            cancelPermission: true
          }
        ]
      }
    ],
    ScanCode: {
      addRow: {
        viewId: '', // 关系id 扩充后可多扫码适配
        columns: [
          { field: "name", type: "tempValue", valueType: "array", arrayName: "_ScanCodeObject", getValueType: "first", valueName: "name", value: "" },
          { field: "code", type: "tempValue", valueType: "value",  valueName: "_ScanCode", value: "" },
          { field: "remark", type: "value", valueType: "value",  value: "remarkzhi" },
          { field: "createDate", type: "tempValue", valueType: "array",  arrayName: "_ScanCodeObject", getValueType: "first",  valueName: "createDate", value: "" }
        ]
      }
    }
  }
  constructor(@Inject(BSN_COMPONENT_MODES)
  private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>,
    private apiService: ApiService) { }

  ngOnInit() {
    // 1.看配置，以及参数的接受
    // 组件值，临时变量，级联值
    this.config = {
      type: "grid",
      selectTreeGrids: 'selectTreeGrid caseName',
      labelSize: "6",
      controlSize: "16",
      inputType: "text",
      name: "caseName",
      label: "名称",
      placeholder: "",
      disabled: false,
      readonly: false,
      size: "default",
      layout: "column",
      span: "24",
      valueName: "Id",
      labelName: "name",
      ajaxConfig: {
        url: "common/CfgTable",
        ajaxType: "get",
        params: [
          {
            name: "Id",
            type: "scanCodeValue",
            valueName: "Id"
          }
        ]
      }
    }
  }

  valueChange(name?) {

    // console.log('valueChange', name);
    // if (name) {
    //     const backValue = { name: this.config.name, value: name };
    //     if (this.resultData) {
    //         const index = this.resultData.data.findIndex(
    //             item => item[this.config["valueName"]] === name
    //         );
    //         this.resultData.data &&
    //             (backValue["dataItem"] = this.resultData.data[index]);
    //     }
    //     this.updateValue.emit(backValue);
    // } else {
    //     const backValue = { name: this.config.name, value: name };
    //     this.updateValue.emit(backValue);
    // }
  }

  isScan = true;
  oldvalue = null;
  async onKeyPress(e) {
    // console.log('onKeyPress', e);
    if (e.code === 'Enter') {
      this.isScan = false;
      this.oldvalue = this._value;
      console.log("huiche", this._value);
      const result = await this.asyncLoad(this.config.ajaxConfig ? this.config.ajaxConfig : null);
      this.cascade.next(
        new BsnComponentMessage(
          BSN_COMPONENT_CASCADE_MODES.Scan_Code_ROW,
          'Scan_Code_ROW',
          {
            data: { ScanCode: this._value, ScanCodeObject: result.data }
          }
        )
      );

    } else {
      if (!this.isScan) {
        const newvalue = this._value;
        this._value = newvalue.substring(this.oldvalue.length ? this.oldvalue.length : 0)
        this.isScan = true;
      }
    }

  }


  async asyncLoad(p?, componentValue?, type?) {
    if (!p) {
      return [];
    }
    // console.log('select load 异步加载', componentValue); // liu
    const params = {};
    let tag = true;
    let url;
    if (p) {
      p.params.forEach(param => {
        if (param.type === "tempValue") {
          if (type) {
            if (type === "load") {
              if (this.bsnData[param.valueName]) {
                params[param.name] = this.bsnData[
                  param.valueName
                ];
              } else {
                // console.log('参数不全不能加载');
                tag = false;
                return;
              }
            } else {
              params[param.name] = this.bsnData[param.valueName];
            }
          } else {
            if (this.bsnData && this.bsnData[param.valueName]) {
              // liu 参数非空判断
              params[param.name] = this.bsnData[param.valueName];
            }
          }
        } else if (param.type === "value") {
          params[param.name] = param.value;
        } else if (param.type === "componentValue") {
          params[param.name] = componentValue[param.valueName];
        } else if (param.type === "scanCodeValue") {
          params[param.name] = this._value;
        } else if (param.type === "cascadeValue") {
          params[param.name] = this.cascadeValue[param.valueName];
        }
      });
      if (this.isString(p.url)) {
        url = p.url;
      } else {
        let pc = "null";
        p.url.params.forEach(param => {
          if (param["type"] === "value") {
            pc = param.value;
          } else if (param.type === "componentValue") {
            pc = componentValue[param.valueName];
          } else if (param.type === "tempValue") {
            pc = this.bsnData[param.valueName];
          } else if (param.type === "scanCodeValue") {
            pc = this._value;
          }
        });

        url = p.url["parent"] + "/" + pc + "/" + p.url["child"];
      }
    }
    if (p.ajaxType === "get" && tag) {

      return this.apiService.getProj(url, params).toPromise();
    }

  }

  isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === "[object String]";
  }

}

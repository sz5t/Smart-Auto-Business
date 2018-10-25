import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsnTreeTableComponent } from '@shared/business/bsn-tree-table/bsn-tree-table.component';

@Component({
  selector: 'cn-grid-select-treegrid,[cn-grid-select-treegrid]',
  templateUrl: './cn-grid-select-treegrid.component.html',
  styleUrls: ['./cn-grid-select-treegrid.component.css']
})
export class CnGridSelectTreegridComponent implements OnInit {
  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  @Input() casadeData;
  @Output() updateValue = new EventEmitter();

  @ViewChild('table') table: BsnTreeTableComponent;

  resultData;
  cascadeValue = {};
  cascadeSetValue = {};

  isVisible = false;
  isConfirmLoading = false;
  _value = '4185d8182048482980cbcc10a19f6b55';
  _valuetext = '资源保养明细记录';
  constructor() { }
  value1 = {};

 // 弹出树的配置模板
 config1 = {
  'type': 'selectTreeGrid',
  'inputType': 'text',
  'width': '90px',
  'name': 'businesskey',
  'labelName': 'caseName',
  'valueName': 'Id',
  select: {
    nzWidth: 768,
    title: '弹出树',
    selectTreeGrid: {
        is_SelectGrid: true,
        'selectGridValueName': 'Id',  // 【弹出表格时用】指定绑定的value值
        // 'title': '树表网格',
        'viewId': 'bsnTreeTable',
        'component': 'bsnTreeTable',
        'info': true,
        'keyId': 'Id',
        'pagination': true,
        'showTotal': true,
        'pageSize': 5,
        'pageSizeOptions': [
          5,
          18,
          20,
          30,
          40,
          50
        ],
        'ajaxConfig': {
          'url': 'common/GetCase/null/GetCase',
          'ajaxType': 'get',
          'params': [],
          'filter': []
        },
        'columns': [
          {
            'title': 'Id',
            'field': 'Id',
            'width': 80,
            'hidden': true,
            'editor': {
              'type': 'input',
              'field': 'Id',
              'options': {
                'type': 'input',
                'inputType': 'text'
              }
            }
          },
          {
            'title': '名称',
            'field': 'caseName',
            'width': '90px',
            'expand': true,
            'showFilter': false,
            'showSort': false,
            'editor': {
              'type': 'input',
              'field': 'caseName',
              'options': {
                'type': 'input',
                'inputType': 'text',
                'width': '100px'
              }
            }
          },
          {
            'title': '类别',
            'field': 'caseTypeText',
            'width': '100px',
            'hidden': false,
            'showFilter': true,
            'showSort': true,
            'editor': {
              'type': 'select',
              'field': 'caseType',
              'options': {
                'type': 'select',
                'name': 'caseType',
                'label': 'Type',
                'notFoundContent': '',
                'selectModel': false,
                'showSearch': true,
                'placeholder': '-请选择数据-',
                'disabled': false,
                'size': 'default',
                'clear': true,
                'width': '150px',
                'options': [
                  {
                    'label': '表格',
                    'value': '1',
                    'disabled': false
                  },
                  {
                    'label': '树组件',
                    'value': '2',
                    'disabled': false
                  },
                  {
                    'label': '树表',
                    'value': '3',
                    'disabled': false
                  },
                  {
                    'label': '表单',
                    'value': '4',
                    'disabled': false
                  },
                  {
                    'label': '标签页',
                    'value': '5',
                    'disabled': false
                  }
                ]
              }
            }
          },
          {
            'title': '数量',
            'field': 'caseCount',
            'width': 80,
            'hidden': false,
            'editor': {
              'type': 'input',
              'field': 'caseCount',
              'options': {
                'type': 'input',
                'inputType': 'text'
              }
            }
          },
          {
            'title': '级别',
            'field': 'caseLevel',
            'width': 80,
            'hidden': false,
            'showFilter': false,
            'showSort': false,
            'editor': {
              'type': 'input',
              'field': 'caseLevel',
              'options': {
                'type': 'input',
                'inputType': 'text'
              }
            }
          },
          {
            'title': '父类别',
            'field': 'parentName',
            'width': 80,
            'hidden': false,
            'showFilter': false,
            'showSort': false,
            'editor': {
              'type': 'input',
              'field': 'parentId',
              'options': {
                'type': 'selectTree',
                'name': 'parentId',
                'label': '父类别',
                'notFoundContent': '',
                'selectModel': false,
                'showSearch': true,
                'placeholder': '--请选择--',
                'disabled': false,
                'size': 'default',
                'columns': [
                  {
                    'title': '主键',
                    'field': 'key',
                    'valueName': 'Id'
                  },
                  {
                    'title': '父节点',
                    'field': 'parentId',
                    'valueName': 'parentId'
                  },
                  {
                    'title': '标题',
                    'field': 'title',
                    'valueName': 'caseName'
                  }
                ],
                'ajaxConfig': {
                  'url': 'common/ShowCase',
                  'ajaxType': 'get',
                  'params': []
                },
                'layout': 'column',
                'span': '24'
              }
            }
          },
          {
            'title': '创建时间',
            'field': 'createDate',
            'width': 80,
            'hidden': false,
            'dataType': 'date',
            'editor': {
              'type': 'input',
              'pipe': 'datetime',
              'field': 'createDate',
              'options': {
                'type': 'input',
                'inputType': 'datetime'
              }
            }
          },
          {
            'title': '备注',
            'field': 'remark',
            'width': 80,
            'hidden': false,
            'editor': {
              'type': 'input',
              'field': 'remark',
              'options': {
                'type': 'input',
                'inputType': 'text'
              }
            }
          },
          {
            'title': '状态',
            'field': 'enabledText',
            'width': 80,
            'hidden': false,
            'formatter': [
              {
                'value': '启用',
                'bgcolor': '',
                'fontcolor': 'text-blue',
                'valueas': '启用'
              },
              {
                'value': '禁用',
                'bgcolor': '',
                'fontcolor': 'text-red',
                'valueas': '禁用'
              }
            ],
            'editor': {
              'type': 'select',
              'field': 'enabled',
              'options': {
                'type': 'select',
                'inputType': 'submit',
                'name': 'enabled',
                'notFoundContent': '',
                'selectModel': false,
                'showSearch': true,
                'placeholder': '-请选择-',
                'disabled': false,
                'size': 'default',
                'clear': true,
                'width': '80px',
                'options': [
                  {
                    'label': '启用',
                    'value': true,
                    'disabled': false
                  },
                  {
                    'label': '禁用',
                    'value': false,
                    'disabled': false
                  }
                ]
              }
            }
          }
        ],
        'componentType': {
          'parent': true,
          'child': false,
          'own': true
        },
        'toolbar': [
          {
            'group': [
              {
                'name': 'refresh',
                'action': 'REFRESH',
                'text': '刷新',
                'color': 'text-primary',
                'enablePermission': true
              }
            ]
          }
        ]

      }
  }

 };

  ngOnInit() {
    console.log('treegrid', this.config);
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
    if (this.cascadeSetValue.hasOwnProperty('setValue')) {
      this.selectedBycascade();
    } else {

      this.selectedByLoaded();
    }
  }

  showModal(): void {
    console.log('showModal', this._value);
    this.table.value = this._value ;
    this.isVisible = true;
  }

  handleOk(): void {
  
    this.isVisible = false;

    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
    // console.log('选中行', this.table.dataList);
 
     console.log('选中行', this.table.selectedItem);
    if (this.table.selectedItem) {
      this._valuetext = this.table.selectedItem[this.config.labelName];
      this._value = this.table.selectedItem[this.config.valueName];
    } else {
      this._valuetext = null;
      this._value = null;
    }

    console.log('最新选中值：', this._value);
 
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

     console.log('值变化', name);
    this.resultData = this.table.dataList;
   
    if (name) {
      this.value['data'] = name;
      // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
      if (this.resultData) { // valueName
        const index = this.resultData.findIndex(item => item[this.config['valueName']] === name);
        this.resultData && (this.value['dataItem'] = this.resultData[index]);

      }
      this.value['dataText'] = this._valuetext;
     // this.updateValue.emit(this.value);
    } else {
      this.value['data'] = null;
      this.value['dataText'] = null;
     // this.updateValue.emit(this.value);
    }
   console.log('弹出表格返回数据', this.value);
  }


}

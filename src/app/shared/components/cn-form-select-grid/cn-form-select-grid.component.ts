import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';

@Component({
  selector: 'cn-form-select-grid',
  templateUrl: './cn-form-select-grid.component.html',
  styleUrls: ['./cn-form-select-grid.component.css']
})
export class CnFormSelectGridComponent implements OnInit {

  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  @Input() casadeData;
  @Output() updateValue = new EventEmitter();

  @ViewChild('table') table: BsnTableComponent;
  isVisible = false;
  isConfirmLoading = false;
  _value;
  constructor() { }
  configtanchu = {
    'viewId': 'parentTable',
    'component': 'bsnTable',
    'keyId': 'Id',
    'pagination': true, // 是否分页
    'showTotal': true, // 是否显示总数据量
    'pageSize': 5, // 默pageSizeOptions认每页数据条数
    '': [5, 10, 20, 30, 40, 50],
    'ajaxConfig': {
      'url': 'common/CfgTable',
      'ajaxType': 'get',
      'params': [
        {
          name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
        }
      ]
    },
    'componentType': {
      'parent': false,
      'child': false,
      'own': true
    },
    'relations': [{
      'relationViewId': 'parentTable',
      'relationSendContent': [
      ],
      'relationReceiveContent': []
    }],
    'columns': [
      {
        title: 'Id', field: 'Id', width: 80, hidden: true,
        editor: {
          type: 'input',
          field: 'Id',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '18',
            'inputType': 'text',
          }
        }
      },
      {
        title: '名称', field: 'name', width: 80,
        showFilter: false, showSort: false,
        editor: {
          type: 'input',
          field: 'name',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '18',
            'inputType': 'text',
          }
        }
      },
      {
        title: '编号', field: 'code', width: 80,
        showFilter: false, showSort: false,
        editor: {
          type: 'input',
          field: 'code',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '18',
            'inputType': 'text',
          }
        }
      },
      {
        title: '备注', field: 'remark', width: 80, hidden: false,
        editor: {
          type: 'input',
          field: 'remark',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '18',
            'inputType': 'text',
          }
        }
      },
      {
        title: '创建时间', field: 'createDate', width: 80, hidden: false, showSort: true,
        editor: {
          type: 'input',
          field: 'createDate',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '18',
            'inputType': 'text',
          }
        }
      }


    ],
    'toolbar': [
      {
        group: [
          {
            'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
          },
          {
            'name': 'addSearchRow', 'class': 'editable-add-btn', 'text': '查询', 'action': 'SEARCH',
            'actionType': 'addSearchRow', 'actionName': 'addSearchRow',
          },
          {
            'name': 'cancelSearchRow', 'class': 'editable-add-btn', 'text': '取消查询', 'action': 'SEARCH',
            'actionType': 'cancelSearchRow', 'actionName': 'cancelSearchRow',
          },
        ]
      }
    ],     
    'dataSet': [

    ]
  };
  nzWidth = 1024;
  configtanchuInput = {

      'type': 'input',
      'labelSize': '6',
      'controlSize': '18',
      'inputType': 'text',
      'width': '160px',
      'label': '父类别',
      'labelName': 'caseName',
      'valueName': 'Id',
    
  };

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

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('确认');
    this.isVisible = false;
    
    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
    console.log('选中行', this.table.dataList);
    console.log('选中行', this.table._selectRow);
    this._value = this.table._selectRow['name'];
  }

  handleCancel(): void {
    console.log('点击取消');
    this.isVisible = false;
  }

}

import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { Form, FormGroup } from '@angular/forms';
@Component({
  selector: 'cn-table-chart',
  templateUrl: './table-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./table-chart.css']
})
export class TableChartComponent implements OnInit, AfterViewInit {
  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              // title: '数据网格',
              span: 24,
              icon: 'icon-list',
              size: {
                nzXs: 24,
                nzSm: 24,
                nzMd: 24,
                nzLg: 24,
                ngXl: 24
              },
              viewCfg: [
                {
                  config: {
                    'title': '数据网格',
                    'viewId': 'chartTable',
                    'component': 'bsnTable',
                    'info': true,
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 18, 20, 30, 40, 50],
                    'ajaxConfig': {
                      // 'url': 'SinoForce.AppData.ShowCase',
                      'url': 'GetCase2',
                      'ajaxType': 'get',
                      'params': [
                        {
                          name: 'ParentId', type: 'value', valueName: '', 'value': 'null'
                        }
                      ]
                    },
                    'columns': [
                      {
                        title: '序号', field: '_serilize', width: '50px', hidden: false,
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
                        title: '名称', field: 'CaseName', width: '90px',
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'CaseName',
                          options: {
                            'type': 'input',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '类别', field: 'TypeName', width: '100px', hidden: false,
                        showFilter: true, showSort: true,
                        editor: {
                          type: 'select',
                          field: 'Type',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'Type',
                            'label': 'Type',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '-请选择数据-',
                            'disabled': false,
                            'size': 'default',
                            'clear': true,
                            'width': '200px',
                            'dataSet': 'TypeName',
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
                        title: '数量', field: 'CaseCount', width: 80, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'CaseCount',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '级别', field: 'Level', width: 80, hidden: false,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'Level',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '创建时间', field: 'CreateTime', width: 80, hidden: false, dataType: 'date',
                        editor: {
                          type: 'input',
                          pipe: 'datetime',
                          field: 'CreateTime',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'datetime',
                          }
                        }
                      },
                      {
                        title: '备注', field: 'Remark', width: 80, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'Remark',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '状态', field: 'EnableText', width: 80, hidden: false,
                        formatter: [
                          { 'value': '启用', 'bgcolor': '', 'fontcolor': 'text-blue', 'valueas': '启用' },
                          { 'value': '禁用', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '禁用' }
                        ],
                        editor: {
                          type: 'select',
                          field: 'Enable',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'Enable',
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
                    // 'relations': [{
                    //   'relationViewId': 'singleTable',
                    //   'relationSendContent': [],
                    //   'relationReceiveContent': []
                    // }],
                    'toolbar': [
                      {
                        'name': 'cus', 'text': '自定义事件', 'type': 'injectFunction',
                        'context': {
                          'name': 'text1',
                          'arguments': [],
                          'content': 'alert(this)'
                        }

                      },
                      {
                        'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                      },
                      {
                        'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增', 'action': 'CREATE'
                      },
                      {
                        'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'action': 'EDIT'
                      },
                      {
                        'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'action': 'DELETE',
                        'ajaxConfig': {
                          delete: [{
                            'actionName': 'delete',
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'delete'
                          }]
                        }
                      },
                      {
                        'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存', 'action': 'SAVE',
                        'type': 'method/action',
                        'ajaxConfig': {
                          post: [{
                            'actionName': 'add',
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'post',
                            'params': [
                              { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                              { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                              // { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                              { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                              { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                              { name: 'ParentId', type: 'componentValue', valueName: 'ParentId', value: '' },
                              { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                              { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                            ],
                            'output': [
                              {
                                name: '_id',
                                type: '',
                                dataName: 'Id'
                              }
                            ]
                          }],
                          put: [{
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'put',
                            'params': [
                              { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                              { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                              { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                              // { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                              { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                              { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                              { name: 'ParentId', type: 'componentValue', valueName: 'ParentId', value: '' },
                              { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                              { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                            ]
                          }]
                        }
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                      },
                      {
                        'name': 'addForm', 'class': 'editable-add-btn', 'text': '弹出新增表单',
                        'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'addShowCase',
                        'type': 'showForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'layout': 'horizontal',
                          'title': '新增数据',
                          'width': '800',
                          'isCard': true,
                          'componentType': {
                            'parent': false,
                            'child': false,
                            'own': true
                          },
                          'forms':
                            [
                              {
                                controls: [
                                  {
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Enable',
                                    'label': '状态',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
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
                                    ],
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Type',
                                    'label': '类别',
                                    'labelName': 'Name',
                                    'valueName': 'Id',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
                                    'ajaxConfig': {
                                      'url': 'SinoForce.User.AppUser',
                                      'ajaxType': 'get',
                                      'params': []
                                    },
                                    'cascader': [
                                      {
                                        'name': 'appUser',
                                        'type': 'sender',
                                        'cascaderData': {
                                          'params': [
                                            {
                                              'pid': 'Id', 'cid': '_typeId'
                                            }
                                          ]
                                        }
                                      }
                                    ],
                                    'layout': 'column',
                                    'span': '24'
                                  }
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CaseName',
                                    'label': '名称',
                                    'isRequired': true,
                                    'placeholder': '请输入Case名称',
                                    'perfix': 'anticon anticon-edit',
                                    'suffix': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24',
                                    'validations': [
                                      {
                                        'validator': 'required',
                                        'errorMessage': '请输入Case名称!!!!'
                                      },
                                      {
                                        'validator': 'minLength',
                                        'length': '3',
                                        'errorMessage': '请输入最少三个字符'
                                      },
                                      {
                                        'validator': 'maxLength',
                                        'length': '5',
                                        'errorMessage': '请输入最5个字符'
                                      }
                                    ]
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'Level',
                                    'label': '级别',
                                    'isRequired': true,
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24',
                                    'validations': [
                                      {
                                        'validator': 'required',
                                        'errorMessage': '请输入级别'
                                      }
                                    ]
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CaseCount',
                                    'label': '数量',
                                    'isRequired': true,
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24',
                                    'validations': [
                                      {
                                        'validator': 'required',
                                        'errorMessage': '请输入数量'
                                      },
                                      {
                                        'validator': 'pattern',
                                        'pattern': /^\d+$/,
                                        'errorMessage': '请填写数字'
                                      }
                                    ]
                                  },

                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'datePicker',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CreateTime',
                                    'label': '创建时间',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'showTime': true,
                                    'format': 'yyyy-MM-dd',
                                    'showToday': true,
                                    'span': '24'
                                  }
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'rangePicker',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CreateTime',
                                    'label': '时间范围',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'showTime': true,
                                    'format': 'yyyy-MM-dd',
                                    'showToday': true,
                                    'span': '24'
                                  }
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'time',
                                    'name': 'Remark',
                                    'label': '备注',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  }
                                ]
                              }
                            ],
                          'buttons':
                            [
                              {
                                'name': 'save', 'text': '保存', 'type': 'primary',
                                'ajaxConfig': {
                                  post: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'params': [
                                      { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                      { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                      { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                      { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                      { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                      { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                      { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                      { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                    ]
                                  }]
                                }
                              },
                              {
                                'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                                'ajaxConfig': {
                                  post: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'params': [
                                      { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                      { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                      { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                      { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                      { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                      { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                      { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                      { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                    ]
                                  }]
                                }
                              },
                              { 'name': 'reset', 'text': '重置' },
                              { 'name': 'close', 'text': '关闭' }
                            ],

                        }
                      },
                      {
                        'name': 'editForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                        'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'updateShowCase',
                        'type': 'showForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'title': '编辑',
                          'width': '600',
                          'ajaxConfig': {
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'get',
                            'params': [
                              {
                                name: 'Id', type: 'tempValue', valueName: '_id', value: ''
                              }
                            ]
                          },
                          'componentType': {
                            'parent': false,
                            'child': false,
                            'own': true
                          },
                          'forms':
                            [
                              {
                                controls: [
                                  {
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Enable',
                                    'label': '状态',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
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
                                    ],
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Type',
                                    'label': '类别Id',
                                    'labelName': 'Name',
                                    'valueName': 'Id',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
                                    'ajaxConfig': {
                                      'url': 'SinoForce.User.AppUser',
                                      'ajaxType': 'get',
                                      'params': []
                                    },
                                    'options': [
                                      {
                                        'label': '表',
                                        'value': '1',
                                        'disabled': false
                                      },
                                      {
                                        'label': '树',
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
                                    ],
                                    'layout': 'column',
                                    'span': '24'
                                  }
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CaseName',
                                    'label': '名称',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'Level',
                                    'label': '级别',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CaseCount',
                                    'label': '数量',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  },

                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'Remark',
                                    'label': '备注',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  }
                                ]
                              }
                            ],
                          'buttons':
                            [
                              {
                                'name': 'save', 'text': '保存',
                                'type': 'primary',
                                'ajaxConfig': {
                                  put: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'params': [
                                      { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                      { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                      { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                      { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                      { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                      { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                      { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                      { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                    ]
                                  }]
                                }
                              },
                              { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                              { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                            ],
                          'dataList': [],
                        }
                      },
                      {
                        'name': 'batchEditForm', 'class': 'editable-add-btn', 'text': '弹出批量处理表单',
                        'type': 'showBatchForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'title': '批量处理',
                          'width': '600',
                          'componentType': {
                            'parent': false,
                            'child': false,
                            'own': true
                          },
                          'forms':
                            [
                              {
                                controls: [
                                  {
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Enable',
                                    'label': '状态',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
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
                                    ],
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'input',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'text',
                                    'name': 'CaseName',
                                    'label': '名称',
                                    'placeholder': '',
                                    'disabled': false,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24'
                                  },
                                ]
                              },
                            ],
                          'buttons':
                            [
                              {
                                'name': 'save', 'text': '保存',
                                'type': 'primary',
                                'ajaxConfig': {
                                  put: [{
                                    'url': 'SinoForce.AppData.ShowCase',
                                    'batch': true,
                                    'params': [
                                      { name: 'Id', type: 'checkedItem', valueName: 'Id', value: '' },
                                      { name: 'CaseName', type: 'checkedItem', valueName: 'CaseName', value: '' },
                                      { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    ]
                                  }]
                                }
                              },
                              { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                              { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                            ],
                          'dataList': [],
                        }
                      },
                      {
                        'name': 'showDialogPage', 'class': 'editable-add-btn', 'text': '弹出页面',
                        'action': 'WINDOW', 'actionType': 'windowDialog', 'actionName': 'showCaseWindow',
                        'type': 'showLayout', 'dialogConfig': {
                          'title': '',
                          'layoutName': 'singleTable',
                          'width': 800,
                          'buttons': [
                            { 'name': 'ok1', 'text': '确定', 'class': 'editable-add-btn', 'type': 'primary' },
                            { 'name': 'close', 'text': '关闭' }
                          ]
                        }
                      },
                      {
                        'name': 'btnGroup', 'text': ' 分组操作', 'type': 'group', 'icon': 'icon-plus',
                        'group': [
                          {
                            'name': 'refresh', 'class': 'editable-add-btn', 'text': ' 刷新', 'icon': 'icon-list'
                          },
                          {
                            'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增'
                          },
                          {
                            'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改'
                          }
                        ]
                      }
                    ],
                    'dataSet': [
                      {
                        'name': 'TypeName',
                        'ajaxConfig': {
                          'url': 'SinoForce.User.AppUser',
                          'ajaxType': 'get',
                          'params': []
                        },
                        'params': [],
                        'fields': [
                          {
                            'label': 'ID',
                            'field': 'Id',
                            'name': 'value'
                          },
                          {
                            'label': '',
                            'field': 'Name',
                            'name': 'label'
                          },
                          {
                            'label': '',
                            'field': 'Name',
                            'name': 'text'
                          }
                        ]
                      }
                    ],
                    'formDialog': [
                      {
                        'keyId': 'Id',
                        'name': 'addShowCase',
                        'layout': 'horizontal',
                        'title': '新增数据',
                        'width': '800',
                        'isCard': true,
                        'componentType': {
                          'parent': false,
                          'child': false,
                          'own': true
                        },
                        'forms':
                          [
                            {
                              controls: [
                                {
                                  'type': 'select',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'submit',
                                  'name': 'Enable',
                                  'label': '状态',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
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
                                  ],
                                  'layout': 'column',
                                  'span': '24'
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'select',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'submit',
                                  'name': 'Type',
                                  'label': '类别',
                                  'labelName': 'Name',
                                  'valueName': 'Id',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'ajaxConfig': {
                                    'url': 'SinoForce.User.AppUser',
                                    'ajaxType': 'get',
                                    'params': []
                                  },
                                  'cascader': [
                                    {
                                      'name': 'appUser',
                                      'type': 'sender',
                                      'cascaderData': {
                                        'params': [
                                          {
                                            'pid': 'Id', 'cid': '_typeId'
                                          }
                                        ]
                                      }
                                    }
                                  ],
                                  'layout': 'column',
                                  'span': '24'
                                }
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CaseName',
                                  'label': '名称',
                                  'isRequired': true,
                                  'placeholder': '请输入Case名称',
                                  'perfix': 'anticon anticon-edit',
                                  'suffix': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入Case名称!!!!'
                                    },
                                    {
                                      'validator': 'minLength',
                                      'length': '3',
                                      'errorMessage': '请输入最少三个字符'
                                    },
                                    {
                                      'validator': 'maxLength',
                                      'length': '5',
                                      'errorMessage': '请输入最5个字符'
                                    }
                                  ]
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'Level',
                                  'label': '级别',
                                  'isRequired': true,
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入级别'
                                    }
                                  ]
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CaseCount',
                                  'label': '数量',
                                  'isRequired': true,
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入数量'
                                    },
                                    {
                                      'validator': 'pattern',
                                      'pattern': /^\d+$/,
                                      'errorMessage': '请填写数字'
                                    }
                                  ]
                                },

                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'datePicker',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CreateTime',
                                  'label': '创建时间',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'showTime': true,
                                  'format': 'yyyy-MM-dd',
                                  'showToday': true,
                                  'span': '24'
                                }
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'rangePicker',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CreateTime',
                                  'label': '时间范围',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'showTime': true,
                                  'format': 'yyyy-MM-dd',
                                  'showToday': true,
                                  'span': '24'
                                }
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'time',
                                  'name': 'Remark',
                                  'label': '备注',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24'
                                }
                              ]
                            }
                          ],
                        'buttons':
                          [
                            {
                              'name': 'save', 'text': '保存', 'type': 'primary',
                              'ajaxConfig': {
                                post: [{
                                  'url': 'SinoForce.AppData.ShowCase',
                                  'params': [
                                    { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                    { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                    { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                    { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                    { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                    { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                    { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                  ]
                                }]
                              }
                            },
                            {
                              'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                              'ajaxConfig': {
                                post: [{
                                  'url': 'SinoForce.AppData.ShowCase',
                                  'params': [
                                    { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                    { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                    { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                    { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                    { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                    { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                    { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                  ]
                                }]
                              }
                            },
                            { 'name': 'reset', 'text': '重置' },
                            { 'name': 'close', 'text': '关闭' }
                          ],

                      },
                      {
                        'keyId': 'Id',
                        'name': 'updateShowCase',
                        'title': '编辑',
                        'width': '600',
                        'ajaxConfig': {
                          'url': 'SinoForce.AppData.ShowCase',
                          'ajaxType': 'get',
                          'params': [
                            {
                              name: 'Id', type: 'tempValue', valueName: '_id', value: ''
                            }
                          ]
                        },
                        'componentType': {
                          'parent': false,
                          'child': false,
                          'own': true
                        },
                        'forms':
                          [
                            {
                              controls: [
                                {
                                  'type': 'select',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'submit',
                                  'name': 'Enable',
                                  'label': '状态',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
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
                                  ],
                                  'layout': 'column',
                                  'span': '24'
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'select',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'submit',
                                  'name': 'Type',
                                  'label': '类别Id',
                                  'labelName': 'Name',
                                  'valueName': 'Id',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'ajaxConfig': {
                                    'url': 'SinoForce.User.AppUser',
                                    'ajaxType': 'get',
                                    'params': []
                                  },
                                  'options': [
                                    {
                                      'label': '表',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '树',
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
                                  ],
                                  'layout': 'column',
                                  'span': '24'
                                }
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CaseName',
                                  'label': '名称',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24'
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'Level',
                                  'label': '级别',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24'
                                },
                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'CaseCount',
                                  'label': '数量',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24'
                                },

                              ]
                            },
                            {
                              controls: [
                                {
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'Remark',
                                  'label': '备注',
                                  'placeholder': '',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24'
                                }
                              ]
                            }
                          ],
                        'buttons':
                          [
                            {
                              'name': 'save', 'text': '保存',
                              'type': 'primary',
                              'ajaxConfig': {
                                put: [{
                                  'url': 'SinoForce.AppData.ShowCase',
                                  'params': [
                                    { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                    { name: 'CaseName', type: 'componentValue', valueName: 'CaseName', value: '' },
                                    { name: 'CaseCount', type: 'componentValue', valueName: 'CaseCount', value: '' },
                                    { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                    { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    { name: 'Level', type: 'componentValue', valueName: 'Level', value: '' },
                                    { name: 'Remark', type: 'componentValue', valueName: 'Remark', value: '' },
                                    { name: 'Type', type: 'componentValue', valueName: 'Type', value: '' }
                                  ]
                                }]
                              }
                            },
                            { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                            { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                          ],
                        'dataList': [],
                      }
                    ],
                    'windowDialog': [
                      {
                        'title': '',
                        'name': 'showCaseWindow',
                        'layoutName': 'singleTable',
                        'width': 800,
                        'buttons': [
                          { 'name': 'ok1', 'text': '确定', 'class': 'editable-add-btn', 'type': 'primary' },
                          { 'name': 'close', 'text': '关闭' }
                        ]
                      }
                    ]
                  },
                  permissions: {
                    'viewId': 'chartTable',
                    'columns': [
                      {
                        'field': '_serilize',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'Id',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'CaseName',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'TypeName',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'Level',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'CreateTime',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'Remark',
                        'hidden': false,
                        'editable': false
                      },
                      {
                        'field': 'EnableText',
                        'hidden': false,
                        'editable': false
                      }
                    ],
                    'toolbar': [],
                    'formDialog': [],
                    'windowDialog': []
                  },
                  dataList: []
                }
              ]
            }
          ]
        }
      },
      {
        row: {
          cols: [
            {
              id: 'area2',
              span: 12,
              icon: 'icon-list',
              size: {
                nzXs: 12,
                nzSm: 12,
                nzMd: 12,
                nzLg: 12,
                ngXl: 12
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'chart1',
                    'component': 'lineChart',
                    'keyId': 'Id',
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'ParentId', type: 'tempValue', valueName: '_parentId'}
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'chartTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
                      ],
                      'relationReceiveContent': []
                    }],
                    title: '降雨量统计',
                    height: '400',
                    width: '500',
                    forceFit: true,
                    key: 'Remark',
                    value: 'CaseCount',
                    dataKey: 'CaseName',
                    scale: [
                      {
                        dataKey: 'CaseName',
                        min: 0
                      },
                      {
                        dataKey: 'CaseCount',
                        min: 0,
                        max: 1
                      }
                    ],
                    // data: [
                    //   { name: 'm1', month: '一月', tem: 7.0, city: '东京' },
                    //   { name: 'm11', month: '一月', tem: 3.9, city: '伦敦' },
                    //   { name: 'm111', month: '一月', tem: 20, city: '西安' },
                    //   { name: 'm2', month: '二月', tem: 9.5, city: '东京' },
                    //   { name: 'm22', month: '二月', tem: 5.7, city: '伦敦' },
                    //   { name: 'm3', month: '三月', tem: 15, city: '东京' },
                    //   { name: 'm33', month: '三月', tem: 8.8, city: '伦敦' }
                    //   // {name: 'm3',  month: '三月', Tokyo: 14.5, London: 8.5, city: '东京' },
                    //   // {name: 'm4',  month: '四月', Tokyo: 18.4, London: 30.9 , city: '东京'},
                    //   // {name: 'm5',  month: '五月', Tokyo: 21.5, London: 15.2 , city: '东京'},
                    //   // {name: 'm6',  month: '六月', Tokyo: 25.2, London: 17.0, city: '东京' },
                    //   // {name: 'm7',  month: '七月', Tokyo: 26.5, London: 16.6 , city: '东京'},
                    //   // {name: 'm8',  month: '八月', Tokyo: 23.3, London: 14.2 , city: '东京'},
                    //   // {name: 'm9',  month: '九月', Tokyo: 6.9, London: 4.2 , city: '东京'},
                    //   // {name: 'm10',  month: '十月', Tokyo: 18.3, London: 10.3, city: '东京' },
                    //   // {name: 'm11',  month: '十一月', Tokyo: 13.9, London: 6.6 , city: '东京'},
                    //   // {name: 'm12',  month: '十二月', Tokyo: 9.6, London: 4.8 , city: '东京'}
                    // ],
                    sharp: 'circle',
                    fields: ['CaseCount', 'CaseName', 'Remark'],
                    style: {
                      stroke: '#f1f233',
                      lineWidth: 1
                    },
                    size: '5'
                  }
                }
              ]
            },
            {
              id: 'area3',
              span: 12,
              icon: 'icon-list',
              size: {
                nzXs: 12,
                nzSm: 12,
                nzMd: 12,
                nzLg: 12,
                ngXl: 12
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'chart2',
                    'component': 'lineChart',
                    'keyId': 'Id',
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'ParentId', type: 'tempValue', valueName: '_parentId'},
                        { name: '_order', type: 'value', value: 'CaseName asc'}
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'chartTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
                      ],
                      'relationReceiveContent': []
                    }],
                    title: '降雨量统计',
                    height: '400',
                    width: '500',
                    forceFit: true,
                    key: 'Type',
                    value: 'CaseCount',
                    dataKey: 'CaseName',
                    scale: [
                      {
                        dataKey: 'CaseValue',
                        min: 0,
                        max: 1
                      },
                      {
                        dataKey: 'CaseName',
                        min: 0
                      }
                    ],
                    // data: [
                    //   { name: 'm1', month: '一月', tem: 7.0, city: '东京' },
                    //   { name: 'm11', month: '一月', tem: 3.9, city: '伦敦' },
                      
                    //   { name: 'm2', month: '二月', tem: 9.5, city: '东京' },
                    //   { name: 'm22', month: '二月', tem: 5.7, city: '伦敦' },
                    //   { name: 'm333', month: '二月', tem: 20, city: '西安' },
                    //   { name: 'm3', month: '三月', tem: 15, city: '东京' },
                    //   { name: 'm33', month: '三月', tem: 8.8, city: '伦敦' },
                    //   { name: 'm333', month: '三月', tem: 28, city: '西安' },
                    //   { name: 'm111', month: '一月', tem: 10, city: '西安' },
                    // ],
                    sharp: 'circle',
                    fields: ['CaseCount', 'CaseName', 'Type'],
                    style: {
                      stroke: '#f1f233',
                      lineWidth: 1
                    },
                    size: '5',
                    adjust: [{
                      type: 'stack', // stack
                      marginRatio: 1 / 32,
                    }]
                  },
                  dataList: [],
                  permissions: []
                }
              ]
            }
          ]
        }
      },
      {
        row: {
          cols: [
            {
              id: 'area2',
              span: 12,
              icon: 'icon-list',
              size: {
                nzXs: 12,
                nzSm: 12,
                nzMd: 12,
                nzLg: 12,
                ngXl: 12
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'chart3',
                    'component': 'barChart',
                    'keyId': 'Id',
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'ParentId', type: 'tempValue', valueName: '_parentId'}
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'chartTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
                      ],
                      'relationReceiveContent': []
                    }],
                    title: '降雨量统计',
                    height: '400',
                    width: '500',
                    forceFit: true,
                    key: 'Type',
                    value: 'CaseCount',
                    dataKey: 'CaseName',
                    scale: [
                      {
                        dataKey: 'CaseName',
                        min: 0
                      }
                    ],
                    // data: [
                    //   { name: 'm1', month: '一月', tem: 7.0, city: '东京' },
                    //   { name: 'm11', month: '一月', tem: 3.9, city: '伦敦' },
                    //   { name: 'm111', month: '一月', tem: 20, city: '西安' },
                    //   { name: 'm2', month: '二月', tem: 9.5, city: '东京' },
                    //   { name: 'm22', month: '二月', tem: 5.7, city: '伦敦' },
                    //   { name: 'm3', month: '三月', tem: 15, city: '东京' },
                    //   { name: 'm33', month: '三月', tem: 8.8, city: '伦敦' }
                    //   // {name: 'm3',  month: '三月', Tokyo: 14.5, London: 8.5, city: '东京' },
                    //   // {name: 'm4',  month: '四月', Tokyo: 18.4, London: 30.9 , city: '东京'},
                    //   // {name: 'm5',  month: '五月', Tokyo: 21.5, London: 15.2 , city: '东京'},
                    //   // {name: 'm6',  month: '六月', Tokyo: 25.2, London: 17.0, city: '东京' },
                    //   // {name: 'm7',  month: '七月', Tokyo: 26.5, London: 16.6 , city: '东京'},
                    //   // {name: 'm8',  month: '八月', Tokyo: 23.3, London: 14.2 , city: '东京'},
                    //   // {name: 'm9',  month: '九月', Tokyo: 6.9, London: 4.2 , city: '东京'},
                    //   // {name: 'm10',  month: '十月', Tokyo: 18.3, London: 10.3, city: '东京' },
                    //   // {name: 'm11',  month: '十一月', Tokyo: 13.9, London: 6.6 , city: '东京'},
                    //   // {name: 'm12',  month: '十二月', Tokyo: 9.6, London: 4.8 , city: '东京'}
                    // ],
                    sharp: 'circle',
                    fields: ['CaseCount', 'CaseName', 'Type'],
                    style: {
                      stroke: '#f1f233',
                      lineWidth: 1
                    },
                    size: '5',
                    adjust: [{
                      type: 'dodge', // stack
                      marginRatio: 1 / 16,
                    }]
                  }
                }
              ]
            },
            {
              id: 'area4',
              span: 12,
              icon: 'icon-list',
              size: {
                nzXs: 12,
                nzSm: 12,
                nzMd: 12,
                nzLg: 12,
                ngXl: 12
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'chart4',
                    'component': 'barChart',
                    'keyId': 'Id',
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'ParentId', type: 'tempValue', valueName: '_parentId'}
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'chartTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
                      ],
                      'relationReceiveContent': []
                    }],
                    title: '降雨量统计',
                    height: '400',
                    width: '500',
                    forceFit: true,
                    key: 'Type',
                    value: 'CaseCount',
                    dataKey: 'Level',
                    scale: [
                      {
                        dataKey: 'Level',
                        min: 0
                      }
                    ],
                    // data: [
                    //   { name: 'm1', month: '一月', tem: 7.0, city: '东京' },
                    //   { name: 'm11', month: '一月', tem: 3.9, city: '伦敦' },
                      
                    //   { name: 'm2', month: '二月', tem: 9.5, city: '东京' },
                    //   { name: 'm22', month: '二月', tem: 5.7, city: '伦敦' },
                    //   { name: 'm333', month: '二月', tem: 20, city: '西安' },
                    //   { name: 'm3', month: '三月', tem: 15, city: '东京' },
                    //   { name: 'm33', month: '三月', tem: 8.8, city: '伦敦' },
                    //   { name: 'm333', month: '三月', tem: 28, city: '西安' },
                    //   { name: 'm111', month: '一月', tem: 10, city: '西安' },
                    // ],
                    sharp: 'circle',
                    fields: ['CaseCount', 'Type', 'Level'],
                    style: {
                      stroke: '#f1f233',
                      lineWidth: 1
                    },
                    size: '5',
                    adjust: [{
                      type: 'stack', // stack
                      marginRatio: 1 / 16,
                    }]
                  },
                  dataList: [],
                  permissions: []
                }
              ]
            }
          ]
        }
      },
    ]
  };
  constructor(private http: _HttpClient) {

  }

  ngOnInit() {
  }
  // region: init
  ngAfterViewInit() {

  }

  // endregion
}



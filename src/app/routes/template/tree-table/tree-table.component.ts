import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
})
export class TreeTableComponent implements OnInit {
  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '数据网格',
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
                    'viewId': 'bsnTreeTable',
                    'component': 'bsnTreeTable',
                    'info': true,
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 18, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'SinoForce.AppData.ShowCase/null/SinoForce.AppData.ShowCase',
                      'ajaxType': 'get',
                      'params': [],
                      'filter': []
                    },
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
                        title: '名称', field: 'CaseName', width: '90px', expand: true,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'CaseName',
                          options: {
                            'type': 'input',
                            'inputType': 'text',
                            'width': '100px'
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
                    'relations': [{
                      'relationViewId': 'singleTable',
                      'relationSendContent': [],
                      'relationReceiveContent': []
                    }],
                    'toolbar': [
                      {
                        'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                      },
                      {
                        'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增'
                      },
                      {
                        'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改'
                      },
                      {
                        'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除',
                        'ajaxConfig': {
                          delete: [{
                            'actionName': 'delete',
                            'url': 'SinoForce.AppData.ShowCase',
                            'ajaxType': 'delete'
                          }]
                        }
                      },
                      {
                        'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
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
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消',
                      },
                      {
                        'name': 'addForm', 'class': 'editable-add-btn', 'text': '弹出新增表单',
                        'type': 'showForm', 'dialogConfig': {
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
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'inputType': 'submit',
                                    'name': 'Type',
                                    'label': '用例',
                                    'labelName': 'CaseName',
                                    'valueName': 'Id',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
                                    'cascader': [
                                      {
                                        'sender': 'appUser',
                                        'type': 'receiver'
                                      }
                                    ],
                                    'ajaxConfig': {
                                      'url': 'SinoForce.AppData.GetCase',
                                      'ajaxType': 'get',
                                      'cascader': true,
                                      'params': [
                                        {
                                          'name': 'Type', 'type': 'tempValue', 'valueName': '_typeId', 'value': ''
                                        }
                                      ]
                                    },
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
                          },
                        ]
                      },
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
                    ]
                  },
                  permissions: {
                    'viewId': 'bsnTreeTable',
                    'columns': [],
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
      /*
      {
        row: {
          cols: [
            {
              id: 'area3',
              title: '查询',
              span: 24,
              icon: 'anticon anticon-search',
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
                    'viewId': 'search_form',
                    'component': 'form_view',
                    'keyId': 'Id',
                    'layout': 'horizontal',
                    'componentType': {
                      'parent': true,
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
                                  'value': 1,
                                  'disabled': false
                                },
                                {
                                  'label': '禁用',
                                  'value': 0,
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
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
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
                    'toolbar': [
                      {
                        'name': 'searchForm', 'class': 'editable-add-btn', 'text': '查询',
                        'span': '8',
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '重置',
                        'span': '8',
                      }
                    ],
                    'dataList': [],
                    'relations': [{
                      'relationViewId': 'search_form',
                      'relationSendContent': [
                        {
                          name: 'searchFormByValue',
                          sender: 'search_form',
                          aop: 'after',
                          receiver: 'singleTable',
                          relationData: {
                            name: 'refreshAsChild',
                            params: [
                              { pid: 'CaseName', cid: '_caseName' },
                              { pid: 'Type', cid: '_type' },
                            ]
                          },
                        }
                      ],
                      'relationReceiveContent': []
                    }],
                  },
                  dataList: []
                }
              ]
            }
          ]
        },
      },
      */
    ]
  };
  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}

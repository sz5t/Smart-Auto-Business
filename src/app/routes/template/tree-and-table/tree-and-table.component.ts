import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-tree-and-table',
  templateUrl: './tree-and-table.component.html',
})
export class TreeAndTableComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '结构树',
              span: 5,
              size: {
                nzXs: 24,
                nzSm: 24,
                nzMd: 5,
                nzLg: 5,
                ngXl: 5
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'tree_and_table_tree',
                    'component': 'bsnTree',
                    'asyncData': true, //
                    'expandAll': true, //
                    'checkable': false,  //    在节点之前添加一个复选框 false
                    'showLine': true,  //   显示连接线 fal
                    'columns': [ // 字段映射，映射成树结构所需
                      { title: '主键', field: 'key', valueName: 'Id' },
                      { title: '父节点', field: 'parentId', valueName: 'parentId' },
                      { title: '标题', field: 'title', valueName: 'caseName' },
                    ],
                    'componentType': {
                      'parent': true,
                      'child': true,
                      'own': false
                    },
                    'parent': [
                      { name: 'parentId', type: 'value', valueName: '', value: 'null' }
                    ],
                    'ajaxConfig': {
                      'url': 'common/ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                      ]
                    },
                    'relations': [
                      {
                        'relationViewId': 'tree_and_table_table',
                        'cascadeMode': 'REFRESH',
                        'params': []
                      }
                    ]
                    // 'relations': [{
                    //   'relationViewId': 'tree_and_table_tree',

                    //   'relationSendContent': [
                    //     {
                    //       'name': 'clickNode',
                    //       'sender': 'tree_and_table_tree',
                    //       'aop': 'after',
                    //       'receiver': 'tree_and_table_table',
                    //       'relationData': {
                    //         'name': 'refreshAsChild',
                    //         'params': [
                    //           { 'pid': 'key', 'cid': '_parentId' }
                    //         ]
                    //       },
                    //     }
                    //   ],
                    //   'relationReceiveContent': []
                    // }]
                  },
                  dataList: []
                }
              ]
            },
            {
              id: 'area2',
              title: '右表',
              span: 19,
              size: {
                nzXs: 24,
                nzSm: 24,
                nzMd: 19,
                nzLg: 19,
                ngXl: 19
              },
              viewCfg: [
                {
                  config: {
                    'viewId': 'tree_and_table_table',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/ShowCase',
                      'ajaxType': 'get',
                      'params': [
                        {
                          name: 'parentId', type: 'tempValue', valueName: '_parentId', 'value': ''
                        }
                      ]
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
                        title: '名称', field: 'caseName', width: '90px',
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'caseName',
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
                        title: '数量', field: 'caseCount', width: 80, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'caseCount',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '级别', field: 'caseLevel', width: 80, hidden: false,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'caseLevel',
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
                      'parent': false,
                      'child': true,
                      'own': false
                    },
                    'relations': [{
                      'relationViewId': 'tree_and_table_tree',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        {
                          pid: 'key', cid: '_parentId'
                        }
                      ]
                    }],
                    'toolbar': [
                      {
                        'group': [
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
                                'url': 'common/ShowCase',
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
                                'url': 'common/ShowCase',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                  { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                  // { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                  { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                  { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                  { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
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
                                'url': 'common/ShowCase',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                  { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                  { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                  // { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                  { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                  { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                  // { name: 'ParentId', type: 'componentValue', valueName: 'ParentId', value: '' },
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

                                 /*    'ajaxConfig': {
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
                                    ],*/
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
                                'labelName': 'caseName',
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
                                  'url': 'common/GetCase',
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
                                'name': 'caseName',
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
                                'name': 'caseLevel',
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
                                'name': 'caseCount',
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
                                  'url': 'common/ShowCase',
                                  'params': [
                                    { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                    { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                    { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                    { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
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
                                  'url': 'common/ShowCase',
                                  'params': [
                                    { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                    { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                    { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                    { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                    { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
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
                      'url': 'common/ShowCase',
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
                            /*   'ajaxConfig': {
                                'url': 'SinoForce.User.AppUser',
                                'ajaxType': 'get',
                                'params': []
                              }, */
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
                              'name': 'caseName',
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
                              'name': 'caseLevel',
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
                              'name': 'caseCount',
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
                              'url': 'common/ShowCase',
                              'params': [
                                { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                { name: 'CreateTime', type: 'componentValue', valueName: 'CreateTime', value: '' },
                                { name: 'Enable', type: 'componentValue', valueName: 'Enable', value: '' },
                                { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
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
                              'name': 'caseName',
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
                              'url': 'common/ShowCase',
                              'batch': true,
                              'params': [
                                { name: 'Id', type: 'checkedItem', valueName: 'Id', value: '' },
                                { name: 'caseName', type: 'checkedItem', valueName: 'caseName', value: '' },
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
                }
              ]
            }
          ],
          'dataSet': [
           /*  {
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
            } */
          ]
        },
        permissions: {
          'viewId': 'tree_and_table_table',
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
      }

    ]
  };



}

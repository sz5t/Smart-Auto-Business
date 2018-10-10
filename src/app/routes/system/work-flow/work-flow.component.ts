import { Component, Injectable, OnInit } from '@angular/core';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { AppPermission, FuncResPermission, OpPermission, PermissionValue } from '../../../model/APIModel/AppPermission';
import { TIMEOUT } from 'dns';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-work-flow, [work-flow]',
  templateUrl: './work-flow.component.html',
  styles: []
})
export class WorkFlowComponent implements OnInit {

  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '工作流',
              span: 24,
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
                    'viewId': 'parentTable',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'showCheckBox': true,
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默pageSizeOptions认每页数据条数
                    '': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/WfInfo',
                      'ajaxType': 'get',
                      'params': [
                        {
                          name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
                        }
                      ]
                    },
                    'componentType': {
                      'parent': true,
                      'child': false,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'parentTable',
                      'relationSendContent': [
                        {
                          name: 'selectRow',
                          sender: 'parentTable',
                          aop: 'after',
                          receiver: 'childTable',
                          relationData: {
                            name: 'refreshAsChild',
                            params: [
                              { pid: 'Id', cid: '_parentId' },
                            ]
                          },
                        }
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
                                'url': 'common/WfInfo',
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
                                'url': 'common/WfInfo',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                  { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                                'url': 'common/WfInfo',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                  { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                            'type': 'showForm'

                          },
                          {
                            'name': 'editForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                            'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'updateShowCase',
                            'type': 'showForm'

                          },
                          /*        {
                                   'name': 'executeCheckedRow', 'class': 'editable-add-btn', 'text': '批量建模', 'action': 'EXECUTE_CHECKED',
                                   'actionType': 'post', 'actionName': 'BuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/buildModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'checkedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 },
                                 {
                                   'name': 'executeSelectedRow', 'class': 'editable-add-btn', 'text': '建模', 'action': 'EXECUTE_SELECTED',
                                   'actionType': 'post', 'actionName': 'BuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/buildModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'selectedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 },
                                 {
                                   'name': 'executeSelectedRow', 'class': 'editable-add-btn', 'text': '取消建模', 'action': 'EXECUTE_SELECTED',
                                   'actionType': 'post', 'actionName': 'CancelBuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/cancelModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'selectedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 }, */
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
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'name',
                                  'label': '名称',
                                  'isRequired': true,
                                  'placeholder': '请输入建模名称',
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
                                  'name': 'tableName',
                                  'label': '表名',
                                  'isRequired': true,
                                  'placeholder': '请输入表名',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入表名'
                                    }
                                  ]
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
                                  'name': 'isEnabled',
                                  'label': '是否有效',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isNeedDeploy',
                                  'label': '是否发布',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'belongPlatformType',
                                  'label': '平台类型',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '配置平台',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '运行平台',
                                      'value': '2',
                                      'disabled': false
                                    },
                                    {
                                      'label': '通用',
                                      'value': '3',
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
                                  'name': 'comments',
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
                                  'url': 'common/ComTabledata',
                                  'params': [


                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'tableName', type: 'componentValue', valueName: 'tableName', value: '' },
                                    { name: 'tableType', type: 'value', valueName: '', value: '1' },

                                    { name: 'parentTableId', type: 'value', valueName: '', value: '' },
                                    { name: 'parentTableName ', type: 'value', valueName: '', value: '' },
                                    { name: 'isHavaDatalink', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnId', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnName', type: 'value', valueName: '', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'isNeedDeploy', type: 'componentValue', valueName: 'isNeedDeploy', value: '' },
                                    { name: 'belongPlatformType', type: 'componentValue', valueName: 'belongPlatformType', value: '' }
                                  ]
                                }]
                              }
                            },
                            {
                              'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                              'ajaxConfig': {
                                post: [{
                                  'url': 'common/ComTabledata',
                                  'params': [

                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'tableName', type: 'componentValue', valueName: 'tableName', value: '' },
                                    { name: 'tableType', type: 'value', valueName: '', value: '1' },

                                    { name: 'parentTableId', type: 'value', valueName: '', value: '' },
                                    { name: 'parentTableName ', type: 'value', valueName: '', value: '' },
                                    { name: 'isHavaDatalink', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnId', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnName', type: 'value', valueName: '', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'isNeedDeploy', type: 'componentValue', valueName: 'isNeedDeploy', value: '' },
                                    { name: 'belongPlatformType', type: 'componentValue', valueName: 'belongPlatformType', value: '' }
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
                          'url': 'common/ComTabledata',
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
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'name',
                                  'label': '名称',
                                  'isRequired': true,
                                  'placeholder': '请输入建模名称',
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
                                  'name': 'tableName',
                                  'label': '表名',
                                  'isRequired': true,
                                  'placeholder': '请输入表名',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入表名'
                                    }
                                  ]
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
                                  'name': 'isEnabled',
                                  'label': '是否有效',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isNeedDeploy',
                                  'label': '是否发布',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'belongPlatformType',
                                  'label': '平台类型',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '配置平台',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '运行平台',
                                      'value': '2',
                                      'disabled': false
                                    },
                                    {
                                      'label': '通用',
                                      'value': '3',
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
                                  'name': 'comments',
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
                                  'url': 'common/ComTabledata',
                                  'params': [
                                    { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },

                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'tableName', type: 'componentValue', valueName: 'tableName', value: '' },
                                    { name: 'tableType', type: 'value', valueName: '', value: '1' },

                                    { name: 'parentTableId', type: 'value', valueName: '', value: '' },
                                    { name: 'parentTableName ', type: 'value', valueName: '', value: '' },
                                    { name: 'isHavaDatalink', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnId', type: 'value', valueName: '', value: '' },
                                    { name: 'subRefParentColumnName', type: 'value', valueName: '', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'isNeedDeploy', type: 'componentValue', valueName: 'isNeedDeploy', value: '' },
                                    { name: 'belongPlatformType', type: 'componentValue', valueName: 'belongPlatformType', value: '' }
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
                    'dataSet': [

                    ]
                  },
                  permissions: {
                    'viewId': 'parentTable',
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
      {
        row: {
          cols: [
            {
              id: 'area2',
              title: '工作流版本',
              span: 24,
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
                    'viewId': 'wf_Version_Table',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'showCheckBox': true,
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/WfVersion',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                      ]
                    },
                    'componentType': {
                      'parent': true,
                      'child': true,
                      'own': false
                    },
                    'relations': [{
                      'relationViewId': 'parentTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
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
                        title: '版本号', field: 'version', width: 80, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'version',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },

                      {
                        title: '排序', field: 'sort', width: 60, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'sort',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },

                      {

                        title: '备注', field: 'remark', width: 100, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'remark',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '6',
                            'inputType': 'text',
                          }
                        }
                      },

                      {

                        title: '状态', field: 'state', width: 100, hidden: false,
                        editor: {
                          type: 'input',
                          field: 'state',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '6',
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
                                'url': 'common/WfVersion',
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
                                'url': 'common/WfVersion',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'version', type: 'componentValue', valueName: 'version', value: '' },

                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                  { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                  { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' }
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
                                'url': 'common/WfVersion',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                  { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'version', type: 'componentValue', valueName: 'version', value: '' },

                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                  { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                  { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' }
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
                            'type': 'showForm'
                          },
                          {
                            'name': 'editForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                            'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'updateShowCase',
                            'type': 'showForm'
                          },
                          {
                            'name': 'addRow', 'class': 'editable-add-btn', 'text': '启用', 'action': 'CREATE'
                          },
                          {
                            'name': 'addRow', 'class': 'editable-add-btn', 'text': '禁用', 'action': 'CREATE'
                          },
                          {
                            'name': 'addRow', 'class': 'editable-add-btn', 'text': '配置', 'action': 'CREATE'
                          },
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
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'name',
                                  'label': '名称',
                                  'isRequired': true,
                                  'placeholder': '请输入列名称',
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
                                      'errorMessage': '请输入列名称!!!!'
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
                                  'name': 'columnName',
                                  'label': '字段名',
                                  'isRequired': true,
                                  'placeholder': '字段名',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入字段名'
                                    }
                                  ]
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
                                  'name': 'columnType',
                                  'label': '字段数据类型',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [

                                    {
                                      'label': '字符串',
                                      'value': 'string',
                                      'disabled': false
                                    },
                                    {
                                      'label': '整型',
                                      'value': 'integer',
                                      'disabled': false
                                    },
                                    {
                                      'label': '日期',
                                      'value': 'date',
                                      'disabled': false
                                    },
                                    {
                                      'label': '布尔值',
                                      'value': 'boolean',
                                      'disabled': false
                                    },
                                    {
                                      'label': '浮点型',
                                      'value': 'double',
                                      'disabled': false
                                    },
                                    {
                                      'label': '字符大字段',
                                      'value': 'clob',
                                      'disabled': false
                                    },
                                    {
                                      'label': '二进制大字段',
                                      'value': 'blob',
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
                                  'name': 'length',
                                  'label': '字段长度',
                                  'isRequired': true,
                                  'placeholder': '字段长度',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入字段长度'
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
                                  'name': 'precision',
                                  'label': '字段精度',
                                  // 'isRequired': true,
                                  'placeholder': '字段精度',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入字段精度'
                                     }
                                   ] */
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
                                  'name': 'defaultValue',
                                  'label': '默认值',
                                  // 'isRequired': true,
                                  'placeholder': '默认值',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /* 'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入默认值'
                                    }
                                  ] */
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
                                  'name': 'isUnique',
                                  'label': '是否唯一',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isNullabled',
                                  'label': '是否为空',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isDataDictionary',
                                  'label': '是否数据字典',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'dataDictionaryCode',
                                  'label': '数据字典编码',
                                  // 'isRequired': true,
                                  'placeholder': '数据字典编码',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入数据字典编码'
                                     }
                                   ] */
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
                                  'name': 'orderCode',
                                  'label': '排序',
                                  // 'isRequired': true,
                                  'placeholder': '排序',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入数据字典编码'
                                     }
                                   ] */
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
                                  'name': 'isEnabled',
                                  'label': '是否有效',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'comments',
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
                                  'url': 'common/ComColumndata',
                                  'params': [
                                    { name: 'tableId', type: 'tempValue', valueName: '_parentId', value: '' },
                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'columnName', type: 'componentValue', valueName: 'columnName', value: '' },
                                    { name: 'columnType', type: 'componentValue', valueName: 'columnType', value: '1' },
                                    { name: 'length', type: 'componentValue', valueName: 'length', value: '' },
                                    { name: 'precision', type: 'componentValue', valueName: 'precision', value: '' },
                                    { name: 'defaultValue', type: 'componentValue', valueName: 'defaultValue', value: '' },
                                    { name: 'isUnique', type: 'componentValue', valueName: 'isUnique', value: '' },
                                    { name: 'isNullabled', type: 'componentValue', valueName: 'isNullabled', value: '' },
                                    { name: 'isDataDictionary', type: 'componentValue', valueName: 'isDataDictionary', value: '' },
                                    { name: 'dataDictionaryCode', type: 'componentValue', valueName: 'dataDictionaryCode', value: '' },
                                    { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' }
                                  ]
                                }]
                              }
                            },
                            {
                              'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                              'ajaxConfig': {
                                post: [{
                                  'url': 'common/ComColumndata',
                                  'params': [

                                    { name: 'tableId', type: 'tempValue', valueName: '_parentId', value: '' },
                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'columnName', type: 'componentValue', valueName: 'columnName', value: '' },
                                    { name: 'columnType', type: 'componentValue', valueName: 'columnType', value: '1' },
                                    { name: 'length', type: 'componentValue', valueName: 'length', value: '' },
                                    { name: 'precision', type: 'componentValue', valueName: 'precision', value: '' },
                                    { name: 'defaultValue', type: 'componentValue', valueName: 'defaultValue', value: '' },
                                    { name: 'isUnique', type: 'componentValue', valueName: 'isUnique', value: '' },
                                    { name: 'isNullabled', type: 'componentValue', valueName: 'isNullabled', value: '' },
                                    { name: 'isDataDictionary', type: 'componentValue', valueName: 'isDataDictionary', value: '' },
                                    { name: 'dataDictionaryCode', type: 'componentValue', valueName: 'dataDictionaryCode', value: '' },
                                    { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' }
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
                          'url': 'common/ComColumndata',
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
                                  'type': 'input',
                                  'labelSize': '6',
                                  'controlSize': '16',
                                  'inputType': 'text',
                                  'name': 'name',
                                  'label': '名称',
                                  'isRequired': true,
                                  'placeholder': '请输入列名称',
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
                                      'errorMessage': '请输入列名称!!!!'
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
                                  'name': 'columnName',
                                  'label': '字段名',
                                  'isRequired': true,
                                  'placeholder': '字段名',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入字段名'
                                    }
                                  ]
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
                                  'name': 'columnType',
                                  'label': '字段数据类型',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [

                                    {
                                      'label': '字符串',
                                      'value': 'string',
                                      'disabled': false
                                    },
                                    {
                                      'label': '整型',
                                      'value': 'integer',
                                      'disabled': false
                                    },
                                    {
                                      'label': '日期',
                                      'value': 'date',
                                      'disabled': false
                                    },
                                    {
                                      'label': '布尔值',
                                      'value': 'boolean',
                                      'disabled': false
                                    },
                                    {
                                      'label': '浮点型',
                                      'value': 'double',
                                      'disabled': false
                                    },
                                    {
                                      'label': '字符大字段',
                                      'value': 'clob',
                                      'disabled': false
                                    },
                                    {
                                      'label': '二进制大字段',
                                      'value': 'blob',
                                      'disabled': false
                                    },
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
                                  'name': 'length',
                                  'label': '字段长度',
                                  'isRequired': true,
                                  'placeholder': '字段长度',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入字段长度'
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
                                  'name': 'precision',
                                  'label': '字段精度',
                                  // 'isRequired': true,
                                  'placeholder': '字段精度',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入字段精度'
                                     }
                                   ] */
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
                                  'name': 'defaultValue',
                                  'label': '默认值',
                                  // 'isRequired': true,
                                  'placeholder': '默认值',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /* 'validations': [
                                    {
                                      'validator': 'required',
                                      'errorMessage': '请输入默认值'
                                    }
                                  ] */
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
                                  'name': 'isUnique',
                                  'label': '是否唯一',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isNullabled',
                                  'label': '是否为空',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'isDataDictionary',
                                  'label': '是否数据字典',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'dataDictionaryCode',
                                  'label': '数据字典编码',
                                  // 'isRequired': true,
                                  'placeholder': '数据字典编码',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入数据字典编码'
                                     }
                                   ] */
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
                                  'name': 'orderCode',
                                  'label': '排序',
                                  // 'isRequired': true,
                                  'placeholder': '排序',
                                  'perfix': 'anticon anticon-edit',
                                  'disabled': false,
                                  'readonly': false,
                                  'size': 'default',
                                  'layout': 'column',
                                  'span': '24',
                                  /*  'validations': [
                                     {
                                       'validator': 'required',
                                       'errorMessage': '请输入数据字典编码'
                                     }
                                   ] */
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
                                  'name': 'isEnabled',
                                  'label': '是否有效',
                                  'notFoundContent': '',
                                  'selectModel': false,
                                  'showSearch': true,
                                  'placeholder': '--请选择--',
                                  'disabled': false,
                                  'size': 'default',
                                  'options': [
                                    {
                                      'label': '是',
                                      'value': '1',
                                      'disabled': false
                                    },
                                    {
                                      'label': '否',
                                      'value': '0',
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
                                  'name': 'comments',
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
                                  'url': 'common/ComColumndata',
                                  'params': [
                                    { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                    { name: 'tableId', type: 'tempValue', valueName: '_parentId', value: '' },
                                    { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                    { name: 'columnName', type: 'componentValue', valueName: 'columnName', value: '' },
                                    { name: 'columnType', type: 'componentValue', valueName: 'columnType', value: '1' },
                                    { name: 'length', type: 'componentValue', valueName: 'length', value: '' },
                                    { name: 'precision', type: 'componentValue', valueName: 'precision', value: '' },
                                    { name: 'defaultValue', type: 'componentValue', valueName: 'defaultValue', value: '' },
                                    { name: 'isUnique', type: 'componentValue', valueName: 'isUnique', value: '' },
                                    { name: 'isNullabled', type: 'componentValue', valueName: 'isNullabled', value: '' },
                                    { name: 'isDataDictionary', type: 'componentValue', valueName: 'isDataDictionary', value: '' },
                                    { name: 'dataDictionaryCode', type: 'componentValue', valueName: 'dataDictionaryCode', value: '' },
                                    { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                                    { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                                    { name: 'comments', type: 'componentValue', valueName: 'comments', value: '' }
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
                    'dataSet': []
                  },
                  permissions: {
                    'viewId': 'wf_Version_Table',
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
      {
        row: {
          cols: [
            {
              id: 'area3',
              title: '工作流详细信息',
              span: 24,
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
                    viewId: 'tab_wf',
                    tabPosition: 'top',
                    tabType: 'card', // card
                    size: 'small',
                    component: 'bsnTabs',
                    tabs: [
                      {
                        title: '节点信息',
                        icon: 'icon-list text-success',
                        active: true,
                        viewCfg: [
                          {
                            config: {

                              'viewId': 'wf_node_Table',
                              'component': 'bsnTable',
                              'keyId': 'Id',
                              'showCheckBox': true,
                              'pagination': true, // 是否分页
                              'showTotal': true, // 是否显示总数据量
                              'pageSize': 5, // 默认每页数据条数
                              'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                              'ajaxConfig': {
                                'url': 'common/WfNodes',
                                'ajaxType': 'get',
                                'params': [
                                  { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                                ]
                              },
                              'componentType': {
                                'parent': true,
                                'child': true,
                                'own': false
                              },
                              'relations': [{
                                'relationViewId': 'wf_Version_Table',
                                'cascadeMode': 'REFRESH_AS_CHILD',
                                'params': [
                                  { pid: 'Id', cid: '_parentId' },
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
                                  title: '类别', field: 'attribute', width: 80, hidden: false,
                                  showFilter: true, showSort: true,
                                  editor: {
                                    type: 'select',
                                    field: 'attribute',
                                    options: {
                                      'type': 'select',
                                      'labelSize': '6',
                                      'controlSize': '18',
                                      'inputType': 'submit',
                                      'name': 'caseType',
                                      'label': 'caseType',
                                      'notFoundContent': '',
                                      'selectModel': false,
                                      'showSearch': true,
                                      'placeholder': '-请选择-',
                                      'disabled': false,
                                      'size': 'default',
                                      'clear': true,
                                      'width': '130px',
                                      'dataSet': 'getWfNodeType',
                                      'options': [

                                      ]
                                    }
                                  }
                                }
                              ],
                              'toolbar': [
                                {
                                  'group': [
                                    {
                                      'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                                    },
                                    {
                                      'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增', 'action': 'CREATE'
                                    },
                                    {
                                      'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'action': 'EDIT'
                                    },
                                  ]
                                },
                                {
                                  'group': [
                                    {
                                      'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'action': 'DELETE',
                                      'ajaxConfig': {
                                        delete: [{
                                          'actionName': 'delete',
                                          'url': 'common/WfNodes',
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
                                          'url': 'common/WfNodes',
                                          'ajaxType': 'post',
                                          'params': [
                                            { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                            { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                            { name: 'attribute', type: 'componentValue', valueName: 'attribute', value: '' }
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
                                          'url': 'common/WfNodes',
                                          'ajaxType': 'put',
                                          'params': [
                                            { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                            { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                            { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                            { name: 'attribute', type: 'componentValue', valueName: 'attribute', value: '' }
                                          ]
                                        }]
                                      }
                                    },
                                    {
                                      'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                    }
                                  ]
                                }
                              ],
                              'dataSet': [
                                {
                                  'name': 'getWfNodeType',
                                  'ajaxConfig': {
                                    'url': 'common/WfDictionaries',
                                    'ajaxType': 'get',
                                    'params': [
                                      { name: 'typeCode', type: 'value', valueName: '', value: 'ATTRIBUTE' }
                                    ]
                                  },
                                  'params': [],
                                  'fields': [
                                    {
                                      'label': 'Id',
                                      'field': 'value',
                                      'name': 'value'
                                    },
                                    {
                                      'label': '',
                                      'field': 'name',
                                      'name': 'label'
                                    },
                                    {
                                      'label': '',
                                      'field': 'name',
                                      'name': 'text'
                                    }
                                  ]
                                }
                              ]
                            },
                            permissions: {
                              'viewId': 'tree_and_tabs_table',
                              'columns': [],
                              'toolbar': [],
                              'formDialog': [],
                              'windowDialog': []
                            },
                            dataList: []
                          },
                          {

                            config: {
                              viewId: 'tab_text_11',
                              tabPosition: 'top',
                              tabType: 'card', // card
                              size: 'small',
                              component: 'bsnTabs',
                              tabs: [
                                {
                                  title: '节点属性',
                                  icon: 'icon-list text-green-light',
                                  active: false,
                                  viewCfg: [
                                    {
                                      config: {
                                        'viewId': 'nodes_form',
                                        'component': 'form_view',
                                        'keyId': 'Id',
                                        ajaxConfig: {
                                          'url': 'common/WfNodes',
                                          'ajaxType': 'getById',
                                          'params': [
                                            { name: 'Id', type: 'tempValue', valueName: '_id', value: '' }
                                          ]
                                        },
                                        componentType: {
                                          'parent': true,
                                          'child': true,
                                          'own': false
                                        },
                                        'relations': [
                                          {
                                            'relationViewId': 'wf_node_Table',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                              { pid: 'Id', cid: '_id' },
                                              { pid: 'wfid', cid: '_wfid' }
                                            ],
                                            'relationReceiveContent': []
                                          }
                                        ],
                                        'forms': [
                                          {
                                            controls: [
                                              {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'submit',
                                                'name': 'cktype',
                                                'label': '审批人类型',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'CKTYPE' }
                                                  ]
                                                },
                                                'options': [
                                                ],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'submit',
                                                'name': 'approverspeple',
                                                'label': '审批人',
                                                'labelName': 'realName',
                                                'valueName': 'Id',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'multiple': 'multiple',
                                                'ajaxConfig': {
                                                  'url': 'common/SysUser',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                  ]
                                                },
                                                'options': [
                                                ],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'selectTree',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'name': 'approversorg',
                                                'label': '审批组织',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'multiple': true,
                                                'Checkable': false,
                                                'size': 'default',
                                                'columns': [
                                                  { title: '主键', field: 'key', valueName: 'Id' },
                                                  { title: '父节点', field: 'parentId', valueName: 'parentId' },
                                                  { title: '标题', field: 'title', valueName: 'name' },
                                                ],
                                                'ajaxConfig': {
                                                  'url': 'common/SysDept',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                  ]
                                                },
                                                'parent': [
                                                  { name: 'parentId', type: 'value', valueName: '取值参数名称', value: 'null' }
                                                ],
                                                'layout': 'column',
                                                'span': '12'
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
                                                'name': 'approvaltactics',
                                                'label': '审批策略',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'APPROVALTACTICS' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'input',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'text',
                                                'name': 'approvalnum',
                                                'label': '审批百分比',
                                                'placeholder': '',
                                                'disabled': false,
                                                'readonly': false,
                                                'size': 'default',
                                                'layout': 'column',
                                                'span': '12'
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
                                                'name': 'returntactics',
                                                'label': '退回策略',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'RETURNTACTICS' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'submit',
                                                'name': 'returnttype',
                                                'label': '退回类型',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'RETURNTTYPE' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'submit',
                                                'name': 'returntstep',
                                                'label': '退回步骤',
                                                'labelName': 'name',
                                                'valueName': 'Id',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfNodes',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'wfid', type: 'tempValue', valueName: '_wfid', value: '' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
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
                                                'name': 'signtactics',
                                                'label': '会签策略',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'SIGNTACTICS' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'input',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'text',
                                                'name': 'signnum',
                                                'label': '会签百分比',
                                                'placeholder': '',
                                                'disabled': false,
                                                'readonly': false,
                                                'size': 'default',
                                                'layout': 'column',
                                                'span': '12'
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
                                                'name': 'subprocesstactics',
                                                'label': '子流程策略',
                                                'labelName': 'name',
                                                'valueName': 'value',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '--请选择--',
                                                'disabled': false,
                                                'size': 'default',
                                                'ajaxConfig': {
                                                  'url': 'common/WfDictionaries',
                                                  'ajaxType': 'get',
                                                  'params': [
                                                    { name: 'typeCode', type: 'value', valueName: '', value: 'SUBPROCESSTACTICS' }
                                                  ]
                                                },
                                                'options': [],
                                                'layout': 'column',
                                                'span': '12'
                                              },
                                              {
                                                'type': 'input',
                                                'labelSize': '6',
                                                'controlSize': '16',
                                                'inputType': 'text',
                                                'name': 'subprocess',
                                                'label': '子流程',
                                                'placeholder': '',
                                                'disabled': false,
                                                'readonly': false,
                                                'size': 'default',
                                                'layout': 'column',
                                                'span': '12'
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
                                                'name': 'formresource',
                                                'label': '表单',
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
                                        'cascade': [ // 配置 信息
                                          // {
                                          //     name: 'Type', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                          //     CascadeObjects: [// 当前小组件级联对象数组
                                          //         {
                                          //             cascadeName: 'Enable', // field 对象 接收级联信息的小组件
                                          //             cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                          //                 // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                          //                 // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                          //                 {
                                          //                     // 缺少case描述语言
                                          //                     // 描述当前值是什么，触发
                                          //                     caseValue: { valueName: 'value', regular: '^1$' }, // 哪个字段的值触发，正则表达
                                          //                     data: {
                                          //                         type: 'option', // option/ajax/setValue
                                          //                         option_data: { // 静态数据集
                                          //                             option: [
                                          //                                 { value: '1', label: '1' }
                                          //                             ]
                                          //                         },
                                          //                         ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                          //                             // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                          //                         },
                                          //                         setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                          //                             value: '新值'
                                          //                         },
                                          //                         show_data: { // 当前表单的展示字段等信息

                                          //                         },
                                          //                         relation_data: {

                                          //                         }

                                          //                     }
                                          //                 },
                                          //                 // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                          //                 // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                          //                 {
                                          //                     // 缺少case描述语言
                                          //                     // 描述当前值是什么，触发
                                          //                     caseValue: { valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                          //                     //  [
                                          //                     //     { type: 'in', value: '1' },
                                          //                     //     { type: 'range', fromValue: '1', toValue: '' },
                                          //                     // ],
                                          //                     data: {
                                          //                         type: 'option', // option/ajax/setValue
                                          //                         option_data: { // 静态数据集
                                          //                             option: [
                                          //                                 { value: '2', label: '2' }
                                          //                             ]
                                          //                         },
                                          //                         ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                          //                             // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                          //                         },
                                          //                         setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                          //                             value: '新值'
                                          //                         },
                                          //                         show_data: { // 当前表单的展示字段等信息

                                          //                         },
                                          //                         relation_data: {

                                          //                         }

                                          //                     }
                                          //                 },
                                          //                 {
                                          //                     // 缺少case描述语言
                                          //                     // 描述当前值是什么，触发
                                          //                     caseValue: { valueName: 'value', regular: '^3$' }, // 哪个字段的值触发，正则表达
                                          //                     //  [
                                          //                     //     { type: 'in', value: '1' },
                                          //                     //     { type: 'range', fromValue: '1', toValue: '' },
                                          //                     // ],
                                          //                     data: {
                                          //                         type: 'show', // option/ajax/setValue
                                          //                         option_data: { // 静态数据集
                                          //                             option: [
                                          //                                 { value: '3', label: '3' }
                                          //                             ]
                                          //                         },
                                          //                         ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                          //                             // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                          //                         },
                                          //                         setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                          //                             value: '新值'
                                          //                         },
                                          //                         show_data: { // 当前表单的展示字段等信息
                                          //                             option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                          //                                 { hidden: false}

                                          //                         },
                                          //                         relation_data: {

                                          //                         }

                                          //                     }
                                          //                 },
                                          //                 {
                                          //                     // 缺少case描述语言
                                          //                     // 描述当前值是什么，触发
                                          //                     caseValue: { valueName: 'value', regular: '^4$' }, // 哪个字段的值触发，正则表达
                                          //                     //  [
                                          //                     //     { type: 'in', value: '1' },
                                          //                     //     { type: 'range', fromValue: '1', toValue: '' },
                                          //                     // ],
                                          //                     data: {
                                          //                         type: 'show', // option/ajax/setValue
                                          //                         option_data: { // 静态数据集
                                          //                             option: [
                                          //                                 { value: '4', label: '4' }
                                          //                             ]
                                          //                         },
                                          //                         ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                          //                             // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                          //                         },
                                          //                         setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                          //                             value: '新值'
                                          //                         },
                                          //                         show_data: { // 当前表单的展示字段等信息
                                          //                             option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                          //                                 { hidden: true}

                                          //                         },
                                          //                         relation_data: {

                                          //                         }

                                          //                     }
                                          //                 },



                                          //             ],
                                          //             cascadeDateItems: [ ]  // 应答描述数组，同一个组件可以做出不同应答

                                          //         }
                                          //     ],

                                          // }

                                        ],
                                        'toolbar': {
                                          'gutter': 24,
                                          'offset': 6,
                                          'span': 16,
                                          'buttons': [
                                            {
                                              'name': 'saveForm', 'type': 'primary', 'text': '保存',
                                              'ajaxConfig': {
                                                put: {
                                                  'url': 'common/WfNodes',
                                                  'ajaxType': 'put',
                                                  'params': [
                                                    {
                                                      name: 'Id',
                                                      type: 'tempValue',
                                                      valueName: '_id',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'cktype',
                                                      type: 'componentValue',
                                                      valueName: 'cktype',
                                                      value: ''
                                                    },
                                                    // {
                                                    //   name: 'approvers',
                                                    //   type: 'componentValue',
                                                    //   valueName: 'approverspeple',
                                                    //   value: ''
                                                    // },
                                                    {
                                                      name: 'approvaltactics',
                                                      type: 'componentValue',
                                                      valueName: 'approvaltactics',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'approvalnum',
                                                      type: 'componentValue',
                                                      valueName: 'approvalnum',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'returntactics',
                                                      type: 'componentValue',
                                                      valueName: 'returntactics',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'returnttype',
                                                      type: 'componentValue',
                                                      valueName: 'returnttype',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'returntstep',
                                                      type: 'componentValue',
                                                      valueName: 'returntstep',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'signtactics',
                                                      type: 'componentValue',
                                                      valueName: 'signtactics',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'signnum',
                                                      type: 'componentValue',
                                                      valueName: 'signnum',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'subprocesstactics',
                                                      type: 'componentValue',
                                                      valueName: 'subprocesstactics',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'subprocess',
                                                      type: 'componentValue',
                                                      valueName: 'subprocess',
                                                      value: ''
                                                    },
                                                    {
                                                      name: 'formresource',
                                                      type: 'componentValue',
                                                      valueName: 'formresource',
                                                      value: ''
                                                    }
                                                  ]
                                                }
                                              }
                                            },
                                            {
                                              'name': 'cancelRow', 'type': 'default', 'text': '取消'
                                            }
                                          ],
                                        },
                                        'dataList': []
                                      },
                                      permissions: {
                                        'viewId': 'nodes_form',
                                        'columns': [],
                                        'toolbar': [],
                                        'formDialog': [],
                                        'windowDialog': []
                                      },
                                      dataList: []
                                    }
                                  ]
                                },
                                {
                                  title: '节点按钮',
                                  icon: 'icon-list text-success',
                                  active: true,
                                  rows: [
                                    {
                                      row: {
                                        cols: [
                                          {
                                            id: 'areatest',
                                            title: '操作按钮',
                                            span: 24,
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
                                                  'viewId': 'Operation_Table',
                                                  'component': 'bsnTable',
                                                  'keyId': 'Id',
                                                  'showCheckBox': true,
                                                  'pagination': true, // 是否分页
                                                  'showTotal': true, // 是否显示总数据量
                                                  'pageSize': 5, // 默pageSizeOptions认每页数据条数
                                                  '': [5, 10, 20, 30, 40, 50],
                                                  'ajaxConfig': {
                                                    'url': 'common/WfOperation',
                                                    'ajaxType': 'get',
                                                    'params': [
                                                      {
                                                        name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
                                                      },
                                                      {
                                                        name: 'nodeid', type: 'tempValue', valueName: '_parentId', value: ''
                                                      }
                                                    ]
                                                  },
                                                  'componentType': {
                                                    'parent': true,
                                                    'child': true,
                                                    'own': false
                                                  },
                                                  'relations': [{
                                                    'relationViewId': 'wf_node_Table',
                                                    'cascadeMode': 'REFRESH_AS_CHILD',
                                                    'params': [
                                                      { pid: 'Id', cid: '_parentId' },
                                                      { pid: 'wfid', cid: '_wfid' },
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
                                                      title: '按钮文本', field: 'title', width: 80,
                                                      showFilter: false, showSort: false,
                                                      editor: {
                                                        type: 'input',
                                                        field: 'title',
                                                        options: {
                                                          'type': 'input',
                                                          'labelSize': '6',
                                                          'controlSize': '18',
                                                          'inputType': 'text',
                                                        }
                                                      }
                                                    },
                                                    {
                                                      title: '按钮编码', field: 'name', width: 80,
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
                                                      title: '排序', field: 'sort', width: 80,
                                                      showFilter: false, showSort: true,
                                                      editor: {
                                                        type: 'input',
                                                        field: 'sort',
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
                                                              'url': 'common/WfOperation',
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
                                                              'url': 'common/WfOperation',
                                                              'ajaxType': 'post',
                                                              'params': [
                                                                { name: 'nodeid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                { name: 'wfid', type: 'tempValue', valueName: '_wfid', value: '' },
                                                                { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                { name: 'title', type: 'componentValue', valueName: 'title', value: '' },
                                                                { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                                                              'url': 'common/WfOperation',
                                                              'ajaxType': 'put',
                                                              'params': [
                                                                { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                                                { name: 'wfid', type: 'tempValue', valueName: '_wfid', value: '' },
                                                                { name: 'nodeid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                { name: 'title', type: 'componentValue', valueName: 'title', value: '' },
                                                                { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
                                                              ]
                                                            }]
                                                          }
                                                        },
                                                        {
                                                          'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
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
                                                  'formDialog': [
                                                  ],
                                                  'dataSet': [

                                                  ]
                                                },
                                                permissions: {
                                                  'viewId': 'parentTable',
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
                                    {
                                      row: {
                                        cols: [
                                          {
                                            id: 'actionname',
                                            title: '操作分组',
                                            span: 8,
                                            size: {
                                              nzXs: 24,
                                              nzSm: 24,
                                              nzMd: 24,
                                              nzLg: 8,
                                              ngXl: 8
                                            },
                                            viewCfg: [
                                              {
                                                config: {
                                                  'viewId': 'OperationGroup_Table',
                                                  'component': 'bsnTable',
                                                  'keyId': 'Id',
                                                  'showCheckBox': true,
                                                  'pagination': true, // 是否分页
                                                  'showTotal': true, // 是否显示总数据量
                                                  'pageSize': 5, // 默pageSizeOptions认每页数据条数
                                                  '': [5, 10, 20, 30, 40, 50],
                                                  'ajaxConfig': {
                                                    'url': 'common/WfOperationgroup',
                                                    'ajaxType': 'get',
                                                    'params': [
                                                      {
                                                        name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
                                                      },
                                                      {
                                                        name: 'operationid', type: 'tempValue', valueName: '_parentId', value: 'createDate desc'
                                                      }

                                                    ]
                                                  },
                                                  'componentType': {
                                                    'parent': true,
                                                    'child': true,
                                                    'own': true
                                                  },
                                                  'relations': [{
                                                    'relationViewId': 'Operation_Table',
                                                    'cascadeMode': 'REFRESH_AS_CHILD',
                                                    'params': [
                                                      { pid: 'Id', cid: '_parentId' },
                                                      { pid: 'wfid', cid: '_wfid' },
                                                    ],
                                                    'relationReceiveContent': []
                                                  }],
                                                  columns: [
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
                                                      title: '排序', field: 'sort', width: 80,
                                                      showFilter: false, showSort: true,
                                                      editor: {
                                                        type: 'input',
                                                        field: 'sort',
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
                                                    }
                                                  ],
                                                  toolbar: [
                                                    {
                                                      group: [
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
                                                              'url': 'common/WfOperationgroup',
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
                                                              'url': 'common/WfOperationgroup',
                                                              'ajaxType': 'post',
                                                              'params': [
                                                                { name: 'operationid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                                                              'url': 'common/WfOperationgroup',
                                                              'ajaxType': 'put',
                                                              'params': [
                                                                { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                                                { name: 'operationid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
                                                              ]
                                                            }]
                                                          }
                                                        },
                                                        {
                                                          'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                                        },
                                                      ]
                                                    }
                                                  ],
                                                  'formDialog': [
                                                  ],
                                                  'dataSet': [

                                                  ]
                                                },
                                                permissions: {
                                                  'viewId': 'parentTable',
                                                  'columns': [],
                                                  'toolbar': [],
                                                  'formDialog': [],
                                                  'windowDialog': []
                                                },
                                                dataList: []
                                              }
                                            ]
                                          },
                                          {
                                            id: 'actionGroup',
                                            title: '资源组',
                                            span: 16,
                                            size: {
                                              nzXs: 24,
                                              nzSm: 24,
                                              nzMd: 24,
                                              nzLg: 16,
                                              ngXl: 16
                                            },
                                            rows: [
                                              {
                                                row: {
                                                  cols: [
                                                    {
                                                      id: 'actionname',
                                                      title: '资源',
                                                      span: 24,
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
                                                            'viewId': 'wfAjaxconfig_Table',
                                                            'component': 'bsnTable',
                                                            'keyId': 'Id',
                                                            'showCheckBox': true,
                                                            'pagination': true, // 是否分页
                                                            'showTotal': true, // 是否显示总数据量
                                                            'pageSize': 5, // 默pageSizeOptions认每页数据条数
                                                            '': [5, 10, 20, 30, 40, 50],
                                                            'ajaxConfig': {
                                                              'url': 'common/WfAjaxconfig',
                                                              'ajaxType': 'get',
                                                              'params': [
                                                                {
                                                                  name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
                                                                },
                                                                {
                                                                  name: 'operationroupid', type: 'tempValue', valueName: '_parentId', value: ''
                                                                }
                                                              ]
                                                            },
                                                            'componentType': {
                                                              'parent': true,
                                                              'child': true,
                                                              'own': true
                                                            },
                                                            'relations': [{
                                                              'relationViewId': 'OperationGroup_Table',
                                                              'cascadeMode': 'REFRESH_AS_CHILD',
                                                              'params': [
                                                                { pid: 'Id', cid: '_parentId' }
                                                              ],
                                                              'relationReceiveContent': []
                                                            }],
                                                            columns: [
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
                                                                title: '资源名称', field: 'resourcename', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'input',
                                                                  field: 'resourcename',
                                                                  options: {
                                                                    'type': 'input',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'text',
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '类型', field: 'ajaxtype', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'select',
                                                                  field: 'ajaxtype',
                                                                  options: {
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'submit',
                                                                    'name': 'ajaxtype',
                                                                    'label': 'ajaxtype',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '-请选择-',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'clear': true,
                                                                    'width': '130px',
                                                                    'options': [
                                                                      {
                                                                        'label': 'get',
                                                                        'value': 'get',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': 'post',
                                                                        'value': 'post',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': 'put',
                                                                        'value': 'put',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': 'delete',
                                                                        'value': 'delete',
                                                                        'disabled': false
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '是否依赖前置', field: 'isreturn', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'select',
                                                                  field: 'isreturn',
                                                                  options: {
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'submit',
                                                                    'name': 'ajaxtype',
                                                                    'label': 'ajaxtype',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '-请选择-',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'clear': true,
                                                                    'width': '130px',
                                                                    'options': [
                                                                      {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '否',
                                                                        'value': '0',
                                                                        'disabled': false
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '排序', field: 'sort', width: 80,
                                                                showFilter: false, showSort: true,
                                                                editor: {
                                                                  type: 'input',
                                                                  field: 'sort',
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
                                                              }



                                                            ],
                                                            toolbar: [
                                                              {
                                                                group: [
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
                                                                        'url': 'common/WfAjaxconfig',
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
                                                                        'url': 'common/WfAjaxconfig',
                                                                        'ajaxType': 'post',
                                                                        'params': [

                                                                          { name: 'operationroupid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                          { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                          { name: 'resourcename', type: 'componentValue', valueName: 'resourcename', value: '' },
                                                                          { name: 'ajaxtype', type: 'componentValue', valueName: 'ajaxtype', value: '' },
                                                                          { name: 'isreturn', type: 'componentValue', valueName: 'isreturn', value: '' },
                                                                          { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                          { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                                                                        'url': 'common/WfAjaxconfig',
                                                                        'ajaxType': 'put',
                                                                        'params': [
                                                                          { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                                                          { name: 'operationroupid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                          { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                          { name: 'resourcename', type: 'componentValue', valueName: 'resourcename', value: '' },
                                                                          { name: 'ajaxtype', type: 'componentValue', valueName: 'ajaxtype', value: '' },
                                                                          { name: 'isreturn', type: 'componentValue', valueName: 'isreturn', value: '' },
                                                                          { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                                                          { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
                                                                        ]
                                                                      }]
                                                                    }
                                                                  },
                                                                  {
                                                                    'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                                                  },
                                                                  {
                                                                    'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '提取参数', 'action': 'CANCEL',
                                                                  }
                                                                ]
                                                              }
                                                            ],
                                                            'formDialog': [
                                                            ],
                                                            'dataSet': [

                                                            ]
                                                          },
                                                          permissions: {
                                                            'viewId': 'wfAjaxconfig_Table',
                                                            'columns': [],
                                                            'toolbar': [],
                                                            'formDialog': [],
                                                            'windowDialog': []
                                                          },
                                                          dataList: []
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      id: 'area_Wfajaxparams',
                                                      title: '参数',
                                                      span: 24,
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
                                                            'viewId': 'Wfajaxparams_Table',
                                                            'component': 'bsnTable',
                                                            'keyId': 'Id',
                                                            'showCheckBox': true,
                                                            'pagination': true, // 是否分页
                                                            'showTotal': true, // 是否显示总数据量
                                                            'pageSize': 5, // 默pageSizeOptions认每页数据条数
                                                            '': [5, 10, 20, 30, 40, 50],
                                                            'ajaxConfig': {
                                                              'url': 'common/WfAjaxparameter',
                                                              'ajaxType': 'get',
                                                              'params': [
                                                                {
                                                                  name: '_sort', type: 'value', valueName: '', value: 'createDate desc'
                                                                },
                                                                {
                                                                  name: 'ajaxconfigid', type: 'tempValue', valueName: '_parentId', value: ''
                                                                }
                                                              ]
                                                            },
                                                            'componentType': {
                                                              'parent': true,
                                                              'child': true,
                                                              'own': true
                                                            },
                                                            'relations': [{
                                                              'relationViewId': 'wfAjaxconfig_Table',
                                                              'cascadeMode': 'REFRESH_AS_CHILD',
                                                              'params': [
                                                                { pid: 'Id', cid: '_parentId' }
                                                              ],
                                                              'relationReceiveContent': []
                                                            }],
                                                            columns: [
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
                                                                title: '参数数据类型', field: 'datatype', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'select',
                                                                  field: 'datatype',
                                                                  options: {
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'submit',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '-请选择-',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'clear': true,
                                                                    'width': '130px',
                                                                    'options': [
                                                                      {
                                                                        'label': '值类型',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '表类型',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '参数类型', field: 'type', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'select',
                                                                  field: 'type',
                                                                  options: {
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'submit',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '-请选择-',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'clear': true,
                                                                    'width': '130px',
                                                                    'options': [
                                                                      {
                                                                        'label': '输入参数',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '输出参数',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '参数类别', field: 'category', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'select',
                                                                  field: 'category',
                                                                  options: {
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'submit',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '-请选择-',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'clear': true,
                                                                    'width': '130px',
                                                                    'options': [
                                                                      {
                                                                        'label': '组件值',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '临时变量',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '常量',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                      },
                                                                      {
                                                                        'label': '前置条件取值',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '取值参数名称', field: 'valuename', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'input',
                                                                  field: 'valuename',
                                                                  options: {
                                                                    'type': 'input',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'text',
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '取值参数值', field: 'value', width: 80,
                                                                showFilter: false, showSort: false,
                                                                editor: {
                                                                  type: 'input',
                                                                  field: 'value',
                                                                  options: {
                                                                    'type': 'input',
                                                                    'labelSize': '6',
                                                                    'controlSize': '18',
                                                                    'inputType': 'text',
                                                                  }
                                                                }
                                                              },
                                                              {
                                                                title: '排序', field: 'sort', width: 60,
                                                                showFilter: false, showSort: true,
                                                                editor: {
                                                                  type: 'input',
                                                                  field: 'sort',
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
                                                              }



                                                            ],
                                                            'toolbar': [
                                                              {
                                                                group: [
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
                                                                        'url': 'common/WfAjaxparameter',
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
                                                                        'url': 'common/WfAjaxparameter',
                                                                        'ajaxType': 'post',
                                                                        'params': [
                                                                          { name: 'ajaxconfigid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                          { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                          { name: 'datatype', type: 'componentValue', valueName: 'datatype', value: '' },
                                                                          { name: 'type', type: 'componentValue', valueName: 'type', value: '' },
                                                                          { name: 'category', type: 'componentValue', valueName: 'category', value: '' },
                                                                          { name: 'valuename', type: 'componentValue', valueName: 'valuename', value: '' },
                                                                          { name: 'value', type: 'componentValue', valueName: 'value', value: '' },   
                                                                          { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },       
                                                                          { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
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
                                                                        'url': 'common/WfAjaxparameter',
                                                                        'ajaxType': 'put',
                                                                        'params': [
                                                                          { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                                                          { name: 'ajaxconfigid', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                          { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                                                          { name: 'datatype', type: 'componentValue', valueName: 'datatype', value: '' },
                                                                          { name: 'type', type: 'componentValue', valueName: 'type', value: '' },
                                                                          { name: 'category', type: 'componentValue', valueName: 'category', value: '' },
                                                                          { name: 'valuename', type: 'componentValue', valueName: 'valuename', value: '' },
                                                                          { name: 'value', type: 'componentValue', valueName: 'value', value: '' },   
                                                                          { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },         
                                                                          { name: 'remark', type: 'componentValue', valueName: 'remark', value: '1' }
                                                                        ]
                                                                      }]
                                                                    }
                                                                  },
                                                                  {
                                                                    'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                                                  },
                                                                  {
                                                                    'name': 'updateRow', 'class': 'editable-add-btn', 'text': '表类型参数明细配置', 'action': 'EDIT'
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
                                                            'formDialog': [
                                                            ],
                                                            'dataSet': [

                                                            ]
                                                          },
                                                          permissions: {
                                                            'viewId': 'parentTable',
                                                            'columns': [],
                                                            'toolbar': [],
                                                            'formDialog': [],
                                                            'windowDialog': []
                                                          },
                                                          dataList: []
                                                        }
                                                      ]
                                                    },
                                                  ]
                                                }
                                              }
                                            ]
                                          },


                                        ]
                                      }
                                    }
                                  ]
                                },
                                {
                                  title: '节点意见',
                                  icon: 'icon-list text-success',
                                  active: true,
                                  viewCfg: [
                                    {
                                      config: {

                                        'viewId': 'tree_tab_childTable11',
                                        'component': 'bsnTable',
                                        'keyId': 'Id',
                                        'showCheckBox': true,
                                        'pagination': true, // 是否分页
                                        'showTotal': true, // 是否显示总数据量
                                        'pageSize': 5, // 默认每页数据条数
                                        'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                                        'ajaxConfig': {
                                          'url': 'common/GetCase',
                                          'ajaxType': 'get',
                                          'params': [
                                            { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' }
                                          ]
                                        },
                                        'componentType': {
                                          'parent': false,
                                          'child': true,
                                          'own': false
                                        },
                                        'relations': [{
                                          'relationViewId': 'tree_and_tabs_tree',
                                          'cascadeMode': 'REFRESH_AS_CHILD',
                                          'params': [
                                            { pid: 'key', cid: '_parentId' }
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
                                            title: '名称', field: 'caseName', width: 80,
                                            showFilter: false, showSort: false,
                                            editor: {
                                              type: 'input',
                                              field: 'caseName',
                                              options: {
                                                'type': 'input',
                                                'labelSize': '6',
                                                'controlSize': '18',
                                                'inputType': 'text',
                                              }
                                            }
                                          },
                                          {
                                            title: '类别', field: 'TypeName', width: 80, hidden: false,
                                            showFilter: true, showSort: true,
                                            editor: {
                                              type: 'select',
                                              field: 'caseType',
                                              options: {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '18',
                                                'inputType': 'submit',
                                                'name': 'caseType',
                                                'label': 'caseType',
                                                'notFoundContent': '',
                                                'selectModel': false,
                                                'showSearch': true,
                                                'placeholder': '-请选择-',
                                                'disabled': false,
                                                'size': 'default',
                                                'clear': true,
                                                'width': '130px',
                                                'dataSet': 'getCaseName',
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
                                            title: '主名称', field: 'parentName', width: 80, hidden: false,
                                            editor: {
                                              type: 'input',
                                              field: '',
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
                                            title: '创建时间', field: 'createTime', width: 80, hidden: false,
                                            editor: {
                                              type: 'input',
                                              pipe: 'datetime',
                                              field: 'createTime',
                                              options: {
                                                'type': 'input',
                                                'labelSize': '6',
                                                'controlSize': '18',
                                                'inputType': 'datetime',
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
                                            title: '状态', field: 'enableText', width: 80, hidden: false,
                                            formatter: [
                                              { 'value': '启用', 'bgcolor': '', 'fontcolor': 'text-green', 'valueas': '启用' },
                                              { 'value': '禁用', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '禁用' }
                                            ],
                                            editor: {
                                              type: 'select',
                                              field: 'enabled',
                                              options: {
                                                'type': 'select',
                                                'labelSize': '6',
                                                'controlSize': '18',
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
                                        'toolbar': [
                                          {
                                            'group': [
                                              {
                                                'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                                              },
                                              {
                                                'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增', 'action': 'CREATE'
                                              },
                                              {
                                                'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'action': 'EDIT'
                                              },
                                            ]
                                          },
                                          {
                                            'group': [
                                              {
                                                'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'action': 'DELETE',
                                                'ajaxConfig': {
                                                  delete: [{
                                                    'actionName': 'delete',
                                                    'url': 'common/ShowCase',
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
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'post',
                                                    'params': [
                                                      { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                      { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                      // { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                      { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                      { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                      { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                                      { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                      { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
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
                                                      // { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                      { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                      { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                      // { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                                                      { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                      { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                    ]
                                                  }]
                                                }
                                              },
                                              {
                                                'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                              }
                                            ]
                                          }
                                        ],
                                        'dataSet': [
                                        ]
                                      },
                                      permissions: {
                                        'viewId': 'tree_and_tabs_table',
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
                            },
                            dataList: []

                          }
                        ]
                      },
                      {
                        title: '节点线信息',
                        icon: 'icon-list text-green-light',
                        active: false,
                        viewCfg: [
                          {
                            config: {

                              'viewId': 'wf_node_line_Table',
                              'component': 'bsnTable',
                              'keyId': 'Id',
                              'showCheckBox': true,
                              'pagination': true, // 是否分页
                              'showTotal': true, // 是否显示总数据量
                              'pageSize': 5, // 默认每页数据条数
                              'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                              'ajaxConfig': {
                                'url': 'common/WfLine',
                                'ajaxType': 'get',
                                'params': [
                                  { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                                ]
                              },
                              'componentType': {
                                'parent': false,
                                'child': true,
                                'own': false
                              },
                              'relations': [{
                                'relationViewId': 'wf_Version_Table',
                                'cascadeMode': 'REFRESH_AS_CHILD',
                                'params': [
                                  { pid: 'Id', cid: '_parentId' }
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
                                  title: '来源节点', field: 'fromnode', width: 80,
                                  showFilter: false, showSort: false,
                                  editor: {
                                    type: 'input',
                                    field: 'fromnode',
                                    options: {
                                      'type': 'select',
                                      'labelSize': '6',
                                      'controlSize': '18',
                                      'inputType': 'submit',
                                      'labelName': 'name',
                                      'valueName': 'Id',
                                      'notFoundContent': '',
                                      'selectModel': false,
                                      'showSearch': true,
                                      'placeholder': '-请选择-',
                                      'disabled': false,
                                      'size': 'default',
                                      'clear': true,
                                      'width': '130px',
                                      'options': [

                                      ],
                                      'ajaxConfig': {
                                        'url': 'common/WfNodes',
                                        'ajaxType': 'get',
                                        'params': [
                                          { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                                        ]
                                      },
                                    }
                                  }
                                },
                                {
                                  title: '指向节点', field: 'tofrom', width: 80,
                                  showFilter: false, showSort: false,
                                  editor: {
                                    type: 'select',
                                    field: 'tofrom',
                                    options: {
                                      'type': 'select',
                                      'labelSize': '6',
                                      'controlSize': '18',
                                      'inputType': 'submit',
                                      'labelName': 'name',
                                      'valueName': 'Id',
                                      'notFoundContent': '',
                                      'selectModel': false,
                                      'showSearch': true,
                                      'placeholder': '-请选择-',
                                      'disabled': false,
                                      'size': 'default',
                                      'clear': true,
                                      'width': '130px',
                                      'options': [

                                      ],
                                      'ajaxConfig': {
                                        'url': 'common/WfNodes',
                                        'ajaxType': 'get',
                                        'params': [
                                          { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                                        ]
                                      },
                                    }
                                  }
                                },
                                {
                                  title: '前置条件', field: 'wherestr', width: 80,
                                  showFilter: false, showSort: false,
                                  editor: {
                                    type: 'input',
                                    field: 'wherestr',
                                    options: {
                                      'type': 'input',
                                      'labelSize': '6',
                                      'controlSize': '18',
                                      'inputType': 'text',
                                    }
                                  }
                                },
                                {
                                  title: '前置策略', field: 'wheretactics', width: 80,
                                  showFilter: false, showSort: false,
                                  editor: {
                                    type: 'input',
                                    field: 'wheretactics',
                                    options: {
                                      'type': 'input',
                                      'labelSize': '6',
                                      'controlSize': '18',
                                      'inputType': 'text',
                                    }
                                  }
                                },
                                {
                                  title: '状态标识', field: 'wherestate', width: 80,
                                  showFilter: false, showSort: false,
                                  editor: {
                                    type: 'input',
                                    field: 'wherestate',
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
                                  'group': [
                                    {
                                      'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                                    },
                                    {
                                      'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增', 'action': 'CREATE'
                                    },
                                    {
                                      'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'action': 'EDIT'
                                    },
                                  ]
                                },
                                {
                                  'group': [
                                    {
                                      'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'action': 'DELETE',
                                      'ajaxConfig': {
                                        delete: [{
                                          'actionName': 'delete',
                                          'url': 'common/WfLine',
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
                                          'url': 'common/WfLine',
                                          'ajaxType': 'post',
                                          'params': [
                                            { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                            { name: 'fromnode', type: 'componentValue', valueName: 'fromnode', value: '' },
                                            { name: 'tofrom', type: 'componentValue', valueName: 'tofrom', value: '' },
                                            { name: 'wherestr', type: 'componentValue', valueName: 'wherestr', value: '' },
                                            { name: 'wheretactics', type: 'componentValue', valueName: 'wheretactics', value: '' },
                                            { name: 'wherestate', type: 'componentValue', valueName: 'wherestate', value: '' }


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
                                          'url': 'common/WfLine',
                                          'ajaxType': 'put',
                                          'params': [
                                            { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                            { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' },
                                            { name: 'fromnode', type: 'componentValue', valueName: 'fromnode', value: '' },
                                            { name: 'tofrom', type: 'componentValue', valueName: 'tofrom', value: '' },
                                            { name: 'wherestr', type: 'componentValue', valueName: 'wherestr', value: '' },
                                            { name: 'wheretactics', type: 'componentValue', valueName: 'wheretactics', value: '' },
                                            { name: 'wherestate', type: 'componentValue', valueName: 'wherestate', value: '' }

                                          ]
                                        }]
                                      }
                                    },
                                    {
                                      'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                    }
                                  ]
                                }
                              ],
                              'dataSet': [

                              ]
                            },
                            permissions: {
                              'viewId': 'wf_node_line_Table',
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


            }
          ]
        }
      }
    ]
  };
  constructor(private http: _HttpClient) { }

  ngOnInit() {
  }

}

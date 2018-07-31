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
                    'viewId': 'childTable',
                    'component': 'bsnTable',
                    'keyId': 'Id',
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
                      'parent': false,
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
                    'viewId': 'childTable',
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
  constructor(private http: _HttpClient) { }

  ngOnInit() {
  }

}

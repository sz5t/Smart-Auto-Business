import { APIResource } from './../../../core/utility/api-resource';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzDropdownContextComponent, NzDropdownService, NzMenuItemDirective } from 'ng-zorro-antd';
import { RelativeService, RelativeResolver } from '@core/relative-Service/relative-service';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
  selector: 'app-operation-setting',
  templateUrl: './operation-setting.component.html',
})
export class OperationSettingComponent extends CnComponentBase implements OnInit, OnDestroy {
  _funcOptions = [];
  _funcValue;
  _layoutValue;
  _selectedModuleText;
  // 布局列表数据
  _layoutList = [];
  _editorConfig = {
    rows: [
      {
        row: {
          cols: [
            {
              span: 24,
              size: {
                nzXs: 24,
                nzSm: 24,
                nzMd: 24,
                nzLg: 24,
                ngXl: 24
              },
              tabs: [
                {
                  title: '基本属性',
                  icon: 'anticon anticon-edit',
                  active: true,
                  viewCfg: [
                    {
                      'viewId': 'opt_base',
                      'component': 'form_view',
                      'config': {
                        'viewId': 'opt_base',
                        'ajaxConfig': {
                          'url': 'AppModuleConfig',
                          'ajaxType': 'get',
                          'params': []
                        },
                        'componentType': {
                          'parent': false,
                          'child': false,
                          'own': true
                        },
                        'forms':
                          [
                            {
                              'type': 'input',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'text',
                              'name': 'Name',
                              'label': '名称',
                              'placeholder': '',
                              'disabled': false,
                              'readonly': false,
                              'size': 'default'
                            },
                            {
                              'type': 'input',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'text',
                              'name': 'operationName',
                              'label': '操作名称',
                              'placeholder': '',
                              'disabled': false,
                              'readonly': false,
                              'size': 'default'
                            },
                            {
                              'type': 'input',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'text',
                              'name': 'operationIcon',
                              'label': '操作图标',
                              'placeholder': '',
                              'disabled': false,
                              'readonly': false,
                              'size': 'default'
                            },
                            {
                              'type': 'select',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'submit',
                              'name': 'operationType',
                              'label': '操作类型',
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
                              'options': [
                                {
                                  'label': '无',
                                  'value': 'none'
                                },
                                {
                                  'label': '刷新数据',
                                  'value': 'refresh'
                                },
                                {
                                  'label': '执行SQL',
                                  'value': 'exec_sql'
                                },
                                {
                                  'label': '执行SQL后刷新',
                                  'value': 'after_sql'
                                },
                                {
                                  'label': '弹出确认框',
                                  'value': 'confirm'
                                },
                                {
                                  'label': '弹出窗体',
                                  'value': 'dialog'
                                },
                                {
                                  'label': '弹出表单',
                                  'value': 'form'
                                },
                                {
                                  'label': '执行SQL后刷新主界面',
                                  'value': 'refresh_parent'
                                }
                              ]
                            },
                            {
                              'type': 'select',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'submit',
                              'name': 'operationActionType',
                              'label': '动作类型',
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
                              'options': [
                                {
                                  'label': '操作',
                                  'value': 'operation'
                                },
                                {
                                  'label': '动作',
                                  'value': 'action'
                                }
                              ]
                            },
                            {
                              'type': 'select',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'submit',
                              'name': 'operationStatus',
                              'label': '操作后状态',
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
                              'options': [
                                {
                                  'label': '浏览状态',
                                  'value': 'normal'
                                },
                                {
                                  'label': '新增状态',
                                  'value': 'new'
                                },
                                {
                                  'label': '编辑状态',
                                  'value': 'edit'
                                }
                              ]
                            },
                            {
                              'type': 'select',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'submit',
                              'name': 'operationNullData',
                              'label': '空数据状态',
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
                              'options': [
                                {
                                  'label': '启用',
                                  'value': true
                                },
                                {
                                  'label': '禁用',
                                  'value': false
                                }
                              ]
                            },
                            {
                              'type': 'select',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'submit',
                              'name': 'operationDefaultStatus',
                              'label': '默认状态',
                              'notFoundContent': '',
                              'selectModel': false,
                              'showSearch': true,
                              'placeholder': '--请选择--',
                              'disabled': false,
                              'size': 'default',
                              'options': [
                                {
                                  'label': '启用',
                                  'value': true
                                },
                                {
                                  'label': '禁用',
                                  'value': false
                                }
                              ]
                            },
                            {
                              'type': 'input',
                              'labelSize': '6',
                              'controlSize': '10',
                              'inputType': 'text',
                              'name': 'operationOrder',
                              'label': '顺序',
                              'placeholder': '',
                              'disabled': false,
                              'readonly': false,
                              'size': 'default'
                            },

                          ],
                        'toolbar':
                          [
                            {
                              'name': 'saveForm', 'class': 'editable-add-btn', 'text': '保存'
                            },
                            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                          ],

                        'dataList': [],
                        'relations': [
                          {
                            relationViewId: 'viewId_testList',
                            relationSendContent: [],
                            relationReceiveContent: []
                          }
                        ]
                      },
                      'dataList': []
                    }
                  ]
                },
                {
                  title: 'SQL 语句',
                  icon: 'anticon anticon-info-circle-o',
                  active: false,
                  viewCfg: [
                    {
                      'viewId': 'operation_sqlColumns',
                      'component': 'bsnDataTable',
                      'config': {
                        'viewId': 'operation_sqlColumns',
                        'keyId': 'key',
                        'nzIsPagination': false, // 是否分页
                        'nzShowTotal': true, // 是否显示总数据量
                        'pageSize': 5, // 默认每页数据条数
                        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                        'nzLoading': false, // 是否显示加载中
                        'nzBordered': false, // 是否显示边框
                        'ajaxConfig': {
                          'url': 'AppConfigPack',
                          'ajaxType': 'get',
                          'params': [
                            { name: 'ParentId', type: 'tempValue', valueName: '_Id', value: '' },
                            { name: 'TagB', type: 'tempValue', valueName: '_optType', value: '' }
                          ]
                        },
                        'componentType': {
                          'parent': true,
                          'child': false,
                          'own': true
                        },
                        'relation': [{
                          'relationViewId': 'operation_sqlColumns',
                          'relationSendContent': [
                            {
                              name: 'selectRow',
                              sender: 'operation_sqlColumns',
                              aop: 'after',
                              receiver: 'operation_sqlParams',
                              relationData: {
                                name: 'refreshAsChild',
                                params: [
                                  { pid: 'key', cid: '_parentId' },
                                  { pid: 'ScriptText', cid: '_scriptText' },
                                ]
                              },
                            }
                          ],
                          'relationReceiveContent': []
                        }],
                        'columns': [
                          {
                            title: '主键', field: 'key', width: 'auto', hidden: true
                          },
                          {
                            title: 'SQL 语句', field: 'ScriptText', width: 80,
                            editor: {
                              type: 'input',
                              field: 'ScriptText',
                              options: {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'width': '120px',
                                'inputType': 'text',
                                'labelName': 'Name',
                                'valueName': 'Id',
                                'ajaxConfig': {
                                  url: {
                                    parent: 'AppModuleConfig',
                                    child: 'DbCommandConfig',
                                    params: [
                                      {
                                        type: 'tempValue', valueName: '_moduleId'
                                      }
                                    ]
                                  },
                                  ajaxType: 'get',
                                  params: []
                                }
                              }
                            }
                          },
                          {
                            title: '执行方式', field: 'sqlExecType', width: 80, hidden: false,
                            editor: {
                              type: 'select',
                              field: 'sqlExecType',
                              options: {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'submit',
                                'name': 'sqlExecType',
                                'label': '',
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
                                    'label': '执行一次',
                                    'value': '1',
                                    'disabled': false
                                  },
                                  {
                                    'label': '执行两次',
                                    'value': '2',
                                    'disabled': false
                                  }
                                ]
                              }
                            }
                          },
                          {
                            title: '执行状态', field: 'sqlExecStatus', width: 80, hidden: false,
                            editor: {
                              type: 'select',
                              field: 'sqlExecStatus',
                              options: {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'submit',
                                'name': 'sex',
                                'label': '',
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
                                    'label': '新增',
                                    'value': '1',
                                    'disabled': false
                                  },
                                  {
                                    'label': '编辑',
                                    'value': '2',
                                    'disabled': false
                                  }
                                ]
                              }
                            }
                          },
                          {
                            title: '', field: 'Id', width: 80, hidden: true,
                          }
                        ],
                        'toolbar': [
                          { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                          { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                          { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                          { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                          {
                            'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
                            'ajaxConfig': {
                              add: {
                                'url': 'AppConfigPack',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'ParentId', type: 'tempValue', valueName: '_Id', value: '' },
                                  /*                   { name: 'Name', type: 'tempValue', valueName: '取值参数名称', value: 'liutest11' },*/
                                  { name: 'TagA', type: 'GUID', valueName: '取值参数名称', value: 'GUID' },
                                  { name: 'TagB', type: 'value', valueName: '取值参数名称', value: 'opt_sqlList' },
                                  { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }
                                ]
                              },
                              update: {
                                'url': 'AppConfigPack',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                  { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                                ]
                              }
                            },
                          },
                          { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                        ]
                      },
                      'dataList': []
                    },
                    {
                      'viewId': 'operation_sqlParams',
                      'component': 'bsnDataTable',
                      'config': {
                        'viewId': 'operation_sqlParams',
                        'keyId': 'key',
                        'nzIsPagination': false, // 是否分页
                        'nzShowTotal': true, // 是否显示总数据量
                        'pageSize': 5, // 默认每页数据条数
                        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                        'nzLoading': false, // 是否显示加载中
                        'nzBordered': false, // 是否显示边框
                        'ajaxConfig': {
                          'url': 'AppConfigPack',
                          'ajaxType': 'get',
                          'params': [
                            { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                            { name: 'TagB', type: 'value', valueName: '_optType', value: 'opt_sqlParams' }
                          ]
                        },
                        'componentType': {
                          'parent': false,
                          'child': true,
                          'own': true
                        },
                        'relation': [{
                          'relationViewId': 'operation_sqlParams',
                          'relationSendContent': [],
                          'relationReceiveContent': []
                        }],
                        'columns': [
                          {
                            title: '主键', field: 'key', width: 80, hidden: true
                          },
                          {
                            title: '参数编号', field: 'paramId', width: 80
                          },
                          {
                            title: '参数名称', field: 'ParameterName', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'ParameterName',
                              options: {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'width': '120px',
                                'inputType': 'text',
                                'labelName': 'Id',
                                'valueName': 'ParameterList',
                                'valueType': 'list',
                                'ajaxConfig': {
                                  url: 'DbCommandConfig',
                                  ajaxType: 'get',
                                  params: [
                                    {
                                      name: 'Id', type: 'tempValue', valueName: '_scriptText'
                                    }
                                  ]
                                }
                              }
                            }
                          },
                          {
                            title: '参数替换字符', field: 'paramReplaceStr', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'paramReplaceStr',
                              options: {
                                'type': 'input',
                                'controlSize': '10',
                                'inputType': 'text',
                              }
                            }
                          },
                          {
                            title: '取值方式', field: 'paramGetValueType', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'paramGetValueType',
                              options: {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                              }
                            }
                          },
                          {
                            title: '为空取值', field: 'paramNullValue', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'paramNullValue',
                              options: {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                              }
                            }
                          },
                          {
                            title: '参数类型', field: 'paramDataType', width: 80, hidden: false,
                            editor: {
                              type: 'select',
                              field: 'paramDataType',
                              options: {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'submit',
                                'name': 'paramDataType',
                                'label': '',
                                'notFoundContent': '',
                                'selectModel': false,
                                'showSearch': true,
                                'placeholder': '-请选择-',
                                'disabled': false,
                                'size': 'default',
                                'clear': true,
                                'width': '60px',
                                'options': [
                                  {
                                    'label': '整型',
                                    'value': '1',
                                    'disabled': false
                                  },
                                  {
                                    'label': '字符',
                                    'value': '2',
                                    'disabled': false
                                  },
                                  {
                                    'label': '日期',
                                    'value': '2',
                                    'disabled': false
                                  },
                                  {
                                    'label': '浮点',
                                    'value': '2',
                                    'disabled': false
                                  }
                                ]
                              }
                            }
                          },
                          {
                            title: '系统参数', field: 'paramSystemParam', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'paramSystemParam',
                              options: {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                              }
                            }
                          },
                          {
                            title: '取值或赋值字段', field: 'paramValueField', width: 80, hidden: false,
                            editor: {
                              type: 'input',
                              field: 'paramValueField',
                              options: {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                              }
                            }
                          },
                        ],
                        'toolbar': [
                          { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                          { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                          { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                          { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                          {
                            'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
                            'ajaxConfig': {
                              add: {
                                'url': 'AppConfigPack',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'ParentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                  /*                   { name: 'Name', type: 'tempValue', valueName: '取值参数名称', value: 'liutest11' },*/
                                  { name: 'TagA', type: 'GUID', valueName: '取值参数名称', value: 'GUID' },
                                  { name: 'TagB', type: 'value', valueName: '取值参数名称', value: 'opt_sqlParams' },
                                  { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                                ]
                              },
                              update: {
                                'url': 'AppConfigPack',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                  { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                                ]
                              }
                            }
                          },
                          { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                        ]
                      },
                      'dataList': []
                    }
                  ]
                },
                // {
                //   title: '表单设置',
                //   icon: 'anticon anticon-book',
                //   active: false,
                //   viewCfg: [
                //     {
                //       viewId: 'opt_base',
                //       tabs: [
                //         {
                //           'id': 'tab3_1',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': '表单布局',
                //           'active': 'active in',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_formLayout',
                //               'component': 'form_view',
                //               'config': [
                //                 {
                //                   'type': 'select',
                //                   'placeholder': '',
                //                   'options': [
                //                     {
                //                       'label': '表格',
                //                       'value': 'table'
                //                     },
                //                     {
                //                       'label': '流式',
                //                       'value': 'flow'
                //                     }
                //                   ],
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'name': 'formLayoutType',
                //                   'value': true,
                //                   'label': '布局方式',
                //                   'inputClass': 'input-medium'
                //                 },
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'formLayoutColumn',
                //                   'label': '列数',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 },
                //               ]
                //             }
                //           ]
                //         },
                //         {
                //           'id': 'tab3_2',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': 'SQL 语句',
                //           'active': '',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_formSql',
                //               'component': 'codeEditor',
                //               'config': [
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'viewId_formSql',
                //                   'label': 'SQL 内容',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 },
                //               ]
                //             }
                //           ]
                //         },
                //         {
                //           'id': 'tab3_3',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': 'SQL 参数',
                //           'active': '',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_formSqlParam',
                //               'component': 'bsnDataTable',
                //               'config': {
                //                 'keyId': 'key',
                //                 'nzIsPagination': false, // 是否分页
                //                 'nzShowTotal': true,// 是否显示总数据量
                //                 'pageSize': 5, //默认每页数据条数
                //                 'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                //                 'nzLoading': false, // 是否显示加载中
                //                 'nzBordered': false,// 是否显示边框
                //                 'columns': [
                //                   {
                //                     title: '主键', field: 'key', width: 80, hidden: true
                //                   },
                //                   {
                //                     title: '参数编号', field: 'paramId', width: 80
                //                   },
                //                   {
                //                     title: '参数名称', field: 'paramName', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramName',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '参数替换字符', field: 'paramReplaceStr', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramReplaceStr',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '取值方式', field: 'paramGetValueType', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramGetValueType',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '为空取值', field: 'paramNullValue', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramNullValue',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '参数类型', field: 'paramDataType', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'age',
                //                       editor: {
                //                         type: 'select',
                //                         field: 'paramDataType',
                //                         options: {
                //                           'type': 'select',
                //                           'labelSize': '6',
                //                           'controlSize': '10',
                //                           'inputType': 'submit',
                //                           'name': 'paramDataType',
                //                           'label': '',
                //                           'notFoundContent': '',
                //                           'selectModel': false,
                //                           'showSearch': true,
                //                           'placeholder': '-请选择-',
                //                           'disabled': false,
                //                           'size': 'default',
                //                           'clear': true,
                //                           'width': '60px',
                //                           'options': [
                //                             {
                //                               'label': '整型',
                //                               'value': '1',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '字符',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '日期',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '浮点',
                //                               'value': '2',
                //                               'disabled': false
                //                             }
                //                           ]
                //                         }
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '系统参数', field: 'paramSystemParam', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramSystemParam',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '取值或赋值字段', field: 'paramValueField', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramValueField',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                 ],
                //                 'toolbar': [
                //                   { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                //                   { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                //                   { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                //                   { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                //                   { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                //                   { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                //                 ]
                //               }
                //             }
                //           ]
                //         },
                //         {
                //           'id': 'tab3_4',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': '表单编辑',
                //           'active': '',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_formConfig',
                //               'component': 'bsnDataTable',
                //               'config': {
                //                 'keyId': 'key',
                //                 'nzIsPagination': false, // 是否分页
                //                 'nzShowTotal': true,// 是否显示总数据量
                //                 'pageSize': 5, //默认每页数据条数
                //                 'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                //                 'nzLoading': false, // 是否显示加载中
                //                 'nzBordered': false,// 是否显示边框
                //                 'columns': [
                //                   {
                //                     title: '主键', field: 'key', width: 80, hidden: true
                //                   },
                //                   {
                //                     title: '输入方式', field: 'formInputType', width: 80
                //                   },
                //                   {
                //                     title: '名称', field: 'formName', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formName',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '文本类型', field: 'formTextType', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formTextType',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '标签', field: 'formLabel', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formLabel',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '提示信息', field: 'formHelpText', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formHelpText',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '默认内容', field: 'formPlaceholder', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formPlaceholder',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '图标', field: 'formIcon', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'formIcon',
                //                       editor: {
                //                         type: 'select',
                //                         field: 'formIcon',
                //                         options: {
                //                           'type': 'select',
                //                           'labelSize': '6',
                //                           'controlSize': '10',
                //                           'inputType': 'submit',
                //                           'name': 'paramDataType',
                //                           'label': '',
                //                           'notFoundContent': '',
                //                           'selectModel': false,
                //                           'showSearch': true,
                //                           'placeholder': '-请选择-',
                //                           'disabled': false,
                //                           'size': 'default',
                //                           'clear': true,
                //                           'width': '60px',
                //                           'options': [
                //                             {
                //                               'label': '整型',
                //                               'value': '1',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '字符',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '日期',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '浮点',
                //                               'value': '2',
                //                               'disabled': false
                //                             }
                //                           ]
                //                         }
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '数据来源', field: 'formDataSource', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramValueField',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                 ],
                //                 'toolbar': [
                //                   { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                //                   { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                //                   { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                //                   { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                //                   { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                //                   { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                //                 ]
                //               }
                //             },
                //           ]
                //         }
                //       ]
                //     }
                //   ]
                // },
                // {
                //   title: '确认操作设置',
                //   icon: 'anticon anticon-appstore',
                //   active: false,
                //   viewCfg: [
                //     {
                //       'tabs': [
                //         {
                //           'id': 'tab4_1',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': '操作内容',
                //           'active': 'active in',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_confirm',
                //               'component': 'form_view',
                //               'config': [
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'dialogTitle',
                //                   'label': '消息标题',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 },
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'dialogContent',
                //                   'label': '消息内容',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 },
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'dialogType',
                //                   'label': '消息类型',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 }
                //               ]
                //             }
                //           ]
                //         },
                //         {
                //           'id': 'tab4_2',
                //           'icon': 'fa fa-text',
                //           'color': 'text-warning',
                //           'title': 'SQL',
                //           'active': '',
                //           'viewCfg': [
                //             {
                //               'viewId': 'viewId_dialogSql',
                //               'component': 'form_view',
                //               'config': [
                //                 {
                //                   'type': 'input',
                //                   'labelSize': '6',
                //                   'controlSize': '10',
                //                   'inputType': 'text',
                //                   'name': 'viewId_formSql',
                //                   'label': 'SQL 内容',
                //                   'placeholder': '',
                //                   'disabled': false,
                //                   'readonly': false,
                //                   'size': 'default'
                //                 },
                //               ],
                //               'dataList': []
                //             },
                //             {
                //               'viewId': 'operation_dialogParams',
                //               'component': 'bsnDataTable',
                //               'config': {
                //                 'keyId': 'key',
                //                 'nzIsPagination': false, // 是否分页
                //                 'nzShowTotal': true,// 是否显示总数据量
                //                 'pageSize': 5, //默认每页数据条数
                //                 'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                //                 'nzLoading': false, // 是否显示加载中
                //                 'nzBordered': false,// 是否显示边框
                //                 'columns': [
                //                   {
                //                     title: '主键', field: 'key', width: 80, hidden: true
                //                   },
                //                   {
                //                     title: '参数编号', field: 'paramId', width: 80
                //                   },
                //                   {
                //                     title: '参数名称', field: 'paramName', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramName',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '参数替换字符', field: 'paramReplaceStr', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramReplaceStr',
                //                       options: {
                //                         'type': 'input',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '取值方式', field: 'paramGetValueType', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramGetValueType',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '为空取值', field: 'paramNullValue', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramNullValue',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '参数类型', field: 'paramDataType', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'age',
                //                       editor: {
                //                         type: 'select',
                //                         field: 'paramDataType',
                //                         options: {
                //                           'type': 'select',
                //                           'labelSize': '6',
                //                           'controlSize': '10',
                //                           'inputType': 'submit',
                //                           'name': 'paramDataType',
                //                           'label': '',
                //                           'notFoundContent': '',
                //                           'selectModel': false,
                //                           'showSearch': true,
                //                           'placeholder': '-请选择-',
                //                           'disabled': false,
                //                           'size': 'default',
                //                           'clear': true,
                //                           'width': '60px',
                //                           'options': [
                //                             {
                //                               'label': '整型',
                //                               'value': '1',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '字符',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '日期',
                //                               'value': '2',
                //                               'disabled': false
                //                             },
                //                             {
                //                               'label': '浮点',
                //                               'value': '2',
                //                               'disabled': false
                //                             }
                //                           ]
                //                         }
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '系统参数', field: 'paramSystemParam', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramSystemParam',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                   {
                //                     title: '取值或赋值字段', field: 'paramValueField', width: 80, hidden: false,
                //                     editor: {
                //                       type: 'input',
                //                       field: 'paramValueField',
                //                       options: {
                //                         'type': 'input',
                //                         'labelSize': '6',
                //                         'controlSize': '10',
                //                         'inputType': 'text',
                //                       }
                //                     }
                //                   },
                //                 ],
                //                 'toolbar': [
                //                   { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                //                   { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                //                   { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                //                   { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                //                   { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                //                   { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                //                 ]
                //               },
                //               'dataList': []
                //             }
                //           ]
                //         }
                //       ]
                //     }
                //   ]
                // },
                // {
                //   title: '弹出窗体设置',
                //   icon: 'anticon anticon-file',
                //   active: false,
                //   viewCfg: []
                // },
                // /* {
                //    title: '后置动作',
                //    icon: 'anticon anticon-retweet',
                //    active: false,
                //    viewCfg: [
                //      {
                //        'viewId': 'viewId_action',
                //        'relation': [{
                //          'relationViewId': 'viewId_actionParam',
                //          'relationSendContent': [
                //            {
                //              name: 'selectRow', sender: 'viewId_action', receiver: 'viewId_actionParam',
                //              relationData: { name: 'refreshAsChild' }, data: [{ pid: 'id', cid: 'parentId' }]
                //            }
                //          ]
                //        }],
                //        'component': 'form_view',
                //        'formHeader': {
                //          'header': [
                //            { title: '编号', width: 'auto' },
                //            { title: '标识值', width: 'auto' },
                //            { title: '动作 / 操作', width: 'auto' },
                //          ],
                //          'deleteButton': {
                //            'show': true
                //          },
                //          'addButton': {},
                //          'keyId': 'id'
                //        },
                //        'formContents': [
                //          {
                //            'type': 'input',
                //            'inputType': 'text',
                //            'name': 'id',
                //            'disabled': 'disabled'
                //          },
                //          {
                //            'type': 'input',
                //            'inputType': 'text',
                //            'name': 'actionValue'
                //          },
                //          {
                //            'type': 'select',
                //            'placeholder': '--请选择--',
                //            'options': [
                //              {
                //                'text': '动作1',
                //                'value': '1'
                //              },
                //              {
                //                'text': '动作2',
                //                'value': '2'
                //              },
                //              {
                //                'text': '动作3',
                //                'value': '3'
                //              }
                //            ],
                //            'name': 'action',
                //            'value': ''
                //          }
                //        ]
                //      },
                //      {
                //        'viewId': 'viewId_actionParam',
                //        'relation': [{
                //          'relationViewId': 'viewId_action',
                //          'relationType': 'grid_grid_child',
                //          'relationReceiveContent': []
                //        }],
                //        'component': 'form_view',
                //        'formHeader': {
                //          'header': [

                //            { title: '当前参数', width: 'auto' },
                //            { title: '动作 / 操作参数', width: 'auto' },
                //            { title: '所属动作/操作编号', width: '130px' }
                //          ],
                //          'deleteButton': {
                //            'show': true
                //          },
                //          'addButton': {}
                //        },
                //        'formContents': [
                //          {
                //            'type': 'select',
                //            'placeholder': '--请选择--',
                //            'options': [
                //              {
                //                'text': '参数1',
                //                'value': '1'
                //              },
                //              {
                //                'text': '参数2',
                //                'value': '2'
                //              },
                //              {
                //                'text': '参数3',
                //                'value': '3'
                //              }
                //            ],
                //            'name': 'action',
                //            'value': ''
                //          },
                //          {
                //            'type': 'select',
                //            'placeholder': '--请选择--',
                //            'options': [
                //              {
                //                'text': '参数1',
                //                'value': '1'
                //              },
                //              {
                //                'text': '参数2',
                //                'value': '2'
                //              },
                //              {
                //                'text': '参数3',
                //                'value': '3'
                //              }
                //            ],
                //            'name': 'action',
                //            'value': ''
                //          },
                //          {
                //            'type': 'input',
                //            'inputType': 'text',
                //            'name': 'parentId'
                //          }
                //        ]
                //      }
                //    ]
                //  },*/
                // {
                //   title: '设置预览',
                //   icon: 'anticon anticon-laptop',
                //   active: false,
                //   viewCfg: []
                // }
              ]
            }
          ]
        }
      },
    ]
  };

  tree_Config = {
    'viewId': 'view_operationTree',
    'asyncData': true, // 
    'expandAll': true, //  
    'checkable': false,  //    在节点之前添加一个复选框 false
    'showLine': false,  //   显示连接线 fal
    'columns': [ // 字段映射，映射成树结构所需
      { title: '主键', field: 'key', valueName: 'Id' },
      { title: '父节点', field: 'parentId', valueName: 'ParentId' },
      { title: '标题', field: 'title', valueName: 'Title' },
    ],
    'parent': [
      { name: 'ParentId', type: 'tempValue', valueName: '_moduleId', value: '' }
    ],
    'ajaxConfig': {
      'url': 'GetOperationTree',
      'ajaxType': 'get',
      'params': [
        { name: 'layoutId', type: 'tempValue', valueName: '_layoutId', value: '' }
      ]
    },
    'relations': [{
      'relationViewId': 'view_operationTree',
      'relationSendContent': [
        {
          'name': 'clickNode',
          'sender': 'view_operationTree',
          'aop': 'after',
          'receiver': 'operation_sqlColumns',
          'relationData': {
            'name': 'initParameter',
            'params': [
              { 'pid': 'key', 'cid': '_parentId' }
            ]
          },
        }
      ],
      'relationReceiveContent': []
    }]
  };
  nodes = [
    {
      key: '1',
      title: '组件设置根节点',
      type: 'root',
      data: 'ahhahah',
      hasChildren: true,
      children: [
        {
          key: '1.2',
          title: '布局区域1',
          type: 'layout',
          hasChildren: true,
          children: [
            {
              key: '1.21',
              title: '数据表格',
              value: 'bsn-datatable',
              type: 'component',
            }
          ]
        },
        {
          key: '1.3',
          title: '布局区域2',
          type: 'layout',
          hasChildren: true,
          children: [
            {
              key: '1.31',
              title: '树',
              value: 'bsn-tree',
              type: 'component',
            }
          ]
        }
      ]
    }
  ];
  isVisible = false;
  _currentNode;
  _operationName;
  _isConfirmLoading = false;
  _layoutNameValue;

  private dropdown: NzDropdownContextComponent;
  @ViewChild('addTemplate') addTemplate: TemplateRef<void>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<void>;

  private _relativeResolver;
  constructor(
    private _http: ApiService,
    private message: NzMessageService,
    private relativeMessage: RelativeService,
    private nzDropdownService: NzDropdownService
  ) {
    super();
  }

  async ngOnInit() {
    const params = { _select: 'Id,Name,ParentId' };
    const moduleData = await this.getModuleData(params);
    // 初始化模块列表，将数据加载到及联下拉列表当中
    this._funcOptions = this.arrayToTree(moduleData.Data, '');

    // this.SetTreeData();
    // this.setAsyncData();

    this._relativeResolver = new RelativeResolver();
    if (this.config.relations && this.config.relations.length > 0) {
      this._relativeResolver.reference = this;
      this._relativeResolver.relativeService = this.relativeMessage;
      this._relativeResolver.relations = this.config.relations;
      this._relativeResolver.resolverRelation();
    }
  }
  // region: func
  // 获取布局设置列表
  getLayoutConfigData(params) {
    return this._http.getProj(APIResource.LayoutSetting, params).toPromise();
  }

  // 获取模块信息
  async getModuleData(params) {
    return this._http.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  // 选择布局名称
  _changeLayoutName($event) {
    // 创建布局
    // this._layoutConfig = $event.metadata;
    const str = [];
    if ($event.metadata) {
      const receiver = {
        name: 'initParameters',
        receiver: 'view_operationTree',
        parent: {
          _layoutId: $event.id,
          _moduleId: this._funcValue[this._funcValue.length - 1]
        }
      };
      this.relativeMessage.sendMessage({ type: 'initParameters' }, receiver);
    }
  }

  private _listToTreeData(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        temp = this.listToTreeData(data, data[i].Id);
        if (temp.length > 0) {
          data[i]['children'] = temp;
        } else {
          data[i]['isLeaf'] = true;
        }
        result.push(data[i]);
      }
    }
    return result;
  }

  // 获取区域信息
  private async _getOperationTree(layoutId) {
    const params = {
      LayoutId: layoutId
    };
    return this._http.getProj(APIResource.GetOperationTree, params).toPromise();
  }

  // 获取组件
  private async  _getViewByBlock(blockId) {
    const params = {
      BlockId: blockId
    };
    return this._http.getProj(APIResource.ViewSetting, params).toPromise();
  }










  mouseAction(name: string, e: any): void {
    if (name === 'contextmenu') {
      this.createContextMenu(e);
    }
  }

  createContextMenu(e) {
    // console.log(this.addTemplate);
    this.dropdown = this.nzDropdownService.create(e.event, this.addTemplate);
  }

  /**
   * 生成结构树
   * @param data
   * @param component
   * @param pid
   * @returns {Array}
   */
  dataToArray(data?, component?, pid?) {
    let result = [];
    let temp;
    if (data.rows) {
      data.rows.forEach(rdata => {
        if (rdata.row.cols) {
          rdata.row.cols.forEach(cdata => {
            const obj = { 'Name': cdata.title, 'Id': cdata.id, 'ParentId': pid };
            if (cdata.rows) {
              temp = this.dataToArray(cdata, component, pid); // 递归调用行
            }
            if (temp) {
              if (temp.length > 0) {
                result = [...result, ...temp];
                // console.log(result);
              }
            }
            if (!cdata.rows) {
              obj['type'] = 'component';
              result.push(obj);
              const cobj = this.componentToArray(component, cdata.id, '');
              if (cobj) {
                result = [...result, ...cobj];
                // console.log(result);
              }
            }
          });
        }
      });
    }
    if (data.tabs) {
      data.tabs.forEach(tab => {
        const obj = { 'Name': tab.name, 'Id': tab.id, ParentId: pid, type: 'tab' };
        result.push(obj);
        const cobj = this.componentToArray([], tab.id, component);
        if (cobj) {
          result = [...result, ...cobj];
        }
      });
    }
    return result;
  }

  /**
   * 生成结构树-》组件简析
   * @param data
   * @param pid
   * @param component
   * @returns {Array}
   */
  componentToArray(data?, pid?, component?) {
    let objs = [];
    let temp;
    if (data && Array.isArray(data)) {
      const obj = {};

      if (component === 'tabs') {
        const index = data.findIndex(item => item.Name === pid);
        // 组件名称
        const comp = data[index].TagB.substring(data[index].TagB.lastIndexOf('.') + 1, data[index].TagB.length);
        obj['Id'] = data[index].Id;
        obj['Name'] = '标签页'; // data[index].Name;
        obj['ParentId'] = data[index].Name; // blockID
        obj['type'] = comp; // componet type
        objs.push(obj);
        if (component === 'tabs') {
          temp = this.dataToArray({ tabs: JSON.parse(data[index].Metadata) }, 'tab', data[index].Id); // 递归调用行
          if (temp) {
            objs = [...objs, ...temp];
          }
        }
      } else {
        const optObj = {
          Id: this.uuID(6),
          Name: '12',
          ParentId: pid,
          type: 'component'
        };
        objs.push(optObj);
      }
    }
    return objs;
  }



  async getOperationByBlock(blockId) {
    const params = {
      ParentId: blockId
    };
    return this._http.getProj(APIResource.AppConfigPack, params).toPromise();
  }

  // 改变模块选项
  _changeModuleValue($event?) {
    this._layoutList = [];
    // 选择功能模块，首先加载服务端配置列表
    // const params = new HttpParams().set('TagA', this._funcValue.join(','));
    if (this._funcValue.length > 0) {
      const params = {
        ParentId: this._funcValue[this._funcValue.length - 1],
        _select: 'Id,Name,Metadata'
      };
      this.getLayoutConfigData(params).then(serverLayoutData => {
        if (serverLayoutData.Status === 200 && serverLayoutData.Data.length > 0) {
          serverLayoutData.Data.forEach((data, index) => {
            const metadata = JSON.parse(data.Metadata);
            this._layoutList.push({ label: data.Name, value: { id: data.Id, metadata: metadata } });
          });
        } else {
          this._layoutList = [];
        }

      });
    }
  }

  _onSelectionChange(selectedOptions: any[]) {
    this._selectedModuleText = `【${selectedOptions.map(o => o.label).join(' / ')}】`;
  }

  arrayToTreeBylayout(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        const obj = {
          Name: data[i].Name,
          Id: data[i].Id,
          type: data[i].type ? data[i].type : ''
        };
        temp = this.arrayToTreeBylayout(data, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          // obj['isLeaf'] = true;
          obj['children'] = [];
        }
        result.push(obj);
      }
    }
    return result;
  }

  arrayToTree(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        const obj = { 'label': data[i].Name, 'value': data[i].Id };
        temp = this.arrayToTree(data, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          obj['isLeaf'] = true;
        }
        result.push(obj);
      }
    }
    return result;
  }

  // 点击树节
  onActivate(event: any) {
    // console.log('激活树节点', event);
    const receiver = {
      name: 'initParameters',
      receiver: 'operation_sqlColumns',
      parent: {
        _Id: event.node.key,
        _optType: 'opt_sqlList',
        _moduleId: this._funcValue[this._funcValue.length - 1]
      }
    };
    // console.log('选中行发消息事件', receiver);
    this.relativeMessage.sendMessage({ type: 'initParameters' }, receiver);

  }

  async handleOk(e) {
    this._isConfirmLoading = true;
    const body = {
      Name: this._operationName,
      ParentId: this._currentNode.id,
      TagA: this.uuID(10),
      TagB: `component.operation`
    };
    const newData = await this.saveNewNode(body);
    if (newData.Status === 200) {
      const newNodeData = {
        id: newData.Data.Id,
        name: newData.Data.Name,
        type: 'operation'
      };

      // 1、新增树节点
      this._currentNode.data['children'].push(newNodeData);
      this._currentNode.treeModel.update();
      this._isConfirmLoading = false;
      this.isVisible = false;
      this._currentNode.treeModel.focusDrillDown();
    } else {
      this._isConfirmLoading = false;
    }
  }

  async saveNewNode(body) {
    return this._http.postProj(APIResource.AppConfigPack, body).toPromise();
  }

  // 删除操作
  delOptConfirm = (node) => {
    // 删除节点
    this._http.deleteProj(APIResource.AppConfigPack, { id: node.id }).subscribe(result => {
      if (result.Status === 200) {
        this.message.success(`删除：【${node.data.name}】成功`);
        // 删除父节点的数据
        for (let i = 0, len = node.parent.children.length; i < len; i++) {
          if (node.parent.children[i].id === node.id) {
            node.parent.children.splice(i, 1);
            i = i - 1;
          }
        }
      } else {
        this.message.warning(`删除：【${node.Name}】异常, ${result.Message}`);
      }
    },
      error => {
        this.message.error(error);
      },
      () => {
        // 更新节点状态
        // console.log('update');
        node.treeModel.update();
      }
    );
  }

  delOptCancel = () => {
    // 取消
    this.message.info('你取消了要删除的操作');
  }

  uuID(w) {
    let s = '';
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < w; i++) {
      s += str.charAt(Math.round(Math.random() * (str.length - 1)));
    }
    return s;
  }

  ngOnDestroy() {
    if (this._relativeResolver) {
      this._relativeResolver.unsubscribe();
    }

  }

  closeOperationMenu(e: NzMenuItemDirective): void {
    this.dropdown.close();
  }

  addOperation(e) {

  }
  editOperation(e) {

  }
  // endregion

  // region: Demo
  selfEvent = {
    clickNode: [],
    expandNode: [],
    load: []
  };
  _tempParameter = {};
  // 销毁
  _subscribArr: any[] = [];
  _demoTreeData = [];
  config: any = {
    viewId: 'viewId_operationTree',
    checkable: false,
    showLine: false,
    asyncData: true,
    expandAll: true,
    relations: [
      {
        relationViewId: 'viewId_operationTree',
        relationSendContent: [
          {
            name: 'expandNode',
            aop: 'after',
            sender: 'viewId_operationTree',
            receiver: 'operation_sqlColumns',
            relationData: {
              name: 'initParameters',
              params: [
                {
                  pid: 'key',
                  cid: '_Id'
                },
                {
                  pid: 'key',
                  cid: 'parentId'
                },
                {
                  pid: 'key',
                  cid: '_moduleId'
                }
              ]
            }
          },
          {
            name: 'expandNode',
            aop: 'after',
            sender: 'viewId_operationTree',
            receiver: 'opt_base',
            relationData: {
              name: 'initParameters',
              params: [
                {
                  pid: 'key',
                  cid: '_Id'
                },
                {
                  pid: 'key',
                  cid: 'parentId'
                },
                {
                  pid: 'key',
                  cid: '_moduleId'
                }
              ]
            }
          }
        ]
      }
    ]
  };

  // resolveRelation(data?) {
  //   if (this._demoTreeConfig.relations) {
  //     this._demoTreeConfig.relations.forEach(relation => {
  //       if (relation.relationSendContent) {
  //         relation.relationSendContent.forEach(sendContent => {
  //           this.setMessage(sendContent);
  //           if(sendContent.aop && sendContent.aop === 'after'){  
  //             this.after(this, sendContent.name,(e)=> {
  //               debugger;
  //               this.selfEvent[sendContent.name].forEach(sendEvent => {
  //                 if (sendEvent.isRegister === true) {
  //                   let parent = {};
  //                   sendEvent.data.params.forEach(element => {
  //                     // _tempValue
  //                     // _value
  //                     // component 当前模式获取未组件值
  //                     parent[element['cid']] = e[0].node[element['pid']];
  //                   });
  //                   const receiver = {
  //                     name: 'initParameters',
  //                     receiver: sendEvent.receiver,
  //                     parent: parent
  //                   };
  //                   this.relativeMessage.sendMessage({ type: 'relation' }, receiver);
  //                 }
  //               });
  //             })
  //           }
  //         });
  //       }
  //       if (relation.relationReceiveContent) {
  //         const subMessage = this.relativeMessage.getMessage().subscribe(value => {
  //           switch (value.type.type) {
  //             case 'relation':
  //               if (value.data.receiver === this._demoTreeConfig.viewId) {
  //                 this.receiveMessage(value.data);
  //               }
  //               break;
  //             case 'initParameters':
  //               if (value.data.receiver, this._demoTreeConfig.viewId) {
  //                 this.receiveMessage(value.data);
  //               }
  //               break;
  //           }
  //         });
  //         if (subMessage) {
  //           this._subscribArr.push(subMessage);
  //         }
  //       }
  //     });
  //   }
  // }

  setMessage(data?) {
    if (data) {
      if (this.selfEvent[data.name]) {
        this.selfEvent[data.name].push(
          {
            isRegister: true,
            receiver: data.receiver,
            data: data.relationData
          }
        );
      }
    }
  }

  receiveMessage(data) {
    if (data) {
      switch (data.name) {
        case 'refreshAsChild':
          this.refreshAsChild(data.parent);
          break;
        case 'initParameters':
          this.initParameters(data.parent);
          break;
        case 'initComponentValue':
          this.initComponentValue(data.parent);
          break;
      }
    }
  }

  private refreshAsChild(parent) {
    for (const d in parent) {
      this._tempParameter[d] = parent[d];
    }
    // call load treeNode
  }

  private initParameters(data) {
    for (const d in data) {
      this._tempParameter[d] = data[d];
    }
    // call load treeNode
  }

  private initComponentValue(data) {
    for (const d in data) {
      this._tempParameter[d] = data[d];
    }
  }

  listToTreeData(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        temp = this.listToTreeData(data, data[i].key);
        if (temp.length > 0) {
          data[i]['children'] = temp;
        } else {
          data[i]['isLeaf'] = true;
        }
        result.push(data[i]);
      }
    }
    return result;
  }

  async getTreeData() {
    return this._http.getProj(APIResource.AppModuleConfig,
      {
        '_select': 'Id as key,Name as title,ParentId'
      }
    ).toPromise();
  }

  SetTreeData() {
    (async () => {
      const data = await this.getTreeData();
      if (data.Data && data.Status === 200) {
        this._demoTreeData = this.listToTreeData(data.Data, '');
      }
    })();
  }

  onMouseAction(actionName, $event) {
    // console.log(this, actionName);
    this[actionName]($event);
  }

  clickNode = (e) => {
    // console.log('click node');
  }
  // endregion

  // region: async Tree Demo
  _demoAsyncTreeData = [];
  _demoAsyncTreeConfig = {
    checkable: false,
    showLine: false,
    asyncData: true,
    expandAll: false
  };

  setAsyncData() {
    (async () => {
      const data = await this.getAsyncTreeData({ ParentId: ' ' });
      if (data.Data && data.Status === 200) {
        this._demoAsyncTreeData = data.Data;
      }
    })();
  }

  async getAsyncTreeData(params) {
    params['_select'] = 'Id as key,Name as title,ParentId';
    return this._http.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  expandNode = (e) => {
    // console.log('expandNode');
    (async () => {
      if (e.node.getChildren().length === 0 && e.node.isExpanded) {
        const params = { ParentId: e.node.key };
        const data = await this.getAsyncTreeData(params);
        if (data.Data && data.Status === 200) {
          data.Data.forEach(item => {
            item['isLeaf'] = false;
            item['children'] = [];
          });
          e.node.addChildren(data.Data);
        }
      }
    })();
  }

  listToAsyncTreeData(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        temp = this.listToTreeData(data, data[i].key);
        if (temp.length > 0) {
          data[i]['children'] = temp;
        } else {
          data[i]['isLeaf'] = true;
        }
        result.push(data[i]);
      }
    }
    return result;
  }

  _loadLayoutData($event) {

  }
  // endregion
}

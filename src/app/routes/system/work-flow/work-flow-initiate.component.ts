import { Component, Injectable, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzFormModule, NzInputGroupComponent } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { AppPermission, FuncResPermission, OpPermission, PermissionValue } from '../../../model/APIModel/AppPermission';
import { TIMEOUT } from 'dns';
import { _HttpClient } from '@delon/theme';
import Editor from '@antv/g6-editor';
import { Form } from '@angular/forms';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
@Component({
  selector: 'cn-work-flow-initiate, [work-flow-initiate]',
  templateUrl: './work-flow-initiate.component.html',
  styles: [

  ]
})
export class WorkFlowInitiateComponent implements OnInit {

  // 任务名称   创建日期  执行人 任务状态  流程状态  是否已委托 截止时间  是否延迟   
  // @ViewChild('nodeform', { read: ViewContainerRef }) container: ViewContainerRef;
  // @ViewChild('nodeform') nodeform: Form;
  // @ViewChild('nodeform') nodeform: NzInputGroupComponent;

  // @ViewChild('nodeform') nodeform: FormResolverComponent;
  data = {
    nodes: [
      {
        type: 'node',
        nodetype: 'BeginNode',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '开始节点',
        x: 155,
        y: 55,
        id: 'ea1184e8',
        index: 0

      },
      {
        type: 'node',
        nodetype: 'Node',
        size: '72*72',
        shape: 'flow-rect',
        color: '#13C2C2',
        label: '普通节点',
        x: 155,
        y: 155,
        id: 'ea1184e7',
        index: 1,

      },
      {
        type: 'node',
        nodetype: 'GatewayNode',
        size: '80*72',
        shape: 'flow-rhombus',
        color: '#13C2C2',
        label: '分叉节点',
        x: 155,
        y: 255,
        id: 'ea1184e6',
        index: 2,
      },
      {
        type: 'node',
        nodetype: 'EndNode',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '结束节点',
        x: 155,
        y: 355,
        id: '481fbb1a',
        index: 3,
      }],
    edges: [
      {
        source: 'ea1184e8',
        sourceAnchor: 2,
        target: 'ea1184e7',
        targetAnchor: 0,
        id: '7989ac70',
        index: 4,
      },
      {
        source: 'ea1184e7',
        sourceAnchor: 2,
        target: 'ea1184e6',
        targetAnchor: 0,
        id: '7989ac71',
        index: 5,
      },
      {
        source: 'ea1184e6',
        sourceAnchor: 2,
        target: '481fbb1a',
        targetAnchor: 0,
        id: '7989ac72',
        index: 6,
      }
    ],
  };

  // 节点基本信息配置
  node_panels = [
    {
      active: true,
      name: '属性',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '扩充信息'
    }
  ];

  // 工作流基本信息

  // 边基本信息
  edge_panels = [
    {
      active: true,
      name: '属性',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '扩充信息'
    }
  ];

  // 节点表单信息
  nodeinfo = {
    id: '',
    label: ''
  };
  edgeinfo = {
    id: '',
    label: ''
  };


  config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '工作流分类',
              bodyStyle: {
                height: '800px',
                padding: '8px'
              },
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
                      { title: '父节点', field: 'parentId', valueName: 'parentid' },
                      { title: '标题', field: 'title', valueName: 'name' },
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
                      'url': 'common/WfInfo',
                      'ajaxType': 'get',
                      'params': [
                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                      ]
                    }
                  },
                  dataList: []
                }
              ]
            },
            {
              id: 'area1',
              title: '工作流',
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
                    'viewId': 'workFlowInitiate',
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
                        title: '任务名称', field: 'name', width: 80,
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
                        title: '实例编号', field: 'code', width: 80,
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
                        title: '节点名称', field: 'code', width: 80,
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
                      },
                      {
                        title: '执行人', field: 'createDate', width: 80, hidden: false, showSort: true,
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
                      },
                      {
                        title: '任务状态', field: 'createDate', width: 80, hidden: false, showSort: true,
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
                      },
                      {
                        title: '流程状态', field: 'createDate', width: 80, hidden: false, showSort: true,
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
                      },
                      {
                        title: '是否已委托', field: 'createDate', width: 80, hidden: false, showSort: true,
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
                      },
                      {
                        title: '截止时间', field: 'createDate', width: 80, hidden: false, showSort: true,
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
      }

    ]
  };
  // 构造函数
  constructor(private http: _HttpClient,
    private apiService: ApiService) { }

  editor = new Editor();
  page;


  load() {

  }

  liu() {
    console.log('ceshi');
  }

  ngOnInit() {
    this.load();
    console.log('begin');
    const Command = Editor.Command;
    Command.registerCommand('liu', {
      queue: true,  // 命令是否进入队列，默认是 true  
      // 命令是否可用
      enable(/* editor */) {
        console.log('enable');
      },
      // 正向命令
      execute(/* editor */) {
        console.log('execute');
      },
      // 反向命令
      back(/* editor */) {
        console.log('back');
      }
    });

    const minimap = new Editor.Minimap({
      container: 'minimap',
    });
    const toolbar = new Editor.Toolbar({
      container: 'toolbar',
    });
    const contextmenu = new Editor.Contextmenu({
      container: 'contextmenu',
    });
    const itempannel = new Editor.Itempannel({
      container: 'itempannel',
    });
    const detailpannel = new Editor.Detailpannel({
      container: 'detailpannel',
    });

    this.page = new Editor.Flow({
      graph: {
        container: 'page',
        height: window.innerHeight - 238
      },
      // shortcut: {
      //   zoomIn: true,   // 开启放大快捷键
      //   zoomOut: false, // 开启视口缩小快捷键
      // },
    });

    this.editor.add(minimap);
    this.editor.add(toolbar);
    this.editor.add(contextmenu);
    this.editor.add(itempannel);
    this.editor.add(detailpannel);
    this.editor.add(this.page);

    // 默认加载数据
    this.page.read(this.data);

    const graph = this.page.getGraph();
    graph.on('click', ev => {
      console.log('click');
    });          // 任意点击事件
    graph.on('node:click', ev => {
      // console.log('node:click', ev);
      if (ev.item) {
        console.log('节点model', ev.item.model);
        let nodestate = true;
        this.data.nodes.forEach(n => {
          if (n.id === ev.item.model.id) {
            this.nodeinfo.id = n.id;
            this.nodeinfo.label = n.label;
            nodestate = false;
          }
        });
        if (nodestate) {
          const nodemodel = ev.item.model;
          nodemodel['nodetype'] = this.getNodeType(ev.item.model.label);
          this.data.nodes.push(nodemodel);
          this.data.nodes.forEach(n => {
            if (n.id === ev.item.model.id) {
              this.nodeinfo.id = n.id;
              this.nodeinfo.label = n.label;
            }
          });
        }

      }
      // this.nodeform 
      //  const data = page.save();
      //  console.log('当前节点数据', data);

    });     // 节点点击事件
    graph.on('edge:click', ev => {
      console.log('edge:click', ev);
      if (ev.item) {
        console.log('edgemodel', ev.item.model);
        this.data.edges.forEach(n => {
          if (n.id === ev.item.model.id) {
            this.edgeinfo.id = n.id;
          }
        });

      }
    });     // 边点击事件
    graph.on('group:click', ev => {
      console.log('group:click');
    });    // 组点击事件
    graph.on('anchor:click', ev => {
      console.log('anchor:click');
    });   // 锚点点击事件


  }

  save() {
    console.log('执行save');
    const s_data = this.page.save();
    s_data.nodes.forEach(n => {
      if (!n.hasOwnProperty('nodetype')) {
        n['nodetype'] = this.getNodeType(n.label);
      }
    });
    console.log('当前节点数据', s_data);
    console.log('当前节点数据string: ', JSON.stringify(s_data) );

  }

  valueChange() {
    this.data.nodes.forEach(n => {
      if (n.id === this.nodeinfo.id) {
        n.label = this.nodeinfo.label;
      }
    });
    this.page.read(this.data);
  }
  // 看以后是否维护边信息
  edgevalueChange() {
    //   this.data.edges.forEach(n => {
    //     if (n.id === this.edgeinfo.id ) {
    //      //  n.label = this.edgeinfo.label;
    //     }
    //  });
    //  this.page.read(this.data);
  }

  getNodeType(label) {
    let nodetype = '';
    if (label === '开始节点') {
      nodetype = 'BeginNode';
    }
    if (label === '结束节点') {
      nodetype = 'EndNode';
    }
    if (label === '常规节点') {
      nodetype = 'Node';
    }
    if (label === '分叉节点') {
      nodetype = 'GatewayNode';
    }
    return nodetype;
  }


 // 工作流配置信息保存，保存的时候，拆解node edge 通过函数简析，这部分信息也通过配置
  executeSave() {


  }

  // 执行异步请求  url 资源  method get/post/put body
  private async execute(url, method, body) {
    return this.apiService[method](url, body).toPromise();
  }


 // 工作流组件json 格式定义
  WF_Config = {
    viewId: 'wfeditorid',  // 唯一标识
    component: 'wfeditor', // 工作流图形编辑组件
    loadtype: 'ajax',  // 【新增配置项】ajax、data  当前组件的加载方式【预留，目前以ajax为主】
    wfjson: 'configjson', // 当前存储json字段的
    ajaxConfig: {   // 图形自加载

    },
    // 该属性不作简析，目前只作单纯json维护
    componentType: {
      'parent': false,
      'child': false,
      'own': true
    },
    relations: [],
    toolbar: [ // 此处的toolbar 是用户自定义按钮 + 编辑器内置命令按钮，分组  commandtype: 'editorcommand',  // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
      {
        group: [
          {
            name: 'undo', 
            commandtype: 'editorcommand',  // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
            class: 'command iconfont icon-undo', 
            text: '撤销',
            hidden: false
          },
          {
            name: 'redo', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-redo disable', 
            text: '重做',
            hidden: false
          }
         
        ]
      },
      {
        group: [
          {
            name: 'copy', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-copy-o disable', 
            text: '复制',
            hidden: false
          },
          {
            name: 'paste', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-paster-o disable', 
            text: '粘贴',
            hidden: false
          },
          {
            name: 'delete', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-delete-o disable', 
            text: '删除',
            hidden: false
          }
         
        ]
      },
      {
        group: [
          {
            name: 'zoomIn', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-zoom-in-o', 
            text: '放大',
            hidden: false
          },
          {
            name: 'zoomOut', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-zoom-out-o', 
            text: '缩小',
            hidden: false
          },
          {
            name: 'autoZoom', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-fit', 
            text: '适应画布',
            hidden: false
          },
          {
            name: 'resetZoom', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-actual-size-o', 
            text: '实际尺寸',
            hidden: false
          }
         
        ]
      },
      {
        group: [
          {
            name: 'toBack', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-to-back disable', 
            text: '层级后置',
            hidden: false
          },
          {
            name: 'toFront', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-to-front disable', 
            text: '层级前置',
            hidden: false
          }
         
        ]
      },
      {
        group: [
          {
            name: 'multiSelect', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-select', 
            text: '多选',
            hidden: false
          },
          {
            name: 'addGroup', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-group disable', 
            text: '成组',
            hidden: false
          },
          {
            name: 'unGroup', 
            commandtype: 'editorcommand',  
            class: 'command iconfont icon-ungroup disable', 
            text: '解组',
            hidden: false
          }
         
        ]
      },
      {
        group: [
          {
            name: 'saveWF', 
            commandtype: 'componentcommand',  
            class: 'command iconfont icon-select', 
            text: '保存',
            hidden: false
          }
        ]
      },
    ],
    // 节点等的右键事件【目前不实现】
    contextmenu: [

    ]

  };
/*
  参数简析
  【节点】 nodes
  id 唯一标识
  index // 层级 类似 z-index
  color 节点颜色
  label 节点名称
  nodetype 【节点属性】【自定义属性】
  parent 所属分组【预留,暂时不实现，有分组的时候有该属性，无分组，或者解组后 undefined】
  shape 图形编辑器 内置图形类别
  size 节点大小
  type 类别（节点，边）
  x:坐标
  y:坐标

  【边】 edges
   id：边的唯一标识
   index：边的层级 类似 z-index
   source：连线的出发点
   sourceAnchor ： 出发锚点
   target ：指向节点
   targetAnchor：指向锚点

  【分组】 groups的值
  id：唯一标识  也是节点parent 
  collapsed：是否收缩 true/false 
  index：分组的层级 类似 z-index
  x:坐标
  y:坐标
  
*/
 // 注意事项

}

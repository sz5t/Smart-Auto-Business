import { Component, Injectable, OnInit } from '@angular/core';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { AppPermission, FuncResPermission, OpPermission, PermissionValue } from '../../../model/APIModel/AppPermission';
import { TIMEOUT } from 'dns';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-work-flow-design, [work-flow-design]',
  templateUrl: './work-flow-design.component.html',
  styles: []
})
export class WorkFlowDesignComponent implements OnInit {



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
                    'viewId': 'wfdesign_wf_parentTable',
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
                        // editor: {
                        //   type: 'input',
                        //   field: 'createDate',
                        //   options: {
                        //     'type': 'input',
                        //     'labelSize': '6',
                        //     'controlSize': '18',
                        //     'inputType': 'text',
                        //   }
                        // }
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
                    'viewId': 'wfdesign_Version_Table',
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
                      'relationViewId': 'wfdesign_wf_parentTable',
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
                        title: '版本号', field: 'version', width: 70, hidden: false,
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
                        title: '绑定业务类型', field: 'businesstype', width: 120, hidden: false,
                        editor: {
                          type: 'select',
                          field: 'businesstype',
                          options: {
                            'type': 'select',
                            'inputType': 'submit',
                            'name': 'businesstype',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '-请选择数据-',
                            'disabled': false,
                            'size': 'default',
                            'clear': true,
                            'width': '100%',
                            'defaultValue': 1,
                            'options': [
                              {
                                'label': '数据建模',
                                'value': 1,
                                'disabled': false
                              },
                              {
                                'label': '业务建模',
                                'value': 2,
                                'disabled': false
                              },
                            ]
                          }
                        }
                      },
                      {
                        title: '绑定业务对象', field: 'businessname', width: 100, hidden: false,
                        editor: {
                          type: 'select',
                          field: 'businesskey',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'businesskey',
                            'labelName': 'name',
                            'valueName': 'Id',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'width': '100%',
                            'ajaxConfig': {
                              'url': 'common/CfgTable',
                              'ajaxType': 'get',
                              'params': [
                                {
                                  name: 'isCreated',
                                  type: 'value',
                                  valueName: '',
                                  value: '1'
                                },
                                {
                                  name: 'isBuildModel',
                                  type: 'value',
                                  valueName: '',
                                  value: '1'
                                },
                                {
                                  name: 'isEnabled',
                                  type: 'value',
                                  valueName: '',
                                  value: '1'
                                },
                                {
                                  name: 'type',
                                  type: 'value',
                                  valueName: '',
                                  value: '1'
                                },
                                {
                                  name: '_sort',
                                  type: 'value',
                                  valueName: '',
                                  value: 'createDate desc'
                                }
                              ]
                            }
                          }
                        }
                      },
                      {
                        title: '排序', field: 'sort', width: 50, hidden: false,
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

                        title: '状态', field: 'state', width: 90, hidden: false,
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
                                  
                                  { name: 'businesstype', type: 'componentValue', valueName: 'businesstype', value: '' },
                                  { name: 'businesskey', type: 'componentValue', valueName: 'businesskey', value: '' },
                                  { name: 'businessname', type: 'componentValue', valueName: 'businessname', value: '' },
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
                                  { name: 'businesstype', type: 'componentValue', valueName: 'businesstype', value: '' },
                                  { name: 'businesskey', type: 'componentValue', valueName: 'businesskey', value: '' },
                                  { name: 'businessname', type: 'componentValue', valueName: 'businessname', value: '' },
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
                    cascade: [
                      {
                        name : 'businesskey', // 发出级联请求的小组件（就是配置里的name 字段名称）
                        CascadeObjects: [
                          {
                            cascadeName: 'businessname', 
                            cascadeValueItems: [   
                            ],
                            cascadeDataItems: [
                              {
                                data: {
                                  type: 'setValue', // option/ajax/setValue
                                  setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                    option: {
                                      name: 'value',
                                      type: 'selectObjectValue',
                                      value: '1',
                                      valueName: 'name'
                                    }
                                  },
                                }
                              }
                            ]  

                          },
                        ]
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
              id: 'area2',
              title: '设计工作流示例',
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
                    viewId: 'wfdesign_Version_graph',  // 唯一标识
                    component: 'wf_design', // 工作流图形编辑组件
                    loadtype: 'ajax',  // 【新增配置项】ajax、data  当前组件的加载方式【预留，目前以ajax为主】
                    wfjson: 'configjson', // 当前存储json字段的
                    ajaxConfig: {   // 图形自加载
                      'url': 'common/WfVersion',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'Id', type: 'tempValue', valueName: '_parentId', value: '' }
                      ],
                      filter: []
                    },
                    // 该属性不作简析，目前只作单纯json维护
                    componentType: {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    relations: [
                      {
                        'relationViewId': 'wfdesign_Version_Table',
                        'cascadeMode': 'REFRESH_AS_CHILD',
                        'params': [
                          { pid: 'Id', cid: '_parentId' },
                        ],
                        'relationReceiveContent': []
                      }
                    ],
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
                    command: [
                      {
                        name: 'saveWF',
                        ajaxConfig: {   // 图形自加载
                          'url': 'common/WfVersion',
                          'ajaxType': 'put',
                          'params': [
                            { name: 'Id', type: 'tempValue', valueName: '_parentId', value: '' },
                            { name: 'configjson', type: 'componentValue', valueName: 'configjson', value: '' },
                            { name: 'nodejson', type: 'componentValue', valueName: 'nodejson', value: '' },
                            { name: 'edgejson', type: 'componentValue', valueName: 'edgejson', value: '' }
                          ],
                          filter: []
                        }
                      }

                    ],
                    // 节点等的右键事件【目前不实现】
                    contextmenu: [

                    ]

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

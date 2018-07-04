import { CnComponentBase } from './../../../shared/components/cn-component-base';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import { BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observer } from 'rxjs';

@Component({
  selector: 'cn-module-managers',
  templateUrl: './module-managers.component.html',
})
export class ModuleManagersComponent extends CnComponentBase implements OnInit {
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
                    'title': '模块管理',
                    'viewId': 'bsnTreeTable',
                    'component': 'bsnTreeTable',
                    'info': true,
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 18, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/ComProjectModule/null/ComProjectModule',
                      'ajaxType': 'get',
                      'params': [
                        {
                          name: 'refProjectId', type: 'tempValue', valueName: '_parentId',
                        },
                        {
                          name: '_deep', type: 'value', value: '3'
                        }
                      ],
                      'filter': []
                    },
                    'columns': [
                      {
                        title: 'Id', field: 'Id', width: 80, hidden: true, expand: false,
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
                        title: '模块名称', field: 'name', width: '90px', expand: true,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'name',
                          options: {
                            'type': 'input',
                            'inputType': 'text',
                            'width': '100px'
                          }
                        }
                      },
                      {
                        title: '排序编号', field: 'orderCode', width: '90px', expand: false,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'orderCode',
                          options: {
                            'type': 'input',
                            'inputType': 'text',
                            'width': '100px'
                          }
                        }
                      },
                      {
                        title: '模块编码', field: 'code', width: '100px', hidden: false, expand: false,
                        showFilter: false, showSort: false,
                        editor: {
                          type: 'input',
                          field: 'code',
                          options: {
                            'type': 'input',
                            'inputType': 'text',
                            'width': '100px'
                          }
                        }
                      },
                      {
                        title: 'URL', field: 'url', width: 100, hidden: false, expand: false,
                        editor: {
                          type: 'input',
                          field: 'url',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '图标', field: 'icon', width: 100, hidden: false, expand: false,
                        editor: {
                          type: 'input',
                          field: 'icon',
                          options: {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'text',
                          }
                        }
                      },
                      {
                        title: '配置文本', field: 'moduleBody', width: 80, hidden: false, expand: false,
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
                        title: '备注', field: 'Remark', width: 80, hidden: false, expand: false,
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
                        title: '是否有效', field: 'isEnabled', width: 80, hidden: false, expand: false,
                        formatter: [
                          { 'value': '1', 'bgcolor': '', 'fontcolor': 'text-blue', 'valueas': '有效' },
                          { 'value': '0', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '无效' }
                        ],
                        editor: {
                          type: 'select',
                          field: 'isEnabled',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'isEnabled',
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
                      },
                      {
                        title: '是否发布', field: 'isNeedDeploy', width: 80, hidden: false, expand: false,
                        formatter: [
                          { 'value': '1', 'bgcolor': '', 'fontcolor': 'text-blue', 'valueas': '发布' },
                          { 'value': '0', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '未发布' }
                        ],
                        editor: {
                          type: 'select',
                          field: 'isNeedDeploy',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'isNeedDeploy',
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
                      },
                      {
                        title: '所属平台', field: 'belongPlatformType', width: 80, hidden: false, expand: false,
                        formatter: [
                          { 'value': '1', 'bgcolor': '', 'fontcolor': 'text-blue', 'valueas': '配置平台' },
                          { 'value': '2', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '运行平台' },
                          { 'value': '3', 'bgcolor': '', 'fontcolor': 'text-green', 'valueas': '通用' }
                        ],
                        editor: {
                          type: 'select',
                          field: 'belongPlatformType',
                          options: {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'submit',
                            'name': 'belongPlatformType',
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
                            ]
                          }
                        }
                      }
                    ],
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': true
                    },
                    'relations': [{
                      'relationViewId': 'projectId_module',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'Id', cid: '_parentId' }
                      ],
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
                        'name': 'updateRow', 'class': 'editable-add-btn', 'text': '编辑'
                      },
                      {
                        'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除',
                        'ajaxConfig': {
                          delete: [{
                            'actionName': 'delete',
                            'url': 'common/ProjectModuleDelete',
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
                            'url': 'common/ProjectModuleAdd',
                            'ajaxType': 'post',
                            'params': [
                              { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                              { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                              { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                              { name: 'url', type: 'componentValue', valueName: 'url', value: '' },
                              { name: 'icon', type: 'componentValue', valueName: 'icon', value: '' },
                              { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                              { name: 'moduleBody', type: 'componentValue', valueName: 'moduleBody', value: '' },
                              { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                              { name: 'isNeedDeploy', type: 'componentValue', valueName: 'isNeedDeploy', value: '' },
                              { name: 'belongPlatformType', type: 'componentValue', valueName: 'belongPlatformType', value: '' }
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
                            'url': 'common/ProjectModuleUpdate',
                            'ajaxType': 'put',
                            'params': [
                              { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                              { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                              { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                              { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                              { name: 'url', type: 'componentValue', valueName: 'url', value: '' },
                              { name: 'icon', type: 'componentValue', valueName: 'icon', value: '' },
                              { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                              { name: 'moduleBody', type: 'componentValue', valueName: 'moduleBody', value: '' },
                              { name: 'isEnabled', type: 'componentValue', valueName: 'isEnabled', value: '' },
                              { name: 'isNeedDeploy', type: 'componentValue', valueName: 'isNeedDeploy', value: '' },
                              { name: 'belongPlatformType', type: 'componentValue', valueName: 'belongPlatformType', value: '' }
                            ]
                          }]
                        }
                      },
                      {
                        'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消',
                      },
                      {
                        'name': 'addForm', 'class': 'editable-add-btn', 'text': '新增模块',
                        'type': 'showForm', 'dialogConfig': {
                          'keyId': 'Id',
                          'layout': 'horizontal',
                          'title': '新增模块',
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
                                    'type': 'selectTree',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'parentId',
                                    'label': '父模块',
                                    'labelName': 'name',
                                    'valueName': 'Id',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
                                    'columns': [ // 字段映射，映射成树结构所需
                                      { title: '主键', field: 'key', valueName: 'Id' },
                                      { title: '父节点', field: 'parentId', valueName: 'parentId' },
                                      { title: '标题', field: 'title', valueName: 'name' },
                                    ],
                                    'ajaxConfig': {
                                      'url': 'common/ComProjectModule',
                                      'ajaxType': 'get',
                                      'params': []
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
                                    'name': 'name',
                                    'label': '模块名称',
                                    'isRequired': true,
                                    'placeholder': '请输入模块名称',
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
                                        'errorMessage': '请输入模块名称!!!!'
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
                                    'name': 'code',
                                    'label': '模块编码',
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
                                        'errorMessage': '请输编码'
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
                                    'name': 'url',
                                    'label': 'URL',
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
                                    'name': 'icon',
                                    'label': '图标',
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
                                    'inputType': 'text',
                                    'name': 'codeOrder',
                                    'label': '排序',
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
                                    'inputType': 'text',
                                    'name': 'codeOrder',
                                    'label': '排序',
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
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'isNeedDeploy',
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
                                        'label': '有效',
                                        'value': '1',
                                        'disabled': false
                                      },
                                      {
                                        'label': '无效',
                                        'value': '0',
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
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'belongPlatformType',
                                    'label': '所属平台',
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
                                    'url': 'common/ProjectModuleAdd',
                                    'params': [
                                      { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                                      { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                      { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                      { name: 'url', type: 'componentValue', valueName: 'url', value: '' },
                                      { name: 'icon', type: 'componentValue', valueName: 'icon', value: '' },
                                      { name: 'orderCode', type: 'tempValue', valueName: 'orderCode', value: '' },
                                      { name: 'moduleBody', type: 'componentValue', valueName: 'moduleBody', value: '' },
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
                                    'url': 'common/ProjectModuleUpdate',
                                    'params': [
                                      { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                                      { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                      { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                      { name: 'url', type: 'componentValue', valueName: 'url', value: '' },
                                      { name: 'icon', type: 'componentValue', valueName: 'icon', value: '' },
                                      { name: 'orderCode', type: 'tempValue', valueName: 'orderCode', value: '' },
                                      { name: 'moduleBody', type: 'componentValue', valueName: 'moduleBody', value: '' },
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
                        }
                      },
                      {
                        'name': 'editForm', 'class': 'editable-add-btn', 'text': '编辑模块',
                        'type': 'showForm',
                        'dialogConfig': {
                          'keyId': 'Id',
                          'title': '编辑模块',
                          'width': '600',
                          'ajaxConfig': {
                            'url': 'common/ComProjectModule',
                            'ajaxType': 'getById',
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
                                    'name': 'Id',
                                    'label': 'Id',
                                    'isRequired': false,
                                    'placeholder': '',
                                    'perfix': 'anticon anticon-edit',
                                    'suffix': '',
                                    'disabled': true,
                                    'readonly': false,
                                    'size': 'default',
                                    'layout': 'column',
                                    'span': '24',
                                    'validations': [
                                      {
                                        'validator': 'required',
                                        'errorMessage': '请输入模块名称!!!!'
                                      }
                                    ]
                                  },
                                ]
                              },
                              {
                                controls: [
                                  {
                                    'type': 'selectTree',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'parentId',
                                    'label': '父模块',
                                    'labelName': 'name',
                                    'valueName': 'Id',
                                    'notFoundContent': '',
                                    'selectModel': false,
                                    'showSearch': true,
                                    'placeholder': '--请选择--',
                                    'disabled': false,
                                    'size': 'default',
                                    'columns': [ // 字段映射，映射成树结构所需
                                      { title: '主键', field: 'key', valueName: 'Id' },
                                      { title: '父节点', field: 'parentId', valueName: 'parentId' },
                                      { title: '标题', field: 'title', valueName: 'name' },
                                    ],
                                    'ajaxConfig': {
                                      'url': 'common/ComProjectModule',
                                      'ajaxType': 'get',
                                      'params': []
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
                                    'name': 'name',
                                    'label': '模块名称',
                                    'isRequired': true,
                                    'placeholder': '请输入模块名称',
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
                                        'errorMessage': '请输入模块名称!!!!'
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
                                    'name': 'code',
                                    'label': '模块编码',
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
                                        'errorMessage': '请输编码'
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
                                    'name': 'url',
                                    'label': 'URL',
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
                                    'name': 'icon',
                                    'label': '图标',
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
                                    'inputType': 'text',
                                    'name': 'codeOrder',
                                    'label': '排序',
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
                                    'inputType': 'text',
                                    'name': 'codeOrder',
                                    'label': '排序',
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
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'isNeedDeploy',
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
                                        'label': '有效',
                                        'value': '1',
                                        'disabled': false
                                      },
                                      {
                                        'label': '无效',
                                        'value': '0',
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
                                    'type': 'select',
                                    'labelSize': '6',
                                    'controlSize': '16',
                                    'name': 'belongPlatformType',
                                    'label': '所属平台',
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
                                    'url': 'common/ComProjectModule',
                                    'params': [
                                      { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                      { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                                      { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                      { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                      { name: 'url', type: 'componentValue', valueName: 'url', value: '' },
                                      { name: 'icon', type: 'componentValue', valueName: 'icon', value: '' },
                                      { name: 'orderCode', type: 'componentValue', valueName: 'orderCode', value: '' },
                                      { name: 'moduleBody', type: 'componentValue', valueName: 'moduleBody', value: '' },
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
                      },
                      {
                        'name': 'addSearchRow', 'class': 'editable-add-btn', 'text': '查询', 'action': 'SEARCH',
                        'actionType': 'addSearchRow', 'actionName': 'addSearchRow',
                      },
                      {
                        'name': 'cancelSearchRow', 'class': 'editable-add-btn', 'text': '取消查询', 'action': 'SEARCH',
                        'actionType': 'cancelSearchRow', 'actionName': 'cancelSearchRow',
                      }
                    ],
                    'dataSet': [
                      {
                        'name': 'moduleName',
                        'ajaxConfig': {
                          'url': 'common/ComProjectModule',
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
                    ],
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

  _projOptions: any[] = [];
  _projValue;
  _selectedModuleText;
  loading = false;
  _tableDataSource;
  constructor(
    private apiService: ApiService,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>
  ) {
    super();
  }

  async ngOnInit() {
    const moduleData = await this.getProjectData();
    this._projOptions = this.arrayToTree(moduleData.data);
  }

  _changeModuleValue($event) {
    this._loadModules();
  }

  _onSelectionChange(selectedOptions: any[]) {
    this._selectedModuleText = `${selectedOptions.map(o => o.label).join(' / ')}`;
  }

  _loadModules() {
    if (this._projValue.length > 0) {
      console.log(this._projValue[this._projValue.length - 1]);
      this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD, 'projectId_module', {
        data: { Id: this._projValue[this._projValue.length - 1] }
      }));
    }
  }

  private async getProjectData() {
    const params = { _select: 'Id,projName' };
    return this.apiService.get('common/ComProject', params).toPromise();
  }

  private arrayToTree(data) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const obj = { 'label': data[i].projName, 'value': data[i].Id, isLeaf: true };
      result.push(obj);
    }
    return result;
  }

}

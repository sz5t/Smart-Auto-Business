import { Component, OnInit, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { RelativeService } from '@core/relative-Service/relative-service';

@Component({
  selector: 'cn-sql-setting',
  templateUrl: './sql-setting.component.html',
})
export class SqlSettingComponent implements OnInit , OnDestroy {

  _moduleId;
  _funcValue;
  _funcOptions = [];
  _sqlDataConfig = {
    'viewId': 'viewId_sqlSetting',
    'keyId': 'key',
    'nzIsPagination': true, // 是否分页
    'nzShowTotal': true, // 是否显示总数据量
    'pageSize': 5, // 默认每页数据条数
    'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
    'nzLoading': true, // 是否显示加载中
    'nzBordered': false, // 是否显示边框
    'ajaxConfig': {
      'url': {
        parent: 'AppModuleConfig',
        child: 'DbCommandConfig',
        params: [
          {
            type: 'tempValue', valueName: '_moduleId'
          }
        ]
        // self
      },
      'ajaxType': 'get',
      'params': [
        /* { name: '_parent.LeftId', type: 'tempValue', valueName: '_moduleId', value: '' },
         { name: '_parent.LinkNote', type: 'value', value: 'sql' },*/
      ]
    },
    'componentType': {
      'parent': true,
      'child': false,
      'own': true
    },
    'relation': [
      {
        'relationViewId': 'viewId_sqlSetting',
        'relationSendContent': [
          {
            name: 'selectRowBySetValue',
            sender: 'viewId_sqlSetting',
            receiver: 'viewId_sqlParams',
            relationData: {
              name: 'initComponentValue',
              params: [
                { pid: 'Id', cid: 'parentId' },
                { pid: 'Id', cid: '_id' },
                { pid: 'ParameterList', cid: 'dataList' }
              ]
            },
          }
        ],
        'relationReceiveContent': []
      }
    ],
    'columns': [
      {
        title: '主键', field: 'key', width: 'auto', hidden: true
      },
      {
        title: '名称', field: 'Name', width: 80,
        editor: {
          type: 'input',
          field: 'Name',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: 'SQL 语句', field: 'ScriptText', width: 80,
        editor: {
          type: 'input',
          field: 'ScriptText',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '脚本类型', field: 'DbObjType', width: 80,
        editor: {
          type: 'input',
          field: 'DbOjbType',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '对象状态', field: 'DbObjState', width: 80,
        editor: {
          type: 'input',
          field: 'DbObjState',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '发布状态', field: 'IssueFlag', width: 80,
        editor: {
          type: 'input',
          field: 'IssueFlag',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '结果类型', field: 'ResultType', width: 80,
        editor: {
          type: 'input',
          field: 'ResultType',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '应用范围', field: 'ShareScope', width: 80,
        editor: {
          type: 'input',
          field: 'ShareScope',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '引用类型', field: 'References', width: 80,
        editor: {
          type: 'input',
          field: 'References',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '是否启用', field: 'Enabled', width: 80,
        editor: {
          type: 'input',
          field: 'Enabled',
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
      {
        'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增数据'
      },
      {
        'name': 'new', 'class': 'editable-add-btn', 'text': '新增SQL',
        'operation': {
          'rows': [
            {
              'row': {
                'cols': [
                  {
                    'span': 24,
                    'size': {
                      'nzXs': 24,
                      'nzSm': 24,
                      'nzMd': 24,
                      'nzLg': 24,
                      'ngXl': 24
                    },
                    'viewCfg': [
                      {
                        'component': 'view_form',
                        'config': [
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
                            'name': 'ScriptText',
                            'label': '脚本',
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
                            'name': 'DbObjType',
                            'label': '脚本类型',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': 'SQL',
                                'value': 'sql'
                              },
                              {
                                'label': '视图',
                                'value': 'view'
                              },
                              {
                                'label': '存储过程',
                                'value': 'procedure'
                              }
                            ]
                          },
                          {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'submit',
                            'name': 'DbObjState',
                            'label': '对象状态',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': '未创建',
                                'value': '未创建'
                              },
                              {
                                'label': '已创建',
                                'value': '已创建'
                              }
                            ]
                          },
                          {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'submit',
                            'name': 'IssueFlag',
                            'label': '发布状态',
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
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'text',
                            'name': 'ResultType',
                            'label': '结果类型',
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
                            'name': 'ShareScope',
                            'label': '应用范围',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': '公有',
                                'value': true
                              },
                              {
                                'label': '私有',
                                'value': false
                              }
                            ]
                          },
                          {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'text',
                            'name': 'References',
                            'label': '引用',
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
                            'name': 'Enabled',
                            'label': '是否启用',
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
                          }
                        ],
                        'dataList': []
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      {
        'name': 'update', 'class': 'editable-add-btn', 'text': '修改',
        'operation': {

        }
      },
      { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
      {
        'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
        'ajaxConfig': {
          add: [
            {
              'url': 'DbCommandConfig',
              'ajaxType': 'post',
              'params': [
                { name: 'Name', type: 'componentValue', valueName: 'Name', value: '' },
                { name: 'ScriptText', type: 'componentValue', valueName: 'ScriptText', value: '' },
                { name: 'DbOjbType', type: 'componentValue', valueName: 'DbOjbType', value: '' },
                { name: 'DbOjbState', type: 'componentValue', valueName: 'DbOjbState', value: '' },
                { name: 'IssueFlag', type: 'componentValue', valueName: 'IssueFlag', value: '' },
                { name: 'ResultType', type: 'componentValue', valueName: 'ResultType', value: '' },
                { name: 'ShareScope', type: 'componentValue', valueName: 'ShareScope', value: '' },
                { name: 'References', type: 'componentValue', valueName: 'References', value: '' },
                { name: 'Enabled', type: 'componentValue', valueName: 'Enabled', value: '' }
              ],
              'output': [
                {
                  name: '_dataId',
                  type: '',
                  dataName: 'Id'
                }
              ]
            },
            {
              'url': 'SysDataLink',
              'ajaxType': 'post',
              'params': [
                { name: 'LeftId', type: 'tempValue', valueName: '_moduleId', value: '' },
                { name: 'RightId', type: 'tempValue', valueName: '_dataId', value: '' },
                { name: 'LinkNote', type: 'value', valueName: '', value: 'sql' }
              ]
            }
          ],
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
  };
  _paramDataConfig = {
    'viewId': 'viewId_sqlParams',
    'keyId': 'key',
    'nzIsPagination': true, // 是否分页
    'nzShowTotal': true, // 是否显示总数据量
    'pageSize': 5, // 默认每页数据条数
    'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
    'nzLoading': true, // 是否显示加载中
    'nzBordered': false, // 是否显示边框
    'componentType': {
      'parent': false,
      'child': true,
      'own': true
    },
    'relation': [
      {
        'relationViewId': 'viewId_sqlParams',
        'relationSendContent': [],
        'relationReceiveContent': []
      }
    ],
    'columns': [
      {
        title: '主键', field: 'key', width: 'auto', hidden: true
      },
      {
        title: '参数名称', field: 'ParameterName', width: 80,
        editor: {
          type: 'input',
          field: 'ParameterName',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '数据类型', field: 'DbType', width: 80,
        editor: {
          type: 'input',
          field: 'DbType',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '长度', field: 'Length', width: 80,
        editor: {
          type: 'input',
          field: 'Length',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '默认值', field: 'DefaultValue', width: 80,
        editor: {
          type: 'input',
          field: 'DefaultValue',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '参数类型', field: 'Direction', width: 80,
        editor: {
          type: 'input',
          field: 'IssueFlag',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '取值参数', field: 'ValueParameter', width: 80,
        editor: {
          type: 'input',
          field: 'ValueParameter',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      },
      {
        title: '参数来源', field: 'ValueSource', width: 80,
        editor: {
          type: 'input',
          field: 'ValueSource',
          options: {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '10',
            'inputType': 'text',
          }
        }
      }
    ],
    'toolbar': [
      { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
      {
        'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增数据'
      },
      {
        'name': 'new', 'class': 'editable-add-btn', 'text': '新增',
        'operation': {
          'rows': [
            {
              'row': {
                'cols': [
                  {
                    'span': 24,
                    'size': {
                      'nzXs': 24,
                      'nzSm': 24,
                      'nzMd': 24,
                      'nzLg': 24,
                      'ngXl': 24
                    },
                    'viewCfg': [
                      {
                        'component': 'view_form',
                        'config': [
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
                            'name': 'ScriptText',
                            'label': '脚本',
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
                            'name': 'DbObjType',
                            'label': '脚本类型',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': 'SQL',
                                'value': 'sql'
                              },
                              {
                                'label': '视图',
                                'value': 'view'
                              },
                              {
                                'label': '存储过程',
                                'value': 'procedure'
                              }
                            ]
                          },
                          {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'submit',
                            'name': 'DbObjState',
                            'label': '对象状态',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': '未创建',
                                'value': '未创建'
                              },
                              {
                                'label': '已创建',
                                'value': '已创建'
                              }
                            ]
                          },
                          {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'submit',
                            'name': 'IssueFlag',
                            'label': '发布状态',
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
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'text',
                            'name': 'ResultType',
                            'label': '结果类型',
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
                            'name': 'ShareScope',
                            'label': '应用范围',
                            'notFoundContent': '',
                            'selectModel': false,
                            'showSearch': true,
                            'placeholder': '--请选择--',
                            'disabled': false,
                            'size': 'default',
                            'options': [
                              {
                                'label': '公有',
                                'value': true
                              },
                              {
                                'label': '私有',
                                'value': false
                              }
                            ]
                          },
                          {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '10',
                            'inputType': 'text',
                            'name': 'References',
                            'label': '引用',
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
                            'name': 'Enabled',
                            'label': '是否启用',
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
                          }
                        ],
                        'dataList': []
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      {
        'name': 'update', 'class': 'editable-add-btn', 'text': '修改',
        'operation': {

        }
      },
      { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
      {
        'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
        'ajaxConfig': {
          update: {
            'url': 'DbCommandConfig',
            'ajaxType': 'put',
            'params': [
              { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
              { name: 'ParameterList', type: 'tempValue', valueName: 'arrayDataList', value: '' }
            ]
          }
        },
      },
      { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
    ]
  };
  _sqlEditorConfig = {
    'viewId': 'viewId_sqlEditor',
    'componentType': {
      'parent': false,
      'child': true,
      'own': true
    },
    'relations': [
      {
        'relationViewId': 'viewId_sqlEditor',
        'relationSendContent': [],
        'relationReceiveContent': []
      }
    ],
  };
  constructor(
    private apiService: ApiService,
    private relativeMessage: RelativeService
  ) { }

  async ngOnInit() {
    const params = { _select: 'Id,Name,ParentId' };
    const moduleData = await this.getModuleData(params);
    // 初始化模块列表，将数据加载到及联下拉列表当中
    this._funcOptions = this.arrayToTree(moduleData.Data, '');
  }
  // 获取模块信息
  async getModuleData(params) {
    return this.apiService.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  // 改变模块选项
  async _changeModuleValue($event?) {
    // 选择功能模块，首先加载服务端配置列表
    // const params = new HttpParams().set('TagA', this._funcValue.join(','));
    if (this._funcValue.length > 0) {
      this._moduleId = this._funcValue[this._funcValue.length - 1];
      const receiver = {
        name: 'initParameters',
        receiver: 'viewId_sqlEditor',
        parent: {
          _moduleId: this._funcValue[this._funcValue.length - 1],
        }
      };
      console.log('选中行发消息事件', receiver);
      this.relativeMessage.sendMessage({ type: 'initParameters' }, receiver);
      /* const sqlCommondData = await this.sqlRefreshData();
       this._loading = false;
       if(sqlCommondData.Data.length>0 && sqlCommondData.Status === 200) {
         this._sql_dataSet = sqlCommonData.Data.rows;
         this._sql_current = sqlCommondData.Page;
         this._sql_total = sqlCommonData.PageCount;
       }*/

    }
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

  sqlRefreshData() {
    /*const params = {
      _page: this._sql_current,
      _rows: this._sql_pageSize,
    };*/
    // return  this.apiService.get(`${APIResource.SysDataCategoryLink}/${this._moduleId}/${APIResource.DbCommonConfig}`, params).toPromise();
  }
  
  ngOnDestroy () {
    if (this) {
      // this.relativeMessage.clearMessage(); 
    }
  }
}

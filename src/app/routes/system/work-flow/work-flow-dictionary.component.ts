import { Component, Injectable, OnInit } from '@angular/core';
import { APIResource } from '@core/utility/api-resource';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { AppPermission, FuncResPermission, OpPermission, PermissionValue } from '../../../model/APIModel/AppPermission';
import { TIMEOUT } from 'dns';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-work-flow-dictionary, [work-flow-dictionary]',
  templateUrl: './work-flow-dictionary.component.html',
  styles: []
})
export class WorkFlowDictionaryComponent implements OnInit {
  public ws: WebSocket; // 定义websocket
  public config = {
    rows: [
      {
        row: {
          cols: [
            {
              id: 'area1',
              title: '数据字典类别',
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
                    'viewId': 'DictionaryTypeTable',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默pageSizeOptions认每页数据条数
                    '': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/WfDictionaryType',
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
                      'relationViewId': 'DictionaryTypeTable',
                      'relationSendContent': [
                        {
                          name: 'selectRow',
                          sender: 'DictionaryTypeTable',
                          aop: 'after',
                          receiver: 'DictionariesTable',
                          relationData: {
                            name: 'refreshAsChild',
                            params: [
                              { pid: 'code', cid: '_parentId' },
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
                                'url': 'common/WfDictionaryType',
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
                                'url': 'common/WfDictionaryType',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
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
                                'url': 'common/WfDictionaryType',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
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
                    'viewId': 'DictionaryTypeTable',
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
              title: '数据字典明细',
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
                    'viewId': 'DictionariesTable',
                    'component': 'bsnTable',
                    'keyId': 'Id',
                    'pagination': true, // 是否分页
                    'showTotal': true, // 是否显示总数据量
                    'pageSize': 5, // 默认每页数据条数
                    'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                    'ajaxConfig': {
                      'url': 'common/WfDictionaries',
                      'ajaxType': 'get',
                      'params': [
                        { name: 'typeCode', type: 'tempValue', valueName: '_parentId', value: '' }
                      ]
                    },
                    'componentType': {
                      'parent': false,
                      'child': true,
                      'own': false
                    },
                    'relations': [{
                      'relationViewId': 'DictionaryTypeTable',
                      'cascadeMode': 'REFRESH_AS_CHILD',
                      'params': [
                        { pid: 'code', cid: '_parentId' }
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
                        title: '值', field: 'value', width: 80, hidden: false,
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
                                'url': 'common/WfDictionaries',
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
                                'url': 'common/WfDictionaries',
                                'ajaxType': 'post',
                                'params': [
                                  { name: 'typeCode', type: 'tempValue', valueName: '_parentId', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },

                                  { name: 'value', type: 'componentValue', valueName: 'value', value: '' },
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
                                'url': 'common/WfDictionaries',
                                'ajaxType': 'put',
                                'params': [
                                  { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                  { name: 'typeCode', type: 'tempValue', valueName: '_parentId', value: '' },
                                  { name: 'name', type: 'componentValue', valueName: 'name', value: '' },
                                  { name: 'value', type: 'componentValue', valueName: 'value', value: '' },
                                  { name: 'code', type: 'componentValue', valueName: 'code', value: '' },
                                  { name: 'sort', type: 'componentValue', valueName: 'sort', value: '' },
                                  { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' }
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
                    'formDialog': [
                    ],
                    'dataSet': []
                  },
                  permissions: {
                    'viewId': 'DictionariesTable',
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

  public ngOnInit() {
  }
  // socket连接
  public connectWs() {
    if (this.ws != null) { this.ws.close() };
    this.ws = new WebSocket('wss://172.20.201.148:1804/ws');
    const that = this;
    this.ws.onopen = function (event) {
      // socket 开启后执行，可以向后端传递信息
      that.ws.send('sonmething');

    }
    this.ws.onmessage = function (event) {
      // socket 获取后端传递到前端的信息
      that.ws.send('sonmething');

    }
    this.ws.onerror = function (event) {
      // socket error信息


    }
    this.ws.onclose = function (event) {
      // socket 关闭后执行

    }
  }

  public allowDrop(ev) {
    ev.preventDefault();
  }

  public drag(ev) {
    console.log('拖节点ev.target.id：', ev);
    ev.dataTransfer.setData('Text', ev.target.id); // ev.target.innerHTML
  }

  public drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('Text');
    console.log('拖到位置', data, ' 当前节点 ', ev);
    // const item = document.getElementById(data).cloneNode(); //

    if (data === 'radio') {
      const item = document.getElementById(data);
      console.log('节点', item);
      ev.target.appendChild(item);
    } else if (data === 'button') {
      console.log('当前应该生成节点', data);
    } else {
      const item = document.getElementById(data);
      console.log('节点', item);
      ev.target.appendChild(item);
    }

  }

  public dragenter(ev) {
    console.log('当前应该高亮显示');
  }




  // 结构定义

  // tslint:disable-next-line:member-ordering
  public content = [];
  // tslint:disable-next-line:member-ordering
  public components = [];

  public initComponent() {

    const item = {
      type: '', // 标识


    }

  }









 // liu
  // 【 渲染器整体思路】
  // 1. 结构规划
  // 布局， 容器树
  //  渲染组件，整合自身布局树，上传父对象
  // 每层父对象，整合子对象的布局树
  // 根容器，合并布局树
  // 【!用途】 可以【自由组合业务对象取值】，一个页面【多组件整存整取】
 //  【交互】 可规避过多配置消息，可直接根据树控制子组件行为。

 // ？ 取值，目前最复杂

























}

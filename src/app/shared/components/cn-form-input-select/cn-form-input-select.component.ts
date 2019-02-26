import { Component, OnInit, ViewChild } from '@angular/core';
import { CnBsnTreeComponent } from '@shared/business/bsn-tree/bsn-tree.component';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-input-select,[cn-form-input-select]',
  templateUrl: './cn-form-input-select.component.html',
  styleUrls: ['./cn-form-input-select.component.css']
})
export class CnFormInputSelectComponent implements OnInit {
  public isVisible = false;
  public config;
  public ck_value;
  public bsnData;
  public casadeData;
  public permissions = [];
  @ViewChild('tree') public tree: CnBsnTreeComponent;
  @ViewChild('table') public table: BsnTableComponent;
  public _value: any;

  constructor() { }

  public ngOnInit() {
    this.config = {
      type: 'input',
      labelSize: '6',
      controlSize: '18',
      inputType: 'text',
      valueName: 'name',
      select: {}
    }

    if (this.config.select) {
      if (!this.config.select.nzWidth) {
        this.config.select.nzWidth = 768;
      }
      if (!this.config.select.title) {
        this.config.select.title = '弹出列表';
      }
    }
  }



  // 文本值，可填、可选
  // 选则内容，树、树表、列表 基本需要这3种组件中取值

  // 场景描述：liu20181211
  // 1.文本框 内容，有一部分值是手动输入的，有一部分值是参考其他数据集来的
  // 2.点击参考，弹出表单
  // 3.表单内嵌3种组件 树、树表、列表 选中一条数据，将对应值回写到文本框内

  // 解决方案
  // 个人建议，将当前组件 封装到表单内部，弹出表单，获取表单值作为参考值


  // tslint:disable-next-line:member-ordering
  public select = [
    {
      name: 'businesskey',
      type: 'selectGrid',
      config: {
        width: '1024', // 弹出的宽度
        title: '弹出表格',
        selectGrid: {
          viewId: 'businesskey_Table',
          component: 'bsnTable',
          keyId: 'Id',
          pagination: true, // 是否分页
          showTotal: true, // 是否显示总数据量
          pageSize: 5, // 默pageSizeOptions认每页数据条数
          isSelectGrid: true, // 【弹出表格时用】弹出表格值为true
          selectGridValueName: 'Id', // 【弹出表格时用】指定绑定的value值
          pageSizeOptions: [5, 10, 20, 30, 40, 50],
          ajaxConfig: {
            url: 'common/CfgTable',
            ajaxType: 'get',
            params: [
              {
                name: '_sort',
                type: 'value',
                valueName: '',
                value: 'createDate desc'
              }
            ]
          },
          componentType: {
            parent: false,
            child: false,
            own: true
          },
          columns: [
            {
              title: 'Id',
              field: 'Id',
              width: 80,
              hidden: true,
              editor: {
                type: 'input',
                field: 'Id',
                options: {
                  type: 'input',
                  labelSize: '6',
                  controlSize: '18',
                  inputType: 'text'
                }
              }
            },
            {
              title: '名称',
              field: 'name',
              width: 80,
              showFilter: false,
              showSort: false,
              editor: {
                type: 'input',
                field: 'name',
                options: {
                  type: 'input',
                  labelSize: '6',
                  controlSize: '18',
                  inputType: 'text'
                }
              }
            },
            {
              title: '编号',
              field: 'code',
              width: 80,
              showFilter: false,
              showSort: false,
              editor: {
                type: 'input',
                field: 'code',
                options: {
                  type: 'input',
                  labelSize: '6',
                  controlSize: '18',
                  inputType: 'text'
                }
              }
            },
            {
              title: '备注',
              field: 'remark',
              width: 80,
              hidden: false,
              editor: {
                type: 'input',
                field: 'remark',
                options: {
                  type: 'input',
                  labelSize: '6',
                  controlSize: '18',
                  inputType: 'text'
                }
              }
            },
            {
              title: '创建时间',
              field: 'createDate',
              width: 80,
              hidden: false,
              showSort: true,
              editor: {
                type: 'input',
                field: 'createDate',
                options: {
                  type: 'input',
                  labelSize: '6',
                  controlSize: '18',
                  inputType: 'text'
                }
              }
            }
          ],
          toolbar: [
            {
              group: [
                {
                  name: 'refresh',
                  class: 'editable-add-btn',
                  text: '刷新',
                  cancelPermission: true
                },
                {
                  name: 'addSearchRow',
                  class: 'editable-add-btn',
                  text: '查询',
                  action: 'SEARCH',
                  actionType: 'addSearchRow',
                  actionName: 'addSearchRow',
                  cancelPermission: true
                },
                {
                  name: 'cancelSearchRow',
                  class: 'editable-add-btn',
                  text: '取消查询',
                  action: 'SEARCH',
                  actionType: 'cancelSearchRow',
                  actionName: 'cancelSearchRow',
                  cancelPermission: true
                },
                {
                  name: 'cancelSelectRow',
                  class: 'editable-add-btn',
                  text: '取消选中',
                  action: 'CANCEL_SELECTED',
                  cancelPermission: true
                }
              ]
            }
          ]
        }
      }
    },
    {
      name: 'businesskey1',
      type: 'selectTreeGrid',
      config: {
        nzWidth: 768,
        title: '弹出树',
        selectTreeGrid: {
          isSelectGrid: true,
          selectGridValueName:
            'Id', // 【弹出表格时用】指定绑定的value值
          // 'title': '树表网格',
          viewId: 'bsnTreeTable',
          component:
            'bsnTreeTable',
          info: true,
          keyId: 'Id',
          pagination: true,
          showTotal: true,
          pageSize: 5,
          pageSizeOptions: [
            5,
            18,
            20,
            30,
            40,
            50
          ],
          ajaxConfig: {
            url:
              'common/GetCase/null/GetCase',
            ajaxType: 'get',
            params: [],
            filter: []
          },
          columns: [
            {
              title: 'Id',
              field: 'Id',
              width: 80,
              hidden: true,
              editor: {
                type:
                  'input',
                field: 'Id',
                options: {
                  type:
                    'input',
                  inputType:
                    'text'
                }
              }
            },
            {
              title: '名称',
              field:
                'caseName',
              width: '90px',
              expand: true,
              showFilter: false,
              showSort: false,
              editor: {
                type:
                  'input',
                field:
                  'caseName',
                options: {
                  type:
                    'input',
                  inputType:
                    'text',
                  width:
                    '100px'
                }
              }
            },
            {
              title: '类别',
              field:
                'caseTypeText',
              width: '100px',
              hidden: false,
              showFilter: true,
              showSort: true,
              editor: {
                type:
                  'select',
                field:
                  'caseType',
                options: {
                  type:
                    'select',
                  name:
                    'caseType',
                  label:
                    'Type',
                  notFoundContent:
                    '',
                  selectModel: false,
                  showSearch: true,
                  placeholder:
                    '-请选择数据-',
                  disabled: false,
                  size:
                    'default',
                  clear: true,
                  width:
                    '150px',
                  options: [
                    {
                      label:
                        '表格',
                      value:
                        '1',
                      disabled: false
                    },
                    {
                      label:
                        '树组件',
                      value:
                        '2',
                      disabled: false
                    },
                    {
                      label:
                        '树表',
                      value:
                        '3',
                      disabled: false
                    },
                    {
                      label:
                        '表单',
                      value:
                        '4',
                      disabled: false
                    },
                    {
                      label:
                        '标签页',
                      value:
                        '5',
                      disabled: false
                    }
                  ]
                }
              }
            },
            {
              title: '数量',
              field:
                'caseCount',
              width: 80,
              hidden: false,
              editor: {
                type:
                  'input',
                field:
                  'caseCount',
                options: {
                  type:
                    'input',
                  inputType:
                    'text'
                }
              }
            },
            {
              title: '级别',
              field:
                'caseLevel',
              width: 80,
              hidden: false,
              showFilter: false,
              showSort: false,
              editor: {
                type:
                  'input',
                field:
                  'caseLevel',
                options: {
                  type:
                    'input',
                  inputType:
                    'text'
                }
              }
            },
            {
              title: '父类别',
              field:
                'parentName',
              width: 80,
              hidden: false,
              showFilter: false,
              showSort: false,
              editor: {
                type:
                  'input',
                field:
                  'parentId',
                options: {
                  type:
                    'selectTree',
                  name:
                    'parentId',
                  label:
                    '父类别',
                  notFoundContent:
                    '',
                  selectModel: false,
                  showSearch: true,
                  placeholder:
                    '--请选择--',
                  disabled: false,
                  size:
                    'default',
                  columns: [
                    {
                      title:
                        '主键',
                      field:
                        'key',
                      valueName:
                        'Id'
                    },
                    {
                      title:
                        '父节点',
                      field:
                        'parentId',
                      valueName:
                        'parentId'
                    },
                    {
                      title:
                        '标题',
                      field:
                        'title',
                      valueName:
                        'caseName'
                    }
                  ],
                  ajaxConfig: {
                    url:
                      'common/ShowCase',
                    ajaxType:
                      'get',
                    params: []
                  },
                  layout:
                    'column',
                  span:
                    '24'
                }
              }
            },
            {
              title:
                '创建时间',
              field:
                'createDate',
              width: 80,
              hidden: false,
              dataType:
                'date',
              editor: {
                type:
                  'input',
                pipe:
                  'datetime',
                field:
                  'createDate',
                options: {
                  type:
                    'input',
                  inputType:
                    'datetime'
                }
              }
            },
            {
              title: '备注',
              field: 'remark',
              width: 80,
              hidden: false,
              editor: {
                type:
                  'input',
                field:
                  'remark',
                options: {
                  type:
                    'input',
                  inputType:
                    'text'
                }
              }
            },
            {
              title: '状态',
              field:
                'enabledText',
              width: 80,
              hidden: false,
              formatter: [
                {
                  value:
                    '启用',
                  bgcolor:
                    '',
                  fontcolor:
                    'text-blue',
                  valueas:
                    '启用'
                },
                {
                  value:
                    '禁用',
                  bgcolor:
                    '',
                  fontcolor:
                    'text-red',
                  valueas:
                    '禁用'
                }
              ],
              editor: {
                type:
                  'select',
                field:
                  'enabled',
                options: {
                  type:
                    'select',
                  inputType:
                    'submit',
                  name:
                    'enabled',
                  notFoundContent:
                    '',
                  selectModel: false,
                  showSearch: true,
                  placeholder:
                    '-请选择-',
                  disabled: false,
                  size:
                    'default',
                  clear: true,
                  width:
                    '80px',
                  options: [
                    {
                      label:
                        '启用',
                      value: true,
                      disabled: false
                    },
                    {
                      label:
                        '禁用',
                      value: false,
                      disabled: false
                    }
                  ]
                }
              }
            }
          ],
          componentType: {
            parent: true,
            child: false,
            own: true
          },
          toolbar: [
            {
              group: [
                {
                  name:
                    'refresh',
                  action:
                    'REFRESH',
                  text:
                    '刷新',
                  color:
                    'text-primary',
                  cancelPermission: true
                }
              ]
            }
          ]
        }
      }
    },
    {
      name: 'businesskey2',
      type: 'tree',
      config: {
        viewId: 'tree_and_form_tree',
        component: 'bsnAsyncTree',
        asyncData: true, //
        expandAll: false, //
        checkable: false, //    在节点之前添加一个复选框 false
        showLine: false, //   显示连接线 fal
        columns: [
          // 字段映射，映射成树结构所需
          {
            title: '主键',
            field: 'key',
            valueName: 'Id'
          },
          {
            title: '父节点',
            field: 'parentId',
            valueName: 'parentId'
          },
          {
            title: '标题',
            field: 'title',
            valueName: 'caseName'
          }
        ],
        componentType: {
          parent: true,
          child: false,
          own: false
        },
        parent: [
          {
            name: 'parentId',
            type: 'value',
            valueName: '',
            value: 'null'
          }
        ],
        ajaxConfig: {
          url: 'common/ShowCase',
          ajaxType: 'get',
          params: [
            {
              name: 'parentId',
              type: 'componentValue',
              valueName: '',
              value: 'null'
            }
          ]
        },
        expand: [
          {
            type: false,
            ajaxConfig: {
              url: 'common/ShowCase',
              ajaxType: 'get',
              params: [
                {
                  name: 'parentId',
                  type:
                    'componentValue',
                  valueName: '',
                  value: ''
                }
              ]
            }
          }
        ]
      }

    }
  ]


  public showModal(): void {
    this.isVisible = true;
    // _selectedNode


  }

  public handleOk(): void {
    this.isVisible = false;
    this._value = this.ck_value;

    // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
  }

  public handleCancel(): void {

    this.isVisible = false;
  }

  public valueChangeByModal(data?) {

    this.ck_value = data['name'] ? data['name'] : data['title'];

    if ( this.ck_value && this.tags.indexOf( this.ck_value) === -1) {
      this.tags.push( this.ck_value);
    }
  }


  // tslint:disable-next-line:member-ordering
  public tags = ['Unremovable', 'Tag 2', 'Tag 3'];
  // tslint:disable-next-line:member-ordering
  public inputVisible = false;
  // tslint:disable-next-line:member-ordering
  private inputValue1 = '';
  // tslint:disable-next-line:member-ordering
  public handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  public sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }



  public handleInputConfirm(): void {
    if (this.inputValue1 && this.tags.indexOf(this.inputValue1) === -1) {
      this.tags.push(this.inputValue1);
    }
    this.inputValue1 = '';
    this.inputVisible = false;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigPack_ConfigType } from '../../../model/APIModel/AppConfigPack';
/**
 * 功能设计：
 * 1、用户的所有布局设置统一为添加新布局
 * 2、布局维护提供列表选择和删除功能，用户可以自行设置启用和禁用布局效果
 * 3、目前用户一次性只可以启用一种布局设置
 */
@Component({
  selector: 'layout-setting',
  templateUrl: './layout-setting.component.html'
})
export class LayoutSettingComponent implements OnInit {
  // 加载模块数据
  _funcOptions: any[] = [];
  // 定义布局模版
  _layoutOptions = [
    {
      value: {
        id: 'area1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 24,
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    ngXl: 24
                  }
                }
              ]
            }
          }
        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: '单页面'
    },
    {
      value: {
        id: 'area1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 6,
                  size: {
                    nzXs: 6,
                    nzSm: 6,
                    nzMd: 6,
                    nzLg: 6,
                    ngXl: 6
                  }
                },
                {
                  id: 'area2',
                  title: '区域2',
                  span: 18,
                  size: {
                    nzXs: 18,
                    nzSm: 18,
                    nzMd: 18,
                    nzLg: 18,
                    ngXl: 18
                  }
                }
              ]
            }
          }
        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area2',
            title: '区域 2',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: '左右结构'
    },
    {
      value: {
        title: '标题 1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 24,
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    ngXl: 24
                  }
                }
              ]
            }
          },
          {
            row: {
              cols: [
                {
                  id: 'area2',
                  title: '区域2',
                  span: 24,
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    ngXl: 24
                  }
                }
              ]
            }
          }
        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area2',
            title: '区域 2',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: '上下结构'
    },
    {
      value: {
        title: '标题 1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 6,
                  size: {
                    nzXs: 6,
                    nzSm: 6,
                    nzMd: 6,
                    nzLg: 6,
                    ngXl: 6
                  }
                },
                {
                  title: '区域2',
                  span: 18,
                  size: {
                    nzXs: 18,
                    nzSm: 18,
                    nzMd: 18,
                    nzLg: 18,
                    ngXl: 18
                  },
                  rows: [
                    {
                      row: {
                        cols: [
                          {
                            id: 'area2',
                            title: '区域2',
                            span: 24,
                            size: {
                              nzXs: 24,
                              nzSm: 24,
                              nzMd: 24,
                              nzLg: 24,
                              ngXl: 24
                            }
                          }
                        ]
                      }
                    },
                    {
                      row: {
                        cols: [
                          {
                            id: 'area3',
                            title: '区域3',
                            span: 24,
                            size: {
                              nzXs: 24,
                              nzSm: 24,
                              nzMd: 24,
                              nzLg: 24,
                              ngXl: 24
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          }
        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area2',
            title: '区域 2',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area3',
            title: '区域 3',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: 'T1 型结构'
    },
    {
      value: {
        title: '标题 1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 24,
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    ngXl: 24
                  }
                }
              ]
            }
          },
          {
            row: {
              cols: [
                {
                  id: 'area2',
                  title: '区域2',
                  span: 12,
                  size: {
                    nzXs: 12,
                    nzSm: 12,
                    nzMd: 12,
                    nzLg: 12,
                    ngXl: 12
                  }
                },
                {
                  id: 'area3',
                  title: '区域3',
                  span: 12,
                  size: {
                    nzXs: 12,
                    nzSm: 12,
                    nzMd: 12,
                    nzLg: 12,
                    ngXl: 12
                  },
                }
              ]
            }
          }
        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area1_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area2',
            title: '区域 2',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area3',
            title: '区域 3',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: 'T2 型结构'
    },
    {
      value: {
        title: '标题 1',
        rows: [
          {
            row: {
              cols: [
                {
                  id: 'area1',
                  title: '区域1',
                  span: 12,
                  size: {
                    nzXs: 12,
                    nzSm: 12,
                    nzMd: 12,
                    nzLg: 12,
                    ngXl: 12
                  }
                },
                {
                  id: 'area2',
                  title: '区域3',
                  span: 12,
                  size: {
                    nzXs: 12,
                    nzSm: 12,
                    nzMd: 12,
                    nzLg: 12,
                    ngXl: 12
                  },
                }
              ]
            }
          },
          {
            row: {
              cols: [
                {
                  id: 'area3',
                  title: '区域3',
                  span: 24,
                  size: {
                    nzXs: 24,
                    nzSm: 24,
                    nzMd: 24,
                    nzLg: 24,
                    ngXl: 24
                  }
                }
              ]
            }
          },

        ],
        layoutEditor: [
          {
            name: 'area1',
            title: '区域 1',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area3_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area2',
            title: '区域 2',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          },
          {
            name: 'area3',
            title: '区域 3',
            data: [
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_title',
                'label': '标题',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_icon',
                'label': '图标',
                'placeholder': 'icon-plus',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              },
              {
                'type': 'input',
                'labelSize': '4',
                'controlSize': '12',
                'inputType': 'text',
                'name': 'area2_color',
                'label': '颜色',
                'placeholder': '',
                'disabled': false,
                'readonly': false,
                'size': 'default'
              }
            ]
          }
        ]
      },
      label: 'T3 型结构'
    }
  ];
  // 被选中功能对象
  _funcValue;
  // 被选中布局对象
  _layoutValue;
  // 配置名称
  _configName;
  // 布局编辑表单对象
  _formGroup: FormGroup;
  // 布局编辑表单配置对象
  _editorConfig;
  // 布局列表配置对象

  _selectedModuleText;
  _tableHeader = {
    'keyId': 'key',
    'nzIsPagination': false, // 是否分页
    'nzShowTotal': true, // 是否显示总数据量
    'pageSize': 5, // 默认每页数据条数
    'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
    'nzLoading': false, // 是否显示加载中
    'nzBordered': false, // 是否显示边框
    'columns': [
      { title: '主键', field: 'key', width: 'auto', hidden: true },
      { title: 'ID', field: 'Id', width: 'auto', hidden: true },
      { title: '布局名称', field: 'Name', width: 'auto' },
      { title: '模版名称', field: 'Template', width: 'auto', hidden: false },
      { title: '是否启用', field: 'Enabled', width: 'auto', hidden: false },
      { title: '创建时间', field: 'CreateTime', width: 'auto', hidden: false }
    ],
    'toolbar': [
      { 'name': 'status', 'class': 'editable-add-btn', 'text': '启用/禁用' },
      { 'name': 'delete', 'class': 'editable-add-btn', 'text': '删除' },
    ]
  };
  // 布局列表数据
  total = 1;
  pageIndex = 1;
  pageSize = 15;
  loading = false;
  _tableDataSource = [];
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private message: NzMessageService) { }

  async ngOnInit() {
    this._formGroup = this.formBuilder.group({});
    // const params = new HttpParams().set();
    const params = { _select: 'Id,Name,ParentId' };
    const moduleData = await this.getModuleData(params);
    // 初始化模块列表，将数据加载到及联下拉列表当中
    this._funcOptions = this.arrayToTree(moduleData.Data, '');
  }

  // 获取模块信息
  async getModuleData(params) {
    return this.apiService.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  // 获取布局设置列表
  async getLayoutConfigData(params) {
    return this.apiService.getProj(APIResource.LayoutSetting, params).toPromise();
  }

  async getBlockConfigData(layoutId) {
    return this.apiService.getProj(APIResource.BlockSetting, { LayoutId: layoutId }).toPromise();
  }

  // 改变模块选项
  _changeModuleValue($event?) {
    // 选择功能模块，首先加载服务端配置列表
    // const params = new HttpParams().set('TagA', this._funcValue.join(','));
    this.loadLayout();
  }

  loadLayout() {
    if (this._funcValue.length > 0) {
      const params = {
        ModuleId: this._funcValue[this._funcValue.length - 1]
      };
      this.getLayoutConfigData(params).then(serverLayoutData => {
        this.loading = true;
        if (serverLayoutData.Status === 200 && serverLayoutData.Data.length > 0) {
          this._tableDataSource = serverLayoutData.Data;
          for (let i = 0, len = this._tableDataSource.length; i < len; i++) {
            (async () => {
              const result = await this.getBlockConfigData(this._tableDataSource[i].Id);
              if (result.Data && result.Status) {
                this._tableDataSource[i]['BlockList'] = result.Data;
                this._tableDataSource[i]['expand'] = false;
              }
            })();
          }
        } else {
          this._tableDataSource = [];
        }
        this.loading = false;
      });
    }
  }

  // 改变布局选项
  _changeLayout($event) {
    // 生成布局设置表单
    this._editorConfig = $event.value.layoutEditor;
    // 创建表单操作对象
    this._formGroup = this.createGroup();
  }

  _onSelectionChange(selectedOptions: any[]) {
    this._selectedModuleText = `【${selectedOptions.map(o => o.label).join(' / ')}】`;
  }

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this._formGroup.reset();
    for (const key in this._formGroup.controls) {
      this._formGroup.controls[key].markAsPristine();
    }
  }

  _submitForm($event) {
    event.preventDefault();
    event.stopPropagation();
    const loadingMessage = this.message.loading('正在执行中...', { nzDuration: 0 }).messageId;
    // 为每个区域设置标题
    this.overrideLayoutTitle(this._layoutValue.value.rows, this.value);
    // 获取模块ID，格式为将按照模块层级依次保存为数组形式，后续按照模块加载时，层级最后的ID即为对应加载模块ID
    const moduleID = this._funcValue[this._funcValue.length - 1];
    const layoutName = this._layoutValue.label;
    const copyLayout = JSON.parse(JSON.stringify(this._layoutValue.value));
    const blockDataList = this.overrideLayoutId(copyLayout);
    const metadata = JSON.stringify(copyLayout);
    const configName = this._configName;
    // 配置信息保存入数据库

    const configData = {
      ModuleId: moduleID,
      Template: layoutName,
      Name: configName,
      Metadata: metadata,
      Enabled: true
    };

    (async () => {
      const layout = await this.addSettingLayout(configData);
      if (layout.Data && layout.Status === 200) {
        for (let i = 0, len = blockDataList.length; i < len; i++) {
          blockDataList[i]['LayoutId'] = layout.Data.Id;
          blockDataList[i]['ParentId'] = moduleID;
          blockDataList[i]['type'] = 'view'; 
          const block = await this.addBlockSetting(blockDataList[i]);
        }


        // const viewData = this._layoutValue.value.layoutEditor;
        // for (let i = 0, len = viewData.length; i < len; i++) {
        //   for (let j = 0, jlen = viewData[i].data.length; j < jlen; j++) {
        //    console.log(viewData[i], viewData[i].data);
        //    const blockData = {
        //     Title: viewData[i].data[j].title,
        //     Icon: viewData[i].data[j].icon,
        //     LayoutId: layout.Id,
        //     type: 'view'
        //   };
        //   const block = await this.addBlockSetting(blockData);
        //   }
        // }
      } else {
        this.message.create('error', layout.Message);
      }
      this.message.remove(loadingMessage);
      this.loadLayout();
    })();


    // this.apiService.postProj(
    //   APIResource.LayoutSetting,
    //   configData).subscribe(response => {
    //     this.message.remove(loadingMessage);
    //     if (response && response.Status === 200) {
    //       this.message.create('success', '执行成功');
    //       this._changeModuleValue();
    //     } else {
    //       this.message.create('warning', `出现异常：${response.Message}`);
    //     }
    //   });
  }

  async addSettingLayout(data) {
    return this.apiService.postProj(APIResource.LayoutSetting, data).toPromise();

  }

  async addBlockSetting(data) {
    return this.apiService.postProj(APIResource.BlockSetting, data).toPromise();
  }

  private uuID(w) {
    let s = '';
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < w; i++) {
      s += str.charAt(Math.round(Math.random() * (str.length - 1)));
    }
    return s;
  }

  overrideLayoutId(layoutValue) {
    const blockDataList = [];
    layoutValue.rows.forEach(row => {
      row.row.cols.forEach(col => {
        col.id = this.uuID(10);
        blockDataList.push({ Title: col.title, Icon: '' });
        if (col.rows) {
          blockDataList.push(...this.overrideLayoutId(col));
        }
      });
    });
    return blockDataList;
  }

  overrideLayoutTitle(rows, formData) {
    rows.forEach(rowItem => {
      rowItem.row.cols.forEach(col => {
        // 根据ID与布局区域对应名称，更新表单提交的区域标题
        col.title = this.value[`${col.id}_title`];
        if (col.rows) {
          this.overrideLayoutTitle(col.rows, formData);
        }
      });
    });
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

  get controlsData() {
    return this._editorConfig.filter(({ type }) => {
      return type !== 'button';
    });
  }

  get controls() {
    return this._editorConfig.filter(({ type }) => {
      return type !== 'button';
    });
  }

  get changes() {
    return this._formGroup.valueChanges;
  }

  get valid() {
    return this._formGroup.valid;
  }

  get value() {
    return this._formGroup.value;
  }

  createGroup() {
    const group = this.formBuilder.group({});
    this.controls.forEach(controlData => {
      controlData.data.forEach(control => {
        group.addControl(control.name, this.createControl(control));
      });

    });
    return group;
  }

  createControl(config) {
    const { disabled, validation, value } = config;
    return this.formBuilder.control({ disabled, value }, validation);
  }
}

import { Component, OnInit, ViewChild, Type, Input, ComponentRef, ViewContainerRef, AfterViewInit, OnChanges, ComponentFactoryResolver, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { BsnDataTableComponent } from '@shared/business/bsn-data-table/bsn-data-table.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { Validators } from '@angular/forms';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { NzMessageService, NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { TabsResolverComponent } from '@shared/resolver/tabs-resolver/tabs-resolver.component';
import { AppConfigPack_Block } from 'app/model/APIModel/AppConfigPack';
const component: { [type: string]: Type<any> } = {
    bsnDataTable: BsnDataTableComponent,
    form_view: FormResolverComponent,
    tabs: TabsResolverComponent
};
@Component({
    selector: 'cn-setting-component-editor',
    templateUrl: './setting-component-editor.component.html',
})
export class SettingComponentEditorComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() config;
    @Input() blockId;
    @Input() layoutId;
    _serverLayoutId;
    _dataStruct = {
        bsnDataTable: {
            component: 'bsnDataTable',
            config: {
                'keyId': 'key',
                'nzIsPagination': false, // 是否分页
                'nzShowTotal': true, // 是否显示总数据量
                'pageSize': 5, // 默认每页数据条数
                'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                'nzLoading': false, // 是否显示加载中
                'nzBordered': false, // 是否显示边框
                'columns': [
                    {
                        title: '主键', field: 'key', width: 80, hidden: true
                    },
                    {
                        title: '姓名', field: 'name', width: 80
                    },
                    {
                        title: '性别', field: 'sexname', width: 80, hidden: false
                    },
                    {
                        title: '年龄', field: 'age', width: 80, hidden: false
                    },
                    {
                        title: '地址', field: 'address', width: 80, hidden: false,
                    }
                ]
            },
            dataList: []
        },
        form_view: {
            component: 'form_view',
            config: [
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'userName',
                    'label': '用户姓名',
                    'placeholder': '例如：Company.cn.app',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default',
                    'validations': [
                        {
                            'validator': 'required',
                            'errorMessage': '不能为空'
                        },
                        {
                            'validator': 'minlength',
                            'length': 6,
                            'errorMessage': '最小长度为6'
                        }
                    ],
                    'validation': [Validators.required, Validators.minLength(6)]
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'userPassword',
                    'label': '用户密码',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default',
                    /*'validations': [
                     {
                     'validator': 'required',
                     'errorMessage': ''
                     },
                     {
                     'validator': 'minLength',
                     'length': 6,
                     'errorMessage': ''
                     }
                     ]*/
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'sex',
                    'label': '性别',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '男',
                            'value': '1',
                            'disabled': false
                        },
                        {
                            'label': '女',
                            'value': '2',
                            'disabled': false
                        }
                    ]
                },
                {
                    'type': 'datePicker',
                    'labelSize': '6',
                    'controlSize': '10',
                    'name': 'datePicker',
                    'label': '日期',
                    'placeholder': '--请选择日期--',
                    'dateModel': 'day',
                    'format': 'YYYY-MM-DD',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'timePicker',
                    'labelSize': '6',
                    'controlSize': '10',
                    'format': 'HH:mm:ss',
                    'name': 'timePicker',
                    'label': '时间',
                    'placeholder': '--请选择时间--',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'rangePicker',
                    'labelSize': '6',
                    'controlSize': '10',
                    'format': 'YYYY-MM-DD',
                    'name': 'dateRangePicker',
                    'dateModel': 'day',
                    'label': '日期',
                    'placeholder': ['--开始日期--', '--结束日期--'],
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'checkbox',
                    'labelSize': '6',
                    'controlSize': '10',
                    'name': 'checkbox',
                    'label': '爱好',
                    'disabled': false
                },
                {
                    'type': 'checkboxGroup',
                    'labelSize': '6',
                    'controlSize': '10',
                    'name': 'checkbox',
                    'label': '特长',
                    'disabled': false,
                    'options': [
                        { label: 'Apple', value: 'Apple', checked: true },
                        { label: 'Pear', value: 'Pear' },
                        { label: 'Orange', value: 'Orange' }
                    ]
                },
                {
                    'type': 'radioGroup',
                    'labelSize': '6',
                    'controlSize': '10',
                    'name': 'radioGroup',
                    'label': '专业',
                    'disabled': false,
                    'options': [
                        { label: 'Apple', value: 'Apple', checked: true },
                        { label: 'Pear', value: 'Pear' },
                        { label: 'Orange', value: 'Orange' }
                    ]
                },
                {
                    'type': 'submit',
                    'offsetSize': '6',
                    'controlSize': '10',
                    'name': 'submit'
                }
            ],
            dataList: []
        }
    };
    menuConfig = [
        {
            label: '表格组件',
            value: {},
            children: [
                {
                    label: '数据网格',
                    value: {
                        viewId: '0001',
                        title: '数据网格',
                        component: 'bsnDataTable',
                        type: 'list',
                        config: {
                            'keyId': 'key',
                            'nzIsPagination': false, // 是否分页
                            'nzShowTotal': true, // 是否显示总数据量
                            'pageSize': 5, // 默认每页数据条数
                            'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                            'nzLoading': false, // 是否显示加载中
                            'nzBordered': false, // 是否显示边框
                            'columns': [
                                {
                                    title: '主键', field: 'key', width: 80, hidden: true
                                },
                                {
                                    title: '姓名', field: 'name', width: 80
                                },
                                {
                                    title: '性别', field: 'sexname', width: 80, hidden: false
                                },
                                {
                                    title: '年龄', field: 'age', width: 80, hidden: false
                                },
                                {
                                    title: '地址', field: 'address', width: 80, hidden: false,
                                }
                            ]
                        },
                        dataList: [
                            {
                                key: `key0`,
                                name: `用户 1`,
                                age: '32',
                                sexname: '女',
                                sex: '1',
                                address: `中国`,
                            },
                            {
                                key: `key1`,
                                name: `用户 2`,
                                age: '32',
                                sexname: '女',
                                sex: '1',
                                address: `中国`,
                            },
                            {
                                key: `key2`,
                                name: `用户 3`,
                                age: '32',
                                sexname: '女',
                                sex: '1',
                                address: `中国`,
                            }
                        ]
                    }
                }
            ]
        },
        {
            label: '表单组件',
            value: {},
            children: [
                {
                    label: '基本表单',
                    value: {
                        viewId: '002',
                        title: '基本表单',
                        component: 'form_view',
                        type: 'component',
                        'config': [
                            {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                                'name': 'userName',
                                'label': '用户姓名',
                                'placeholder': '例如：Company.cn.app',
                                'disabled': false,
                                'readonly': false,
                                'size': 'default',
                                'validations': [
                                    {
                                        'validator': 'required',
                                        'errorMessage': '不能为空'
                                    },
                                    {
                                        'validator': 'minlength',
                                        'length': 6,
                                        'errorMessage': '最小长度为6'
                                    }
                                ],
                                'validation': [Validators.required, Validators.minLength(6)]
                            },
                            {
                                'type': 'input',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'text',
                                'name': 'userPassword',
                                'label': '用户密码',
                                'placeholder': '',
                                'disabled': false,
                                'readonly': false,
                                'size': 'default',
                                /*'validations': [
                                 {
                                 'validator': 'required',
                                 'errorMessage': ''
                                 },
                                 {
                                 'validator': 'minLength',
                                 'length': 6,
                                 'errorMessage': ''
                                 }
                                 ]*/
                            },
                            {
                                'type': 'select',
                                'labelSize': '6',
                                'controlSize': '10',
                                'inputType': 'submit',
                                'name': 'sex',
                                'label': '性别',
                                'notFoundContent': '',
                                'selectModel': false,
                                'showSearch': true,
                                'placeholder': '--请选择--',
                                'disabled': false,
                                'size': 'default',
                                'options': [
                                    {
                                        'label': '男',
                                        'value': '1',
                                        'disabled': false
                                    },
                                    {
                                        'label': '女',
                                        'value': '2',
                                        'disabled': false
                                    }
                                ]
                            },
                            {
                                'type': 'datePicker',
                                'labelSize': '6',
                                'controlSize': '10',
                                'name': 'datePicker',
                                'label': '日期',
                                'placeholder': '--请选择日期--',
                                'dateModel': 'day',
                                'format': 'YYYY-MM-DD',
                                'disabled': false,
                                'readonly': false,
                                'size': 'default'
                            },
                            {
                                'type': 'timePicker',
                                'labelSize': '6',
                                'controlSize': '10',
                                'format': 'HH:mm:ss',
                                'name': 'timePicker',
                                'label': '时间',
                                'placeholder': '--请选择时间--',
                                'disabled': false,
                                'readonly': false,
                                'size': 'default'
                            },
                            {
                                'type': 'rangePicker',
                                'labelSize': '6',
                                'controlSize': '10',
                                'format': 'YYYY-MM-DD',
                                'name': 'dateRangePicker',
                                'dateModel': 'day',
                                'label': '日期',
                                'placeholder': ['--开始日期--', '--结束日期--'],
                                'disabled': false,
                                'readonly': false,
                                'size': 'default'
                            },
                            {
                                'type': 'checkbox',
                                'labelSize': '6',
                                'controlSize': '10',
                                'name': 'checkbox',
                                'label': '爱好',
                                'disabled': false
                            },
                            {
                                'type': 'checkboxGroup',
                                'labelSize': '6',
                                'controlSize': '10',
                                'name': 'checkbox',
                                'label': '特长',
                                'disabled': false,
                                'options': [
                                    { label: 'Apple', value: 'Apple', checked: true },
                                    { label: 'Pear', value: 'Pear' },
                                    { label: 'Orange', value: 'Orange' }
                                ]
                            },
                            {
                                'type': 'radioGroup',
                                'labelSize': '6',
                                'controlSize': '10',
                                'name': 'radioGroup',
                                'label': '专业',
                                'disabled': false,
                                'options': [
                                    { label: 'Apple', value: 'Apple', checked: true },
                                    { label: 'Pear', value: 'Pear' },
                                    { label: 'Orange', value: 'Orange' }
                                ]
                            },
                            {
                                'type': 'submit',
                                'offsetSize': '6',
                                'controlSize': '10',
                                'name': 'submit'
                            }
                        ],
                        'dataList': []
                    }
                }
            ]
        },
        {
            label: '列表组件',
            value: {},
            children: [
                {
                    label: '数据列表',
                    value: {}
                }
            ]
        },
        {
            label: '树组件',
            value: {},
            children: [
                {
                    label: '树组件',
                    value: {}
                }
            ]
        },
        {
            label: '布局组件',
            value: {},
            children: [
                {
                    label: '标签页',
                    value: {
                        component: 'tabs',
                        type: 'list',
                        config: [
                            {
                                id: `tab_${this.uuID(6)}`,
                                name: `Tab 1`,
                                config: {}
                            }
                        ]
                    }
                },
                {
                    label: '分步页',
                    value: {}
                },
                {
                    label: '折叠面板',
                    value: {}
                }
            ]
        }
    ];
    componentRef: ComponentRef<any>;
    @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
    _currentComponentData;
    private dropdown: NzDropdownContextComponent;
    constructor(
        private _http: ApiService,
        private message: NzMessageService,
        private resolver: ComponentFactoryResolver,
        private nzDropdownService: NzDropdownService
    ) { }

    ngOnInit() {

    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }

    async ngAfterViewInit() {
        // 获取组件区域数据
        const params = {
            Name: this.blockId,     // 区域ID
            // TagB: '',               // 组件类型
            ParentId: this.layoutId // 布局ID
        };
        this._http.get(APIResource.AppConfigPack, params).subscribe(result => {
            if (result && result.Status === 200) {
                result.Data.forEach(data => {
                    const comp = data.TagB.substring(data.TagB.lastIndexOf('.') + 1, data.TagB.length);
                    if (comp === 'tabs') {
                        const d = {};
                        d['config'] = JSON.parse(data.Metadata);
                        d['dataList'] = [];
                        d['component'] = comp;
                        this.createBsnComponent(d);
                    } else {
                        this.createBsnComponent(this._dataStruct[comp]);
                    }

                    this._serverLayoutId = data.Id;
                });

                /*result.Data.forEach(data => {
                  this.menuConfig.forEach(menu => {
                    menu.children.forEach(componentCfg => {
                      if(componentCfg.value.component === data.Name) {
                        this.createBsnComponent(componentCfg.value);
                        this._serverLayoutId = data.Id;
                      }
                    });
                  });
                });*/
            }
        });
    }

    ngOnChanges() {
        this.createBsnComponent();
    }

    createBsnComponent(event?) {
        if (event) {
            this.config = event;
        }
        if (this.config && this.config.component) {
            if (!component[this.config.component]) {
                const supportedTypes = Object.keys(component).join(', ');
                throw new Error(
                    `Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`
                );
            }
            this.container.clear();
            const comp = this.resolver.resolveComponentFactory<any>(component[this.config.component]);
            this.componentRef = this.container.createComponent(comp);
            this.componentRef.instance.config = this.config.config;
            this.componentRef.instance.dataList = this.config.dataList;
            this.componentRef.instance.layoutId = this.layoutId;
            this.componentRef.instance.blockId = this.blockId;

            // 保存选中组件数据
            // BlockId,component,type,Metadata,Title,ParentId
            this._currentComponentData = {
                BlockId: this.blockId,
                Component: this.config.component,
                Type: this.config.type,
                Title: this.config.name,
                ParentId: this.layoutId,
                Metadata: JSON.stringify(this.config)
            };

            // console.log(this._currentComponentData);



        }

    }

    saveComponent(data) {
        if (this.config.type === 'list') {
            if (this.config.component === 'tabs') {

            }
        } else {
            this._http.postProj(APIResource.ViewSetting, data).subscribe(result => {
                if (result && result.Status === 200) {
                    if (result && result.Status === 200) {
                        this.message.success('保存成功');
                    } else {
                        this.message.warning(`出现异常: ${result.Message}`);
                    }
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            });
        }
    }

    _saveComponent() {
        const body: AppConfigPack_Block = {
            ParentId: this.layoutId,
            Name: this.blockId, // 组件名称
            TagA: this.uuID(10),
        };
        if (this.config.component === 'tabs') {
            body.Metadata = JSON.stringify(this.config.config);
            body.TagB = `tabs.${this.config.component}`;
        } else {
            body.TagB = `component.${this.config.component}`;
        }
        if (this._serverLayoutId) {
            body.Id = this._serverLayoutId;
            this._http.putProj(APIResource.AppConfigPack, body, { Id: this._serverLayoutId }).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        } else {
            this._http.postProj(APIResource.AppConfigPack, body).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        }
    }

    async getTabComponent(blockId) {
        const params = {
            ParentId: this.layoutId,
            TagA: blockId
        };
        return this._http.get(APIResource.AppConfigPack, params).toPromise();
    }

    uuID(w) {
        let s = '';
        const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < w; i++) {
            s += str.charAt(Math.round(Math.random() * (str.length - 1)));
        }
        return s;
    }
}

import { CommonTools } from "@core/utility/common-tools";
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Type,
    ViewChild,
    ViewContainerRef,
    TemplateRef
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { BsnDataTableComponent } from "@shared/business/bsn-data-table/bsn-data-table.component";
import { FormResolverComponent } from "@shared/resolver/form-resolver/form-resolver.component";
import { CnCodeEditComponent } from "@shared/components/cn-code-edit/cn-code-edit.component";
import { Validators } from "@angular/forms";
import { ApiService } from "@core/utility/api-service";
import { APIResource } from "@core/utility/api-resource";
import {
    AppConfigPackBlock,
    AppConfigPackConfigType
} from "../../../model/APIModel/AppConfigPack";
import {
    NzMessageService,
    NzDropdownService,
    NzDropdownContextComponent,
    NzTreeNode
} from "ng-zorro-antd";
import { TabsResolverComponent } from "@shared/resolver/tabs-resolver/tabs-resolver.component";
const component: { [type: string]: Type<any> } = {
    bsnDataTable: BsnDataTableComponent,
    form_view: FormResolverComponent,
    tabs: TabsResolverComponent
};
@Component({
    selector: "cn-component-setting-resolver",
    templateUrl: "./component-setting-resolver.component.html"
})
export class ComponentSettingResolverComponent
    implements OnInit, OnChanges, AfterViewInit {
    @Input()
    config;
    @Input()
    blockId;
    @Input()
    layoutId;
    @Input()
    bufferId;
    _serverLayoutId;
    _dataStruct = {
        bsnDataTable: {
            component: "bsnDataTable",
            config: {
                keyId: "key",
                nzIsPagination: false, // 是否分页
                nzShowTotal: true, // 是否显示总数据量
                pageSize: 5, // 默认每页数据条数
                nzPageSizeSelectorValues: [5, 10, 20, 30, 40, 50],
                nzLoading: false, // 是否显示加载中
                nzBordered: false, // 是否显示边框
                columns: [
                    {
                        title: "主键",
                        field: "key",
                        width: 80,
                        hidden: true
                    },
                    {
                        title: "姓名",
                        field: "name",
                        width: 80
                    },
                    {
                        title: "性别",
                        field: "sexname",
                        width: 80,
                        hidden: false
                    },
                    {
                        title: "年龄",
                        field: "age",
                        width: 80,
                        hidden: false
                    },
                    {
                        title: "地址",
                        field: "address",
                        width: 80,
                        hidden: false
                    }
                ]
            },
            dataList: []
        },
        form_view: {
            keyId: "Id",
            ajaxConfig: {},
            componentType: {
                parent: false,
                child: false,
                own: true
            },
            forms: [
                {
                    type: "input",
                    labelSize: "6",
                    controlSize: "10",
                    inputType: "text",
                    name: "userName",
                    label: "用户姓名",
                    placeholder: "例如：Company.cn.app",
                    disabled: false,
                    readonly: false,
                    size: "default",
                    validations: [
                        {
                            validator: "required",
                            errorMessage: "不能为空"
                        },
                        {
                            validator: "minlength",
                            length: 6,
                            errorMessage: "最小长度为6"
                        }
                    ],
                    validation: [Validators.required, Validators.minLength(6)]
                },
                {
                    type: "input",
                    labelSize: "6",
                    controlSize: "10",
                    inputType: "text",
                    name: "userPassword",
                    label: "用户密码",
                    placeholder: "",
                    disabled: false,
                    readonly: false,
                    size: "default"
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
                    type: "select",
                    labelSize: "6",
                    controlSize: "10",
                    inputType: "submit",
                    name: "sex",
                    label: "性别",
                    notFoundContent: "",
                    selectModel: false,
                    showSearch: true,
                    placeholder: "--请选择--",
                    disabled: false,
                    size: "default",
                    options: [
                        {
                            label: "男",
                            value: "1",
                            disabled: false
                        },
                        {
                            label: "女",
                            value: "2",
                            disabled: false
                        }
                    ]
                },
                {
                    type: "datePicker",
                    labelSize: "6",
                    controlSize: "10",
                    name: "datePicker",
                    label: "日期",
                    placeholder: "--请选择日期--",
                    dateModel: "day",
                    format: "YYYY-MM-DD",
                    disabled: false,
                    readonly: false,
                    size: "default"
                },
                {
                    type: "timePicker",
                    labelSize: "6",
                    controlSize: "10",
                    format: "HH:mm:ss",
                    name: "timePicker",
                    label: "时间",
                    placeholder: "--请选择时间--",
                    disabled: false,
                    readonly: false,
                    size: "default"
                },
                {
                    type: "rangePicker",
                    labelSize: "6",
                    controlSize: "10",
                    format: "YYYY-MM-DD",
                    name: "dateRangePicker",
                    dateModel: "day",
                    label: "日期",
                    placeholder: ["--开始日期--", "--结束日期--"],
                    disabled: false,
                    readonly: false,
                    size: "default"
                },
                {
                    type: "checkbox",
                    labelSize: "6",
                    controlSize: "10",
                    name: "checkbox",
                    label: "爱好",
                    disabled: false
                },
                {
                    type: "checkboxGroup",
                    labelSize: "6",
                    controlSize: "10",
                    name: "checkbox",
                    label: "特长",
                    disabled: false,
                    options: [
                        { label: "Apple", value: "Apple", checked: true },
                        { label: "Pear", value: "Pear" },
                        { label: "Orange", value: "Orange" }
                    ]
                },
                {
                    type: "radioGroup",
                    labelSize: "6",
                    controlSize: "10",
                    name: "radioGroup",
                    label: "专业",
                    disabled: false,
                    options: [
                        { label: "Apple", value: "Apple", checked: true },
                        { label: "Pear", value: "Pear" },
                        { label: "Orange", value: "Orange" }
                    ]
                },
                {
                    type: "submit",
                    offsetSize: "6",
                    controlSize: "10",
                    name: "submit"
                }
            ],
            toolbar: [
                {
                    name: "saveFrom",
                    class: "editable-add-btn",
                    text: "保存",
                    ajaxConfig: {}
                },
                {
                    name: "cancelRow",
                    class: "editable-add-btn",
                    text: "取消",
                    ajaxConfig: {}
                }
            ],
            relations: []
        }
    };
    menuConfig = [
        {
            label: "表格组件",
            value: {},
            children: [
                {
                    label: "数据网格",
                    value: {
                        viewId: "0001",
                        title: "数据网格",
                        component: "bsnDataTable",
                        type: "component",
                        config: {
                            keyId: "key",
                            nzIsPagination: false, // 是否分页
                            nzShowTotal: true, // 是否显示总数据量
                            pageSize: 5, // 默认每页数据条数
                            nzPageSizeSelectorValues: [5, 10, 20, 30, 40, 50],
                            nzLoading: false, // 是否显示加载中
                            nzBordered: false, // 是否显示边框
                            columns: [
                                {
                                    title: "主键",
                                    field: "key",
                                    width: 80,
                                    hidden: true
                                },
                                {
                                    title: "姓名",
                                    field: "name",
                                    width: 80
                                },
                                {
                                    title: "性别",
                                    field: "sexname",
                                    width: 80,
                                    hidden: false
                                },
                                {
                                    title: "年龄",
                                    field: "age",
                                    width: 80,
                                    hidden: false
                                },
                                {
                                    title: "地址",
                                    field: "address",
                                    width: 80,
                                    hidden: false
                                }
                            ]
                        },
                        dataList: [
                            {
                                key: `key0`,
                                name: `用户 1`,
                                age: "32",
                                sexname: "女",
                                sex: "1",
                                address: `中国`
                            },
                            {
                                key: `key1`,
                                name: `用户 2`,
                                age: "32",
                                sexname: "女",
                                sex: "1",
                                address: `中国`
                            },
                            {
                                key: `key2`,
                                name: `用户 3`,
                                age: "32",
                                sexname: "女",
                                sex: "1",
                                address: `中国`
                            }
                        ]
                    }
                }
            ]
        },
        {
            label: "表单组件",
            value: {},
            children: [
                {
                    label: "基本表单",
                    value: {
                        keyId: "Id",
                        title: "基本表单",
                        component: "form_view",
                        type: "component",
                        config: {
                            ajaxConfig: {},
                            componentType: {
                                parent: false,
                                child: false,
                                own: true
                            },
                            forms: [
                                {
                                    type: "input",
                                    labelSize: "6",
                                    controlSize: "10",
                                    inputType: "text",
                                    name: "userName",
                                    label: "用户姓名",
                                    placeholder: "例如：Company.cn.app",
                                    disabled: false,
                                    readonly: false,
                                    size: "default",
                                    validations: [
                                        {
                                            validator: "required",
                                            errorMessage: "不能为空"
                                        },
                                        {
                                            validator: "minlength",
                                            length: 6,
                                            errorMessage: "最小长度为6"
                                        }
                                    ],
                                    validation: [
                                        Validators.required,
                                        Validators.minLength(6)
                                    ]
                                },
                                {
                                    type: "input",
                                    labelSize: "6",
                                    controlSize: "10",
                                    inputType: "text",
                                    name: "userPassword",
                                    label: "用户密码",
                                    placeholder: "",
                                    disabled: false,
                                    readonly: false,
                                    size: "default",
                                    validations: [
                                        {
                                            validator: "required",
                                            errorMessage: ""
                                        },
                                        {
                                            validator: "minLength",
                                            length: 6,
                                            errorMessage: ""
                                        }
                                    ]
                                },
                                {
                                    type: "select",
                                    labelSize: "6",
                                    controlSize: "10",
                                    inputType: "submit",
                                    name: "sex",
                                    label: "性别",
                                    notFoundContent: "",
                                    selectModel: false,
                                    showSearch: true,
                                    placeholder: "--请选择--",
                                    disabled: false,
                                    size: "default",
                                    options: [
                                        {
                                            label: "男",
                                            value: "1",
                                            disabled: false
                                        },
                                        {
                                            label: "女",
                                            value: "2",
                                            disabled: false
                                        }
                                    ]
                                },
                                {
                                    type: "datePicker",
                                    labelSize: "6",
                                    controlSize: "10",
                                    name: "datePicker",
                                    label: "日期",
                                    placeholder: "--请选择日期--",
                                    dateModel: "day",
                                    format: "YYYY-MM-DD",
                                    disabled: false,
                                    readonly: false,
                                    size: "default"
                                },
                                {
                                    type: "timePicker",
                                    labelSize: "6",
                                    controlSize: "10",
                                    format: "HH:mm:ss",
                                    name: "timePicker",
                                    label: "时间",
                                    placeholder: "--请选择时间--",
                                    disabled: false,
                                    readonly: false,
                                    size: "default"
                                },
                                {
                                    type: "rangePicker",
                                    labelSize: "6",
                                    controlSize: "10",
                                    format: "YYYY-MM-DD",
                                    name: "dateRangePicker",
                                    dateModel: "day",
                                    label: "日期",
                                    placeholder: [
                                        "--开始日期--",
                                        "--结束日期--"
                                    ],
                                    disabled: false,
                                    readonly: false,
                                    size: "default"
                                },
                                {
                                    type: "checkbox",
                                    labelSize: "6",
                                    controlSize: "10",
                                    name: "checkbox",
                                    label: "爱好",
                                    disabled: false
                                },
                                {
                                    type: "checkboxGroup",
                                    labelSize: "6",
                                    controlSize: "10",
                                    name: "checkbox",
                                    label: "特长",
                                    disabled: false,
                                    options: [
                                        {
                                            label: "Apple",
                                            value: "Apple",
                                            checked: true
                                        },
                                        { label: "Pear", value: "Pear" },
                                        { label: "Orange", value: "Orange" }
                                    ]
                                },
                                {
                                    type: "radioGroup",
                                    labelSize: "6",
                                    controlSize: "10",
                                    name: "radioGroup",
                                    label: "专业",
                                    disabled: false,
                                    options: [
                                        {
                                            label: "Apple",
                                            value: "Apple",
                                            checked: true
                                        },
                                        { label: "Pear", value: "Pear" },
                                        { label: "Orange", value: "Orange" }
                                    ]
                                }
                            ],
                            toolbar: [
                                {
                                    name: "saveFrom",
                                    class: "editable-add-btn",
                                    text: "保存",
                                    ajaxConfig: {}
                                },
                                {
                                    name: "cancelRow",
                                    class: "editable-add-btn",
                                    text: "取消",
                                    ajaxConfig: {}
                                }
                            ],
                            relations: []
                        }
                    }
                }
            ]
        },
        {
            label: "列表组件",
            value: {},
            children: [
                {
                    label: "数据列表",
                    value: {}
                }
            ]
        },
        {
            label: "树组件",
            value: {},
            children: [
                {
                    label: "树组件",
                    value: {}
                }
            ]
        }
    ];
    componentRef: ComponentRef<any>;
    @ViewChild("dynamicComponent", { read: ViewContainerRef })
    container: ViewContainerRef;
    _currentComponentData;
    private dropdown: NzDropdownContextComponent;
    constructor(
        private apiService: ApiService,
        private message: NzMessageService,
        private resolver: ComponentFactoryResolver,
        private nzDropdownService: NzDropdownService
    ) {}

    ngOnInit() {}

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }

    ngAfterViewInit() {
        this._loadComponent();
    }

    ngOnChanges() {
        if (this.config) {
            // console.log('render', this.config);
            // this._renderComponent(this.config);
        }
    }

    private addComponent(event?) {
        if (event) {
            this.config = event;
        }
        if (event) {
            // 提交组件数据
            // 保存选中组件数据
            // BlockId,component,type,Metadata,Title,ParentId
            this._currentComponentData = {
                blockId: this.blockId,
                component: this.config.component,
                type: this.config.type,
                title: this.config.title,
                layoutId: this.layoutId,
                metadata: JSON.stringify(this.config),
                bufferId: `bufferId_${CommonTools.uuID(6)}`
            };
            this._saveComponent(this._currentComponentData, () => {
                // 渲染组件
                this._renderComponent(this.config);
            });
        }
    }

    private _loadComponent() {
        // 获取组件区域数据
        const params = {
            blockId: this.blockId, // 区域ID
            layoutId: this.layoutId // 布局ID
        };
        this.apiService
            .get("common/ViewSettingBuffer", params)
            .subscribe(result => {
                console.log(result);
                if (
                    result &&
                    result.status === 200 &&
                    result.isSuccess &&
                    result.data.length > 0
                ) {
                    console.log(result.data);
                    const d = {};
                    d["config"] = JSON.parse(result.data[0].metadata);
                    d["layoutId"] = result.data[0].parentId;
                    d["blockId"] = result.data[0].blockId;
                    this._renderComponent(d["config"]);
                    this._serverLayoutId = result.data[0].Id;
                }
            });
    }

    private _renderComponent(config) {
        if (config && config.component) {
            if (!component[config.component]) {
                const supportedTypes = Object.keys(component).join(", ");
                throw new Error(
                    `Trying to use an unsupported types (${
                        config.component
                    }).Supported types: ${supportedTypes}`
                );
            }
            this.container.clear();
            const comp = this.resolver.resolveComponentFactory<any>(
                component[config.component]
            );
            this.componentRef = this.container.createComponent(comp);
            this.componentRef.instance.config = config.config;
            this.componentRef.instance.dataList = config.dataList;
            this.componentRef.instance.layoutId = this.layoutId;
            this.componentRef.instance.blockId = this.blockId;
        }
    }

    private _saveComponent(data, callback) {
        if (this._serverLayoutId) {
            data["Id"] = this._serverLayoutId;
            this.apiService.put("common/ViewSettingBuffer", data).subscribe(
                result => {
                    if (result.status === 200 && result.isSuccess) {
                        this.message.success("保存成功");
                        callback();
                    } else {
                        this.message.warning(`出现异常: ${result.message}`);
                    }
                },
                error => {
                    this.message.error(`出现错误：${error}`);
                }
            );
        } else {
            this.apiService.post("common/ViewSettingBuffer", data).subscribe(
                result => {
                    if (result.status === 200 && result.isSuccess) {
                        this.message.success("保存成功");
                        callback();
                    } else {
                        this.message.warning(`出现异常: ${result.message}`);
                    }
                },
                error => {
                    this.message.error(`出现错误：${error}`);
                }
            );
        }
    }

    // region: properties editor

    editorContextMenu(
        $event: MouseEvent,
        template: TemplateRef<void>,
        node: NzTreeNode
    ): void {}

    nodeClick() {}
    // endregion
}

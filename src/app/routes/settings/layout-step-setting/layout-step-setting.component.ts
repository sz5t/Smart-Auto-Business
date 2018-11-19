import { _HttpClient } from "@delon/theme";
import { CommonTools } from "@core/utility/common-tools";
import { CacheService } from "@delon/cache";
import { Component, OnInit, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiService } from "@core/utility/api-service";
import { APIResource } from "@core/utility/api-resource";
import { NzMessageService } from "ng-zorro-antd";
import { AppConfigPackConfigType } from "../../../model/APIModel/AppConfigPack";

@Component({
    selector: "cn-layout-step-setting",
    templateUrl: "./layout-step-setting.component.html",
    styleUrls: ["./layout-step-setting.component.less"]
})
export class LayoutStepSettingComponent implements OnInit {
    current = 0;

    // 加载模块数据
    _funcOptions: any[] = [];
    // 定义布局模版
    _layoutOptions = [
        {
            value: {
                id: "area1",
                img: "./assets/img/1c.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "单页面"
        },
        {
            value: {
                id: "area1",
                img: "./assets/img/2u.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                                    id: "area2",
                                    title: "区域2",
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
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area2",
                        title: "区域 2",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "左右结构"
        },
        {
            value: {
                title: "标题 1",
                img: "./assets/img/2e.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                                    id: "area2",
                                    title: "区域2",
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
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area2",
                        title: "区域 2",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "上下结构"
        },
        {
            value: {
                title: "标题 1",
                img: "./assets/img/3l.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                                    title: "区域2",
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
                                                        id: "area2",
                                                        title: "区域2",
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
                                                        id: "area3",
                                                        title: "区域3",
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
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area2",
                        title: "区域 2",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area3",
                        title: "区域 3",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "T1 型结构"
        },
        {
            value: {
                title: "标题 1",
                img: "./assets/img/3u.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                                    id: "area2",
                                    title: "区域2",
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
                                    id: "area3",
                                    title: "区域3",
                                    span: 12,
                                    size: {
                                        nzXs: 12,
                                        nzSm: 12,
                                        nzMd: 12,
                                        nzLg: 12,
                                        ngXl: 12
                                    }
                                }
                            ]
                        }
                    }
                ],
                layoutEditor: [
                    {
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area1_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area2",
                        title: "区域 2",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area3",
                        title: "区域 3",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "T2 型结构"
        },
        {
            value: {
                title: "标题 1",
                img: "./assets/img/3t.bmp",
                rows: [
                    {
                        row: {
                            cols: [
                                {
                                    id: "area1",
                                    title: "区域1",
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
                                    id: "area2",
                                    title: "区域3",
                                    span: 12,
                                    size: {
                                        nzXs: 12,
                                        nzSm: 12,
                                        nzMd: 12,
                                        nzLg: 12,
                                        ngXl: 12
                                    }
                                }
                            ]
                        }
                    },
                    {
                        row: {
                            cols: [
                                {
                                    id: "area3",
                                    title: "区域3",
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
                        name: "area1",
                        title: "区域 1",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area3_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area2",
                        title: "区域 2",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    },
                    {
                        name: "area3",
                        title: "区域 3",
                        data: [
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_title",
                                label: "标题",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_icon",
                                label: "图标",
                                placeholder: "icon-plus",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            },
                            {
                                type: "input",
                                labelSize: "4",
                                controlSize: "12",
                                inputType: "text",
                                name: "area2_color",
                                label: "颜色",
                                placeholder: "",
                                disabled: false,
                                readonly: false,
                                size: "default"
                            }
                        ]
                    }
                ]
            },
            label: "T3 型结构"
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
    _showGuide = false;
    _btnText = "创建布局";
    // 布局ID
    _selectedLayoutId;
    _isShowExtend = false;
    _selectedModuleText;
    _tableHeader = {
        keyId: "key",
        nzIsPagination: false, // 是否分页
        nzShowTotal: true, // 是否显示总数据量
        pageSize: 5, // 默认每页数据条数
        nzPageSizeSelectorValues: [5, 10, 20, 30, 40, 50],
        nzLoading: false, // 是否显示加载中
        nzBordered: false, // 是否显示边框
        columns: [
            { title: "主键", field: "key", width: "auto", hidden: true },
            { title: "ID", field: "Id", width: "auto", hidden: true },
            { title: "布局名称", field: "Name", width: "auto" },
            {
                title: "模版名称",
                field: "Template",
                width: "auto",
                hidden: false
            },
            {
                title: "是否启用",
                field: "Enabled",
                width: "auto",
                hidden: false
            },
            {
                title: "创建时间",
                field: "CreateTime",
                width: "auto",
                hidden: false
            }
        ],
        toolbar: [
            { name: "status", class: "editable-add-btn", text: "启用/禁用" },
            { name: "delete", class: "editable-add-btn", text: "删除" }
        ]
    };
    _configDesc;
    _isShowPreview = false;
    // 布局列表数据
    total = 1;
    pageIndex = 1;
    pageSize = 5;
    loading = false;
    _tableDataSource = [];
    previewLayoutData = {};
    _currentUser: any;
    _bufferId;
    _configSuccess;
    _isEditData = false;
    constructor(
        private apiService: ApiService,
        private formBuilder: FormBuilder,
        private cacheService: CacheService,
        private message: NzMessageService
    ) {}

    ngOnInit() {
        (async () => {
            this._currentUser = this.cacheService.getNone("userInfo");
            this._bufferId = "buffer_" + CommonTools.uuID(6);
            this._formGroup = this.formBuilder.group({});
            const params = { _select: "Id,name,parentId" };
            const moduleData = await this.getModuleData(params);
            // 初始化模块列表，将数据加载到及联下拉列表当中
            this._funcOptions = this.arrayToTree(moduleData.data, null);
        })();
    }

    // 改变模块选项
    _changeModuleValue($event?) {
        // 选择功能模块，首先加载服务端配置列表
        this.loadLayout();
    }

    loadLayout() {
        if (this._funcValue.length > 0) {
            const params = {
                moduleId: this._funcValue[this._funcValue.length - 1]
            };
            this.getLayoutConfigData(params).then(serverLayoutData => {
                this.loading = true;
                if (
                    serverLayoutData.status === 200 &&
                    serverLayoutData.data &&
                    serverLayoutData.isSuccess
                ) {
                    this._tableDataSource = serverLayoutData.data;
                    (async () => {
                        for (
                            let i = 0, len = this._tableDataSource.length;
                            i < len;
                            i++
                        ) {
                            const layoutMetadata = JSON.parse(
                                this._tableDataSource[i].metadata
                            );
                            const result = await this.getBlockConfigData(
                                this._tableDataSource[i].Id,
                                this._funcValue[this._funcValue.length - 1]
                            );
                            for (
                                let j = 0, jlen = result.data.length;
                                j < jlen;
                                j++
                            ) {
                                const blockMeta = JSON.parse(
                                    result.data[j].metadata
                                );
                                blockMeta["id"] = result.data[j].Id;
                                result.data[j].metadata = blockMeta;
                                this.rewriteLayoutMeta(
                                    layoutMetadata,
                                    result.data[j]
                                );
                            }

                            if (
                                this._selectedLayoutId ===
                                this._tableDataSource[i].Id
                            ) {
                                this.previewLayoutData = JSON.parse(
                                    JSON.stringify(layoutMetadata)
                                );
                            }
                            this._isShowPreview = false;
                            this._tableDataSource[i]["data"] = layoutMetadata;
                        }
                    })();
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
        this._selectedModuleText = `${selectedOptions
            .map(o => o.label)
            .join(" / ")}`;
        this._setStepDesp();
    }

    showGuide() {
        this._showGuide = !this._showGuide;
        if (this._showGuide === true) {
            // 点击创建
            // 判断是否继续创建
            // 重新创建则清空数据
            // 还是继续创建，直接切换即可
        } else {
            // 点击返回
            this._isEditData = false;
            this._configDesc = "";
            this._configName = "";
            this._configSuccess = false;
            this._layoutValue = null;
            this.current = 0;
            this._bufferId = null;
        }
        this._configSuccess = "";
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
        const loadingMessage = this.message.loading("正在执行中...", {
            nzDuration: 0
        }).messageId;
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
            moduleId: moduleID,
            template: layoutName,
            name: configName,
            metadata: metadata,
            enabled: "1"
        };

        (async () => {
            const layout = await this.addSettingLayoutBuffer(configData);
            if (layout.data && layout.status === 200 && layout.isSuccess) {
                for (let i = 0, len = blockDataList.length; i < len; i++) {
                    blockDataList[i]["layoutId"] = layout.data.Id;
                    blockDataList[i]["parentId"] = moduleID;
                    blockDataList[i]["type"] = "view";
                    blockDataList[i]["showTitle"] = 1;
                    const block = await this.addBlockSettingBuffer(
                        blockDataList[i]
                    );
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
                this.message.create("error", layout.Message);
            }
            this.message.remove(loadingMessage);
            this.loadLayout();
        })();
    }

    rewriteLayoutMeta(layoutData, block) {
        for (let i = 0, len = layoutData.rows.length; i < len; i++) {
            for (
                let j = 0, jlen = layoutData.rows[i].row.cols.length;
                j < jlen;
                j++
            ) {
                if (layoutData.rows[i].row.cols[j].id === block.area) {
                    layoutData.rows[i].row.cols[j] = block.metadata;
                    if (layoutData.rows[i].row.cols[j].rows) {
                        this.rewriteLayoutMeta(
                            layoutData.rows[i].row.cols[j],
                            block
                        );
                    }
                }
            }
        }
    }

    editLayout(item) {
        // 显示布局页面
        // 加载布局页面布局效果
        // this.previewLayoutData = JSON.parse(item.metadata);
        this._showGuide = true;
        this._selectedLayoutId = item.Id;
        this._layoutValue = this.getLayoutTypeValue(item.template);
        this._configName = item.name;
        this._configDesc = item.description;
        this._isEditData = true;
        this._bufferId = item.bufferId;
    }

    enableLayout(item) {
        console.log(item);
        // 更新使用状态为启用，根据模块的编号，启用当前数据，禁用其他所有数据
    }

    private getLayoutTypeValue(name) {
        let value;
        this._layoutOptions.map(val => {
            if (val.label === name) {
                value = val;
            }
        });
        return value;
    }

    overrideLayoutId(layoutValue) {
        const blockDataList = [];
        layoutValue.rows.forEach(row => {
            row.row.cols.forEach(col => {
                const meta = JSON.stringify(col);
                blockDataList.push({
                    title: col.title,
                    icon: "",
                    area: col.id,
                    metadata: meta,
                    span: `${col.span}`,
                    size: JSON.stringify(col.size)
                });
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

    private arrayToTree(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const obj = { label: data[i].name, value: data[i].Id };
                temp = this.arrayToTree(data, data[i].Id);
                if (temp.length > 0) {
                    obj["children"] = temp;
                } else {
                    obj["isLeaf"] = true;
                }
                result.push(obj);
            }
        }
        return result;
    }

    get controlsData() {
        return this._editorConfig.filter(({ type }) => {
            return type !== "button";
        });
    }

    get controls() {
        return this._editorConfig.filter(({ type }) => {
            return type !== "button";
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

    // 返回上一步
    pre(): void {
        this.current -= 1;
        this._setStepDesp();
    }

    // 进行下一步
    next(): void {
        if (this.current === 0) {
            (async () => {
                let result;
                if (!this._isEditData) {
                    result = await this._saveLayoutBuffer();
                } else {
                    result = await this._updateLayoutBuffer();
                }
                if (result) {
                    this.current += 1;
                    this._setStepDesp();
                }
            })();
        }
    }

    extend() {
        // this.current += 1;
    }

    done(): void {
        (async () => {
            let result;
            if (!this._isEditData) {
                result = await this.createLayout();
            } else {
                result = await this.updateLayout();
            }
            if (result.isSuccess) {
                this.current += 1;
                this._setStepDesp();
            } else {
                this.message.create("error", result.message);
            }
        })();
    }

    _setStepDesp() {
        if (this.current === 0) {
            this._selectedModuleText = `正在为模块【${
                this._selectedModuleText
            }】创建布局`;
            this._configName = "";
            this._configSuccess = "";
        } else if (this.current === 1) {
            this._selectedModuleText = `布局创建完成`;
            this._configName = `正在编辑模块【${this._configName}】布局区域`;
            this._configSuccess = "";
        } else if (this.current === 2) {
            this._configName = `区域编辑完成`;
            this._configSuccess = "布局配置成功";
        }
    }

    async _saveLayoutBuffer() {
        let result = false;
        this._isShowPreview = true;
        // 保存布局
        const loadingMessage = this.message.loading("正在执行中...", {
            nzDuration: 0
        }).messageId;
        // 为每个区域设置标题
        // this.overrideLayoutTitle(this._layoutValue.value.rows, this.value);
        // 获取模块ID，格式为将按照模块层级依次保存为数组形式，后续按照模块加载时，层级最后的ID即为对应加载模块ID
        const moduleID = this._funcValue[this._funcValue.length - 1];
        const layoutName = this._layoutValue.label;
        const img = this._layoutValue.value.img;
        const copyLayout = JSON.parse(JSON.stringify(this._layoutValue.value));
        const blockDataList = this.overrideLayoutId(copyLayout);
        const metadata = JSON.stringify(copyLayout);
        const configName = this._configName;
        // 配置信息保存入数据库
        const configData = {
            moduleId: moduleID,
            template: layoutName,
            name: configName,
            metadata: metadata,
            enabled: "0",
            userId: this._currentUser.currentAccountId,
            templateImg: img,
            bufferId: this._bufferId,
            description: this._configDesc
        };
        const layout = await this.addSettingLayoutBuffer(configData);
        if (layout.data && layout.status === 200 && layout.isSuccess) {
            this._selectedLayoutId = layout.data.Id;
            for (let i = 0, len = blockDataList.length; i < len; i++) {
                blockDataList[i]["layoutId"] = layout.data.Id;
                blockDataList[i]["parentId"] = moduleID;
                blockDataList[i]["type"] = "view";
                blockDataList[i]["userId"] = this._currentUser.currentAccountId;
                blockDataList[i]["bufferId"] = this._bufferId;
                blockDataList[i]["showTitle"] = 1;
                const block = await this.addBlockSettingBuffer(
                    blockDataList[i]
                );
            }
            this.message.create("success", "布局保存成功");
            this.loadLayout();
            result = true;
        } else {
            this.message.create("error", layout.message);
        }
        this.message.remove(loadingMessage);
        return result;
    }

    async _updateLayoutBuffer() {
        let res = false;
        const params = {
            name: this._configName,
            description: this._configDesc,
            Id: this._selectedLayoutId
        };
        const result = await this.updateLayoutBuffer(params);
        if (result.isSuccess) {
            // 跳转到布局页面
            // this.previewLayoutData = ;
            this.loadLayout();
            res = true;
        } else {
            this.message.create("error", result.message);
            res = false;
        }
        return res;
    }

    _saveBlockBuffer() {
        // 保存区域设置
        this.overrideLayoutTitle(this._layoutValue.value.rows, this.value);
        const copyLayout = JSON.parse(JSON.stringify(this._layoutValue.value));
        const blockDataList = this.overrideLayoutId(copyLayout);

        const moduleID = this._funcValue[this._funcValue.length - 1];
        (async () => {
            for (let i = 0, len = blockDataList.length; i < len; i++) {
                blockDataList[i]["layoutId"] = this._selectedLayoutId;
                blockDataList[i]["parentId"] = moduleID;
                blockDataList[i]["type"] = "view";
                const block = await this.addBlockSettingBuffer(
                    blockDataList[i]
                );
                if (block.status === 200 && block.isSuccess) {
                    this._isShowExtend = true;
                    this.message.create(
                        "success",
                        `区域 [${block.data.title}] 保存成功`
                    );
                } else {
                    this.message.create("error", block.message);
                }
            }
            this.loadLayout();
        })();
    }

    // 获取模块信息
    async getModuleData(params) {
        return this.apiService
            .get("common/ComProjectModule", params)
            .toPromise();
    }

    // 获取布局设置列表
    async getLayoutConfigData(params) {
        return this.apiService
            .get("common/LayoutSettingBuffer", params)
            .toPromise();
    }

    async getBlockConfigData(layoutId, moduleId) {
        return this.apiService
            .get("common/BlockSettingBuffer", {
                layoutId: layoutId,
                parentId: moduleId
            })
            .toPromise();
    }

    async addSettingLayoutBuffer(data) {
        return this.apiService
            .post("common/LayoutSettingBuffer", data)
            .toPromise();
    }

    async addBlockSettingBuffer(data) {
        return this.apiService
            .post("common/BlockSettingBuffer", data)
            .toPromise();
    }

    async createLayout() {
        return this.apiService
            .post("common/CreateLayout", { BufferId: this._bufferId })
            .toPromise();
    }

    async updateLayoutBuffer(data) {
        return this.apiService
            .put("common/LayoutSettingBuffer", data)
            .toPromise();
    }

    async updateBlockBuffer(data) {
        return this.apiService
            .put("common/BlockSettingBuffer", data)
            .toPromise();
    }

    async updateLayout() {
        return this.apiService
            .put("common/UpdateLayout", { LayoutId: this._selectedLayoutId })
            .toPromise();
    }

    async getBlockSettingBuffer() {
        return this.apiService
            .get("common/BlockSettingBuffer", { bufferId: this._bufferId })
            .toPromise();
    }

    private uuID(w) {
        let s = "";
        const str =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < w; i++) {
            s += str.charAt(Math.round(Math.random() * (str.length - 1)));
        }
        return s;
    }
}

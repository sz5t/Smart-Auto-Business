import { Component, OnInit, ViewChild } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { SimpleTableColumn, SimpleTableComponent } from "@delon/abc";

@Component({
    selector: "app-tree-and-table",
    templateUrl: "./tree-and-table.component.html"
})
export class TreeAndTableComponent implements OnInit {
    constructor(private http: _HttpClient) {}

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }

    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: "area1",
                            title: "结构树",
                            bodyStyle: {
                                height: "800px",
                                padding: "8px"
                            },
                            span: 5,
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
                                        viewId: "tree_and_table_tree",
                                        keyId: "Id",
                                        height: "500px",
                                        component: "bsnTree",
                                        asyncData: true, //
                                        expandAll: true, //
                                        checkable: true, //    在节点之前添加一个复选框 false
                                        showLine: true, //   显示连接线 fal
                                        columns: [
                                            // 字段映射，映射成树结构所需
                                            {
                                                title: "主键",
                                                field: "key",
                                                valueName: "Id"
                                            },
                                            {
                                                title: "父节点",
                                                field: "parentId",
                                                valueName: "parentId"
                                            },
                                            {
                                                title: "标题",
                                                field: "title",
                                                valueName: "caseName"
                                            }
                                        ],
                                        checkedMapping: [
                                            {
                                                name: "enabled",
                                                value: true
                                            }
                                        ],
                                        defaultSelection: {
                                            selected: [
                                                {
                                                    level: 2,
                                                    field: "",
                                                    index: 1,
                                                    reg: "",
                                                    type: ""
                                                }
                                            ]
                                        },
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: "refresh",
                                                        text: "刷新",
                                                        action: "REFRESH",
                                                        icon:
                                                            "anticon anticon-sync",
                                                        color:
                                                            "text-success-light",
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "save",
                                                        text: "保存",
                                                        icon:
                                                            "anticon anticon-save",
                                                        color:
                                                            "text-success-light",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                url:
                                                                    "common/SetShowCaseEnable",
                                                                ajaxType:
                                                                    "post",
                                                                action:
                                                                    "EXECUTE_NODES_CHECKED_KEY",
                                                                title: "",
                                                                message:
                                                                    "是否保存选中结点数据",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Ids",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_checkedIds",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        menus: [
                                            {
                                                relationViewId:
                                                    "tree_and_form_form",
                                                group: [
                                                    {
                                                        name: "refresh",
                                                        action: "REFRESH",
                                                        text: "刷新",
                                                        icon:
                                                            "anticon anticon-sync",
                                                        color:
                                                            "text-success-light"
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "新增",
                                                        action: "CREATE",
                                                        icon:
                                                            "anticon anticon-plus",
                                                        color:
                                                            "text-success-light"
                                                    },
                                                    {
                                                        name: "updateRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "修改",
                                                        action: "EDIT",
                                                        icon:
                                                            "anticon anticon-edit",
                                                        color: "text-success"
                                                    },
                                                    {
                                                        name: "updateRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消",
                                                        action: "CANCEL",
                                                        icon:
                                                            "anticon anticon-edit",
                                                        color: "text-success"
                                                    },
                                                    {
                                                        name: "saveForm",
                                                        text: "保存",
                                                        icon:
                                                            "anticon anticon-save",
                                                        color: "text-primary",
                                                        action: "SAVE",
                                                        ajaxConfig: [
                                                            {
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType:
                                                                    "post",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "parentId",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_parentId"
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseName",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseName",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseCount",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseCount",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "enabled",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "enabled",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseLevel",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseLevel",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "parentId",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_parentId",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "remark",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "remark",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseType",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseType",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType: "put",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_id",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseName",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseName",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseCount",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseCount",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "enabled",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "enabled",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseLevel",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseLevel",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "parentId",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_parentId",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "remark",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "remark",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseType",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "caseType",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: "deleteRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "删除",
                                                        action: "DELETE",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        color: "text-red-light",
                                                        ajaxConfig: [
                                                            {
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType:
                                                                    "delete",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        valueName:
                                                                            "_id",
                                                                        type:
                                                                            "tempValue"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                relationViewId:
                                                    "tree_and_table_tree",
                                                group: [
                                                    {
                                                        name: "addForm",
                                                        text: "弹出新增表单",
                                                        icon:
                                                            "anticon anticon-form",
                                                        action: "FORM",
                                                        actionType:
                                                            "formDialog",
                                                        actionName:
                                                            "addShowCase",
                                                        type: "showForm"
                                                    },
                                                    {
                                                        name: "editForm",
                                                        text: "弹出编辑表单",
                                                        icon:
                                                            "anticon anticon-form",
                                                        action: "FORM",
                                                        actionType:
                                                            "formDialog",
                                                        actionName:
                                                            "updateShowCase",
                                                        type: "showForm"
                                                    },
                                                    {
                                                        name: "batchEditForm",
                                                        text:
                                                            "弹出批量处理表单",
                                                        action: "FORM_BATCH",
                                                        actionName:
                                                            "batchUpdateShowCase",
                                                        icon:
                                                            "anticon anticon-form",
                                                        type: "showBatchForm"
                                                    },
                                                    {
                                                        name: "showDialogPage",
                                                        text: "弹出页面",
                                                        action: "WINDOW",
                                                        actionType:
                                                            "windowDialog",
                                                        actionName:
                                                            "ShowCaseWindow",
                                                        type: "showLayout"
                                                    },
                                                    {
                                                        name: "upload",
                                                        icon:
                                                            "anticon anticon-upload",
                                                        text: "附件上传",
                                                        action: "UPLOAD",
                                                        actionType:
                                                            "uploadDialog",
                                                        actionName:
                                                            "uploadCase",
                                                        type: "uploadDialog"
                                                    },
                                                    {
                                                        name: "addFormcascade",
                                                        text: "级联例子",
                                                        icon:
                                                            "anticon anticon-form",
                                                        action: "FORM",
                                                        actionType:
                                                            "formDialog",
                                                        actionName:
                                                            "addShowCasecascade",
                                                        type: "showForm"
                                                    }
                                                ]
                                            }
                                        ],
                                        componentType: {
                                            parent: true,
                                            child: true,
                                            own: false
                                        },
                                        parent: [
                                            {
                                                name: "parentId",
                                                type: "value",
                                                valueName: "",
                                                value: null
                                            }
                                        ],
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ]
                                        },
                                        relations: [
                                            {
                                                relationViewId:
                                                    "tree_and_form_form",
                                                cascadeMode: "REFRESH",
                                                params: []
                                            }
                                        ],
                                        formDialog: [
                                            {
                                                keyId: "Id",
                                                name: "addShowCase",
                                                layout: "horizontal",
                                                title: "新增数据",
                                                width: "800",
                                                isCard: true,
                                                type: "add",
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name: "enabled",
                                                                label: "状态",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                defaultValue: 1,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: 0
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: 1
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "caseType",
                                                                label: "父类别",
                                                                labelName:
                                                                    "caseName",
                                                                valueName: "Id",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                defaultValue:
                                                                    "6b4021cef8394d5fb4775afcd01d920f",
                                                                ajaxConfig: {
                                                                    url:
                                                                        "common/ShowCase",
                                                                    ajaxType:
                                                                        "get",
                                                                    params: []
                                                                },
                                                                cascader: [
                                                                    {
                                                                        name:
                                                                            "getCaseName",
                                                                        type:
                                                                            "sender",
                                                                        cascaderData: {
                                                                            params: [
                                                                                {
                                                                                    pid:
                                                                                        "Id",
                                                                                    cid:
                                                                                        "_typeId"
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseName",
                                                                label: "名称",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入Case名称",
                                                                perfix:
                                                                    "anticon anticon-edit",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                explain:
                                                                    "名称需要根据规范填写",
                                                                span: "24",
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            "required",
                                                                        errorMessage:
                                                                            "请输入Case名称!!!!"
                                                                    },
                                                                    {
                                                                        validator:
                                                                            "minLength",
                                                                        length:
                                                                            "3",
                                                                        errorMessage:
                                                                            "请输入最少三个字符"
                                                                    },
                                                                    {
                                                                        validator:
                                                                            "maxLength",
                                                                        length:
                                                                            "5",
                                                                        errorMessage:
                                                                            "请输入最5个字符"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseLevel",
                                                                label: "级别",
                                                                isRequired: true,
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24",
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            "required",
                                                                        errorMessage:
                                                                            "请输入级别"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "checkboxGroup",
                                                                label: "选项",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "18",
                                                                name: "enabled",
                                                                disabled: false,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: true,
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: false,
                                                                        disabled: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "radioGroup",
                                                                label: "选项",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "18",
                                                                name:
                                                                    "enabled1",
                                                                disabled: false,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: true,
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: false,
                                                                        disabled: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseCount",
                                                                label: "数量",
                                                                isRequired: true,
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24",
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            "required",
                                                                        errorMessage:
                                                                            "请输入数量"
                                                                    },
                                                                    {
                                                                        validator:
                                                                            "pattern",
                                                                        pattern: /^\d+$/,
                                                                        errorMessage:
                                                                            "请填写数字"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "datePicker",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "createTime",
                                                                label:
                                                                    "创建时间",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                showTime: true,
                                                                format:
                                                                    "yyyy-MM-dd",
                                                                showToday: true,
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "rangePicker",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "createTime",
                                                                label:
                                                                    "时间范围",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                showTime: true,
                                                                format:
                                                                    "yyyy-MM-dd",
                                                                showToday: true,
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "time",
                                                                name: "remark",
                                                                label: "备注",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: "save",
                                                        text: "保存",
                                                        type: "primary",
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    ajaxType:
                                                                        "post",
                                                                    url:
                                                                        "common/ShowCase",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "caseName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseCount",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseCount",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "createTime",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "createTime",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "enabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "enabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseLevel",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseLevel",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentId",
                                                                            type:
                                                                                "tempValue",
                                                                            valueName:
                                                                                "_parentId",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "remark",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "remark",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseType",
                                                                            value:
                                                                                ""
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "saveAndKeep",
                                                        text: "保存并继续",
                                                        type: "primary",
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    url:
                                                                        "common/ShowCase",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "caseName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseCount",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseCount",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "createTime",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "createTime",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "enabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "enabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseLevel",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseLevel",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentId",
                                                                            type:
                                                                                "tempValue",
                                                                            valueName:
                                                                                "_parentId",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "remark",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "remark",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseType",
                                                                            value:
                                                                                ""
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "reset",
                                                        text: "重置"
                                                    },
                                                    {
                                                        name: "close",
                                                        text: "关闭"
                                                    }
                                                ]
                                            },
                                            {
                                                keyId: "Id",
                                                name: "updateShowCase",
                                                title: "编辑",
                                                width: "600",
                                                type: "edit",
                                                ajaxConfig: {
                                                    url: "common/ShowCase",
                                                    ajaxType: "getById",
                                                    params: [
                                                        {
                                                            name: "Id",
                                                            type: "tempValue",
                                                            valueName: "_id",
                                                            value: ""
                                                        }
                                                    ]
                                                },
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                name: "enabled",
                                                                label: "状态",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                defaultValue: 1,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: 1
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: 0
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "parentId",
                                                                label: "父类别",
                                                                labelName:
                                                                    "caseName",
                                                                valueName: "Id",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                ajaxConfig: {
                                                                    url:
                                                                        "common/ShowCase",
                                                                    ajaxType:
                                                                        "get",
                                                                    params: []
                                                                },
                                                                cascader: [
                                                                    {
                                                                        name:
                                                                            "getCaseName",
                                                                        type:
                                                                            "sender",
                                                                        cascaderData: {
                                                                            params: [
                                                                                {
                                                                                    pid:
                                                                                        "Id",
                                                                                    cid:
                                                                                        "_typeId"
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseName",
                                                                label: "名称",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入Case名称",
                                                                perfix:
                                                                    "anticon anticon-edit",
                                                                suffix: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                                // 'validations': [
                                                                //     {
                                                                //         'validator': 'required',
                                                                //         'errorMessage': '请输入Case名称!!!!'
                                                                //     },
                                                                //     {
                                                                //         'validator': 'minLength',
                                                                //         'length': '3',
                                                                //         'errorMessage': '请输入最少三个字符'
                                                                //     },
                                                                //     {
                                                                //         'validator': 'maxLength',
                                                                //         'length': '5',
                                                                //         'errorMessage': '请输入最5个字符'
                                                                //     }
                                                                // ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseLevel",
                                                                label: "级别",
                                                                isRequired: true,
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24",
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            "required",
                                                                        errorMessage:
                                                                            "请输入级别"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseCount",
                                                                label: "数量",
                                                                isRequired: true,
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                                // 'validations': [
                                                                //     {
                                                                //         'validator': 'required',
                                                                //         'errorMessage': '请输入数量'
                                                                //     },
                                                                //     {
                                                                //         'validator': 'pattern',
                                                                //         'pattern': /^\d+$/,
                                                                //         'errorMessage': '请填写数字'
                                                                //     }
                                                                // ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "datePicker",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "createTime",
                                                                label:
                                                                    "创建时间",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                showTime: true,
                                                                format:
                                                                    "yyyy-MM-dd",
                                                                showToday: true,
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    "rangePicker",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "createTime",
                                                                label:
                                                                    "时间范围",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                showTime: true,
                                                                format:
                                                                    "yyyy-MM-dd",
                                                                showToday: true,
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "time",
                                                                name: "remark",
                                                                label: "备注",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: "save",
                                                        text: "保存",
                                                        type: "primary",
                                                        ajaxConfig: {
                                                            put: [
                                                                {
                                                                    ajaxType:
                                                                        "put",
                                                                    url:
                                                                        "common/ShowCase",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "Id",
                                                                            type:
                                                                                "tempValue",
                                                                            valueName:
                                                                                "_id",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentId",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "parentId",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseCount",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseCount",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "createDate",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "createDate",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "enabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "enabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseLevel",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseLevel",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "remark",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "remark",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "caseType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "caseType",
                                                                            value:
                                                                                ""
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "close",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "关闭"
                                                    },
                                                    {
                                                        name: "reset",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "重置"
                                                    }
                                                ],
                                                dataList: []
                                            },
                                            {
                                                keyId: "Id",
                                                name: "addShowCasecascade",
                                                layout: "horizontal",
                                                title: "新增数据",
                                                width: "800",
                                                isCard: true,
                                                type: "add",
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name: "Enable",
                                                                label: "状态",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: true,
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: false,
                                                                        disabled: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name: "Type",
                                                                label: "类别Id",
                                                                labelName:
                                                                    "Name",
                                                                valueName: "Id",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                /*  'ajaxConfig': {
                                                                         'url': 'SinoForce.User.AppUser',
                                                                         'ajaxType': 'get',
                                                                         'params': []
                                                                     }, */
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "表",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "树",
                                                                        value:
                                                                            "2",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "树表",
                                                                        value:
                                                                            "3",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "表单",
                                                                        value:
                                                                            "4",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "标签页",
                                                                        value:
                                                                            "5",
                                                                        disabled: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseName",
                                                                label: "名称",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name: "Level",
                                                                label: "级别",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "初级",
                                                                        value: 0,
                                                                        disabled: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "caseCount",
                                                                label: "数量",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name: "Remark",
                                                                label: "备注",
                                                                placeholder: "",
                                                                disabled: false,
                                                                readonly: false,
                                                                size: "default",
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                keyId: "Id",
                                                name: "batchUpdateShowCase",
                                                title: "批量编辑",
                                                width: "600",
                                                type: "edit",
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                name: "enabled",
                                                                label: "状态",
                                                                notFoundContent:
                                                                    "",
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    "--请选择--",
                                                                disabled: false,
                                                                size: "default",
                                                                defaultValue: 1,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            "启用",
                                                                        value: true
                                                                    },
                                                                    {
                                                                        label:
                                                                            "禁用",
                                                                        value: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    "column",
                                                                span: "24"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: "batchSave",
                                                        text: "保存",
                                                        type: "primary",
                                                        ajaxConfig: [
                                                            {
                                                                ajaxType: "put",
                                                                url:
                                                                    "common/ShowCase",
                                                                batch: true,
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        type:
                                                                            "checkedRow",
                                                                        valueName:
                                                                            "Id",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "enabled",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "enabled",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: "close",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "关闭"
                                                    }
                                                ],
                                                dataList: []
                                            }
                                        ],
                                        windowDialog: [
                                            {
                                                title: "",
                                                name: "ShowCaseWindow",
                                                layoutName: "singleTable",
                                                width: 800,
                                                buttons: [
                                                    {
                                                        name: "ok",
                                                        text: "确定",
                                                        type: "primary"
                                                    },
                                                    {
                                                        name: "close",
                                                        text: "关闭"
                                                    }
                                                ]
                                            }
                                        ],
                                        uploadDialog: [
                                            {
                                                keyId: "Id",
                                                title: "",
                                                name: "uploadCase",
                                                width: "600",
                                                ajaxConfig: {
                                                    deleteUrl: "file/delete",
                                                    listUrl: "common/SysFile",
                                                    url: "file/upload",
                                                    downloadUrl:
                                                        "file/download",
                                                    ajaxType: "post",
                                                    params: [
                                                        {
                                                            name: "Id",
                                                            type: "tempValue",
                                                            valueName: "_id"
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    dataList: []
                                }
                            ]
                        },
                        {
                            id: "area2",
                            title: "右表",
                            span: 19,
                            size: {
                                nzXs: 24,
                                nzSm: 24,
                                nzMd: 19,
                                nzLg: 19,
                                ngXl: 19
                            },
                            rows: [
                                {
                                    row: {
                                        cols: [
                                            {
                                                id: "area2_1",
                                                title: "表单",
                                                span: 24,
                                                editable: true,
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
                                                            viewId:
                                                                "tree_and_form_form",
                                                            component:
                                                                "form_view",
                                                            keyId: "Id",
                                                            ajaxConfig: {
                                                                url:
                                                                    "common/GetCase",
                                                                ajaxType:
                                                                    "getById",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_id",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            },
                                                            componentType: {
                                                                parent: true,
                                                                child: true,
                                                                own: false
                                                            },
                                                            forms: [
                                                                {
                                                                    controls: [
                                                                        {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "hidden",
                                                                            name:
                                                                                "enableText",
                                                                            placeholder:
                                                                                "",
                                                                            disabled: false,
                                                                            readonly: false,
                                                                            size:
                                                                                "default",
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                ""
                                                                        },
                                                                        {
                                                                            type:
                                                                                "select",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "hidden",
                                                                            textName:
                                                                                "enableText",
                                                                            name:
                                                                                "enabled",
                                                                            label:
                                                                                "状态",
                                                                            notFoundContent:
                                                                                "",
                                                                            selectModel: false,
                                                                            showSearch: true,
                                                                            placeholder:
                                                                                "--请选择--",
                                                                            disabled: false,
                                                                            size:
                                                                                "default",
                                                                            options: [
                                                                                {
                                                                                    label:
                                                                                        "启用",
                                                                                    value: true,
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "禁用",
                                                                                    value: false,
                                                                                    disabled: false
                                                                                }
                                                                            ],
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        },
                                                                        {
                                                                            type:
                                                                                "select",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "submit",
                                                                            name:
                                                                                "caseType",
                                                                            label:
                                                                                "类别",
                                                                            notFoundContent:
                                                                                "",
                                                                            selectModel: false,
                                                                            showSearch: true,
                                                                            placeholder:
                                                                                "--请选择--",
                                                                            disabled: false,
                                                                            size:
                                                                                "default",
                                                                            options: [
                                                                                {
                                                                                    label:
                                                                                        "表",
                                                                                    value:
                                                                                        "1",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "树",
                                                                                    value:
                                                                                        "2",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "树表",
                                                                                    value:
                                                                                        "3",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "表单",
                                                                                    value:
                                                                                        "4",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "标签页",
                                                                                    value:
                                                                                        "5",
                                                                                    disabled: false
                                                                                }
                                                                            ],
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    controls: [
                                                                        {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "text",
                                                                            name:
                                                                                "caseName",
                                                                            label:
                                                                                "名称",
                                                                            placeholder:
                                                                                "",
                                                                            disabled: false,
                                                                            readonly: false,
                                                                            size:
                                                                                "default",
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        },
                                                                        {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "text",
                                                                            name:
                                                                                "caseLevel",
                                                                            label:
                                                                                "级别",
                                                                            placeholder:
                                                                                "",
                                                                            disabled: false,
                                                                            readonly: false,
                                                                            size:
                                                                                "default",
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    controls: [
                                                                        {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "text",
                                                                            name:
                                                                                "caseCount",
                                                                            label:
                                                                                "数量",
                                                                            placeholder:
                                                                                "",
                                                                            disabled: false,
                                                                            readonly: false,
                                                                            size:
                                                                                "default",
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        },
                                                                        {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "4",
                                                                            controlSize:
                                                                                "16",
                                                                            inputType:
                                                                                "text",
                                                                            name:
                                                                                "remark",
                                                                            label:
                                                                                "备注",
                                                                            placeholder:
                                                                                "",
                                                                            disabled: false,
                                                                            readonly: false,
                                                                            size:
                                                                                "default",
                                                                            layout:
                                                                                "column",
                                                                            span:
                                                                                "12"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            toolbar: [
                                                                {
                                                                    group: [
                                                                        {
                                                                            name:
                                                                                "refresh",
                                                                            action:
                                                                                "REFRESH",
                                                                            text:
                                                                                "刷新",
                                                                            color:
                                                                                "text-primary",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "addRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "新增",
                                                                            action:
                                                                                "CREATE",
                                                                            icon:
                                                                                "anticon anticon-plus",
                                                                            color:
                                                                                "text-primary",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "updateRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "修改",
                                                                            action:
                                                                                "EDIT",
                                                                            icon:
                                                                                "anticon anticon-edit",
                                                                            color:
                                                                                "text-success",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "updateRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "取消",
                                                                            action:
                                                                                "CANCEL",
                                                                            icon:
                                                                                "anticon anticon-edit",
                                                                            color:
                                                                                "text-success",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "saveForm",
                                                                            text:
                                                                                "保存",
                                                                            icon:
                                                                                "anticon anticon-save",
                                                                            color:
                                                                                "text-primary",
                                                                            action:
                                                                                "SAVE",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: [
                                                                                {
                                                                                    url:
                                                                                        "common/ShowCase",
                                                                                    ajaxType:
                                                                                        "post",
                                                                                    params: [
                                                                                        {
                                                                                            name:
                                                                                                "parentId",
                                                                                            type:
                                                                                                "tempValue",
                                                                                            valueName:
                                                                                                "_parentId"
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseName",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseName",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseCount",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseCount",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "enabled",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "enabled",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseLevel",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseLevel",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "parentId",
                                                                                            type:
                                                                                                "tempValue",
                                                                                            valueName:
                                                                                                "_parentId",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "remark",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "remark",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseType",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseType",
                                                                                            value:
                                                                                                ""
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    url:
                                                                                        "common/ShowCase",
                                                                                    ajaxType:
                                                                                        "put",
                                                                                    params: [
                                                                                        {
                                                                                            name:
                                                                                                "Id",
                                                                                            type:
                                                                                                "tempValue",
                                                                                            valueName:
                                                                                                "_id",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseName",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseName",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseCount",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseCount",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "enabled",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "enabled",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseLevel",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseLevel",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "parentId",
                                                                                            type:
                                                                                                "tempValue",
                                                                                            valueName:
                                                                                                "_parentId",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "remark",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "remark",
                                                                                            value:
                                                                                                ""
                                                                                        },
                                                                                        {
                                                                                            name:
                                                                                                "caseType",
                                                                                            type:
                                                                                                "componentValue",
                                                                                            valueName:
                                                                                                "caseType",
                                                                                            value:
                                                                                                ""
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            name:
                                                                                "deleteRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "删除",
                                                                            action:
                                                                                "DELETE",
                                                                            icon:
                                                                                "anticon anticon-delete",
                                                                            color:
                                                                                "text-red-light",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: [
                                                                                {
                                                                                    url:
                                                                                        "common/ShowCase",
                                                                                    ajaxType:
                                                                                        "delete",
                                                                                    params: [
                                                                                        {
                                                                                            name:
                                                                                                "Id",
                                                                                            valueName:
                                                                                                "_id",
                                                                                            type:
                                                                                                "tempValue"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            dataList: [],
                                                            relations: [
                                                                {
                                                                    relationViewId:
                                                                        "tree_and_table_tree",
                                                                    cascadeMode:
                                                                        "REFRESH_AS_CHILD",
                                                                    params: [
                                                                        {
                                                                            pid:
                                                                                "Id",
                                                                            cid:
                                                                                "_id"
                                                                        },
                                                                        {
                                                                            pid:
                                                                                "parentId",
                                                                            cid:
                                                                                "_parentId"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        dataList: []
                                                    }
                                                ]
                                            },
                                            {
                                                id: "area2_2",
                                                title: "主表",
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
                                                            title: "数据网格",
                                                            viewId:
                                                                "tree_singleTable",
                                                            component:
                                                                "bsnTable",
                                                            info: true,
                                                            keyId: "Id",
                                                            size: "small",
                                                            pagination: true, // 是否分页
                                                            showTotal: true, // 是否显示总数据量
                                                            pageSize: 5, // 默认每页数据条数
                                                            pageSizeOptions: [
                                                                5,
                                                                10,
                                                                20,
                                                                30,
                                                                40,
                                                                50
                                                            ],
                                                            ajaxConfig: {
                                                                url:
                                                                    "common/GetCase",
                                                                ajaxType: "get",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "parentId",
                                                                        type:
                                                                            "tempValue",
                                                                        valueName:
                                                                            "_parentId"
                                                                    }
                                                                ],
                                                                filter: [
                                                                    {
                                                                        name:
                                                                            "caseName",
                                                                        valueName:
                                                                            "_caseName",
                                                                        type:
                                                                            "",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "enabled",
                                                                        valueName:
                                                                            "_enabled",
                                                                        type:
                                                                            "",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "caseType",
                                                                        valueName:
                                                                            "_caseType",
                                                                        type:
                                                                            "",
                                                                        value:
                                                                            ""
                                                                    }
                                                                ]
                                                            },
                                                            columns: [
                                                                {
                                                                    title:
                                                                        "序号",
                                                                    field:
                                                                        "_serilize",
                                                                    width:
                                                                        "50px",
                                                                    hidden: false,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "Id",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: "Id",
                                                                    field: "Id",
                                                                    width: 80,
                                                                    hidden: true,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "Id",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "名称",
                                                                    field:
                                                                        "caseName",
                                                                    width:
                                                                        "90px",
                                                                    showFilter: false,
                                                                    showSort: false,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "caseName",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "类别",
                                                                    field:
                                                                        "caseTypeText",
                                                                    width:
                                                                        "100px",
                                                                    hidden: false,
                                                                    showFilter: true,
                                                                    showSort: true,
                                                                    editor: {
                                                                        type:
                                                                            "select",
                                                                        field:
                                                                            "caseType",
                                                                        options: {
                                                                            type:
                                                                                "select",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "submit",
                                                                            name:
                                                                                "caseType",
                                                                            label:
                                                                                "Type",
                                                                            notFoundContent:
                                                                                "",
                                                                            selectModel: false,
                                                                            showSearch: true,
                                                                            placeholder:
                                                                                "-请选择数据-",
                                                                            disabled: false,
                                                                            size:
                                                                                "default",
                                                                            clear: true,
                                                                            width:
                                                                                "200px",
                                                                            options: [
                                                                                {
                                                                                    label:
                                                                                        "表格",
                                                                                    value:
                                                                                        "1",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "树组件",
                                                                                    value:
                                                                                        "2",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "树表",
                                                                                    value:
                                                                                        "3",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "表单",
                                                                                    value:
                                                                                        "4",
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "标签页",
                                                                                    value:
                                                                                        "5",
                                                                                    disabled: false
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "数量",
                                                                    field:
                                                                        "caseCount",
                                                                    width: 80,
                                                                    hidden: false,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "caseCount",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "级别",
                                                                    field:
                                                                        "caseLevel",
                                                                    width: 80,
                                                                    hidden: false,
                                                                    showFilter: false,
                                                                    showSort: false,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "caseLevel",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "创建时间",
                                                                    field:
                                                                        "createTime",
                                                                    width: 80,
                                                                    hidden: false,
                                                                    dataType:
                                                                        "date",
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        pipe:
                                                                            "datetime",
                                                                        field:
                                                                            "createTime",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "datetime"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "备注",
                                                                    field:
                                                                        "remark",
                                                                    width: 80,
                                                                    hidden: false,
                                                                    editor: {
                                                                        type:
                                                                            "input",
                                                                        field:
                                                                            "remark",
                                                                        options: {
                                                                            type:
                                                                                "input",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "text"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title:
                                                                        "状态",
                                                                    field:
                                                                        "enableText",
                                                                    width: 80,
                                                                    hidden: false,
                                                                    formatter: [
                                                                        {
                                                                            value:
                                                                                "启用",
                                                                            bgcolor:
                                                                                "",
                                                                            fontcolor:
                                                                                "text-blue",
                                                                            valueas:
                                                                                "启用"
                                                                        },
                                                                        {
                                                                            value:
                                                                                "禁用",
                                                                            bgcolor:
                                                                                "",
                                                                            fontcolor:
                                                                                "text-red",
                                                                            valueas:
                                                                                "禁用"
                                                                        }
                                                                    ],
                                                                    editor: {
                                                                        type:
                                                                            "select",
                                                                        field:
                                                                            "enabled",
                                                                        options: {
                                                                            type:
                                                                                "select",
                                                                            labelSize:
                                                                                "6",
                                                                            controlSize:
                                                                                "18",
                                                                            inputType:
                                                                                "submit",
                                                                            name:
                                                                                "enabled",
                                                                            notFoundContent:
                                                                                "",
                                                                            selectModel: false,
                                                                            showSearch: true,
                                                                            placeholder:
                                                                                "-请选择-",
                                                                            disabled: false,
                                                                            size:
                                                                                "default",
                                                                            clear: true,
                                                                            width:
                                                                                "80px",
                                                                            options: [
                                                                                {
                                                                                    label:
                                                                                        "启用",
                                                                                    value: true,
                                                                                    disabled: false
                                                                                },
                                                                                {
                                                                                    label:
                                                                                        "禁用",
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
                                                                child: true,
                                                                own: false
                                                            },
                                                            relations: [
                                                                {
                                                                    relationViewId:
                                                                        "tree_and_table_tree",
                                                                    cascadeMode:
                                                                        "REFRESH_AS_CHILD",
                                                                    params: [
                                                                        {
                                                                            pid:
                                                                                "key",
                                                                            cid:
                                                                                "_parentId"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    relationViewId:
                                                                        "tree_and_form_form",
                                                                    cascadeMode:
                                                                        "REFRESH",
                                                                    params: []
                                                                }
                                                            ],
                                                            toolbar: [
                                                                {
                                                                    group: [
                                                                        {
                                                                            name:
                                                                                "refresh",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "刷新",
                                                                            color:
                                                                                "text-primary",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "addRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "新增",
                                                                            action:
                                                                                "CREATE",
                                                                            icon:
                                                                                "anticon anticon-plus",
                                                                            color:
                                                                                "text-primary",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "updateRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "修改",
                                                                            action:
                                                                                "EDIT",
                                                                            icon:
                                                                                "anticon anticon-edit",
                                                                            color:
                                                                                "text-success",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "deleteRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "删除",
                                                                            action:
                                                                                "DELETE",
                                                                            icon:
                                                                                "anticon anticon-delete",
                                                                            color:
                                                                                "text-red-light",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: {
                                                                                delete: [
                                                                                    {
                                                                                        actionName:
                                                                                            "delete",
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "delete",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "Id",
                                                                                                valueName:
                                                                                                    "Id",
                                                                                                type:
                                                                                                    "checkedRow"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    group: [
                                                                        {
                                                                            name:
                                                                                "executeCheckedRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "多选删除",
                                                                            action:
                                                                                "EXECUTE_CHECKED",
                                                                            icon:
                                                                                "anticon anticon-delete",
                                                                            color:
                                                                                "text-red-light",
                                                                            actionType:
                                                                                "post",
                                                                            actionName:
                                                                                "execChecked",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: {
                                                                                post: [
                                                                                    {
                                                                                        actionName:
                                                                                            "post",
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "post",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "Id",
                                                                                                valueName:
                                                                                                    "Id",
                                                                                                type:
                                                                                                    "checkedRow"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "executeSelectedRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "选中删除",
                                                                            action:
                                                                                "EXECUTE_SELECTED",
                                                                            icon:
                                                                                "anticon anticon-delete",
                                                                            actionType:
                                                                                "post",
                                                                            actionName:
                                                                                "execSelected",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: {
                                                                                post: [
                                                                                    {
                                                                                        actionName:
                                                                                            "post",
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "post",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "Id",
                                                                                                valueName:
                                                                                                    "Id",
                                                                                                type:
                                                                                                    "checkedRow"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "saveRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "保存",
                                                                            action:
                                                                                "SAVE",
                                                                            icon:
                                                                                "anticon anticon-save",
                                                                            type:
                                                                                "default",
                                                                            color:
                                                                                "text-primary",
                                                                            cancelPermission: true,
                                                                            ajaxConfig: {
                                                                                post: [
                                                                                    {
                                                                                        actionName:
                                                                                            "add",
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "post",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "caseName",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseName",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseCount",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseCount",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "enabled",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "enabled",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseLevel",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseLevel",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "parentId",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "parentId",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "remark",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "remark",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseType",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseType",
                                                                                                value:
                                                                                                    ""
                                                                                            }
                                                                                        ],
                                                                                        output: [
                                                                                            {
                                                                                                name:
                                                                                                    "_id",
                                                                                                type:
                                                                                                    "",
                                                                                                dataName:
                                                                                                    "Id"
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ],
                                                                                put: [
                                                                                    {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "put",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "Id",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "Id",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseName",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseName",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseCount",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseCount",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "enabled",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "enabled",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseLevel",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseLevel",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "parentId",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "parentId",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "remark",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "remark",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseType",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseType",
                                                                                                value:
                                                                                                    ""
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "cancelRow",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "取消",
                                                                            action:
                                                                                "CANCEL",
                                                                            icon:
                                                                                "anticon anticon-rollback",
                                                                            color:
                                                                                "text-grey-darker",
                                                                            cancelPermission: true
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    group: [
                                                                        {
                                                                            name:
                                                                                "addForm",
                                                                            text:
                                                                                "弹出新增表单",
                                                                            icon:
                                                                                "anticon anticon-form",
                                                                            action:
                                                                                "FORM",
                                                                            actionType:
                                                                                "formDialog",
                                                                            actionName:
                                                                                "addShowCase",
                                                                            type:
                                                                                "showForm",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "editForm",
                                                                            text:
                                                                                "弹出编辑表单",
                                                                            icon:
                                                                                "anticon anticon-form",
                                                                            action:
                                                                                "FORM",
                                                                            actionType:
                                                                                "formDialog",
                                                                            actionName:
                                                                                "updateShowCase",
                                                                            type:
                                                                                "showForm",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "batchEditForm",
                                                                            text:
                                                                                "弹出批量处理表单",
                                                                            icon:
                                                                                "anticon anticon-form",
                                                                            type:
                                                                                "showBatchForm",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "showDialogPage",
                                                                            text:
                                                                                "弹出页面",
                                                                            action:
                                                                                "WINDOW",
                                                                            actionType:
                                                                                "windowDialog",
                                                                            actionName:
                                                                                "ShowCaseWindow",
                                                                            type:
                                                                                "showLayout",
                                                                            cancelPermission: true
                                                                        },
                                                                        {
                                                                            name:
                                                                                "upload",
                                                                            icon:
                                                                                "anticon anticon-upload",
                                                                            text:
                                                                                "附件上传",
                                                                            action:
                                                                                "UPLOAD",
                                                                            actionType:
                                                                                "uploadDialog",
                                                                            actionName:
                                                                                "uploadCase",
                                                                            type:
                                                                                "uploadDialog",
                                                                            cancelPermission: true
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    dropdown: [
                                                                        {
                                                                            name:
                                                                                "btnGroup",
                                                                            text:
                                                                                " 分组操作",
                                                                            icon:
                                                                                "icon-plus",
                                                                            buttons: [
                                                                                {
                                                                                    name:
                                                                                        "refresh",
                                                                                    class:
                                                                                        "editable-add-btn",
                                                                                    text:
                                                                                        " 刷新",
                                                                                    icon:
                                                                                        "icon-list",
                                                                                    cancelPermission: true
                                                                                },
                                                                                {
                                                                                    name:
                                                                                        "addRow",
                                                                                    class:
                                                                                        "editable-add-btn",
                                                                                    text:
                                                                                        "新增",
                                                                                    icon:
                                                                                        "icon-add",
                                                                                    cancelPermission: true
                                                                                },
                                                                                {
                                                                                    name:
                                                                                        "updateRow",
                                                                                    class:
                                                                                        "editable-add-btn",
                                                                                    text:
                                                                                        "修改",
                                                                                    icon:
                                                                                        "icon-edit",
                                                                                    cancelPermission: true
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            dataSet: [
                                                                {
                                                                    name:
                                                                        "getCaseName",
                                                                    ajaxConfig: {
                                                                        url:
                                                                            "common/ShowCase",
                                                                        ajaxType:
                                                                            "get",
                                                                        params: []
                                                                    },
                                                                    params: [],
                                                                    fields: [
                                                                        {
                                                                            label:
                                                                                "ID",
                                                                            field:
                                                                                "Id",
                                                                            name:
                                                                                "value"
                                                                        },
                                                                        {
                                                                            label:
                                                                                "",
                                                                            field:
                                                                                "name",
                                                                            name:
                                                                                "label"
                                                                        },
                                                                        {
                                                                            label:
                                                                                "",
                                                                            field:
                                                                                "name",
                                                                            name:
                                                                                "text"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            formDialog: [
                                                                {
                                                                    keyId: "Id",
                                                                    name:
                                                                        "addShowCase",
                                                                    layout:
                                                                        "horizontal",
                                                                    title:
                                                                        "新增数据",
                                                                    width:
                                                                        "800",
                                                                    isCard: true,
                                                                    componentType: {
                                                                        parent: false,
                                                                        child: false,
                                                                        own: true
                                                                    },
                                                                    forms: [
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "select",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "submit",
                                                                                    name:
                                                                                        "enabled",
                                                                                    label:
                                                                                        "状态",
                                                                                    notFoundContent:
                                                                                        "",
                                                                                    selectModel: false,
                                                                                    showSearch: true,
                                                                                    placeholder:
                                                                                        "--请选择--",
                                                                                    disabled: false,
                                                                                    size:
                                                                                        "default",
                                                                                    options: [
                                                                                        {
                                                                                            label:
                                                                                                "启用",
                                                                                            value: true,
                                                                                            disabled: false
                                                                                        },
                                                                                        {
                                                                                            label:
                                                                                                "禁用",
                                                                                            value: false,
                                                                                            disabled: false
                                                                                        }
                                                                                    ],
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "select",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "submit",
                                                                                    name:
                                                                                        "caseType",
                                                                                    label:
                                                                                        "父类别",
                                                                                    labelName:
                                                                                        "caseName",
                                                                                    valueName:
                                                                                        "Id",
                                                                                    notFoundContent:
                                                                                        "",
                                                                                    selectModel: false,
                                                                                    showSearch: true,
                                                                                    placeholder:
                                                                                        "--请选择--",
                                                                                    disabled: false,
                                                                                    size:
                                                                                        "default",
                                                                                    ajaxConfig: {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "get",
                                                                                        params: []
                                                                                    },
                                                                                    cascader: [
                                                                                        {
                                                                                            name:
                                                                                                "getCaseName",
                                                                                            type:
                                                                                                "sender",
                                                                                            cascaderData: {
                                                                                                params: [
                                                                                                    {
                                                                                                        pid:
                                                                                                            "Id",
                                                                                                        cid:
                                                                                                            "_typeId"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseName",
                                                                                    label:
                                                                                        "名称",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "请输入Case名称",
                                                                                    perfix:
                                                                                        "anticon anticon-edit",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    explain:
                                                                                        "名称需要根据规范填写",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入Case名称!!!!"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "minLength",
                                                                                            length:
                                                                                                "3",
                                                                                            errorMessage:
                                                                                                "请输入最少三个字符"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "maxLength",
                                                                                            length:
                                                                                                "5",
                                                                                            errorMessage:
                                                                                                "请输入最5个字符"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseLevel",
                                                                                    label:
                                                                                        "级别",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入级别"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "checkboxGroup",
                                                                                    label:
                                                                                        "选项",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "18",
                                                                                    name:
                                                                                        "enabled",
                                                                                    disabled: false,
                                                                                    options: [
                                                                                        {
                                                                                            label:
                                                                                                "启用",
                                                                                            value: true,
                                                                                            disabled: false
                                                                                        },
                                                                                        {
                                                                                            label:
                                                                                                "禁用",
                                                                                            value: false,
                                                                                            disabled: false
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "radioGroup",
                                                                                    label:
                                                                                        "选项",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "18",
                                                                                    name:
                                                                                        "enabled1",
                                                                                    disabled: false,
                                                                                    options: [
                                                                                        {
                                                                                            label:
                                                                                                "启用",
                                                                                            value: true,
                                                                                            disabled: false
                                                                                        },
                                                                                        {
                                                                                            label:
                                                                                                "禁用",
                                                                                            value: false,
                                                                                            disabled: false
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseCount",
                                                                                    label:
                                                                                        "数量",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入数量"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "pattern",
                                                                                            pattern: /^\d+$/,
                                                                                            errorMessage:
                                                                                                "请填写数字"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "datePicker",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "createTime",
                                                                                    label:
                                                                                        "创建时间",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    showTime: true,
                                                                                    format:
                                                                                        "yyyy-MM-dd",
                                                                                    showToday: true,
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "rangePicker",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "createTime",
                                                                                    label:
                                                                                        "时间范围",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    showTime: true,
                                                                                    format:
                                                                                        "yyyy-MM-dd",
                                                                                    showToday: true,
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "time",
                                                                                    name:
                                                                                        "remark",
                                                                                    label:
                                                                                        "备注",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    buttons: [
                                                                        {
                                                                            name:
                                                                                "save",
                                                                            text:
                                                                                "保存",
                                                                            type:
                                                                                "primary",
                                                                            ajaxConfig: {
                                                                                post: [
                                                                                    {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "caseName",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseName",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseCount",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseCount",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "createTime",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "createTime",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "enabled",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "enabled",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseLevel",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseLevel",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "parentId",
                                                                                                type:
                                                                                                    "tempValue",
                                                                                                valueName:
                                                                                                    "_parentId",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "remark",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "remark",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseType",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseType",
                                                                                                value:
                                                                                                    ""
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "saveAndKeep",
                                                                            text:
                                                                                "保存并继续",
                                                                            type:
                                                                                "primary",
                                                                            ajaxConfig: {
                                                                                post: [
                                                                                    {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "caseName",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseName",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseCount",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseCount",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "createTime",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "createTime",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "enabled",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "enabled",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseLevel",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseLevel",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "parentId",
                                                                                                type:
                                                                                                    "tempValue",
                                                                                                valueName:
                                                                                                    "_parentId",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "remark",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "remark",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseType",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseType",
                                                                                                value:
                                                                                                    ""
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "reset",
                                                                            text:
                                                                                "重置"
                                                                        },
                                                                        {
                                                                            name:
                                                                                "close",
                                                                            text:
                                                                                "关闭"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    keyId: "Id",
                                                                    name:
                                                                        "updateShowCase",
                                                                    title:
                                                                        "编辑",
                                                                    width:
                                                                        "600",
                                                                    ajaxConfig: {
                                                                        url:
                                                                            "common/ShowCase",
                                                                        ajaxType:
                                                                            "getById",
                                                                        params: [
                                                                            {
                                                                                name:
                                                                                    "Id",
                                                                                type:
                                                                                    "tempValue",
                                                                                valueName:
                                                                                    "_id",
                                                                                value:
                                                                                    ""
                                                                            }
                                                                        ]
                                                                    },
                                                                    componentType: {
                                                                        parent: false,
                                                                        child: false,
                                                                        own: true
                                                                    },
                                                                    forms: [
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "select",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    name:
                                                                                        "enabled",
                                                                                    label:
                                                                                        "状态",
                                                                                    notFoundContent:
                                                                                        "",
                                                                                    selectModel: false,
                                                                                    showSearch: true,
                                                                                    placeholder:
                                                                                        "--请选择--",
                                                                                    disabled: false,
                                                                                    size:
                                                                                        "default",
                                                                                    options: [
                                                                                        {
                                                                                            label:
                                                                                                "启用",
                                                                                            value: true,
                                                                                            disabled: false
                                                                                        },
                                                                                        {
                                                                                            label:
                                                                                                "禁用",
                                                                                            value: false,
                                                                                            disabled: false
                                                                                        }
                                                                                    ],
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "select",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "submit",
                                                                                    name:
                                                                                        "parentId",
                                                                                    label:
                                                                                        "父类别",
                                                                                    labelName:
                                                                                        "caseName",
                                                                                    valueName:
                                                                                        "Id",
                                                                                    notFoundContent:
                                                                                        "",
                                                                                    selectModel: false,
                                                                                    showSearch: true,
                                                                                    placeholder:
                                                                                        "--请选择--",
                                                                                    disabled: false,
                                                                                    size:
                                                                                        "default",
                                                                                    ajaxConfig: {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        ajaxType:
                                                                                            "get",
                                                                                        params: []
                                                                                    },
                                                                                    cascader: [
                                                                                        {
                                                                                            name:
                                                                                                "getCaseName",
                                                                                            type:
                                                                                                "sender",
                                                                                            cascaderData: {
                                                                                                params: [
                                                                                                    {
                                                                                                        pid:
                                                                                                            "Id",
                                                                                                        cid:
                                                                                                            "_typeId"
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseName",
                                                                                    label:
                                                                                        "名称",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "请输入Case名称",
                                                                                    perfix:
                                                                                        "anticon anticon-edit",
                                                                                    suffix:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入Case名称!!!!"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "minLength",
                                                                                            length:
                                                                                                "3",
                                                                                            errorMessage:
                                                                                                "请输入最少三个字符"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "maxLength",
                                                                                            length:
                                                                                                "5",
                                                                                            errorMessage:
                                                                                                "请输入最5个字符"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseLevel",
                                                                                    label:
                                                                                        "级别",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入级别"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "caseCount",
                                                                                    label:
                                                                                        "数量",
                                                                                    isRequired: true,
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24",
                                                                                    validations: [
                                                                                        {
                                                                                            validator:
                                                                                                "required",
                                                                                            errorMessage:
                                                                                                "请输入数量"
                                                                                        },
                                                                                        {
                                                                                            validator:
                                                                                                "pattern",
                                                                                            pattern: /^\d+$/,
                                                                                            errorMessage:
                                                                                                "请填写数字"
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "datePicker",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "createTime",
                                                                                    label:
                                                                                        "创建时间",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    showTime: true,
                                                                                    format:
                                                                                        "yyyy-MM-dd",
                                                                                    showToday: true,
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "rangePicker",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "text",
                                                                                    name:
                                                                                        "createTime",
                                                                                    label:
                                                                                        "时间范围",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    showTime: true,
                                                                                    format:
                                                                                        "yyyy-MM-dd",
                                                                                    showToday: true,
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            controls: [
                                                                                {
                                                                                    type:
                                                                                        "input",
                                                                                    labelSize:
                                                                                        "6",
                                                                                    controlSize:
                                                                                        "16",
                                                                                    inputType:
                                                                                        "time",
                                                                                    name:
                                                                                        "remark",
                                                                                    label:
                                                                                        "备注",
                                                                                    placeholder:
                                                                                        "",
                                                                                    disabled: false,
                                                                                    readonly: false,
                                                                                    size:
                                                                                        "default",
                                                                                    layout:
                                                                                        "column",
                                                                                    span:
                                                                                        "24"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    buttons: [
                                                                        {
                                                                            name:
                                                                                "save",
                                                                            text:
                                                                                "保存",
                                                                            type:
                                                                                "primary",
                                                                            ajaxConfig: {
                                                                                put: [
                                                                                    {
                                                                                        url:
                                                                                            "common/ShowCase",
                                                                                        params: [
                                                                                            {
                                                                                                name:
                                                                                                    "Id",
                                                                                                type:
                                                                                                    "tempValue",
                                                                                                valueName:
                                                                                                    "_id",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseName",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseName",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseCount",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseCount",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "createTime",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "createTime",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "enabled",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "enabled",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "level",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseLevel",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "remark",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "remark",
                                                                                                value:
                                                                                                    ""
                                                                                            },
                                                                                            {
                                                                                                name:
                                                                                                    "caseType",
                                                                                                type:
                                                                                                    "componentValue",
                                                                                                valueName:
                                                                                                    "caseType",
                                                                                                value:
                                                                                                    ""
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        },
                                                                        {
                                                                            name:
                                                                                "close",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "关闭"
                                                                        },
                                                                        {
                                                                            name:
                                                                                "reset",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            text:
                                                                                "重置"
                                                                        }
                                                                    ],
                                                                    dataList: []
                                                                }
                                                            ],
                                                            windowDialog: [
                                                                {
                                                                    title: "",
                                                                    name:
                                                                        "ShowCaseWindow",
                                                                    layoutName:
                                                                        "singleTable",
                                                                    width: 800,
                                                                    buttons: [
                                                                        {
                                                                            name:
                                                                                "ok1",
                                                                            text:
                                                                                "确定",
                                                                            class:
                                                                                "editable-add-btn",
                                                                            type:
                                                                                "primary"
                                                                        },
                                                                        {
                                                                            name:
                                                                                "close",
                                                                            text:
                                                                                "关闭"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            uploadDialog: [
                                                                {
                                                                    keyId: "Id",
                                                                    title: "",
                                                                    name:
                                                                        "uploadCase",
                                                                    width:
                                                                        "600",
                                                                    ajaxConfig: {
                                                                        deleteUrl:
                                                                            "file/delete",
                                                                        listUrl:
                                                                            "common/SysFile",
                                                                        url:
                                                                            "file/upload",
                                                                        downloadUrl:
                                                                            "file/download",
                                                                        ajaxType:
                                                                            "post",
                                                                        params: [
                                                                            {
                                                                                name:
                                                                                    "Id",
                                                                                type:
                                                                                    "tempValue",
                                                                                valueName:
                                                                                    "_id"
                                                                            }
                                                                        ]
                                                                    }
                                                                }
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
                        }
                    ]
                }
            }
        ]
    };
}

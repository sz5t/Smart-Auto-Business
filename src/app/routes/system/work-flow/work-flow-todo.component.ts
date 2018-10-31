import {
    Component,
    Injectable,
    OnInit,
    ElementRef,
    ViewChild
} from "@angular/core";
import { APIResource } from "@core/utility/api-resource";
import { ApiService } from "@core/utility/api-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { CacheService } from "@delon/cache";
import {
    AppPermission,
    FuncResPermission,
    OpPermission,
    PermissionValue
} from "../../../model/APIModel/AppPermission";
import { TIMEOUT } from "dns";
import { _HttpClient } from "@delon/theme";
import { TreeNodeInterface } from "../../cn-test/list/list.component";
import { CommonTools } from "@core/utility/common-tools";
import { BsnTableComponent } from "@shared/business/bsn-data-table/bsn-table.component";
import {
    NzFormatEmitEvent,
    NzTreeNode,
    NzTreeNodeOptions
} from "ng-zorro-antd";
@Component({
    selector: "cn-work-flow-todo, [work-flow-todo]",
    templateUrl: "./work-flow-todo.component.html",
    styles: []
})
export class WorkFlowTodoComponent implements OnInit {
    // #table
    @ViewChild("table")
    table: BsnTableComponent;
    configold = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: "area1",
                            title: "工作流",
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
                                        viewId: "parentTable",
                                        component: "bsnTable",
                                        keyId: "Id",
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 5, // 默pageSizeOptions认每页数据条数
                                        "": [5, 10, 20, 30, 40, 50],
                                        ajaxConfig: {
                                            url: "common/WfInfo",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "_sort",
                                                    type: "value",
                                                    valueName: "",
                                                    value: "createDate desc"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: false,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "parentTable",
                                                relationSendContent: [],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        columns: [
                                            {
                                                title: "Id",
                                                field: "Id",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "Id",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "名称",
                                                field: "name",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "name",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "编号",
                                                field: "code",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "code",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "备注",
                                                field: "remark",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "remark",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "创建时间",
                                                field: "createDate",
                                                width: 80,
                                                hidden: false,
                                                showSort: true,
                                                editor: {
                                                    type: "input",
                                                    field: "createDate",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: "refresh",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "刷新"
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "新增",
                                                        action: "CREATE"
                                                    },
                                                    {
                                                        name: "updateRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "修改",
                                                        action: "EDIT"
                                                    },
                                                    {
                                                        name: "deleteRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "删除",
                                                        action: "DELETE",
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        "delete",
                                                                    url:
                                                                        "common/WfInfo",
                                                                    ajaxType:
                                                                        "delete"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "saveRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "保存",
                                                        action: "SAVE",
                                                        type: "method/action",
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    actionName:
                                                                        "add",
                                                                    url:
                                                                        "common/WfInfo",
                                                                    ajaxType:
                                                                        "post",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "code",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "code",
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
                                                                                "1"
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
                                                                        "common/WfInfo",
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
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "code",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "code",
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
                                                                                "1"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "cancelRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消",
                                                        action: "CANCEL"
                                                    },
                                                    {
                                                        name: "addForm",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "弹出新增表单",
                                                        action: "FORM",
                                                        actionType:
                                                            "formDialog",
                                                        actionName:
                                                            "addShowCase",
                                                        type: "showForm"
                                                    },
                                                    {
                                                        name: "editForm",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "弹出编辑表单",
                                                        action: "FORM",
                                                        actionType:
                                                            "formDialog",
                                                        actionName:
                                                            "updateShowCase",
                                                        type: "showForm"
                                                    },
                                                    /*        {
                                   'name': 'executeCheckedRow', 'class': 'editable-add-btn', 'text': '批量建模', 'action': 'EXECUTE_CHECKED',
                                   'actionType': 'post', 'actionName': 'BuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/buildModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'checkedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 },
                                 {
                                   'name': 'executeSelectedRow', 'class': 'editable-add-btn', 'text': '建模', 'action': 'EXECUTE_SELECTED',
                                   'actionType': 'post', 'actionName': 'BuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/buildModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'selectedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 },
                                 {
                                   'name': 'executeSelectedRow', 'class': 'editable-add-btn', 'text': '取消建模', 'action': 'EXECUTE_SELECTED',
                                   'actionType': 'post', 'actionName': 'CancelBuildModel',
                                   'ajaxConfig': {
                                     post: [{
                                       'actionName': 'post',
                                       'url': 'common/Action/ComTabledata/cancelModel',
                                       'ajaxType': 'post',
                                       'params' : [
                                         {
                                           name: 'Id', valueName: 'Id', type: 'selectedRow'
                                         }
                                       ]
                                     }]
                                   }
                                 }, */
                                                    {
                                                        name: "addSearchRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "查询",
                                                        action: "SEARCH",
                                                        actionType:
                                                            "addSearchRow",
                                                        actionName:
                                                            "addSearchRow"
                                                    },
                                                    {
                                                        name: "cancelSearchRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消查询",
                                                        action: "SEARCH",
                                                        actionType:
                                                            "cancelSearchRow",
                                                        actionName:
                                                            "cancelSearchRow"
                                                    }
                                                ]
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
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name: "name",
                                                                label: "名称",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入建模名称",
                                                                perfix:
                                                                    "anticon anticon-edit",
                                                                suffix: "",
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
                                                                            "请输入Case名称!!!!"
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
                                                                    "tableName",
                                                                label: "表名",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入表名",
                                                                perfix:
                                                                    "anticon anticon-edit",
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
                                                                            "请输入表名"
                                                                    }
                                                                ]
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
                                                                    "isEnabled",
                                                                label:
                                                                    "是否有效",
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
                                                                            "是",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "否",
                                                                        value:
                                                                            "0",
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
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "isNeedDeploy",
                                                                label:
                                                                    "是否发布",
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
                                                                            "是",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "否",
                                                                        value:
                                                                            "0",
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
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "belongPlatformType",
                                                                label:
                                                                    "平台类型",
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
                                                                            "配置平台",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "运行平台",
                                                                        value:
                                                                            "2",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "通用",
                                                                        value:
                                                                            "3",
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
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "comments",
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
                                                                    url:
                                                                        "common/ComTabledata",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "tableName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableType",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                "1"
                                                                        },

                                                                        {
                                                                            name:
                                                                                "parentTableId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentTableName ",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isHavaDatalink",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnName",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "comments",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "comments",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isEnabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isEnabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isNeedDeploy",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isNeedDeploy",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "belongPlatformType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "belongPlatformType",
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
                                                                        "common/ComTabledata",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "tableName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableType",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                "1"
                                                                        },

                                                                        {
                                                                            name:
                                                                                "parentTableId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentTableName ",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isHavaDatalink",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnName",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "comments",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "comments",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isEnabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isEnabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isNeedDeploy",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isNeedDeploy",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "belongPlatformType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "belongPlatformType",
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
                                                ajaxConfig: {
                                                    url: "common/ComTabledata",
                                                    ajaxType: "get",
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
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name: "name",
                                                                label: "名称",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入建模名称",
                                                                perfix:
                                                                    "anticon anticon-edit",
                                                                suffix: "",
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
                                                                            "请输入Case名称!!!!"
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
                                                                    "tableName",
                                                                label: "表名",
                                                                isRequired: true,
                                                                placeholder:
                                                                    "请输入表名",
                                                                perfix:
                                                                    "anticon anticon-edit",
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
                                                                            "请输入表名"
                                                                    }
                                                                ]
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
                                                                    "isEnabled",
                                                                label:
                                                                    "是否有效",
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
                                                                            "是",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "否",
                                                                        value:
                                                                            "0",
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
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "isNeedDeploy",
                                                                label:
                                                                    "是否发布",
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
                                                                            "是",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "否",
                                                                        value:
                                                                            "0",
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
                                                                type: "select",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "submit",
                                                                name:
                                                                    "belongPlatformType",
                                                                label:
                                                                    "平台类型",
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
                                                                            "配置平台",
                                                                        value:
                                                                            "1",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "运行平台",
                                                                        value:
                                                                            "2",
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            "通用",
                                                                        value:
                                                                            "3",
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
                                                                type: "input",
                                                                labelSize: "6",
                                                                controlSize:
                                                                    "16",
                                                                inputType:
                                                                    "text",
                                                                name:
                                                                    "comments",
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
                                                                    url:
                                                                        "common/ComTabledata",
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
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableName",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "tableName",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "tableType",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                "1"
                                                                        },

                                                                        {
                                                                            name:
                                                                                "parentTableId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "parentTableName ",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isHavaDatalink",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnId",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "subRefParentColumnName",
                                                                            type:
                                                                                "value",
                                                                            valueName:
                                                                                "",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "comments",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "comments",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isEnabled",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isEnabled",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "isNeedDeploy",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "isNeedDeploy",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "belongPlatformType",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "belongPlatformType",
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
                                            }
                                        ],
                                        dataSet: []
                                    },
                                    permissions: {
                                        viewId: "parentTable",
                                        columns: [],
                                        toolbar: [],
                                        formDialog: [],
                                        windowDialog: []
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

    configtanchu = {
        viewId: "parentTable",
        component: "bsnTable",
        keyId: "Id",
        pagination: true, // 是否分页
        showTotal: true, // 是否显示总数据量
        pageSize: 5, // 默pageSizeOptions认每页数据条数
        "": [5, 10, 20, 30, 40, 50],
        ajaxConfig: {
            url: "common/CfgTable",
            ajaxType: "get",
            params: [
                {
                    name: "_sort",
                    type: "value",
                    valueName: "",
                    value: "createDate desc"
                }
            ]
        },
        componentType: {
            parent: false,
            child: false,
            own: true
        },
        relations: [
            {
                relationViewId: "parentTable",
                relationSendContent: [],
                relationReceiveContent: []
            }
        ],
        columns: [
            {
                title: "Id",
                field: "Id",
                width: 80,
                hidden: true,
                editor: {
                    type: "input",
                    field: "Id",
                    options: {
                        type: "input",
                        labelSize: "6",
                        controlSize: "18",
                        inputType: "text"
                    }
                }
            },
            {
                title: "名称",
                field: "name",
                width: 80,
                showFilter: false,
                showSort: false,
                editor: {
                    type: "input",
                    field: "name",
                    options: {
                        type: "input",
                        labelSize: "6",
                        controlSize: "18",
                        inputType: "text"
                    }
                }
            },
            {
                title: "编号",
                field: "code",
                width: 80,
                showFilter: false,
                showSort: false,
                editor: {
                    type: "input",
                    field: "code",
                    options: {
                        type: "input",
                        labelSize: "6",
                        controlSize: "18",
                        inputType: "text"
                    }
                }
            },
            {
                title: "备注",
                field: "remark",
                width: 80,
                hidden: false,
                editor: {
                    type: "input",
                    field: "remark",
                    options: {
                        type: "input",
                        labelSize: "6",
                        controlSize: "18",
                        inputType: "text"
                    }
                }
            },
            {
                title: "创建时间",
                field: "createDate",
                width: 80,
                hidden: false,
                showSort: true,
                editor: {
                    type: "input",
                    field: "createDate",
                    options: {
                        type: "input",
                        labelSize: "6",
                        controlSize: "18",
                        inputType: "text"
                    }
                }
            }
        ],
        toolbar: [
            {
                group: [
                    {
                        name: "refresh",
                        class: "editable-add-btn",
                        text: "刷新"
                    },
                    {
                        name: "addSearchRow",
                        class: "editable-add-btn",
                        text: "查询",
                        action: "SEARCH",
                        actionType: "addSearchRow",
                        actionName: "addSearchRow"
                    },
                    {
                        name: "cancelSearchRow",
                        class: "editable-add-btn",
                        text: "取消查询",
                        action: "SEARCH",
                        actionType: "cancelSearchRow",
                        actionName: "cancelSearchRow"
                    }
                ]
            }
        ],
        dataSet: []
    };
    nzWidth = 1024;
    configtanchuInput = {
        type: "input",
        labelSize: "6",
        controlSize: "18",
        inputType: "text",
        width: "160px",
        label: "父类别",
        labelName: "caseName",
        valueName: "Id"
    };

    // 模板配置
    pz = {
        title: "Id",
        field: "Id",
        width: 80,
        hidden: true,
        editor: {
            type: "selectgrid",
            field: "Id",
            options: {
                type: "input",
                labelSize: "6",
                controlSize: "18",
                inputType: "text"
            }
        }
    };

    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: "area2",
                            title: "工作流版本",
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
                                        viewId: "wfdesign_Version_Table",
                                        component: "bsnTable",
                                        keyId: "Id",
                                        showCheckBox: true,
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
                                            url: "common/WfVersion",
                                            ajaxType: "get",
                                            params: [
                                                //  { name: 'wfid', type: 'tempValue', valueName: '_parentId', value: '' }
                                            ]
                                        },
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            own: false
                                        },
                                        relations: [
                                            //   {
                                            //   'relationViewId': 'wfdesign_wf_parentTable',
                                            //   'cascadeMode': 'REFRESH_AS_CHILD',
                                            //   'params': [
                                            //     { pid: 'Id', cid: '_parentId' }
                                            //   ],
                                            //   'relationReceiveContent': []
                                            // }
                                        ],
                                        columns: [
                                            {
                                                title: "Id",
                                                field: "Id",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "Id",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "名称",
                                                field: "name",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "name",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "编号",
                                                field: "code",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "code",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },

                                            {
                                                title: "版本号",
                                                field: "version",
                                                width: 70,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "version",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },

                                            {
                                                title: "绑定业务类型",
                                                field: "businesstype",
                                                width: 120,
                                                hidden: false,
                                                editor: {
                                                    type: "select",
                                                    field: "businesstype",
                                                    options: {
                                                        type: "select",
                                                        inputType: "submit",
                                                        name: "businesstype",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "-请选择数据-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "100%",
                                                        defaultValue: 1,
                                                        options: [
                                                            {
                                                                label:
                                                                    "数据建模",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label:
                                                                    "业务建模",
                                                                value: 2,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "绑定业务对象",
                                                field: "businessname",
                                                width: 100,
                                                hidden: false,
                                                editor1: {
                                                    type: "select",
                                                    field: "businesskey",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "businesskey",
                                                        labelName: "name",
                                                        valueName: "Id",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "--请选择--",
                                                        disabled: false,
                                                        size: "default",
                                                        width: "100%",
                                                        ajaxConfig: {
                                                            url:
                                                                "common/CfgTable",
                                                            ajaxType: "get",
                                                            params: [
                                                                {
                                                                    name:
                                                                        "isCreated",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value: "1"
                                                                },
                                                                {
                                                                    name:
                                                                        "isBuildModel",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value: "1"
                                                                },
                                                                {
                                                                    name:
                                                                        "isEnabled",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value: "1"
                                                                },
                                                                {
                                                                    name:
                                                                        "type",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value: "1"
                                                                },
                                                                {
                                                                    name:
                                                                        "_sort",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value:
                                                                        "createDate desc"
                                                                }
                                                            ]
                                                        }
                                                    }
                                                },
                                                editor2: {
                                                    type: "selectGrid",
                                                    field: "businesskey",
                                                    options: {
                                                        type: "selectGrid",
                                                        inputType: "text",
                                                        width: "90px",
                                                        name: "businesskey",
                                                        labelName: "name",
                                                        valueName: "Id"
                                                    }
                                                },
                                                editor: {
                                                    type: "selectTreeGrid",
                                                    field: "businesskey",
                                                    options: {
                                                        type: "selectTreeGrid",
                                                        inputType: "text",
                                                        width: "90px",
                                                        name: "businesskey",
                                                        labelName: "caseName",
                                                        valueName: "name"
                                                    }
                                                }
                                            },
                                            {
                                                title: "排序",
                                                field: "sort",
                                                width: 50,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "sort",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "备注",
                                                field: "remark",
                                                width: 100,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "remark",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "6",
                                                        inputType: "text"
                                                    }
                                                }
                                            },

                                            {
                                                title: "状态",
                                                field: "state",
                                                width: 90,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "state",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "6",
                                                        inputType: "text"
                                                    }
                                                }
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: "refresh",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "刷新",
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "新增",
                                                        action: "CREATE",
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "updateRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "修改",
                                                        action: "EDIT",
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "deleteRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "删除",
                                                        action: "DELETE",
                                                        cancelPermission: true,
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        "delete",
                                                                    url:
                                                                        "common/WfVersion",
                                                                    ajaxType:
                                                                        "delete"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "saveRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "保存",
                                                        action: "SAVE",
                                                        cancelPermission: true,
                                                        type: "method/action",
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    actionName:
                                                                        "add",
                                                                    url:
                                                                        "common/WfVersion",
                                                                    ajaxType:
                                                                        "post",
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                "wfid",
                                                                            type:
                                                                                "tempValue",
                                                                            valueName:
                                                                                "_parentId",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "version",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "version",
                                                                            value:
                                                                                ""
                                                                        },

                                                                        {
                                                                            name:
                                                                                "businesstype",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businesstype",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "businesskey",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businesskey",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "businessname",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businessname",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "code",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "code",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "sort",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "sort",
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
                                                                        "common/WfVersion",
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
                                                                                "wfid",
                                                                            type:
                                                                                "tempValue",
                                                                            valueName:
                                                                                "_parentId",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "name",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "name",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "version",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "version",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "businesstype",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businesstype",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "businesskey",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businesskey",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "businessname",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "businessname",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "code",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "code",
                                                                            value:
                                                                                ""
                                                                        },
                                                                        {
                                                                            name:
                                                                                "sort",
                                                                            type:
                                                                                "componentValue",
                                                                            valueName:
                                                                                "sort",
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
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "cancelRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消",
                                                        action: "CANCEL",
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "启用",
                                                        action: "CREATE"
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "禁用",
                                                        action: "CREATE"
                                                    },
                                                    {
                                                        name: "addRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "配置",
                                                        action: "CREATE"
                                                    }
                                                ]
                                            }
                                        ],
                                        cascade: [
                                            {
                                                name: "businesskey", // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                CascadeObjects: [
                                                    {
                                                        cascadeName:
                                                            "businessname",
                                                        cascadeValueItems: [],
                                                        cascadeDataItems: [
                                                            {
                                                                data: {
                                                                    type:
                                                                        "setValue", // option/ajax/setValue
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name:
                                                                                "value",
                                                                            type:
                                                                                "selectObjectValue",
                                                                            value:
                                                                                "1",
                                                                            valueName:
                                                                                "caseName"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        select: [
                                            {
                                                name: "businesskey1",
                                                type: "selectGrid",
                                                config: {
                                                    width: "1024", // 弹出的宽度
                                                    title: "弹出表格",
                                                    selectGrid: {
                                                        viewId:
                                                            "businesskey_Table",
                                                        component: "bsnTable",
                                                        keyId: "Id",
                                                        pagination: true, // 是否分页
                                                        showTotal: true, // 是否显示总数据量
                                                        pageSize: 5, // 默pageSizeOptions认每页数据条数
                                                        isSelectGrid: true, // 【弹出表格时用】弹出表格值为true
                                                        selectGridValueName:
                                                            "Id", // 【弹出表格时用】指定绑定的value值
                                                        "": [
                                                            5,
                                                            10,
                                                            20,
                                                            30,
                                                            40,
                                                            50
                                                        ],
                                                        ajaxConfig: {
                                                            url:
                                                                "common/CfgTable",
                                                            ajaxType: "get",
                                                            params: [
                                                                {
                                                                    name:
                                                                        "_sort",
                                                                    type:
                                                                        "value",
                                                                    valueName:
                                                                        "",
                                                                    value:
                                                                        "createDate desc"
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
                                                                title: "Id",
                                                                field: "Id",
                                                                width: 80,
                                                                hidden: true,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field: "Id",
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
                                                                title: "名称",
                                                                field: "name",
                                                                width: 80,
                                                                showFilter: false,
                                                                showSort: false,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field:
                                                                        "name",
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
                                                                title: "编号",
                                                                field: "code",
                                                                width: 80,
                                                                showFilter: false,
                                                                showSort: false,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field:
                                                                        "code",
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
                                                                title: "备注",
                                                                field: "remark",
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
                                                                    "创建时间",
                                                                field:
                                                                    "createDate",
                                                                width: 80,
                                                                hidden: false,
                                                                showSort: true,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field:
                                                                        "createDate",
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
                                                                        cancelPermission: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            "addSearchRow",
                                                                        class:
                                                                            "editable-add-btn",
                                                                        text:
                                                                            "查询",
                                                                        action:
                                                                            "SEARCH",
                                                                        actionType:
                                                                            "addSearchRow",
                                                                        actionName:
                                                                            "addSearchRow",
                                                                        cancelPermission: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            "cancelSearchRow",
                                                                        class:
                                                                            "editable-add-btn",
                                                                        text:
                                                                            "取消查询",
                                                                        action:
                                                                            "SEARCH",
                                                                        actionType:
                                                                            "cancelSearchRow",
                                                                        actionName:
                                                                            "cancelSearchRow",
                                                                        cancelPermission: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            "cancelSelectRow",
                                                                        class:
                                                                            "editable-add-btn",
                                                                        text:
                                                                            "取消选中",
                                                                        action:
                                                                            "CANCEL_SELECTED",
                                                                        cancelPermission: true
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                name: "businesskey",
                                                type: "selectTreeGrid",
                                                config: {
                                                    nzWidth: 768,
                                                    title: "弹出树",
                                                    selectTreeGrid: {
                                                        isSelectGrid: true,
                                                        selectGridValueName:
                                                            "Id", // 【弹出表格时用】指定绑定的value值
                                                        // 'title': '树表网格',
                                                        viewId: "bsnTreeTable",
                                                        component:
                                                            "bsnTreeTable",
                                                        info: true,
                                                        keyId: "Id",
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
                                                                "common/GetCase/null/GetCase",
                                                            ajaxType: "get",
                                                            params: [],
                                                            filter: []
                                                        },
                                                        columns: [
                                                            {
                                                                title: "Id",
                                                                field: "Id",
                                                                width: 80,
                                                                hidden: true,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field: "Id",
                                                                    options: {
                                                                        type:
                                                                            "input",
                                                                        inputType:
                                                                            "text"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "名称",
                                                                field:
                                                                    "caseName",
                                                                width: "90px",
                                                                expand: true,
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
                                                                            "text",
                                                                        width:
                                                                            "100px"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "类别",
                                                                field:
                                                                    "caseTypeText",
                                                                width: "100px",
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
                                                                            "150px",
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
                                                                title: "数量",
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
                                                                        inputType:
                                                                            "text"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "级别",
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
                                                                        inputType:
                                                                            "text"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "父类别",
                                                                field:
                                                                    "parentName",
                                                                width: 80,
                                                                hidden: false,
                                                                showFilter: false,
                                                                showSort: false,
                                                                editor: {
                                                                    type:
                                                                        "input",
                                                                    field:
                                                                        "parentId",
                                                                    options: {
                                                                        type:
                                                                            "selectTree",
                                                                        name:
                                                                            "parentId",
                                                                        label:
                                                                            "父类别",
                                                                        notFoundContent:
                                                                            "",
                                                                        selectModel: false,
                                                                        showSearch: true,
                                                                        placeholder:
                                                                            "--请选择--",
                                                                        disabled: false,
                                                                        size:
                                                                            "default",
                                                                        columns: [
                                                                            {
                                                                                title:
                                                                                    "主键",
                                                                                field:
                                                                                    "key",
                                                                                valueName:
                                                                                    "Id"
                                                                            },
                                                                            {
                                                                                title:
                                                                                    "父节点",
                                                                                field:
                                                                                    "parentId",
                                                                                valueName:
                                                                                    "parentId"
                                                                            },
                                                                            {
                                                                                title:
                                                                                    "标题",
                                                                                field:
                                                                                    "title",
                                                                                valueName:
                                                                                    "caseName"
                                                                            }
                                                                        ],
                                                                        ajaxConfig: {
                                                                            url:
                                                                                "common/ShowCase",
                                                                            ajaxType:
                                                                                "get",
                                                                            params: []
                                                                        },
                                                                        layout:
                                                                            "column",
                                                                        span:
                                                                            "24"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title:
                                                                    "创建时间",
                                                                field:
                                                                    "createDate",
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
                                                                        "createDate",
                                                                    options: {
                                                                        type:
                                                                            "input",
                                                                        inputType:
                                                                            "datetime"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "备注",
                                                                field: "remark",
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
                                                                        inputType:
                                                                            "text"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                title: "状态",
                                                                field:
                                                                    "enabledText",
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
                                                            child: false,
                                                            own: true
                                                        },
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
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        dataSet: []
                                    },
                                    permissions: {
                                        viewId: "wf_Version_Table",
                                        columns: [],
                                        toolbar: [],
                                        formDialog: [],
                                        windowDialog: []
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
                            id: "area1",
                            title: "单表示例",
                            span: 24,
                            icon: "icon-list",
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
                                        viewId: "singleTable_wf",
                                        component: "bsnTable",
                                        info: true,
                                        keyId: "Id",
                                        scroll: { x: "1200px", y: "200px" },
                                        showCheckBox: true,
                                        size: "small",
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 20, // 默认每页数据条数
                                        pageSizeOptions: [
                                            5,
                                            10,
                                            20,
                                            30,
                                            40,
                                            100
                                        ],
                                        ajaxConfig: {
                                            url: "common/GetCase",
                                            ajaxType: "get",
                                            params: [],
                                            filter: [
                                                {
                                                    name: "caseName",
                                                    valueName: "_caseName",
                                                    type: "tempValue",
                                                    value: ""
                                                },
                                                {
                                                    name: "enabled",
                                                    valueName: "_enabled",
                                                    type: "tempValue",
                                                    value: ""
                                                },
                                                {
                                                    name: "caseType",
                                                    valueName: "_caseType",
                                                    type: "tempValue",
                                                    value: ""
                                                }
                                            ]
                                        },
                                        columns: [
                                            {
                                                title: "序号",
                                                field: "_serilize",
                                                width: "5%",
                                                hidden: false,
                                                titleAlign: "text-right",
                                                fieldAlign: "text-center"
                                            },
                                            {
                                                title: "Id",
                                                field: "Id",
                                                width: "1px",
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "Id",
                                                    options: {
                                                        type: "input",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "名称",
                                                field: "caseName",
                                                width: "15%",
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "selectGrid",
                                                    field: "caseName",
                                                    options: {
                                                        type: "selectGrid",
                                                        inputType: "text",
                                                        width: "120px",
                                                        label: "父类别",
                                                        labelName: "caseName",
                                                        valueName: "name"
                                                    }
                                                }
                                            },
                                            {
                                                title: "类别",
                                                field: "caseTypeText",
                                                width: "15%",
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "caseType",
                                                    options: {
                                                        type: "select",
                                                        inputType: "submit",
                                                        name: "caseType",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "-请选择数据-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "100%",
                                                        defaultValue: "1",
                                                        options: [
                                                            {
                                                                label: "表格",
                                                                value: "1",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "树组件",
                                                                value: "2",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "树表",
                                                                value: "3",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "表单",
                                                                value: "4",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "标签页",
                                                                value: "5",
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "数量",
                                                field: "caseCount",
                                                width: "10%",
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "caseCount",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "级别",
                                                field: "caseLevel",
                                                width: "10%",
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "caseLevel",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "创建时间",
                                                field: "createDate",
                                                width: "10%",
                                                hidden: false,
                                                dataType: "date",
                                                editor: {
                                                    type: "input",
                                                    pipe: "datetime",
                                                    field: "createDate",
                                                    options: {
                                                        type: "datePicker",
                                                        inputType: "datetime",
                                                        name: "createDate",
                                                        showTime: false,
                                                        formart: "yyyy-MM-dd"
                                                    }
                                                }
                                            },
                                            {
                                                title: "父类别",
                                                field: "parentName",
                                                width: "10%",
                                                hidden: false,
                                                editor: {
                                                    type: "select",
                                                    field: "parentId",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "parentId",
                                                        label: "父类别",
                                                        labelName: "caseName",
                                                        valueName: "Id",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "--请选择--",
                                                        disabled: false,
                                                        size: "default",
                                                        width: "100%",
                                                        defaultValue:
                                                            "6b4021cef8394d5fb4775afcd01d920f",
                                                        ajaxConfig: {
                                                            url:
                                                                "common/ShowCase",
                                                            ajaxType: "get",
                                                            params: []
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: "父类别",
                                                field: "parentName",
                                                width: "10%",
                                                hidden: false,
                                                editor: {
                                                    type: "select",
                                                    field: "parentIds",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "parentId_2",
                                                        labelName: "caseName",
                                                        valueName: "Id",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "-请选择-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "100%",
                                                        cascades: [
                                                            {
                                                                cascadeName:
                                                                    "parentId",
                                                                params: [
                                                                    {
                                                                        pid:
                                                                            "parentId",
                                                                        cid:
                                                                            "_cas_parentId"
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        ajaxConfig: {
                                                            url:
                                                                "common/ShowCase",
                                                            ajaxType: "get",
                                                            params: [
                                                                {
                                                                    name:
                                                                        "parentId",
                                                                    type:
                                                                        "cascadeValue",
                                                                    valueName:
                                                                        "_cas_parentId"
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: "状态",
                                                field: "enableText",
                                                width: "10%",
                                                hidden: false,
                                                titleAlign: "text-right",
                                                fieldAlign: "text-center",
                                                formatter: [
                                                    {
                                                        value: "启用",
                                                        bgcolor: "",
                                                        fontcolor: "text-blue",
                                                        valueas: "启用"
                                                    },
                                                    {
                                                        value: "禁用",
                                                        bgcolor: "",
                                                        fontcolor: "text-red",
                                                        valueas: "禁用"
                                                    }
                                                ],
                                                editor: {
                                                    type: "select",
                                                    field: "enabled",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "enabled",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "-请选择-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "100%",
                                                        defaultValue: 1,
                                                        options: [
                                                            {
                                                                label: "启用",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "禁用",
                                                                value: 0,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        cascade: [
                                            // 配置 信息
                                            {
                                                name: "caseType", // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                CascadeObjects: [
                                                    // 当前小组件级联对象数组
                                                    {
                                                        cascadeName: "enabled", // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [
                                                            // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^1$"
                                                                }, // 哪个字段的值触发，正则表达
                                                                data: {
                                                                    type:
                                                                        "option", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "1",
                                                                                label:
                                                                                    "1"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值
                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value:
                                                                            "新值"
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            },
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^2$"
                                                                }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type:
                                                                        "option", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "2",
                                                                                label:
                                                                                    "2"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值
                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value:
                                                                            "新值"
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^3$"
                                                                }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type:
                                                                        "show", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "3",
                                                                                label:
                                                                                    "3"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值
                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value:
                                                                            "新值"
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                        // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                        option: {
                                                                            hidden: false
                                                                        }
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^4$"
                                                                }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type:
                                                                        "show", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "4",
                                                                                label:
                                                                                    "4"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值
                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value:
                                                                            "新值"
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                        // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                        option: {
                                                                            hidden: true
                                                                        }
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^5$"
                                                                }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type:
                                                                        "setValue", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "4",
                                                                                label:
                                                                                    "4"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值
                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name:
                                                                                "value",
                                                                            type:
                                                                                "value",
                                                                            value: 0,
                                                                            valueName:
                                                                                "data"
                                                                        }
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                        // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                        option: {
                                                                            hidden: true
                                                                        }
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            }
                                                        ],
                                                        cascadeDataItems: [] // 应答描述数组，同一个组件可以做出不同应答
                                                    },
                                                    {
                                                        cascadeName:
                                                            "caseLevel", // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [
                                                            // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            /*    {
                                   // 缺少case描述语言
                                   // 描述当前值是什么，触发 selectValue/selectObjectValue
                                   caseValue: { type: 'selectValue', valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                   data: {
                                     type: 'setValue', // option/ajax/setValue
                                     option_data: { // 静态数据集
                                       option: [
                                         { value: '1', label: '高级' },
                                         { value: '2', label: '中级' },
                                         { value: '3', label: '普通' }
                                       ]
                                     },
                                     ajax_data: { // 路由发生变化，复杂问题，涉及参数取值
   
                                       // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                     },
                                     setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                       option: {
                                         name: 'value',
                                         type: 'selectValue',
                                         value: '1',
                                         valueName: 'value'
                                       }
                                     },
                                     show_data: { // 当前表单的展示字段等信息
   
                                     },
                                     relation_data: {
   
                                     }
   
                                   }
                                 }, */
                                                        ],
                                                        cascadeDataItems: [
                                                            // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            {
                                                                data: {
                                                                    type:
                                                                        "setValue", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "1",
                                                                                label:
                                                                                    "高级date"
                                                                            },
                                                                            {
                                                                                value:
                                                                                    "2",
                                                                                label:
                                                                                    "高级date"
                                                                            },
                                                                            {
                                                                                value:
                                                                                    "3",
                                                                                label:
                                                                                    "高级date"
                                                                            }
                                                                        ]
                                                                    },
                                                                    /*   ajax_data: { // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue
  
                                      // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                      option: [
                                        { name: 'typevalue', type: 'value', value: '1', valueName: 'data' },
                                        { name: 'typevaluename', type: 'selectValue', value: '1', valueName: 'data' },
  
                                      ]
                                    }, */
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name:
                                                                                "value",
                                                                            type:
                                                                                "selectValue",
                                                                            value:
                                                                                "1",
                                                                            valueName:
                                                                                "data"
                                                                        }
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                name: "parentId",
                                                CascadeObjects: [
                                                    {
                                                        cascadeName:
                                                            "parentIds", // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [
                                                            // 应答描述数组，同一个组件可以做出不同应答
                                                        ],
                                                        cascadeDataItems: [
                                                            // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            {
                                                                data: {
                                                                    type:
                                                                        "ajax", // option/ajax/setValue
                                                                    option_data: {
                                                                        // 静态数据集
                                                                        option: [
                                                                            {
                                                                                value:
                                                                                    "1",
                                                                                label:
                                                                                    "高级date"
                                                                            },
                                                                            {
                                                                                value:
                                                                                    "2",
                                                                                label:
                                                                                    "高级date"
                                                                            },
                                                                            {
                                                                                value:
                                                                                    "3",
                                                                                label:
                                                                                    "高级date"
                                                                            }
                                                                        ]
                                                                    },
                                                                    ajax_data: {
                                                                        // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                        option: [
                                                                            {
                                                                                name:
                                                                                    "_cas_parentId",
                                                                                type:
                                                                                    "selectValue",
                                                                                value:
                                                                                    "1",
                                                                                valueName:
                                                                                    "data"
                                                                            } // ,
                                                                            // { name: 'typevaluename', type: 'selectValue', value: '1', valueName: 'data' },
                                                                        ]
                                                                    },
                                                                    setValue_data: {
                                                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name:
                                                                                "value",
                                                                            type:
                                                                                "selectValue",
                                                                            value:
                                                                                "1",
                                                                            valueName:
                                                                                "data"
                                                                        }
                                                                    },
                                                                    show_data: {
                                                                        // 当前表单的展示字段等信息
                                                                    },
                                                                    relation_data: {}
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "search_form",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "caseName",
                                                        cid: "_caseName"
                                                    },
                                                    {
                                                        pid: "enabled",
                                                        cid: "_enabled"
                                                    },
                                                    {
                                                        pid: "caseType",
                                                        cid: "_caseType"
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: "refresh",
                                                        action: "REFRESH",
                                                        text: "刷新",
                                                        color: "text-primary"
                                                    },
                                                    {
                                                        name: "addRow",
                                                        text: "新增",
                                                        action: "CREATE",
                                                        icon:
                                                            "anticon anticon-plus",
                                                        color: "text-primary"
                                                    },
                                                    {
                                                        name: "updateRow",
                                                        text: "修改",
                                                        action: "EDIT",
                                                        icon:
                                                            "anticon anticon-edit",
                                                        color: "text-success"
                                                    },
                                                    {
                                                        name: "deleteRow",
                                                        text: "删除1",
                                                        action: "DELETE",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        color: "text-red-light",
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        "delete",
                                                                    url:
                                                                        "common/ShowCase",
                                                                    ajaxType:
                                                                        "delete",
                                                                    title:
                                                                        "警告！",
                                                                    message:
                                                                        "确认要删除当前勾选的数据么？？？"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: "deleteRow",
                                                        text: "删除2",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        color: "text-warning",
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType:
                                                                    "delete", // 批量删除调用建模API，不能使用该模式，delete动作无法传递数组参数类型
                                                                title: "警告！",
                                                                message:
                                                                    "确认要删除当前勾选的数据么？？？",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "_ids",
                                                                        type:
                                                                            "checkedId",
                                                                        valueName:
                                                                            "Id"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name:
                                                            "executeCheckedRow",
                                                        text:
                                                            "多选删除(确认+提示操作)",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        color: "text-red-light",
                                                        actionType: "post",
                                                        actionName:
                                                            "execChecked",
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    "checkDeleteShowCase",
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/DelConfirmShowCase",
                                                                ajaxType:
                                                                    "post",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Ids",
                                                                        valueName:
                                                                            "Id", // 或者'_checkedIds'
                                                                        type:
                                                                            "checkedId" //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isCheck",
                                                                        valueName:
                                                                            "",
                                                                        type:
                                                                            "value",
                                                                        value: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        type:
                                                                            "value",
                                                                        value:
                                                                            "output",
                                                                        valueName:
                                                                            ""
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        dataType:
                                                                            "message"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                name:
                                                                    "deleteShowCase",
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/DelConfirmShowCase",
                                                                ajaxType:
                                                                    "post",
                                                                parentName:
                                                                    "checkDeleteShowCase",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Ids",
                                                                        valueName:
                                                                            "Id", // 或者'_checkedIds'
                                                                        type:
                                                                            "checkedId" //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isCheck",
                                                                        valueName:
                                                                            "",
                                                                        type:
                                                                            "value",
                                                                        value: false
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        dataType:
                                                                            "message"
                                                                    },
                                                                    {
                                                                        name:
                                                                            "dataSet1",
                                                                        dataType:
                                                                            "table"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            "executeCheckedRow1",
                                                        text:
                                                            "多选删除(验证+提示)",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        color: "text-red-light",
                                                        actionType: "post",
                                                        actionName:
                                                            "execChecked",
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    "checkDeleteShowCase",
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/DeleteShowCase",
                                                                ajaxType:
                                                                    "post",
                                                                title: "提示",
                                                                message:
                                                                    "是否将选中的数据执行当前操作？",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Ids",
                                                                        valueName:
                                                                            "Id", // 或者'_checkedIds'
                                                                        type:
                                                                            "checkedId" //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        type:
                                                                            "value",
                                                                        value:
                                                                            "output",
                                                                        valueName:
                                                                            ""
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        dataType:
                                                                            "message"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            "executeSelectedRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "选中删除",
                                                        icon:
                                                            "anticon anticon-delete",
                                                        actionType: "post",
                                                        actionName:
                                                            "execSelected",
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SELECTED",
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType:
                                                                    "delete",
                                                                title: "提示",
                                                                message:
                                                                    "是否将选中的数据执行当前操作？",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        valueName:
                                                                            "Id", // _selectedItem
                                                                        type:
                                                                            "selectedRow" // tempValue
                                                                    },
                                                                    {
                                                                        name:
                                                                            "Message",
                                                                        value:
                                                                            "output", // 或者'_checkedIds'
                                                                        type:
                                                                            "value" //  或者 'tempValue'
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        dataType:
                                                                            ""
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: "saveRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "保存",
                                                        icon:
                                                            "anticon anticon-save",
                                                        type: "default",
                                                        color: "text-primary",
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SAVE_ROW",
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
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                action:
                                                                    "EXECUTE_EDIT_ROW",
                                                                url:
                                                                    "common/ShowCase",
                                                                ajaxType: "put",
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
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: "cancelRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消",
                                                        action: "CANCEL",
                                                        icon:
                                                            "anticon anticon-rollback",
                                                        color:
                                                            "text-grey-darker"
                                                    }
                                                ]
                                            },
                                            {
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
                                            },
                                            {
                                                dropdown: [
                                                    {
                                                        name: "btnGroup",
                                                        text: " 分组操作",
                                                        icon: "icon-plus",
                                                        cancelPermission: true,
                                                        buttons: [
                                                            {
                                                                name: "refresh",
                                                                class:
                                                                    "editable-add-btn",
                                                                text: " 刷新",
                                                                icon:
                                                                    "icon-list",
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name: "addRow",
                                                                class:
                                                                    "editable-add-btn",
                                                                text: "新增",
                                                                icon:
                                                                    "icon-add",
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name:
                                                                    "updateRow",
                                                                class:
                                                                    "editable-add-btn",
                                                                text: "修改",
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
                                                name: "getCaseName",
                                                ajaxConfig: {
                                                    url: "common/ShowCase",
                                                    ajaxType: "get",
                                                    params: []
                                                },
                                                params: [],
                                                fields: [
                                                    {
                                                        label: "ID",
                                                        field: "Id",
                                                        name: "value"
                                                    },
                                                    {
                                                        label: "",
                                                        field: "caseName",
                                                        name: "label"
                                                    },
                                                    {
                                                        label: "",
                                                        field: "caseName",
                                                        name: "text"
                                                    }
                                                ]
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
                                                ],
                                                cascade1: [
                                                    // 配置 信息
                                                    {
                                                        name: "Type", // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                        CascadeObjects: [
                                                            // 当前小组件级联对象数组
                                                            {
                                                                cascadeName:
                                                                    "Enable", // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                "value",
                                                                            regular:
                                                                                "^1$"
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        data: {
                                                                            type:
                                                                                "option", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "1",
                                                                                        label:
                                                                                            "1"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值
                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    },
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                "value",
                                                                            regular:
                                                                                "^2$"
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                "option", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "2",
                                                                                        label:
                                                                                            "2"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值
                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                "value",
                                                                            regular:
                                                                                "^3$"
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                "show", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "3",
                                                                                        label:
                                                                                            "3"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值
                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                                // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                option: {
                                                                                    hidden: false
                                                                                }
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                "value",
                                                                            regular:
                                                                                "^4$"
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                "show", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "4",
                                                                                        label:
                                                                                            "4"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值
                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                                // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                option: {
                                                                                    hidden: true
                                                                                }
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    }
                                                                ],
                                                                cascadeDataItems: [] // 应答描述数组，同一个组件可以做出不同应答
                                                            },
                                                            {
                                                                cascadeName:
                                                                    "Level", // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                "value",
                                                                            regular:
                                                                                "^2$"
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                "option", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "1",
                                                                                        label:
                                                                                            "高级"
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            "2",
                                                                                        label:
                                                                                            "中级"
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            "3",
                                                                                        label:
                                                                                            "普通"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值
                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    }
                                                                ],
                                                                cascadeDataItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        data: {
                                                                            type:
                                                                                "ajax", // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            "1",
                                                                                        label:
                                                                                            "高级date"
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            "2",
                                                                                        label:
                                                                                            "高级date"
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            "3",
                                                                                        label:
                                                                                            "高级date"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                                option: [
                                                                                    {
                                                                                        name:
                                                                                            "typevalue",
                                                                                        type:
                                                                                            "value",
                                                                                        value:
                                                                                            "1",
                                                                                        valueName:
                                                                                            "value"
                                                                                    }
                                                                                ]
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    "新值"
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                cascadeName:
                                                                    "Remark", // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [],
                                                                cascadeDataItems: [
                                                                    {
                                                                        data: {
                                                                            type:
                                                                                "setValue", // option/ajax/setValue
                                                                            setValue_data: {
                                                                                // 静态数据集
                                                                                option: {
                                                                                    name:
                                                                                        "value", // 这个是固定写法
                                                                                    type:
                                                                                        "selectValue", // type：value(固定值) selectValue （当前选中值） selectObjectValue（当前选中对象）
                                                                                    value: 0, // type 是 value 时写固定值
                                                                                    valueName:
                                                                                        "value"
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                ]
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
                            title: "设计工作流示例",
                            span: 24,
                            icon: "icon-list",
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
                                        viewId: "wfeditorid", // 唯一标识
                                        component: "wf_design", // 工作流图形编辑组件
                                        loadtype: "ajax", // 【新增配置项】ajax、data  当前组件的加载方式【预留，目前以ajax为主】
                                        wfjson: "configjson", // 当前存储json字段的
                                        ajaxConfig: {
                                            // 图形自加载
                                            url: "common/WfInfo",
                                            ajaxType: "get",
                                            params: [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ],
                                            filter: []
                                        },
                                        // 该属性不作简析，目前只作单纯json维护
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId:
                                                    "singleTable_wf",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    { pid: "Id", cid: "_Id" }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        toolbar: [
                                            // 此处的toolbar 是用户自定义按钮 + 编辑器内置命令按钮，分组  commandtype: 'editorcommand',  // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
                                            {
                                                group: [
                                                    {
                                                        name: "undo",
                                                        commandtype:
                                                            "editorcommand", // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
                                                        class:
                                                            "command iconfont icon-undo",
                                                        text: "撤销",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "redo",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-redo disable",
                                                        text: "重做",
                                                        hidden: false
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: "copy",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-copy-o disable",
                                                        text: "复制",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "paste",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-paster-o disable",
                                                        text: "粘贴",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "delete",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-delete-o disable",
                                                        text: "删除",
                                                        hidden: false
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: "zoomIn",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-zoom-in-o",
                                                        text: "放大",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "zoomOut",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-zoom-out-o",
                                                        text: "缩小",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "autoZoom",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-fit",
                                                        text: "适应画布",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "resetZoom",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-actual-size-o",
                                                        text: "实际尺寸",
                                                        hidden: false
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: "toBack",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-to-back disable",
                                                        text: "层级后置",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "toFront",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-to-front disable",
                                                        text: "层级前置",
                                                        hidden: false
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: "multiSelect",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-select",
                                                        text: "多选",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "addGroup",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-group disable",
                                                        text: "成组",
                                                        hidden: false
                                                    },
                                                    {
                                                        name: "unGroup",
                                                        commandtype:
                                                            "editorcommand",
                                                        class:
                                                            "command iconfont icon-ungroup disable",
                                                        text: "解组",
                                                        hidden: false
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: "saveWF",
                                                        commandtype:
                                                            "componentcommand",
                                                        class:
                                                            "command iconfont icon-select",
                                                        text: "保存",
                                                        hidden: false
                                                    }
                                                ]
                                            }
                                        ],
                                        // 节点等的右键事件【目前不实现】
                                        contextmenu: []
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

    permissions = [];

    //   ajaxConfig: {
    //     'url': 'common/ShowCase',
    //     'ajaxType': 'getById',
    //     'params': [
    //         { name: 'Id', type: 'value', valueName: '_id', value: '1' }
    //     ]
    // },
    config_bd = {
        permissions: [{ code: "Tab1_GYGC_addRow" }],
        viewId: "tree_and_form_form",
        component: "form_view",
        keyId: "Id",
        ajaxConfig: {
            url: "common/ShowCase",
            ajaxType: "getById",
            params: [
                {
                    name: "Id",
                    type: "value",
                    valueName: "_id",
                    value: "3d7fbe7fc19e4540aaedb5635468b00f"
                }
            ]
        },
        componentType: {
            parent: false,
            child: true,
            own: false
        },
        forms: [
            {
                controls: [
                    {
                        type: "select",
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "submit",
                        name: "enabled",
                        label: "状态",
                        notFoundContent: "",
                        selectModel: false,
                        showSearch: true,
                        placeholder: "--请选择--",
                        disabled: false,
                        size: "default",
                        options: [
                            {
                                label: "启用",
                                value: true,
                                disabled: false
                            },
                            {
                                label: "禁用",
                                value: false,
                                disabled: false
                            }
                        ],
                        layout: "column",
                        span: "24"
                    }
                ]
            },
            {
                controls: [
                    {
                        type: "select",
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "submit",
                        name: "caseType",
                        label: "类别",
                        notFoundContent: "",
                        selectModel: false,
                        showSearch: true,
                        placeholder: "--请选择--",
                        disabled: false,
                        size: "default",
                        options: [
                            {
                                label: "表",
                                value: "1",
                                disabled: false
                            },
                            {
                                label: "树",
                                value: "2",
                                disabled: false
                            },
                            {
                                label: "树表",
                                value: "3",
                                disabled: false
                            },
                            {
                                label: "表单",
                                value: "4",
                                disabled: false
                            },
                            {
                                label: "标签页",
                                value: "5",
                                disabled: false
                            }
                        ],
                        layout: "column",
                        span: "24"
                    }
                ]
            },
            {
                controls: [
                    {
                        type: "selectGrid",
                        selectTreeGrids: 'selectTreeGrid caseName',
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "text",
                        name: "caseName",
                        label: "名称",
                        placeholder: "",
                        disabled: false,
                        readonly: false,
                        size: "default",
                        layout: "column",
                        span: "24",
                        valueName: "Id",
                        labelName: "name",
                        ajaxConfig: {
                            url: "common/CfgTable",
                            ajaxType: "get",
                            params: [
                                {
                                    name: "Id",
                                    type: "componentValue",
                                    valueName: "Id",
                                    value: "63fc58ae67604ae0912a93c81ddcb3ca"
                                }
                            ]
                        }
                    }
                ]
            },
            {
                controls: [
                    {
                        type: "input",
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "text",
                        name: "caseLevel",
                        label: "级别",
                        placeholder: "",
                        disabled: false,
                        readonly: false,
                        size: "default",
                        layout: "column",
                        span: "24"
                    }
                ]
            },
            {
                controls: [
                    {
                        type: "input",
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "text",
                        name: "caseCount",
                        label: "数量",
                        placeholder: "",
                        disabled: false,
                        readonly: false,
                        size: "default",
                        layout: "column",
                        span: "24"
                    }
                ]
            },
            {
                controls: [
                    {
                        type: "input",
                        labelSize: "6",
                        controlSize: "16",
                        inputType: "text",
                        name: "remark",
                        label: "备注",
                        placeholder: "",
                        disabled: false,
                        readonly: false,
                        size: "default",
                        layout: "column",
                        span: "24"
                    }
                ]
            }
        ],
        toolbar: [
            {
                gutter: 24,
                offset: 12,
                span: 10,
                position: "right",
                group: [
                    {
                        name: "Tab1_GYGC_refresh",
                        class: "editable-add-btn",
                        text: "刷新",
                        icon: "anticon anticon-reload",
                        color: "text-primary",
                        cancelPermission: true
                    },
                    {
                        name: "Tab1_GYGC_addRow",
                        class: "editable-add-btn",
                        text: "新增",
                        action: "CREATE",
                        icon: "anticon anticon-plus",
                        color: "text-primary",
                        cancelPermission: true
                    },
                    {
                        name: "Tab1_GYGC_updateRow",
                        class: "editable-add-btn",
                        text: "修改",
                        action: "EDIT",
                        icon: "anticon anticon-edit",
                        color: "text-success",
                        cancelPermission: true
                    },
                    {
                        name: "Tab1_GYGC_DeleteChecked",
                        class: "editable-add-btn",
                        text: "删除",
                        action: "DELETE",
                        icon: "anticon anticon-delete",
                        color: "text-red-light",
                        ajaxConfig: {
                            delete: [
                                {
                                    actionName: "delete",
                                    url: "common/MpmMpf",
                                    ajaxType: "delete",
                                    title: "提示",
                                    message: "是否将选中的数据执行当前操作？",
                                    params: [
                                        {
                                            name: "Id",
                                            valueName: "_id",
                                            type: "tempValue"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        name: "Tab1_GYGC_DeleteCheckedAll",
                        class: "editable-add-btn",
                        text: "删除明细",
                        icon: "anticon anticon-delete",
                        color: "text-red-light",
                        actionType: "post",
                        actionName: "execChecked",
                        ajaxConfig: [
                            {
                                action: "EXECUTE_CHECKED",
                                url: "common/DeleteMpfData",
                                ajaxType: "post",
                                title: "提示",
                                message:
                                    "确认要删除该工艺版本信息吗？删除后对应的详细信息全部删除！",
                                params: [
                                    {
                                        name: "Id",
                                        valueName: "Id",
                                        type: "tempValue"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Tab1_GYGC_saveForm",
                        class: "editable-add-btn",
                        text: "保存",
                        action: "SAVE",
                        icon: "anticon anticon-save",
                        type: "default",
                        color: "text-primary",
                        cancelPermission: true,
                        ajaxConfig: [
                            {
                                url: "common/ShowCase",
                                ajaxType: "post",
                                params: [
                                    {
                                        name: "caseName",
                                        type: "componentValue",
                                        valueName: "caseName"
                                    }
                                ]
                            },
                            {
                                url: "common/ShowCase",
                                ajaxType: "put",
                                params: [
                                    {
                                        name: "Id",
                                        type: "value",
                                        value:
                                            "3d7fbe7fc19e4540aaedb5635468b00f"
                                    },
                                    {
                                        name: "enabled",
                                        type: "componentValue",
                                        valueName: "enabled"
                                    },
                                    {
                                        name: "caseType",
                                        type: "componentValue",
                                        valueName: "caseType"
                                    },
                                    {
                                        name: "caseName",
                                        type: "componentValue",
                                        valueName: "caseName"
                                    },
                                    {
                                        name: "caseLevel",
                                        type: "componentValue",
                                        valueName: "caseLevel"
                                    },
                                    {
                                        name: "caseCount",
                                        type: "componentValue",
                                        valueName: "caseCount"
                                    },
                                    {
                                        name: "remark",
                                        type: "componentValue",
                                        valueName: "remark"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Tab1_GYGC_cancelRow",
                        class: "editable-add-btn",
                        text: "取消",
                        action: "CANCEL",
                        icon: "anticon anticon-rollback",
                        color: "text-grey-darker",
                        cancelPermission: true
                    }
                ]
            }
        ],
        dataList: [],
        relations: [],
        cascade1: [
            {
                name: "caseType", // 发出级联请求的小组件（就是配置里的name 字段名称）
                CascadeObjects: [
                    {
                        cascadeName: "caseName",
                        cascadeValueItems: [],
                        cascadeDataItems: [
                            {
                                data: {
                                    type: "setValue", // option/ajax/setValue
                                    setValue_data: {
                                        // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                        option: {
                                            name: "value",
                                            type: "selectValue",
                                            value: "1",
                                            valueName: "value"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        select: [
            {
                name: "caseName",
                type: "selectGrid",
                config: {
                    width: "1024", // 弹出的宽度
                    title: "弹出表格",
                    selectGrid: {
                        viewId: "businesskey_Table",
                        component: "bsnTable",
                        keyId: "Id",
                        pagination: true, // 是否分页
                        showTotal: true, // 是否显示总数据量
                        pageSize: 5, // 默pageSizeOptions认每页数据条数
                        isSelectGrid: true, // 【弹出表格时用】弹出表格值为true
                        selectGridValueName: "Id", // 【弹出表格时用】指定绑定的value值
                        "": [5, 10, 20, 30, 40, 50],
                        ajaxConfig: {
                            url: "common/CfgTable",
                            ajaxType: "get",
                            params: [
                                {
                                    name: "_sort",
                                    type: "value",
                                    valueName: "",
                                    value: "createDate desc"
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
                                title: "Id",
                                field: "Id",
                                width: 80,
                                hidden: true,
                                editor: {
                                    type: "input",
                                    field: "Id",
                                    options: {
                                        type: "input",
                                        labelSize: "6",
                                        controlSize: "18",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "名称",
                                field: "name",
                                width: 80,
                                showFilter: false,
                                showSort: false,
                                editor: {
                                    type: "input",
                                    field: "name",
                                    options: {
                                        type: "input",
                                        labelSize: "6",
                                        controlSize: "18",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "编号",
                                field: "code",
                                width: 80,
                                showFilter: false,
                                showSort: false,
                                editor: {
                                    type: "input",
                                    field: "code",
                                    options: {
                                        type: "input",
                                        labelSize: "6",
                                        controlSize: "18",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "备注",
                                field: "remark",
                                width: 80,
                                hidden: false,
                                editor: {
                                    type: "input",
                                    field: "remark",
                                    options: {
                                        type: "input",
                                        labelSize: "6",
                                        controlSize: "18",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "创建时间",
                                field: "createDate",
                                width: 80,
                                hidden: false,
                                showSort: true,
                                editor: {
                                    type: "input",
                                    field: "createDate",
                                    options: {
                                        type: "input",
                                        labelSize: "6",
                                        controlSize: "18",
                                        inputType: "text"
                                    }
                                }
                            }
                        ],
                        toolbar: [
                            {
                                group: [
                                    {
                                        name: "refresh",
                                        class: "editable-add-btn",
                                        text: "刷新",
                                        cancelPermission: true
                                    },
                                    {
                                        name: "addSearchRow",
                                        class: "editable-add-btn",
                                        text: "查询",
                                        action: "SEARCH",
                                        actionType: "addSearchRow",
                                        actionName: "addSearchRow",
                                        cancelPermission: true
                                    },
                                    {
                                        name: "cancelSearchRow",
                                        class: "editable-add-btn",
                                        text: "取消查询",
                                        action: "SEARCH",
                                        actionType: "cancelSearchRow",
                                        actionName: "cancelSearchRow",
                                        cancelPermission: true
                                    },
                                    {
                                        name: "cancelSelectRow",
                                        class: "editable-add-btn",
                                        text: "取消选中",
                                        action: "CANCEL_SELECTED",
                                        cancelPermission: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                name: "caseName1",
                type: "selectTreeGrid",
                config: {
                    nzWidth: 768,
                    title: "弹出树",
                    selectTreeGrid: {
                        isSelectGrid: true,
                        selectGridValueName: "Id", // 【弹出表格时用】指定绑定的value值
                        // 'title': '树表网格',
                        viewId: "bsnTreeTable",
                        component: "bsnTreeTable",
                        info: true,
                        keyId: "Id",
                        pagination: true,
                        showTotal: true,
                        pageSize: 5,
                        pageSizeOptions: [5, 18, 20, 30, 40, 50],
                        ajaxConfig: {
                            url: "common/GetCase/null/GetCase",
                            ajaxType: "get",
                            params: [],
                            filter: []
                        },
                        columns: [
                            {
                                title: "Id",
                                field: "Id",
                                width: 80,
                                hidden: true,
                                editor: {
                                    type: "input",
                                    field: "Id",
                                    options: {
                                        type: "input",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "名称",
                                field: "caseName",
                                width: "90px",
                                expand: true,
                                showFilter: false,
                                showSort: false,
                                editor: {
                                    type: "input",
                                    field: "caseName",
                                    options: {
                                        type: "input",
                                        inputType: "text",
                                        width: "100px"
                                    }
                                }
                            },
                            {
                                title: "类别",
                                field: "caseTypeText",
                                width: "100px",
                                hidden: false,
                                showFilter: true,
                                showSort: true,
                                editor: {
                                    type: "select",
                                    field: "caseType",
                                    options: {
                                        type: "select",
                                        name: "caseType",
                                        label: "Type",
                                        notFoundContent: "",
                                        selectModel: false,
                                        showSearch: true,
                                        placeholder: "-请选择数据-",
                                        disabled: false,
                                        size: "default",
                                        clear: true,
                                        width: "150px",
                                        options: [
                                            {
                                                label: "表格",
                                                value: "1",
                                                disabled: false
                                            },
                                            {
                                                label: "树组件",
                                                value: "2",
                                                disabled: false
                                            },
                                            {
                                                label: "树表",
                                                value: "3",
                                                disabled: false
                                            },
                                            {
                                                label: "表单",
                                                value: "4",
                                                disabled: false
                                            },
                                            {
                                                label: "标签页",
                                                value: "5",
                                                disabled: false
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                title: "数量",
                                field: "caseCount",
                                width: 80,
                                hidden: false,
                                editor: {
                                    type: "input",
                                    field: "caseCount",
                                    options: {
                                        type: "input",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "级别",
                                field: "caseLevel",
                                width: 80,
                                hidden: false,
                                showFilter: false,
                                showSort: false,
                                editor: {
                                    type: "input",
                                    field: "caseLevel",
                                    options: {
                                        type: "input",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "父类别",
                                field: "parentName",
                                width: 80,
                                hidden: false,
                                showFilter: false,
                                showSort: false,
                                editor: {
                                    type: "input",
                                    field: "parentId",
                                    options: {
                                        type: "selectTree",
                                        name: "parentId",
                                        label: "父类别",
                                        notFoundContent: "",
                                        selectModel: false,
                                        showSearch: true,
                                        placeholder: "--请选择--",
                                        disabled: false,
                                        size: "default",
                                        columns: [
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
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: []
                                        },
                                        layout: "column",
                                        span: "24"
                                    }
                                }
                            },
                            {
                                title: "创建时间",
                                field: "createDate",
                                width: 80,
                                hidden: false,
                                dataType: "date",
                                editor: {
                                    type: "input",
                                    pipe: "datetime",
                                    field: "createDate",
                                    options: {
                                        type: "input",
                                        inputType: "datetime"
                                    }
                                }
                            },
                            {
                                title: "备注",
                                field: "remark",
                                width: 80,
                                hidden: false,
                                editor: {
                                    type: "input",
                                    field: "remark",
                                    options: {
                                        type: "input",
                                        inputType: "text"
                                    }
                                }
                            },
                            {
                                title: "状态",
                                field: "enabledText",
                                width: 80,
                                hidden: false,
                                formatter: [
                                    {
                                        value: "启用",
                                        bgcolor: "",
                                        fontcolor: "text-blue",
                                        valueas: "启用"
                                    },
                                    {
                                        value: "禁用",
                                        bgcolor: "",
                                        fontcolor: "text-red",
                                        valueas: "禁用"
                                    }
                                ],
                                editor: {
                                    type: "select",
                                    field: "enabled",
                                    options: {
                                        type: "select",
                                        inputType: "submit",
                                        name: "enabled",
                                        notFoundContent: "",
                                        selectModel: false,
                                        showSearch: true,
                                        placeholder: "-请选择-",
                                        disabled: false,
                                        size: "default",
                                        clear: true,
                                        width: "80px",
                                        options: [
                                            {
                                                label: "启用",
                                                value: true,
                                                disabled: false
                                            },
                                            {
                                                label: "禁用",
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
                                        name: "refresh",
                                        action: "REFRESH",
                                        text: "刷新",
                                        color: "text-primary",
                                        cancelPermission: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    };

    constructor(private http: _HttpClient) {}

    isVisible = false;
    isConfirmLoading = false;
    _value;
    ngOnInit(): void {}

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        console.log("确认");
        this.isVisible = false;

        // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
        console.log("选中行", this.table.dataList);
        console.log("选中行", this.table._selectRow);
        this._value = this.table._selectRow["name"];
    }

    handleCancel(): void {
        console.log("点击取消");
        this.isVisible = false;
    }
}

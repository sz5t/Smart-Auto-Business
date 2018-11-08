import { Component, Injectable, OnInit } from "@angular/core";
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

@Component({
    selector: "cn-data-modeling, [data-modeling]",
    templateUrl: "./data-modeling.component.html",
    styles: []
})
export class DataModelingComponent implements OnInit {
    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: "area1",
                            title: "建模主表",
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
                                        size: "small",
                                        showCheckBox: true,
                                        pagination: true,
                                        showTotal: true,
                                        pageSize: 5,
                                        pageSizeOptions: [
                                            5,
                                            10,
                                            20,
                                            30,
                                            40,
                                            50
                                        ],
                                        ajaxConfig: {
                                            url: "common/getmoudledata",
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
                                            parent: true,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "childTable",
                                                cascadeMode: "REFRESH",
                                                params: [],
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
                                                title: "表名称",
                                                field: "tableName",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "tableName",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "表资源名",
                                                field: "resourceName",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false
                                            },
                                            {
                                                title: "表类别",
                                                field: "tableType",
                                                width: 80,
                                                hidden: true,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "Type",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "Type",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "-请选择-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "130px",
                                                        defaultValue: "1",
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
                                                                label:
                                                                    "父子关系表",
                                                                value: "3",
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "父表id",
                                                field: "parentTableId",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "parentTableId",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "父表名称",
                                                field: "parentTableName",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "parentTableName",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否存在表关系",
                                                field: "isHavaDatalink",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "isHavaDatalink",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "子表指向父表的Id",
                                                field: "subRefParentColumnId",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field:
                                                        "subRefParentColumnId",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "子表指向父表的字段名称",
                                                field: "subRefParentColumnName",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field:
                                                        "subRefParentColumnName",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否启用",
                                                field: "enabled",
                                                width: 80,
                                                hidden: false,
                                                formatter: [
                                                    {
                                                        value: "启用",
                                                        bgcolor: "",
                                                        fontcolor: "text-green",
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
                                                    field: "isEnabled",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "Enable",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "--请选择--",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "80px",
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
                                            },
                                            {
                                                title: "备注",
                                                field: "comments",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "comments",
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
                                            },
                                            {
                                                title: "是否建模",
                                                field: "buildModel",
                                                width: 80,
                                                hidden: false,
                                                showSort: true,
                                                formatter: [
                                                    {
                                                        value: "是",
                                                        bgcolor: "",
                                                        fontcolor: "text-blue",
                                                        valueas: "已建模"
                                                    },
                                                    {
                                                        value: "否",
                                                        bgcolor: "",
                                                        fontcolor: "text-red",
                                                        valueas: "未建模"
                                                    }
                                                ]
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
                                                        action: "REFRESH",
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
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/table/delete",
                                                                ajaxType:
                                                                    "delete",
                                                                message:
                                                                    "确定要删除选中的表？",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "_ids",
                                                                        valueName:
                                                                            "Id",
                                                                        type:
                                                                            "checkedId"
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
                                                        cancelPermission: true,
                                                        type: "method/action",
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SAVE_ROW",
                                                                url:
                                                                    "common/table/add",
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
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                action:
                                                                    "EXECUTE_EDIT_ROW",
                                                                url:
                                                                    "common/table/update",
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
                                                    },
                                                    {
                                                        name: "cancelRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消",
                                                        cancelPermission: true,
                                                        action: "CANCEL"
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
                                                        text: "批量建模",
                                                        actionType: "post",
                                                        actionName:
                                                            "BuildModel",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_CHECKED",
                                                                url:
                                                                    "common/table/model/create",
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
                                                    },
                                                    {
                                                        name:
                                                            "executeCheckedRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "批量取消建模",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_CHECKED",
                                                                url:
                                                                    "common/table/model/drop",
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
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name:
                                                            "executeSelectedRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "建模",
                                                        actionType: "post",
                                                        actionName:
                                                            "BuildModel",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SELECTED",
                                                                url:
                                                                    "common/table/model/create",
                                                                title: "提示",
                                                                message:
                                                                    "是否为该数据进行建模？",
                                                                ajaxType:
                                                                    "post",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        valueName:
                                                                            "Id",
                                                                        type:
                                                                            "selectedRow"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            "executeSelectedRowClose",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "取消建模",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SELECTED",
                                                                url:
                                                                    "common/table/model/drop",
                                                                ajaxType:
                                                                    "post",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "Id",
                                                                        valueName:
                                                                            "Id",
                                                                        type:
                                                                            "selectedRow"
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
                                                        name: "addSearchRow",
                                                        class:
                                                            "editable-add-btn",
                                                        text: "查询",
                                                        action: "SEARCH",
                                                        cancelPermission: true,
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
                                                        cancelPermission: true,
                                                        actionType:
                                                            "cancelSearchRow",
                                                        actionName:
                                                            "cancelSearchRow"
                                                    }
                                                ]
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
            },
            {
                row: {
                    cols: [
                        {
                            id: "area2",
                            title: "建模列",
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
                                        viewId: "childTable",
                                        component: "bsnTable",
                                        keyId: "Id",
                                        size: "small",
                                        showCheckBox: true,
                                        pagination: true,
                                        showTotal: true,
                                        pageSize: 5,
                                        pageSizeOptions: [
                                            5,
                                            10,
                                            20,
                                            30,
                                            40,
                                            50
                                        ],
                                        ajaxConfig: {
                                            url: "common/getcolumndata",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "tableId",
                                                    type: "tempValue",
                                                    valueName: "_parentId",
                                                    value: ""
                                                },
                                                {
                                                    name: "_sort",
                                                    type: "value",
                                                    valueName: "",
                                                    value: "orderCode asc"
                                                },
                                                {
                                                    name: "operStatus",
                                                    type: "value",
                                                    valueName: "",
                                                    value: "ne(2)"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: false
                                        },
                                        relations: [
                                            {
                                                relationViewId: "parentTable",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "Id",
                                                        cid: "_parentId"
                                                    }
                                                ],
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
                                                title: "列名",
                                                field: "columnName",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "columnName",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "列属性名",
                                                field: "propName",
                                                width: 80,
                                                showFilter: false,
                                                showSort: false
                                            },
                                            {
                                                title: "数据类型",
                                                field: "columnType",
                                                width: 80,
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "columnType",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "columnType",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "-请选择-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "130px",
                                                        defaultValue: "string",
                                                        options: [
                                                            {
                                                                label: "字符串",
                                                                value: "string",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "整型",
                                                                value:
                                                                    "integer",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "日期",
                                                                value: "date",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "布尔值",
                                                                value:
                                                                    "boolean",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "浮点型",
                                                                value: "double",
                                                                disabled: false
                                                            },
                                                            {
                                                                label:
                                                                    "字符大字段",
                                                                value: "clob",
                                                                disabled: false
                                                            },
                                                            {
                                                                label:
                                                                    "二进制大字段",
                                                                value: "blob",
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "字段长度",
                                                field: "length",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "length",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        placeholder: "必填",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "数据精度",
                                                field: "precision",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "precision",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "默认值",
                                                field: "defaultValue",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "defaultValue",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否唯一",
                                                field: "sole",
                                                width: 60,
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "isUnique",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "isUnique",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "否",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "60px",
                                                        defaultValue: 0,
                                                        options: [
                                                            {
                                                                label: "是",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "否",
                                                                value: 0,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否为空",
                                                field: "nullabled",
                                                width: 60,
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "isNullabled",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "isNullabled",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "否",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "60px",
                                                        defaultValue: 1,
                                                        options: [
                                                            {
                                                                label: "是",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "否",
                                                                value: 0,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否数据字典",
                                                field: "dataDictionary",
                                                width: 60,
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "isDataDictionary",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "columnType",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "否",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "60px",
                                                        defaultValue: 0,
                                                        options: [
                                                            {
                                                                label: "是",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "否",
                                                                value: 0,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "数据字典编码",
                                                field: "dataDictionaryCode",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "dataDictionaryCode",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "排序",
                                                field: "orderCode",
                                                width: 60,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "orderCode",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        placeholder: "必填",
                                                        defaultValue: 1,
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "是否有效",
                                                field: "enabled",
                                                width: 60,
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "isEnabled",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "isEnabled",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "是",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "60px",
                                                        defaultValue: 1,
                                                        options: [
                                                            {
                                                                label: "是",
                                                                value: 1,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "否",
                                                                value: 0,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "备注",
                                                field: "comments",
                                                width: 100,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "comments",
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
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_CHECKED_ID",
                                                                url:
                                                                    "common/column/delete",
                                                                ajaxType:
                                                                    "delete",
                                                                message:
                                                                    "确定要删除选中的列？",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "_ids",
                                                                        valueName:
                                                                            "Id",
                                                                        type:
                                                                            "checkedId"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: "saveRow",
                                                        class:
                                                            "editable-add-btn",
                                                        type: "default",
                                                        text: "保存",
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    "EXECUTE_SAVE_ROW",
                                                                url:
                                                                    "common/column/add",
                                                                ajaxType:
                                                                    "post",
                                                                params: [
                                                                    {
                                                                        name:
                                                                            "tableId",
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
                                                                            "columnName",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "columnName",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "columnType",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "columnType",
                                                                        value:
                                                                            "1"
                                                                    },
                                                                    {
                                                                        name:
                                                                            "length",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "length",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "precision",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "precision",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "defaultValue",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "defaultValue",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isUnique",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isUnique",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isNullabled",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isNullabled",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isDataDictionary",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isDataDictionary",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "dataDictionaryCode",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "dataDictionaryCode",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "orderCode",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "orderCode",
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
                                                                            "comments",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "comments",
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
                                                            },
                                                            {
                                                                action:
                                                                    "EXECUTE_EDIT_ROW",
                                                                url:
                                                                    "common/column/update",
                                                                ajaxType: "put",
                                                                cancelPermission: true,
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
                                                                            "tableId",
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
                                                                            "columnName",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "columnName",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "columnType",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "columnType",
                                                                        value:
                                                                            "1"
                                                                    },
                                                                    {
                                                                        name:
                                                                            "length",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "length",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "precision",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "precision",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "defaultValue",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "defaultValue",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isUnique",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isUnique",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isNullabled",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isNullabled",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "isDataDictionary",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "isDataDictionary",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "dataDictionaryCode",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "dataDictionaryCode",
                                                                        value:
                                                                            ""
                                                                    },
                                                                    {
                                                                        name:
                                                                            "orderCode",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "orderCode",
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
                                                                            "comments",
                                                                        type:
                                                                            "componentValue",
                                                                        valueName:
                                                                            "comments",
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
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: "showDialogPage",
                                                        text: "编码规则",
                                                        action: "WINDOW",
                                                        actionType:
                                                            "windowDialog",
                                                        actionName:
                                                            "ShowCaseWindow",
                                                        type: "showLayout",
                                                        cancelPermission: true
                                                    }
                                                ]
                                            }
                                        ],
                                        cascade: [
                                            {
                                                name: "isUnique",
                                                CascadeObjects: [
                                                    {
                                                        cascadeName:
                                                            "isNullabled",
                                                        cascadeValueItems: [
                                                            {
                                                                caseValue: {
                                                                    type:
                                                                        "selectValue",
                                                                    valueName:
                                                                        "value",
                                                                    regular:
                                                                        "^1$"
                                                                },
                                                                data: {
                                                                    type:
                                                                        "setValue",
                                                                    setValue_data: {
                                                                        option: {
                                                                            name:
                                                                                "value",
                                                                            type:
                                                                                "value",
                                                                            value: 0,
                                                                            valueName:
                                                                                "data"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        cascadeDataItems: []
                                                    }
                                                ]
                                            }
                                        ],
                                        dataSet: [],
                                        windowDialog: [
                                            {
                                                title: "",
                                                name: "ShowCaseWindow",
                                                layoutName: "CodeRule",
                                                width: 800,
                                                buttons: [
                                                    {
                                                        name: "ok1",
                                                        text: "确定",
                                                        type: "primary"
                                                    },
                                                    {
                                                        name: "close",
                                                        text: "关闭"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    permissions: {
                                        viewId: "childTable",
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

    constructor(private http: _HttpClient) {}

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }
}

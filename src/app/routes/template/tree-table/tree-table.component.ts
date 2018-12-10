import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-tree-table',
    templateUrl: './tree-table.component.html'
})
export class TreeTableComponent implements OnInit {
    public config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '数据网格',
                            span: 24,
                            theme: 'fill',
                            icon: 'right-square',
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
                                        title: '',
                                        viewId: 'bsnTreeTable',
                                        component: 'bsnTreeTable',
                                        info: true,
                                        keyId: 'Id',
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 5, // 默认每页数据条数
                                        pageSizeOptions: [
                                            5,
                                            18,
                                            20,
                                            30,
                                            40,
                                            50
                                        ],
                                        ajaxConfig: {
                                            url: 'common/GetCase/_root/GetCase',
                                            ajaxType: 'get',
                                            params: [
                                                {
                                                    name: '_root.parentId',
                                                    type: 'value',
                                                    value: null
                                                }
                                            ],
                                            filter: []
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
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '名称',
                                                field: 'caseName',
                                                width: '90px',
                                                expand: true,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseName',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text',
                                                        width: '100px'
                                                    }
                                                }
                                            },
                                            {
                                                title: '类别',
                                                field: 'caseTypeText',
                                                width: '100px',
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'caseType',
                                                    options: {
                                                        type: 'select',
                                                        name: 'caseType',
                                                        label: 'Type',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            '-请选择数据-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '150px',
                                                        options: [
                                                            {
                                                                label: '表格',
                                                                value: '1',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '树组件',
                                                                value: '2',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '树表',
                                                                value: '3',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '表单',
                                                                value: '4',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '标签页',
                                                                value: '5',
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '数量',
                                                field: 'caseCount',
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseCount',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '级别',
                                                field: 'caseLevel',
                                                width: 80,
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseLevel',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '父类别',
                                                field: 'parentName',
                                                width: 80,
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'parentId',
                                                    options: {
                                                        type: 'selectTree',
                                                        name: 'parentId',
                                                        label: '父类别',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            '--请选择--',
                                                        disabled: false,
                                                        size: 'default',
                                                        columns: [
                                                            // 字段映射，映射成树结构所需
                                                            {
                                                                title: '主键',
                                                                field: 'key',
                                                                valueName: 'Id'
                                                            },
                                                            {
                                                                title: '父节点',
                                                                field:
                                                                    'parentId',
                                                                valueName:
                                                                    'parentId'
                                                            },
                                                            {
                                                                title: '标题',
                                                                field: 'title',
                                                                valueName:
                                                                    'caseName'
                                                            }
                                                        ],
                                                        ajaxConfig: {
                                                            url:
                                                                'common/ShowCase',
                                                            ajaxType: 'get',
                                                            params: [
                                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                            ]
                                                        },
                                                        layout: 'column',
                                                        span: '24'
                                                    }
                                                }
                                            },
                                            {
                                                title: '创建时间',
                                                field: 'createDate',
                                                width: 80,
                                                hidden: false,
                                                dataType: 'date',
                                                editor: {
                                                    type: 'input',
                                                    pipe: 'datetime',
                                                    field: 'createDate',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'datetime'
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
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '状态',
                                                field: 'enabled',
                                                width: 80,
                                                hidden: true
                                            },
                                            {
                                                title: '状态',
                                                field: 'enableText',
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'enabled',
                                                    options: {
                                                        type: 'select',
                                                        inputType: 'submit',
                                                        name: 'enabled',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: '-请选择-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '80px',
                                                        options: [
                                                            {
                                                                label: '启用',
                                                                value: true,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '禁用',
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
                                        beforeOperation: [
                                            {
                                                name: 'editForm',
                                                status: [
                                                    {
                                                        conditions: [
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '0',
                                                                    checkType:
                                                                        'value'
                                                                },
                                                                {
                                                                    name:
                                                                        'caseLevel',
                                                                    value: 1,
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ],
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '1',
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ]
                                                        ],
                                                        action: {
                                                            type: 'info',
                                                            message:
                                                                '启用状态无法删除',
                                                            execute: 'prevent'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                name: 'deleteRow2',
                                                status: [
                                                    {
                                                        conditions: [
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '1',
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ]
                                                        ],
                                                        action: {
                                                            type: 'confirm',
                                                            message:
                                                                '启用状态是否确认删除',
                                                            execute: 'continue'
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: 'refresh',
                                                        action: 'REFRESH',
                                                        text: '刷新',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增',
                                                        action: 'CREATE',
                                                        icon: 'plus',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增下级',
                                                        action: 'CREATE_CHILD',
                                                        icon: 'plus',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'updateRow',
                                                        text: '修改',
                                                        action: 'EDIT',
                                                        icon: 'edit',
                                                        color: 'text-success',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'deleteRow1',
                                                        text: '删除1',
                                                        action: 'DELETE',
                                                        cancelPermission: true,
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        'delete',
                                                                    url:
                                                                        'common/ShowCase',
                                                                    ajaxType:
                                                                        'delete',
                                                                    title:
                                                                        '警告！',
                                                                    message:
                                                                        '确认要删除当前勾选的数据么？？？'
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'deleteRow2',
                                                        text: '删除2',
                                                        icon: 'delete',
                                                        color: 'text-warning',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'delete', // 批量删除调用建模API，不能使用该模式，delete动作无法传递数组参数类型
                                                                title: '警告！',
                                                                message:
                                                                    '确认要删除当前勾选的数据么？？？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            '_ids',
                                                                        type:
                                                                            'checkedId',
                                                                        valueName:
                                                                            'Id'
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
                                                            'executeCheckedRow_1',
                                                        text:
                                                            '多选删除(确认+提示操作)',
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    'checkDeleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DelConfirmShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isCheck',
                                                                        valueName:
                                                                            '',
                                                                        type:
                                                                            'value',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        type:
                                                                            'value',
                                                                        value:
                                                                            'output',
                                                                        valueName:
                                                                            ''
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                name:
                                                                    'deleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DelConfirmShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                parentName:
                                                                    'checkDeleteShowCase',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isCheck',
                                                                        valueName:
                                                                            '',
                                                                        type:
                                                                            'value',
                                                                        value: false
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'dataSet1',
                                                                        dataType:
                                                                            'table'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            'executeCheckedRow1',
                                                        text:
                                                            '多选删除(验证+提示)',
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        actionType: 'post',
                                                        actionName:
                                                            'execChecked',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    'checkDeleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DeleteShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                title: '提示',
                                                                message:
                                                                    '是否将选中的数据执行当前操作？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        type:
                                                                            'value',
                                                                        value:
                                                                            'output',
                                                                        valueName:
                                                                            ''
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            'executeSelectedRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '选中删除',
                                                        icon: 'delete',
                                                        actionType: 'post',
                                                        actionName:
                                                            'execSelected',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_SELECTED',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'delete',
                                                                title: '提示',
                                                                message:
                                                                    '是否将选中的数据执行当前操作？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        valueName:
                                                                            'Id', // _selectedItem
                                                                        type:
                                                                            'selectedRow' // tempValue
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'saveRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '保存',
                                                        icon: 'save',
                                                        type: 'default',
                                                        color: 'text-primary',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_SAVE_TREE_ROW',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'createDate',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'createDate',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                action:
                                                                    'EXECUTE_EDIT_TREE_ROW',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType: 'put',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'Id',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'createDate',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'createDate',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'cancelRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '取消',
                                                        action: 'CANCEL',
                                                        icon: 'rollback',
                                                        color:
                                                            'text-grey-darker',
                                                        cancelPermission: true
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: 'addForm',
                                                        text: '弹出新增表单',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'addShowCase',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'editForm',
                                                        text: '弹出编辑表单',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'updateShowCase',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'batchEditForm',
                                                        text:
                                                            '弹出批量处理表单',
                                                        action: 'FORM_BATCH',
                                                        actionName:
                                                            'batchUpdateShowCase',
                                                        icon: 'form',
                                                        type: 'showBatchForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'showDialogPage',
                                                        text: '弹出页面',
                                                        action: 'WINDOW',
                                                        actionType:
                                                            'windowDialog',
                                                        actionName:
                                                            'ShowCaseWindow',
                                                        type: 'showLayout',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'upload',
                                                        icon: 'upload',
                                                        text: '附件上传',
                                                        action: 'UPLOAD',
                                                        actionType:
                                                            'uploadDialog',
                                                        actionName:
                                                            'uploadCase',
                                                        type: 'uploadDialog',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addFormcascade',
                                                        text: '级联例子',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'addShowCasecascade',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    }
                                                ]
                                            },
                                            {
                                                dropdown: [
                                                    {
                                                        name: 'btnGroup',
                                                        text: ' 分组操作',
                                                        icon: 'plus',
                                                        buttons: [
                                                            {
                                                                name: 'refresh',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: ' 刷新',
                                                                icon: 'list',
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name: 'addRow',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: '新增',
                                                                icon: 'plus',
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name:
                                                                    'updateRow',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: '修改',
                                                                icon: 'edit',
                                                                cancelPermission: true
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        formDialog: [
                                            {
                                                keyId: 'Id',
                                                name: 'addShowCase',
                                                layout: 'horizontal',
                                                title: '新增数据',
                                                width: '800',
                                                isCard: true,
                                                type: 'add',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'caseType',
                                                                label: '类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'selectTree',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'parentId',
                                                                label: '父类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                columns: [
                                                                    // 字段映射，映射成树结构所需
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
                                                                    // 'url': 'common/ShowCase/null/ShowCase?_recursive=true&_deep=-1',
                                                                    url:
                                                                        'common/ShowCase',
                                                                    ajaxType:
                                                                        'get',
                                                                    params: [
                                                                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                                    ]
                                                                },
                                                                cascader: [
                                                                    {
                                                                        name:
                                                                            'getCaseName',
                                                                        type:
                                                                            'sender',
                                                                        cascaderData: {
                                                                            params: [
                                                                                {
                                                                                    pid:
                                                                                        'Id',
                                                                                    cid:
                                                                                        '_typeId'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                isRequired: true,
                                                                placeholder:
                                                                    '请输入Case名称',
                                                                perfix: 'edit',
                                                                suffix: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入Case名称!!!!'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'minLength',
                                                                        length:
                                                                            '3',
                                                                        errorMessage:
                                                                            '请输入最少三个字符'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'maxLength',
                                                                        length:
                                                                            '5',
                                                                        errorMessage:
                                                                            '请输入最5个字符'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseLevel',
                                                                label: '级别',
                                                                isRequired: true,
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入级别'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                isRequired: true,
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入数量'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'pattern',
                                                                        pattern: /^\d+$/,
                                                                        errorMessage:
                                                                            '请填写数字'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'datePicker',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'createDate',
                                                                label:
                                                                    '创建时间',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                showTime: true,
                                                                format:
                                                                    'yyyy-MM-dd',
                                                                showToday: true,
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'rangePicker',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'createDate',
                                                                label:
                                                                    '时间范围',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                showTime: true,
                                                                format:
                                                                    'yyyy-MM-dd',
                                                                showToday: true,
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'save',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    url:
                                                                        'common/ShowCase',
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                'caseName',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseName'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseCount',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseCount'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'createTime',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'createTime'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'enabled',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'enabled'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseLevel',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseLevel'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'parentId',
                                                                            type:
                                                                                'tempValue',
                                                                            valueName:
                                                                                '_parentId'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'remark',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'remark'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseType',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseType'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'saveAndKeep',
                                                        text: '保存并继续',
                                                        type: 'primary',
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    url:
                                                                        'common/ShowCase',
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                'caseName',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseName'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseCount',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseCount'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'createTime',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'createTime'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'enabled',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'enabled'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseLevel',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseLevel'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'parentId',
                                                                            type:
                                                                                'tempValue',
                                                                            valueName:
                                                                                '_parentId'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'remark',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'remark'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseType',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseType'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'reset',
                                                        text: '重置'
                                                    },
                                                    {
                                                        name: 'close',
                                                        text: '关闭'
                                                    }
                                                ]
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'updateShowCase',
                                                title: '编辑',
                                                width: '600',
                                                type: 'edit',
                                                ajaxConfig: {
                                                    url: 'common/ShowCase',
                                                    ajaxType: 'getById',
                                                    params: [
                                                        {
                                                            name: 'Id',
                                                            type: 'tempValue',
                                                            valueName: '_id',
                                                            value: ''
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
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'caseType',
                                                                label: '类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'selectTree',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'parentId',
                                                                label: '父类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                columns: [
                                                                    // 字段映射，映射成树结构所需
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
                                                                    params: [
                                                                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                                    ]
                                                                },
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseLevel',
                                                                label: '级别',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'save',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: {
                                                            put: [
                                                                {
                                                                    ajaxType:
                                                                        'put',
                                                                    url:
                                                                        'common/ShowCase',
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                'Id',
                                                                            type:
                                                                                'tempValue',
                                                                            valueName:
                                                                                '_id'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseName',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseName'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseCount',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseCount'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'parentId',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'parentId'
                                                                        },
                                                                        // { name: 'createTime', type: 'componentValue', valueName: 'createTime'},
                                                                        {
                                                                            name:
                                                                                'enabled',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'enabled'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseLevel',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseLevel'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'remark',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'remark'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseType',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseType'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'close',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '关闭'
                                                    },
                                                    {
                                                        name: 'reset',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '重置'
                                                    }
                                                ],
                                                dataList: []
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'addShowCasecascade',
                                                layout: 'horizontal',
                                                title: '新增数据',
                                                width: '800',
                                                isCard: true,
                                                type: 'add',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Enable',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Type',
                                                                label: '类别Id',
                                                                labelName:
                                                                    'Name',
                                                                valueName: 'Id',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Level',
                                                                label: '级别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '初级',
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
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'Remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                cascade: [
                                                    // 配置 信息
                                                    {
                                                        name: 'Type', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                        CascadeObjects: [
                                                            // 当前小组件级联对象数组
                                                            {
                                                                cascadeName:
                                                                    'Enable', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                'value',
                                                                            regular:
                                                                                '^1$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '1'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^2$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '2'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^3$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'show', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '3'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^4$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'show', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '4',
                                                                                        label:
                                                                                            '4'
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
                                                                                    '新值'
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
                                                                cascadeDateItems: [] // 应答描述数组，同一个组件可以做出不同应答
                                                            },
                                                            {
                                                                cascadeName:
                                                                    'Level', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                'value',
                                                                            regular:
                                                                                '^2$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '高级'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '中级'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '普通'
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
                                                                                    '新值'
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    }
                                                                ],
                                                                cascadeDateItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        data: {
                                                                            type:
                                                                                'ajax', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '高级date'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '高级date'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '高级date'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                                option: [
                                                                                    {
                                                                                        name:
                                                                                            'typevalue',
                                                                                        type:
                                                                                            'value',
                                                                                        value:
                                                                                            '1',
                                                                                        valueName:
                                                                                            'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    '新值'
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
                                                ]
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'batchUpdateShowCase',
                                                title: '批量编辑',
                                                width: '600',
                                                type: 'edit',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                defaultValue: 1,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '启用',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        label:
                                                                            '禁用',
                                                                        value: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'batchSave',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: [
                                                            {
                                                                ajaxType: 'put',
                                                                url:
                                                                    'common/ShowCase',
                                                                batch: true,
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'checkedRow',
                                                                        valueName:
                                                                            'Id',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'close',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '关闭'
                                                    }
                                                ],
                                                dataList: []
                                            }
                                        ],
                                        windowDialog: [
                                            {
                                                title: '',
                                                name: 'ShowCaseWindow',
                                                layoutName: 'singleTable',
                                                width: 800,
                                                buttons: [
                                                    {
                                                        name: 'ok',
                                                        text: '确定',
                                                        type: 'primary'
                                                    },
                                                    {
                                                        name: 'close',
                                                        text: '关闭'
                                                    }
                                                ]
                                            }
                                        ],
                                        uploadDialog: [
                                            {
                                                keyId: 'Id',
                                                title: '',
                                                name: 'uploadCase',
                                                width: '600',
                                                ajaxConfig: {
                                                    deleteUrl: 'file/delete',
                                                    listUrl: 'common/SysFile',
                                                    url: 'file/upload',
                                                    downloadUrl:
                                                        'file/download',
                                                    ajaxType: 'post',
                                                    params: [
                                                        {
                                                            name: 'Id',
                                                            type: 'tempValue',
                                                            valueName: '_id'
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
            },
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '异步树表',
                            span: 24,
                            theme: 'fill',
                            icon: 'right-square',
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
                                        title: '',
                                        viewId: 'bsnAsyncTreeTable',
                                        component: 'bsnAsyncTreeTable',
                                        info: true,
                                        keyId: 'Id',
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 5, // 默认每页数据条数
                                        pageSizeOptions: [
                                            5,
                                            18,
                                            20,
                                            30,
                                            40,
                                            50
                                        ],
                                        ajaxConfig: {
                                            url: 'common/GetCase/_root/GetCase',
                                            ajaxType: 'get',
                                            params: [
                                                {
                                                    name: '_root.parentId',
                                                    type: 'value',
                                                    value: null
                                                },
                                                {
                                                    name: '_deep',
                                                    type: 'value',
                                                    value: '2'
                                                }
                                            ],
                                            childrenParams: [
                                                {
                                                    name: '_root.parentId',
                                                    type: 'selectedRow',
                                                    valueName: 'Id'
                                                },
                                                {
                                                    name: '_deep',
                                                    type: 'value',
                                                    value: '2'
                                                }
                                            ]
                                        },
                                        columns: [
                                            {
                                                title: 'Id',
                                                field: 'Id',
                                                width: '0px',
                                                hidden: true
                                            },
                                            {
                                                title: '名称',
                                                field: 'caseName',
                                                width: 'auto',
                                                expand: true,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseName',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text',
                                                        width: '200px'
                                                    }
                                                }
                                            },
                                            {
                                                title: '类别',
                                                field: 'caseTypeText',
                                                width: '100px',
                                                hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'caseType',
                                                    options: {
                                                        type: 'select',
                                                        name: 'caseType',
                                                        label: 'Type',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            '-请选择数据-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '150px',
                                                        options: [
                                                            {
                                                                label: '表格',
                                                                value: '1',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '树组件',
                                                                value: '2',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '树表',
                                                                value: '3',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '表单',
                                                                value: '4',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '标签页',
                                                                value: '5',
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '数量',
                                                field: 'caseCount',
                                                width: '100px',
                                                hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseCount',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '级别',
                                                field: 'caseLevel',
                                                width: '80px',
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'caseLevel',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '父类别',
                                                field: 'parentName',
                                                width: '80px',
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'parentId',
                                                    options: {
                                                        type: 'selectTree',
                                                        name: 'parentId',
                                                        label: '父类别',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            '--请选择--',
                                                        disabled: false,
                                                        size: 'default',
                                                        columns: [
                                                            // 字段映射，映射成树结构所需
                                                            {
                                                                title: '主键',
                                                                field: 'key',
                                                                valueName: 'Id'
                                                            },
                                                            {
                                                                title: '父节点',
                                                                field:
                                                                    'parentId',
                                                                valueName:
                                                                    'parentId'
                                                            },
                                                            {
                                                                title: '标题',
                                                                field: 'title',
                                                                valueName:
                                                                    'caseName'
                                                            }
                                                        ],
                                                        ajaxConfig: {
                                                            url:
                                                                'common/ShowCase',
                                                            ajaxType: 'get',
                                                            params: [
                                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                            ]
                                                        },
                                                        layout: 'column',
                                                        span: '24'
                                                    }
                                                }
                                            },
                                            {
                                                title: '创建时间',
                                                field: 'createDate',
                                                width: 'auto',
                                                hidden: false,
                                                dataType: 'date',
                                                editor: {
                                                    type: 'input',
                                                    pipe: 'datetime',
                                                    field: 'createDate',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'datetime'
                                                    }
                                                }
                                            },
                                            {
                                                title: '备注',
                                                field: 'remark',
                                                width: '80px',
                                                hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'remark',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '状态',
                                                field: 'enabled',
                                                width: '80px',
                                                hidden: true
                                            },
                                            {
                                                title: '状态',
                                                field: 'enableText',
                                                width: '80px',
                                                hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'enabled',
                                                    options: {
                                                        type: 'select',
                                                        inputType: 'submit',
                                                        name: 'enabled',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: '-请选择-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '80px',
                                                        options: [
                                                            {
                                                                label: '启用',
                                                                value: '1',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '禁用',
                                                                value: '0',
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
                                        beforeOperation: [
                                            {
                                                name: 'editForm',
                                                status: [
                                                    {
                                                        conditions: [
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '0',
                                                                    checkType:
                                                                        'value'
                                                                },
                                                                {
                                                                    name:
                                                                        'caseLevel',
                                                                    value: 1,
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ],
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '1',
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ]
                                                        ],
                                                        action: {
                                                            type: 'info',
                                                            message:
                                                                '启用状态无法删除',
                                                            execute: 'prevent'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                name: 'deleteRow2',
                                                status: [
                                                    {
                                                        conditions: [
                                                            [
                                                                {
                                                                    name:
                                                                        'enabled',
                                                                    value: '1',
                                                                    checkType:
                                                                        'value'
                                                                }
                                                            ]
                                                        ],
                                                        action: {
                                                            type: 'confirm',
                                                            message:
                                                                '启用状态是否确认删除',
                                                            execute: 'continue'
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: 'refresh',
                                                        action: 'REFRESH',
                                                        text: '刷新',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增',
                                                        action: 'CREATE',
                                                        icon: 'plus',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增下级',
                                                        action: 'CREATE_CHILD',
                                                        icon: 'plus',
                                                        color: 'text-primary',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'updateRow',
                                                        text: '修改',
                                                        action: 'EDIT',
                                                        icon: 'edit',
                                                        color: 'text-success',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'deleteRow',
                                                        text: '删除1',
                                                        action: 'DELETE',
                                                        cancelPermission: true,
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        'delete',
                                                                    url:
                                                                        'common/ShowCase',
                                                                    ajaxType:
                                                                        'delete',
                                                                    title:
                                                                        '警告！',
                                                                    message:
                                                                        '确认要删除当前勾选的数据么？？？'
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'deleteRow2',
                                                        text: '删除2',
                                                        icon: 'delete',
                                                        color: 'text-warning',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'delete', // 批量删除调用建模API，不能使用该模式，delete动作无法传递数组参数类型
                                                                title: '警告！',
                                                                message:
                                                                    '确认要删除当前勾选的数据么？？？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            '_ids',
                                                                        type:
                                                                            'checkedId',
                                                                        valueName:
                                                                            'Id'
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
                                                            'executeCheckedRow_1',
                                                        text:
                                                            '多选删除(确认+提示操作)',
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    'checkDeleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DelConfirmShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isCheck',
                                                                        valueName:
                                                                            '',
                                                                        type:
                                                                            'value',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        type:
                                                                            'value',
                                                                        value:
                                                                            'output',
                                                                        valueName:
                                                                            ''
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                name:
                                                                    'deleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DelConfirmShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                parentName:
                                                                    'checkDeleteShowCase',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isCheck',
                                                                        valueName:
                                                                            '',
                                                                        type:
                                                                            'value',
                                                                        value: false
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'dataSet1',
                                                                        dataType:
                                                                            'table'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            'executeCheckedRow1',
                                                        text:
                                                            '多选删除(验证+提示)',
                                                        icon: 'delete',
                                                        color: 'text-red-light',
                                                        actionType: 'post',
                                                        actionName:
                                                            'execChecked',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                name:
                                                                    'checkDeleteShowCase',
                                                                action:
                                                                    'EXECUTE_CHECKED_ID',
                                                                url:
                                                                    'common/DeleteShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                title: '提示',
                                                                message:
                                                                    '是否将选中的数据执行当前操作？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Ids',
                                                                        valueName:
                                                                            'Id', // 或者'_checkedIds'
                                                                        type:
                                                                            'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        type:
                                                                            'value',
                                                                        value:
                                                                            'output',
                                                                        valueName:
                                                                            ''
                                                                    }
                                                                ],
                                                                outputParams: [
                                                                    {
                                                                        name:
                                                                            'Message',
                                                                        dataType:
                                                                            'message'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name:
                                                            'executeSelectedRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '选中删除',
                                                        icon: 'delete',
                                                        actionType: 'post',
                                                        actionName:
                                                            'execSelected',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_SELECTED',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'delete',
                                                                title: '提示',
                                                                message:
                                                                    '是否将选中的数据执行当前操作？',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            '_ids',
                                                                        valueName:
                                                                            'Id', // _selectedItem
                                                                        type:
                                                                            'selectedRow' // tempValue
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'saveRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '保存',
                                                        icon: 'save',
                                                        type: 'default',
                                                        color: 'text-primary',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_SAVE_TREE_ROW',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType:
                                                                    'post',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'createDate',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'createDate',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                action:
                                                                    'EXECUTE_EDIT_TREE_ROW',
                                                                url:
                                                                    'common/ShowCase',
                                                                ajaxType: 'put',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'Id',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'createDate',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'createDate',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'cancelRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '取消',
                                                        action: 'CANCEL',
                                                        icon: 'rollback',
                                                        color:
                                                            'text-grey-darker',
                                                        cancelPermission: true
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        name: 'addForm',
                                                        text: '弹出新增表单',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'addShowCase',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'editForm',
                                                        text: '弹出编辑表单',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'updateShowCase',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'batchEditForm',
                                                        text:
                                                            '弹出批量处理表单',
                                                        action: 'FORM_BATCH',
                                                        actionName:
                                                            'batchUpdateShowCase',
                                                        icon: 'form',
                                                        type: 'showBatchForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'showDialogPage',
                                                        text: '弹出页面',
                                                        action: 'WINDOW',
                                                        actionType:
                                                            'windowDialog',
                                                        actionName:
                                                            'ShowCaseWindow',
                                                        type: 'showLayout',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'upload',
                                                        icon: 'upload',
                                                        text: '附件上传',
                                                        action: 'UPLOAD',
                                                        actionType:
                                                            'uploadDialog',
                                                        actionName:
                                                            'uploadCase',
                                                        type: 'uploadDialog',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addFormcascade',
                                                        text: '级联例子',
                                                        icon: 'form',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'addShowCasecascade',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    }
                                                ]
                                            },
                                            {
                                                dropdown: [
                                                    {
                                                        name: 'btnGroup',
                                                        text: ' 分组操作',
                                                        icon: 'plus',
                                                        buttons: [
                                                            {
                                                                name: 'refresh',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: ' 刷新',
                                                                icon: 'list',
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name: 'addRow',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: '新增',
                                                                icon: 'plus',
                                                                cancelPermission: true
                                                            },
                                                            {
                                                                name:
                                                                    'updateRow',
                                                                class:
                                                                    'editable-add-btn',
                                                                text: '修改',
                                                                icon: 'edit',
                                                                cancelPermission: true
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        formDialog: [
                                            {
                                                keyId: 'Id',
                                                name: 'addShowCase',
                                                layout: 'horizontal',
                                                title: '新增数据',
                                                width: '800',
                                                isCard: true,
                                                type: 'add',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '启用',
                                                                        value: '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '禁用',
                                                                        value: '0',
                                                                        disabled: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'caseType',
                                                                label: '类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'selectTree',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'parentId',
                                                                label: '父类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                columns: [
                                                                    // 字段映射，映射成树结构所需
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
                                                                    // 'url': 'common/ShowCase/null/ShowCase?_recursive=true&_deep=-1',
                                                                    url:
                                                                        'common/ShowCase',
                                                                    ajaxType:
                                                                        'get',
                                                                    params: [
                                                                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                                    ]
                                                                },
                                                                cascader: [
                                                                    {
                                                                        name:
                                                                            'getCaseName',
                                                                        type:
                                                                            'sender',
                                                                        cascaderData: {
                                                                            params: [
                                                                                {
                                                                                    pid:
                                                                                        'Id',
                                                                                    cid:
                                                                                        '_typeId'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                isRequired: true,
                                                                placeholder:
                                                                    '请输入Case名称',
                                                                perfix: 'edit',
                                                                suffix: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入Case名称!!!!'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'minLength',
                                                                        length:
                                                                            '3',
                                                                        errorMessage:
                                                                            '请输入最少三个字符'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'maxLength',
                                                                        length:
                                                                            '5',
                                                                        errorMessage:
                                                                            '请输入最5个字符'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseLevel',
                                                                label: '级别',
                                                                isRequired: true,
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入级别'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                isRequired: true,
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24',
                                                                validations: [
                                                                    {
                                                                        validator:
                                                                            'required',
                                                                        errorMessage:
                                                                            '请输入数量'
                                                                    },
                                                                    {
                                                                        validator:
                                                                            'pattern',
                                                                        pattern: /^\d+$/,
                                                                        errorMessage:
                                                                            '请填写数字'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'datePicker',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'createDate',
                                                                label:
                                                                    '创建时间',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                showTime: true,
                                                                format:
                                                                    'yyyy-MM-dd',
                                                                showToday: true,
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'rangePicker',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'createDate',
                                                                label:
                                                                    '时间范围',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                showTime: true,
                                                                format:
                                                                    'yyyy-MM-dd',
                                                                showToday: true,
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'save',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: [
                                                            {
                                                                ajaxType: 'post',
                                                                url:
                                                                    'common/ShowCase',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'createTime',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'createTime'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'tempValue',
                                                                        valueName:
                                                                            '_parentId'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'saveAndKeep',
                                                        text: '保存并继续',
                                                        type: 'primary',
                                                        ajaxConfig: {
                                                            post: [
                                                                {
                                                                    url:
                                                                        'common/ShowCase',
                                                                    params: [
                                                                        {
                                                                            name:
                                                                                'caseName',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseName'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseCount',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseCount'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'createTime',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'createTime'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'enabled',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'enabled'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseLevel',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseLevel'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'parentId',
                                                                            type:
                                                                                'tempValue',
                                                                            valueName:
                                                                                '_parentId'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'remark',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'remark'
                                                                        },
                                                                        {
                                                                            name:
                                                                                'caseType',
                                                                            type:
                                                                                'componentValue',
                                                                            valueName:
                                                                                'caseType'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'reset',
                                                        text: '重置'
                                                    },
                                                    {
                                                        name: 'close',
                                                        text: '关闭'
                                                    }
                                                ]
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'updateShowCase',
                                                title: '编辑',
                                                width: '600',
                                                editable: 'put',
                                                type: 'edit',
                                                ajaxConfig: {
                                                    url: 'common/ShowCase',
                                                    ajaxType: 'getById',
                                                    params: [
                                                        {
                                                            name: 'Id',
                                                            type: 'tempValue',
                                                            valueName: '_id',
                                                            value: ''
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
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '启用',
                                                                        value: '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '禁用',
                                                                        value: '0',
                                                                        disabled: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'caseType',
                                                                label: '类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type:
                                                                    'selectTree',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name:
                                                                    'parentId',
                                                                label: '父类别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                columns: [
                                                                    // 字段映射，映射成树结构所需
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
                                                                    params: [
                                                                        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId'}
                                                                    ]
                                                                },
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseLevel',
                                                                label: '级别',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'save',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: [
                                                            {
                                                                ajaxType:
                                                                    'put',
                                                                url:
                                                                    'common/ShowCase',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'tempValue',
                                                                        valueName:
                                                                            '_id'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseName',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseName'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseCount',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseCount'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId'
                                                                    },
                                                                    // { name: 'createTime', type: 'componentValue', valueName: 'createTime'},
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseLevel',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseLevel'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'remark',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'remark'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'caseType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'caseType'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'close',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '关闭'
                                                    },
                                                    {
                                                        name: 'reset',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '重置'
                                                    }
                                                ],
                                                dataList: []
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'addShowCasecascade',
                                                layout: 'horizontal',
                                                title: '新增数据',
                                                width: '800',
                                                isCard: true,
                                                type: 'add',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Enable',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Type',
                                                                label: '类别Id',
                                                                labelName:
                                                                    'Name',
                                                                valueName: 'Id',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '表',
                                                                        value:
                                                                            '1',
                                                                        disabled: false
                                                                    },
                                                                    {
                                                                        label:
                                                                            '树',
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
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseName',
                                                                label: '名称',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'submit',
                                                                name: 'Level',
                                                                label: '级别',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '初级',
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
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name:
                                                                    'caseCount',
                                                                label: '数量',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                hidden: false,
                                                                type: 'input',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                inputType:
                                                                    'text',
                                                                name: 'Remark',
                                                                label: '备注',
                                                                placeholder: '',
                                                                disabled: false,
                                                                readonly: false,
                                                                size: 'default',
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                cascade: [
                                                    // 配置 信息
                                                    {
                                                        name: 'Type', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                        CascadeObjects: [
                                                            // 当前小组件级联对象数组
                                                            {
                                                                cascadeName:
                                                                    'Enable', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                'value',
                                                                            regular:
                                                                                '^1$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '1'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^2$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '2'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^3$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'show', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '3'
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
                                                                                    '新值'
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
                                                                                'value',
                                                                            regular:
                                                                                '^4$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'show', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '4',
                                                                                        label:
                                                                                            '4'
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
                                                                                    '新值'
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
                                                                cascadeDateItems: [] // 应答描述数组，同一个组件可以做出不同应答
                                                            },
                                                            {
                                                                cascadeName:
                                                                    'Level', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: {
                                                                            valueName:
                                                                                'value',
                                                                            regular:
                                                                                '^2$'
                                                                        }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', },
                                                                        // ],
                                                                        data: {
                                                                            type:
                                                                                'option', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '高级'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '中级'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '普通'
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
                                                                                    '新值'
                                                                            },
                                                                            show_data: {
                                                                                // 当前表单的展示字段等信息
                                                                            },
                                                                            relation_data: {}
                                                                        }
                                                                    }
                                                                ],
                                                                cascadeDateItems: [
                                                                    // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        data: {
                                                                            type:
                                                                                'ajax', // option/ajax/setValue
                                                                            option_data: {
                                                                                // 静态数据集
                                                                                option: [
                                                                                    {
                                                                                        value:
                                                                                            '1',
                                                                                        label:
                                                                                            '高级date'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '2',
                                                                                        label:
                                                                                            '高级date'
                                                                                    },
                                                                                    {
                                                                                        value:
                                                                                            '3',
                                                                                        label:
                                                                                            '高级date'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            ajax_data: {
                                                                                // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                                option: [
                                                                                    {
                                                                                        name:
                                                                                            'typevalue',
                                                                                        type:
                                                                                            'value',
                                                                                        value:
                                                                                            '1',
                                                                                        valueName:
                                                                                            'value'
                                                                                    }
                                                                                ]
                                                                            },
                                                                            setValue_data: {
                                                                                // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value:
                                                                                    '新值'
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
                                                ]
                                            },
                                            {
                                                keyId: 'Id',
                                                name: 'batchUpdateShowCase',
                                                title: '批量编辑',
                                                width: '600',
                                                type: 'edit',
                                                componentType: {
                                                    parent: false,
                                                    child: false,
                                                    own: true
                                                },
                                                forms: [
                                                    {
                                                        controls: [
                                                            {
                                                                type: 'select',
                                                                labelSize: '6',
                                                                controlSize:
                                                                    '16',
                                                                name: 'enabled',
                                                                label: '状态',
                                                                notFoundContent:
                                                                    '',
                                                                selectModel: false,
                                                                showSearch: true,
                                                                placeholder:
                                                                    '--请选择--',
                                                                disabled: false,
                                                                size: 'default',
                                                                defaultValue: 1,
                                                                options: [
                                                                    {
                                                                        label:
                                                                            '启用',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        label:
                                                                            '禁用',
                                                                        value: false
                                                                    }
                                                                ],
                                                                layout:
                                                                    'column',
                                                                span: '24'
                                                            }
                                                        ]
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        name: 'batchSave',
                                                        text: '保存',
                                                        type: 'primary',
                                                        ajaxConfig: [
                                                            {
                                                                ajaxType: 'put',
                                                                url:
                                                                    'common/ShowCase',
                                                                batch: true,
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'checkedRow',
                                                                        valueName:
                                                                            'Id',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'enabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'enabled',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        name: 'close',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '关闭'
                                                    }
                                                ],
                                                dataList: []
                                            }
                                        ],
                                        windowDialog: [
                                            {
                                                title: '',
                                                name: 'ShowCaseWindow',
                                                layoutName: 'singleTable',
                                                width: 800,
                                                buttons: [
                                                    {
                                                        name: 'ok',
                                                        text: '确定',
                                                        type: 'primary'
                                                    },
                                                    {
                                                        name: 'close',
                                                        text: '关闭'
                                                    }
                                                ]
                                            }
                                        ],
                                        uploadDialog: [
                                            {
                                                keyId: 'Id',
                                                title: '',
                                                name: 'uploadCase',
                                                width: '600',
                                                ajaxConfig: {
                                                    deleteUrl: 'file/delete',
                                                    listUrl: 'common/SysFile',
                                                    url: 'file/upload',
                                                    downloadUrl:
                                                        'file/download',
                                                    ajaxType: 'post',
                                                    params: [
                                                        {
                                                            name: 'Id',
                                                            type: 'tempValue',
                                                            valueName: '_id'
                                                        }
                                                    ]
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
        ]
    };
    constructor() {}

    public ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }
}

import { CnComponentBase } from '@shared/components/cn-component-base';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ApiService } from '@core/utility/api-service';
import {
    BSN_COMPONENT_CASCADE,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE_MODES
} from '@core/relative-Service/BsnTableStatus';
import { Observer } from 'rxjs';

@Component({
    selector: 'cn-module-managers',
    templateUrl: './module-managers.component.html'
})
export class ModuleManagersComponent extends CnComponentBase implements OnInit {
    public config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '数据网格',
                            span: 24,
                            icon: 'icon-list',
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
                                        title: '模块管理',
                                        viewId: 'bsnTreeTable',
                                        component: 'bsnAsyncTreeTable',
                                        info: true,
                                        keyId: 'Id',
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 15, // 默认每页数据条数
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
                                                'common/CfgProjectModule/_root/CfgProjectModule',
                                            ajaxType: 'get',
                                            params: [
                                                {
                                                    name: 'refProjectId',
                                                    type: 'tempValue',
                                                    valueName: '_projectId'
                                                },
                                                {
                                                    name: '_root.refProjectId',
                                                    type: 'tempValue',
                                                    valueName: '_projectId'
                                                },
                                                {
                                                    name: '_sort',
                                                    type: 'value',
                                                    value: 'createDate desc'
                                                },
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
                                                    name: 'refProjectId',
                                                    type: 'tempValue',
                                                    valueName: '_projectId'
                                                },
                                                // {
                                                //     name: 'projectId',
                                                //     type: 'tempValue',
                                                //     valueName: '_projectId'
                                                // },
                                                {
                                                    name: '_sort',
                                                    type: 'value',
                                                    value: 'createDate desc'
                                                },
                                                {
                                                    name: '_deep',
                                                    type: 'value',
                                                    value: '2'
                                                }
                                            ],
                                            filter: []
                                        },
                                        columns: [
                                            {
                                                title: 'Id',
                                                field: 'Id',
                                                width: 'auto',
                                                hidden: true
                                            },
                                            {
                                                title: '模块名称',
                                                field: 'name',
                                                width: '200px',
                                                expand: true,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'name',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text',
                                                        width: '100px'
                                                    }
                                                }
                                            },
                                            {
                                                title: '排序编号',
                                                field: 'orderCode',
                                                width: '90px',
                                                expand: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'orderCode',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text',
                                                        width: '100px'
                                                    }
                                                }
                                            },
                                            {
                                                title: '模块编码',
                                                field: 'code',
                                                width: '100px',
                                                hidden: false,
                                                expand: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'code',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text',
                                                        width: '100px'
                                                    }
                                                }
                                            },
                                            {
                                                title: 'URL',
                                                field: 'url',
                                                width: '150px',
                                                hidden: false,
                                                expand: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'url',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: 'APP_URL',
                                                field: 'appUrl',
                                                width: '150px',
                                                hidden: false,
                                                expand: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'appUrl',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '图标',
                                                field: 'icon',
                                                width: '100px',
                                                hidden: false,
                                                expand: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'icon',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '父级',
                                                field: 'parentName',
                                                width: '100px',
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
                                                        expandAll: false,
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
                                                                    'name'
                                                            }
                                                        ],
                                                        ajaxConfig: {
                                                            url:
                                                                'common/CfgProjectModule',
                                                            ajaxType: 'get',
                                                            params: [
                                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                                            ]
                                                        },
                                                        layout: 'column',
                                                        span: '24'
                                                    }
                                                }
                                            },
                                            {
                                                title: '配置文本',
                                                field: 'moduleBody',
                                                width: '80px',
                                                hidden: false,
                                                expand: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'moduleBody',
                                                    options: {
                                                        type: 'input',
                                                        inputType: 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否有效',
                                                field: 'isEnabled',
                                                width: '80px',
                                                hidden: false,
                                                expand: false,
                                                formatter: [
                                                    {
                                                        value: '1',
                                                        bgcolor: '',
                                                        fontcolor: 'text-blue',
                                                        valueas: '有效'
                                                    },
                                                    {
                                                        value: '0',
                                                        bgcolor: '',
                                                        fontcolor: 'text-red',
                                                        valueas: '无效'
                                                    }
                                                ],
                                                editor: {
                                                    type: 'select',
                                                    field: 'isEnabled',
                                                    options: {
                                                        type: 'select',
                                                        name: 'isEnabled',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: '-请选择-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '80px',
                                                        defaultValue: true,
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
                                            },
                                            {
                                                title: '是否发布',
                                                field: 'isNeedDeploy',
                                                width: '80px',
                                                hidden: false,
                                                expand: false,
                                                formatter: [
                                                    {
                                                        value: '1',
                                                        bgcolor: '',
                                                        fontcolor: 'text-blue',
                                                        valueas: '发布'
                                                    },
                                                    {
                                                        value: '0',
                                                        bgcolor: '',
                                                        fontcolor: 'text-red',
                                                        valueas: '未发布'
                                                    }
                                                ],
                                                editor: {
                                                    type: 'select',
                                                    field: 'isNeedDeploy',
                                                    options: {
                                                        type: 'select',
                                                        inputType: 'submit',
                                                        name: 'isNeedDeploy',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: '-请选择-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '80px',
                                                        defaultValue: true,
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
                                            },
                                            {
                                                title: '所属平台',
                                                field: 'belongPlatformType',
                                                width: '80px',
                                                hidden: false,
                                                expand: false,
                                                formatter: [
                                                    {
                                                        value: '1',
                                                        bgcolor: '',
                                                        fontcolor: 'text-blue',
                                                        valueas: '配置平台'
                                                    },
                                                    {
                                                        value: '2',
                                                        bgcolor: '',
                                                        fontcolor: 'text-red',
                                                        valueas: '运行平台'
                                                    },
                                                    {
                                                        value: '3',
                                                        bgcolor: '',
                                                        fontcolor: 'text-green',
                                                        valueas: '通用'
                                                    }
                                                ],
                                                editor: {
                                                    type: 'select',
                                                    field: 'belongPlatformType',
                                                    options: {
                                                        type: 'select',
                                                        inputType: 'submit',
                                                        name:
                                                            'belongPlatformType',
                                                        notFoundContent: '',
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: '-请选择-',
                                                        disabled: false,
                                                        size: 'default',
                                                        clear: true,
                                                        width: '80px',
                                                        defaultValue: '2',
                                                        options: [
                                                            {
                                                                label:
                                                                    '配置平台',
                                                                value: '1',
                                                                disabled: false
                                                            },
                                                            {
                                                                label:
                                                                    '运行平台',
                                                                value: '2',
                                                                disabled: false
                                                            },
                                                            {
                                                                label: '通用',
                                                                value: '3',
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId:
                                                    'projectId_module',
                                                cascadeMode: 'REFRESH_AS_CHILD',
                                                params: [
                                                    {
                                                        pid: 'Id',
                                                        cid: '_projectId'
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        toolbar: [
                                            {
                                                group: [
                                                    {
                                                        name: 'refresh',
                                                        text: '刷新',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增',
                                                        action: 'CREATE',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addRow',
                                                        text: '新增下级模块',
                                                        action: 'CREATE_CHILD',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'updateRow',
                                                        text: '编辑',
                                                        action: 'EDIT',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'deleteRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '删除',
                                                        action: 'DELETE',
                                                        cancelPermission: true,
                                                        ajaxConfig: {
                                                            delete: [
                                                                {
                                                                    actionName:
                                                                        'delete',
                                                                    url:
                                                                        'common/CfgProjectModule',
                                                                    ajaxType:
                                                                        'delete'
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        name: 'saveRow',
                                                        text: '保存',
                                                        cancelPermission: true,
                                                        ajaxConfig: [
                                                            {
                                                                action:
                                                                    'EXECUTE_SAVE_TREE_ROW',
                                                                url:
                                                                    'common/CfgProjectModule',
                                                                ajaxType:
                                                                    'post',
                                                                params: [
                                                                    {
                                                                        name: 'refProjectId',
                                                                        type: 'tempValue',
                                                                        valueName: '_projectId'
                                                                    },
                                                                    {
                                                                        name: 'projectId',
                                                                        type: 'tempValue',
                                                                        valueName: '_projectId'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'name',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'name',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'code',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'code',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'url',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'url',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'appUrl',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'appUrl',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'icon',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'icon',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'orderCode',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'orderCode',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'moduleBody',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'moduleBody',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isEnabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isEnabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isNeedDeploy',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isNeedDeploy',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'belongPlatformType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'belongPlatformType',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                action:
                                                                    'EXECUTE_EDIT_TREE_ROW',
                                                                url:
                                                                    'common/CfgProjectModule',
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
                                                                            'parentId',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'parentId'
                                                                    },
                                                                    {
                                                                        name:
                                                                            'name',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'name',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'code',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'code',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'url',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'url',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'appUrl',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'appUrl',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'icon',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'icon',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'orderCode',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'orderCode',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'moduleBody',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'moduleBody',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isEnabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isEnabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isNeedDeploy',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isNeedDeploy',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'belongPlatformType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'belongPlatformType',
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
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addForm',
                                                        text: '新增模块',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName: 'addModule',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'editForm',
                                                        text: '编辑模块',
                                                        action: 'FORM',
                                                        actionType:
                                                            'formDialog',
                                                        actionName:
                                                            'updateModule',
                                                        type: 'showForm',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'addSearchRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '查询',
                                                        action: 'SEARCH',
                                                        actionType:
                                                            'addSearchRow',
                                                        actionName:
                                                            'addSearchRow',
                                                        cancelPermission: true
                                                    },
                                                    {
                                                        name: 'cancelSearchRow',
                                                        class:
                                                            'editable-add-btn',
                                                        text: '取消查询',
                                                        action: 'SEARCH',
                                                        actionType:
                                                            'cancelSearchRow',
                                                        actionName:
                                                            'cancelSearchRow',
                                                        cancelPermission: true
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    formDialog: [
                                        {
                                            keyId: 'Id',
                                            name: 'addModule',
                                            layout: 'horizontal',
                                            title: '新增模块',
                                            width: '800',
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
                                                            type: 'selectTree',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name: 'parentId',
                                                            label: '父模块',
                                                            labelName: 'name',
                                                            valueName: 'Id',
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
                                                                        'name'
                                                                }
                                                            ],
                                                            ajaxConfig: {
                                                                url:
                                                                    'common/CfgProjectModule',
                                                                ajaxType: 'get',
                                                                params: []
                                                            },
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'name',
                                                            label: '模块名称',
                                                            isRequired: true,
                                                            placeholder:
                                                                '请输入模块名称',
                                                            perfix:
                                                                'anticon anticon-edit',
                                                            suffix: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输入模块名称!!!!'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'code',
                                                            label: '模块编码',
                                                            isRequired: true,
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输编码'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'url',
                                                            label: 'URL',
                                                            isRequired: true,
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输入数量'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'icon',
                                                            label: '图标',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'codeOrder',
                                                            label: '排序',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'codeOrder',
                                                            label: '排序',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name:
                                                                'isNeedDeploy',
                                                            label: '是否有效',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label: '是',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label: '否',
                                                                    value: '0',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'submit',
                                                            name: 'isEnabled',
                                                            label: '是否有效',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label:
                                                                        '有效',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '无效',
                                                                    value: '0',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name:
                                                                'belongPlatformType',
                                                            label: '所属平台',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label:
                                                                        '配置平台',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '运行平台',
                                                                    value: '2',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '通用',
                                                                    value: '3',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
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
                                                                    'common/CfgProjectModule',
                                                                params: [
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
                                                                            'name',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'name',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'code',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'code',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'url',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'url',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'icon',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'icon',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'orderCode',
                                                                        type:
                                                                            'tempValue',
                                                                        valueName:
                                                                            'orderCode',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'moduleBody',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'moduleBody',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isEnabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isEnabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isNeedDeploy',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isNeedDeploy',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'belongPlatformType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'belongPlatformType',
                                                                        value:
                                                                            ''
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
                                                                    'common/ProjectModuleUpdate',
                                                                params: [
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
                                                                            'name',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'name',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'code',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'code',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'url',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'url',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'icon',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'icon',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'orderCode',
                                                                        type:
                                                                            'tempValue',
                                                                        valueName:
                                                                            'orderCode',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'moduleBody',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'moduleBody',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isEnabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isEnabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isNeedDeploy',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isNeedDeploy',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'belongPlatformType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'belongPlatformType',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                { name: 'reset', text: '重置' },
                                                { name: 'close', text: '关闭' }
                                            ]
                                        },
                                        {
                                            keyId: 'Id',
                                            name: 'updateModule',
                                            title: '编辑模块',
                                            width: '600',
                                            ajaxConfig: {
                                                url: 'common/CfgProjectModule',
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
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'Id',
                                                            label: 'Id',
                                                            isRequired: false,
                                                            placeholder: '',
                                                            perfix:
                                                                'anticon anticon-edit',
                                                            suffix: '',
                                                            disabled: true,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输入模块名称!!!!'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'selectTree',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name: 'parentId',
                                                            label: '父模块',
                                                            labelName: 'name',
                                                            valueName: 'Id',
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
                                                                        'name'
                                                                }
                                                            ],
                                                            ajaxConfig: {
                                                                url:
                                                                    'common/CfgProjectModule',
                                                                ajaxType: 'get',
                                                                params: []
                                                            },
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'name',
                                                            label: '模块名称',
                                                            isRequired: true,
                                                            placeholder:
                                                                '请输入模块名称',
                                                            perfix:
                                                                'anticon anticon-edit',
                                                            suffix: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输入模块名称!!!!'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'code',
                                                            label: '模块编码',
                                                            isRequired: true,
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输编码'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'url',
                                                            label: 'URL',
                                                            isRequired: true,
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24',
                                                            validations: [
                                                                {
                                                                    validator:
                                                                        'required',
                                                                    errorMessage:
                                                                        '请输入数量'
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
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'icon',
                                                            label: '图标',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'codeOrder',
                                                            label: '排序',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'input',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'text',
                                                            name: 'codeOrder',
                                                            label: '排序',
                                                            placeholder: '',
                                                            disabled: false,
                                                            readonly: false,
                                                            size: 'default',
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name:
                                                                'isNeedDeploy',
                                                            label: '是否有效',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label: '是',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label: '否',
                                                                    value: '0',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            inputType: 'submit',
                                                            name: 'isEnabled',
                                                            label: '是否有效',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label:
                                                                        '有效',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '无效',
                                                                    value: '0',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
                                                            span: '24'
                                                        }
                                                    ]
                                                },
                                                {
                                                    controls: [
                                                        {
                                                            type: 'select',
                                                            labelSize: '6',
                                                            controlSize: '16',
                                                            name:
                                                                'belongPlatformType',
                                                            label: '所属平台',
                                                            notFoundContent: '',
                                                            selectModel: false,
                                                            showSearch: true,
                                                            placeholder:
                                                                '--请选择--',
                                                            disabled: false,
                                                            size: 'default',
                                                            options: [
                                                                {
                                                                    label:
                                                                        '配置平台',
                                                                    value: '1',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '运行平台',
                                                                    value: '2',
                                                                    disabled: false
                                                                },
                                                                {
                                                                    label:
                                                                        '通用',
                                                                    value: '3',
                                                                    disabled: false
                                                                }
                                                            ],
                                                            layout: 'column',
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
                                                                url:
                                                                    'common/CfgProjectModule',
                                                                params: [
                                                                    {
                                                                        name:
                                                                            'Id',
                                                                        type:
                                                                            'tempValue',
                                                                        valueName:
                                                                            '_id',
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
                                                                            'name',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'name',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'code',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'code',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'url',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'url',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'icon',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'icon',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'orderCode',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'orderCode',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'moduleBody',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'moduleBody',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isEnabled',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isEnabled',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'isNeedDeploy',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'isNeedDeploy',
                                                                        value:
                                                                            ''
                                                                    },
                                                                    {
                                                                        name:
                                                                            'belongPlatformType',
                                                                        type:
                                                                            'componentValue',
                                                                        valueName:
                                                                            'belongPlatformType',
                                                                        value:
                                                                            ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    name: 'close',
                                                    class: 'editable-add-btn',
                                                    text: '关闭'
                                                },
                                                {
                                                    name: 'reset',
                                                    class: 'editable-add-btn',
                                                    text: '重置'
                                                }
                                            ]
                                        }
                                    ],
                                    dataList: []
                                }
                            ]
                        }
                    ]
                }
            }
            /*
             {
             row: {
             cols: [
             {
             id: 'area3',
             title: '查询',
             span: 24,
             icon: 'anticon anticon-search',
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
             'viewId': 'search_form',
             'component': 'form_view',
             'keyId': 'Id',
             'layout': 'horizontal',
             'componentType': {
             'parent': true,
             'child': false,
             'own': true
             },
             'forms':
             [
             {
             controls: [
             {
             'type': 'select',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'submit',
             'name': 'Enable',
             'label': '状态',
             'notFoundContent': '',
             'selectModel': false,
             'showSearch': true,
             'placeholder': '--请选择--',
             'disabled': false,
             'size': 'default',
             'options': [
             {
             'label': '启用',
             'value': 1,
             'disabled': false
             },
             {
             'label': '禁用',
             'value': 0,
             'disabled': false
             }
             ],
             'layout': 'column',
             'span': '24'
             },
             ]
             },
             {
             controls: [
             {
             'type': 'select',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'submit',
             'name': 'Type',
             'label': '类别Id',
             'notFoundContent': '',
             'selectModel': false,
             'showSearch': true,
             'placeholder': '--请选择--',
             'disabled': false,
             'size': 'default',
             'options': [
             {
             'label': '表',
             'value': '1',
             'disabled': false
             },
             {
             'label': '树',
             'value': '2',
             'disabled': false
             },
             {
             'label': '树表',
             'value': '3',
             'disabled': false
             },
             {
             'label': '表单',
             'value': '4',
             'disabled': false
             },
             {
             'label': '标签页',
             'value': '5',
             'disabled': false
             }
             ],
             'layout': 'column',
             'span': '24'
             }
             ]
             },
             {
             controls: [
             {
             'type': 'input',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'text',
             'name': 'caseName',
             'label': '名称',
             'placeholder': '',
             'disabled': false,
             'readonly': false,
             'size': 'default',
             'layout': 'column',
             'span': '24'
             },
             ]
             },
             {
             controls: [
             {
             'type': 'input',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'text',
             'name': 'Level',
             'label': '级别',
             'placeholder': '',
             'disabled': false,
             'readonly': false,
             'size': 'default',
             'layout': 'column',
             'span': '24'
             },
             ]
             },
             {
             controls: [
             {
             'type': 'input',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'text',
             'name': 'caseCount',
             'label': '数量',
             'placeholder': '',
             'disabled': false,
             'readonly': false,
             'size': 'default',
             'layout': 'column',
             'span': '24'
             },

             ]
             },
             {
             controls: [
             {
             'type': 'input',
             'labelSize': '6',
             'controlSize': '16',
             'inputType': 'text',
             'name': 'Remark',
             'label': '备注',
             'placeholder': '',
             'disabled': false,
             'readonly': false,
             'size': 'default',
             'layout': 'column',
             'span': '24'
             }
             ]
             }
             ],
             'toolbar': [
             {
             'name': 'searchForm', 'class': 'editable-add-btn', 'text': '查询',
             'span': '8',
             },
             {
             'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '重置',
             'span': '8',
             }
             ],
             'dataList': [],
             'relations': [{
             'relationViewId': 'search_form',
             'relationSendContent': [
             {
             name: 'searchFormByValue',
             sender: 'search_form',
             aop: 'after',
             receiver: 'singleTable',
             relationData: {
             name: 'refreshAsChild',
             params: [
             { pid: 'caseName', cid: '_caseName' },
             { pid: 'Type', cid: '_type' },
             ]
             },
             }
             ],
             'relationReceiveContent': []
             }],
             },
             dataList: []
             }
             ]
             }
             ]
             },
             },
             */
        ]
    };

    public _projOptions: any[] = [];
    public _projValue;
    public _selectedModuleText;
    public loading = false;
    public _tableDataSource;

    constructor(
        private apiService: ApiService,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>
    ) {
        super();
    }

    public async ngOnInit() {
        const moduleData = await this.getProjectData();
        this._projOptions = this.arrayToTree(moduleData.data);
    }

    public _changeModuleValue($event) {
        this._loadModules();
    }

    public _onSelectionChange(selectedOptions: any[]) {
        this._selectedModuleText = `${selectedOptions
            .map(o => o.label)
            .join(' / ')}`;
    }

    public _loadModules() {
        this.cascade.next(
            new BsnComponentMessage(
                BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                'projectId_module',
                {
                    data: {
                        Id: this._projValue
                    }
                }
            )
        );
    }

    private async getProjectData() {
        const params = { _select: 'Id,name' };
        return this.apiService.get('common/CfgProject', params).toPromise();
    }

    private arrayToTree(data) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const obj = {
                label: data[i].name,
                value: data[i].Id,
                isLeaf: true
            };
            result.push(obj);
        }
        return result;
    }
}

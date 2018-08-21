import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {SimpleTableColumn, SimpleTableComponent} from '@delon/abc';

@Component({
    selector: 'app-tree-and-tabs',
    templateUrl: './tree-and-tabs.component.html',
})
export class TreeAndTabsComponent implements OnInit {

    @Input() config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '树结构',
                            span: 4,
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 4,
                                nzLg: 4,
                                ngXl: 4
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_tabs_tree',
                                        'component': 'bsnTree',
                                        'asyncData': true, //
                                        'expandAll': true, //
                                        'checkable': false,  //    在节点之前添加一个复选框 false
                                        'showLine': false,  //   显示连接线 fal
                                        'columns': [ // 字段映射，映射成树结构所需
                                            {title: '主键', field: 'key', valueName: 'Id'},
                                            {title: '父节点', field: 'parentId', valueName: 'parentId'},
                                            {title: '标题', field: 'title', valueName: 'caseName'},
                                        ],
                                        'componentType': {
                                            'parent': true,
                                            'child': true,
                                            'own': true
                                        },
                                        'parent': [
                                            {name: 'parentId', type: 'value', valueName: '取值参数名称', value: 'null'}
                                        ],
                                        'ajaxConfig': {
                                            'url': 'common/ShowCase',
                                            'ajaxType': 'get',
                                            'params': [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ]
                                        },
                                        'relations': [
                                            {
                                                'relationViewId': 'tree_and_tabs_tree',
                                                'cascadeMode': 'REFRESH',
                                                'params': []
                                            },
                                            {
                                                'relationViewId': 'tree_and_tabs_form',
                                                'cascadeMode': 'REFRESH_AS_CHILD',
                                                'params': [
                                                    // { pid: 'key', cid: '_parentId' }
                                                ]
                                            }
                                        ]
                                        // 'relations': [{
                                        //     'relationViewId': 'tree_and_tabs_tree',
                                        //     'relationSendContent': [
                                        //         {
                                        //             'name': 'clickNode',
                                        //             'sender': 'tree_and_tabs_tree',
                                        //             'aop': 'after',
                                        //             'receiver': 'tree_and_tabs_table',
                                        //             'relationData': {
                                        //                 'name': 'refreshAsChild',
                                        //                 'params': [
                                        //                     {'pid': 'key', 'cid': '_id'}
                                        //                 ]
                                        //             },
                                        //         },
                                        //         {
                                        //             'name': 'clickNode',
                                        //             'sender': 'tree_and_tabs_tree',
                                        //             'aop': 'after',
                                        //             'receiver': 'tree_and_tabs_form',
                                        //             'relationData': {
                                        //                 'name': 'refreshAsChild',
                                        //                 'params': [
                                        //                     {'pid': 'key', 'cid': '_id'}
                                        //                 ]
                                        //             },
                                        //         }
                                        //     ],
                                        //     'relationReceiveContent': []
                                        // }]
                                    },
                                    dataList: []
                                }
                            ]
                        },
                        {
                            id: 'area1_1',
                            title: '树结构',
                            span: 4,
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 4,
                                nzLg: 4,
                                ngXl: 4
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_tabs_tree_1',
                                        'component': 'bsnTree',
                                        'asyncData': true, //
                                        'expandAll': true, //
                                        'checkable': false,  //    在节点之前添加一个复选框 false
                                        'showLine': false,  //   显示连接线 fal
                                        'columns': [ // 字段映射，映射成树结构所需
                                            {title: '主键', field: 'key', valueName: 'Id'},
                                            {title: '父节点', field: 'parentId', valueName: 'parentId'},
                                            {title: '标题', field: 'title', valueName: 'caseName'},
                                        ],
                                        'componentType': {
                                            'parent': false,
                                            'child': true,
                                            'own': false
                                        },
                                        'parent': [
                                            {name: 'parentId', type: 'tempValue', valueName: '_parentId'}
                                        ],
                                        'ajaxConfig': {
                                            'url': 'common/ShowCase',
                                            'ajaxType': 'get',
                                            'params': [
                                                 { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' }
                                            ]
                                        },
                                        'relations': [{
                                            'relationViewId': 'tree_and_tabs_tree',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                                { pid: 'key', cid: '_parentId' }
                                            ],
                                            'relationReceiveContent': []
                                        }]
                                    },
                                    dataList: []
                                }
                            ]
                        },
                        {
                            id: 'area2',
                            title: '标签页',
                            span: 16,
                            size: {
                                nzXs: 24,
                                nzSm: 24,
                                nzMd: 16,
                                nzLg: 16,
                                ngXl: 16
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: 'tab_text_1',
                                        tabPosition: 'top',
                                        tabType: 'card', // card
                                        size: 'small',
                                        component: 'bsnTabs',
                                        tabs: [
                                            {
                                                title: '列表',
                                                icon: 'icon-list text-success',
                                                active: true,
                                                viewCfg: [
                                                    {
                                                        config: {
                                                            'viewId': 'tree_tab_childTable',
                                                            'component': 'bsnTable',
                                                            'keyId': 'Id',
                                                            'pagination': true, // 是否分页
                                                            'showTotal': true, // 是否显示总数据量
                                                            'pageSize': 5, // 默认每页数据条数
                                                            'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                                                            'ajaxConfig': {
                                                                'url': 'common/GetCase',
                                                                'ajaxType': 'get',
                                                                'params': [
                                                                    { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' }
                                                                ]
                                                            },
                                                            'componentType': {
                                                                'parent': false,
                                                                'child': true,
                                                                'own': false
                                                            },
                                                            'relations': [{
                                                                'relationViewId': 'tree_and_tabs_tree',
                                                                'cascadeMode': 'REFRESH_AS_CHILD',
                                                                'params': [
                                                                    { pid: 'key', cid: '_parentId' }
                                                                ],
                                                                'relationReceiveContent': []
                                                            }],
                                                            'columns': [
                                                                {
                                                                    title: 'Id', field: 'Id', width: 80, hidden: true,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'Id',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '名称', field: 'caseName', width: 80,
                                                                    showFilter: false, showSort: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'caseName',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '类别', field: 'TypeName', width: 80, hidden: false,
                                                                    showFilter: true, showSort: true,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'caseType',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'submit',
                                                                            'name': 'caseType',
                                                                            'label': 'caseType',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '130px',
                                                                            'dataSet': 'getCaseName',
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
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '数量', field: 'caseCount', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'caseCount',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '主名称', field: 'parentName', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: '',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '级别', field: 'caseLevel', width: 80, hidden: false,
                                                                    showFilter: false, showSort: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'caseLevel',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '创建时间', field: 'createTime', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        pipe: 'datetime',
                                                                        field: 'createTime',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'datetime',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '备注', field: 'remark', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'remark',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '状态', field: 'enableText', width: 80, hidden: false,
                                                                    formatter: [
                                                                        { 'value': '启用', 'bgcolor': '', 'fontcolor': 'text-green', 'valueas': '启用' },
                                                                        { 'value': '禁用', 'bgcolor': '', 'fontcolor': 'text-red', 'valueas': '禁用' }
                                                                    ],
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'enabled',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '18',
                                                                            'inputType': 'submit',
                                                                            'name': 'enabled',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '80px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '启用',
                                                                                    'value': true,
                                                                                    'disabled': false
                                                                                },
                                                                                {
                                                                                    'label': '禁用',
                                                                                    'value': false,
                                                                                    'disabled': false
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            ],
                                                            'toolbar': [
                                                                {
                                                                    'group': [
                                                                        {
                                                                            'name': 'cus', 'text': '自定义事件', 'type': 'injectFunction',
                                                                            'context': {
                                                                                'name': 'text1',
                                                                                'arguments': [],
                                                                                'content': 'alert(this)'
                                                                            }

                                                                        },
                                                                        {
                                                                            'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                                                                        },
                                                                        {
                                                                            'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增', 'action': 'CREATE'
                                                                        },
                                                                        {
                                                                            'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改', 'action': 'EDIT'
                                                                        },
                                                                    ]
                                                                },
                                                                {
                                                                    'group': [
                                                                        {
                                                                            'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'action': 'DELETE',
                                                                            'ajaxConfig': {
                                                                                delete: [{
                                                                                    'actionName': 'delete',
                                                                                    'url': 'common/ShowCase',
                                                                                    'ajaxType': 'delete'
                                                                                }]
                                                                            }
                                                                        },
                                                                        {
                                                                            'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存', 'action': 'SAVE',
                                                                            'type': 'method/action',
                                                                            'ajaxConfig': {
                                                                                post: [{
                                                                                    'actionName': 'add',
                                                                                    'url': 'common/ShowCase',
                                                                                    'ajaxType': 'post',
                                                                                    'params': [
                                                                                        { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                                                        { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                                                        // { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                        { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                                                        { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                                        { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                                                        { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                                                    ],
                                                                                    'output': [
                                                                                        {
                                                                                            name: '_id',
                                                                                            type: '',
                                                                                            dataName: 'Id'
                                                                                        }
                                                                                    ]
                                                                                }],
                                                                                put: [{
                                                                                    'url': 'common/ShowCase',
                                                                                    'ajaxType': 'put',
                                                                                    'params': [
                                                                                        { name: 'Id', type: 'componentValue', valueName: 'Id', value: '' },
                                                                                        { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                                                        { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                                                        // { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                        { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                                                        // { name: 'parentId', type: 'componentValue', valueName: 'parentId', value: '' },
                                                                                        { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                                                        { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                                                    ]
                                                                                }]
                                                                            }
                                                                        },
                                                                        {
                                                                            'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消', 'action': 'CANCEL',
                                                                        },
                                                                        {
                                                                            'name': 'addForm', 'class': 'editable-add-btn', 'text': '弹出新增表单',
                                                                            'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'addShowCase',
                                                                            'type': 'showForm',
                                                                            'dialogConfig': {
                                                                                'keyId': 'Id',
                                                                                'layout': 'horizontal',
                                                                                'title': '新增数据',
                                                                                'width': '800',
                                                                                'isCard': true,
                                                                                'componentType': {
                                                                                    'parent': false,
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
                                                                                                    'name': 'enabled',
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
                                                                                                            'value': true,
                                                                                                            'disabled': false
                                                                                                        },
                                                                                                        {
                                                                                                            'label': '禁用',
                                                                                                            'value': false,
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
                                                                                                    'name': 'caseType',
                                                                                                    'label': '类别',
                                                                                                    'labelName': 'Name',
                                                                                                    'valueName': 'Id',
                                                                                                    'notFoundContent': '',
                                                                                                    'selectModel': false,
                                                                                                    'showSearch': true,
                                                                                                    'placeholder': '--请选择--',
                                                                                                    'disabled': false,
                                                                                                    'size': 'default',
                                                                                                    'ajaxConfig': {
                                                                                                        'url': 'common/ShowCase',
                                                                                                        'ajaxType': 'get',
                                                                                                        'params': []
                                                                                                    },
                                                                                                    'cascader': [
                                                                                                        {
                                                                                                            'name': 'appUser',
                                                                                                            'type': 'sender',
                                                                                                            'cascaderData': {
                                                                                                                'params': [
                                                                                                                    {
                                                                                                                        'pid': 'Id', 'cid': '_typeId'
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
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
                                                                                                    'isRequired': true,
                                                                                                    'placeholder': '请输入Case名称',
                                                                                                    'perfix': 'anticon anticon-edit',
                                                                                                    'suffix': '',
                                                                                                    'disabled': false,
                                                                                                    'readonly': false,
                                                                                                    'size': 'default',
                                                                                                    'layout': 'column',
                                                                                                    'span': '24',
                                                                                                    'validations': [
                                                                                                        {
                                                                                                            'validator': 'required',
                                                                                                            'errorMessage': '请输入Case名称!!!!'
                                                                                                        },
                                                                                                        {
                                                                                                            'validator': 'minLength',
                                                                                                            'length': '3',
                                                                                                            'errorMessage': '请输入最少三个字符'
                                                                                                        },
                                                                                                        {
                                                                                                            'validator': 'maxLength',
                                                                                                            'length': '5',
                                                                                                            'errorMessage': '请输入最5个字符'
                                                                                                        }
                                                                                                    ]
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
                                                                                                    'name': 'caseLevel',
                                                                                                    'label': '级别',
                                                                                                    'isRequired': true,
                                                                                                    'placeholder': '',
                                                                                                    'disabled': false,
                                                                                                    'readonly': false,
                                                                                                    'size': 'default',
                                                                                                    'layout': 'column',
                                                                                                    'span': '24',
                                                                                                    'validations': [
                                                                                                        {
                                                                                                            'validator': 'required',
                                                                                                            'errorMessage': '请输入级别'
                                                                                                        }
                                                                                                    ]
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
                                                                                                    'isRequired': true,
                                                                                                    'placeholder': '',
                                                                                                    'disabled': false,
                                                                                                    'readonly': false,
                                                                                                    'size': 'default',
                                                                                                    'layout': 'column',
                                                                                                    'span': '24',
                                                                                                    'validations': [
                                                                                                        {
                                                                                                            'validator': 'required',
                                                                                                            'errorMessage': '请输入数量'
                                                                                                        },
                                                                                                        {
                                                                                                            'validator': 'pattern',
                                                                                                            'pattern': /^\d+$/,
                                                                                                            'errorMessage': '请填写数字'
                                                                                                        }
                                                                                                    ]
                                                                                                },

                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            controls: [
                                                                                                {
                                                                                                    'type': 'datePicker',
                                                                                                    'labelSize': '6',
                                                                                                    'controlSize': '16',
                                                                                                    'inputType': 'text',
                                                                                                    'name': 'createTime',
                                                                                                    'label': '创建时间',
                                                                                                    'placeholder': '',
                                                                                                    'disabled': false,
                                                                                                    'readonly': false,
                                                                                                    'size': 'default',
                                                                                                    'layout': 'column',
                                                                                                    'showTime': true,
                                                                                                    'format': 'yyyy-MM-dd',
                                                                                                    'showToday': true,
                                                                                                    'span': '24'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            controls: [
                                                                                                {
                                                                                                    'type': 'rangePicker',
                                                                                                    'labelSize': '6',
                                                                                                    'controlSize': '16',
                                                                                                    'inputType': 'text',
                                                                                                    'name': 'createTime',
                                                                                                    'label': '时间范围',
                                                                                                    'placeholder': '',
                                                                                                    'disabled': false,
                                                                                                    'readonly': false,
                                                                                                    'size': 'default',
                                                                                                    'layout': 'column',
                                                                                                    'showTime': true,
                                                                                                    'format': 'yyyy-MM-dd',
                                                                                                    'showToday': true,
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
                                                                                                    'inputType': 'time',
                                                                                                    'name': 'remark',
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
                                                                                'buttons':
                                                                                    [
                                                                                        {
                                                                                            'name': 'save', 'text': '保存', 'type': 'primary',
                                                                                            'ajaxConfig': {
                                                                                                post: [{
                                                                                                    'url': 'common/ShowCase',
                                                                                                    'params': [
                                                                                                        { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                                                                        { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                                                                        { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                                        { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                                                                        { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                                                        { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                                                                        { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                                                                    ]
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                                                                                            'ajaxConfig': {
                                                                                                post: [{
                                                                                                    'url': 'common/ShowCase',
                                                                                                    'params': [
                                                                                                        { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                                                                        { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                                                                        { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                                        { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                                                                        { name: 'parentId', type: 'tempValue', valueName: '_parentId', value: '' },
                                                                                                        { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                                                                        { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                                                                    ]
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        { 'name': 'reset', 'text': '重置' },
                                                                                        { 'name': 'close', 'text': '关闭' }
                                                                                    ],

                                                                            }
                                                                        },
                                                                    ]
                                                                },
                                                                {
                                                                    'group': [
                                                                        {
                                                                            'name': 'editForm', 'class': 'editable-add-btn', 'text': '弹出编辑表单',
                                                                            'action': 'FORM', 'actionType': 'formDialog', 'actionName': 'updateShowCase',
                                                                            'type': 'showForm',
                                                                            'dialogConfig': {
                                                                                'keyId': 'Id',
                                                                                'title': '编辑',
                                                                                'width': '600',
                                                                                'ajaxConfig': {
                                                                                    'url': 'common/ShowCase',
                                                                                    'ajaxType': 'get',
                                                                                    'params': [
                                                                                        {
                                                                                            name: 'Id', type: 'tempValue', valueName: '_id', value: ''
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                'componentType': {
                                                                                    'parent': false,
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
                                                                                                    'name': 'enabled',
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
                                                                                                            'value': true,
                                                                                                            'disabled': false
                                                                                                        },
                                                                                                        {
                                                                                                            'label': '禁用',
                                                                                                            'value': false,
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
                                                                                                    'name': 'caseType',
                                                                                                    'label': '类别Id',
                                                                                                    'labelName': 'Name',
                                                                                                    'valueName': 'Id',
                                                                                                    'notFoundContent': '',
                                                                                                    'selectModel': false,
                                                                                                    'showSearch': true,
                                                                                                    'placeholder': '--请选择--',
                                                                                                    'disabled': false,
                                                                                                    'size': 'default',
                                                                                                    'ajaxConfig': {
                                                                                                        'url': 'common/ShowCase',
                                                                                                        'ajaxType': 'get',
                                                                                                        'params': []
                                                                                                    },
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
                                                                                                    'name': 'caseLevel',
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
                                                                                                    'name': 'remark',
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
                                                                                'buttons':
                                                                                    [
                                                                                        {
                                                                                            'name': 'save', 'text': '保存',
                                                                                            'type': 'primary',
                                                                                            'ajaxConfig': {
                                                                                                put: [{
                                                                                                    'url': 'common/ShowCase',
                                                                                                    'params': [
                                                                                                        { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                                                                                                        { name: 'caseName', type: 'componentValue', valueName: 'caseName', value: '' },
                                                                                                        { name: 'caseCount', type: 'componentValue', valueName: 'caseCount', value: '' },
                                                                                                        { name: 'createTime', type: 'componentValue', valueName: 'createTime', value: '' },
                                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                                        { name: 'caseLevel', type: 'componentValue', valueName: 'caseLevel', value: '' },
                                                                                                        { name: 'remark', type: 'componentValue', valueName: 'remark', value: '' },
                                                                                                        { name: 'caseType', type: 'componentValue', valueName: 'caseType', value: '' }
                                                                                                    ]
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                                                                                        { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                                                                                    ],
                                                                                'dataList': [],
                                                                            }
                                                                        },
                                                                        {
                                                                            'name': 'batchEditForm', 'class': 'editable-add-btn', 'text': '弹出批量处理表单',
                                                                            'type': 'showBatchForm',
                                                                            'dialogConfig': {
                                                                                'keyId': 'Id',
                                                                                'title': '批量处理',
                                                                                'width': '600',
                                                                                'componentType': {
                                                                                    'parent': false,
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
                                                                                                    'name': 'enabled',
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
                                                                                                            'value': true,
                                                                                                            'disabled': false
                                                                                                        },
                                                                                                        {
                                                                                                            'label': '禁用',
                                                                                                            'value': false,
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
                                                                                        }
                                                                                    ],
                                                                                'buttons':
                                                                                    [
                                                                                        {
                                                                                            'name': 'save', 'text': '保存',
                                                                                            'type': 'primary',
                                                                                            'ajaxConfig': {
                                                                                                put: [{
                                                                                                    'url': 'common/ShowCase',
                                                                                                    'batch': true,
                                                                                                    'params': [
                                                                                                        { name: 'Id', type: 'checkedItem', valueName: 'Id', value: '' },
                                                                                                        { name: 'caseName', type: 'checkedItem', valueName: 'caseName', value: '' },
                                                                                                        { name: 'enabled', type: 'componentValue', valueName: 'enabled', value: '' },
                                                                                                    ]
                                                                                                }]
                                                                                            }
                                                                                        },
                                                                                        { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                                                                                        { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                                                                                    ],
                                                                                'dataList': [],
                                                                            }
                                                                        },
                                                                        {
                                                                            'name': 'showDialogPage', 'class': 'editable-add-btn', 'text': '弹出页面',
                                                                            'action': 'WINDOW', 'actionType': 'windowDialog', 'actionName': 'showCaseWindow',
                                                                            'type': 'showLayout', 'dialogConfig': {
                                                                            'title': '',
                                                                            'layoutName': 'singleTable',
                                                                            'width': 800,
                                                                            'buttons': [
                                                                                { 'name': 'ok1', 'text': '确定', 'class': 'editable-add-btn', 'type': 'primary' },
                                                                                { 'name': 'close', 'text': '关闭' }
                                                                            ]
                                                                        }
                                                                        },
                                                                        {
                                                                            'name': 'btnGroup', 'text': ' 分组操作', 'type': 'group', 'icon': 'icon-plus',
                                                                            'group': [
                                                                                {
                                                                                    'name': 'refresh', 'class': 'editable-add-btn', 'text': ' 刷新', 'icon': 'icon-list'
                                                                                },
                                                                                {
                                                                                    'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增'
                                                                                },
                                                                                {
                                                                                    'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改'
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            'dataSet': [
                                                                {
                                                                    'name': 'TypeName',
                                                                    'ajaxConfig': {
                                                                        'url': 'common/ShowCase',
                                                                        'ajaxType': 'get',
                                                                        'params': []
                                                                    },
                                                                    'ajaxType': 'get',
                                                                    'params': [],
                                                                    'fields': [
                                                                        {
                                                                            'label': 'ID',
                                                                            'field': 'Id',
                                                                            'name': 'value'
                                                                        },
                                                                        {
                                                                            'label': '',
                                                                            'field': 'Name',
                                                                            'name': 'label'
                                                                        },
                                                                        {
                                                                            'label': '',
                                                                            'field': 'Name',
                                                                            'name': 'text'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        permissions: {
                                                            'viewId': 'tree_and_tabs_table',
                                                            'columns': [],
                                                            'toolbar': [],
                                                            'formDialog': [],
                                                            'windowDialog': []
                                                        },
                                                        dataList: []
                                                    }
                                                ]
                                            },
                                            {
                                                title: '表单',
                                                icon: 'icon-list text-green-light',
                                                active: false,
                                                viewCfg: [
                                                    {
                                                        config: {
                                                            'viewId': 'tree_and_tabs_form',
                                                            'component': 'form_view',
                                                            'keyId': 'Id',
                                                            ajaxConfig: {
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'getById',
                                                                'params': [
                                                                    {name: 'Id', type: 'tempValue', valueName: '_id', value: ''}
                                                                ]
                                                            },
                                                            componentType: {
                                                                'parent': true,
                                                                'child': true,
                                                                'own': false
                                                            },
                                                            'relations': [
                                                                {
                                                                    'relationViewId': 'tree_and_tabs_tree',
                                                                    'cascadeMode': 'REFRESH_AS_CHILD',
                                                                    'params': [
                                                                        { pid: 'key', cid: '_id' }
                                                                    ],
                                                                    'relationReceiveContent': []
                                                                },
                                                                {
                                                                    'relationViewId': 'tree_and_tabs_form',
                                                                    'cascadeMode': 'REFRESH',
                                                                    'params': [
                                                                        // { pid: 'key', cid: '_id' }
                                                                    ],
                                                                    'relationReceiveContent': []
                                                                }
                                                            ],
                                                            'forms': [
                                                                {
                                                                    controls: [
                                                                        {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'submit',
                                                                            'name': 'enabled',
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
                                                                                    'value': true,
                                                                                    'disabled': false
                                                                                },
                                                                                {
                                                                                    'label': '禁用',
                                                                                    'value': false,
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
                                                                            'name': 'caseType',
                                                                            'label': '类别',
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
                                                                            'name': 'caseLevel',
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
                                                                            'name': 'remark',
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
                                                            'toolbar':{
                                                                'gutter': 24,
                                                                'offset': 6,
                                                                'span': 16,
                                                                'buttons': [
                                                                    {
                                                                        'name': 'saveForm', 'type': 'primary', 'text': '保存',
                                                                        'ajaxConfig': {
                                                                            post: {
                                                                                'url': 'common/ShowCase',
                                                                                'ajaxType': 'post',
                                                                                'params': [
                                                                                    {
                                                                                        name: 'caseName',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseName',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseCount',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseCount',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'enabled',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'enabled',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseLevel',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseLevel',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'parentId',
                                                                                        type: 'tempValue',
                                                                                        valueName: '_parentId',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'remark',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'remark',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseType',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseType',
                                                                                        value: ''
                                                                                    }
                                                                                ]
                                                                            },
                                                                            put: {
                                                                                'url': 'common/ShowCase',
                                                                                'ajaxType': 'put',
                                                                                'params': [
                                                                                    {
                                                                                        name: 'Id',
                                                                                        type: 'tempValue',
                                                                                        valueName: '_id',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseName',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseName',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseCount',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseCount',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'enabled',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'enabled',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseLevel',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseLevel',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'parentId',
                                                                                        type: 'tempValue',
                                                                                        valueName: '_parentId',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'remark',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'remark',
                                                                                        value: ''
                                                                                    },
                                                                                    {
                                                                                        name: 'caseType',
                                                                                        type: 'componentValue',
                                                                                        valueName: 'caseType',
                                                                                        value: ''
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        'name': 'cancelRow', 'type': 'default', 'text': '取消'
                                                                    }
                                                                ],
                                                            },
                                                            'dataList': []
                                                        },
                                                        permissions: {
                                                            'viewId': 'tree_and_tabs_form',
                                                            'columns': [],
                                                            'toolbar': [],
                                                            'formDialog': [],
                                                            'windowDialog': []
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

    constructor(private http: _HttpClient) {
    }

    ngOnInit() {
    }

}

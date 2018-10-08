import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Form, FormGroup } from '@angular/forms';
declare let CodeMirror: any;
@Component({
    selector: 'cn-single-table',
    templateUrl: './single-table.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./single-table.css']
})
export class SingleTableComponent implements OnInit, AfterViewInit {
    @ViewChild('CodeMirror') codeEditor: ElementRef;
    @ViewChild('ComponentEditor') componentRef: ElementRef;
    @ViewChild('formEditor') formRef: ElementRef;
    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area2',
                            title: '查询123',
                            span: 8,
                            icon: 'anticon anticon-right-circle text-primary',
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
                                        'title': '查询',
                                        'component': 'search_view',
                                        'keyId': 'Id',
                                        'layout': 'horizontal',
                                        'componentType': {
                                            'parent': true,
                                            'child': false,
                                            'own': true
                                        },
                                        'forms': [
                                            {
                                                title: '分类条件',
                                                layout: 'grid',
                                                collapse: false,
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
                                                        'span': '6'
                                                    },
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
                                                        'span': '6'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '扩展条件',
                                                layout: 'grid last',
                                                collapse: true,
                                                controls: [
                                                    {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                        'name': 'caseName',
                                                        'perfix': 'anticon anticon-edit',
                                                        'label': '名称',
                                                        'placeholder': '',
                                                        'disabled': false,
                                                        'readonly': false,
                                                        'size': 'default',
                                                        'layout': 'column',
                                                        'span': '6'
                                                    },
                                                    {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                        'name': 'caseLevel',
                                                        'label': '级别',
                                                        'placeholder': '',
                                                        'disabled': false,
                                                        'readonly': false,
                                                        'size': 'default',
                                                        'layout': 'column',
                                                        'span': '6'
                                                    },
                                                    {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                        'name': 'caseCount',
                                                        'label': '数量',
                                                        'placeholder': '',
                                                        'disabled': false,
                                                        'readonly': false,
                                                        'size': 'default',
                                                        'layout': 'column',
                                                        'span': '6'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '扩展条件',
                                                layout: 'grid last',
                                                collapse: true,
                                                controls: [
                                                    {
                                                        'type': 'textarea',
                                                        'autoSize': {
                                                            minRows: 4, maxRows: 6
                                                        },
                                                        'labelSize': '3',
                                                        'controlSize': '21',
                                                        'inputType': 'text',
                                                        'name': 'caseName',
                                                        'perfix': 'anticon anticon-edit',
                                                        'label': '备注',
                                                        'placeholder': '',
                                                        'disabled': false,
                                                        'readonly': false,
                                                        'size': 'default',
                                                        'layout': 'column',
                                                        'span': '12'
                                                    }
                                                ]
                                            }
                                        ],
                                        'dataList': []
                                    },
                                    dataList: []
                                }
                            ]
                        }
                    ]
                },
            },
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '单表示例',
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
                                        'title': '数据网格',
                                        'viewId': 'singleTable',
                                        'component': 'bsnTable',
                                        'info': true,
                                        'keyId': 'Id',
                                        'scroll': { x: '1200px', y: '200px' },
                                        'showCheckBox': true,
                                        'size': 'small',
                                        'pagination': true, // 是否分页
                                        'showTotal': true, // 是否显示总数据量
                                        'pageSize': 20, // 默认每页数据条数
                                        'pageSizeOptions': [5, 10, 20, 30, 40, 100],
                                        'ajaxConfig': {
                                            'url': 'common/GetCase',
                                            'ajaxType': 'get',
                                            'params': [],
                                            'filter': [
                                                {
                                                    name: 'caseName',
                                                    valueName: '_caseName',
                                                    type: 'tempValue',
                                                    value: ''
                                                },
                                                {
                                                    name: 'enabled', valueName: '_enabled', type: 'tempValue', value: ''
                                                },
                                                {
                                                    name: 'caseType',
                                                    valueName: '_caseType',
                                                    type: 'tempValue',
                                                    value: ''
                                                }
                                            ]
                                        },
                                        'columns': [
                                            {
                                                title: '序号',
                                                field: '_serilize',
                                                width: '5%',
                                                hidden: false,
                                                titleAlign: 'text-right',
                                                fieldAlign: 'text-center'
                                            },
                                            {
                                                title: 'Id', field: 'Id', width: '1px', hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'Id',
                                                    options: {
                                                        'type': 'input',
                                                        'inputType': 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '名称', field: 'caseName', width: '15%',
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: '',
                                                    field: 'caseName',
                                                    options: {
                                                        'type': 'input',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '类别', field: 'caseTypeText', width: '15%', hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'caseType',
                                                    options: {
                                                        'type': 'select',
                                                        'inputType': 'submit',
                                                        'name': 'caseType',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择数据-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '100%',
                                                        'defaultValue': '1',
                                                        'options': [
                                                            {
                                                                'label': '表格',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '树组件',
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
                                                title: '数量', field: 'caseCount', width: '10%', hidden: false,
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
                                                title: '级别', field: 'caseLevel', width: '10%', hidden: false,
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
                                                title: '创建时间',
                                                field: 'createDate',
                                                width: '10%',
                                                hidden: false,
                                                dataType: 'date',
                                                editor: {
                                                    type: 'input',
                                                    pipe: 'datetime',
                                                    field: 'createDate',
                                                    options: {
                                                        'type': 'datePicker',
                                                        'inputType': 'datetime',
                                                        'name': 'createDate',
                                                        'showTime': false,
                                                        'formart': 'yyyy-MM-dd'
                                                    }
                                                }
                                            },
                                            // {
                                            //     title: '备注', field: 'remark', width: '10%', hidden: false,
                                            //     editor: {
                                            //         type: 'input',
                                            //         field: 'remark',
                                            //         options: {
                                            //             'type': 'input',
                                            //             'labelSize': '6',
                                            //             'controlSize': '18',
                                            //             'inputType': 'text'
                                            //         }
                                            //     }
                                            // },
                                            {
                                                title: '父类别', field: 'parentName', width: '10%', hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'parentId',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '16',
                                                        'inputType': 'submit',
                                                        'name': 'parentId',
                                                        'label': '父类别',
                                                        'labelName': 'caseName',
                                                        'valueName': 'Id',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '--请选择--',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'defaultValue': '6b4021cef8394d5fb4775afcd01d920f',
                                                        'ajaxConfig': {
                                                            'url': 'common/ShowCase',
                                                            'ajaxType': 'get',
                                                            'params': []
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: '父类别', field: 'parentName', width: '10%', hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'parentIds',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'parentId_2',
                                                        'labelName': 'caseName',
                                                        'valueName': 'Id',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '100%',
                                                        'cascades': [
                                                            {
                                                                'cascadeName': 'parentId',
                                                                'params': [
                                                                    {
                                                                        'pid': 'parentId', 'cid': '_cas_parentId'
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        'ajaxConfig': {
                                                            'url': 'common/ShowCase',
                                                            'ajaxType': 'get',
                                                            'params': [
                                                                {
                                                                    name: 'parentId', type: 'tempValue', valueName: '_cas_parentId'
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: '状态',
                                                field: 'enableText',
                                                width: '10%',
                                                hidden: false,
                                                titleAlign: 'text-right',
                                                fieldAlign: 'text-center',
                                                formatter: [
                                                    {
                                                        'value': '启用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-blue',
                                                        'valueas': '启用'
                                                    },
                                                    {
                                                        'value': '禁用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-red',
                                                        'valueas': '禁用'
                                                    }
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
                                                        'width': '100%',
                                                        'defaultValue': 1,
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
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        'componentType': {
                                            'parent': false,
                                            'child': true,
                                            'own': true
                                        },
                                        'relations': [{
                                            'relationViewId': 'search_form',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                                { pid: 'caseName', cid: '_caseName' },
                                                { pid: 'enabled', cid: '_enabled' },
                                                { pid: 'caseType', cid: '_caseType' }
                                            ],
                                            'relationReceiveContent': []
                                        }],
                                        'toolbar': [
                                            {
                                                group: [
                                                    {
                                                        'name': 'refresh',
                                                        'action': 'REFRESH',
                                                        'text': '刷新',
                                                        'color': 'text-primary'
                                                    },
                                                    {
                                                        'name': 'addRow',
                                                        'text': '新增',
                                                        'action': 'CREATE',
                                                        'icon': 'anticon anticon-plus',
                                                        'color': 'text-primary'
                                                    },
                                                    {
                                                        'name': 'updateRow',
                                                        'text': '修改',
                                                        'action': 'EDIT',
                                                        'icon': 'anticon anticon-edit',
                                                        'color': 'text-success'
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'text': '删除1',
                                                        'action': 'DELETE',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'ajaxConfig': {
                                                            delete: [
                                                                {
                                                                    'actionName': 'delete',
                                                                    'url': 'common/ShowCase',
                                                                    'ajaxType': 'delete',
                                                                    'title': '警告！',
                                                                    'message': '确认要删除当前勾选的数据么？？？'
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'text': '删除2',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-warning',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'delete', // 批量删除调用建模API，不能使用该模式，delete动作无法传递数组参数类型
                                                                'title': '警告！',
                                                                'message': '确认要删除当前勾选的数据么？？？',
                                                                'params': [
                                                                    {
                                                                        name: '_ids', type: 'checkedId', valueName: 'Id'
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
                                                        'name': 'executeCheckedRow',
                                                        'text': '多选删除(确认+提示操作)',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'actionType': 'post',
                                                        'actionName': 'execChecked',
                                                        'ajaxConfig': [
                                                            {
                                                                'name': 'checkDeleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DelConfirmShowCase',
                                                                'ajaxType': 'post',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'isCheck',
                                                                        valueName: '',
                                                                        type: 'value',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        type: 'value',
                                                                        value: 'output',
                                                                        valueName: ''
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                'name': 'deleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DelConfirmShowCase',
                                                                'ajaxType': 'post',
                                                                'parentName': 'checkDeleteShowCase',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'isCheck',
                                                                        valueName: '',
                                                                        type: 'value',
                                                                        value: false
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    },
                                                                    {
                                                                        name: 'dataSet1', dataType: 'table',
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'executeCheckedRow1',
                                                        'text': '多选删除(验证+提示)',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'actionType': 'post',
                                                        'actionName': 'execChecked',
                                                        'ajaxConfig': [
                                                            {
                                                                'name': 'checkDeleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DeleteShowCase',
                                                                'ajaxType': 'post',
                                                                'title': '提示',
                                                                'message': '是否将选中的数据执行当前操作？',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        type: 'value',
                                                                        value: 'output',
                                                                        valueName: ''
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'executeSelectedRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '选中删除',
                                                        'icon': 'anticon anticon-delete',
                                                        'actionType': 'post',
                                                        'actionName': 'execSelected',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_SELECTED',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'delete',
                                                                'title': '提示',
                                                                'message': '是否将选中的数据执行当前操作？',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        valueName: 'Id',  // _selectedItem
                                                                        type: 'selectedRow' // tempValue
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        value: 'output', // 或者'_checkedIds'
                                                                        type: 'value' //  或者 'tempValue'
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Id', dataType: ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'saveRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '保存',
                                                        'icon': 'anticon anticon-save',
                                                        'type': 'default',
                                                        'color': 'text-primary',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_SAVE_ROW',
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
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
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
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                'action': 'EXECUTE_EDIT_ROW',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'put',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'componentValue',
                                                                        valueName: 'Id',
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
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
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
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'cancelRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消',
                                                        'action': 'CANCEL',
                                                        'icon': 'anticon anticon-rollback',
                                                        'color': 'text-grey-darker',
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        'name': 'addForm',
                                                        'text': '弹出新增表单',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCase',
                                                        'type': 'showForm'
                                                    },
                                                    {
                                                        'name': 'editForm',
                                                        'text': '弹出编辑表单',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'updateShowCase',
                                                        'type': 'showForm'
                                                    },
                                                    {
                                                        'name': 'batchEditForm',
                                                        'text': '弹出批量处理表单',
                                                        'action': 'FORM_BATCH',
                                                        'actionName': 'batchUpdateShowCase',
                                                        'icon': 'anticon anticon-form',
                                                        'type': 'showBatchForm',
                                                    },
                                                    {
                                                        'name': 'showDialogPage',
                                                        'text': '弹出页面',
                                                        'action': 'WINDOW',
                                                        'actionType': 'windowDialog',
                                                        'actionName': 'ShowCaseWindow',
                                                        'type': 'showLayout'
                                                    },
                                                    {
                                                        'name': 'upload',
                                                        'icon': 'anticon anticon-upload',
                                                        'text': '附件上传',
                                                        'action': 'UPLOAD',
                                                        'actionType': 'uploadDialog',
                                                        'actionName': 'uploadCase',
                                                        'type': 'uploadDialog'
                                                    },
                                                    {
                                                        'name': 'addFormcascade',
                                                        'text': '级联例子',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCasecascade',
                                                        'type': 'showForm'
                                                    }
                                                ]
                                            },
                                            {
                                                dropdown: [
                                                    {
                                                        'name': 'btnGroup', 'text': ' 分组操作', 'icon': 'icon-plus',
                                                        'buttons': [
                                                            {
                                                                'name': 'refresh',
                                                                'class': 'editable-add-btn',
                                                                'text': ' 刷新',
                                                                'icon': 'icon-list'
                                                            },
                                                            {
                                                                'name': 'addRow',
                                                                'class': 'editable-add-btn',
                                                                'text': '新增',
                                                                'icon': 'icon-add'
                                                            },
                                                            {
                                                                'name': 'updateRow',
                                                                'class': 'editable-add-btn',
                                                                'text': '修改',
                                                                'icon': 'icon-edit'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'dataSet': [
                                            {
                                                'name': 'getCaseName',
                                                'ajaxConfig': {
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'get',
                                                    'params': []
                                                },
                                                'params': [],
                                                'fields': [
                                                    {
                                                        'label': 'ID',
                                                        'field': 'Id',
                                                        'name': 'value'
                                                    },
                                                    {
                                                        'label': '',
                                                        'field': 'caseName',
                                                        'name': 'label'
                                                    },
                                                    {
                                                        'label': '',
                                                        'field': 'caseName',
                                                        'name': 'text'
                                                    }
                                                ]
                                            }
                                        ],
                                        'formDialog': [
                                            {
                                                'keyId': 'Id',
                                                'name': 'addShowCase',
                                                'layout': 'horizontal',
                                                'title': '新增数据',
                                                'width': '800',
                                                'isCard': true,
                                                'type': 'add',
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
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
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': 0
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': 1
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
                                                                'label': '父类别',
                                                                'labelName': 'caseName',
                                                                'valueName': 'Id',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': '6b4021cef8394d5fb4775afcd01d920f',
                                                                'ajaxConfig': {
                                                                    'url': 'common/ShowCase',
                                                                    'ajaxType': 'get',
                                                                    'params': []
                                                                },
                                                                'cascader': [
                                                                    {
                                                                        'name': 'getCaseName',
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
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'explain': '名称需要根据规范填写',
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
                                                                'type': 'checkboxGroup',
                                                                'label': '选项',
                                                                'labelSize': '6',
                                                                'controlSize': '18',
                                                                'name': 'enabled',
                                                                'disabled': false,
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
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'radioGroup',
                                                                'label': '选项',
                                                                'labelSize': '6',
                                                                'controlSize': '18',
                                                                'name': 'enabled1',
                                                                'disabled': false,
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
                                                'buttons': [
                                                    {
                                                        'name': 'save', 'text': '保存', 'type': 'primary',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'ajaxType': 'post',
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'createTime',
                                                                        type: 'componentValue',
                                                                        valueName: 'createTime',
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
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'createTime',
                                                                        type: 'componentValue',
                                                                        valueName: 'createTime',
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
                                                            }]
                                                        }
                                                    },
                                                    { 'name': 'reset', 'text': '重置' },
                                                    { 'name': 'close', 'text': '关闭' }
                                                ]
                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'updateShowCase',
                                                'title': '编辑',
                                                'width': '600',
                                                'type': 'edit',
                                                'ajaxConfig': {
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'getById',
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
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'select',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'name': 'enabled',
                                                                'label': '状态',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': 1
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': 0
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
                                                                'name': 'parentId',
                                                                'label': '父类别',
                                                                'labelName': 'caseName',
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
                                                                        'name': 'getCaseName',
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
                                                'buttons': [
                                                    {
                                                        'name': 'save', 'text': '保存',
                                                        'type': 'primary',
                                                        'ajaxConfig': {
                                                            put: [{
                                                                'ajaxType': 'put',
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'parentId',
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'caseCount',
                                                                        type: 'componentValue',
                                                                        valueName: 'caseCount',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
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
                                                            }]
                                                        }
                                                    },
                                                    { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                                                    { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                                                ],
                                                'dataList': [],
                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'addShowCasecascade',
                                                'layout': 'horizontal',
                                                'title': '新增数据',
                                                'width': '800',
                                                'isCard': true,
                                                'type': 'add',
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
                                                                    'hidden': false,
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '16',
                                                                    'inputType': 'submit',
                                                                    'name': 'Type',
                                                                    'label': '类别Id',
                                                                    'labelName': 'Name',
                                                                    'valueName': 'Id',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '--请选择--',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    /*  'ajaxConfig': {
                                                                         'url': 'SinoForce.User.AppUser',
                                                                         'ajaxType': 'get',
                                                                         'params': []
                                                                     }, */
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
                                                                    'hidden': false,
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
                                                                    'hidden': false,
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '16',
                                                                    'inputType': 'submit',
                                                                    'name': 'Level',
                                                                    'label': '级别',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '--请选择--',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'options': [
                                                                        {
                                                                            'label': '初级',
                                                                            'value': 0,
                                                                            'disabled': false
                                                                        },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                        {
                                                            controls: [
                                                                {
                                                                    'hidden': false,
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
                                                                    'hidden': false,
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
                                                'cascade': [ // 配置 信息
                                                    {
                                                        name: 'Type', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                        CascadeObjects: [// 当前小组件级联对象数组
                                                            {
                                                                cascadeName: 'Enable', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^1$' }, // 哪个字段的值触发，正则表达
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '1', label: '1' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '2', label: '2' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^3$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'show', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '3', label: '3' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息
                                                                                option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                    { hidden: false }

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^4$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'show', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '4', label: '4' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息
                                                                                option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                    { hidden: true }

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },



                                                                ],
                                                                cascadeDateItems: []  // 应答描述数组，同一个组件可以做出不同应答

                                                            },
                                                            {
                                                                cascadeName: 'Level', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
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
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },


                                                                ],
                                                                cascadeDateItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        data: {
                                                                            type: 'ajax', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '1', label: '高级date' },
                                                                                    { value: '2', label: '高级date' },
                                                                                    { value: '3', label: '高级date' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                                option: [
                                                                                    { name: 'typevalue', type: 'value', value: '1', valueName: 'value' },
                                                                                ]
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }
                                                                        }


                                                                    }


                                                                ]
                                                            }
                                                        ],
                                                    }

                                                ]


                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'batchUpdateShowCase',
                                                'title': '批量编辑',
                                                'width': '600',
                                                'type': 'edit',
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'select',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'name': 'enabled',
                                                                'label': '状态',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': true
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': false
                                                                    }
                                                                ],
                                                                'layout': 'column',
                                                                'span': '24'
                                                            },
                                                        ]
                                                    }
                                                ],
                                                'buttons': [
                                                    {
                                                        'name': 'batchSave', 'text': '保存',
                                                        'type': 'primary',
                                                        'ajaxConfig': [{
                                                            'ajaxType': 'put',
                                                            'url': 'common/ShowCase',
                                                            'batch': true,
                                                            'params': [
                                                                {
                                                                    name: 'Id',
                                                                    type: 'checkedRow',
                                                                    valueName: 'Id',
                                                                    value: ''
                                                                },
                                                                {
                                                                    name: 'enabled',
                                                                    type: 'componentValue',
                                                                    valueName: 'enabled',
                                                                    value: ''
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' }
                                                ],
                                                'dataList': [],
                                            },
                                        ],
                                        'windowDialog': [
                                            {
                                                'title': '',
                                                'name': 'ShowCaseWindow',
                                                'layoutName': 'singleTable',
                                                'width': 800,
                                                'buttons': [
                                                    {
                                                        'name': 'ok',
                                                        'text': '确定',
                                                        'type': 'primary'
                                                    },
                                                    { 'name': 'close', 'text': '关闭' }
                                                ]
                                            }
                                        ],
                                        'uploadDialog': [
                                            {
                                                'keyId': 'Id',
                                                'title': '',
                                                'name': 'uploadCase',
                                                'width': '600',
                                                'ajaxConfig': {
                                                    'deleteUrl': 'file/delete',
                                                    'listUrl': 'common/SysFile',
                                                    'url': 'file/upload',
                                                    'downloadUrl': 'file/download',
                                                    'ajaxType': 'post',
                                                    'params': [
                                                        {
                                                            'name': 'Id', 'type': 'tempValue', 'valueName': '_id'
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
                            id: 'area1_C',
                            title: '行内级联示例',
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
                                        'title': '数据网格',
                                        'viewId': 'singleTable_C',
                                        'component': 'bsnTable',
                                        'info': true,
                                        'keyId': 'Id',
                                        'scroll': { x: '1200px', y: '200px' },
                                        'showCheckBox': true,
                                        'size': 'small',
                                        'pagination': true, // 是否分页
                                        'showTotal': true, // 是否显示总数据量
                                        'pageSize': 20, // 默认每页数据条数
                                        'pageSizeOptions': [5, 10, 20, 30, 40, 100],
                                        'ajaxConfig': {
                                            'url': 'common/GetCase',
                                            'ajaxType': 'get',
                                            'params': [],
                                            'filter': [
                                                {
                                                    name: 'caseName',
                                                    valueName: '_caseName',
                                                    type: 'tempValue',
                                                    value: ''
                                                },
                                                {
                                                    name: 'enabled', valueName: '_enabled', type: 'tempValue', value: ''
                                                },
                                                {
                                                    name: 'caseType',
                                                    valueName: '_caseType',
                                                    type: 'tempValue',
                                                    value: ''
                                                }
                                            ]
                                        },
                                        'columns': [
                                            {
                                                title: '序号',
                                                field: '_serilize',
                                                width: '5%',
                                                hidden: false,
                                                titleAlign: 'text-right',
                                                fieldAlign: 'text-center'
                                            },
                                            {
                                                title: 'Id', field: 'Id', width: '1px', hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'Id',
                                                    options: {
                                                        'type': 'input',
                                                        'inputType': 'text'
                                                    }
                                                }
                                            },
                                            {
                                                title: '名称', field: 'caseName', width: '15%',
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: '',
                                                    field: 'caseName',
                                                    options: {
                                                        'type': 'input',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '类别', field: 'caseTypeText', width: '15%', hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'caseType',
                                                    options: {
                                                        'type': 'select',
                                                        'inputType': 'submit',
                                                        'name': 'caseType',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择数据-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '100%',
                                                        'defaultValue': '1',
                                                        'options': [
                                                            {
                                                                'label': '表格',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '树组件',
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
                                                title: '数量', field: 'caseCount', width: '10%', hidden: false,
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
                                                title: '级别', field: 'caseLevel', width: '10%', hidden: false,
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
                                                title: '创建时间',
                                                field: 'createDate',
                                                width: '10%',
                                                hidden: false,
                                                dataType: 'date',
                                                editor: {
                                                    type: 'input',
                                                    pipe: 'datetime',
                                                    field: 'createDate',
                                                    options: {
                                                        'type': 'datePicker',
                                                        'inputType': 'datetime',
                                                        'name': 'createDate',
                                                        'showTime': false,
                                                        'formart': 'yyyy-MM-dd'
                                                    }
                                                }
                                            },
                                            {
                                                title: '父类别', field: 'parentName', width: '10%', hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'parentId',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'parentId',
                                                        'label': '父类别',
                                                        'labelName': 'caseName',
                                                        'valueName': 'Id',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '--请选择--',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'width': '100%',
                                                        'defaultValue': '6b4021cef8394d5fb4775afcd01d920f',
                                                        'ajaxConfig': {
                                                            'url': 'common/ShowCase',
                                                            'ajaxType': 'get',
                                                            'params': []
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: '父类别', field: 'parentName', width: '10%', hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'parentIds',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'parentId_2',
                                                        'labelName': 'caseName',
                                                        'valueName': 'Id',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '100%',
                                                        'cascades': [
                                                            {
                                                                'cascadeName': 'parentId',
                                                                'params': [
                                                                    {
                                                                        'pid': 'parentId', 'cid': '_cas_parentId'
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        'ajaxConfig': {
                                                            'url': 'common/ShowCase',
                                                            'ajaxType': 'get',
                                                            'params': [
                                                                {
                                                                    name: 'parentId', type: 'cascadeValue', valueName: '_cas_parentId'
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                title: '状态',
                                                field: 'enableText',
                                                width: '10%',
                                                hidden: false,
                                                titleAlign: 'text-right',
                                                fieldAlign: 'text-center',
                                                formatter: [
                                                    {
                                                        'value': '启用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-blue',
                                                        'valueas': '启用'
                                                    },
                                                    {
                                                        'value': '禁用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-red',
                                                        'valueas': '禁用'
                                                    }
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
                                                        'width': '100%',
                                                        'defaultValue': 1,
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
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        'cascade': [ // 配置 信息
                                            {
                                                name: 'caseType', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                CascadeObjects: [// 当前小组件级联对象数组
                                                    {
                                                        cascadeName: 'enabled', // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: { type: 'selectValue', valueName: 'value', regular: '^1$' }, // 哪个字段的值触发，正则表达
                                                                data: {
                                                                    type: 'option', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '1', label: '1' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value: '新值'
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息

                                                                    },
                                                                    relation_data: {

                                                                    }

                                                                }
                                                            },
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: { type: 'selectValue', valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type: 'option', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '2', label: '2' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value: '新值'
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息

                                                                    },
                                                                    relation_data: {

                                                                    }

                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: { type: 'selectValue', valueName: 'value', regular: '^3$' }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type: 'show', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '3', label: '3' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value: '新值'
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息
                                                                        option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                            { hidden: false }

                                                                    },
                                                                    relation_data: {

                                                                    }

                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: { type: 'selectValue', valueName: 'value', regular: '^4$' }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type: 'show', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '4', label: '4' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        value: '新值'
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息
                                                                        option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                            { hidden: true }

                                                                    },
                                                                    relation_data: {

                                                                    }

                                                                }
                                                            },
                                                            {
                                                                // 缺少case描述语言
                                                                // 描述当前值是什么，触发
                                                                caseValue: { type: 'selectValue', valueName: 'value', regular: '^5$' }, // 哪个字段的值触发，正则表达
                                                                //  [
                                                                //     { type: 'in', value: '1' },
                                                                //     { type: 'range', fromValue: '1', toValue: '' },
                                                                // ],
                                                                data: {
                                                                    type: 'setValue', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '4', label: '4' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name: 'value',
                                                                            type: 'value',
                                                                            value: 0,
                                                                            valueName: 'data'
                                                                        }
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息
                                                                        option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                            { hidden: true }

                                                                    },
                                                                    relation_data: {

                                                                    }

                                                                }
                                                            },



                                                        ],
                                                        cascadeDateItems: []  // 应答描述数组，同一个组件可以做出不同应答

                                                    },
                                                    {
                                                        cascadeName: 'caseLevel', // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
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
                                                        cascadeDateItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            {
                                                                data: {
                                                                    type: 'setValue', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '1', label: '高级date' },
                                                                            { value: '2', label: '高级date' },
                                                                            { value: '3', label: '高级date' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                        option: [
                                                                            { name: 'typevalue', type: 'value', value: '1', valueName: 'data' },
                                                                            { name: 'typevaluename', type: 'selectValue', value: '1', valueName: 'data' },

                                                                        ]
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name: 'value',
                                                                            type: 'selectValue',
                                                                            value: '1',
                                                                            valueName: 'data'
                                                                        }
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息

                                                                    },
                                                                    relation_data: {

                                                                    }
                                                                }


                                                            }


                                                        ]
                                                    }
                                                ],
                                            },
                                            {
                                                name: 'parentId',
                                                CascadeObjects: [
                                                    {
                                                        cascadeName: 'parentIds', // field 对象 接收级联信息的小组件
                                                        cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                        ],
                                                        cascadeDateItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                            // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                            {
                                                                data: {
                                                                    type: 'ajax', // option/ajax/setValue
                                                                    option_data: { // 静态数据集
                                                                        option: [
                                                                            { value: '1', label: '高级date' },
                                                                            { value: '2', label: '高级date' },
                                                                            { value: '3', label: '高级date' }
                                                                        ]
                                                                    },
                                                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                        option: [
                                                                            { name: '_cas_parentId', type: 'selectValue', value: '1', valueName: 'data' } // ,
                                                                            // { name: 'typevaluename', type: 'selectValue', value: '1', valueName: 'data' },

                                                                        ]
                                                                    },
                                                                    setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                        option: {
                                                                            name: 'value',
                                                                            type: 'selectValue',
                                                                            value: '1',
                                                                            valueName: 'data'
                                                                        }
                                                                    },
                                                                    show_data: { // 当前表单的展示字段等信息

                                                                    },
                                                                    relation_data: {

                                                                    }
                                                                }


                                                            }


                                                        ]
                                                    }
                                                ]
                                            }

                                        ],
                                        'componentType': {
                                            'parent': false,
                                            'child': true,
                                            'own': true
                                        },
                                        'relations': [{
                                            'relationViewId': 'search_form',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                                { pid: 'caseName', cid: '_caseName' },
                                                { pid: 'enabled', cid: '_enabled' },
                                                { pid: 'caseType', cid: '_caseType' }
                                            ],
                                            'relationReceiveContent': []
                                        }],
                                        'toolbar': [
                                            {
                                                group: [
                                                    {
                                                        'name': 'refresh',
                                                        'action': 'REFRESH',
                                                        'text': '刷新',
                                                        'color': 'text-primary'
                                                    },
                                                    {
                                                        'name': 'addRow',
                                                        'text': '新增',
                                                        'action': 'CREATE',
                                                        'icon': 'anticon anticon-plus',
                                                        'color': 'text-primary'
                                                    },
                                                    {
                                                        'name': 'updateRow',
                                                        'text': '修改',
                                                        'action': 'EDIT',
                                                        'icon': 'anticon anticon-edit',
                                                        'color': 'text-success'
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'text': '删除1',
                                                        'action': 'DELETE',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'ajaxConfig': {
                                                            delete: [
                                                                {
                                                                    'actionName': 'delete',
                                                                    'url': 'common/ShowCase',
                                                                    'ajaxType': 'delete',
                                                                    'title': '警告！',
                                                                    'message': '确认要删除当前勾选的数据么？？？'
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'text': '删除2',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-warning',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'delete', // 批量删除调用建模API，不能使用该模式，delete动作无法传递数组参数类型
                                                                'title': '警告！',
                                                                'message': '确认要删除当前勾选的数据么？？？',
                                                                'params': [
                                                                    {
                                                                        name: '_ids', type: 'checkedId', valueName: 'Id'
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
                                                        'name': 'executeCheckedRow',
                                                        'text': '多选删除(确认+提示操作)',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'actionType': 'post',
                                                        'actionName': 'execChecked',
                                                        'ajaxConfig': [
                                                            {
                                                                'name': 'checkDeleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DelConfirmShowCase',
                                                                'ajaxType': 'post',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'isCheck',
                                                                        valueName: '',
                                                                        type: 'value',
                                                                        value: true
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        type: 'value',
                                                                        value: 'output',
                                                                        valueName: ''
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                'name': 'deleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DelConfirmShowCase',
                                                                'ajaxType': 'post',
                                                                'parentName': 'checkDeleteShowCase',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'isCheck',
                                                                        valueName: '',
                                                                        type: 'value',
                                                                        value: false
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    },
                                                                    {
                                                                        name: 'dataSet1', dataType: 'table',
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'executeCheckedRow1',
                                                        'text': '多选删除(验证+提示)',
                                                        'icon': 'anticon anticon-delete',
                                                        'color': 'text-red-light',
                                                        'actionType': 'post',
                                                        'actionName': 'execChecked',
                                                        'ajaxConfig': [
                                                            {
                                                                'name': 'checkDeleteShowCase',
                                                                'action': 'EXECUTE_CHECKED_ID',
                                                                'url': 'common/DeleteShowCase',
                                                                'ajaxType': 'post',
                                                                'title': '提示',
                                                                'message': '是否将选中的数据执行当前操作？',
                                                                'params': [
                                                                    {
                                                                        name: 'Ids',
                                                                        valueName: 'Id', // 或者'_checkedIds'
                                                                        type: 'checkedId' //  或者 'tempValue'
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        type: 'value',
                                                                        value: 'output',
                                                                        valueName: ''
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Message', dataType: 'message'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'executeSelectedRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '选中删除',
                                                        'icon': 'anticon anticon-delete',
                                                        'actionType': 'post',
                                                        'actionName': 'execSelected',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_SELECTED',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'delete',
                                                                'title': '提示',
                                                                'message': '是否将选中的数据执行当前操作？',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        valueName: 'Id',  // _selectedItem
                                                                        type: 'selectedRow' // tempValue
                                                                    },
                                                                    {
                                                                        name: 'Message',
                                                                        value: 'output', // 或者'_checkedIds'
                                                                        type: 'value' //  或者 'tempValue'
                                                                    }
                                                                ],
                                                                'outputParams': [
                                                                    {
                                                                        name: 'Id', dataType: ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'saveRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '保存',
                                                        'icon': 'anticon anticon-save',
                                                        'type': 'default',
                                                        'color': 'text-primary',
                                                        'ajaxConfig': [
                                                            {
                                                                'action': 'EXECUTE_SAVE_ROW',
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
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
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
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                'action': 'EXECUTE_EDIT_ROW',
                                                                'url': 'common/ShowCase',
                                                                'ajaxType': 'put',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'componentValue',
                                                                        valueName: 'Id',
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
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
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
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        'name': 'cancelRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消',
                                                        'action': 'CANCEL',
                                                        'icon': 'anticon anticon-rollback',
                                                        'color': 'text-grey-darker',
                                                    }
                                                ]
                                            },
                                            {
                                                group: [
                                                    {
                                                        'name': 'addForm',
                                                        'text': '弹出新增表单',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCase',
                                                        'type': 'showForm'
                                                    },
                                                    {
                                                        'name': 'editForm',
                                                        'text': '弹出编辑表单',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'updateShowCase',
                                                        'type': 'showForm'
                                                    },
                                                    {
                                                        'name': 'batchEditForm',
                                                        'text': '弹出批量处理表单',
                                                        'action': 'FORM_BATCH',
                                                        'actionName': 'batchUpdateShowCase',
                                                        'icon': 'anticon anticon-form',
                                                        'type': 'showBatchForm',
                                                    },
                                                    {
                                                        'name': 'showDialogPage',
                                                        'text': '弹出页面',
                                                        'action': 'WINDOW',
                                                        'actionType': 'windowDialog',
                                                        'actionName': 'ShowCaseWindow',
                                                        'type': 'showLayout'
                                                    },
                                                    {
                                                        'name': 'upload',
                                                        'icon': 'anticon anticon-upload',
                                                        'text': '附件上传',
                                                        'action': 'UPLOAD',
                                                        'actionType': 'uploadDialog',
                                                        'actionName': 'uploadCase',
                                                        'type': 'uploadDialog'
                                                    },
                                                    {
                                                        'name': 'addFormcascade',
                                                        'text': '级联例子',
                                                        'icon': 'anticon anticon-form',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCasecascade',
                                                        'type': 'showForm'
                                                    }
                                                ]
                                            },
                                            {
                                                dropdown: [
                                                    {
                                                        'name': 'btnGroup', 'text': ' 分组操作', 'icon': 'icon-plus',
                                                        'buttons': [
                                                            {
                                                                'name': 'refresh',
                                                                'class': 'editable-add-btn',
                                                                'text': ' 刷新',
                                                                'icon': 'icon-list'
                                                            },
                                                            {
                                                                'name': 'addRow',
                                                                'class': 'editable-add-btn',
                                                                'text': '新增',
                                                                'icon': 'icon-add'
                                                            },
                                                            {
                                                                'name': 'updateRow',
                                                                'class': 'editable-add-btn',
                                                                'text': '修改',
                                                                'icon': 'icon-edit'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        'dataSet': [
                                            {
                                                'name': 'getCaseName',
                                                'ajaxConfig': {
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'get',
                                                    'params': []
                                                },
                                                'params': [],
                                                'fields': [
                                                    {
                                                        'label': 'ID',
                                                        'field': 'Id',
                                                        'name': 'value'
                                                    },
                                                    {
                                                        'label': '',
                                                        'field': 'caseName',
                                                        'name': 'label'
                                                    },
                                                    {
                                                        'label': '',
                                                        'field': 'caseName',
                                                        'name': 'text'
                                                    }
                                                ]
                                            }
                                        ],
                                        'formDialog': [
                                            {
                                                'keyId': 'Id',
                                                'name': 'addShowCase',
                                                'layout': 'horizontal',
                                                'title': '新增数据',
                                                'width': '800',
                                                'isCard': true,
                                                'type': 'add',
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
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
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': 0
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': 1
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
                                                                'label': '父类别',
                                                                'labelName': 'caseName',
                                                                'valueName': 'Id',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': '6b4021cef8394d5fb4775afcd01d920f',
                                                                'ajaxConfig': {
                                                                    'url': 'common/ShowCase',
                                                                    'ajaxType': 'get',
                                                                    'params': []
                                                                },
                                                                'cascader': [
                                                                    {
                                                                        'name': 'getCaseName',
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
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'explain': '名称需要根据规范填写',
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
                                                                'type': 'checkboxGroup',
                                                                'label': '选项',
                                                                'labelSize': '6',
                                                                'controlSize': '18',
                                                                'name': 'enabled',
                                                                'disabled': false,
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
                                                        ]
                                                    },
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'radioGroup',
                                                                'label': '选项',
                                                                'labelSize': '6',
                                                                'controlSize': '18',
                                                                'name': 'enabled1',
                                                                'disabled': false,
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
                                                'buttons': [
                                                    {
                                                        'name': 'save', 'text': '保存', 'type': 'primary',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'ajaxType': 'post',
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'createTime',
                                                                        type: 'componentValue',
                                                                        valueName: 'createTime',
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
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'saveAndKeep', 'text': '保存并继续', 'type': 'primary',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'createTime',
                                                                        type: 'componentValue',
                                                                        valueName: 'createTime',
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
                                                            }]
                                                        }
                                                    },
                                                    { 'name': 'reset', 'text': '重置' },
                                                    { 'name': 'close', 'text': '关闭' }
                                                ]
                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'updateShowCase',
                                                'title': '编辑',
                                                'width': '600',
                                                'type': 'edit',
                                                'ajaxConfig': {
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'getById',
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
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'select',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'name': 'enabled',
                                                                'label': '状态',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': 1
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': 0
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
                                                                'name': 'parentId',
                                                                'label': '父类别',
                                                                'labelName': 'caseName',
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
                                                                        'name': 'getCaseName',
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
                                                'buttons': [
                                                    {
                                                        'name': 'save', 'text': '保存',
                                                        'type': 'primary',
                                                        'ajaxConfig': {
                                                            put: [{
                                                                'ajaxType': 'put',
                                                                'url': 'common/ShowCase',
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
                                                                        name: 'parentId',
                                                                        type: 'componentValue',
                                                                        valueName: 'parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'caseCount',
                                                                        type: 'componentValue',
                                                                        valueName: 'caseCount',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'createDate',
                                                                        type: 'componentValue',
                                                                        valueName: 'createDate',
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
                                                            }]
                                                        }
                                                    },
                                                    { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' },
                                                    { 'name': 'reset', 'class': 'editable-add-btn', 'text': '重置' }
                                                ],
                                                'dataList': [],
                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'addShowCasecascade',
                                                'layout': 'horizontal',
                                                'title': '新增数据',
                                                'width': '800',
                                                'isCard': true,
                                                'type': 'add',
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
                                                                    'hidden': false,
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '16',
                                                                    'inputType': 'submit',
                                                                    'name': 'Type',
                                                                    'label': '类别Id',
                                                                    'labelName': 'Name',
                                                                    'valueName': 'Id',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '--请选择--',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    /*  'ajaxConfig': {
                                                                         'url': 'SinoForce.User.AppUser',
                                                                         'ajaxType': 'get',
                                                                         'params': []
                                                                     }, */
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
                                                                    'hidden': false,
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
                                                                    'hidden': false,
                                                                    'type': 'select',
                                                                    'labelSize': '6',
                                                                    'controlSize': '16',
                                                                    'inputType': 'submit',
                                                                    'name': 'Level',
                                                                    'label': '级别',
                                                                    'notFoundContent': '',
                                                                    'selectModel': false,
                                                                    'showSearch': true,
                                                                    'placeholder': '--请选择--',
                                                                    'disabled': false,
                                                                    'size': 'default',
                                                                    'options': [
                                                                        {
                                                                            'label': '初级',
                                                                            'value': 0,
                                                                            'disabled': false
                                                                        },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                        {
                                                            controls: [
                                                                {
                                                                    'hidden': false,
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
                                                                    'hidden': false,
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
                                                'cascade': [ // 配置 信息
                                                    {
                                                        name: 'Type', // 发出级联请求的小组件（就是配置里的name 字段名称）
                                                        CascadeObjects: [// 当前小组件级联对象数组
                                                            {
                                                                cascadeName: 'Enable', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^1$' }, // 哪个字段的值触发，正则表达
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '1', label: '1' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    // [dataType\valueType]大类别，是直接级联变化，还是根据change值含义变化
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '2', label: '2' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^3$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'show', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '3', label: '3' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息
                                                                                option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                    { hidden: false }

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^4$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'show', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '4', label: '4' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息
                                                                                option: // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                                                                                    { hidden: true }

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },



                                                                ],
                                                                cascadeDateItems: []  // 应答描述数组，同一个组件可以做出不同应答

                                                            },
                                                            {
                                                                cascadeName: 'Level', // field 对象 接收级联信息的小组件
                                                                cascadeValueItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        // 缺少case描述语言
                                                                        // 描述当前值是什么，触发
                                                                        caseValue: { valueName: 'value', regular: '^2$' }, // 哪个字段的值触发，正则表达
                                                                        //  [
                                                                        //     { type: 'in', value: '1' },
                                                                        //     { type: 'range', fromValue: '1', toValue: '' },
                                                                        // ],
                                                                        data: {
                                                                            type: 'option', // option/ajax/setValue
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
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }

                                                                        }
                                                                    },


                                                                ],
                                                                cascadeDateItems: [   // 应答描述数组，同一个组件可以做出不同应答
                                                                    // 需要描述不同的选项下的不同事件 事件优先级，展示-》路由-》赋值 依次解析
                                                                    {
                                                                        data: {
                                                                            type: 'ajax', // option/ajax/setValue
                                                                            option_data: { // 静态数据集
                                                                                option: [
                                                                                    { value: '1', label: '高级date' },
                                                                                    { value: '2', label: '高级date' },
                                                                                    { value: '3', label: '高级date' }
                                                                                ]
                                                                            },
                                                                            ajax_data: { // 路由发生变化，复杂问题，涉及参数取值  组件参数配置为caseCodeValue

                                                                                // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                                                                option: [
                                                                                    { name: 'typevalue', type: 'value', value: '1', valueName: 'value' },
                                                                                ]
                                                                            },
                                                                            setValue_data: { // 赋值，修改级联对象的值，例如选择下拉后修改对于input的值
                                                                                value: '新值'
                                                                            },
                                                                            show_data: { // 当前表单的展示字段等信息

                                                                            },
                                                                            relation_data: {

                                                                            }
                                                                        }


                                                                    }


                                                                ]
                                                            }
                                                        ],
                                                    }

                                                ]


                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'batchUpdateShowCase',
                                                'title': '批量编辑',
                                                'width': '600',
                                                'type': 'edit',
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'select',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'name': 'enabled',
                                                                'label': '状态',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'defaultValue': 1,
                                                                'options': [
                                                                    {
                                                                        'label': '启用',
                                                                        'value': true
                                                                    },
                                                                    {
                                                                        'label': '禁用',
                                                                        'value': false
                                                                    }
                                                                ],
                                                                'layout': 'column',
                                                                'span': '24'
                                                            },
                                                        ]
                                                    }
                                                ],
                                                'buttons': [
                                                    {
                                                        'name': 'batchSave', 'text': '保存',
                                                        'type': 'primary',
                                                        'ajaxConfig': [{
                                                            'ajaxType': 'put',
                                                            'url': 'common/ShowCase',
                                                            'batch': true,
                                                            'params': [
                                                                {
                                                                    name: 'Id',
                                                                    type: 'checkedRow',
                                                                    valueName: 'Id',
                                                                    value: ''
                                                                },
                                                                {
                                                                    name: 'enabled',
                                                                    type: 'componentValue',
                                                                    valueName: 'enabled',
                                                                    value: ''
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    { 'name': 'close', 'class': 'editable-add-btn', 'text': '关闭' }
                                                ],
                                                'dataList': [],
                                            },
                                        ],
                                        'windowDialog': [
                                            {
                                                'title': '',
                                                'name': 'ShowCaseWindow',
                                                'layoutName': 'singleTable',
                                                'width': 800,
                                                'buttons': [
                                                    {
                                                        'name': 'ok',
                                                        'text': '确定',
                                                        'type': 'primary'
                                                    },
                                                    { 'name': 'close', 'text': '关闭' }
                                                ]
                                            }
                                        ],
                                        'uploadDialog': [
                                            {
                                                'keyId': 'Id',
                                                'title': '',
                                                'name': 'uploadCase',
                                                'width': '600',
                                                'ajaxConfig': {
                                                    'deleteUrl': 'file/delete',
                                                    'listUrl': 'common/SysFile',
                                                    'url': 'file/upload',
                                                    'downloadUrl': 'file/download',
                                                    'ajaxType': 'post',
                                                    'params': [
                                                        {
                                                            'name': 'Id', 'type': 'tempValue', 'valueName': '_id'
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
                            title: '分步操作',
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
                                        'title': '数据网格',
                                        'viewId': 'singlessTable',
                                        'component': 'bsnStep',
                                        'info': true,
                                        'keyId': 'Id',
                                        'size': 'default',
                                        'steps': [
                                            {
                                                'title': '第一步',
                                                'desc': '一小步',
                                                'size': 'small', // small ,default,
                                                'icon': '',
                                                'viewCfg': [
                                                    {
                                                        config: {
                                                            'viewId': 'search_form',
                                                            'component': 'search_view',
                                                            'keyId': 'Id',
                                                            'layout': 'horizontal',
                                                            'componentType': {
                                                                'parent': true,
                                                                'child': false,
                                                                'own': true
                                                            },
                                                            'forms': [
                                                                {
                                                                    title: '分类条件',
                                                                    layout: 'grid',
                                                                    collapse: false,
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
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'submit',
                                                                            'name': 'Type',
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    title: '扩展条件',
                                                                    layout: 'grid last',
                                                                    collapse: true,
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
                                                                            'span': '6'
                                                                        },
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
                                                                            'span': '6'
                                                                        },
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
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
                                                                                { pid: 'caseType', cid: '_type' },
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
                                            },
                                            {
                                                'title': '第二步',
                                                'desc': '一大步',
                                                'size': 'default', // small ,default,
                                                'icon': ''
                                            },
                                            {
                                                'title': '最后一步',
                                                'desc': '完成',
                                                'size': '', // small ,default,
                                                'icon': ''
                                            }
                                        ]
                                    },
                                    dataList: [],
                                    permissions: []
                                }
                            ]
                        }
                    ]
                }
            },
            // {
            //     row: {
            //         cols: [
            //             {
            //                 id: 'area11',
            //                 title: '分步操作',
            //                 span: 24,
            //                 icon: 'icon-list',
            //                 size: {
            //                     nzXs: 24,
            //                     nzSm: 24,
            //                     nzMd: 24,
            //                     nzLg: 24,
            //                     ngXl: 24
            //                 },
            //                 viewCfg: [
            //                     {
            //                         config: {
            //                             'title': '数据网格',
            //                             'viewId': 'singlessTable1',
            //                             'component': 'bsnStep',
            //                             'info': true,
            //                             'keyId': 'Id',
            //                             'size': 'default',
            //                             'ajaxConfig': {
            //                                 'url': 'common/GetCase',
            //                                 'ajaxType': 'get',
            //                                 'params': [],
            //                                 'filter': [
            //                                     {
            //                                         name: 'caseName', valueName: '_caseName', type: '', value: ''
            //                                     }
            //                                 ]
            //                             },
            //                             'dataMapping': [
            //                                 { 'field': 'caseName', 'name': 'title' },
            //                                 { 'field': 'remark', 'name': 'desc' }
            //                             ]
            //                         },
            //                         dataList: [],
            //                         permissions: []
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // },
            {
                row: {
                    cols: [
                        {
                            id: 'area33',
                            title: '折叠面板',
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
                                        'title': '数据网格',
                                        'viewId': 'panels',
                                        'component': 'bsnAccordion',
                                        'info': true,
                                        'keyId': 'Id',
                                        'size': 'default',
                                        'panels': [
                                            {
                                                'title': '面板 1',
                                                'size': 'small', // small ,default,
                                                'icon': 'icon icon-pencil text-grey-darker',
                                                'active': true,
                                                'showArrow': true,
                                                'viewCfg': [
                                                    {
                                                        config: {
                                                            'viewId': 'search_form',
                                                            'component': 'search_view',
                                                            'keyId': 'Id',
                                                            'layout': 'horizontal',
                                                            'componentType': {
                                                                'parent': true,
                                                                'child': false,
                                                                'own': true
                                                            },
                                                            'forms': [
                                                                {
                                                                    title: '分类条件',
                                                                    layout: 'grid',
                                                                    collapse: false,
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
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'submit',
                                                                            'name': 'Type',
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    title: '扩展条件',
                                                                    layout: 'grid last',
                                                                    collapse: true,
                                                                    controls: [
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseName',
                                                                            'addOnBeforeIcon': 'anticon anticon-setting',
                                                                            'label': '名称',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseLevel',
                                                                            'addOnAfterIcon': 'anticon anticon-setting',
                                                                            'label': '级别',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
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
                                                                                { pid: 'caseType', cid: '_type' },
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
                                            },
                                            {
                                                'title': '面板 2',
                                                'size': 'default', // small ,default,
                                                'active': false,
                                                'showArrow': true,
                                                'icon': 'icon icon-bell text-blue-7',
                                                'viewCfg': [
                                                    {
                                                        config: {
                                                            'viewId': 'search_form_1',
                                                            'component': 'search_view',
                                                            'keyId': 'Id',
                                                            'layout': 'horizontal',
                                                            'componentType': {
                                                                'parent': true,
                                                                'child': false,
                                                                'own': true
                                                            },
                                                            'forms': [
                                                                {
                                                                    title: '分类条件',
                                                                    layout: 'grid',
                                                                    collapse: false,
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
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'submit',
                                                                            'name': 'Type',
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    title: '扩展条件',
                                                                    layout: 'grid last',
                                                                    collapse: true,
                                                                    controls: [
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseName',
                                                                            'addOnBeforeIcon': 'anticon anticon-setting',
                                                                            'label': '名称',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseLevel',
                                                                            'addOnAfterIcon': 'anticon anticon-setting',
                                                                            'label': '级别',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
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
                                                                                { pid: 'caseType', cid: '_type' },
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
                                            },
                                            {
                                                'title': '面板 3',
                                                'size': 'default', // small ,default,
                                                'active': false,
                                                'showArrow': true,
                                                'icon': 'anticon anticon-setting text-success',
                                                'viewCfg': [
                                                    {
                                                        config: {
                                                            'viewId': 'search_form_2',
                                                            'component': 'search_view',
                                                            'keyId': 'Id',
                                                            'layout': 'horizontal',
                                                            'componentType': {
                                                                'parent': true,
                                                                'child': false,
                                                                'own': true
                                                            },
                                                            'forms': [
                                                                {
                                                                    title: '分类条件',
                                                                    layout: 'grid',
                                                                    collapse: false,
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
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'submit',
                                                                            'name': 'Type',
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    title: '扩展条件',
                                                                    layout: 'grid last',
                                                                    collapse: true,
                                                                    controls: [
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseName',
                                                                            'addOnBeforeIcon': 'anticon anticon-setting',
                                                                            'label': '名称',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
                                                                        {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '16',
                                                                            'inputType': 'text',
                                                                            'name': 'caseLevel',
                                                                            'addOnAfterIcon': 'anticon anticon-setting',
                                                                            'label': '级别',
                                                                            'placeholder': '',
                                                                            'disabled': false,
                                                                            'readonly': false,
                                                                            'size': 'default',
                                                                            'layout': 'column',
                                                                            'span': '6'
                                                                        },
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
                                                                            'span': '6'
                                                                        }
                                                                    ]
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
                                                                                { pid: 'caseType', cid: '_type' },
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
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    };

    componentConfig = {
        'config': {
            'viewId': 'search_form',
            'component': 'search_view',
            'keyId': 'Id',
            'layout': 'horizontal',
            'componentType': {
                'parent': true,
                'child': false,
                'own': true
            },
            'forms': [
                {
                    'title': '分类条件',
                    'layout': 'grid',
                    'controls': [
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
                            'span': '6'
                        },
                        {
                            'type': 'select',
                            'labelSize': '6',
                            'controlSize': '16',
                            'inputType': 'submit',
                            'name': 'Type',
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
                            'span': '6'
                        }
                    ]
                },
                {
                    'title': '扩展条件',
                    'layout': 'grid last',
                    'controls': [
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
                            'span': '6'
                        },
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
                            'span': '6'
                        },
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
                            'span': '6'
                        },
                        {
                            'type': 'search',
                            'labelSize': '6',
                            'controlSize': '16',
                            'inputType': 'button',
                            'name': 'Type',
                            'label': '',
                            'disabled': false,
                            'size': 'default',
                            'layout': 'column',
                            'span': '6'
                        }
                    ]
                }
            ],
            'dataList': [],
            'relations': [
                {
                    'relationViewId': 'search_form',
                    'relationSendContent': [
                        {
                            'name': 'searchFormByValue',
                            'sender': 'search_form',
                            'aop': 'after',
                            'receiver': 'singleTable',
                            'relationData': {
                                'name': 'refreshAsChild',
                                'params': [
                                    {
                                        'pid': 'caseName',
                                        'cid': '_caseName'
                                    },
                                    {
                                        'pid': 'Type',
                                        'cid': '_type'
                                    }
                                ]
                            }
                        }
                    ],
                    'relationReceiveContent': []
                }
            ]
        },
        'dataList': []
    };
    formConfig = {
        'forms': [
            {
                'title': '分类条件',
                'layout': 'grid',
                'controls': [
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
                        'span': '6'
                    }
                ]
            }
        ]
    };
    editor;
    componentEditor;
    formEditor;
    formGroup: FormGroup;

    constructor(private http: _HttpClient) {

    }

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
        this.formGroup = new FormGroup({});
    }


    // region: init
    ngAfterViewInit() {
        this.editor = CodeMirror.fromTextArea(this.codeEditor.nativeElement, {
            mode: 'application/json',
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        });

        this.componentEditor = CodeMirror.fromTextArea(this.componentRef.nativeElement, {
            mode: 'application/json',
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        });

        this.formEditor = CodeMirror.fromTextArea(this.formRef.nativeElement, {
            mode: 'application/json',
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        });
    }

    getValue() {
        return this.editor.getValue();
    }

    setValue(data?) {
        this.editor.setValue(data);
    }

    create() {
        this.config = JSON.parse(this.getValue());
    }

    resolveComponent() {
        this.componentConfig = JSON.parse(this.componentEditor.getValue());
    }

    resolveForm() {
        this.formConfig = JSON.parse(this.formEditor.getValue());
    }

    // endregion
}

export class PermissionFilter {
    finalConfig;

    constructor(private config, private permission) {

    }

    public columns(colConfig) {

    }

    public toolbar(tlbConfig) {

    }

    public formDialog(formConfig) {

    }

    public windowDialog(dialogConfig) {

    }

    public buttons(btnConfig) {

    }

    applyPermission() {
        if (this.config && this.permission) {
            this.config.forEach(element => {

            });
        }


    }

    private _columnsPermissionFilter() {

    }

    private _toolbarPermissionFilter() {

    }

    private _formDialogPermission() {

    }

    private _windowDialogPermission() {

    }

    private _formPermissionFilter() {

    }

    private _buttonPermissionFilter() {

    }
}



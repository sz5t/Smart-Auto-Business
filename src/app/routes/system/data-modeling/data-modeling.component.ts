import {Component, Injectable, OnInit} from '@angular/core';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';
import {AppPermission, FuncResPermission, OpPermission, PermissionValue} from '../../../model/APIModel/AppPermission';
import {TIMEOUT} from 'dns';
import {_HttpClient} from '@delon/theme';

@Component({
    selector: 'cn-data-modeling, [data-modeling]',
    templateUrl: './data-modeling.component.html',
    styles: []
})
export class DataModelingComponent implements OnInit {

    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '建模主表',
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
                                        'viewId': 'parentTable',
                                        'component': 'bsnTable',
                                        'keyId': 'Id',
                                        'size': 'small',
                                        'showCheckBox': true,
                                        'pagination': true, // 是否分页
                                        'showTotal': true, // 是否显示总数据量
                                        'pageSize': 5, // 默pageSizeOptions认每页数据条数
                                        '': [5, 10, 20, 30, 40, 50],
                                        'ajaxConfig': {
                                            'url': 'common/ComTabledata',
                                            'ajaxType': 'get',
                                            'params': [
                                                {
                                                    name: '_sort',
                                                    type: 'value',
                                                    valueName: '',
                                                    value: 'createDate desc'
                                                }
                                            ]
                                        },
                                        'componentType': {
                                            'parent': true,
                                            'child': false,
                                            'own': true
                                        },
                                        'relations': [{
                                            'relationViewId': 'parentTable',
                                            'relationSendContent': [
                                                {
                                                    name: 'selectRow',
                                                    sender: 'parentTable',
                                                    aop: 'after',
                                                    receiver: 'childTable',
                                                    relationData: {
                                                        name: 'refreshAsChild',
                                                        params: [
                                                            {pid: 'Id', cid: '_parentId'},
                                                        ]
                                                    },
                                                }
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
                                                title: '名称', field: 'name', width: 80,
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'name',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '表名称', field: 'tableName', width: 80,
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'tableName',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },

                                            {
                                                title: '表类别', field: 'tableType', width: 80, hidden: true,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'Type',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'Type',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '130px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': '1',
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
                                                                'label': '父子关系表',
                                                                'value': '3',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '父表id', field: 'parentTableId', width: 80, hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'parentTableId',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '父表名称', field: 'parentTableName', width: 80, hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'parentTableName',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否存在表关系', field: 'isHavaDatalink', width: 80, hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'isHavaDatalink',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '子表指向父表的Id',
                                                field: 'subRefParentColumnId',
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'subRefParentColumnId',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '子表指向父表的字段名称',
                                                field: 'subRefParentColumnName',
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'subRefParentColumnName',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },

                                            {
                                                title: '是否启用', field: 'isEnabled', width: 80, hidden: false,
                                                formatter: [
                                                    {
                                                        'value': '启用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-green',
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
                                                    field: 'isEnabled',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'Enable',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '80px',
                                                        'defaultValue': '1',
                                                        'options': [
                                                            {
                                                                'label': '启用',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '禁用',
                                                                'value': '0',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否发布', field: 'isNeedDeploy', width: 80, hidden: false,
                                                formatter: [
                                                    {
                                                        'value': '启用',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-green',
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
                                                    field: 'isNeedDeploy',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'isNeedDeploy',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '80px',
                                                        'defaultValue': '1',
                                                        'options': [
                                                            {
                                                                'label': '是',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '否',
                                                                'value': '0',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '平台类型', field: 'belongPlatformType', width: 80, hidden: false,
                                                editor: {
                                                    type: 'select',
                                                    field: 'belongPlatformType',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'belongPlatformType',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '80px',
                                                        'defaultValue': '2',
                                                        'options': [
                                                            {
                                                                'label': '配置平台',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '运行平台',
                                                                'value': '2',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '通用',
                                                                'value': '3',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '备注', field: 'comments', width: 80, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'comments',
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
                                                width: 80,
                                                hidden: false,
                                                showSort: true,
                                                editor: {
                                                    type: 'input',
                                                    field: 'createDate',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否建模',
                                                field: 'isBuildModel',
                                                width: 80,
                                                hidden: false,
                                                showSort: true,
                                                formatter: [
                                                    {
                                                        'value': '1',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-blue',
                                                        'valueas': '已建模'
                                                    },
                                                    {
                                                        'value': '0',
                                                        'bgcolor': '',
                                                        'fontcolor': 'text-red',
                                                        'valueas': '未建模'
                                                    }
                                                ],
                                                // editor: {
                                                //   type: 'input',
                                                //   field: 'isCreated',
                                                //   options: {
                                                //     'type': 'input',
                                                //     'labelSize': '6',
                                                //     'controlSize': '18',
                                                //     'inputType': 'text',
                                                //   }
                                                // }
                                            }


                                        ],
                                        'toolbar': [
                                            {
                                                group: [
                                                    {
                                                        'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新', 'action': 'REFRESH'
                                                    },
                                                    {
                                                        'name': 'addRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '新增',
                                                        'action': 'CREATE'
                                                    },
                                                    {
                                                        'name': 'updateRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '修改',
                                                        'action': 'EDIT'
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '删除',
                                                        'action': 'DELETE',
                                                        'ajaxConfig': {
                                                            delete: [{
                                                                'actionName': 'delete',
                                                                'url': 'common/ComTabledata',
                                                                'ajaxType': 'delete'
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'saveRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '保存',
                                                        'action': 'SAVE',
                                                        'type': 'method/action',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'actionName': 'add',
                                                                'url': 'common/ComTabledata',
                                                                'ajaxType': 'post',
                                                                'params': [
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableName',
                                                                        type: 'componentValue',
                                                                        valueName: 'tableName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableType',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: '1'
                                                                    },

                                                                    {
                                                                        name: 'parentTableId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'parentTableName ',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isHavaDatalink',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnName',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNeedDeploy',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNeedDeploy',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'belongPlatformType',
                                                                        type: 'componentValue',
                                                                        valueName: 'belongPlatformType',
                                                                        value: ''
                                                                    }
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
                                                                'url': 'common/ComTabledata',
                                                                'ajaxType': 'put',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'componentValue',
                                                                        valueName: 'Id',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableName',
                                                                        type: 'componentValue',
                                                                        valueName: 'tableName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableType',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: '1'
                                                                    },

                                                                    {
                                                                        name: 'parentTableId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'parentTableName ',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isHavaDatalink',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnName',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNeedDeploy',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNeedDeploy',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'belongPlatformType',
                                                                        type: 'componentValue',
                                                                        valueName: 'belongPlatformType',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'cancelRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消',
                                                        'action': 'CANCEL',
                                                    },
                                                    {
                                                        'name': 'addForm',
                                                        'class': 'editable-add-btn',
                                                        'text': '弹出新增表单',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCase',
                                                        'type': 'showForm'

                                                    },
                                                    {
                                                        'name': 'editForm',
                                                        'class': 'editable-add-btn',
                                                        'text': '弹出编辑表单',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'updateShowCase',
                                                        'type': 'showForm'

                                                    },
                                                    {
                                                        'name': 'executeCheckedRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '批量建模',
                                                        'actionType': 'post',
                                                        'actionName': 'BuildModel',
                                                        'ajaxConfig': [{
                                                            'action': 'EXECUTE_CHECKED',
                                                            'url': 'common/Action/ComTabledata/buildModel',
                                                            'ajaxType': 'post',
                                                            'params': [
                                                                {
                                                                    name: 'Ids', valueName: 'Id', type: 'checkedIds'
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        'name': 'executeSelectedRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '建模',
                                                        'actionType': 'post',
                                                        'actionName': 'BuildModel',
                                                        'ajaxConfig': [{
                                                            'action': 'EXECUTE_SELECTED',
                                                            'url': 'common/Action/ComTabledata/buildModel',
                                                            'title': '提示',
                                                            'message': '是否为该数据进行建模？',
                                                            'ajaxType': 'post',
                                                            'params': [
                                                                {
                                                                    name: 'Id', valueName: 'Id', type: 'selectedRow'
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        'name': 'executeSelectedRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消建模',
                                                        'action': 'EXECUTE_SELECTED',
                                                        'actionType': 'post',
                                                        'actionName': 'CancelBuildModel',
                                                        'ajaxConfig': [{
                                                            'action': 'EXECUTE_SELECTED',
                                                            'url': 'common/Action/ComTabledata/cancelModel',
                                                            'ajaxType': 'post',
                                                            'params': [
                                                                {
                                                                    name: 'Id', valueName: 'Id', type: 'selectedRow'
                                                                }
                                                            ]
                                                        }]
                                                    },
                                                    {
                                                        'name': 'addSearchRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '查询',
                                                        'action': 'SEARCH',
                                                        'actionType': 'addSearchRow',
                                                        'actionName': 'addSearchRow',
                                                    },
                                                    {
                                                        'name': 'cancelSearchRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消查询',
                                                        'action': 'SEARCH',
                                                        'actionType': 'cancelSearchRow',
                                                        'actionName': 'cancelSearchRow',
                                                    },
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
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'input',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'inputType': 'text',
                                                                'name': 'name',
                                                                'label': '名称',
                                                                'isRequired': true,
                                                                'placeholder': '请输入建模名称',
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
                                                                'name': 'tableName',
                                                                'label': '表名',
                                                                'isRequired': true,
                                                                'placeholder': '请输入表名',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入表名'
                                                                    }
                                                                ]
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
                                                                'name': 'isEnabled',
                                                                'label': '是否有效',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isNeedDeploy',
                                                                'label': '是否发布',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'belongPlatformType',
                                                                'label': '平台类型',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '配置平台',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '运行平台',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '通用',
                                                                        'value': '3',
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
                                                                'name': 'comments',
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
                                                                'url': 'common/ComTabledata',
                                                                'params': [


                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableName',
                                                                        type: 'componentValue',
                                                                        valueName: 'tableName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableType',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: '1'
                                                                    },

                                                                    {
                                                                        name: 'parentTableId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'parentTableName ',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isHavaDatalink',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnName',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNeedDeploy',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNeedDeploy',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'belongPlatformType',
                                                                        type: 'componentValue',
                                                                        valueName: 'belongPlatformType',
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
                                                                'url': 'common/ComTabledata',
                                                                'params': [

                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableName',
                                                                        type: 'componentValue',
                                                                        valueName: 'tableName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableType',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: '1'
                                                                    },

                                                                    {
                                                                        name: 'parentTableId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'parentTableName ',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isHavaDatalink',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnName',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNeedDeploy',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNeedDeploy',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'belongPlatformType',
                                                                        type: 'componentValue',
                                                                        valueName: 'belongPlatformType',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {'name': 'reset', 'text': '重置'},
                                                    {'name': 'close', 'text': '关闭'}
                                                ],

                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'updateShowCase',
                                                'title': '编辑',
                                                'width': '600',
                                                'ajaxConfig': {
                                                    'url': 'common/ComTabledata',
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
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'input',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'inputType': 'text',
                                                                'name': 'name',
                                                                'label': '名称',
                                                                'isRequired': true,
                                                                'placeholder': '请输入建模名称',
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
                                                                'name': 'tableName',
                                                                'label': '表名',
                                                                'isRequired': true,
                                                                'placeholder': '请输入表名',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入表名'
                                                                    }
                                                                ]
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
                                                                'name': 'isEnabled',
                                                                'label': '是否有效',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isNeedDeploy',
                                                                'label': '是否发布',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'belongPlatformType',
                                                                'label': '平台类型',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '配置平台',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '运行平台',
                                                                        'value': '2',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '通用',
                                                                        'value': '3',
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
                                                                'name': 'comments',
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
                                                                'url': 'common/ComTabledata',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'tempValue',
                                                                        valueName: '_id',
                                                                        value: ''
                                                                    },

                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableName',
                                                                        type: 'componentValue',
                                                                        valueName: 'tableName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableType',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: '1'
                                                                    },

                                                                    {
                                                                        name: 'parentTableId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'parentTableName ',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isHavaDatalink',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnId',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'subRefParentColumnName',
                                                                        type: 'value',
                                                                        valueName: '',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNeedDeploy',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNeedDeploy',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'belongPlatformType',
                                                                        type: 'componentValue',
                                                                        valueName: 'belongPlatformType',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {'name': 'close', 'class': 'editable-add-btn', 'text': '关闭'},
                                                    {'name': 'reset', 'class': 'editable-add-btn', 'text': '重置'}
                                                ],
                                                'dataList': [],
                                            }
                                        ],
                                        'dataSet': []
                                    },
                                    permissions: {
                                        'viewId': 'parentTable',
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
            },
            {
                row: {
                    cols: [
                        {
                            id: 'area2',
                            title: '建模列',
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
                                        'viewId': 'childTable',
                                        'component': 'bsnTable',
                                        'keyId': 'Id',
                                        'size': 'small',
                                        'showCheckBox': true,
                                        'pagination': true, // 是否分页
                                        'showTotal': true, // 是否显示总数据量
                                        'pageSize': 5, // 默认每页数据条数
                                        'pageSizeOptions': [5, 10, 20, 30, 40, 50],
                                        'ajaxConfig': {
                                            'url': 'common/ComColumndata',
                                            'ajaxType': 'get',
                                            'params': [
                                                {name: 'tableId', type: 'tempValue', valueName: '_parentId', value: ''},
                                                {
                                                    name: '_sort',
                                                    type: 'value',
                                                    valueName: '',
                                                    value: 'orderCode asc'
                                                },
                                                {
                                                    name: 'operStatus',
                                                    type: 'value',
                                                    valueName: '',
                                                    value: 'ne(2)'
                                                }
                                            ]
                                        },
                                        'componentType': {
                                            'parent': false,
                                            'child': true,
                                            'own': false
                                        },
                                        'relations': [{
                                            'relationViewId': 'parentTable',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                                {pid: 'Id', cid: '_parentId'}
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
                                                title: '名称', field: 'name', width: 80,
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'name',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '列名', field: 'columnName', width: 80,
                                                showFilter: false, showSort: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'columnName',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '数据类型', field: 'columnType', width: 80, hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'columnType',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'columnType',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '130px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': 'string',
                                                        'options': [

                                                            {
                                                                'label': '字符串',
                                                                'value': 'string',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '整型',
                                                                'value': 'integer',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '日期',
                                                                'value': 'date',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '布尔值',
                                                                'value': 'boolean',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '浮点型',
                                                                'value': 'double',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '字符大字段',
                                                                'value': 'clob',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '二进制大字段',
                                                                'value': 'blob',
                                                                'disabled': false
                                                            },
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '字段长度', field: 'length', width: 80, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'length',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '数据精度', field: 'precision', width: 80, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'precision',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '默认值', field: 'defaultValue', width: 80, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'defaultValue',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否唯一', field: 'isUnique', width: 60, hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'isUnique',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'isUnique',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '60px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': '0',
                                                        'options': [
                                                            {
                                                                'label': '是',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '否',
                                                                'value': '0',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否为空', field: 'isNullabled', width: 60, hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'isNullabled',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'isNullabled',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '60px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': 1,
                                                        'options': [
                                                            {
                                                                'label': '是',
                                                                'value': 1,
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '否',
                                                                'value': 0,
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '是否数据字典', field: 'isDataDictionary', width: 60, hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'isDataDictionary',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'columnType',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '60px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': '0',
                                                        'options': [
                                                            {
                                                                'label': '是',
                                                                'value': '1',
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '否',
                                                                'value': '0',
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: '数据字典编码', field: 'dataDictionaryCode', width: 80, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'dataDictionaryCode',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },
                                            {
                                                title: '排序', field: 'orderCode', width: 60, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'orderCode',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            },

                                            {
                                                title: '是否有效', field: 'isEnabled', width: 60, hidden: false,
                                                showFilter: true, showSort: true,
                                                editor: {
                                                    type: 'select',
                                                    field: 'isEnabled',
                                                    options: {
                                                        'type': 'select',
                                                        'labelSize': '6',
                                                        'controlSize': '18',
                                                        'inputType': 'submit',
                                                        'name': 'isEnabled',
                                                        'label': 'Type',
                                                        'notFoundContent': '',
                                                        'selectModel': false,
                                                        'showSearch': true,
                                                        'placeholder': '-请选择-',
                                                        'disabled': false,
                                                        'size': 'default',
                                                        'clear': true,
                                                        'width': '60px',
                                                        'dataSet': 'TypeName',
                                                        'defaultValue': 1,
                                                        'options': [
                                                            {
                                                                'label': '是',
                                                                'value': 1,
                                                                'disabled': false
                                                            },
                                                            {
                                                                'label': '否',
                                                                'value': 0,
                                                                'disabled': false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {

                                                title: '备注', field: 'comments', width: 100, hidden: false,
                                                editor: {
                                                    type: 'input',
                                                    field: 'comments',
                                                    options: {
                                                        'type': 'input',
                                                        'labelSize': '6',
                                                        'controlSize': '6',
                                                        'inputType': 'text',
                                                    }
                                                }
                                            }

                                        ],
                                        'toolbar': [
                                            {
                                                group: [

                                                    {
                                                        'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新'
                                                    },
                                                    {
                                                        'name': 'addRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '新增',
                                                        'action': 'CREATE'
                                                    },
                                                    {
                                                        'name': 'updateRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '修改',
                                                        'action': 'EDIT'
                                                    },
                                                    {
                                                        'name': 'deleteRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '删除',
                                                        'action': 'DELETE',
                                                        'ajaxConfig': {
                                                            delete: [{
                                                                'actionName': 'delete',
                                                                'url': 'common/ComColumndata',
                                                                'ajaxType': 'delete'
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'saveRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '保存',
                                                        'action': 'SAVE',
                                                        'type': 'method/action',
                                                        'ajaxConfig': {
                                                            post: [{
                                                                'actionName': 'add',
                                                                'url': 'common/ComColumndata',
                                                                'ajaxType': 'post',
                                                                'params': [
                                                                    {
                                                                        name: 'tableId',
                                                                        type: 'tempValue',
                                                                        valueName: '_parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnName',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnType',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnType',
                                                                        value: '1'
                                                                    },
                                                                    {
                                                                        name: 'length',
                                                                        type: 'componentValue',
                                                                        valueName: 'length',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'precision',
                                                                        type: 'componentValue',
                                                                        valueName: 'precision',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'defaultValue',
                                                                        type: 'componentValue',
                                                                        valueName: 'defaultValue',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isUnique',
                                                                        type: 'componentValue',
                                                                        valueName: 'isUnique',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNullabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNullabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isDataDictionary',
                                                                        type: 'componentValue',
                                                                        valueName: 'isDataDictionary',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'dataDictionaryCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'dataDictionaryCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'orderCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'orderCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    }
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
                                                                'url': 'common/ComColumndata',
                                                                'ajaxType': 'put',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'componentValue',
                                                                        valueName: 'Id',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableId',
                                                                        type: 'tempValue',
                                                                        valueName: '_parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnName',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnType',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnType',
                                                                        value: '1'
                                                                    },
                                                                    {
                                                                        name: 'length',
                                                                        type: 'componentValue',
                                                                        valueName: 'length',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'precision',
                                                                        type: 'componentValue',
                                                                        valueName: 'precision',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'defaultValue',
                                                                        type: 'componentValue',
                                                                        valueName: 'defaultValue',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isUnique',
                                                                        type: 'componentValue',
                                                                        valueName: 'isUnique',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNullabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNullabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isDataDictionary',
                                                                        type: 'componentValue',
                                                                        valueName: 'isDataDictionary',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'dataDictionaryCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'dataDictionaryCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'orderCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'orderCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {
                                                        'name': 'cancelRow',
                                                        'class': 'editable-add-btn',
                                                        'text': '取消',
                                                        'action': 'CANCEL',
                                                    },
                                                    {
                                                        'name': 'addForm',
                                                        'class': 'editable-add-btn',
                                                        'text': '弹出新增表单',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'addShowCase',
                                                        'type': 'showForm'
                                                    },
                                                    {
                                                        'name': 'editForm',
                                                        'class': 'editable-add-btn',
                                                        'text': '弹出编辑表单',
                                                        'action': 'FORM',
                                                        'actionType': 'formDialog',
                                                        'actionName': 'updateShowCase',
                                                        'type': 'showForm'
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
                                                'componentType': {
                                                    'parent': false,
                                                    'child': false,
                                                    'own': true
                                                },
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'input',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'inputType': 'text',
                                                                'name': 'name',
                                                                'label': '名称',
                                                                'isRequired': true,
                                                                'placeholder': '请输入列名称',
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
                                                                        'errorMessage': '请输入列名称!!!!'
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
                                                                'name': 'columnName',
                                                                'label': '字段名',
                                                                'isRequired': true,
                                                                'placeholder': '字段名',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入字段名'
                                                                    }
                                                                ]
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
                                                                'name': 'columnType',
                                                                'label': '字段数据类型',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [

                                                                    {
                                                                        'label': '字符串',
                                                                        'value': 'string',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '整型',
                                                                        'value': 'integer',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '日期',
                                                                        'value': 'date',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '布尔值',
                                                                        'value': 'boolean',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '浮点型',
                                                                        'value': 'double',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '字符大字段',
                                                                        'value': 'clob',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '二进制大字段',
                                                                        'value': 'blob',
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
                                                                'name': 'length',
                                                                'label': '字段长度',
                                                                'isRequired': true,
                                                                'placeholder': '字段长度',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入字段长度'
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
                                                                'name': 'precision',
                                                                'label': '字段精度',
                                                                // 'isRequired': true,
                                                                'placeholder': '字段精度',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入字段精度'
                                                                 }
                                                                 ] */
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
                                                                'name': 'defaultValue',
                                                                'label': '默认值',
                                                                // 'isRequired': true,
                                                                'placeholder': '默认值',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /* 'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入默认值'
                                                                 }
                                                                 ] */
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
                                                                'name': 'isUnique',
                                                                'label': '是否唯一',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isNullabled',
                                                                'label': '是否为空',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isDataDictionary',
                                                                'label': '是否数据字典',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'dataDictionaryCode',
                                                                'label': '数据字典编码',
                                                                // 'isRequired': true,
                                                                'placeholder': '数据字典编码',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入数据字典编码'
                                                                 }
                                                                 ] */
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
                                                                'name': 'orderCode',
                                                                'label': '排序',
                                                                // 'isRequired': true,
                                                                'placeholder': '排序',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入数据字典编码'
                                                                 }
                                                                 ] */
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
                                                                'name': 'isEnabled',
                                                                'label': '是否有效',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'comments',
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
                                                                'url': 'common/ComColumndata',
                                                                'params': [
                                                                    {
                                                                        name: 'tableId',
                                                                        type: 'tempValue',
                                                                        valueName: '_parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnName',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnType',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnType',
                                                                        value: '1'
                                                                    },
                                                                    {
                                                                        name: 'length',
                                                                        type: 'componentValue',
                                                                        valueName: 'length',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'precision',
                                                                        type: 'componentValue',
                                                                        valueName: 'precision',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'defaultValue',
                                                                        type: 'componentValue',
                                                                        valueName: 'defaultValue',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isUnique',
                                                                        type: 'componentValue',
                                                                        valueName: 'isUnique',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNullabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNullabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isDataDictionary',
                                                                        type: 'componentValue',
                                                                        valueName: 'isDataDictionary',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'dataDictionaryCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'dataDictionaryCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'orderCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'orderCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
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
                                                                'url': 'common/ComColumndata',
                                                                'params': [

                                                                    {
                                                                        name: 'tableId',
                                                                        type: 'tempValue',
                                                                        valueName: '_parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnName',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnType',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnType',
                                                                        value: '1'
                                                                    },
                                                                    {
                                                                        name: 'length',
                                                                        type: 'componentValue',
                                                                        valueName: 'length',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'precision',
                                                                        type: 'componentValue',
                                                                        valueName: 'precision',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'defaultValue',
                                                                        type: 'componentValue',
                                                                        valueName: 'defaultValue',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isUnique',
                                                                        type: 'componentValue',
                                                                        valueName: 'isUnique',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNullabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNullabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isDataDictionary',
                                                                        type: 'componentValue',
                                                                        valueName: 'isDataDictionary',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'dataDictionaryCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'dataDictionaryCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'orderCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'orderCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {'name': 'reset', 'text': '重置'},
                                                    {'name': 'close', 'text': '关闭'}
                                                ],

                                            },
                                            {
                                                'keyId': 'Id',
                                                'name': 'updateShowCase',
                                                'title': '编辑',
                                                'width': '600',
                                                'ajaxConfig': {
                                                    'url': 'common/ComColumndata',
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
                                                'forms': [
                                                    {
                                                        controls: [
                                                            {
                                                                'type': 'input',
                                                                'labelSize': '6',
                                                                'controlSize': '16',
                                                                'inputType': 'text',
                                                                'name': 'name',
                                                                'label': '名称',
                                                                'isRequired': true,
                                                                'placeholder': '请输入列名称',
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
                                                                        'errorMessage': '请输入列名称!!!!'
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
                                                                'name': 'columnName',
                                                                'label': '字段名',
                                                                'isRequired': true,
                                                                'placeholder': '字段名',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入字段名'
                                                                    }
                                                                ]
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
                                                                'name': 'columnType',
                                                                'label': '字段数据类型',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [

                                                                    {
                                                                        'label': '字符串',
                                                                        'value': 'string',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '整型',
                                                                        'value': 'integer',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '日期',
                                                                        'value': 'date',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '布尔值',
                                                                        'value': 'boolean',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '浮点型',
                                                                        'value': 'double',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '字符大字段',
                                                                        'value': 'clob',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '二进制大字段',
                                                                        'value': 'blob',
                                                                        'disabled': false
                                                                    },
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
                                                                'name': 'length',
                                                                'label': '字段长度',
                                                                'isRequired': true,
                                                                'placeholder': '字段长度',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                'validations': [
                                                                    {
                                                                        'validator': 'required',
                                                                        'errorMessage': '请输入字段长度'
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
                                                                'name': 'precision',
                                                                'label': '字段精度',
                                                                // 'isRequired': true,
                                                                'placeholder': '字段精度',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入字段精度'
                                                                 }
                                                                 ] */
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
                                                                'name': 'defaultValue',
                                                                'label': '默认值',
                                                                // 'isRequired': true,
                                                                'placeholder': '默认值',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /* 'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入默认值'
                                                                 }
                                                                 ] */
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
                                                                'name': 'isUnique',
                                                                'label': '是否唯一',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isNullabled',
                                                                'label': '是否为空',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'isDataDictionary',
                                                                'label': '是否数据字典',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'dataDictionaryCode',
                                                                'label': '数据字典编码',
                                                                // 'isRequired': true,
                                                                'placeholder': '数据字典编码',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入数据字典编码'
                                                                 }
                                                                 ] */
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
                                                                'name': 'orderCode',
                                                                'label': '排序',
                                                                // 'isRequired': true,
                                                                'placeholder': '排序',
                                                                'perfix': 'anticon anticon-edit',
                                                                'disabled': false,
                                                                'readonly': false,
                                                                'size': 'default',
                                                                'layout': 'column',
                                                                'span': '24',
                                                                /*  'validations': [
                                                                 {
                                                                 'validator': 'required',
                                                                 'errorMessage': '请输入数据字典编码'
                                                                 }
                                                                 ] */
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
                                                                'name': 'isEnabled',
                                                                'label': '是否有效',
                                                                'notFoundContent': '',
                                                                'selectModel': false,
                                                                'showSearch': true,
                                                                'placeholder': '--请选择--',
                                                                'disabled': false,
                                                                'size': 'default',
                                                                'options': [
                                                                    {
                                                                        'label': '是',
                                                                        'value': '1',
                                                                        'disabled': false
                                                                    },
                                                                    {
                                                                        'label': '否',
                                                                        'value': '0',
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
                                                                'name': 'comments',
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
                                                                'url': 'common/ComColumndata',
                                                                'params': [
                                                                    {
                                                                        name: 'Id',
                                                                        type: 'tempValue',
                                                                        valueName: '_id',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'tableId',
                                                                        type: 'tempValue',
                                                                        valueName: '_parentId',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'name',
                                                                        type: 'componentValue',
                                                                        valueName: 'name',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnName',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnName',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'columnType',
                                                                        type: 'componentValue',
                                                                        valueName: 'columnType',
                                                                        value: '1'
                                                                    },
                                                                    {
                                                                        name: 'length',
                                                                        type: 'componentValue',
                                                                        valueName: 'length',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'precision',
                                                                        type: 'componentValue',
                                                                        valueName: 'precision',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'defaultValue',
                                                                        type: 'componentValue',
                                                                        valueName: 'defaultValue',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isUnique',
                                                                        type: 'componentValue',
                                                                        valueName: 'isUnique',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isNullabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isNullabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isDataDictionary',
                                                                        type: 'componentValue',
                                                                        valueName: 'isDataDictionary',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'dataDictionaryCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'dataDictionaryCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'orderCode',
                                                                        type: 'componentValue',
                                                                        valueName: 'orderCode',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'isEnabled',
                                                                        type: 'componentValue',
                                                                        valueName: 'isEnabled',
                                                                        value: ''
                                                                    },
                                                                    {
                                                                        name: 'comments',
                                                                        type: 'componentValue',
                                                                        valueName: 'comments',
                                                                        value: ''
                                                                    }
                                                                ]
                                                            }]
                                                        }
                                                    },
                                                    {'name': 'close', 'class': 'editable-add-btn', 'text': '关闭'},
                                                    {'name': 'reset', 'class': 'editable-add-btn', 'text': '重置'}
                                                ],
                                                'dataList': [],
                                            }
                                        ],
                                        'dataSet': []
                                    },
                                    permissions: {
                                        'viewId': 'childTable',
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
    };

    constructor(private http: _HttpClient) {
    }

    ngOnInit() {
    }

}

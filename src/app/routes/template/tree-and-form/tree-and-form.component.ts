import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
    selector: 'app-tree-and-form',
    templateUrl: './tree-and-form.component.html',
})
export class TreeAndFormComponent implements OnInit {

    constructor(private http: _HttpClient) { }

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }

    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            title: '左树',
                            span: 6,
                            size: {
                                nzXs: 6,
                                nzSm: 6,
                                nzMd: 6,
                                nzLg: 6,
                                ngXl: 6
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_form_tree',
                                        'component': 'bsnAsyncTree',
                                        'asyncData': true, //
                                        'expandAll': false, //
                                        'checkable': false,  //    在节点之前添加一个复选框 false
                                        'showLine': false,  //   显示连接线 fal
                                        'columns': [ // 字段映射，映射成树结构所需
                                            { title: '主键', field: 'key', valueName: 'Id' },
                                            { title: '父节点', field: 'parentId', valueName: 'parentId' },
                                            { title: '标题', field: 'title', valueName: 'caseName' },
                                        ],
                                        'componentType': {
                                            'parent': true,
                                            'child': false,
                                            'own': false
                                        },
                                        'parent': [
                                            { name: 'parentId', type: 'value', valueName: '', value: 'null' }
                                        ],
                                        'ajaxConfig': {
                                            'url': 'common/ShowCase',
                                            'ajaxType': 'get',
                                            'params': [
                                                { name: 'parentId', type: 'componentValue', valueName: '', value: 'null' }
                                            ]
                                        },
                                        'expand': [
                                            {
                                                'type': false,
                                                'ajaxConfig': {
                                                    'url': 'common/ShowCase',
                                                    'ajaxType': 'get',
                                                    'params': [
                                                        { name: 'parentId', type: 'componentValue', valueName: '', value: '' }
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
                            id: 'area2',
                            title: '右表单',
                            span: 18,
                            size: {
                                nzXs: 18,
                                nzSm: 18,
                                nzMd: 18,
                                nzLg: 18,
                                ngXl: 18
                            },
                            viewCfg: [
                                {
                                    config: {
                                        'viewId': 'tree_and_form_form',
                                        'component': 'form_view',
                                        'keyId': 'Id',
                                        ajaxConfig: {
                                            'url': 'common/ShowCase',
                                            'ajaxType': 'getById',
                                            'params': [
                                                { name: 'Id', type: 'tempValue', valueName: '_id', value: '' }
                                            ]
                                        },
                                        componentType: {
                                            'parent': false,
                                            'child': true,
                                            'own': false
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
                                                    'name': 'cancelForm', 'type': 'default', 'text': '取消'
                                                }
                                            ]
                                        },
                                        'dataList': [],
                                        'relations': [{
                                            'relationViewId': 'tree_and_form_tree',
                                            'cascadeMode': 'REFRESH_AS_CHILD',
                                            'params': [
                                              {
                                                pid: 'Id', cid: '_id'
                                              }
                                            ]
                                          }]
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




}

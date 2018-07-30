import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
//   import { CommonUtility } from '@core/utility/Common-utility';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { RelativeService } from '@core/relative-Service/relative-service';
import { concat } from 'rxjs/operators';

@Component({
    selector: 'app-component-setting',
    templateUrl: './component-setting.component.html',
})
export class ComponentSettingComponent implements OnInit {
    @ViewChild('editor') editor: CnCodeEditComponent;
    _funcOptions = [];
    _funcValue;
    _layoutValue;
    _selectedModuleText;
    //   布局列表数据
    _layoutList = [];
    _editorConfig = {
        title: '标题 1',
        rows: [
            {
                row: {
                    cols: [
                        {
                            title: '区域1',
                            span: 24,
                            size: {
                                nzXs: 24,
                                nzSm: 24,
                                nzMd: 24,
                                nzLg: 24,
                                ngXl: 24
                            },
                            tabs: [
                                {
                                    title: '数据源设置',
                                    icon: '',
                                    active: false,
                                    viewCfg: [
                                        {
                                            'viewId': 'code_edit',
                                            'component': 'code_edit',
                                            'config': {

                                            }
                                        },
                                        {
                                            tabs: [
                                                {
                                                    title: '字段列表',
                                                    icon: '',
                                                    active: false,
                                                    viewCfg: [{
                                                        'viewId': 'operation_sqlColumns1',
                                                        'component': 'bsnDataTable',
                                                        'config': {
                                                            'keyId': 'key',
                                                            'nzIsPagination': false,  //   是否分页
                                                            'nzShowTotal': true, //   是否显示总数据量
                                                            'pageSize': 5,  //  默认每页数据条数
                                                            'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                                                            'nzLoading': false,  //   是否显示加载中
                                                            'nzBordered': false, //   是否显示边框
                                                            'columns': [
                                                                {
                                                                    title: '主键', field: 'key', width: 80, hidden: true, editor: {
                                                                        type: 'input',
                                                                        field: 'key',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '字段名称', field: 'fieldName', width: 80,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'fieldName',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '标题', field: 'title', width: 80,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'title',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '数据类型', field: 'dataTypeName', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'dataType',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'name': 'sex',
                                                                            'label': '性别',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '60px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '字符',
                                                                                    'value': '字符'
                                                                                },
                                                                                {
                                                                                    'label': '数值',
                                                                                    'value': '数值'
                                                                                },
                                                                                {
                                                                                    'label': '时间',
                                                                                    'value': '时间'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '展示样式', field: 'displayStyleName', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'displayStyle',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '60px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '居中',
                                                                                    'value': '居中'
                                                                                },
                                                                                {
                                                                                    'label': '左对齐',
                                                                                    'value': '左对齐'
                                                                                },
                                                                                {
                                                                                    'label': '右对齐',
                                                                                    'value': '右对齐'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '是否显示', field: 'isShowName', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'isShow',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '60px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '显示',
                                                                                    'value': '1',
                                                                                    'disabled': false
                                                                                },
                                                                                {
                                                                                    'label': '隐藏',
                                                                                    'value': '2',
                                                                                    'disabled': false
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },

                                                                {
                                                                    title: '排序', field: 'order', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'order',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                { title: '数据类型', field: 'dataType', width: 80, hidden: true, },
                                                                { title: '展示样式', field: 'displayStyle', width: 80, hidden: true, },
                                                                { title: '是否显示', field: 'isShow', width: 80, hidden: true, },

                                                            ],
                                                            'toolbar': [
                                                                { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                                                                { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                                                                { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                                                                { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                                                                { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                                                                { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                                                            ]
                                                        },
                                                        'dataList': []
                                                    }]
                                                },
                                                {
                                                    title: '参数列表',
                                                    icon: '',
                                                    active: false,
                                                    viewCfg: [{
                                                        'viewId': 'operation_sqlColumns1',
                                                        'component': 'bsnDataTable',
                                                        'config': {
                                                            'keyId': 'key',
                                                            'nzIsPagination': false,  //   是否分页
                                                            'nzShowTotal': true, //   是否显示总数据量
                                                            'pageSize': 5,  //  默认每页数据条数
                                                            'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                                                            'nzLoading': false,  //   是否显示加载中
                                                            'nzBordered': false, //   是否显示边框
                                                            'columns': [
                                                                {
                                                                    title: '主键', field: 'key', width: 80, hidden: true, editor: {
                                                                        type: 'input',
                                                                        field: 'key',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '参数名', field: 'parameterName', width: 80,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'parameterName',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '参数替换字符串', field: 'parametersReplace', width: 80,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'parametersReplace',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '取值方式', field: 'methodOfValue', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'methodOfValue',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '90px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '系统生成序号',
                                                                                    'value': '系统生成序号'
                                                                                },
                                                                                {
                                                                                    'label': '页面字段取当前值',
                                                                                    'value': '页面字段取当前值'
                                                                                },
                                                                                {
                                                                                    'label': '页面字段取原值',
                                                                                    'value': '页面字段取原值'
                                                                                },
                                                                                {
                                                                                    'label': '从系统参数取值',
                                                                                    'value': '从系统参数取值'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '为空取值', field: 'emptyValue', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'emptyValue',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '90px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '取数据库空值',
                                                                                    'value': '取数据库空值'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '参数类型', field: 'parameterType', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'parameterType',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '60px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '字符',
                                                                                    'value': '字符'
                                                                                },
                                                                                {
                                                                                    'label': '日期',
                                                                                    'value': '日期'
                                                                                },
                                                                                {
                                                                                    'label': '数值',
                                                                                    'value': '数值'
                                                                                },
                                                                                {
                                                                                    'label': '布尔',
                                                                                    'value': '布尔'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '系统参数', field: 'systemParameter', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'select',
                                                                        field: 'systemParameter',
                                                                        options: {
                                                                            'type': 'select',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'submit',
                                                                            'notFoundContent': '',
                                                                            'selectModel': false,
                                                                            'showSearch': true,
                                                                            'placeholder': '-请选择-',
                                                                            'disabled': false,
                                                                            'size': 'default',
                                                                            'clear': true,
                                                                            'width': '90px',
                                                                            'options': [
                                                                                {
                                                                                    'label': '用户id',
                                                                                    'value': '用户id'
                                                                                },
                                                                                {
                                                                                    'label': '部门id',
                                                                                    'value': '部门id'
                                                                                },
                                                                                {
                                                                                    'label': '角色',
                                                                                    'value': '角色'
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    title: '取值或赋值字段名', field: 'valueField', width: 80, hidden: false,
                                                                    editor: {
                                                                        type: 'input',
                                                                        field: 'valueField',
                                                                        options: {
                                                                            'type': 'input',
                                                                            'labelSize': '6',
                                                                            'controlSize': '10',
                                                                            'inputType': 'text',
                                                                        }
                                                                    }
                                                                }
                                                            ],
                                                            'toolbar': [
                                                                { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                                                                { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                                                                { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                                                                { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                                                                { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                                                                { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                                                            ]
                                                        },
                                                        'dataList': []
                                                    }]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title: '属性设置',
                                    icon: '',
                                    active: false,
                                    viewCfg: [
                                        {
                                            'viewId': 'attribute',
                                            'component': 'form_view',
                                            'config': [
                                                {
                                                    'type': 'input',
                                                    'labelSize': '6',
                                                    'controlSize': '10',
                                                    'inputType': 'text',
                                                    'name': 'userName',
                                                    'label': '用户姓名',
                                                    'placeholder': '例如：Company.cn.app',
                                                    'disabled': false,
                                                    'readonly': false,
                                                    'size': 'default',
                                                }
                                            ],
                                            'dataList': []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
        ]
    };
    treeData;
    _layoutNameValue;
    constructor(
        private http: _HttpClient,
        private apiService: ApiService,
        private message: NzMessageService,
        private relativeMessage: RelativeService
    ) { }

    async ngOnInit() {
        const fieldIdentity = '123'; //  CommonUtility.uuID(6);
        this.attributeConfig = this.componentdic['bsn-datatable'].attributeConfig;
        this.fildConfig = this.componentdic['bsn-datatable'].viewCfg[0]['config'];
        this.parameterConfig = this._editorConfig.rows[0].row.cols[0].tabs[0].viewCfg[1]['tabs'][1].viewCfg[0]['config'];

        const params = { _select: 'Id,name,parentId' };
        const moduleData = await this.getModuleData(params);
        //   初始化模块列表，将数据加载到及联下拉列表当中
        this._funcOptions = this.arrayToTree(moduleData.data, null);
    }
    _loadLayoutData($event) {

    }
    //   获取布局设置列表
    getLayoutConfigData(params) {
        return this.apiService.get('common/LayoutSetting', params).toPromise();
    }

    //   获取模块信息
    async getModuleData(params) {
        return this.apiService.get('common/ComProjectModule', params).toPromise();
    }

    // 布局块
    async getBlockConfigData(layoutId) {
        return this.apiService.get('common/GetComptTree', {LayoutId: layoutId}).toPromise();
        
    }

    //   选择布局名称
    async  _changeLayoutName($event) {
        //   创建布局
        const backdata = await this.getBlockConfigData($event.id);
        const  columns = [
            {title: '主键', field: 'key',  valueName: 'Id'},
            {title: '父节点', field: 'parentId',  valueName: 'parentId'},
            {title: '标题', field: 'title',  valueName: 'title'},
        ];
        const TotreeBefore = backdata.data;
        TotreeBefore.map(data => {
            columns.forEach(col => {
                data[col['field']] = data[col['valueName']];
            });
        });
        const treeDataJson = this.listToTreeData(TotreeBefore, this._funcValue[this._funcValue.length - 1]);
        
        this.treeData = treeDataJson;
        const topNode = new NzTreeNode({title: this._selectedModuleText, key: '0'});
        topNode.addChildren(treeDataJson);
        this.treeData = [topNode];
    }

    listToTreeData(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
               
                temp = this.listToTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]['children'] = temp;
                } else {
                    data[i]['isLeaf'] = true;
                }
                result.push( new NzTreeNode(data[i]));
            }
        }
        return result;
    }
    tree_Config = {
        'viewId': 'component_viewId_tree',
        'asyncData': true, // 
        'expandAll': true, //  
        'checkable': false,  //    在节点之前添加一个复选框 false
        'showLine': false,  //   显示连接线 fal
        'columns': [ // 字段映射，映射成树结构所需
            {title: '主键', field: 'key',  valueName: 'Id'},
            {title: '父节点', field: 'parentId',  valueName: 'parentId'},
            {title: '标题', field: 'title',  valueName: 'title'},
        ],
        'parent': [
            { name: 'parentId', type: 'value', valueName: '取值参数名称', value: '05369c6ce6564d5eb3f044d0dfaaa689' }
        ],
        'ajaxConfig': {
            'url': 'BlockSetting',
            'ajaxType': 'get',
            'params': [
                { name: 'layoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }                
            ]
        },
        'relations': [{
            'relationViewId': 'component_viewId_tree',
            'relationSendContent': [
              {
                'name': 'clickNode',
                'sender': 'viewId_tree',
                'aop': 'after',
                'receiver': 'operation_sqlColumns',
                'relationData': {
                  'name': 'initParameter',
                  'params': [
                    { 'pid': 'key', 'cid': '_parentId' }
                  ]
                },
              }
            ],
            'relationReceiveContent': []
          }]
      };

    onMouseAction(actionName, $event) {
        console.log('点击树节点事件', actionName);
        console.log('点击树节点数据', $event);
       // this[actionName]($event);
    }

    async  getComponentByLayout(layoutId?) {
        const params = {
            ParentId: layoutId
        };
        return this.apiService.getProj(APIResource.AppConfigPack, params).toPromise();
    }


    //   改变模块选项
    _changeModuleValue($event?) {
        this._layoutList = [];
        //   选择功能模块，首先加载服务端配置列表
        if (this._funcValue.length > 0) {
            const params = {
                moduleId: this._funcValue[this._funcValue.length - 1],
                _select: 'Id,name,metadata'
            };
            this.getLayoutConfigData(params).then(serverLayoutData => {
                if (serverLayoutData.isSuccess && serverLayoutData.data.length > 0) {
                    serverLayoutData.data.forEach((data) => {
                        const metadata = JSON.parse(data.metadata);
                        this._layoutList.push({ label: data.name, value: { id: data.Id, metadata: metadata } });
                    });
                } else {
                    this._layoutList = [];
                }
            });
        }
    }
    _onSelectionChange(selectedOptions: any[]) {
        this._selectedModuleText = `【${selectedOptions.map(o => o.label).join(' / ')}】`;
    }

    arrayToTree(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const obj = { 'label': data[i].name, 'value': data[i].Id };
                temp = this.arrayToTree(data, data[i].Id);
                if (temp.length > 0) {
                    obj['children'] = temp;
                } else {
                    obj['isLeaf'] = true;
                }
                result.push(obj);
            }
        }
        return result;
    }

    treeconfig = {
        asyncData: true, // 
        expandAll: true, //  
        checkable: false,  //    在节点之前添加一个复选框 false
        showLine: false,  //   显示连接线 false
    };
    /**
     * 保存sql
     * @param data
     */
    async saveSql(data?) {
        //  保存sql前需要做判断，
        //  1.功能模块，布局选取。
        //  2.布局组件树选中节点是
        const sql = this.editor.getValue();
        //   const saveSqlStr=await this.saveSqlByApi(sql);
        //   const updateSqlStr=await this.updateSqlByApi(sql,'f4fa067fae1440c4a9ab29d1038add96');
        //   const sqlField=await this.getSqlFiledByApi('f4fa067fae1440c4a9ab29d1038add96');
        console.log('保存sql', sql);
        //    console.log('服务器保存sql',saveSqlStr);
        //   console.log('服务器返回sql',updateSqlStr);
        //    console.log('服务器返回字段',sqlField);
    }


    async  saveSqlByApi(sql?) {
        const params = {
            ScriptText: sql
        };
        return this.apiService.postProj(APIResource.DbCommandConfig, params).toPromise();
    }
    async  updateSqlByApi(sql?, Id?) {
        const params = {
            Id: Id,
            ScriptText: sql
        };
        return this.apiService.putProj(APIResource.DbCommandConfig, params).toPromise();
    }
    /**
     * 获取sql对应的字段描述
     * @param Id
     */
    async  getSqlFiledByApi(Id?) {
        const params = {
            OwnerId: Id
        };
        return this.apiService.getProj(APIResource.EntityPropertyDefine, params).toPromise();
    }

    /**
     * 页面组件渲染数据
     */
    attributeConfig;
    fildConfig;
    parameterConfig;
    dataList = [];
    /**
    点击树节点 */
    onActivate(ev: any) {
        console.log('激活树节点', ev);
        console.log('树节点类型', ev.node.data.type);

        if (ev.node.data.type === 'component') {
            if (ev.node.data.value === 'bsn-datatable') {
                this._editorConfig.rows[0].row.cols[0].tabs[0].viewCfg[1]['tabs'][0].viewCfg
                    = this.componentdic['bsn-datatable'].viewCfg;
                this._editorConfig.rows[0].row.cols[0].tabs[1].viewCfg[0]['config']
                    = this.componentdic['bsn-datatable'].attributeConfig;
                this._editorConfig = JSON.parse(JSON.stringify(this._editorConfig));

                this.attributeConfig = this.componentdic['bsn-datatable'].attributeConfig;
                this.fildConfig = this.componentdic['bsn-datatable'].viewCfg[0]['config'];
                this.parameterConfig = this._editorConfig.rows[0].row.cols[0].tabs[0].viewCfg[1]['tabs'][1].viewCfg[0]['config'];
            }
            if (ev.node.data.value === 'bsn-tree') {
                this._editorConfig.rows[0].row.cols[0].tabs[0].viewCfg[1]['tabs'][0].viewCfg
                    = this.componentdic['bsn-tree'].viewCfg;
                this._editorConfig.rows[0].row.cols[0].tabs[1].viewCfg[0]['config']
                    = this.componentdic['bsn-tree'].attributeConfig;

                this._editorConfig = JSON.parse(JSON.stringify(this._editorConfig));
                this.attributeConfig = this.componentdic['bsn-tree'].attributeConfig;
                this.fildConfig = this.componentdic['bsn-tree'].viewCfg[0]['config'];
                this.parameterConfig = this._editorConfig.rows[0].row.cols[0].tabs[0].viewCfg[1]['tabs'][1].viewCfg[0]['config'];

            }

        }


        const receiver = {
            name: 'initParameters',
            receiver: 'operation_sqlColumns',
            parent: {
                _Id: ev.node.data.id,
                _optType: 'opt_sqlList'
            }
        };
        console.log('选中行发消息事件', receiver);
        this.relativeMessage.sendMessage({ type: 'initParameters' }, receiver);

    }

    _changeValue($event) {
        console.log('功能模块选择', $event);
    }


    /**
     * 组件属性字典
     */
    componentdic = {
        'bsn-datatable': {
            viewCfg: [
                {
                    'viewId': 'operation_sqlColumns1',
                    'component': 'bsnDataTable',
                    'config': {
                        'keyId': 'key',
                        'nzIsPagination': false,  //   是否分页
                        'nzShowTotal': true, //   是否显示总数据量
                        'pageSize': 5,  //  默认每页数据条数
                        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                        'nzLoading': false,  //   是否显示加载中
                        'nzBordered': false, //   是否显示边框
                        'columns': [
                            {
                                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                                    type: 'input',
                                    field: 'key',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '字段名称', field: 'fieldName', width: 80,
                                editor: {
                                    type: 'input',
                                    field: 'fieldName',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '标题', field: 'title', width: 80,
                                editor: {
                                    type: 'input',
                                    field: 'title',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '数据类型', field: 'dataTypeName', width: 80, hidden: false,
                                editor: {
                                    type: 'select',
                                    field: 'dataType',
                                    options: {
                                        'type': 'select',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'submit',
                                        'name': 'sex',
                                        'label': '性别',
                                        'notFoundContent': '',
                                        'selectModel': false,
                                        'showSearch': true,
                                        'placeholder': '-请选择-',
                                        'disabled': false,
                                        'size': 'default',
                                        'clear': true,
                                        'width': '60px',
                                        'options': [
                                            {
                                                'label': '字符',
                                                'value': '字符'
                                            },
                                            {
                                                'label': '数值',
                                                'value': '数值'
                                            },
                                            {
                                                'label': '时间',
                                                'value': '时间'
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                title: '展示样式', field: 'displayStyleName', width: 80, hidden: false,
                                editor: {
                                    type: 'select',
                                    field: 'displayStyle',
                                    options: {
                                        'type': 'select',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'submit',
                                        'notFoundContent': '',
                                        'selectModel': false,
                                        'showSearch': true,
                                        'placeholder': '-请选择-',
                                        'disabled': false,
                                        'size': 'default',
                                        'clear': true,
                                        'width': '60px',
                                        'options': [
                                            {
                                                'label': '居中',
                                                'value': '居中'
                                            },
                                            {
                                                'label': '左对齐',
                                                'value': '左对齐'
                                            },
                                            {
                                                'label': '右对齐',
                                                'value': '右对齐'
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                title: '是否显示', field: 'isShowName', width: 80, hidden: false,
                                editor: {
                                    type: 'select',
                                    field: 'isShow',
                                    options: {
                                        'type': 'select',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'submit',
                                        'notFoundContent': '',
                                        'selectModel': false,
                                        'showSearch': true,
                                        'placeholder': '-请选择-',
                                        'disabled': false,
                                        'size': 'default',
                                        'clear': true,
                                        'width': '60px',
                                        'options': [
                                            {
                                                'label': '显示',
                                                'value': '1',
                                                'disabled': false
                                            },
                                            {
                                                'label': '隐藏',
                                                'value': '2',
                                                'disabled': false
                                            }
                                        ]
                                    }
                                }
                            },

                            {
                                title: '排序', field: 'order', width: 80, hidden: false,
                                editor: {
                                    type: 'input',
                                    field: 'order',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            { title: '数据类型', field: 'dataType', width: 80, hidden: true, },
                            { title: '展示样式', field: 'displayStyle', width: 80, hidden: true, },
                            { title: '是否显示', field: 'isShow', width: 80, hidden: true, },

                        ],
                        'toolbar': [
                            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                            { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                        ]
                    },
                    'dataList': []
                }
            ],
            attributeConfig: [
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'userName',
                    'label': '数据网格名称',
                    'placeholder': '例如：Company.cn.app',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default',
                    'validations': [
                        {
                            'validator': 'required',
                            'errorMessage': '不能为空'
                        },
                        {
                            'validator': 'minlength',
                            'length': 6,
                            'errorMessage': '最小长度为6'
                        }
                    ],
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'sex',
                    'label': '是否分页',
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
                            'value': '2',
                            'disabled': false
                        }
                    ]
                },
            ]
        },
        'bsn-tree': {
            viewCfg: [
                {
                    'viewId': 'operation_sqlColumns1',
                    'component': 'bsnDataTable',
                    'config': {
                        'keyId': 'key',
                        'nzIsPagination': false,  //   是否分页
                        'nzShowTotal': true, //   是否显示总数据量
                        'pageSize': 5,  //  默认每页数据条数
                        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                        'nzLoading': false,  //   是否显示加载中
                        'nzBordered': false, //   是否显示边框
                        'columns': [
                            {
                                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                                    type: 'input',
                                    field: 'key',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '字段名称', field: 'fieldName', width: 80,
                                editor: {
                                    type: 'input',
                                    field: 'fieldName',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '标题', field: 'title', width: 80,
                                editor: {
                                    type: 'input',
                                    field: 'title',
                                    options: {
                                        'type': 'input',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'text',
                                    }
                                }
                            },
                            {
                                title: '数据类型', field: 'dataTypeName', width: 80, hidden: false,
                                editor: {
                                    type: 'select',
                                    field: 'dataType',
                                    options: {
                                        'type': 'select',
                                        'labelSize': '6',
                                        'controlSize': '10',
                                        'inputType': 'submit',
                                        'notFoundContent': '',
                                        'selectModel': false,
                                        'showSearch': true,
                                        'placeholder': '-请选择-',
                                        'disabled': false,
                                        'size': 'default',
                                        'clear': true,
                                        'width': '60px',
                                        'options': [
                                            {
                                                'label': '字符',
                                                'value': '字符'
                                            },
                                            {
                                                'label': '数值',
                                                'value': '数值'
                                            },
                                            {
                                                'label': '时间',
                                                'value': '时间'
                                            }
                                        ]
                                    }
                                }
                            },
                            { title: '数据类型', field: 'dataType', width: 80, hidden: true, },


                        ],
                        'toolbar': [
                            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
                            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
                            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
                            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
                            { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
                            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
                        ]
                    },
                    'dataList': []
                }
            ],
            attributeConfig: [
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'userName',
                    'label': '树组件名称',
                    'placeholder': '例如：Company.cn.app',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default',
                    'validations': [
                        {
                            'validator': 'required',
                            'errorMessage': '不能为空'
                        },
                        {
                            'validator': 'minlength',
                            'length': 6,
                            'errorMessage': '最小长度为6'
                        }
                    ],
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'sex',
                    'label': '是否异步树',
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
                            'value': '2',
                            'disabled': false
                        }
                    ]
                },
            ]
        }
    };


    /**
     * 临时变量 数据列表配置
     */
    tempConfig = {
        'viewId': 'componentsetting_temp',
        'component': 'bsnDataTable',
        'keyId': 'key',
        'nzIsPagination': false,  //   是否分页
        'nzShowTotal': true, //   是否显示总数据量
        'pageSize': 5,  //  默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false,  //   是否显示加载中
        'nzBordered': false, //   是否显示边框
        'columns': [
            {
                title: '主键', field: 'key', width: 80, hidden: true, editor: {
                    type: 'input',
                    field: 'key',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '业务字段名称', field: 'fieldName', width: 80,
                editor: {
                    type: 'input',
                    field: 'fieldName',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '业务字段标题', field: 'title', width: 80,
                editor: {
                    type: 'input',
                    field: 'title',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存' },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' },
            { 'name': 'showDialog', 'class': 'editable-add-btn', 'text': '弹出框' },


        ]
    };
    /**
     * 临时变量值
     */
    tempdataList = [];
}

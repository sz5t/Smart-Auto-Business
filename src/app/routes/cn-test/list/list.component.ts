import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
// import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { RelativeService } from '@core/relative-Service/relative-service';
export interface TreeNodeInterface {
    key: number;
    name: string;
    age: number;
    level: number;
    expand: boolean;
    address: string;
    children?: TreeNodeInterface[];
}
// import { RandomUserService } from '../randomUser.service';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styles: [
        `
    .table-operations {
      margin-bottom: 16px;
    }
    
    .table-operations > button {
      margin-right: 8px;
    }
    .selectedRow{
        color:blue;
    }
        :host ::ng-deep .ant-table-expanded-row > td:last-child {
          padding: 0 48px 0 8px;
        }
  
        :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-thead th {
          border-bottom: 1px solid #e9e9e9;
        }
  
        :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-thead th:first-child {
          padding-left: 0;
        }
  
        :host ::ng-deep .ant-table-expanded-row > td:last-child .ant-table-row td:first-child {
          padding-left: 0;
        }
  
        :host ::ng-deep .ant-table-expanded-row .ant-table-row:last-child td {
          border: none;
        }
  
        :host ::ng-deep .ant-table-expanded-row .ant-table-thead > tr > th {
          background: none;
        }
  
        :host ::ng-deep .table-operation a.operation {
          margin-right: 24px;
        }
      `
    ]
})
export class ListComponent implements OnInit {

    pi = 1;
    ps = 10;
    total = 5; // mock total
    list = [];
    loading = false;
    args: any = {};
    _indeterminate = false;
    _allChecked = false;
    events: any[] = [];

    load(pi?: number) {
        if (typeof pi !== 'undefined') {
            this.pi = pi || 1;
        }

        this.loading = true;
        this._allChecked = false;
        this._indeterminate = false;
        /* this._randomUser.getUsers(this.pi, this.ps, this.args)
            .pipe(
                map(data => {
                    data.results.forEach(item => {
                        item.checked = false;
                        item.price = +((Math.random() * (10000000 - 100)) + 100).toFixed(2);
                    });
                    return data;
                })
            )
            .subscribe(data => {
                this.loading = false;
                this.list = data.results;
            }); */

        this.list = []; // liu
    }

    clear() {
        this.args = {};
        this.load(1);
    }

    _checkAll($event) {
        this.list.forEach(item => item.checked = this._allChecked);
        this.refChecked();
    }
    refChecked() {
        const checkedCount = this.list.filter(w => w.checked).length;
        this._allChecked = checkedCount === this.list.length;
        this._indeterminate = this._allChecked ? false : checkedCount > 0;
    }
    // private _randomUser: RandomUserService,
    constructor(private http: _HttpClient, private message: NzMessageService,
        private modalService: NzModalService,
        //  private relativeMessage: RelativeService

    ) {
    }
    ngOnInit() {
        this.load();
        //  this.http.get('/chart/visit').subscribe((res: any) => this.events = res);
        for (let i = 0; i < 5; i++) {
            this.list.push({
                key: i.toString(),
                name: `Edrward ${i}`,
                age: 32,
                sex: '2',
                sexname: '女',
                address: `London Park no. ${i}`,
                style: ''
            });
        }
        this.updateEditCache();


        for (let i = 0; i < 3; ++i) {
            this.nestedTableData.push({
                key: i,
                name: 'Screem',
                platform: 'iOS',
                version: '10.3.4.5654',
                upgradeNum: 500,
                creator: 'Jack',
                createdAt: '2014-12-24 23:12:00',
                expand: false,
                pp: [{
                    key: i,
                    date: '2014-12-24 23:12:00',
                    name: 'This is production name',
                    upgradeNum: 'Upgraded: 56',
                }]
            });
        }
        /*  for (let i = 0; i < 3; ++i) {
           this.innerTableData.push({
             key       : i,
             date      : '2014-12-24 23:12:00',
             name      : 'This is production name',
             upgradeNum: 'Upgraded: 56',
           });
         } */

        this.data.forEach(item => {
            this.expandDataCache[item.key] = this.convertTreeToList(item);
        });
    }

    showMsg(msg: string) {
        this.message.info(msg);
    }

    /**
     * 行内编辑
     */
    i = 100;
    editCache = {};

    startEdit(key: string): void {
        this.editCache[key].edit = true;
    }

    cancelEdit(key: string): void {
        this.editCache[key].edit = false;
    }

    saveEdit(key: string): void {
        const index = this.list.findIndex(item => item.key === key);
        this.list[index] = this.editCache[key].data;
        this.editCache[key].edit = false;
    }

    deleteEdit(i: string): void {
        const dataSet = this.list.filter(d => d.key !== i);
        this.list = dataSet;
    }
    updateEditCache(): void {
        // const datalist=JSON.parse(JSON.stringify(this.list));
        this.list.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }
    /**排序 */
    sortName = null;
    sortValue = null;
    // sort(sort: { key: string, value: string }): void {
    //     this.sortName = sort.key;
    //     this.sortValue = sort.value;
    //     this.search();
    //   }
    // search(): void {
    //     /** filter data **/
    //     const filterFunc = item => (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) && (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    //     const data = this.data.filter(item => filterFunc(item));
    //     /** sort data **/
    //     if (this.sortName) {
    //       this.list = this.list.sort((a, b) => (this.sortValue === 'ascend') ? (a[ this.sortName ] > b[ this.sortName ] ? 1 : -1) : (b[ this.sortName ] > a[ this.sortName ] ? 1 : -1));
    //     } else {
    //       this.list = this.list;
    //     }
    //   }

    copyData = [...this.list];
    sortMap = {};
    /**
     * 排序 
     */
    sort(sortName, value) {
        this.sortName = sortName;
        this.sortValue = value;
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[key] = null;
            } else {
                this.sortMap[key] = value;
            }
        });
        this.search();
    }
    /**
     * 查询
     */
    search() {

        this.list = [...this.list.sort((a, b) => {
            if (a[this.sortName] > b[this.sortName]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[this.sortName] < b[this.sortName]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        })];
    }

    /**新增 */
    addRow(): void {
        this.i++;
        this.list = [...this.list, {
            key: `${this.i}`,
            name: `Edward King ${this.i}`,
            age: '32',
            sex: '',
            address: `London, Park Lane no. ${this.i}`,
            checked: true,
            style: ''
        }];
        this.updateEditCache();
        this.startEdit(this.i.toString());

    }
    /**修改 */
    updateRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.startEdit(item.key);
            }
        });
    }
    /**删除 */
    deleteRow(): void {
        // this.modalService.confirm({
        //     title: '确认框',
        //     content: '确认要删除？',
        //     onOk: () => {
        //         this.list.forEach(item => {
        //             if (item.checked === true) {
        //                 this.deleteEdit(item.key);
        //             }
        //         });
        //     },
        //     onCancel() {
        //     }
        // });

    }
    /**保存 */
    saveRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.saveEdit(item.key);
            }
        });
    }
    /**取消 */
    cancelRow(): void {
        this.list.forEach(item => {
            if (item.checked === true) {
                this.cancelEdit(item.key);
            }
        });
    }

    /**
     * 选中行
     * @param data 
     * @param edit 
     */
    selectRow(data?, edit?) {

        // data.checked='true'; // 行勾选


        this.list.forEach(item => {
            item.selected = false;
        });
        data.selected = true; // 行选中
        // 单选(check=select)，如果是未勾选，第一次点击选中，再次点击取消选中
        // 多选（check=select），如果是未勾选，第一次点击选中，再次点击取消选中
        // 多勾选单选中行（check》select）勾选和行选中各自独立，互不影响
        // console.log('行',data);
        // console.log('update', edit);

    }

    userNameChange(data?) {
        // console.log('子页面', data);
        const index = this.list.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }


    /**
     * datatable 的配置树
     */
    config = {
        'viewId': '0001',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': false, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [
                {
                    name: 'selectRow',
                    sender: '0001',
                    receiver: '0002',
                    relationData: {
                        name: 'refreshAsChild',
                        params: [{ pid: 'key', cid: 'parentId' }]
                    },
                }
            ]
        }],
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
                title: '姓名', field: 'name', width: 80,
                editor: {
                    type: 'input',
                    field: 'name',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '性别', field: 'sexname', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'sex',
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
                                'label': '男',
                                'value': '1',
                                'disabled': false
                            },
                            {
                                'label': '女',
                                'value': '2',
                                'disabled': false
                            }
                        ]
                    }
                }
            },
            {
                title: '年龄', field: 'age', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'age',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '地址', field: 'address', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            {
                'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新',
                'enables': { // 默认所有操作 状态都是false，为true 的时候当前操作限制操作
                    'addRow': true,
                    'updateRow': false
                }
            },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除', 'enable': true },
            { 'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存', 'enable': false },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' },
            {
                'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '测试方法注入',
                'type': 'method/action',
                'ajaxConfig': {
                    add: {
                        'url': 'AppConfigPack_test',
                        'ajaxType': 'post',
                        'params': [
                            { name: 'ParentId', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Name', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagA', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagB', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: 'liutest11' }

                        ]
                    },
                    update: {
                        'url': 'AppConfigPack_test',
                        'ajaxType': 'put',
                        'params': [
                            { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                        ]
                    }
                },
            },
            { 'name': 'showDialog', 'class': 'editable-add-btn', 'text': '弹出框' },
        ]

    };
    dataList = [
        {
            key: `key0`,
            name: `元春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `皇宫`,
        },
        {
            key: `key1`,
            name: `惜春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `贾府`,
        },
        {
            key: `key2`,
            name: `探春`,
            age: '32',
            sexname: '女',
            sex: '1',
            address: `贾府`,
        }
    ];

    config1 = {
        'viewId': '0002',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': false, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'ajaxConfig': {
            'url': 'AppConfigPack',
            'ajaxType': 'get',
            'params': [
                { name: 'Id', type: 'value', valueName: '_id', value: 'aee8f8386ba1410a8c2d079e2d4fe934' },
            ]
        },
        'componentType': {
            'parent': false,
            'child': false,
            'own': true
        },
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [],
            'relationReceiveContent': []
        }],
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
                title: '姓名', field: 'name', width: 80,
                editor: {
                    type: 'input',
                    field: 'name',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                        'disabled': false
                    }
                }
            },
            {
                title: '性别', field: 'sexname', width: 80, hidden: false,
                editor: {
                    type: 'select',
                    field: 'sex',
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
                                'label': '男',
                                'value': '1',
                                'disabled': false
                            },
                            {
                                'label': '女',
                                'value': '2',
                                'disabled': false
                            }
                        ]
                    }
                }
            },
            {
                title: '年龄', field: 'age', width: 80, hidden: false,
                editor: {
                    type: 'input',
                    field: 'age',
                    options: {
                        'type': 'input',
                        'labelSize': '6',
                        'controlSize': '10',
                        'inputType': 'text',
                    }
                }
            },
            {
                title: '地址', field: 'address', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            {
                'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存',
                'ajaxConfig': {
                    add: {
                        'url': 'AppConfigPack',
                        'ajaxType': 'post',
                        'params': [
                            { name: 'ParentId', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Name', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagA', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'TagB', type: 'value', valueName: '取值参数名称', value: 'liutest11' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: 'liutest11' }

                        ]
                    },
                    update: {
                        'url': 'AppConfigPack',
                        'ajaxType': 'put',
                        'params': [
                            { name: 'Id', type: 'tempValue', valueName: '_id', value: '' },
                            { name: 'Metadata', type: 'tempValue', valueName: 'dataList', value: '' }

                        ]
                    }
                },
            },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' },

        ]

    };
    dataList1 = [];
    /**
     * 动态执行方法
     * @param name 
     */
    execFun(name?) {
        switch (name) {
            case 'refresh':
                this.refresh();
                break;
            case 'addRow':
                this.addRow();
                break;
            case 'updateRow':
                this.updateRow();
                break;
            case 'deleteRow':
                this.deleteRow();
                break;
            case 'saveRow':
                this.saveRow();
                break;
            case 'cancelRow':
                this.cancelRow();
                break;
            default:
                break;
        }
    }

    /**
     * 刷新
     */
    refresh() {

    }

    nodes1 = [

        {
            id: '1',
            name: 'root3',
            data: 'ahhahah'
        },
        {
            id: '2',
            name: 'async root4',
            hasChildren: true,
            children: [
                {
                    name: '子节点1'
                },
                {
                    name: '子节点2'
                }
            ]
        },
        {
            id: '3',
            name: 'root1'
        },
        {
            id: '4',
            name: 'root2'
        }
    ];

    options1 = {
        allowDrag: true
    };

    nodes = [
        {
            name: 'root1',
            children: [
                {
                    name: 'child1'
                }, {
                    name: 'child2'
                }
            ]
        },
        {
            name: 'root2',
            children: [
                {
                    name: 'child2.1'
                }, {
                    name: 'child2.2',
                    children: [
                        {
                            id: 1001,
                            name: 'subsub'
                        }
                    ]
                }
            ]
        }
    ];

    // options: ITreeOptions = {
    //     actionMapping: {
    //         mouse: {
    //             contextMenu: (tree, node, $event) => {
    //                 $event.preventDefault();
    //                 //alert(`context menu for ${node.data.name}`);
    //                 this.showMsg(node.data.name);
    //                 this.visible = true;
    //             },
    //             dblClick: (tree, node, $event) => {
    //                 if (node.hasChildren) {
    //                     TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    //                 }
    //             },
    //             click: (tree, node, $event) => {
    //                 $event.shiftKey
    //                     ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
    //                     : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
    //             }
    //         },
    //         keys: {
    //             [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
    //         }
    //     }
    // };
    /*     actionMapping: IActionMapping = {
            mouse: {
                contextMenu: (tree, node, $event) => {
                    $event.preventDefault();
                    alert(`context menu for ${node.data.name}`);
                },
                dblClick: (tree, node, $event) => {
                    if (node.hasChildren) {
                        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
                    }
                },
                click: (tree, node, $event) => {
                    $event.shiftKey
                        ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
                        : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                }
            },
            keys: {
                [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
            }
        }; */
    onEvent(ev: any) {
        // console.log('onEvent,点击树节点', ev);
    }
    onActivate(ev: any) {
        // console.log('激活树节点', ev);
        this.visible = false;
        // console.log(this.fn(this.nodestree, 0));
    }

    // nzAutoExpandParent 是否自动展开父节点，当数字时展开最大节点 false
    // nzAllowChildLinkage 是否开启父节点的checkbox状态的会影响子节点状态 true
    // nzAllowParentLinkage 是否开启子节点的checkbox状态的会影响父节点状态 true
    // nzCheckable  在节点之前添加一个复选框
    // nzShowLine 显示连接线

    treeconfig = {
        nzAutoExpandParent: true, // 是否自动展开父节点，当数字时展开最大节点 false
        nzAllowChildLinkage: true, // 是否开启父节点的checkbox状态的会影响子节点状态 true
        nzAllowParentLinkage: true, // 是否开启子节点的checkbox状态的会影响父节点状态 true
        nzCheckable: false, //  在节点之前添加一个复选框 false
        nzShowLine: false, // 显示连接线 false
    };

    nzContextMenu(ev: any) {
        // console.log('yj');

    }


    // 气泡
    visible = false;

    nodestree = [
        { 'id': 2, 'title': '第一级1', 'parentid': 0 },
        { 'id': 3, 'title': '第二级1', 'parentid': 2 },
        { 'id': 4, 'title': '第二级2', 'parentid': 2 },
        { 'id': 5, 'title': '第三级1', 'parentid': 4 },
        { 'id': 6, 'title': '第三级2', 'parentid': 3 }
    ];
    fn(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentid === parentid) {
                const obj = { 'text': data[i].name, 'id': data[i].id };
                temp = this.fn(data, data[i].id);
                if (temp.length > 0) {
                    obj['children'] = temp;
                }
                result.push(obj);
            }
        }
        return result;
    }


    // 单行操作
    config2 = {
        'viewId': '0003',
        'component': 'form_view',
        'keyId': 'key',
        'nzIsPagination': true, // 是否分页
        'nzShowTotal': true, // 是否显示总数据量
        'pageSize': 5, // 默认每页数据条数
        'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
        'nzLoading': false, // 是否显示加载中
        'nzBordered': false, // 是否显示边框
        'ajaxConfig': {
            'url': 'DbCommonConfig',
            'ajaxType': 'get',
            'params': []
        },
        'componentType': {
            'parent': false,
            'child': false,
            'own': true
        },
        'relation': [{
            'relationViewId': '0002',
            'relationSendContent': [],
            'relationReceiveContent': []
        }],
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
                title: 'sqlid', field: 'Id', width: 80, hidden: false,
            }
        ],
        'toolbar': [
            { 'name': 'refresh', 'class': 'editable-add-btn', 'text': '刷新' },
            { 'name': 'addRow', 'class': 'editable-add-btn', 'text': '新增' },
            { 'name': 'updateRow', 'class': 'editable-add-btn', 'text': '修改' },
            { 'name': 'deleteRow', 'class': 'editable-add-btn', 'text': '删除' },
            {
                'name': 'saveRow', 'class': 'editable-add-btn', 'text': '保存'
            },
            { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
        ]

    };





    /**
     *表单配置
     */
    configForm = {
        'keyId': 'Id',
        ajaxConfig: {
            'url': 'AppModuleConfig',
            'ajaxType': 'get',
            'params': []
        },
        componentType: {
            'parent': false,
            'child': false,
            'own': true
        },
        'forms':
            [
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'Name',
                    'label': '名称',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationName',
                    'label': '操作名称',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationIcon',
                    'label': '操作图标',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationType',
                    'label': '操作类型',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '无',
                            'value': 'none'
                        },
                        {
                            'label': '刷新数据',
                            'value': 'refresh'
                        },
                        {
                            'label': '执行SQL',
                            'value': 'exec_sql'
                        },
                        {
                            'label': '执行SQL后刷新',
                            'value': 'after_sql'
                        },
                        {
                            'label': '弹出确认框',
                            'value': 'confirm'
                        },
                        {
                            'label': '弹出窗体',
                            'value': 'dialog'
                        },
                        {
                            'label': '弹出表单',
                            'value': 'form'
                        },
                        {
                            'label': '执行SQL后刷新主界面',
                            'value': 'refresh_parent'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationActionType',
                    'label': '动作类型',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '操作',
                            'value': 'operation'
                        },
                        {
                            'label': '动作',
                            'value': 'action'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationStatus',
                    'label': '操作后状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '浏览状态',
                            'value': 'normal'
                        },
                        {
                            'label': '新增状态',
                            'value': 'new'
                        },
                        {
                            'label': '编辑状态',
                            'value': 'edit'
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationNullData',
                    'label': '空数据状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '启用',
                            'value': true
                        },
                        {
                            'label': '禁用',
                            'value': false
                        }
                    ]
                },
                {
                    'type': 'select',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'submit',
                    'name': 'operationDefaultStatus',
                    'label': '默认状态',
                    'notFoundContent': '',
                    'selectModel': false,
                    'showSearch': true,
                    'placeholder': '--请选择--',
                    'disabled': false,
                    'size': 'default',
                    'options': [
                        {
                            'label': '启用',
                            'value': true
                        },
                        {
                            'label': '禁用',
                            'value': false
                        }
                    ]
                },
                {
                    'type': 'input',
                    'labelSize': '6',
                    'controlSize': '10',
                    'inputType': 'text',
                    'name': 'operationOrder',
                    'label': '顺序',
                    'placeholder': '',
                    'disabled': false,
                    'readonly': false,
                    'size': 'default'
                },

            ],
        'toolbar':
            [
                {
                    'name': 'saveForm', 'class': 'editable-add-btn', 'text': '保存'
                },
                { 'name': 'cancelRow', 'class': 'editable-add-btn', 'text': '取消' }
            ],

        'dataList': [],
        'relations': [
            {
                relationViewId: 'viewId_testList',
                relationSendContent: [],
                relationReceiveContent: []
            }
        ]
    };


    nestedTableData = [];
    innerTableData = [];




    expandKeys = ['1001', '10001'];
    checkedKeys = ['10001', '1002'];
    selectedKeys = ['10001', '100011'];
    expandDefault = false;
    nodesnewtree = [
        new NzTreeNode({
            title: 'root1',
            key: '1001',
            children: [
                {
                    title: 'child1',
                    key: '10001',
                    children: [
                        {
                            title: 'child1.1',
                            key: '100011',
                            children: []
                        },
                        {
                            title: 'child1.2',
                            key: '100012',
                            children: [
                                {
                                    title: 'grandchild1.2.1',
                                    key: '1000121',
                                    isLeaf: true,
                                    disabled: true
                                },
                                {
                                    title: 'grandchild1.2.2',
                                    key: '1000122',
                                    isLeaf: true
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'child2',
                    key: '10002'
                }
            ]
        }),
        new NzTreeNode({
            title: 'root2',
            key: '1002',
            children: [
                {
                    title: 'child2.1',
                    key: '10021',
                    children: [],
                    disableCheckbox: true
                },
                {
                    title: 'child2.2',
                    key: '10022',
                    children: [
                        {
                            title: 'grandchild2.2.1',
                            key: '100221'
                        }
                    ]
                }
            ]
        }),
        new NzTreeNode({ title: 'root3', key: '1003' })
    ];

    mouseAction(name: string, event: NzFormatEmitEvent): void {
        // console.log(name, event);
    }




    // --------------------------
    data = [
        {
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
                {
                    key: 11,
                    name: 'John Brown',
                    age: 42,
                    address: 'New York No. 2 Lake Park'
                },
                {
                    key: 12,
                    name: 'John Brown jr.',
                    age: 30,
                    address: 'New York No. 3 Lake Park',
                    children: [{
                        key: 121,
                        name: 'Jimmy Brown',
                        age: 16,
                        address: 'New York No. 3 Lake Park'
                    }]
                },
                {
                    key: 13,
                    name: 'Jim Green sr.',
                    age: 72,
                    address: 'London No. 1 Lake Park',
                    children: [
                        {
                            key: 131,
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                                {
                                    key: 1311,
                                    name: 'Jim Green jr.',
                                    age: 25,
                                    address: 'London No. 3 Lake Park'
                                },
                                {
                                    key: 1312,
                                    name: 'Jimmy Green sr.',
                                    age: 18,
                                    address: 'London No. 4 Lake Park'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            key: 2,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        }
    ];
    expandDataCache = {};

    collapse(array: any[], data: any, $event: boolean): void {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key);
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root: object): any[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
                }
            }
        }

        return array;
    }

    visitNode(node: any, hashMap: object, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }



    /**
     * 20180521 测试表单级联解析
     */
    configFormNew = {
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
                            'name': 'CaseName',
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
                            'name': 'CaseCount',
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
                                            { hidden: false}
                                        
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
                                            { hidden: true}
                                        
                                    },
                                    relation_data: {

                                    }

                                }
                            },
                           


                        ],
                        cascadeDateItems: [ ]  // 应答描述数组，同一个组件可以做出不同应答
                            
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
                                    ajax_data: { // 路由发生变化，复杂问题，涉及参数取值

                                        // 直接描述需要替换的参数名称（实现简单），不合理，不能动态控制参数个数
                                        option: [
                                            { name: 'typevalue', type : 'value', value: '1', valueName: 'value'  },
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
    };







}

import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CommonTools } from '../../../core/utility/common-tools';
import { ApiService } from '../../../core/utility/api-service';
import { APIResource } from '../../../core/utility/api-resource';
import { RelativeService, RelativeResolver } from '../../../core/relative-Service/relative-service';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { CnComponentBase } from '@shared/components/cn-component-base';

@Component({
    selector: 'bsn-data-table,[bsn-data-table]',
    templateUrl: './bsn-data-table.component.html',
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
`
    ]
})
export class BsnDataTableComponent extends CnComponentBase implements OnInit {

    @Input() config; // dataTables 的配置参数
    @Input() dataList = []; //  表格数据集合


    pi = 1;
    ps = 10;
    total = 0; //  mock total
    loading = false;
    args: any = {};
    _indeterminate = false;
    _allChecked = false;
    events: any[] = [];
    rowContent = {}; //  行填充

    tempParameters = {
    }; //  临时参数，如从外部进出值，均从此处走

    /**
     * 当前组件属性【作为主表、作为子表、单表】优先级：子表-》主表-》单表；
     */
    componentType = {
        parent: false,
        child: false,
        own: true
    };
    /**
     * 事件API
     */
    selfEvent = {
        selectRow: [],
        reLoad: [],
        selectRowBySetValue: []
    };
    /**
     * 操作是否有效
     */
    _toolbar = {};
    async load(type?, pi?: number) {
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
            this.dataList = data.results;
        });
        */
        if (type === 'load') {
            const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
            if (ajaxData) {
                console.log('异步加载表数据load', ajaxData);
                this.loading = true;
                if (ajaxData.Data.length > 0) {
                    if (ajaxData.Data[0].Metadata) {
                        this.updateEditCacheByLoad(JSON.parse(ajaxData.Data[0].Metadata));
                        this.dataList = JSON.parse(ajaxData.Data[0].Metadata);
                        this.total = this.dataList.length;
                    } else {
                        this.dataList = [];
                        this.updateEditCacheByLoad([]);
                        this.total = this.dataList.length;
                    }
                    this.tempParameters['_id'] = ajaxData.Data[0].Id;
                } else {
                    this.dataList = [];
                    this.updateEditCacheByLoad([]);
                    this.tempParameters['_id'] && delete this.tempParameters['_id'];

                }
                console.log('当前记录id', this.tempParameters['_id']);
            } else {
                this.dataList = [];
                this.updateEditCacheByLoad([]);
            }
            this.loading = false;
        }

        //  this.updateEditCache();
        /*   this._http.getProj(APIResource[p.url], params).subscribe(data => {
              console.log('异步加载表数据', data);
              this.loading = false;
              // this.dataList = data.Data.Metadata;
              // this.total=data.Data.Metadata.length;
          }); */

    }
    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    /**
     * 执行异步数据
     * @param p 路由参数信息
     * @param ajaxType 异步请求类别，post、put、get
     * @param componentValue
     */
    async execAjax(p?, componentValue?, type?) {
        const params = {
        };
        /*   p = {
              url: 'AppConfigPack',
              ajaxType:'post',
              params: [
                  { name: 'id', type: 'tempValue', valueName: '取值参数名称', value: '' },
                  { name: 'id', type: 'value', valueName: '取值参数名称', value: '' },
                  { name: 'id', type: 'componentValue', valueName: '取值参数名称', value: '' }
              ]
          } */
        let url;
        let tag = true;
        if (p) {
            p.params.forEach(param => {
                if (param.type === 'tempValue') {
                    if (type) {
                        if (type === 'load') {
                            if (this.tempParameters[param.valueName]) {
                                params[param.name] = this.tempParameters[param.valueName];
                            } else {
                                console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.tempParameters[param.valueName];
                        }
                    } else {
                        params[param.name] = this.tempParameters[param.valueName];
                    }

                } else if (param.type === 'value') {

                    params[param.name] = param.value;

                } else if (param.type === 'GUID') {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === 'componentValue') {
                    console.log(componentValue);
                    params[param.name] = componentValue.value;
                }
            });


            if (this.isString(p.url)) {
                url = APIResource[p.url];
            } else {
                let pc = 'null';
                p.url.params.forEach(param => {
                    if (param['type'] === 'value') {
                        pc = param.value;
                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue.value;
                    } else if (param.type === 'tempValue') {
                        pc = this.tempParameters[param.valueName];
                    }
                });

                url = APIResource[p.url['parent']] + '/' + pc + '/' + APIResource[p.url['child']];
            }
        }
        if (p.ajaxType === 'get' && tag) {
            console.log('get参数', params);

            return this._http.getProj(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            console.log('put参数', params);
            return this._http.putProj(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            console.log('post参数', params);
            return this._http.postProj(url, params).toPromise();
        } else {
            return null;
        }
    }

    clear() {
        this.args = {};
        this.load('', 1);
    }

    _checkAll($event?) {
        this.dataList.forEach(item => item.checked = this._allChecked);
        this.refChecked();
    }
    refChecked() {
        const checkedCount = this.dataList.filter(w => w.checked).length;
        this._allChecked = checkedCount === this.dataList.length;
        this._indeterminate = this._allChecked ? false : checkedCount > 0;
    }
    // private _randomUser: RandomUserService,
    constructor(private http: _HttpClient, private _http: ApiService,
        private message: NzMessageService, private modalService: NzModalService,
        private relativeMessage: RelativeService,
        private _relativeResolver: RelativeResolver
    ) {
        super();
    }
    async ngOnInit() {
        this.analysisRelation(this.config);
        this.toolbarEnables('load');
        if (this.config.ajaxConfig) {
            if (this.config.componentType) {
                if (!this.config.componentType.child) {
                    this.load('load');
                }
            } else {
                this.load('load');
            }
        } else {
            this.updateEditCache();
            this.total = this.dataList.length;
        }

        this._relativeResolver = new RelativeResolver();
        this._relativeResolver.relations = this.config.relation;
        this._relativeResolver.reference = this;
        this._relativeResolver.relativeService = this.relativeMessage;
        this._relativeResolver.resolverRelation();
        console.log(this._relativeResolver);
        //   this.http.get('/chart/visit').subscribe((res: any) => this.events = res);
        this.getContent();


    }

    showMsg(msg: string) {
        this.message.info(msg);
    }

    /**
     * toolbar 是否启用状态解析
     * @param type 类别 load、action
     * @param name toolbarname
     */
    toolbarEnables(type?, name?) {
        if (type) {
            if (type === 'load') {
                if (this.config.toolbar) {
                    this.config.toolbar.forEach(bar => {
                        if (bar.enable === false) {
                            this._toolbar[bar.name] = false;
                        } else {
                            this._toolbar[bar.name] = true;
                        }
                    });

                }
            } else {
                this.config.toolbar.forEach(bar => {
                    if (bar.name === name) {
                        this.config.toolbar.forEach(baritem => {
                            this._toolbar[baritem.name] = true;
                        });
                        if (bar.enables) {
                            for (const d in bar.enables) {
                                this._toolbar[d] = bar.enables[d];
                            }
                        }
                    }
                });

            }
        }
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
        const index = this.dataList.findIndex(item => item.key === key);
        this.editCache[key].edit = false;
        this.editCache[key].data = JSON.parse(JSON.stringify(this.dataList[index]));
    }

    saveEdit(key: string): void {
        const index = this.dataList.findIndex(item => item.key === key);
        let checked = false;
        let selected = false;
        if (this.dataList[index].checked) {
            checked = this.dataList[index].checked;
        }
        if (this.dataList[index].selected) {
            selected = this.dataList[index].selected;
        }

        this.dataList[index] = this.editCache[key].data;
        this.dataList[index].checked = checked;
        this.dataList[index].selected = selected;

        this.editCache[key].edit = false;
    }

    deleteEdit(i: string): void {
        const dataSet = this.dataList.filter(d => d.key !== i);
        this.dataList = dataSet;
    }
    updateEditCache(): void {
        //  const datadataList=JSON.parse(JSON.stringify(this.dataList));
        this.dataList.forEach(item => {
            if (!this.editCache[item.key]) {
                this.editCache[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }
    updateEditCacheByLoad(dataList): void {
        //  const datadataList=JSON.parse(JSON.stringify(this.dataList));
        dataList.forEach(item => {
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
    //  copyData = [...this.dataList];
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

        this.dataList = [...this.dataList.sort((a, b) => {
            if (a[this.sortName] > b[this.sortName]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[this.sortName] < b[this.sortName]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        })];
    }

    getContent() {
        this.rowContent['key'] = null;
        this.config.columns.forEach(element => {
            const colsname = element.field.toString();
            this.rowContent[colsname] = '';
        });
    }

    /**新增 */
    addRow(): void {
        this.toolbarEnables('action', 'addRow');
        const rowContentNew = JSON.parse(JSON.stringify(this.rowContent));
        const fieldIdentity = CommonTools.uuID(6);
        rowContentNew['key'] = fieldIdentity;
        rowContentNew['checked'] = true;
        this.dataList = [...this.dataList, rowContentNew];
        // this.dataList.push(this.rowContent);
        this.updateEditCache();
        this.startEdit(fieldIdentity.toString());

    }
    /**修改 */
    updateRow(): void {
        this.toolbarEnables('action', 'updateRow');
        this.dataList.forEach(item => {
            if (item.checked === true) {
                this.startEdit(item.key);
            }
        });
    }
    /**删除 */
    deleteRow(): void {
        this.toolbarEnables();
        //  this.modalService.confirm({
        //      title: '确认框',
        //      content: '确认要删除？',
        //      onOk: () => {
        //          this.dataList.forEach(item => {
        //              if (item.checked === true) {
        //                  this.deleteEdit(item.key);
        //              }
        //          });
        //      },
        //      onCancel() {
        //      }
        //  });
    }
    /**保存 */
    async  saveRow() {

        this.toolbarEnables('action', 'saveRow');
        this.dataList.forEach(item => {
            if (item.checked === true) {
                this.saveEdit(item.key);
            }
        });
        const dataList = JSON.parse(JSON.stringify(this.dataList));
        const newdataList = [];
        dataList.forEach(element => {
            const row = {};
            for (const d in element) {
                if (d !== 'checked' && d !== 'selected') {
                    row[d] = element[d];
                }
            }
            newdataList.push(row);
        });
        this.tempParameters['dataList'] = JSON.stringify(newdataList);
        this.tempParameters['arrayDataList'] = newdataList;
        console.log(this.tempParameters['dataList']);
        if (this.config.toolbar) {
            const index = this.config.toolbar.findIndex(item => item.name === 'saveRow');
            if (this.config.toolbar[index].ajaxConfig) {
                const pconfig = JSON.parse(JSON.stringify(this.config.toolbar[index].ajaxConfig));
                if (this.tempParameters['_id']) {
                    // 修改保存
                    const ajaxData = await this.execAjax(pconfig['update'], null);
                    if (ajaxData) {
                        console.log('修改保存成功', ajaxData);
                        this.dataList = JSON.parse(JSON.stringify(this.dataList));
                    }
                } else {
                    // 新增保存
                    console.log(pconfig['add']);
                    const ajaxData = await this.execAjax(pconfig['add'], null);
                    if (ajaxData) {
                        console.log('新增保存成功', ajaxData);
                        this.dataList = JSON.parse(JSON.stringify(this.dataList));
                    }
                }
            }


        }
        console.log('需要保存的数据', newdataList);
    }
    /**取消 */
    cancelRow(): void {
        this.toolbarEnables('action', 'cancelRow');
        this.dataList.forEach(item => {
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

        this.dataList.forEach(item => {
            item.selected = false;
        });
        data.selected = true; //  行选中

        //  单选(check=select)，如果是未勾选，第一次点击选中，再次点击取消选中
        //  多选（check=select），如果是未勾选，第一次点击选中，再次点击取消选中
        //  多勾选单选中行（check》select）勾选和行选中各自独立，互不影响

        console.log('注册api事件', this.selfEvent);
        console.log('行选中selectRowdata', data);
        this.selfEvent['selectRow'].forEach(sendEvent => {
            if (sendEvent.isRegister === true) {

                console.log('关系描述', sendEvent);
                const parent = {};
                sendEvent.data.params.forEach(element => {
                    parent[element['cid']] = data[element['pid']];
                });

                console.log('主子关系字段', parent);
                const receiver = { name: 'refreshAsChild', receiver: sendEvent.receiver, parent: parent };
                console.log('选中行发消息事件', receiver);
                this.relativeMessage.sendMessage({ type: 'relation' }, receiver);
                console.log('选中行发消息事件over');
            }
        });
        this.selfEvent['selectRowBySetValue'].forEach(sendEvent => {
            if (sendEvent.isRegister === true) {
                console.log('关系描述', sendEvent);
                const parent = {};
                sendEvent.data.params.forEach(element => {
                    parent[element['cid']] = data[element['pid']];
                });

                console.log('主子关系字段', parent);
                const receiver = { name: 'initComponentValue', receiver: sendEvent.receiver, parent: parent };
                console.log('选中行发消息事件', receiver);
                this.relativeMessage.sendMessage({ type: 'relation' }, receiver);
                console.log('选中行发消息事件over');
            }
        });
    }

    valueChange(data?) {
        // console.log('子页面', data);
        const index = this.dataList.findIndex(item => item.key === data.key);
        this.editCache[data.key].data[data.name] = data.data;
    }

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
            case 'showDialog':
                this.showDialog();
                break;

            default:
                break;
        }
    }

    /**
     * 刷新
     */
    refresh() {
        this.toolbarEnables('action', 'refresh');
        // 测试生成方法
        console.log(' 测试生成方法 begin');
        this.createMethod();
        console.log(' 测试生成方法', this.CRUD);
        this.CRUD['add']();
        console.log(' 调用生成方法');
    }


    /** 刷新，作为子表的刷新*/
    refreshAsChild(parentId?) {
        console.log('刷新，作为子表的刷新', parentId);
        for (const d in parentId) {
            this.tempParameters[d] = parentId[d];
        }
        this.load('load'); // 调用子表的刷新
        console.log('子表刷新是取到主表的值', this.tempParameters);
    }

    // 初始化参数列表，参数列表初始化后load（当前参数的取值）
    initParameters(data?) {
        for (const d in data) {
            this.tempParameters[d] = data[d];
        }
        console.log('初始化参数', this.tempParameters);
        this.load('load'); // 参数完成后加载刷新
    }

    // 初始化组件值
    initComponentValue(data?) {
        for (const d in data) {
            if (d === 'dataList') {
                if (!data[d]) {
                    this.dataList = [];
                    this.updateEditCacheByLoad([]);
                } else {
                    const _dataList = data[d];
                    _dataList.forEach(item => {
                        const fieldIdentity = CommonTools.uuID(6);
                        item['key'] = fieldIdentity;
                    });
                    this.updateEditCacheByLoad(_dataList);
                    this.dataList = _dataList;
                }

                this.total = this.dataList.length;
            } else {
                this.tempParameters[d] = data[d];
            }
        }
    }


    formSendMessage(data?) {
        if (data) {
            if (this.selfEvent[data.name]) {
                this.selfEvent[data.name].push({ isRegister: true, receiver: data.receiver, data: data.relationData });
            }
        }
    }

    //  接收消息
    formReceiveMessage(data?) {
        console.log('表单接收消息', data);
        if (data) {
            switch (data.name) {
                case 'refreshAsChild':
                    this.refreshAsChild(data.parent);
                    break;
                case 'initParameters':
                    this.initParameters(data.parent);
                    break;
                case 'initComponentValue':
                    this.initComponentValue(data.parent);
                    break;
            }
        }
    }

    //  解析关系
    analysisRelation(data?) {
        if (this.config.relation) {
            this.config.relation.forEach(relation => {
                if (relation.relationSendContent) {
                    relation.relationSendContent.forEach(relationSend => {
                        this.formSendMessage(relationSend);
                    });
                }
                if (relation.relationReceiveContent) {

                    const subMessage = this.relativeMessage.getMessage().subscribe(value => {
                        switch (value.type.type) {
                            case 'relation':
                                if (value.data.receiver === this.config.viewId) {
                                    this.formReceiveMessage(value.data);
                                }
                                break;
                            case 'initParameters':
                                console.log(value.data.receiver, this.config);
                                if (value.data.receiver === this.config.viewId) {
                                    this.formReceiveMessage(value.data);
                                }
                                break;
                        }
                    });
                    if (subMessage) {
                        this._subscribArr.push(subMessage);
                    }
                }

            });

        }


        console.log('解析关系信息', data);

    }

    //  销毁
    _subscribArr: any[] = [];
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        if (this._subscribArr.length > 0) {
            this._subscribArr.forEach(sub => {
                sub.unsubscribe();
            });
        }
        this._relativeResolver.unsubscribe();
    }

    isVisible = false;
    modal = {
        nzConfirmLoading: true,
        nzTitle: '标题',
        nzClosable: true,
        nzBody: '这是内容',
        nzWidth: '520',
        nzContent: null, // 'modalContent'
        nzOkText: '确定',
        nzCancelText: '取消',
        nzMaskClosable: true,
        nzZIndex: '1000',
        //  [nzStyle]='{}'
        //  [nzWrapClassName]=''''
        //  (nzOnCancel)='handleCancel($event)'
        //  (nzOnOk)='handleOk($event)'
        config: {
            'viewId': 'operation_sqlColumns1',
            'component': 'bsnDataTable',
            'config': {
                'viewId': 'operation_sqlColumns1',
                'keyId': 'key',
                'nzIsPagination': false, //  是否分页
                'nzShowTotal': true, //  是否显示总数据量
                'pageSize': 5, // 默认每页数据条数
                'nzPageSizeSelectorValues': [5, 10, 20, 30, 40, 50],
                'nzLoading': false, //  是否显示加载中
                'nzBordered': false, //  是否显示边框
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
    };


    _editorConfig = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            span: 24,
                            size: {
                                nzXs: 24,
                                nzSm: 24,
                                nzMd: 24,
                                nzLg: 24,
                                ngXl: 24
                            },

                            //  'title': '基本属性',
                            'viewId': 'opt_base',
                            'component': 'form_view',
                            'config': [
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
                                {
                                    'type': 'submit',
                                    'offsetSize': '6',
                                    'controlSize': '10',
                                    'name': 'submit'
                                }
                            ],
                            'dataList': []

                        }


                    ]
                }
            },
        ]
    };

    /**
     * 弹出
     * @param data 
     */
    showDialog(data?) {
        this.showModalForComponent();

    }

    showModalForComponent() {
        //  const subscription = this.modalService.open({
        //      title: '弹出表单测试-liu',
        //      content: LayoutResolverComponent,
        //      width: 800,
        //      okText: '确定',
        //      cancelText: '取消',
        //      onOk() {
        //          console.log('Click ok');
        //      },
        //      onCancel() {
        //          console.log('Click cancel');
        //      },
        //      footer: true,
        //      componentParams: {
        //          config: this._editorConfig // dataTables 的配置参数
        //      }
        //  });
        //  subscription.subscribe(result => {
        //      console.log(result);
        //      // onCancel 、 onOk

        //  })

        const modal = this.modalService.create({
            nzTitle: 'Modal Title',
            nzContent: LayoutResolverComponent,
            nzComponentParams: {
                config: this._editorConfig
            },
            nzFooter: [{
                label: 'change component tilte from outside',
                onClick: (componentInstance) => {
                    // componentInstance.title = 'title in inner component is changed';
                }
            }]
        });
    }



    /**
     * 存储方法的变量
     */
    CRUD = {};
    /**
     * 生成方法（自定义方法）
     */
    createMethod() {

        // 每个方法，有自定义变量，对变量的操作，执行异步请求
        // 将数据集 格式化，json 生成，或者格式转化
        // 方法名称，取toolbar name
        // 参数 ， 拼装成json对象传递进去
        // 创建的方法，也可以直接调用
        // 方法返回，返回值也存储在临时变量 
        //     好处，不处理各种返回传递；
        //     不好处，业务对象数据，比较复杂，各种数据混在一起，可能会串数据，对命名，等都有要求，日后优化力度大
        // 消息，内置的合理，动态生成的可能会有执行成功后发消息，类似这种，将消息单独出来，在方法完成后或异步请求执行成功后调用
        this.CRUD['add'] = function (params?) {
            console.log('createMethod，add');
        };

    }

    methodItem() {

        this.config.toolbar.forEach(bar => {
            this.CRUD[bar.name] = function (params?) {
                console.log('createMethod', bar.name);
                // 1.解析动作前
                // 2. 当前动作
                // 2.1 异步请求
                // 每个异步请求前，后均有动作，细化每个函数执行一个，粗化是一个方法简析各种
                // 2.1.1  请求前，判断参数等其他信息，参数组织
                // 2.1.2  执行结果分析
                // 2.1.2.1 执行成功-》操作
                // 2.1.2.1.1 操作后续，发消息？给临时变量赋值？
                // 2.1.2.2 执行失败-》操作
                // 2.2 弹出窗体
                // 表单 和 复杂页面。 表单自提交数据，复杂页面 保存等效果在页面中实现
                //

                // 3. 解析动作后
            };
        });
    }




}

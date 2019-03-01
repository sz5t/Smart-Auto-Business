import { CommonTools } from '@core/utility/common-tools';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import {
    RelativeResolver,
    RelativeService
} from '@core/relative-Service/relative-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-sql-editor',
    templateUrl: './sql-editor.component.html',
    styles: [
        `
            :host ::ng-deep .ant-table-expanded-row > td:last-child {
                padding: 0 48px 0 8px;
            }

            :host
                ::ng-deep
                .ant-table-expanded-row
                > td:last-child
                .ant-table-thead
                th {
                border-bottom: 1px solid #e9e9e9;
            }

            :host
                ::ng-deep
                .ant-table-expanded-row
                > td:last-child
                .ant-table-thead
                th:first-child {
                padding-left: 0;
            }

            :host
                ::ng-deep
                .ant-table-expanded-row
                > td:last-child
                .ant-table-row
                td:first-child {
                padding-left: 0;
            }

            :host
                ::ng-deep
                .ant-table-expanded-row
                .ant-table-row:last-child
                td {
                border: none;
            }

            :host ::ng-deep .ant-table-expanded-row .ant-table-thead > tr > th {
                background: none;
            }

            :host ::ng-deep .table-operation a.operation {
                margin-right: 24px;
            }
            .table-operations {
                margin-bottom: 0px;
            }

            .table-operations > button {
                margin-right: 8px;
            }

            .example-input .ant-input {
                width: 100px;
                margin: 0 8px 8px 0;
            }
        `
    ]
})
export class SqlEditorComponent extends CnComponentBase
    implements OnInit, OnDestroy {
    public total = 1;
    public pageIndex = 1;
    public pageSize = 10;
    public PageSizeOptions = [5, 10, 20, 30, 40, 50 ];
    public FrontPagination = false;
    public tableData = [];
    public _selectedRow;
    public _scriptName;
    public loading = true;
    public scriptModelList = [
        { value: 'get', name: 'get' },
        { value: 'post', name: 'post' },
        { value: 'put', name: 'put' },
        { value: 'delete', name: 'delete' }
    ];
    public scriptModel;
    public isModelloading = false;
    public _funcOptions;
    public _funcValue;
    public _moduleId;
    public _resourceName;
    public isAnalysisModel = 1;
    public bsnTypeMode;
    private rname;
    @Input()
    public config;
    public codeMirrorConfig = { type: 'text/x-sql' };
    @ViewChild('editor')
    public editor: CnCodeEditComponent;

    constructor(
        private _http: ApiService,
        private _relativeService: RelativeService,
        private _message: NzMessageService,
        private modalService: NzModalService
    ) {

        super();
        this.baseModal = this.modalService;
    }

    public async ngOnInit() {
        const params = {
            _select: 'Id,name,parentId',
            refProjectId: '7fe971700f21d3a796d2017398812dcd'
        };
        const moduleData = await this.getModuleData(params);
        // 初始化模块列表，将数据加载到及联下拉列表当中
        if (moduleData.data && moduleData.data.length > 0) {
            this._funcOptions = this.arrayToTree(moduleData.data, null);
        }
    }

    // 获取模块信息
    public async getModuleData(params) {
        return this._http.get('common/CfgProjectModule', params).toPromise();
    }

    // 改变模块选项
    public async _changeModuleValue($event?) {
        // 选择功能模块，首先加载服务端配置列表
        if (this._funcValue.length > 0) {
            this._moduleId = this._funcValue[this._funcValue.length - 1];
            this.load();
            this.clearInfo();
        }
    }

    public arrayToTree(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const obj = { label: data[i].name, value: data[i].Id };
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

    public async load(condition?) {
        let param = {
            _page: this.pageIndex,
            _rows: this.pageSize,
            _subResourceName: 'CfgSqlParameter',
            _subListRefPropName: 'sqlScriptId',
            _subSort: 'orderCode'
        };

        if (condition) {
            param = { ...param, ...condition };
        }

        const pid = this._moduleId ? this._moduleId : null;
        const response = await this._http
            .get(`common/CfgProjectModule/${pid}/CfgSql`, param)
            .toPromise();
        if (response.isSuccess) {
            this.tableData = response.data.rows;
            this.total = response.data.total;
            this.tableData.map(d => {
                d['expand'] = false;
                d['selected'] = false;
                if (d.children && d.children.length > 0) {
                    d['parameterList'] = d.children;
                    d['parameterList'].forEach(p => {
                        p['edit'] = false;
                    });
                }
            });
        }
        this.loading = false;
    }
    public searchData(reset: boolean = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.load();
    }
    public selectRow(row) {
        this.tableData.map(d => {
            d.selected = false;
        });
        row.selected = true;
        this.editor.setValue(row.contents);
        this._scriptName = row.name;
        this._resourceName = row.resourceName;
        this.isAnalysisModel = row.isAnalysisParameters;
        this.bsnTypeMode = row.confType;
        this.scriptModel = row.requestMethod.split(',');
        this._selectedRow = row;
    }

    public add() {
        this.editor.setValue('');
        this.clearInfo();
    }

    public async save() {
        const sqlString = this.editor.getValue();
        let returnValue: any;

        if (this._selectedRow) {
            // update
            returnValue = await this.updateSql(sqlString);
        } else {
            // add
            if (sqlString && sqlString.length > 0) {
                returnValue = await this.addSql(sqlString);
                if (returnValue.isSuccess) {
                    const sqlId = returnValue.data.Id;
                    const rel = await this.addSqlRelative(sqlId);
                }
            }
        }
        if (returnValue.isSuccess) {
            this._message.create('success', 'SQL 保存成功');
            this.load();
            this.clearInfo();
        } else {
            this._message.create('error', returnValue.message);
        }
    }

    public clearInfo() {
        this.isAnalysisModel = 1;
        this.bsnTypeMode = null;
        this.scriptModel = null;
        this._selectedRow = null;
        this._scriptName = null;
        this._resourceName = null;
        this.editor.setValue('');
    }

    // 删除SQL语句
    public delete(id) {
        (async () => {
            const resSql = await this.delSql(id);
            const resRelative = await this.delSqlRelative(id);
            if (resSql.isSuccess) {
                this._message.create('success', 'SQL 删除成功');
                this.load();
                this.clearInfo();
            } else {
                this._message.create('error', resSql.message);
            }
        })();
    }

    // 删除SQL 参数
    public deleteParam(id) { }

    private async addSql(sql) {
        const params = {
            confType: this.bsnTypeMode ? this.bsnTypeMode : '', // 业务类型
            isAnalysisParameters: this.isAnalysisModel, // 需要添加下拉列表 1, 0
            contents: sql,
            name: this._scriptName,
            resourceName: this._resourceName,
            isEnabled: 1,
            // isNeedDeploy: 1,
            requestMethod: this.scriptModel.join(','),
            isImmediateCreate: 1
        };
        return this._http.post(`common/CfgSql`, params).toPromise();
    }

    private async addSqlRelative(sqlId) {
        const params = {
            leftId: this._moduleId,
            rightId: sqlId,
            leftResourceName: 'CfgProjectModule',
            rightResourceName: 'CfgSql'
        };
        return this._http.post('common/SysDataLinks', params).toPromise();
    }

    private async delSql(id) {
        return this._http.delete(`common/CfgSql`, { _ids: id }).toPromise();
    }

    private async delSqlParam(id) { }
    // 删除SQL关联表数据
    private async delSqlRelative(id) {
        const params = {
            rightId: id,
            leftId: this._moduleId
        };
        return this._http.delete('common/SysDataLinks', params).toPromise();
    }

    private async updateSql(sql) {
        const params = {
            Id: this._selectedRow['Id'],
            confType: this.bsnTypeMode ? this.bsnTypeMode : '',
            contents: sql,
            name: this._scriptName,
            resourceName: this._resourceName,
            isEnabled: 1,
            // isNeedDeploy: 1,
            requestMethod: this.scriptModel.join(','),
            isAnalysisParameters: this.isAnalysisModel, // 需要添加下拉列表 1, 0
            isImmediateCreate: 1
        };
        return this._http.put(`common/CfgSql`, params).toPromise();
    }

    public changeEdit(data, flag) {
        data['edit'] = flag;
    }

    public saveParams(data) {
        this._http
            .put('common/sql_parameter/update', data)
            .subscribe(result => {
                if (result.isSuccess) {
                    this.changeEdit(data, false);
                    // console.log('保存成功');
                } else {
                    // console.log('保存异常');
                }
            });
    }

    public setEnabledText(val) {
        return val === 1 ? '启用' : '禁用';
    }

    public setPublishText(val) {
        return val === 1 ? '已发布' : '未发布';
    }

    public search($event: KeyboardEvent) {
        if ($event.keyCode === 13) {
            const condition = this.rname ? { resourceName: `ctn(%${this.rname}%)` } : {}
            this.load(condition);
        }

    }

    public ngOnDestroy() { }

    public cancel() { }

    // 添加参数修改: 数据类型, 是否可为空, 默认值 调用更新参数接口

    // 设置规则 liu
    public codeRuleSQL(data?) {

       // console.log('规则', data);
        this.showLayout(this.dialog, data);
    }

    // tslint:disable-next-line:member-ordering
    public dialog = {
        'title': '规则设置',
        'name': 'ShowCaseWindow',
        'layoutName': 'CodeRuleSQL',
        'width': 800,
        'buttons': [
            // {
            //     'name': 'ok1',
            //     'text': '确定',
            //     'type': 'primary'
            // },
            {
                'name': 'close',
                'text': '关闭'
            }
        ]
    };
    
    private showLayout(dialog, rowdata?) {
        const footer = [];
        this._http.getLocalData(dialog.layoutName).subscribe(data => {
           //  console.log('getLocalData:', data);
            const selectedRow = rowdata ? rowdata : {};
            selectedRow['ruleid'] = selectedRow['Id'];
            const tmpValue = this.tempValue ? this.tempValue : {};
            const modal = this.baseModal.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: LayoutResolverComponent,
                nzComponentParams: {
                    //  permissions: this.permissions,
                    config: data,
                    initData: { ...tmpValue, ...selectedRow }
                },
                nzFooter: footer
            });
            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button['label'] = btn.text;
                    button['type'] = btn.type ? btn.type : 'default';
                    button['show'] = true;
                    button['onClick'] = componentInstance => {
                        if (btn['name'] === 'save') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn,
                                    () => {
                                        modal.close();
                                        // todo: 操作完成当前数据后需要定位
                                        // this.load();
                                        //  this.sendCascadeMessage();
                                    }
                                );
                            })();
                        } else if (btn['name'] === 'saveAndKeep') {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn,
                                    () => {
                                        // todo: 操作完成当前数据后需要定位
                                        //  this.load();
                                        // this.sendCascadeMessage();
                                    }
                                );
                                if (result) {

                                }
                            })();
                        } else if (btn['name'] === 'close') {
                            modal.close();
                            // this.load();
                            // this.sendCascadeMessage();
                        } else if (btn['name'] === 'reset') {
                            // this._resetForm(componentInstance);
                        } else if (btn['name'] === 'ok') {
                            modal.close();
                            //  this.load();
                            // this.sendCascadeMessage();
                            //
                        }
                    };
                    footer.push(button);
                });
            }
        });
    }


}

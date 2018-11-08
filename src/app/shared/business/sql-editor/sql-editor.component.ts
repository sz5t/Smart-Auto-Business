import { CommonTools } from "@core/utility/common-tools";
import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { SimpleTableColumn, SimpleTableComponent } from "@delon/abc";
import { ApiService } from "@core/utility/api-service";
import { CnCodeEditComponent } from "@shared/components/cn-code-edit/cn-code-edit.component";
import {
    RelativeResolver,
    RelativeService
} from "@core/relative-Service/relative-service";
import { NzMessageService } from "ng-zorro-antd";
import { CnComponentBase } from "@shared/components/cn-component-base";

@Component({
    selector: "cn-sql-editor",
    templateUrl: "./sql-editor.component.html",
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
                width: 200px;
                margin: 0 8px 8px 0;
            }
        `
    ]
})
export class SqlEditorComponent extends CnComponentBase
    implements OnInit, OnDestroy {
    total = 1;
    pageIndex = 1;
    pageSize = 100;
    tableData = [];
    _selectedRow;
    _scriptName;
    loading = false;
    scriptModelList = [
        { value: "get", name: "get" },
        { value: "post", name: "post" },
        { value: "put", name: "put" },
        { value: "delete", name: "delete" }
    ];
    scriptModel;
    isModelloading = false;
    _funcOptions;
    _funcValue;
    _moduleId;
    _resourceName;
    @Input()
    config;
    codeMirrorConfig = { type: "text/x-sql" };
    @ViewChild("editor")
    editor: CnCodeEditComponent;

    constructor(
        private _http: ApiService,
        private _relativeService: RelativeService,
        private _message: NzMessageService
    ) {
        super();
    }

    async ngOnInit() {
        const params = {
            _select: "Id,name,parentId",
            refProjectId: "7fe971700f21d3a796d2017398812dcd"
        };
        const moduleData = await this.getModuleData(params);
        // 初始化模块列表，将数据加载到及联下拉列表当中
        if (moduleData.data && moduleData.data.length > 0) {
            this._funcOptions = this.arrayToTree(moduleData.data, null);
        }
    }

    // 获取模块信息
    async getModuleData(params) {
        return this._http
            .getProj("common/ComProjectModule", params)
            .toPromise();
    }

    // 改变模块选项
    async _changeModuleValue($event?) {
        // 选择功能模块，首先加载服务端配置列表
        if (this._funcValue.length > 0) {
            this._moduleId = this._funcValue[this._funcValue.length - 1];
            this.load();
            this.clearInfo();
        }
    }

    arrayToTree(data, parentid) {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const obj = { label: data[i].name, value: data[i].Id };
                temp = this.arrayToTree(data, data[i].Id);
                if (temp.length > 0) {
                    obj["children"] = temp;
                } else {
                    obj["isLeaf"] = true;
                }
                result.push(obj);
            }
        }
        return result;
    }

    async load(condition?) {
        let param = {
            _page: this.pageIndex,
            _rows: this.pageSize,
            _subResourceName: "ComSqlScriptParameter",
            _subListRefPropName: "sqlScriptId",
            _subSort: "orderCode"
        };

        if (condition) {
            param = { ...param, ...condition };
        }

        const pid = this._moduleId ? this._moduleId : null;
        const response = await this._http
            .get(`common/ComProjectModule/${pid}/ComSqlScript`, param)
            .toPromise();
        if (response.isSuccess) {
            this.tableData = response.data.rows;
            this.total = response.data.total;
            this.tableData.map(d => {
                d["expand"] = false;
                d["selected"] = false;
                if (d.children && d.children.length > 0) {
                    d["parameterList"] = d.children;
                }
            });
        }
        this.loading = false;
    }

    selectRow(row) {
        this.tableData.map(d => {
            d.selected = false;
        });
        row.selected = true;
        this.editor.setValue(row.sqlScriptContent);
        this._scriptName = row.sqlScriptCaption;
        this._resourceName = row.sqlScriptResourceName;
        this._selectedRow = row;
    }

    add() {
        this.editor.setValue("");
        this.clearInfo();
    }

    async save() {
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
            this._message.create("success", "SQL 保存成功");
            this.load();
            this.clearInfo();
        } else {
            this._message.create("error", returnValue.message);
        }
    }

    clearInfo() {
        this._selectedRow = null;
        this._scriptName = null;
        this._resourceName = null;
        this.editor.setValue("");
    }

    // 删除SQL语句
    delete(id) {
        (async () => {
            const resSql = await this.delSql(id);
            const resRelative = await this.delSqlRelative(id);
            if (resSql.isSuccess) {
                this._message.create("success", "SQL 删除成功");
                this.load();
                this.clearInfo();
            } else {
                this._message.create("error", resSql.message);
            }
        })();
    }

    // 删除SQL 参数
    deleteParam(id) {}

    private async addSql(sql) {
        const params = {
            isAnalysisParameters: 1,
            sqlScriptContent: sql,
            sqlScriptCaption: this._scriptName,
            sqlScriptResourceName: this._resourceName,
            isEnabled: 1,
            isNeedDeploy: 1,
            requestMethod: this.scriptModel.join(","),
            isImmediateCreate: 1
        };
        return this._http.post(`common/ComSqlScript`, params).toPromise();
    }

    private async addSqlRelative(sqlId) {
        const params = {
            leftId: this._moduleId,
            rightId: sqlId,
            leftResourceName: "ComProjectModule",
            rightResourceName: "ComSqlScript"
        };
        return this._http.post("common/SysDataLinks", params).toPromise();
    }

    private async delSql(id) {
        return this._http
            .delete(`common/ComSqlScript`, { _ids: id })
            .toPromise();
    }

    private async delSqlParam(id) {}
    // 删除SQL关联表数据
    private async delSqlRelative(id) {
        const params = {
            rightId: id,
            leftId: this._moduleId
        };
        return this._http.delete("common/SysDataLinks", params).toPromise();
    }

    private async updateSql(sql) {
        const params = {
            Id: this._selectedRow["Id"],
            sqlScriptContent: sql,
            sqlScriptCaption: this._scriptName,
            sqlScriptResourceName: this._resourceName,
            isEnabled: 1,
            isNeedDeploy: 1,
            requestMethod: this.scriptModel.join(","),
            isAnalysisParameters: 1,
            isImmediateCreate: 1
        };
        return this._http.put(`common/ComSqlScript`, params).toPromise();
    }

    setEnabledText(val) {
        return val === 1 ? "启用" : "禁用";
    }

    setPublishText(val) {
        return val === 1 ? "已发布" : "未发布";
    }

    ngOnDestroy() {}

    cancel() {}
}

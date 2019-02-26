import {
    Component,
    OnInit,
    ViewChild,
    Input,
    EventEmitter,
    Output
} from "@angular/core";
import { BsnTableComponent } from "@shared/business/bsn-data-table/bsn-table.component";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "cn-form-select-grid,[cn-form-select-grid]",
    templateUrl: "./cn-form-select-grid.component.html",
    styleUrls: ["./cn-form-select-grid.component.css"]
})
export class CnFormSelectGridComponent implements OnInit {
    @Input()
    config;
    @Input()
    value;
    @Input()
    bsnData;
    @Input()
    rowData;
    @Input()
    dataSet;
    @Input()
    casadeData={};
    @Input()
    changeConfig;
    @Output()
    updateValue = new EventEmitter();
    formGroup: FormGroup;
    @ViewChild("table")
    table: BsnTableComponent;
    resultData;
    cascadeValue = {};
    cascadeSetValue = {};

    isVisible = false;
    isConfirmLoading = false;
    _value;
    _valuetext;
    permissions = [];
    constructor() { }
    nzWidth = 1024;
    // 模板配置

    ngOnInit(): void {
        // this._value = this.formGroup.value[this.config.name];
        if (this.changeConfig) {
            if (this.changeConfig['cascadeValue']) {
                // cascadeValue
                for (const key in this.changeConfig['cascadeValue']) {
                    if (this.changeConfig['cascadeValue'].hasOwnProperty(key)) {
                        this.cascadeValue[key] = this.changeConfig['cascadeValue'][key];
                    }
                }
            }
        }

        if (this.cascadeValue) {
            if (this.casadeData) {
                this.casadeData = {};
            }
            this.casadeData['cascadeValue'] = this.cascadeValue;
        }

        if (this.casadeData) {
            for (const key in this.casadeData) {
                // 临时变量的整理
                if (key === "cascadeValue") {
                    for (const casekey in this.casadeData["cascadeValue"]) {
                        if (
                            this.casadeData["cascadeValue"].hasOwnProperty(casekey)
                        ) {
                            this.cascadeValue[casekey] = this.casadeData["cascadeValue"][casekey];
                        }
                    }
                } else if (key === "options") {
                    // 目前版本，静态数据集 优先级低
                    this.config["options"] = this.casadeData["options"];
                } else if (key === "setValue") {
                    this.cascadeSetValue["setValue"] = JSON.parse(
                        JSON.stringify(this.casadeData["setValue"])
                    );
                    delete this.casadeData["setValue"];
                }
            }
        }

        if (this.config.select) {
            if (!this.config.select.nzWidth) {
                this.config.select.nzWidth = 768;
            }
            if (!this.config.select.title) {
                this.config.select.title = "弹出列表";
            }
        }

        // 修改配置列表配置，修改ajax配置，将配置

        if (!this.config.labelName) {
            this.config.labelName = "name";
        }
        if (!this.config.valueName) {
            this.config.valueName = "Id";
        }
        this.resultData = this.table.dataList;

        if (this.cascadeSetValue.hasOwnProperty("setValue")) {
            // this.selectedBycascade();
            // 表单的级联赋值在上层，控制方式待定
        } else {
            // this.selectedByLoaded();
        }
    }

    showModal(): void {
        this.isVisible = true;
        this.table.value = this._value;
    }

    handleOk(): void {
        this.isVisible = false;
        // 此处简析 多选，单选【个人建议两种组件，返回值不相同，单值（ID值），多值（ID数组）】
        if (this.table._selectRow) {
            this._valuetext = this.table._selectRow[this.config.labelName];
            this._value = this.table._selectRow[this.config.valueName];
        } else {
            this._valuetext = null;
            this._value = null;
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    async valueChange(name?) {
        this.resultData = this.table.dataList ? this.table.dataList : [];
        const labelName = this.config.labelName ? this.config.labelName : 'name';
        const valueName = this.config["valueName"] ? this.config["valueName"] : "Id";
        if (name) {
            const backValue = { name: this.config.name, value: name };
            // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
            if (this.resultData) {
                // valueName
                const index = this.resultData.findIndex(
                    item => item[valueName] === name
                );
                if (this.resultData) {
                    if (index >= 0) {
                        if (this.resultData[index][labelName]) {
                            this._valuetext = this.resultData[index][labelName];
                        }
                        backValue["dataItem"] = this.resultData[index];
                    } else {
                        // 取值
                        const componentvalue = {};
                        componentvalue[valueName] = name;
                        if (this.config.ajaxConfig) {
                            const backselectdata = await this.table.loadByselect(
                                this.config.ajaxConfig,
                                componentvalue,
                                this.bsnData,
                                this.casadeData
                            );
                            if (backselectdata.hasOwnProperty(labelName)) {
                                this._valuetext = backselectdata[labelName];
                            } else {
                                this._valuetext = this._value;
                            }
                            backValue["dataItem"] = backselectdata;
                        } else {
                            this._valuetext = this._value;
                        }
                    }
                }

            }
            // this.value['dataText'] = this._valuetext;
            this.updateValue.emit(backValue);
        } else {
            const backValue = { name: this.config.name, value: name };
            this.updateValue.emit(backValue);
        }
    }
}

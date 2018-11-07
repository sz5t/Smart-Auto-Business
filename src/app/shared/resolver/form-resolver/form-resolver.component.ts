import { LayoutResolverComponent } from "./../layout-resolver/layout-resolver.component";
import { CnFormWindowResolverComponent } from "@shared/resolver/form-resolver/form-window-resolver.component";
import { BsnUploadComponent } from "@shared/business/bsn-upload/bsn-upload.component";
import { BSN_COMPONENT_MODES } from "@core/relative-Service/BsnTableStatus";
import { CacheService } from "@delon/cache";
import { CommonTools } from "./../../../core/utility/common-tools";
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Inject,
    OnDestroy,
    AfterViewInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "@core/utility/api-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import {
    RelativeService,
    RelativeResolver
} from "@core/relative-Service/relative-service";
import { CnComponentBase } from "@shared/components/cn-component-base";
import {
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_FORM_STATUS,
    BSN_OUTPOUT_PARAMETER_TYPE
} from "@core/relative-Service/BsnTableStatus";
import { Observable } from "rxjs";
import { Observer } from "rxjs";

@Component({
    selector: "cn-form-resolver,[cn-form-resolver]",
    templateUrl: "./form-resolver.component.html",
    styles: [``]
})
export class FormResolverComponent extends CnComponentBase
    implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @Input()
    config;
    @Input()
    permissions = [];
    @Input()
    dataList;
    @Input()
    initData;
    @Input()
    formTitle;
    @Input()
    formValue;
    @Input()
    editable = BSN_FORM_STATUS.CREATE;

    form: FormGroup;
    @Output()
    submit: EventEmitter<any> = new EventEmitter<any>();
    _relativeResolver;
    isSpinning = false;
    _statusSubscription;
    _cascadeSubscription;
    _isSaving = false;
    changeConfig = [];
    formconfigcontrol = {}; // liu 表单配置
    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private cacheService: CacheService,
        private message: NzMessageService,
        private modalService: NzModalService,
        private _messageService: RelativeService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngAfterViewInit() {
        if (this.config.ajaxConfig) {
            if (this.config.componentType) {
                if (!this.config.componentType.child) {
                    this.load();
                }
            } else {
                this.load();
            }
        } else if (this.formValue) {
            // 表单加载初始化数据
            this.setFormValue(this.formValue);
        }
    }

    // region: 组件生命周期事件
    ngOnInit() {
        if (this.config.editable) {
            this.editable = this.config.editable;
        }
        // 做参数简析
        if (this.config.select) {
            this.config.select.forEach(selectItem => {
                this.config.forms.forEach(formItem => {
                    formItem.controls.forEach(control => {
                        if (control) {
                            if (control.name === selectItem.name) {
                                control["select"] = selectItem.config;
                            }
                        }
                    });
                });
            });
        }

        if (this.initData) {
            this.initValue = this.initData;
        }
        if (this.cacheService) {
            this.cacheValue = this.cacheService;
        }
        this.form = this.createGroup();
        this.resolverRelation();

        this.config.forms.forEach(formItem => {
            formItem.controls.forEach(control => {
                this.formconfigcontrol[control.name] = control;
            });
        });

        this.caseLoad(); // liu 20180521 测试
    }

    ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    // region: 解析消息
    private resolverRelation() {
        // 注册按钮状态触发接收器
        this._statusSubscription = this.stateEvents.subscribe(updateState => {
            if (updateState._viewId === this.config.viewId) {
                const option = updateState.option;
                switch (updateState._mode) {
                    case BSN_COMPONENT_MODES.REFRESH:
                        this.load();
                        break;
                    case BSN_COMPONENT_MODES.CREATE:
                        this.editable = BSN_FORM_STATUS.CREATE;
                        this.form.reset();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        this.load();
                        this.editable = BSN_FORM_STATUS.EDIT;
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        this.load();
                        this.editable = BSN_FORM_STATUS.TEXT;
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        if (option.ajaxConfig) {
                            this.saveForm_2(option.ajaxConfig);
                        }
                        break;
                    case BSN_COMPONENT_MODES.DELETE:
                        if (option.ajaxConfig) {
                            this.modalService.confirm({
                                nzTitle: "确认删除当前数据？",
                                nzContent: "",
                                nzOnOk: () => {
                                    this.delete(option.ajaxConfig);
                                },
                                nzOnCancel() {}
                            });
                        }
                        break;
                    case BSN_COMPONENT_MODES.EXECUTE:
                        if (option.ajaxConfig) {
                            this._resolveAjaxConfig(option.ajaxConfig);
                        }
                        break;
                    case BSN_COMPONENT_MODES.WINDOW:
                        this.windowDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        this.formDialog(option);
                        break;
                    case BSN_COMPONENT_MODES.UPLOAD:
                        this.uploadDialog(option);
                        break;
                }
            }
        });
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, "saveForm", () => {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId,
                        {
                            data: this.value
                        }
                    )
                );
            });
            // this.after(this, 'saveForm_2', () => {
            //     this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH,
            //         this.config.viewId, {
            //         data: this.value
            //     }));
            // });
        }
        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(
                cascadeEvent => {
                    // 解析子表消息配置
                    if (
                        this.config.relations &&
                        this.config.relations.length > 0
                    ) {
                        this.config.relations.forEach(relation => {
                            if (
                                relation.relationViewId === cascadeEvent._viewId
                            ) {
                                // 获取当前设置的级联的模式
                                const mode =
                                    BSN_COMPONENT_CASCADE_MODES[
                                        relation.cascadeMode
                                    ];
                                // 获取传递的消息数据
                                const option = cascadeEvent.option;
                                // 解析参数
                                if (
                                    relation.params &&
                                    relation.params.length > 0
                                ) {
                                    relation.params.forEach(param => {
                                        if (!this.tempValue) {
                                            this.tempValue = {};
                                        }
                                        this.tempValue[param["cid"]] =
                                            option.data[param["pid"]];
                                    });
                                }
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    // endregion

    ngOnChanges() {
        if (this.form) {
            const controls = Object.keys(this.form.controls);
            const configControls = this.controls.map(item => item.name);

            controls
                .filter(control => !configControls.includes(control))
                .forEach(control => this.form.removeControl(control));

            configControls
                .filter(control => !controls.includes(control))
                .forEach(name => {
                    const config = this.controls.find(
                        control => control.name === name
                    );
                    // const config = this.config.forms.find(control => control.name === name);
                    this.form.addControl(name, this.createControl(config));
                });
        }
    }

    // endregion

    // region: 表单功能实现
    get controls() {
        const controls = [];
        this.config.forms.map(formItem => {
            const items = formItem.controls.filter(({ type }) => {
                return type !== "button" && type !== "submit";
            });
            controls.push(...items);
        });
        return controls;
    }

    get changes() {
        return this.form.valueChanges;
    }

    get valid() {
        return this.form.valid;
    }

    get value() {
        return this.form.value;
    }

    resetForm() {
        this.form.reset();
    }

    createGroup() {
        const group = this.formBuilder.group({});
        this.controls.forEach(control =>
            group.addControl(control.name, this.createControl(control))
        );
        return group;
    }

    createControl(control) {
        const { disabled, value } = control;
        const validations = this.getValidations(control.validations);
        return this.formBuilder.control({ disabled, value }, validations);
    }

    getValidations(validations) {
        const validation = [];
        validations &&
            validations.forEach(valid => {
                if (
                    valid.validator === "required" ||
                    valid.validator === "email"
                ) {
                    validation.push(Validators[valid.validator]);
                } else if (
                    valid.validator === "minLength" ||
                    valid.validator === "maxLength"
                ) {
                    validation.push(Validators[valid.validator](valid.length));
                } else if (valid.validator === "pattern") {
                    validation.push(Validators[valid.validator](valid.pattern));
                }
            });
        return validation;
    }

    getFormControl(name) {
        return this.form.controls[name];
    }

    _submitForm($event) {
        event.preventDefault();
        event.stopPropagation();
        this.submit.emit(this.value);
    }

    setValue(name: string, value: any) {
        const control = this.form.controls[name];
        if (control) {
            control.setValue(value, { emitEvent: true });
        }
    }

    setFormValue(data) {
        if (data) {
            for (const d in data) {
                if (data.hasOwnProperty(d)) {
                    if (this.formconfigcontrol[d]) {
                        if (
                            this.formconfigcontrol[d]["type"] ===
                                "selectMultiple" ||
                            this.formconfigcontrol[d]["type"] ===
                                "selectTreeMultiple"
                        ) {
                            let ArrayValue = [];
                            if (data[d]) {
                                if (data[d].length > 0) {
                                    ArrayValue = data[d].split(",");
                                }
                            }
                            this.setValue(d, ArrayValue);
                            // console.log('拼接', ArrayValue);
                        } else {
                            this.setValue(d, data[d]);
                        }
                    } else {
                        this.setValue(d, data[d]);
                    }
                }
            }
        }
    }

    // endregion

    // region: 数据处理
    async execAjax(ajaxConfig) {
        let url;
        const params = CommonTools.parametersResolver({
            params: ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheService
        });
        if (this.isString(ajaxConfig.url)) {
            url = ajaxConfig.url;
        } else {
            const pc = CommonTools.parametersResolver({
                params: ajaxConfig.url.params,
                tempValue: this.tempValue,
                initValue: this.initValue,
                cacheValue: this.cacheService
            });
            url =
                ajaxConfig.url["parent"] +
                "/" +
                pc +
                "/" +
                ajaxConfig.url["child"];
        }
        if (ajaxConfig.ajaxType === "getById") {
            return this.apiService
                .getById(`${url}/${params["Id"]}`)
                .toPromise();
        }
    }

    isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    async load() {
        this.isSpinning = true;
        const ajaxData = await this.execAjax(this.config.ajaxConfig);
        if (ajaxData) {
            if (ajaxData.data) {
                this.setFormValue(ajaxData.data);
                // 给主键赋值
                if (this.config.keyId) {
                    this.tempValue["_id"] = ajaxData.data[this.config.keyId];
                } else {
                    if (ajaxData.data["Id"]) {
                        this.tempValue["_id"] = ajaxData.data["Id"];
                    }
                }
            } else {
                this.tempValue["_id"] && delete this.tempValue["_id"];
                this.form.reset();
            }
        } else {
            this.tempValue["_id"] && delete this.tempValue["_id"];
            this.form.reset();
        }
        this.isSpinning = false;
    }

    async saveForm_2(ajaxConfigs) {
        let result;
        const method = this.editable;
        if (method === BSN_FORM_STATUS.TEXT) {
            this.message.warning("请在编辑数据后进行保存！");
            return false;
        } else {
            const index = ajaxConfigs.findIndex(
                item => item.ajaxType === method
            );
            result = await this[method](ajaxConfigs[index]);
        }
    }

    private _resolveAjaxConfig(ajaxConfigs) {
        const index = ajaxConfigs.findIndex(item => item.ajaxType === "post");
        const c = ajaxConfigs[index];
        this._getAjaxConfig(c, ajaxConfigs);
    }

    private _getAjaxConfig(c, ajaxConfigs) {
        if (c) {
            if (c.message) {
                this.modalService.confirm({
                    nzTitle: c.title ? c.title : "提示",
                    nzContent: c.message ? c.message : "",
                    nzOnOk: () => {
                        (async () => {
                            const response = await this.executeAction(c);
                            // 处理输出参数
                            if (c.outputParams) {
                                this._outputParametersResolver(
                                    c,
                                    response,
                                    ajaxConfigs,
                                    () => {
                                        this.load();
                                    }
                                );
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(
                                    response,
                                    "操作成功",
                                    () => {
                                        this.load();
                                    }
                                );
                            }
                        })();
                    },
                    nzOnCancel() {}
                });
            } else {
                (async () => {
                    const response = await this.executeAction(c);
                    // 处理输出参数
                    if (c.outputParams) {
                        this._outputParametersResolver(
                            c,
                            response,
                            ajaxConfigs,
                            () => {
                                this.load();
                            }
                        );
                    } else {
                        // 没有输出参数，进行默认处理
                        this.showAjaxMessage(response, "操作成功", () => {
                            this.load();
                        });
                    }
                })();
            }
        }
    }

    /**
     *
     * @param outputParams
     * @param response
     * @param callback
     * @returns {Array}
     * @private
     * 1、输出参数的配置中，消息类型的参数只能设置一次
     * 2、值类型的结果可以设置多个
     * 3、表类型的返回结果可以设置多个
     */
    private _outputParametersResolver(c, response, ajaxConfig, callback) {
        const result = false;
        if (response.isSuccess) {
            const msg =
                c.outputParams[
                    c.outputParams.findIndex(
                        m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.MESSAGE
                    )
                ];
            const value =
                c.outputParams[
                    c.outputParams.findIndex(
                        m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.VALUE
                    )
                ];
            const table =
                c.outputParams[
                    c.outputParams.findIndex(
                        m => m.dataType === BSN_OUTPOUT_PARAMETER_TYPE.TABLE
                    )
                ];
            const msgObj = response.data[msg.name]
                ? response.data[msg.name].split(":")
                : "";
            // const valueObj = response.data[value.name] ? response.data[value.name] : [];
            // const tableObj = response.data[table.name] ? response.data[table.name] : [];
            if (msgObj && msgObj.length > 1) {
                const messageType = msgObj[0];
                let options;
                switch (messageType) {
                    case "info":
                        options = {
                            nzTitle: "提示",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.modalService[messageType](options);
                        break;
                    case "error":
                        options = {
                            nzTitle: "提示",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.modalService[messageType](options);
                        break;
                    case "confirm":
                        options = {
                            nzTitle: "提示",
                            nzContent: msgObj[1],
                            nzOnOk: () => {
                                // 是否继续后续操作，根据返回状态结果
                                const childrenConfig = ajaxConfig.filter(
                                    f => f.parentName && f.parentName === c.name
                                );
                                childrenConfig &&
                                    childrenConfig.map(currentAjax => {
                                        this._getAjaxConfig(
                                            currentAjax,
                                            ajaxConfig
                                        );
                                    });
                            },
                            nzOnCancel: () => {}
                        };
                        this.modalService[messageType](options);
                        break;
                    case "warning":
                        options = {
                            nzTitle: "提示",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.modalService[messageType](options);
                        break;
                    case "success":
                        options = {
                            nzTitle: "",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.message.success(msgObj[1]);
                        callback && callback();
                        break;
                }
                // if(options) {
                //     this.modalService[messageType](options);
                //
                //     // 如果成功则执行回调
                //     if(messageType === 'success') {
                //         callback && callback();
                //     }
                // }
            } else {
                this.message.error(
                    "存储过程返回结果异常：未获得输出的消息内容"
                );
            }
        } else {
            this.message.error("操作异常：", response.message);
        }
    }

    /**
     * 数据访问返回消息处理
     * @param result
     * @param message
     * @param callback
     */
    showAjaxMessage(result, message?, callback?) {
        const rs: { success: boolean; msg: string[] } = {
            success: true,
            msg: []
        };
        let suc = false;
        if (result && Array.isArray(result)) {
            result.forEach(res => {
                rs["success"] = rs["success"] && res.isSuccess;
                if (!res.isSuccess) {
                    rs.msg.push(res.message);
                }
            });
            if (rs.success) {
                this.message.success(message);
                suc = true;
            } else {
                this.message.error(rs.msg.join("<br/>"));
            }
        } else {
            if (result.isSuccess) {
                this.message.success(message);
                suc = true;
            } else {
                this.message.error(result.message);
            }
        }
        if (callback && suc) {
            callback();
            if (
                this.config.componentType &&
                this.config.componentType.parent === true
            ) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }
    }

    private async executeAction(postConfig) {
        const url = this._buildURL(postConfig.url);
        const params = CommonTools.parametersResolver({
            params: postConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            componentValue: this.value,
            cacheValue: this.cacheService
        });
        return this.execute(url, postConfig.ajaxType, params);
    }

    /*  // async saveForm() {
     //     let result;
     //     const buttons = this.config.toolbar.buttons;
     //     if (buttons) {
     //         const index = buttons.findIndex(item => item.name === 'saveForm');
     //         if (buttons[index].ajaxConfig) {
     //             const pconfig = JSON.parse(JSON.stringify(buttons[index].ajaxConfig));
     //             if (this.tempValue['_id']) {
     //                 // 修改保存
     //                 const ajaxData = await this.execAjax(pconfig['put'], this.value);
     //                 if (ajaxData.isSuccess) {
     //                     this.message.success('保存成功');
     //                     result = true;
     //                 } else {
     //                     this.message.error(`保存失败！<br/> ${ajaxData.message}`);
     //                     result = false;
     //                 }
 
     //             } else {
     //                 // 新增保存
     //                 if (Array.isArray(pconfig['post'])) {
     //                     for (let i = 0; i < pconfig['post'].length; i++) {
     //                         const ajaxData = await this.execAjax(pconfig['post'][i], this.value);
     //                         if (ajaxData) {
     //                             if (pconfig['post'][i]['output']) {
     //                                 pconfig['post'][i]['output'].forEach(out => {
     //                                     this.tempValue[out.name] = ajaxData.Data[out['dataName']];
     //                                 });
     //                             }
     //                         }
     //                     }
     //                 } else {
     //                     const ajaxData = await this.execAjax(pconfig['add'], this.value);
     //                     if (ajaxData.isSuccess) {
     //                         this.message.success('保存成功');
     //                         result = true;
     //                     } else {
     //                         this.message.error(`保存失败！<br/> ${ajaxData.message}`);
     //                         result = false;
     //                     }
 
     //                 }
     //             }
     //         }
     //     }
     //     return result;
     // } */

    searchForm() {
        this.searchFormByValue(this.value);
    }

    searchFormByValue(data) {
        // console.log(data);
    }

    /* async buttonAction(btn) {
        let result = false;
        this._isSaving = true;
        if (this.checkFormValidation()) {

            if (this[btn.name] && btn.ajaxConfig) {
                result = await this[btn.name](btn.ajaxConfig);
            } else if (this[btn.name]) {
                this[btn.name]();
            } else if (btn.name === 'saveAndKeep') { // 特殊处理：执行保存并继续
                result = await this.save(btn.ajaxConfig);
            }
            if (result || !result) {
                this._isSaving = false;
            }
        } else {
            this._isSaving = false;
        }
        return result;
    } */

    private checkFormValidation() {
        if (this.form.invalid) {
            for (const i in this.form.controls) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
            return false;
        }
        return true;
    }

    /* private async save(ajaxConfig) {
        if (ajaxConfig.post) {
            return this.post(ajaxConfig.post);
        }
        if (ajaxConfig.put) {
            return this.put(ajaxConfig.put);
        }

    } */

    /**
     * 新增数据
     * @param postConfig 数据访问配置
     */
    private async post(postConfig) {
        let result = true;
        const url = this._buildURL(postConfig.url);
        const newValue = this.GetComponentValue();
        const params = CommonTools.parametersResolver({
            params: postConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            componentValue: newValue, // liu this.value,
            cacheValue: this.cacheService
        });
        const res = await this.execute(url, postConfig.ajaxType, params);
        if (res.isSuccess) {
            this.message.create("success", "操作成功");
            this.editable = BSN_FORM_STATUS.TEXT;
            this.load();
            // 发送消息 刷新其他界面
            if (
                this.config.componentType &&
                this.config.componentType.parent === true
            ) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        } else {
            this.message.create("error", res.message);
            result = false;
        }
        return result;
    }

    /**
     * 修改数据
     * @param putConfig 数据访问配置
     */
    private async put(putConfig) {
        let result = true;
        const url = this._buildURL(putConfig.url);
        const newValue = this.GetComponentValue();
        const params = CommonTools.parametersResolver({
            params: putConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            componentValue: newValue, // liu this.value,
            cacheValue: this.cacheService
        });
        if (params && !params["Id"]) {
            this.message.warning("编辑数据的Id不存在，无法进行更新！");
            return;
        } else {
            const res = await this.execute(url, putConfig.ajaxType, params);
            if (res.isSuccess) {
                this.message.create("success", "保存成功");
                this.editable = BSN_FORM_STATUS.TEXT;
                this.load();
                // 发送消息 刷新其他界面
                if (
                    this.config.componentType &&
                    this.config.componentType.parent === true
                ) {
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REFRESH,
                            this.config.viewId
                        )
                    );
                }
            } else {
                this.message.create("error", res.message);
                result = false;
            }
        }
        return result;
    }

    // 处理参数 liu
    private GetComponentValue() {
        this.formconfigcontrol; // liu 表单配置
        const ComponentValue = {};
        // 循环 this.value
        for (const key in this.value) {
            if (this.formconfigcontrol[key]) {
                if (
                    this.formconfigcontrol[key]["type"] === "selectMultiple" ||
                    this.formconfigcontrol[key]["type"] === "selectTreeMultiple"
                ) {
                    let ArrayValue = "";
                    // console.log('数组', this.value[key]);
                    this.value[key].forEach(element => {
                        ArrayValue = ArrayValue + element.toString() + ",";
                    });
                    if (ArrayValue.length > 0) {
                        ArrayValue = ArrayValue.slice(0, ArrayValue.length - 1);
                    }
                    ComponentValue[key] = ArrayValue;
                    // console.log('拼接', ArrayValue);
                } else {
                    ComponentValue[key] = this.value[key];
                }
            } else {
                ComponentValue[key] = this.value[key];
            }
        }
        return ComponentValue;
    }

    private isArray(obj) {
        // 判断对象是否是数组
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    /**
     * 删除数据
     * @param deleteConfig 数据访问配置
     */
    private async delete(deleteConfig) {
        let result = true;
        for (let i = 0, len = deleteConfig.length; i < len; i++) {
            const url = this._buildURL(deleteConfig[i].url);
            const params = CommonTools.parametersResolver({
                params: deleteConfig[i].params,
                tempValue: this.tempValue,
                initValue: this.initValue,
                componentValue: this.value,
                cacheValue: this.cacheService
            });
            if (params && !params["Id"]) {
                this.message.warning("删除数据的Id不存在，无法进行删除！");
                return;
            } else {
                const res = await this.execute(
                    url,
                    deleteConfig[i].ajaxType,
                    params
                );
                if (res.isSuccess) {
                    this.message.create("success", "删除成功");
                    this.editable = BSN_FORM_STATUS.TEXT;
                    this.form.reset();
                    // 发送消息 刷新其他界面
                    if (
                        this.config.componentType &&
                        this.config.componentType.parent === true
                    ) {
                        this.cascade.next(
                            new BsnComponentMessage(
                                BSN_COMPONENT_CASCADE_MODES.REFRESH,
                                this.config.viewId
                            )
                        );
                    }
                } else {
                    this.message.create("error", res.message);
                    result = false;
                }
            }
        }
    }

    private _buildURL(urlConfig) {
        let url = "";
        if (urlConfig && this._isUrlString(urlConfig)) {
            url = urlConfig;
        }
        return url;
    }

    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === "[object String]";
    }

    private async execute(url, method, body) {
        return this.apiService[method](url, body).toPromise();
    }

    initParameters(data?) {
        if (!this.tempValue) {
            this.tempValue = {};
        }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
        // console.log('初始化参数', this.tempValue);
    }

    initParametersLoad(data?) {
        if (!this.tempValue) {
            this.tempValue = {};
        }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
        this.load();
        console.log("初始化参数并load 主子刷新", this.tempValue);
    }

    /**
     * 弹出上传对话
     * @param option
     */
    uploadDialog(option) {
        if (this.config.uploadDialog && this.config.uploadDialog.length > 0) {
            const index = this.config.uploadDialog.findIndex(
                item => item.name === option.actionName
            );
            this.openUploadDialog(this.config.uploadDialog[index]);
        }
    }

    /**
     * 弹出上传表单
     * @param dialog
     * @returns {boolean}
     */
    private openUploadDialog(dialog) {
        if (!this.value) {
            this.message.warning("请选中一条需要添加附件的记录！");
            return false;
        }
        const footer = [];
        const obj = {
            _id: this.value[dialog.keyId],
            _parentId: this.tempValue["_parentId"],
            ...this.value,
            ...this.tempValue
        };
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width ? dialog.width : 400,
            nzContent: BsnUploadComponent,
            nzComponentParams: {
                config: dialog.ajaxConfig,
                refObj: obj
            },
            nzFooter: footer
        });
    }

    /**
     * 弹出窗体
     * @param option
     */
    windowDialog(option) {
        if (this.config.windowDialog && this.config.windowDialog.length > 0) {
            const index = this.config.windowDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showLayout(this.config.windowDialog[index]);
        }
    }

    /**
     * 弹出表单
     * @param option
     */
    formDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showForm(this.config.formDialog[index]);
        }
    }

    /**
     * 单条数据表单
     * @param dialog
     * @returns {boolean}
     */
    private showForm(dialog) {
        let obj;
        if (dialog.type === "add") {
        } else if (dialog.type === "edit") {
            if (!this.value) {
                this.message.warning("请选中一条需要添加附件的记录！");
                return false;
            }
        }
        obj = {
            _id: this.value[dialog.keyId] ? this.value[dialog.keyId] : "",
            // _parentId: this.tempValue['_parentId'] ? this.tempValue['_parentId'] : ''
            ...this.tempValue
        };

        const footer = [];
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzContent: CnFormWindowResolverComponent,
            nzComponentParams: {
                config: dialog,
                tempValue: obj,
                permissions: this.permissions
            },
            nzFooter: footer
        });

        if (dialog.buttons) {
            dialog.buttons.forEach(btn => {
                const button = {};
                button["label"] = btn.text;
                button["type"] = btn.type ? btn.type : "default";
                button["onClick"] = componentInstance => {
                    if (btn["name"] === "save") {
                        (async () => {
                            const result = await componentInstance.buttonAction(
                                btn
                            );
                            this.showAjaxMessage(result, "保存成功", () => {
                                modal.close();
                                this.load();
                            });
                        })();
                    } else if (btn["name"] === "saveAndKeep") {
                        (async () => {
                            const result = await componentInstance.buttonAction(
                                btn
                            );
                            this.showAjaxMessage(result, "保存成功", () => {
                                modal.close();
                                this.load();
                            });
                        })();
                    } else if (btn["name"] === "close") {
                        modal.close();
                    } else if (btn["name"] === "reset") {
                        this._resetForm(componentInstance);
                    }
                };
                footer.push(button);
            });
        }
    }
    /**
     * 重置表单
     * @param comp
     * @private
     */
    private _resetForm(comp: FormResolverComponent) {
        comp.resetForm();
    }
    /**
     * 弹出批量处理表单
     * @param option
     */
    formBatchDialog(option) {
        if (this.config.formDialog && this.config.formDialog.length > 0) {
            const index = this.config.formDialog.findIndex(
                item => item.name === option.actionName
            );
            this.showBatchForm(this.config.formDialog[index]);
        }
    }

    /**
     * 弹出页面
     * @param dialog
     */
    private showLayout(dialog) {
        const footer = [];
        this.apiService.getLocalData(dialog.layoutName).subscribe(data => {
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: LayoutResolverComponent,
                nzComponentParams: {
                    config: data,
                    initData: { ...this.value, ...this.tempValue },
                    permissions: this.permissions
                },
                nzFooter: footer
            });
            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button["label"] = btn.text;
                    button["type"] = btn.type ? btn.type : "default";
                    button["show"] = true;
                    button["onClick"] = componentInstance => {
                        if (btn["name"] === "save") {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn
                                );
                                if (result) {
                                    modal.close();
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn["name"] === "saveAndKeep") {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn
                                );
                                if (result) {
                                    // todo: 操作完成当前数据后需要定位
                                    this.load();
                                }
                            })();
                        } else if (btn["name"] === "close") {
                            modal.close();
                            this.load();
                        } else if (btn["name"] === "reset") {
                            this._resetForm(componentInstance);
                        } else if (btn["name"] === "ok") {
                            modal.close();
                            this.load();
                            //
                        }
                    };
                    footer.push(button);
                });
            }
        });
    }

    /**
     * 批量编辑表单
     * @param dialog
     */
    private showBatchForm(dialog) {
        const footer = [];
        const checkedItems = [];
        this.dataList.map(item => {
            if (item.checked) {
                checkedItems.push(item);
            }
        });
        if (checkedItems.length > 0) {
            const obj = {
                checkedRow: checkedItems,
                ...this.tempValue
            };
            const modal = this.modalService.create({
                nzTitle: dialog.title,
                nzWidth: dialog.width,
                nzContent: CnFormWindowResolverComponent,
                nzComponentParams: {
                    config: dialog,
                    tempValue: obj,
                    permissions: this.permissions
                },
                nzFooter: footer
            });

            if (dialog.buttons) {
                dialog.buttons.forEach(btn => {
                    const button = {};
                    button["label"] = btn.text;
                    button["type"] = btn.type ? btn.type : "default";
                    button["onClick"] = componentInstance => {
                        if (btn["name"] === "batchSave") {
                            (async () => {
                                const result = await componentInstance.buttonAction(
                                    btn
                                );
                                this.showAjaxMessage(result, "保存成功", () => {
                                    modal.close();
                                    this.load();
                                });
                            })();
                        } else if (btn["name"] === "close") {
                            modal.close();
                        } else if (btn["name"] === "reset") {
                            this._resetForm(componentInstance);
                        }
                    };
                    footer.push(button);
                });
            }
        } else {
            this.message.create("warning", "请先选中需要处理的数据");
        }
    }
    // endregion

    cascadeList = {};

    caseLoad() {
        this.cascadeList = {};
        // region: 解析开始
        if (this.config.cascade)
            this.config.cascade.forEach(c => {
                this.cascadeList[c.name] = {}; // 将关系维护到一个对象中
                // region: 解析具体对象开始
                c.CascadeObjects.forEach(cobj => {
                    // 具体对象
                    this.cascadeList[c.name][cobj.cascadeName] = {};

                    const dataType = [];
                    const valueType = [];
                    cobj["cascadeDataItems"].forEach(item => {
                        // 数据关联 （只是单纯的数据关联，内容只有ajax）
                        // cobj.data
                        const dataTypeItem = {};
                        if (item["caseValue"]) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            dataTypeItem["regularType"] = item.caseValue.type;
                            dataTypeItem["valueName"] =
                                item.caseValue.valueName;
                            dataTypeItem["regular"] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]["type"] =
                            item.data.type;
                        dataTypeItem["type"] = item.data.type;
                        if (item.data.type === "option") {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                "option"
                            ] = item.data.option_data.option;
                            dataTypeItem["option"] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === "ajax") {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]["ajax"] =
                                item.data.ajax_data.option;
                            dataTypeItem["ajax"] = item.data.ajax_data.option;
                        }
                        if (item.data.type === "setValue") {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                "setValue"
                            ] = item.data.setValue_data.option;
                            dataTypeItem["setValue"] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === "show") {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]["show"] =
                                item.data.show_data.option;
                            dataTypeItem["show"] = item.data.show_data.option;
                        }
                        if (item.data.type === "relation") {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                "relation"
                            ] = item.data.relation_data.option;
                            dataTypeItem["relation"] =
                                item.data.relation_data.option;
                        }

                        dataType.push(dataTypeItem);
                    });

                    cobj["cascadeValueItems"].forEach(item => {
                        const valueTypeItem = {};
                        if (item.caseValue) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            valueTypeItem["regularType"] = item.caseValue.type;
                            valueTypeItem["valueName"] =
                                item.caseValue.valueName;
                            valueTypeItem["regular"] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]["type"] =
                            item.data.type;
                        valueTypeItem["type"] = item.data.type;
                        if (item.data.type === "option") {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                "option"
                            ] = item.data.option_data.option;
                            valueTypeItem["option"] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === "ajax") {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]["ajax"] =
                                item.data.ajax_data.option;
                            valueTypeItem["ajax"] = item.data.ajax_data.option;
                        }
                        if (item.data.type === "setValue") {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                "setValue"
                            ] = item.data.setValue_data.option;
                            valueTypeItem["setValue"] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === "show") {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]["show"] =
                                item.data.show_data.option;
                            valueTypeItem["show"] = item.data.show_data.option;
                        }
                        if (item.data.type === "relation") {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                "relation"
                            ] = item.data.relation_data.option;
                            valueTypeItem["relation"] =
                                item.data.relation_data.option;
                        }
                        valueType.push(valueTypeItem);
                    });

                    this.cascadeList[c.name][cobj.cascadeName][
                        "dataType"
                    ] = dataType;
                    this.cascadeList[c.name][cobj.cascadeName][
                        "valueType"
                    ] = valueType;
                });
                // endregion: 解析对象结束
            });
        // endregion： 解析结束
    }

    valueChange(data?) {
        // 第一步，知道是谁发出的级联消息（包含信息： field、json、组件类别（类别决定取值））
        // { name: this.config.name, value: name }
        const sendCasade = data.name;
        const receiveCasade = " ";

        // 第二步，根据配置，和返回值，来构建应答数据集合
        // 第三步，
        if (this.cascadeList[sendCasade]) {
            // 判断当前组件是否有级联

            // const items = formItem.controls.filter(({ type }) => {
            //   return type !== 'button' && type !== 'submit';
            // });

            const changeConfig_new = [];

            for (const key in this.cascadeList[sendCasade]) {
                // console.log('for in 配置' , key);
                this.config.forms.forEach(formsItems => {
                    formsItems.controls.forEach(control => {
                        if (control.name === key) {
                            if (this.cascadeList[sendCasade][key]["dataType"]) {
                                this.cascadeList[sendCasade][key][
                                    "dataType"
                                ].forEach(caseItem => {
                                    // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                    if (caseItem["type"] === "option") {
                                        // 在做判断前，看看值是否存在，如果在，更新，值不存在，则创建新值
                                        let Exist = false;
                                        changeConfig_new.forEach(config_new => {
                                            if (
                                                config_new.name === control.name
                                            ) {
                                                Exist = true;
                                                config_new["options"] =
                                                    caseItem["option"];
                                            }
                                        });
                                        if (!Exist) {
                                            control.options =
                                                caseItem["option"];
                                            control = JSON.parse(
                                                JSON.stringify(control)
                                            );
                                            changeConfig_new.push(control);
                                        }
                                    }
                                    if (caseItem["type"] === "ajax") {
                                        // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                        // 解析参数

                                        const cascadeValue = {};
                                        caseItem["ajax"].forEach(ajaxItem => {
                                            if (ajaxItem["type"] === "value") {
                                                cascadeValue[ajaxItem["name"]] =
                                                    ajaxItem["value"];
                                            }
                                            if (
                                                ajaxItem["type"] ===
                                                "selectValue"
                                            ) {
                                                // 选中行数据[这个是单值]
                                                cascadeValue[ajaxItem["name"]] =
                                                    data["value"];
                                            }
                                            if (
                                                ajaxItem["type"] ===
                                                "selectObjectValue"
                                            ) {
                                                // 选中行对象数据
                                                if (data.dataItem) {
                                                    cascadeValue[
                                                        ajaxItem["name"]
                                                    ] =
                                                        data.dataItem[
                                                            ajaxItem[
                                                                "valueName"
                                                            ]
                                                        ];
                                                }
                                            }
                                            // 其他取值【日后扩展部分】
                                        });
                                        let Exist = false;
                                        changeConfig_new.forEach(config_new => {
                                            if (
                                                config_new.name === control.name
                                            ) {
                                                Exist = true;
                                                config_new[
                                                    "cascadeValue"
                                                ] = cascadeValue;
                                            }
                                        });
                                        if (!Exist) {
                                            control[
                                                "cascadeValue"
                                            ] = cascadeValue;
                                            control = JSON.parse(
                                                JSON.stringify(control)
                                            );
                                            changeConfig_new.push(control);
                                        }
                                    }
                                    if (caseItem["type"] === "setValue") {
                                        // console.log('setValueinput' , caseItem['setValue'] );

                                        const setValuedata = {};
                                        if (
                                            caseItem["setValue"]["type"] ===
                                            "value"
                                        ) {
                                            // 静态数据
                                            setValuedata["data"] =
                                                caseItem["setValue"]["value"];
                                        }
                                        if (
                                            caseItem["setValue"]["type"] ===
                                            "selectValue"
                                        ) {
                                            // 选中行数据[这个是单值]
                                            setValuedata["data"] =
                                                data[
                                                    caseItem["setValue"][
                                                        "valueName"
                                                    ]
                                                ];
                                        }
                                        if (
                                            caseItem["setValue"]["type"] ===
                                            "selectObjectValue"
                                        ) {
                                            // 选中行对象数据
                                            if (data.dataItem) {
                                                setValuedata["data"] =
                                                    data.dataItem[
                                                        caseItem["setValue"][
                                                            "valueName"
                                                        ]
                                                    ];
                                            }
                                        }
                                        // 手动给表单赋值，将值
                                        if (
                                            setValuedata.hasOwnProperty("data")
                                        ) {
                                            this.setValue(
                                                key,
                                                setValuedata["data"]
                                            );
                                        }
                                    }

                                    // endregion  解析结束
                                });
                            }
                            if (
                                this.cascadeList[sendCasade][key]["valueType"]
                            ) {
                                this.cascadeList[sendCasade][key][
                                    "valueType"
                                ].forEach(caseItem => {
                                    // region: 解析开始  正则表达
                                    const reg1 = new RegExp(caseItem.regular);
                                    let regularData;
                                    if (caseItem.regularType) {
                                        if (
                                            caseItem.regularType ===
                                            "selectObjectValue"
                                        ) {
                                            if (data["dataItem"]) {
                                                regularData =
                                                    data["dataItem"][
                                                        caseItem["valueName"]
                                                    ];
                                            } else {
                                                regularData = data.data;
                                            }
                                        } else {
                                            regularData = data.data;
                                        }
                                    } else {
                                        regularData = data.data;
                                    }
                                    const regularflag = reg1.test(regularData);
                                    // console.log("正则结果：", regularflag);
                                    // endregion  解析结束 正则表达
                                    if (regularflag) {
                                        // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                        if (caseItem["type"] === "option") {
                                            let Exist = false;
                                            changeConfig_new.forEach(
                                                config_new => {
                                                    if (
                                                        config_new.name ===
                                                        control.name
                                                    ) {
                                                        Exist = true;
                                                        config_new["options"] =
                                                            caseItem["option"];
                                                    }
                                                }
                                            );
                                            if (!Exist) {
                                                control.options =
                                                    caseItem["option"];
                                                control = JSON.parse(
                                                    JSON.stringify(control)
                                                );
                                                changeConfig_new.push(control);
                                            }
                                        }
                                        if (caseItem["type"] === "ajax") {
                                            // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                            const cascadeValue = {};
                                            caseItem["ajax"].forEach(
                                                ajaxItem => {
                                                    if (
                                                        ajaxItem["type"] ===
                                                        "value"
                                                    ) {
                                                        cascadeValue[
                                                            ajaxItem["name"]
                                                        ] = ajaxItem["value"];
                                                    }
                                                    if (
                                                        ajaxItem["type"] ===
                                                        "selectValue"
                                                    ) {
                                                        // 选中行数据[这个是单值]
                                                        cascadeValue[
                                                            ajaxItem["name"]
                                                        ] = data["value"];
                                                    }
                                                    if (
                                                        ajaxItem["type"] ===
                                                        "selectObjectValue"
                                                    ) {
                                                        // 选中行对象数据
                                                        if (data.dataItem) {
                                                            cascadeValue[
                                                                ajaxItem["name"]
                                                            ] =
                                                                data.dataItem[
                                                                    ajaxItem[
                                                                        "valueName"
                                                                    ]
                                                                ];
                                                        }
                                                    }
                                                    // 其他取值【日后扩展部分】
                                                }
                                            );
                                            let Exist = false;
                                            changeConfig_new.forEach(
                                                config_new => {
                                                    if (
                                                        config_new.name ===
                                                        control.name
                                                    ) {
                                                        Exist = true;
                                                        config_new[
                                                            "cascadeValue"
                                                        ] = cascadeValue;
                                                    }
                                                }
                                            );
                                            if (!Exist) {
                                                control[
                                                    "cascadeValue"
                                                ] = cascadeValue;
                                                control = JSON.parse(
                                                    JSON.stringify(control)
                                                );
                                                changeConfig_new.push(control);
                                            }
                                        }
                                        if (caseItem["type"] === "show") {
                                            if (caseItem["show"]) {
                                                //
                                                control["hidden"] =
                                                    caseItem["show"]["hidden"];
                                            }
                                        }
                                        if (caseItem["type"] === "setValue") {
                                            // console.log('setValueinput' , caseItem['setValue'] );

                                            const setValuedata = {};
                                            if (
                                                caseItem["setValue"]["type"] ===
                                                "value"
                                            ) {
                                                // 静态数据
                                                setValuedata["data"] =
                                                    caseItem["setValue"][
                                                        "value"
                                                    ];
                                            }
                                            if (
                                                caseItem["setValue"]["type"] ===
                                                "selectValue"
                                            ) {
                                                // 选中行数据[这个是单值]
                                                setValuedata["data"] =
                                                    data[
                                                        caseItem["setValue"][
                                                            "valueName"
                                                        ]
                                                    ];
                                            }
                                            if (
                                                caseItem["setValue"]["type"] ===
                                                "selectObjectValue"
                                            ) {
                                                // 选中行对象数据
                                                if (data.dataItem) {
                                                    setValuedata["data"] =
                                                        data.dataItem[
                                                            caseItem[
                                                                "setValue"
                                                            ]["valueName"]
                                                        ];
                                                }
                                            }
                                            // 手动给表单赋值，将值
                                            if (
                                                setValuedata.hasOwnProperty(
                                                    "data"
                                                )
                                            ) {
                                                this.setValue(
                                                    key,
                                                    setValuedata["data"]
                                                );
                                            }
                                        }
                                    }
                                    // endregion  解析结束
                                });
                            }
                        }
                    });
                });
            }

            this.changeConfig = JSON.parse(JSON.stringify(changeConfig_new));
        }

        // console.log('变更后的', this.config.forms);
        // console.log('form: ', this.config.viewId, data, this.form.value);
        // // 此处有消息级联的则发值
        // // 级联值= 表单数据+当前触发级联的值组合；
        // const sendData = this.value;
        // sendData[data.name] = data.value;
        // this.cascade.next(
        //     new BsnComponentMessage(
        //         BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
        //         this.config.viewId,
        //         {
        //             data: sendData
        //         }
        //     )
        // );
        // console.log('send', sendData);
        const sendData = this.value;
        sendData[data.name] = data.value;

        if (this.config.cascadeRelation) {
            this.config.cascadeRelation.forEach(element => {
                if (element.name === data.name) {
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES[element.cascadeMode],
                            this.config.viewId,
                            {
                                data: sendData
                            }
                        )
                    );
                }
            });
        }
    }

    // 级联变化，情况大致分为三种
    // 1.值变化，其他组件值变化
    // 2.值变化，其他组件启用，禁用；是否显示该字段
    // 3.值变化，其他组件数据集变化
    //  3.1 静态数据集变化
    //  3.2 动态参数变化
    //  3.3 路由+参数
    // 4. 变化的时候，考虑默认值和原来值的问题
    // 5. 特殊的可能日期的时间计算、或者起止时间选择是否合理的判断

    // 目前解决方案，单项传递，每个组件值变化如果有级联关系，
    // 触发级联，将级联结果传递到form，动态修改配置参数

    // 结构定义
    /**
     *  是否级联{
     *     父：ture，
     *     子：false，
     *     自己：false
     * }
     * 级联内容：[
     *   {
     *     级联对象：field，
     *     类型：
     *     数据集：{} 描述级联对象的应答
     *    },
     *
     * ]
     *
     * 解析级联: 将每个列维护起来，值变化的时候动态获取
     * 每个组件实现一个 output 用来传递级联信息。
     *  应答描述；【重点】cascade
     *  主要描述，级联对象，收到级联消息后的反应
     *  特别复杂的处理，不同值-》对应不同应答。 需要一种规则语言。
     *  将添加类别 cascadeValue  创建这个临时变量，动态从中取值，拼接数据
     */
}

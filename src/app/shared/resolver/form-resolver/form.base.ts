import { CnComponentBase } from "@shared/components/cn-component-base";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { AnimationGroupPlayer } from "@angular/animations/src/players/animation_group_player";
import { CommonTools } from "@core/utility/common-tools";
import { BSN_OUTPOUT_PARAMETER_TYPE } from "@core/relative-Service/BsnTableStatus";
export class CnFormBase extends CnComponentBase {
    private _form: FormGroup;
    public get form() {
        return this._form;
    }
    public set form(value) {
        this._form = value;
    }

    private _formBuilder: FormBuilder;
    public get formBuilder(): FormBuilder {
        return this._formBuilder;
    }
    public set formBuilder(value: FormBuilder) {
        this._formBuilder = value;
    }

    private _controls;
    public get controls() {
        return this._controls;
    }
    public set controls(value) {
        this._controls = value;
    }

    private _submit;
    public get submit() {
        return this._submit;
    }
    public set submit(value) {
        this._submit = value;
    }

    private _formConfigControl;
    public get formConfigControl() {
        return this._formConfigControl ? this._formConfigControl : {};
    }
    public set formConfigControl(value) {
        this._formConfigControl = value;
    }

    private _formState;
    public get formState() {
        return this._formState;
    }
    public set formState(value) {
        this._formState = value;
    }

    constructor() {
        super();
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
        this.controls.forEach(control => {
            group.addControl(control.name, this.createControl(control));
        });
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
                if (valid.validator === "required" || valid.validator === "email") {
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

    submitForm($event) {
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
                    if (this.formConfigControl[d]) {
                        if (
                            this.formConfigControl[d]["type"] === "selectMultiple" ||
                            this.formConfigControl[d]["type"] === "selectTreeMultiple"
                        ) {
                            let ArrayValue = [];
                            if (data[d]) {
                                if (data[d].length > 0) {
                                    ArrayValue = data[d].split(",");
                                }
                            }
                            this.setValue(d, ArrayValue);
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

    checkFormValidation() {
        if (this.form.invalid) {
            for (const i in this.form.controls) {
                this.form.controls[i].markAsDirty();
                this.form.controls[i].updateValueAndValidity();
            }
            return false;
        }
        return true;
    }

    initControls(formConfig) {
        const controls = [];
        formConfig.map(formItem => {
            const items = formItem.controls.filter(({ type }) => {
                return type !== "button" && type !== "submit";
            });
            controls.push(...items);
        });
        return controls;
    }

    buildParameter(parameters) {
        const params = CommonTools.parametersResolver({
            params: parameters,
            item: this.value,
            componentValue: this.value,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        return params;
    }

    buildUrl(urlConfig) {
        let url;
        if (CommonTools.isString(urlConfig)) {
            url = urlConfig;
        } else {
            const pc = CommonTools.parametersResolver({
                params: urlConfig.params,
                tempValue: this.tempValue,
                initValue: this.initValue,
                cacheValue: this.cacheValue
            });
            url = `${urlConfig.url["parent"]}/${pc}/${urlConfig.url["child"]}`;
        }
        return url;
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
    outputParametersResolver(c, response, ajaxConfig, callback) {
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
                        this.baseModal[messageType](options);
                        break;
                    case "error":
                        options = {
                            nzTitle: "提示",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.baseModal[messageType](options);
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
                                //  目前紧支持一次执行一个分之步骤
                                this.getAjaxConfig(childrenConfig[0], ajaxConfig, callback);
                                // childrenConfig &&
                                //     childrenConfig.map(currentAjax => {
                                //         this.getAjaxConfig(
                                //             currentAjax,
                                //             ajaxConfig,
                                //             callback
                                //         );
                                //     });
                            },
                            nzOnCancel: () => {}
                        };
                        this.baseModal[messageType](options);
                        break;
                    case "warning":
                        options = {
                            nzTitle: "提示",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.baseModal[messageType](options);
                        break;
                    case "success":
                        options = {
                            nzTitle: "",
                            nzWidth: "350px",
                            nzContent: msgObj[1]
                        };
                        this.baseMessage.success(msgObj[1]);
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
                this.baseMessage.error(
                    "存储过程返回结果异常：未获得输出的消息内容"
                );
            }
        } else {
            this.baseMessage.error("操作异常：", response.message);
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
                this.baseMessage.success(message);
                suc = true;
            } else {
                this.baseMessage.error(rs.msg.join("<br/>"));
            }
        } else {
            if (result.isSuccess) {
                this.baseMessage.success(message);
                suc = true;
            } else {
                this.baseMessage.error(result.message);
            }
        }
        if (suc && callback) {
            callback();
        }
    }

    execute(url, method, body?) {
        return this.apiResource[method](url, body).toPromise();
    }

    getAjaxConfig(c, ajaxConfigs, callback?) {
        if (c) {
            const url = this.buildUrl(c.url);
            const params = this.buildParameter(c.params);
            if (c.message) {
                this.baseModal.confirm({
                    nzTitle: c.title ? c.title : "提示",
                    nzContent: c.message ? c.message : "",
                    nzOnOk: () => {
                        (async () => {
                            const response = await this.execute(url, c.ajaxType, params);
                            // 处理输出参数
                            if (c.outputParams) {
                                this.outputParametersResolver(
                                    c,
                                    response,
                                    ajaxConfigs,
                                    () => {
                                        if (callback) {
                                            callback();
                                        }
                                    }
                                );
                            } else {
                                // 没有输出参数，进行默认处理
                                this.showAjaxMessage(
                                    response,
                                    "操作成功",
                                    () => {
                                        if (callback) {
                                            callback();
                                        }
                                    }
                                );
                            }
                        })();
                    },
                    nzOnCancel() {}
                });
            } else {
                (async () => {
                    const response = await this.execute(url, c.ajaxType, params);
                    // 处理输出参数
                    if (c.outputParams) {
                        this.outputParametersResolver(
                            c,
                            response,
                            ajaxConfigs,
                            () => {
                                if (callback) {
                                    callback();
                                }
                            }
                        );
                    } else {
                        // 没有输出参数，进行默认处理
                        this.showAjaxMessage(response, "操作成功", () => {
                            if (callback) {
                                callback();
                            }
                        });
                    }
                })();
            }
        }
    }

    resolveAjaxConfig(ajaxConfig, formState, callback?) {
        const enterAjaxConfig = ajaxConfig.filter(item => !item.parent);
        if (Array.isArray(enterAjaxConfig) && enterAjaxConfig[0]) {
            this.getAjaxConfig(enterAjaxConfig[0], ajaxConfig, callback);
        } else {
            this.baseMessage.warning('配置异常,无法执行请求!');
        }
    }

}

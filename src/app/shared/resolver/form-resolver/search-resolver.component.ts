import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "@core/utility/api-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import {
    RelativeService,
    RelativeResolver
} from "@core/relative-Service/relative-service";
import { CommonTools } from "@core/utility/common-tools";
import { APIResource } from "@core/utility/api-resource";
import { concat, Observable, Observer, Subscription } from "rxjs";
import { CnComponentBase } from "@shared/components/cn-component-base";
import {
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES,
    BsnComponentMessage
} from "@core/relative-Service/BsnTableStatus";

@Component({
    selector: "cn-search-resolver,[cn-search-resolver]",
    templateUrl: "./search-resolver.component.html"
})
export class SearchResolverComponent extends CnComponentBase
    implements OnInit, OnChanges, OnDestroy {
    @Input()
    config;
    @Input()
    permissions;
    @Input()
    dataList;
    @Input()
    ref;
    form: FormGroup;
    @Output()
    submit: EventEmitter<any> = new EventEmitter<any>();
    _relativeResolver;
    selfEvent = {
        initParameters: [],
        saveForm: [],
        searchFormByValue: []
    };
    _tempParameters = {};
    isSpinning = false;
    expandForm = false;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;
    loading = false;
    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private message: NzMessageService,
        private modalService: NzModalService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    // region: 组件生命周期事件
    ngOnInit() {
        this.form = this.createGroup();
        this.resolverRelation();
        // if (this.config.relations) {
        //   this._relativeResolver = new RelativeResolver();
        //   this._relativeResolver.reference = this;
        //   this._relativeResolver.relativeService = this._messageService;
        //   this._relativeResolver.initParameter = [this.load];
        //   this._relativeResolver.initParameterEvents = [this.load];
        //   this._relativeResolver.relations = this.config.relations;
        //   this._relativeResolver.resolverRelation();
        //   this._tempParameters = this._relativeResolver._tempParameter;
        // }
        // if (this.ref) {
        //   for (const p in this.ref) {
        //     this._tempParameters[p] = this.ref[p];
        //   }
        // }
        // if (this.config.ajaxConfig) {
        //   if (this.config.componentType) {
        //     if (!this.config.componentType.child) {
        //       this.load();
        //     }
        //   } else {
        //     this.load();
        //   }
        // }
    }

    ngOnChanges() {
        // if (this.form) {
        //   const controls = Object.keys(this.form.controls);
        //   const configControls = this.controls.map(item => item.name);
        //   controls
        //     .filter(control => !configControls.includes(control))
        //     .forEach(control => this.form.removeControl(control));
        //   configControls
        //     .filter(control => !controls.includes(control))
        //     .forEach(name => {
        //       const config = this.controls.find(control => control.name === name);
        //       this.form.addControl(name, this.createControl(config));
        //     });
        // }
    }

    ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }
    // endregion

    private resolverRelation() {
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, "searchFormByValue", () => {
                const that = this;
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD,
                        this.config.viewId,
                        {
                            data: that.value
                        }
                    )
                );
            });
        }
    }

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

    createControl(config) {
        const { disabled, validation, value } = config;
        return this.formBuilder.control({ disabled, value }, validation);
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
                    this.setValue(d, data[d]);
                }
            }
        }
    }

    // endregion

    // region: 数据处理
    async execAjax(p?, componentValue?, type?) {
        const params = {};
        let tag = true;
        let url;
        if (p) {
            if (p.params) {
                p.params.forEach(param => {
                    if (param.type === "tempValue") {
                        if (type) {
                            if (type === "load") {
                                if (this._tempParameters[param.valueName]) {
                                    params[param.name] = this._tempParameters[
                                        param.valueName
                                    ];
                                } else {
                                    // console.log('参数不全不能加载');
                                    tag = false;
                                    return;
                                }
                            } else {
                                params[param.name] = this._tempParameters[
                                    param.valueName
                                ];
                            }
                        } else {
                            params[param.name] = this._tempParameters[
                                param.valueName
                            ];
                        }
                    } else if (param.type === "value") {
                        params[param.name] = param.value;
                    } else if (param.type === "GUID") {
                        const fieldIdentity = CommonTools.uuID(10);
                        params[param.name] = fieldIdentity;
                    } else if (param.type === "componentValue") {
                        params[param.name] = componentValue[param.valueName];
                    }
                });
            }

            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = "null";
                p.url.params.forEach(param => {
                    if (param["type"] === "value") {
                        pc = param.value;
                    } else if (param.type === "GUID") {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === "componentValue") {
                        pc = componentValue[param.valueName];
                    } else if (param.type === "tempValue") {
                        pc = this._tempParameters[param.valueName];
                    }
                });

                url = p.url["parent"] + "/" + pc + "/" + p.url["child"];
            }
        }
        if (p.ajaxType === "get" && tag) {
            // console.log('get参数', params);
            return this.apiService.getProj(url, params).toPromise();
        } else if (p.ajaxType === "put") {
            // console.log('put参数', params);
            return this.apiService.putProj(url, params).toPromise();
        } else if (p.ajaxType === "post") {
            // console.log('post参数', params);
            return this.apiService.postProj(url, params).toPromise();
        } else {
            return null;
        }
    }

    isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    async load() {
        const ajaxData = await this.execAjax(
            this.config.ajaxConfig,
            null,
            "load"
        );
        if (ajaxData) {
            if (ajaxData.Data) {
                this.setFormValue(ajaxData.Data[0]);
                // 给主键赋值
                if (this.config.keyId) {
                    this._tempParameters["_id"] =
                        ajaxData.Data[0][this.config.keyId];
                } else {
                    if (ajaxData.Data[0]["Id"]) {
                        this._tempParameters["_id"] = ajaxData.Data[0]["Id"];
                    }
                }
            } else {
                this._tempParameters["_id"] &&
                    delete this._tempParameters["_id"];
            }
        } else {
            this._tempParameters["_id"] && delete this._tempParameters["_id"];
        }
    }

    async saveForm() {
        if (this.config.toolbar) {
            const index = this.config.toolbar.findIndex(
                item => item.name === "saveForm"
            );
            if (this.config.toolbar[index].ajaxConfig) {
                const pconfig = JSON.parse(
                    JSON.stringify(this.config.toolbar[index].ajaxConfig)
                );
                if (this._tempParameters["_id"]) {
                    // 修改保存
                    const ajaxData = await this.execAjax(
                        pconfig["update"],
                        this.value
                    );
                    if (ajaxData) {
                        // console.log('修改保存成功', ajaxData);
                        // this._tempParameters['_id'] = ajaxData.Data[0].Id;
                    }
                } else {
                    // 新增保存
                    if (Array.isArray(pconfig["add"])) {
                        for (let i = 0; i < pconfig["add"].length; i++) {
                            const ajaxData = await this.execAjax(
                                pconfig["add"][i],
                                this.value
                            );
                            if (ajaxData) {
                                // console.log(ajaxData, pconfig['add'][i]);
                                if (pconfig["add"][i]["output"]) {
                                    pconfig["add"][i]["output"].forEach(out => {
                                        this._tempParameters[out.name] =
                                            ajaxData.Data[out["dataName"]];
                                    });
                                }
                            }
                        }
                    } else {
                        const ajaxData = await this.execAjax(
                            pconfig["add"],
                            this.value
                        );
                        if (ajaxData) {
                            console.log("新增保存成功", ajaxData);
                        }
                    }
                }
            }
        }
    }

    execFun(name?) {
        switch (name) {
            case "saveForm":
                this.saveForm();
                break;
            case "initParametersLoad":
                this.initParametersLoad();
                break;
            default:
                break;
        }
    }

    searchForm() {
        this.loading = true;
        this.searchFormByValue(this.value);
        setTimeout(_ => {
            this.loading = false;
        }, 500);
    }

    searchFormByValue(data) {}

    collapseForm($event) {
        this.expandForm = !this.expandForm;
    }

    clickExpand() {
        this.expandForm = !this.expandForm;
    }

    async buttonAction(btn) {
        // console.log(btn);
        let result = false;
        if (this[btn.name] && btn.ajaxConfig) {
            result = await this[btn.name](btn.ajaxConfig);
        } else if (this[btn.name]) {
            this[btn.name]();
        }
        return result;
    }

    async save(ajaxConfig) {
        if (ajaxConfig.post) {
            return this.post(ajaxConfig.post);
        }
        if (ajaxConfig.put) {
            return this.put(ajaxConfig.put);
        }
    }

    private async post(postConfig) {
        let result = false;
        for (let i = 0, len = postConfig.length; i < len; i++) {
            const url = this._buildURL(postConfig[i].url);
            const body = this._buildParameters(postConfig[i].params);
            const res = await this._post(url, body);
            if (res && res.Status === 200) {
                result = true;
                this.message.create("success", "保存成功");
                // 发送消息 刷新其他界面
            } else {
                this.message.create("error", res.Message);
            }
        }
        return result;
    }

    private async put(putConfig) {
        let result = false;
        for (let i = 0, len = putConfig.length; i < len; i++) {
            const url = this._buildURL(putConfig[i].url);
            const body = this._buildParameters(putConfig[i].params);
            const res = await this._put(url, body);
            if (res && res.Status === 200) {
                result = true;
                this.message.create("success", "保存成功");
                // 发送消息 刷新其他界面
            } else {
                this.message.create("error", res.Message);
            }
        }
        return result;
    }

    private _buildParameters(paramsConfig) {
        const params = {};
        if (paramsConfig) {
            paramsConfig.map(param => {
                if (param["type"] === "tempValue") {
                    params[param["name"]] = this._tempParameters[
                        param["valueName"]
                    ];
                } else if (param["type"] === "value") {
                    params[param.name] = param.value;
                } else if (param["type"] === "GUID") {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param["type"] === "componentValue") {
                    params[param.name] = this.value[param.valueName];
                }
            });
        }
        return params;
    }

    private _buildURL(urlConfig) {
        let url = "";
        if (urlConfig && this._isUrlString(urlConfig)) {
            url = urlConfig;
        } else if (urlConfig) {
            let parent = "";
            urlConfig.params.map(param => {
                if (param["type"] === "tempValue") {
                    parent = this._tempParameters[param.value];
                } else if (param["type"] === "value") {
                    if (param.value === "null") {
                        param.value = null;
                    }
                    parent = param.value;
                } else if (param["type"] === "GUID") {
                    // todo: 扩展功能
                } else if (param["type"] === "componentValue") {
                    parent = this.value[param["valueName"]];
                }
            });
        }
        return url;
    }

    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === "[object String]";
    }

    private setParamsValue(params) {}

    private async _post(url, body) {
        return this.apiService.postProj(url, body).toPromise();
    }

    private async _put(url, body) {
        return this.apiService.putProj(url, body).toPromise();
    }

    initParameters(data?) {
        for (const d in data) {
            this._tempParameters[d] = data[d];
        }
        // console.log('初始化参数', this._tempParameters);
    }

    initParametersLoad(data?) {
        for (const d in data) {
            this._tempParameters[d] = data[d];
        }
        this.load();
        // console.log('初始化参数并load', this._tempParameters);
    }

    // endregion
}

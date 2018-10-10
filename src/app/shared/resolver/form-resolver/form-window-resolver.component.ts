import {Component, EventEmitter, Input, OnChanges, OnInit, Output, Inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@core/utility/api-service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RelativeService, RelativeResolver} from '@core/relative-Service/relative-service';
import {CnComponentBase} from '@shared/components/cn-component-base';
import {CommonTools} from '@core/utility/common-tools';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES, BSN_FORM_STATUS
} from '@core/relative-Service/BsnTableStatus';
import {Observable} from 'rxjs';
import {Observer} from 'rxjs';

@Component({
    selector: 'cn-form-window-resolver,[cn-form-window-resolver]',
    templateUrl: './form-window-resolver.component.html',
    styles: [
        `                                                                                                                            
        `
    ]
})
export class CnFormWindowResolverComponent extends CnComponentBase implements OnInit, OnChanges, OnDestroy {

    @Input() config;
    @Input() permissions;
    @Input() dataList;
    @Input() ref;
    @Input() initData;
    _editable = BSN_FORM_STATUS.TEXT;

    form: FormGroup;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();
    _relativeResolver;
    tempValue = {};
    isSpinning = false;
    _statusSubscription;
    _cascadeSubscription;
    _isSaving = false;
    changeConfig;

    constructor(private formBuilder: FormBuilder,
                private _apiService: ApiService,
                private message: NzMessageService, private modalService: NzModalService,
                private _messageService: RelativeService,
                @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
                @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>) {
        super();
    }

    // region: 组件生命周期事件
    ngOnInit() {
        if (this.initData) {
            this.initValue = this.initData;
        }
        this.form = this.createGroup();
        this.resolverRelation();
        if (this.ref) {
            for (const p in this.ref) {
                this.tempValue[p] = this.ref[p];
            }
        }
        if (this.config.ajaxConfig) {
            if (this.config.componentType) {
                if (!this.config.componentType.child) {
                    this.load();
                }
            } else {
                this.load();
            }
        }
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
                        this._editable = BSN_FORM_STATUS.CREATE;
                        this.form.reset();
                        break;
                    case BSN_COMPONENT_MODES.EDIT:
                        this.load();
                        this._editable = BSN_FORM_STATUS.EDIT;
                        break;
                    case BSN_COMPONENT_MODES.CANCEL:
                        this.load();
                        this._editable = BSN_FORM_STATUS.TEXT;
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        this.saveForm_2();
                        break;
                    case BSN_COMPONENT_MODES.DELETE:

                        break;
                    case BSN_COMPONENT_MODES.DIALOG:

                        break;
                    case BSN_COMPONENT_MODES.WINDOW:

                        break;
                    case BSN_COMPONENT_MODES.FORM:

                        break;
                }
            }
        });
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
        if (this.config.componentType && this.config.componentType.parent === true) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, 'saveForm', () => {
                this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH,
                    this.config.viewId, {
                    data: this.value
                }));
            });
            // this.after(this, 'saveForm_2', () => {
            //     this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH,
            //         this.config.viewId, {
            //         data: this.value
            //     }));
            // });
        }
        if (this.config.componentType && this.config.componentType.child === true) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(cascadeEvent => {
                // 解析子表消息配置
                if (this.config.relations && this.config.relations.length > 0) {
                    this.config.relations.forEach(relation => {
                        if (relation.relationViewId === cascadeEvent._viewId) {
                            // 获取当前设置的级联的模式
                            const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode];
                            // 获取传递的消息数据
                            const option = cascadeEvent.option;
                            // 解析参数
                            if (relation.params && relation.params.length > 0) {
                                relation.params.forEach(param => {
                                    if (!this.tempValue) {this.tempValue = {}; }
                                    this.tempValue[param['cid']] = option.data[param['pid']];
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
            });
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
                    const config = this.controls.find(control => control.name === name);
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
            const items = formItem.controls.filter(({type}) => {
                return type !== 'button' && type !== 'submit';
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
        this.controls.forEach(control => group.addControl(control.name, this.createControl(control)));
        return group;
    }

    createControl(control) {
        const {disabled, value} = control;
        const validations = this.getValidations(control.validations);
        return this.formBuilder.control({disabled, value}, validations);
    }

    getValidations(validations) {
        const validation = [];
        validations && validations.forEach(valid => {
            if (valid.validator === 'required' || valid.validator === 'email') {
                validation.push(Validators[valid.validator]);
            } else if (valid.validator === 'minLength' || valid.validator === 'maxLength') {
                validation.push(Validators[valid.validator](valid.length));
            } else if (valid.validator === 'pattern') {
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
            control.setValue(value, {emitEvent: true});
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
                    if (param.type === 'tempValue') {
                        if (type) {
                            if (type === 'load') {
                                if (this.tempValue[param.valueName]) {
                                    params[param.name] = this.tempValue[param.valueName];
                                } else {
                                    // console.log('参数不全不能加载');
                                    tag = false;
                                    return;
                                }
                            } else {
                                params[param.name] = this.tempValue[param.valueName];
                            }
                        } else {
                            params[param.name] = this.tempValue[param.valueName];
                        }

                    } else if (param.type === 'value') {

                        params[param.name] = param.value;

                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonTools.uuID(10);
                        params[param.name] = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        params[param.name] = componentValue[param.valueName];
                    }
                });
            }

            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = 'null';
                p.url.params.forEach(param => {
                    if (param['type'] === 'value') {
                        pc = param.value;
                    } else if (param.type === 'GUID') {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === 'componentValue') {
                        pc = componentValue[param.valueName];
                    } else if (param.type === 'tempValue') {
                        pc = this.tempValue[param.valueName];
                    }
                });

                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'getById' && tag) {
            return this._apiService.getById(`${url}/${params['Id']}`).toPromise();
        } else if (p.ajaxType === 'get' && tag) {
            // console.log('get参数', params);
            return this._apiService.get(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            // console.log('put参数', params);
            return this._apiService.put(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            // console.log('post参数', params);
            return this._apiService.post(url, params).toPromise();
        } else {
            return null;
        }
    }


    isString(obj) { // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    async load() {
        this.isSpinning = true;
        const ajaxData = await this.execAjax(this.config.ajaxConfig, null, 'load');
        if (ajaxData) {
            if (ajaxData.data) {
                this.setFormValue(ajaxData.data);
                // 给主键赋值
                if (this.config.keyId) {
                    this.tempValue['_id'] = ajaxData.data[this.config.keyId];
                } else {
                    if (ajaxData.data['Id']) {
                        this.tempValue['_id'] = ajaxData.data['Id'];
                    }
                }

            } else {
                this.tempValue['_id'] && delete this.tempValue['_id'];
            }
        } else {
            this.tempValue['_id'] && delete this.tempValue['_id'];
        }
        this.isSpinning = false;
    }

    async saveForm_2() {
        let result;
        let ajaxConfig;
        const method = this._editable;
        if (method === BSN_FORM_STATUS.TEXT) {
            this.message.warning('请在编辑数据后进行保存！');
            return false;
        } else {
            this.config.toolbar.forEach(bar => {
                if (bar.group && bar.group.length > 0) {
                    const index = bar.group.findIndex(item => item.name === 'saveForm');
                    if (index !== -1) {
                        ajaxConfig = bar.group[index].ajaxConfig[method];
                        result =  this._execute(method, ajaxConfig);
                    }

                }
                if (bar.dropdown && bar.dropdown.buttons && bar.dropdown.buttons.length > 0) {
                    const index = bar.dropdown.buttons.findIndex(item => item.name === 'saveForm');
                    if (index !== -1) {
                        ajaxConfig = bar.dropdown.buttons[index].ajaxConfig[method];
                        result =  this._execute(method, ajaxConfig);
                    }

                }
            });
        }
        if (result) {
            if (this.config.componentType && this.config.componentType.parent === true) {
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH,
                        this.config.viewId
                    )
                );
            }
        }

    }

    async _execute(method, ajaxConfig) {
        let isSuccess;
        if (ajaxConfig) {
            isSuccess = await this[method](ajaxConfig);
        }
        return isSuccess;
    }

    async saveForm() {
        let result;
        const buttons = this.config.toolbar.buttons;
        if (buttons) {
            const index = buttons.findIndex(item => item.name === 'saveForm');
            if (buttons[index].ajaxConfig) {
                const pconfig = JSON.parse(JSON.stringify(buttons[index].ajaxConfig));
                if (this.tempValue['_id']) {
                    // 修改保存
                    const ajaxData = await this.execAjax(pconfig['put'], this.value);
                    if (ajaxData.isSuccess) {
                        this.message.success('保存成功');
                        result = true;
                    } else {
                        this.message.error(`保存失败！<br/> ${ajaxData.message}`);
                        result = false;
                    }

                } else {
                    // 新增保存
                    if (Array.isArray(pconfig['post'])) {
                        for (let i = 0; i < pconfig['post'].length; i++) {
                            const ajaxData = await this.execAjax(pconfig['post'][i], this.value);
                            if (ajaxData) {
                                if (pconfig['post'][i]['output']) {
                                    pconfig['post'][i]['output'].forEach(out => {
                                        this.tempValue[out.name] = ajaxData.Data[out['dataName']];
                                    });
                                }
                            }
                        }
                    } else {
                        const ajaxData = await this.execAjax(pconfig['add'], this.value);
                        if (ajaxData.isSuccess) {
                            this.message.success('保存成功');
                            result = true;
                        } else {
                            this.message.error(`保存失败！<br/> ${ajaxData.message}`);
                            result = false;
                        }

                    }
                }
            }
        }
        return result;
    }

    execFun(name?) {
        switch (name) {
            case 'saveForm':
                this.saveForm();
                break;
            case 'initParametersLoad':
                this.initParametersLoad();
                break;
            default:
                break;
        }
    }

    searchForm() {
        this.searchFormByValue(this.value);
    }

    searchFormByValue(data) {
        // console.log(data);
    }


    public async buttonAction(btn) {
        let result;
        this._isSaving = true;
        if (this.checkFormValidation()) {
            if (this[btn.name] && btn.ajaxConfig) {
                result = this[btn.name](btn.ajaxConfig);
            } else if (this[btn.name]) {
                result = this[btn.name]();
            } else if (btn.name === 'saveAndKeep') { // 特殊处理：执行保存并继续
                result = this.save(btn.ajaxConfig);
            }
            if (result || !result) {
                this._isSaving = false;
            }
        } else {
            this._isSaving = false;
        }
        return result;
    }

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

    private async save(ajaxConfig) {
        let result;
        if (ajaxConfig.post) {
            result = this.batchSave(ajaxConfig.post);
        }
        if (ajaxConfig.put) {
            result = this.batchSave(ajaxConfig.put);
        }
        return result;
    }


    /**
     * ------------------------------------------------------------需要调整异步放回结果
     * @param ajaxConfig
     * @returns {Promise<Array>}
     */
    private async batchSave(ajaxConfig) {
        const result = [];
        if (ajaxConfig && Array.isArray(ajaxConfig)) {
            ajaxConfig.map(async ajaxConfigObj => {
                result.push(await this._executeAjax(ajaxConfigObj)) ;
            });
        }
        return result;
    }

    // private async post(postConfig) {
    //     let result = true;
    //     for (let i = 0, len = postConfig.length; i < len; i++) {
    //         const url = this._buildURL(postConfig[i].url);
    //         const body = this._buildParameters(postConfig[i].params, postConfig[i].batch ? postConfig[i].batch : false);
    //         const res = await this._post(url, body);
    //         if (res.isSuccess) {
    //             this.message.create('success', '保存成功');
    //             // 发送消息 刷新其他界面
    //         } else {
    //             this.message.create('error', res.message);
    //             result = false;
    //         }
    //     }
    //     return result;
    // }

    private async _executeAjax(ajaxConfig) {
        const url = this._buildURL(ajaxConfig.url);
        const body = this._buildParameters(ajaxConfig.params, ajaxConfig.batch ? ajaxConfig.batch : false);
        return this._executeRequest(
            url,
            ajaxConfig.ajaxType ? ajaxConfig.ajaxType : 'post',
            body);
    }

    // private async put(putConfig) {
    //     let result = true;
    //     for (let i = 0, len = putConfig.length; i < len; i++) {
    //         const url = this._buildURL(putConfig[i].url);
    //         const body = this._buildParameters(putConfig[i].params, putConfig[i].batch ? putConfig[i].batch : false);
    //         const res = await this._put(url, body);
    //         if (res.isSuccess) {
    //             this.message.create('success', '保存成功');
    //             // 发送消息 刷新其他界面
    //         } else {
    //             this.message.create('error', res.message);
    //             result = false;
    //         }
    //     }
    //     return result;
    // }

    private _buildParameters(paramsConfig, isBatch) {
        let params;
        if (paramsConfig && isBatch) {
            // 批量数据参数数组
            params = [];
            // 批量处理的数据从临时变量中进行获取，组合批量处理数组
            if (this.tempValue['checkedRow']) {
                this.tempValue['checkedRow'].map(item => {
                    // 构建参数
                    const p = CommonTools.parametersResolver({
                            params: paramsConfig,
                            tempValue: this.tempValue,
                            item: item,
                            componentValue: this.value,
                            initValue: this.initValue
                        });
                    params.push(p);
                });
            }
        } else {
            // 单一参数
            params = CommonTools.parametersResolver({
                params: paramsConfig,
                tempValue: this.tempValue,
                item: {} ,
                componentValue: this.value,
                initValue: this.initValue
            });
        }
        return params;
    }

    private _buildURL(urlConfig) {
        let url = '';
        if (urlConfig && this._isUrlString(urlConfig)) {
            url = urlConfig;
        } else if (urlConfig) {
            let parent = '';
            urlConfig.params.map(param => {
                if (param['type'] === 'tempValue') {
                    if (!this.tempValue) {this.tempValue = {}; }
                    parent = this.tempValue[param.value];
                } else if (param['type'] === 'value') {
                    if (param.value === 'null') {
                        param.value = null;
                    }
                    parent = param.value;
                } else if (param['type'] === 'GUID') {
                    // todo: 扩展功能
                } else if (param['type'] === 'componentValue') {
                    parent = this.value[param['valueName']];
                }
            });
        }
        return url;
    }

    private _isUrlString(url) {
        return Object.prototype.toString.call(url) === '[object String]';
    }

    private async post(url, body) {
        return this._apiService.post(url, body).toPromise();
    }

    private async put(url, body) {
        return this._apiService.put(url, body).toPromise();
    }

    private async _executeRequest(url, method, body) {
        return this._apiService[method](url, body).toPromise();

    }

    initParameters(data?) {
        if (!this.tempValue) {this.tempValue = {}; }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
        // console.log('初始化参数', this.tempValue);
    }

    initParametersLoad(data?) {
        if (!this.tempValue) {this.tempValue = {}; }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
        this.load();
         console.log('初始化参数并load 主子刷新', this.tempValue);
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
                c.CascadeObjects.forEach(cobj => {// 具体对象
                    this.cascadeList[c.name][cobj.cascadeName] = {};


                    const dataType = [];
                    const valueType = [];
                    cobj['cascadeDataItems'].forEach(item => {
                        // 数据关联 （只是单纯的数据关联，内容只有ajax）
                        // cobj.data
                        const dataTypeItem = {};
                        if (item['caseValue']) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            dataTypeItem['valueName'] = item.caseValue.valueName;
                            dataTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] = item.data.type;
                        dataTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName]['option'] = item.data.option_data.option;
                            dataTypeItem['option'] = item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] = item.data.ajax_data.option;
                            dataTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName]['setValue'] = item.data.setValue_data.option;
                            dataTypeItem['setValue'] = item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] = item.data.show_data.option;
                            dataTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName]['relation'] = item.data.relation_data.option;
                            dataTypeItem['relation'] = item.data.relation_data.option;
                        }

                        dataType.push(dataTypeItem);

                    });

                    cobj['cascadeValueItems'].forEach(item => {

                        const valueTypeItem = {};
                        if (item.caseValue) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            valueTypeItem['valueName'] = item.caseValue.valueName;
                            valueTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] = item.data.type;
                        valueTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName]['option'] = item.data.option_data.option;
                            valueTypeItem['option'] = item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] = item.data.ajax_data.option;
                            valueTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName]['setValue'] = item.data.setValue_data.option;
                            valueTypeItem['setValue'] = item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] = item.data.show_data.option;
                            valueTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName]['relation'] = item.data.relation_data.option;
                            valueTypeItem['relation'] = item.data.relation_data.option;
                        }
                        valueType.push(valueTypeItem);

                    });

                    this.cascadeList[c.name][cobj.cascadeName]['dataType'] = dataType;
                    this.cascadeList[c.name][cobj.cascadeName]['valueType'] = valueType;

                });
                // endregion: 解析对象结束
            });
        // endregion： 解析结束

    }


    valueChange(data?) {

        // 第一步，知道是谁发出的级联消息（包含信息： field、json、组件类别（类别决定取值））
        // { name: this.config.name, value: name }
        const sendCasade = data.name;
        const receiveCasade = ' ';

        // 第二步，根据配置，和返回值，来构建应答数据集合
        // 第三步，
        if (this.cascadeList[sendCasade]) { // 判断当前组件是否有级联

            // const items = formItem.controls.filter(({ type }) => {
            //   return type !== 'button' && type !== 'submit';
            // });

            const changeConfig_new = [];

            for (const key in this.cascadeList[sendCasade]) {
                // console.log('for in 配置' , key);
                this.config.forms.forEach(formsItems => {
                    formsItems.controls.forEach(control => {
                        if (control.name === key) {
                            if (this.cascadeList[sendCasade][key]['dataType']) {
                                this.cascadeList[sendCasade][key]['dataType'].forEach(caseItem => {

                                    // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                    if (caseItem['type'] === 'option') {
                                        // 在做判断前，看看值是否存在，如果在，更新，值不存在，则创建新值
                                        let Exist = false;
                                        changeConfig_new.forEach(config_new => {
                                            if (config_new.name === control.name) {
                                                Exist = true;
                                                config_new['options'] = caseItem['option'];
                                            }
                                        });
                                        if (!Exist) {
                                            control.options = caseItem['option'];
                                            control = JSON.parse(JSON.stringify(control));
                                            changeConfig_new.push(control);
                                        }

                                    }
                                    if (caseItem['type'] === 'ajax') {
                                        // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                        // 解析参数

                                        const caseCodeValue = {};
                                        caseItem['ajax'].forEach(ajaxItem => {
                                            if (ajaxItem['type'] === 'value') {
                                                caseCodeValue[ajaxItem['name']] = ajaxItem['value'];
                                            }
                                            if (ajaxItem['type'] === 'selectValue') { // 选中行数据[这个是单值]
                                                caseCodeValue[ajaxItem['name']] = data['value'];
                                            }
                                            if (ajaxItem['type'] === 'selectObjectValue') { // 选中行对象数据
                                                if ( data.dataItem) {
                                                    caseCodeValue[ajaxItem['name']] = data.dataItem[ajaxItem['valueName']];
                                                }
                                            }
                                            // 其他取值【日后扩展部分】
                                        });
                                        let Exist = false;
                                        changeConfig_new.forEach(config_new => {
                                            if (config_new.name === control.name) {
                                                Exist = true;
                                                config_new['caseCodeValue'] = caseCodeValue;
                                            }
                                        });
                                        if (!Exist) {
                                            control['caseCodeValue'] = caseCodeValue;
                                            control = JSON.parse(JSON.stringify(control));
                                            changeConfig_new.push(control);
                                        }

                                    }
                                    if (caseItem['type'] === 'setValue') {
                                        // console.log('setValueinput' , caseItem['setValue'] );
                                         
                                        const setValuedata = {};
                                         if (caseItem['setValue']['type']  === 'value') { // 静态数据
                                            setValuedata['data'] = caseItem['setValue']['value'];
                                         }
                                         if (caseItem['setValue']['type']  === 'selectValue') { // 选中行数据[这个是单值]
                                            setValuedata['data']  = data[caseItem['setValue']['valueName']];
                                         }
                                         if (caseItem['setValue']['type']  === 'selectObjectValue') { // 选中行对象数据
                                             if ( data.dataItem) {
                                                setValuedata['data']  = data.dataItem[caseItem['setValue']['valueName']];
                                             }
                                         }
                                         // 手动给表单赋值，将值
                                         if (setValuedata.hasOwnProperty('data')) {
                                            this.setValue(key, setValuedata['data']);
                                         }

                                     }

                                    // endregion  解析结束

                                });


                            }
                            if (this.cascadeList[sendCasade][key]['valueType']) {

                                this.cascadeList[sendCasade][key]['valueType'].forEach(caseItem => {

                                    // region: 解析开始  正则表达
                                    const reg1 = new RegExp(caseItem.regular);
                                    const regularflag = reg1.test(data.value);
                                    console.log('正则结果：', regularflag);
                                    // endregion  解析结束 正则表达
                                    if (regularflag) {
                                        // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                        if (caseItem['type'] === 'option') {

                                            let Exist = false;
                                            changeConfig_new.forEach(config_new => {
                                                if (config_new.name === control.name) {
                                                    Exist = true;
                                                    config_new['options'] = caseItem['option'];
                                                }
                                            });
                                            if (!Exist) {
                                                control.options = caseItem['option'];
                                                control = JSON.parse(JSON.stringify(control));
                                                changeConfig_new.push(control);
                                            }
                                        }
                                        if (caseItem['type'] === 'ajax') {
                                            // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                            const caseCodeValue = {};
                                            caseItem['ajax'].forEach(ajaxItem => {
                                                if (ajaxItem['type'] === 'value') {
                                                    caseCodeValue[ajaxItem['name']] = ajaxItem['value'];
                                                }
                                                if (ajaxItem['type'] === 'selectValue') { // 选中行数据[这个是单值]
                                                    caseCodeValue[ajaxItem['name']] = data['value'];
                                                }
                                                if (ajaxItem['type'] === 'selectObjectValue') { // 选中行对象数据
                                                    if ( data.dataItem) {
                                                        caseCodeValue[ajaxItem['name']] = data.dataItem[ajaxItem['valueName']];
                                                    }
                                                }
                                                // 其他取值【日后扩展部分】
                                            });
                                            let Exist = false;
                                            changeConfig_new.forEach(config_new => {
                                                if (config_new.name === control.name) {
                                                    Exist = true;
                                                    config_new['caseCodeValue'] = caseCodeValue;
                                                }
                                            });
                                            if (!Exist) {
                                                control['caseCodeValue'] = caseCodeValue;
                                                control = JSON.parse(JSON.stringify(control));
                                                changeConfig_new.push(control);
                                            }
    
                                        }
                                        if (caseItem['type'] === 'show') {

                                            if (caseItem['show']) {
                                                //
                                                control['hidden'] = caseItem['show']['hidden'];
                                            }


                                        }
                                        if (caseItem['type'] === 'setValue') {
                                            // console.log('setValueinput' , caseItem['setValue'] );
                                             
                                            const setValuedata = {};
                                            if (caseItem['setValue']['type']  === 'value') { // 静态数据
                                                setValuedata['data'] = caseItem['setValue']['value'];
                                             }
                                             if (caseItem['setValue']['type']  === 'selectValue') { // 选中行数据[这个是单值]
                                                setValuedata['data']  = data[caseItem['setValue']['valueName']];
                                             }
                                             if (caseItem['setValue']['type']  === 'selectObjectValue') { // 选中行对象数据
                                                 if ( data.dataItem) {
                                                    setValuedata['data']  = data.dataItem[caseItem['setValue']['valueName']];
                                                 }
                                             }
                                             // 手动给表单赋值，将值
                                             if (setValuedata.hasOwnProperty('data')) {
                                                this.setValue(key, setValuedata['data']);
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


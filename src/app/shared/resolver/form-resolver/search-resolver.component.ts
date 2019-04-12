import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
    RelativeService,
    RelativeResolver
} from '@core/relative-Service/relative-service';
import { CommonTools } from '@core/utility/common-tools';
import { APIResource } from '@core/utility/api-resource';
import { concat, Observable, Observer, Subscription } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import {
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES,
    BsnComponentMessage
} from '@core/relative-Service/BsnTableStatus';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-search-resolver,[cn-search-resolver]',
    templateUrl: './search-resolver.component.html'
})
export class SearchResolverComponent extends CnComponentBase
    implements OnInit, OnChanges, OnDestroy {
    @Input()
    public config;
    @Input()
    public permissions;
    @Input()
    public dataList;
    @Input()
    public ref;
    public form: FormGroup;
    @Output()
    public submit: EventEmitter<any> = new EventEmitter<any>();
    public _relativeResolver;
    public selfEvent = {
        initParameters: [],
        saveForm: [],
        searchFormByValue: []
    };
    public _tempParameters = {};
    public isSpinning = false;
    public expandForm = false;
    public changeConfig = [];
    public formconfigcontrol = {}; // liu 表单配置
    public change_config = {};
    public _statusSubscription: Subscription;
    public _cascadeSubscription: Subscription;
    public loading = false;
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
    public ngOnInit() {
        // 做参数简析
        if (this.config.select) {
            this.config.select.forEach(selectItem => {
                this.config.forms.forEach(formItem => {
                    formItem.controls.forEach(control => {
                        if (control) {
                            if (control.name === selectItem.name) {
                                control['select'] = selectItem.config;
                            }
                        }
                    });
                });
            });
        }

        this.form = this.createGroup();
        this.resolverRelation();
        this.caseLoad(); // liu 20181103
        this.config.forms.forEach(formItem => {
            formItem.controls.forEach(control => {
                this.change_config[control.name] = null;
            });
        });
    }

    public ngOnChanges() { }

    public ngOnDestroy() {
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
            this.after(this, 'searchFormByValue', () => {
                const that = this;
                this.cascade.next(
                    new BsnComponentMessage(
                        BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
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

    public resetForm() {
        this.form.reset();
    }

    public createGroup() {
        const group = this.formBuilder.group({});
        this.controls.forEach(control =>
            group.addControl(control.name, this.createControl(control))
        );
        return group;
    }

    public createControl(config) {
        const { disabled, validation, value } = config;
        return this.formBuilder.control({ disabled, value }, validation);
    }

    public getFormControl(name) {
        return this.form.controls[name];
    }

    public _submitForm($event) {
        event.preventDefault();
        event.stopPropagation();
        this.submit.emit(this.value);
    }

    public setValue(name: string, value: any) {
        const control = this.form.controls[name];
        if (control) {
            control.setValue(value, { emitEvent: true });
        }
    }

    public setFormValue(data) {
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
    public async execAjax(p?, componentValue?, type?) {
        const params = {};
        let tag = true;
        let url;
        if (p) {
            if (p.params) {
                p.params.forEach(param => {
                    if (param.type === 'tempValue') {
                        if (type) {
                            if (type === 'load') {
                                if (this._tempParameters[param.valueName]) {
                                    params[param.name] = this._tempParameters[
                                        param.valueName
                                    ];
                                } else {
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
                        pc = this._tempParameters[param.valueName];
                    }
                });

                url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
            }
        }
        if (p.ajaxType === 'get' && tag) {
            return this.apiService.get(url, params).toPromise();
        } else if (p.ajaxType === 'put') {
            return this.apiService.put(url, params).toPromise();
        } else if (p.ajaxType === 'post') {
            return this.apiService.post(url, params).toPromise();
        } else {
            return null;
        }
    }

    public isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    public async load() {
        const ajaxData = await this.execAjax(
            this.config.ajaxConfig,
            null,
            'load'
        );
        if (ajaxData) {
            if (ajaxData.Data) {
                this.setFormValue(ajaxData.Data[0]);
                // 给主键赋值
                if (this.config.keyId) {
                    this._tempParameters['_id'] =
                        ajaxData.Data[0][this.config.keyId];
                } else {
                    if (ajaxData.Data[0]['Id']) {
                        this._tempParameters['_id'] = ajaxData.Data[0]['Id'];
                    }
                }
            } else {
                this._tempParameters['_id'] &&
                    delete this._tempParameters['_id'];
            }
        } else {
            this._tempParameters['_id'] && delete this._tempParameters['_id'];
        }
    }

    public async saveForm() {
        if (this.config.toolbar) {
            const index = this.config.toolbar.findIndex(
                item => item.name === 'saveForm'
            );
            if (this.config.toolbar[index].ajaxConfig) {
                const pconfig = JSON.parse(
                    JSON.stringify(this.config.toolbar[index].ajaxConfig)
                );
                if (this._tempParameters['_id']) {
                    // 修改保存
                    const ajaxData = await this.execAjax(
                        pconfig['update'],
                        this.value
                    );
                    if (ajaxData) {
                        // this._tempParameters['_id'] = ajaxData.Data[0].Id;
                    }
                } else {
                    // 新增保存
                    if (Array.isArray(pconfig['add'])) {
                        for (let i = 0; i < pconfig['add'].length; i++) {
                            const ajaxData = await this.execAjax(
                                pconfig['add'][i],
                                this.value
                            );
                            if (ajaxData) {
                                if (pconfig['add'][i]['output']) {
                                    pconfig['add'][i]['output'].forEach(out => {
                                        this._tempParameters[out.name] =
                                            ajaxData.Data[out['dataName']];
                                    });
                                }
                            }
                        }
                    } else {
                        const ajaxData = await this.execAjax(
                            pconfig['add'],
                            this.value
                        );
                        if (ajaxData) {
                            // console.log('新增保存成功', ajaxData);
                        }
                    }
                }
            }
        }
    }

    public execFun(name?) {
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

    public searchForm() {
        this.loading = true;
        this.searchFormByValue(this.value);
        setTimeout(_ => {
            this.loading = false;
        }, 500);
    }

    public searchFormByValue(data) { }

    public collapseForm($event) {
        this.expandForm = !this.expandForm;
    }

    public clickExpand() {
        this.expandForm = !this.expandForm;
    }

    public async buttonAction(btn) {
        let result = false;
        if (this[btn.name] && btn.ajaxConfig) {
            result = await this[btn.name](btn.ajaxConfig);
        } else if (this[btn.name]) {
            this[btn.name]();
        }
        return result;
    }

    public async save(ajaxConfig) {
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
                this.message.create('success', '保存成功');
                // 发送消息 刷新其他界面
            } else {
                this.message.create('error', res.Message);
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
                this.message.create('success', '保存成功');
                // 发送消息 刷新其他界面
            } else {
                this.message.create('error', res.Message);
            }
        }
        return result;
    }

    private _buildParameters(paramsConfig) {
        const params = {};
        if (paramsConfig) {
            paramsConfig.map(param => {
                if (param['type'] === 'tempValue') {
                    params[param['name']] = this._tempParameters[
                        param['valueName']
                    ];
                } else if (param['type'] === 'value') {
                    params[param.name] = param.value;
                } else if (param['type'] === 'GUID') {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param['type'] === 'componentValue') {
                    params[param.name] = this.value[param.valueName];
                }
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
                    parent = this._tempParameters[param.value];
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

    private setParamsValue(params) { }

    private async _post(url, body) {
        return this.apiService.post(url, body).toPromise();
    }

    private async _put(url, body) {
        return this.apiService.put(url, body).toPromise();
    }

    public initParameters(data?) {
        for (const d in data) {
            this._tempParameters[d] = data[d];
        }
    }

    public initParametersLoad(data?) {
        for (const d in data) {
            this._tempParameters[d] = data[d];
        }
        this.load();
    }

    // endregion
    public cascadeList = {};

    public caseLoad() {
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
                    cobj['cascadeDataItems'].forEach(item => {
                        // 数据关联 （只是单纯的数据关联，内容只有ajax）
                        // cobj.data
                        const dataTypeItem = {};
                        if (item['caseValue']) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            dataTypeItem['regularType'] = item.caseValue.type;
                            dataTypeItem['valueName'] =
                                item.caseValue.valueName;
                            dataTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] =
                            item.data.type;
                        dataTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                'option'
                            ] = item.data.option_data.option;
                            dataTypeItem['option'] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] =
                                item.data.ajax_data.option;
                            dataTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                'setValue'
                            ] = item.data.setValue_data.option;
                            dataTypeItem['setValue'] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] =
                                item.data.show_data.option;
                            dataTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                'relation'
                            ] = item.data.relation_data.option;
                            dataTypeItem['relation'] =
                                item.data.relation_data.option;
                        }

                        dataType.push(dataTypeItem);
                    });

                    cobj['cascadeValueItems'].forEach(item => {
                        const valueTypeItem = {};
                        if (item.caseValue) {
                            // 取值， 解析 正则表达式
                            // item.case.regular; 正则
                            valueTypeItem['regularType'] = item.caseValue.type;
                            valueTypeItem['valueName'] =
                                item.caseValue.valueName;
                            valueTypeItem['regular'] = item.caseValue.regular;
                        }
                        this.cascadeList[c.name][cobj.cascadeName]['type'] =
                            item.data.type;
                        valueTypeItem['type'] = item.data.type;
                        if (item.data.type === 'option') {
                            // 静态数据集
                            this.cascadeList[c.name][cobj.cascadeName][
                                'option'
                            ] = item.data.option_data.option;
                            valueTypeItem['option'] =
                                item.data.option_data.option;
                        }
                        if (item.data.type === 'ajax') {
                            // 异步请求参数取值
                            this.cascadeList[c.name][cobj.cascadeName]['ajax'] =
                                item.data.ajax_data.option;
                            valueTypeItem['ajax'] = item.data.ajax_data.option;
                        }
                        if (item.data.type === 'setValue') {
                            // 组件赋值
                            this.cascadeList[c.name][cobj.cascadeName][
                                'setValue'
                            ] = item.data.setValue_data.option;
                            valueTypeItem['setValue'] =
                                item.data.setValue_data.option;
                        }
                        if (item.data.type === 'show') {
                            // 页面显示控制
                            this.cascadeList[c.name][cobj.cascadeName]['show'] =
                                item.data.show_data.option;
                            valueTypeItem['show'] = item.data.show_data.option;
                        }
                        if (item.data.type === 'relation') {
                            // 消息交互
                            this.cascadeList[c.name][cobj.cascadeName][
                                'relation'
                            ] = item.data.relation_data.option;
                            valueTypeItem['relation'] =
                                item.data.relation_data.option;
                        }
                        valueType.push(valueTypeItem);
                    });

                    this.cascadeList[c.name][cobj.cascadeName][
                        'dataType'
                    ] = dataType;
                    this.cascadeList[c.name][cobj.cascadeName][
                        'valueType'
                    ] = valueType;
                });
                // endregion: 解析对象结束
            });
        // endregion： 解析结束
    }

    public valueChange(data?) {
        // 第一步，知道是谁发出的级联消息（包含信息： field、json、组件类别（类别决定取值））
        // { name: this.config.name, value: name }
        const sendCasade = data.name;
        const receiveCasade = ' ';

        // 第二步，根据配置，和返回值，来构建应答数据集合
        // 第三步，
        if (this.cascadeList[sendCasade]) {
            // 判断当前组件是否有级联

            // const items = formItem.controls.filter(({ type }) => {
            //   return type !== 'button' && type !== 'submit';
            // });

            const changeConfig_new = [];

            for (const key in this.cascadeList[sendCasade]) {
                this.config.forms.forEach(formsItems => {
                    formsItems.controls.forEach(control => {
                        if (control.name === key) {
                            if (this.cascadeList[sendCasade][key]['dataType']) {
                                this.cascadeList[sendCasade][key][
                                    'dataType'
                                ].forEach(caseItem => {
                                    // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                    if (caseItem['type'] === 'option') {
                                        // 在做判断前，看看值是否存在，如果在，更新，值不存在，则创建新值
                                        let Exist = false;
                                        changeConfig_new.forEach(config_new => {
                                            if (
                                                config_new.name === control.name
                                            ) {
                                                Exist = true;
                                                config_new['options'] =
                                                    caseItem['option'];
                                            }
                                        });
                                        if (!Exist) {
                                            control.options =
                                                caseItem['option'];
                                            control = JSON.parse(
                                                JSON.stringify(control)
                                            );
                                            changeConfig_new.push(control);
                                        }
                                    }
                                    if (caseItem['type'] === 'ajax') {
                                        // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                        // 解析参数

                                        const cascadeValue = {};
                                        caseItem['ajax'].forEach(ajaxItem => {
                                            if (ajaxItem['type'] === 'value') {
                                                cascadeValue[ajaxItem['name']] =
                                                    ajaxItem['value'];
                                            }
                                            if (
                                                ajaxItem['type'] ===
                                                'selectValue'
                                            ) {
                                                // 选中行数据[这个是单值]
                                                cascadeValue[ajaxItem['name']] =
                                                    data['value'];
                                            }
                                            if (
                                                ajaxItem['type'] ===
                                                'selectObjectValue'
                                            ) {
                                                // 选中行对象数据
                                                if (data.dataItem) {
                                                    cascadeValue[
                                                        ajaxItem['name']
                                                    ] =
                                                        data.dataItem[
                                                        ajaxItem[
                                                        'valueName'
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
                                                    'cascadeValue'
                                                ] = cascadeValue;
                                            }
                                        });
                                        if (!Exist) {
                                            control[
                                                'cascadeValue'
                                            ] = cascadeValue;
                                            control = JSON.parse(
                                                JSON.stringify(control)
                                            );
                                            changeConfig_new.push(control);
                                        }
                                    }
                                    if (caseItem['type'] === 'setValue') {
                                        const setValuedata = {};
                                        if (
                                            caseItem['setValue']['type'] ===
                                            'value'
                                        ) {
                                            // 静态数据
                                            setValuedata['data'] =
                                                caseItem['setValue']['value'];
                                        }
                                        if (
                                            caseItem['setValue']['type'] ===
                                            'selectValue'
                                        ) {
                                            // 选中行数据[这个是单值]
                                            setValuedata['data'] =
                                                data[
                                                caseItem['setValue'][
                                                'valueName'
                                                ]
                                                ];
                                        }
                                        if (
                                            caseItem['setValue']['type'] ===
                                            'selectObjectValue'
                                        ) {
                                            // 选中行对象数据
                                            if (data.dataItem) {
                                                setValuedata['data'] =
                                                    data.dataItem[
                                                    caseItem['setValue'][
                                                    'valueName'
                                                    ]
                                                    ];
                                            }
                                        }
                                        // 手动给表单赋值，将值
                                        if (
                                            setValuedata.hasOwnProperty('data')
                                        ) {
                                            this.setValue(
                                                key,
                                                setValuedata['data']
                                            );
                                        }
                                    }

                                    // endregion  解析结束
                                });
                            }
                            if (
                                this.cascadeList[sendCasade][key]['valueType']
                            ) {
                                this.cascadeList[sendCasade][key][
                                    'valueType'
                                ].forEach(caseItem => {
                                    // region: 解析开始  正则表达
                                    const reg1 = new RegExp(caseItem.regular);
                                    let regularData;
                                    if (caseItem.regularType) {
                                        if (
                                            caseItem.regularType ===
                                            'selectObjectValue'
                                        ) {
                                            if (data['dataItem']) {
                                                regularData =
                                                    data['dataItem'][
                                                    caseItem['valueName']
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
                                    // endregion  解析结束 正则表达
                                    if (regularflag) {
                                        // region: 解析开始 根据组件类型组装新的配置【静态option组装】
                                        if (caseItem['type'] === 'option') {
                                            let Exist = false;
                                            changeConfig_new.forEach(
                                                config_new => {
                                                    if (
                                                        config_new.name ===
                                                        control.name
                                                    ) {
                                                        Exist = true;
                                                        config_new['options'] =
                                                            caseItem['option'];
                                                    }
                                                }
                                            );
                                            if (!Exist) {
                                                control.options =
                                                    caseItem['option'];
                                                control = JSON.parse(
                                                    JSON.stringify(control)
                                                );
                                                changeConfig_new.push(control);
                                            }
                                        }
                                        if (caseItem['type'] === 'ajax') {
                                            // 需要将参数值解析回去，？当前变量，其他组件值，则只能从form 表单取值。
                                            const cascadeValue = {};
                                            caseItem['ajax'].forEach(
                                                ajaxItem => {
                                                    if (
                                                        ajaxItem['type'] ===
                                                        'value'
                                                    ) {
                                                        cascadeValue[
                                                            ajaxItem['name']
                                                        ] = ajaxItem['value'];
                                                    }
                                                    if (
                                                        ajaxItem['type'] ===
                                                        'selectValue'
                                                    ) {
                                                        // 选中行数据[这个是单值]
                                                        cascadeValue[
                                                            ajaxItem['name']
                                                        ] = data['value'];
                                                    }
                                                    if (
                                                        ajaxItem['type'] ===
                                                        'selectObjectValue'
                                                    ) {
                                                        // 选中行对象数据
                                                        if (data.dataItem) {
                                                            cascadeValue[
                                                                ajaxItem['name']
                                                            ] =
                                                                data.dataItem[
                                                                ajaxItem[
                                                                'valueName'
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
                                                            'cascadeValue'
                                                        ] = cascadeValue;
                                                    }
                                                }
                                            );
                                            if (!Exist) {
                                                control[
                                                    'cascadeValue'
                                                ] = cascadeValue;
                                                control = JSON.parse(
                                                    JSON.stringify(control)
                                                );
                                                changeConfig_new.push(control);
                                            }
                                        }
                                        if (caseItem['type'] === 'show') {
                                            if (caseItem['show']) {
                                                //
                                                control['hidden'] =
                                                    caseItem['show']['hidden'];
                                            }
                                        }
                                        if (caseItem['type'] === 'setValue') {

                                            const setValuedata = {};
                                            if (
                                                caseItem['setValue']['type'] ===
                                                'value'
                                            ) {
                                                // 静态数据
                                                setValuedata['data'] =
                                                    caseItem['setValue'][
                                                    'value'
                                                    ];
                                            }
                                            if (
                                                caseItem['setValue']['type'] ===
                                                'selectValue'
                                            ) {
                                                // 选中行数据[这个是单值]
                                                setValuedata['data'] =
                                                    data[
                                                    caseItem['setValue'][
                                                    'valueName'
                                                    ]
                                                    ];
                                            }
                                            if (
                                                caseItem['setValue']['type'] ===
                                                'selectObjectValue'
                                            ) {
                                                // 选中行对象数据
                                                if (data.dataItem) {
                                                    setValuedata['data'] =
                                                        data.dataItem[
                                                        caseItem[
                                                        'setValue'
                                                        ]['valueName']
                                                        ];
                                                }
                                            }
                                            // 手动给表单赋值，将值
                                            if (
                                                setValuedata.hasOwnProperty(
                                                    'data'
                                                )
                                            ) {
                                                this.setValue(
                                                    key,
                                                    setValuedata['data']
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
            changeConfig_new.forEach(changeConfig => {

                this.change_config[changeConfig.name] = changeConfig;
            }
            )
        }

        // 此处有消息级联的则发值
        // 级联值= 表单数据+当前触发级联的值组合；
        // "cascadeRelation":[
        //     {"name":"Id","cascadeMode":"REFRESH_AS_CHILD",cascadeField:[{name:"item",type:"tempValueObject" valueName:"dataItem"}] },
        //     {"name":"valuesid1","cascadeMode":"REFRESH_AS_CHILD" },
        //     {"name":"valuesid2","cascadeMode":"REFRESH_AS_CHILD" },
        //     {"name":"valuesid3","cascadeMode":"REFRESH_AS_CHILD" }
        //   ],
        const sendData = this.value;
        sendData[data.name] = data.value;

        if (this.config.cascadeRelation) {
            this.config.cascadeRelation.forEach(element => {
                if (element.name === data.name) {
                    if (element.cascadeField) {
                        element.cascadeField.forEach(feild => {
                            if (!feild['type']) {
                                if (data[feild.valueName]) {
                                    sendData[feild.name] =
                                        data[feild.valueName];
                                }
                            } else {
                                if (feild['type'] === 'selectObject') {
                                    if (data[feild.valueName]) {
                                        sendData[feild.name] =
                                            data[feild.valueName];
                                    }
                                } else if (
                                    feild['type'] === 'tempValueObject'
                                ) {
                                    sendData[feild.name] = this.tempValue;
                                } else if (feild['type'] === 'tempValue') {
                                    if (this.tempValue[feild.valueName]) {
                                        sendData[feild.name] = this.tempValue[
                                            feild.valueName
                                        ];
                                    }
                                } else if (
                                    feild['type'] === 'initValueObject'
                                ) {
                                    sendData[feild.name] = this.initValue;
                                } else if (feild['type'] === 'initValue') {
                                    if (this.initValue[feild.valueName]) {
                                        sendData[feild.name] = this.initValue[
                                            feild.valueName
                                        ];
                                    }
                                } else if (feild['type'] === 'value') {
                                    sendData[feild.name] = feild.value;
                                }
                            }
                        });
                    }
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
}

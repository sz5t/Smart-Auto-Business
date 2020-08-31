import { CnFormBase } from './form.base';
import { GridBase } from './../../business/grid.base';
import { CacheService } from '@delon/cache';
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
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
    RelativeService,
    RelativeResolver
} from '@core/relative-Service/relative-service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_FORM_STATUS,
    BSN_OUTPOUT_PARAMETER_TYPE
} from '@core/relative-Service/BsnTableStatus';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { BeforeOperation } from '@shared/business/before-operation.base';
import { FormResolverComponent } from './form-resolver.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-form-window-resolver,[cn-form-window-resolver]',
    templateUrl: './form-window-resolver.component.html',
    styles: [``]
})
export class CnFormWindowResolverComponent extends CnFormBase
    implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @Input()
    public config;
    @Input()
    public permissions = [];
    @Input()
    public dataList;
    @Input()
    public initData;
    @Input()
    public formTitle;
    @Input()
    public formValue;
    @Input()
    public ref
    @Input()
    public editable;
    private cascadeList = {};
    // form: FormGroup;
    @Output()
    public submit: EventEmitter<any> = new EventEmitter<any>();
    public _relativeResolver;
    public isSpinning = false;
    public changeConfig = [];
    public change_config = {};
    public beforeOperation: BeforeOperation;
    constructor(
        private builder: FormBuilder,
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
        this.formBuilder = this.builder;
        this.baseMessage = this.message;
        this.baseModal = this.modalService;
        this.apiResource = this.apiService;
        this.cascadeBase = this.cascade;
    }

    public ngOnInit() {
        // init form state, default: post
        this.formState = this.initFormState();
        // init controls
        this.controls = this.initControls(this.config.forms);
        // init form group
        this.form = this.createGroup();

        this.initValue = this.initData ? this.initData : {};
        this.cacheValue = this.cacheService ? this.cacheService : {};

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
        const formConfigControlobject = {};
        this.config.forms.forEach(formItem => {
            formItem.controls.forEach(control => {
                formConfigControlobject[control.name] = control;
                this.change_config[control.name] = null;
            });
        });
        this.formConfigControl = formConfigControlobject;
        this.resolverRelation();
        this.caseLoad(); // liu 20180521 测试
    }

    public ngAfterViewInit() {
        this.load();
        // 初始化前置条件验证对象
        this.beforeOperation = new BeforeOperation({
            config: this.config,
            message: this.message,
            modal: this.modalService,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue.getNone('userInfo')
                ? this.cacheValue.getNone('userInfo')
                : {},
            apiResource: this.apiResource
        });
    }

    public ngOnDestroy() {
        // this.unsubscribe();
    }

    public initFormState() {
        switch (this.config.editable) {
            case 'post':
                return 'post';
            case 'put':
                return 'put';
            case 'text':
                return 'text';
            default:
                return 'text';
        }
    }

    // 加载编辑数据
    public load_old() {
        if (this.config.ajaxConfig && this.formState === BSN_FORM_STATUS.EDIT) {
            const url = this.buildUrl(this.config.ajaxConfig.url);
            const params = this.buildParameter(this.config.ajaxConfig.params);
            this.execute(url, 'getById', params).then(result => {
                if (result.isSuccess) {
                    this.setFormValue(result.data);
                    // 给主键赋值
                    if (this.config.keyId) {
                        this.tempValue['_id'] =
                            result.data[this.config.keyId];
                    } else {
                        if (result.data['Id']) {
                            this.tempValue['_id'] = result.data['Id'];
                        }
                    }

                } else {
                    this.tempValue['_id'] && delete this.tempValue['_id'];
                    this.form.reset();
                    this.message.error(`数据加载异常: ${result.message}`);
                }
            }, error => {
                this.message.error(`加载异常: ${error}`);
            }).catch(error => {
                this.message.error(`加载异常: ${error}`);
            });
        } else if (this.formValue) {
            this.setFormValue(this.formValue);
        }
    }

    public load() {
        // console.log('加载数据');
        if (this.config.ajaxConfig && this.config.ajaxConfig.url) {
            setTimeout(() => {
                this.isSpinning = true;
            })
            const url = this.buildUrl(this.config.ajaxConfig.url);
            const params = this.buildParameter(this.config.ajaxConfig.params);
            this.execute(url, this.config.ajaxConfig.ajaxType, params).then(result => {
                let res;
                if (Array.isArray(result.data)) {
                    res = result.data[0]
                } else {
                    
                   if (Array.isArray(result.data[Object.keys(result.data)[0]])) {
                    res = result.data[Object.keys(result.data)[0]][0];
                   } else {
                    res = result.data;
                   }
                }

                if (res) {
                    this.setFormValue(res);
                    // 给主键赋值
                    if (this.config.keyId) {
                        this.tempValue['_id'] =
                            res[this.config.keyId];
                    } else {
                        if (res['Id']) {
                            this.tempValue['_id'] = res['Id'];
                        }
                    }
                } else {
                    this.tempValue['_id'] && delete this.tempValue['_id'];
                    this.form.reset();
                }
            });
        }
        setTimeout(() => {
            this.isSpinning = false;
        });

    }


    // region: 解析消息
    private resolverRelation() {
        // 弹出表单只进行发消息操作, 表单完成操作后进行消息发送
        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            // 注册消息发送方法
            // 注册行选中事件发送消息
            this.after(this, 'saveForm', () => {
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
        }
    }

    // endregion

    public ngOnChanges() {
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

    public buttonAction(btn, callback?, dialog?) {
        if (this.checkFormValidation()) {
            // 1、支持原生API资源调用
            // 2、支持SQL存储过程和返回结果后续操作
            if (btn.ajaxConfig ) {
                this.resolveAjaxConfig(btn.ajaxConfig, this.formState, callback, dialog);
            } else {
                this.baseMessage.warning('未配置任何数据操作');
            }
        }
    }


    public initParameters(data?) {
        if (!this.tempValue) {
            this.tempValue = {};
        }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
    }

    public initParametersLoad(data?) {
        if (!this.tempValue) {
            this.tempValue = {};
        }
        for (const d in data) {
            this.tempValue[d] = data[d];
        }
        this.load();
    }

    /**
     * 重置表单
     * @param comp
     * @private
     */
    private _resetForm(comp: FormResolverComponent) {
        this.formState = BSN_FORM_STATUS.CREATE;
        comp.resetForm();
    }

    // endregion

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

    public valueChange1(data?) {
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
                                            this.setValues(
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
                                                this.setValues(
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

            setTimeout(() => {
                changeConfig_new.forEach(changeConfig => {

                    this.change_config[changeConfig.name] = changeConfig;
                }
                )
            })

        }

        const sendData = this.value;
        sendData[data.name] = data.value;

        if (this.config.cascadeRelation) {
            this.config.cascadeRelation.forEach(element => {
                if (element.name === data.name) {
                    if (element.cascadeField) {
                        element.cascadeField.forEach(feild => {
                            if (!feild['type']) {
                                if (data[feild.valueName]) {
                                    sendData[feild.name] = data[feild.valueName];
                                }
                            } else {
                                if (feild['type'] === 'selectObject') {
                                    if (data[feild.valueName]) {
                                        sendData[feild.name] = data[feild.valueName];
                                    }
                                } else if (feild['type'] === 'tempValueObject') {

                                    sendData[feild.name] = this.tempValue;

                                } else if (feild['type'] === 'tempValue') {
                                    if (this.tempValue[feild.valueName]) {
                                        sendData[feild.name] = this.tempValue[feild.valueName];
                                    }
                                } else if (feild['type'] === 'initValueObject') {

                                    sendData[feild.name] = this.initValue;

                                } else if (feild['type'] === 'initValue') {
                                    if (this.initValue[feild.valueName]) {
                                        sendData[feild.name] = this.initValue[feild.valueName];
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

                                        if (
                                            caseItem['setValue']['type'] ===
                                            'formValue'
                                        ) {
                                            // 选中行对象数据
                                            if (data.dataItem) {
                                                setValuedata['data'] =
                                                    this.form.value[
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
                                            this.setValues(
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
                                                regularData = data.value;
                                            }
                                        } else {
                                            regularData = data.value;
                                        }
                                    } else {
                                        regularData = data.value;
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
                                                control['hidden'] = caseItem['show']['hidden'];

                                                //    if (!caseItem['show']['hidden']) {
                                                //       if (this.value.hasOwnProperty(key)) {
                                                //           if (this.value[key]) {
                                                //            this.setValues(key, this.value[key]);
                                                //           }
                                                //      }
                                                //    }

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

                                            if (
                                                caseItem['setValue']['type'] ===
                                                'formValue'
                                            ) {
                                                // 选中行对象数据
                                                if (data.dataItem) {
                                                    setValuedata['data'] =
                                                        this.form.value[
                                                        caseItem['setValue'][
                                                        'valueName'
                                                        ]
                                                        ];
                                                }
                                            }

                                            // 手动给表单赋值，将值
                                            if (
                                                setValuedata.hasOwnProperty(
                                                    'data'
                                                )
                                            ) {
                                                this.setValues(
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
                setTimeout(() => {
                    this.change_config[changeConfig.name] = changeConfig;
                });

            })
        }

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
                                } else if ( feild['type'] === 'selectObjectValue' ) {
                                    if (data.dataItem) { 
                                        sendData[feild.name] = data.dataItem[feild.valueName];
                                    } else {
                                        sendData[feild.name] = null;
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

        // console.log('当前表单值', this.value, this.form.value);
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

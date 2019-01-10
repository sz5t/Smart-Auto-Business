import {
    Component,
    OnInit,
    Inject,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES
} from "@core/relative-Service/BsnTableStatus";
import { Observable, Observer } from "rxjs";
import { ApiService } from "@core/utility/api-service";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "cn-form-scancode,[cn-form-scancode]",
    templateUrl: "./cn-form-scancode.component.html",
    styleUrls: ["./cn-form-scancode.component.css"]
})
export class CnFormScancodeComponent implements OnInit {
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
    formGroup: FormGroup;
    // @Output() updateValue = new EventEmitter();
    @Output()
    updateValue = new EventEmitter();
    _options = [];
    cascadeValue = {};
    resultData;
    _value;
    constructor(
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        private apiService: ApiService
    ) { }

    ngOnInit() { }
    isScan = true;
    oldvalue = null;
    async onKeyPress(e) {
        // console.log('onKeyPress', e);
        if (e.code === 'Enter') {
            this.isScan = false;
            this.oldvalue = this._value;
            console.log("huiche", this._value);
            const result = await this.asyncLoad(
                this.config.ajaxConfig ? this.config.ajaxConfig : null
            );
            // this.cascade.next(
            //   new BsnComponentMessage(
            //     BSN_COMPONENT_CASCADE_MODES.Scan_Code_ROW,
            //     'Scan_Code_ROW',
            //     {
            //       data: { ScanCode: this._value, ScanCodeObject: result.data }
            //     }
            //   )
            // );
            this.valueChange(this._value, result.data);
            // this.cascade.next(
            //   new BsnComponentMessage(
            //     BSN_COMPONENT_CASCADE_MODES.Scan_Code_Locate_ROW,
            //     'Scan_Code_ROW',
            //     {
            //       data: { ScanCode: this._value, ScanCodeObject: result.data }
            //     }
            //   )
            // );
        } else {
            if (e.code === 'ArrowDown') {

            } else {
                if (!this.isScan) {
                    const newvalue = this._value;
                    this._value = newvalue.substring(
                        this.oldvalue.length ? this.oldvalue.length : 0
                    );
                    this.isScan = true;
                }
            }
        }
    }

    async asyncLoad(p?, componentValue?, type?) {
        if (!p) {
            return [];
        }
        // console.log('select load 异步加载', componentValue); // liu
        const params = {};
        let tag = true;
        let url;
        if (p) {
            p.params.forEach(param => {
                if (param.type === "tempValue") {
                    if (type) {
                        if (type === "load") {
                            if (this.bsnData[param.valueName]) {
                                params[param.name] = this.bsnData[
                                    param.valueName
                                ];
                            } else {
                                // console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    } else {
                        if (this.bsnData && this.bsnData[param.valueName]) {
                            // liu 参数非空判断
                            params[param.name] = this.bsnData[param.valueName];
                        }
                    }
                } else if (param.type === "value") {
                    params[param.name] = param.value;
                } else if (param.type === "componentValue") {
                    params[param.name] = componentValue[param.valueName];
                } else if (param.type === "scanCodeValue") {
                    params[param.name] = this._value;
                } else if (param.type === "cascadeValue") {
                    params[param.name] = this.cascadeValue[param.valueName];
                }
            });
            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = "null";
                p.url.params.forEach(param => {
                    if (param["type"] === "value") {
                        pc = param.value;
                    } else if (param.type === "componentValue") {
                        pc = componentValue[param.valueName];
                    } else if (param.type === "tempValue") {
                        pc = this.bsnData[param.valueName];
                    } else if (param.type === "scanCodeValue") {
                        pc = this._value;
                    }
                });

                url = p.url["parent"] + "/" + pc + "/" + p.url["child"];
            }
        }
        if (p.ajaxType === "get" && tag) {
            return this.apiService.get(url, params).toPromise();
        }
    }

    isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    valueChange(name?, dataItem?) {
        console.log("valueChange", name);
        const backValue = { name: this.config.name, value: name };
        if (dataItem) {
            backValue["dataItem"] = dataItem;
        }
        this.updateValue.emit(backValue);
    }
}

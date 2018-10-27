import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject
} from "@angular/core";
import { Observable, Observer } from "rxjs/index";
import {
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_MODES,
    BsnComponentMessage
} from "@core/relative-Service/BsnTableStatus";
import { ApiService } from "@core/utility/api-service";
import { NzMessageService } from "ng-zorro-antd";
import { CommonTools } from "@core/utility/common-tools";
@Component({
    selector: "bsn-step",
    templateUrl: "./bsn-step.component.html",
    styles: [
        `
            .steps-content {
                margin-top: 16px;
                border: 1px dashed #e9e9e9;
                border-radius: 6px;
                background-color: #fafafa;
                min-height: 200px;
                text-align: center;
                padding-top: 10px;
                padding-left: 10px;
            }

            .steps-action {
                margin-top: 24px;
            }
        `
    ]
})
export class BsnStepComponent implements OnInit {
    @Input()
    config;
    @Input()
    viewId;
    viewCfg;
    _tempValue = {};
    _current = 0;
    _status = "wait";
    indexContent = "";
    constructor(
        private _apiService: ApiService,
        private _message: NzMessageService,
        @Inject(BSN_COMPONENT_MODES)
        private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {}

    ngOnInit() {
        if (this.config.ajaxConfig) {
            // 异步加载步骤
            this.loadSteps();
        } else {
            // 加载固定步骤
            this.getViewCfg();
        }
    }

    loadSteps() {
        (async () => {
            const res: any = await this.getAsyncStepsData();
            if (res.isSuccess) {
                this.config.steps = [];
                res.data.forEach(dataItem => {
                    const d = {};
                    d["viewCfg"] = [];
                    this.config.dataMapping.forEach(dm => {
                        if (dataItem[dm.field]) {
                            d[dm.name] = dataItem[dm.field];
                        }
                    });
                    this.config.steps.push(d);
                    this.getViewCfg();
                });
            } else {
                this._message.error(res.message);
            }
        })();
    }

    async getAsyncStepsData() {
        const params = {};
        const url = this.config.ajaxConfig.url;
        const ajaxParams = this.config.ajaxConfig.params;
        if (ajaxParams) {
            ajaxParams.forEach(param => {
                if (param.type === "tempValue") {
                    if (this._tempValue[param.valueName]) {
                        params[param.name] = this._tempValue[param.valueName];
                    } else {
                        this._message.info("参数异常，无法加载数据");
                    }
                } else if (param.type === "value") {
                    params[param.name] = param.value;
                } else if (param.type === "GUID") {
                    params[param.name] = CommonTools.uuID(10);
                } else if (param.type === "componentValue") {
                    // params[param.name] = componentValue;
                }
            });
        }
        return this._apiService.get(url, params).toPromise();
    }

    pre() {
        if (this._current === 0) return;
        this._current -= 1;
        this.changeContent();
    }

    next() {
        if (this._current === this.config.steps.length) return;
        this._current += 1;
        this.changeContent();
    }

    done() {
        // console.log('done');
    }

    changeContent() {
        switch (this._current) {
            case 0: {
                this.indexContent = "First-content";
                break;
            }
            case 1: {
                this.indexContent = "Second-content";
                break;
            }
            case 2: {
                this.indexContent = "third-content";
                break;
            }
            default: {
                this.indexContent = "error";
            }
        }
        this.getViewCfg();
    }

    getViewCfg() {
        this.viewCfg = this.config.steps[this._current].viewCfg;
    }
}

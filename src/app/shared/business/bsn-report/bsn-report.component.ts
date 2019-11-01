import { SystemModule } from './../../../routes/system/system.module';
import { SystemResource, SystemResource_1 } from '@core/utility/system-resource';
import { getService } from './../../../../testing/common.spec';
import { ApiService } from './../../../core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { ElementRef, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';
import { DataService } from 'app/model/app-data.service';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { Subscription, Observable, Observer } from 'rxjs';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';

declare var rubylong: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-report',
    templateUrl: './bsn-report.component.html',
    styles: [`
    `]
})
export class BsnReportComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config;
    @Input() 
    public initData;

    public reportURL;

    // @ViewChild('report')
    // private reportView: ElementRef;
    private reportObject;

    private _lines = ['Computers', 'Washers', 'Stoves'];
    private _colors = ['Red', 'Green', 'Blue', 'White'];
    private _ratings = ['Terrible', 'Bad', 'Average', 'Good', 'Great', 'Epic'];

    private _statusSubscription: Subscription;
    private _cascadeSubscription: Subscription;

    constructor(
        private _api: ApiService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiResource = _api;
        this.cacheValue = this._cacheService
    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
        this.resolverRelation();
        if (this.config.componentType.own) {
            this.loadReport();
        }
    }

    public async ngAfterViewInit() {
        
    }

    public async loadReport() {

        const url = [];
        const d_params = this.buildParameter(this.config.ajaxConfig.params);
        const inline = this.config.inline;
        const report = this.config.reportName;
        const token = d_params['token'];

        for (const d in d_params ) {
            if (d_params.hasOwnProperty(d)) {
                url.push(`${d}=${d_params[d]}`);
            }
        }

        const resource = `${this.config.ajaxConfig.url}&${url.join('&')}`;
        this.reportURL = `${this._replaceCurrentURL(SystemResource.reportServer.url)}?inline=${inline}&report=${report}&type=pdf&resource=${resource}`;
        console.log(this._replaceCurrentURL(this.reportURL));
    }
    private _replaceCurrentURL(oldUrl: string): string {
        const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        const reg_port = /:\d{1,5}/;
        const reg_all = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/
        const ip = reg_all.exec(oldUrl)[0];
        
        const href = window.location.href;

        const port = reg_port.exec(href)[0];
        const subPort = reg_port.exec(href)[0].substring(1, port.length);

        let match, matchIP;
        if (href.indexOf('localhost') < 0) {
            match = reg.exec(window.location.href)[0].replace(/\./g, '_');  
            
            matchIP = `url_${match}_${subPort}`;
        } else {
            matchIP = `url_localhost_${subPort}`;
        }
        let newIP;
        if (oldUrl.indexOf('api.cfg') > 0) {
            newIP = SystemResource_1[matchIP].settingSystemServer;
        } else if (oldUrl.indexOf('ReportServer.ashx') > 0) {
            newIP = SystemResource_1[matchIP].reportServerUrl;
        } else {
            newIP = SystemResource_1[matchIP].localResourceUrl;
        }
        return oldUrl.replace(ip, newIP);
    }

    public async load() {
        // 加载报表数据
        const data = await this.getReportData();
        if (data.isSuccess) {
            // 生成表表
            const server = SystemResource.reportServer.url;
            const reportViewer = rubylong.grhtml5.insertReportViewer(
                'report',
                `${server + this.config.reportName }?cts=${new Date().getMilliseconds()}`
            );
            reportViewer.loadData(data.data, true);
            reportViewer.start(); //启动报表运行，生成报表
        }
    }

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    private resolverRelation() {
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
                                        this.tempValue[param['cid']] =
                                            option.data[param['pid']];
                                    });
                                }
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.loadReport();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.loadReport();
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    private async getReportTemplate() {
        if (this.config.reportName && this.config.reportName.length > 0) {
            return this.apiResource.getLocalReportTemplate(this.config.reportName).toPromise();
        } else {
            console.log('未配置报表模版!');
        }

    }


    private async getReportData() {
        // 尝试采用加载多个数据源配置,异步加载所有数据后,进行数据整合,然后进行绑定
        const url = this.buildUrl(this.config.ajaxConfig.url);
        const params = this.resolverParameters(this.config.ajaxConfig.params);
        return this.apiResource[this.config.ajaxConfig.ajaxType](url, params).toPromise();
    }

    private resolverParameters(config) {
        let params = this.buildParameter(config);
        config.forEach(cfg => {
            if (Array.isArray(cfg.children) && cfg.children.length > 0) {
                const p = {};
                p[cfg.name] = this.resolverParameters(cfg.children);
                params = { ...params, ...p };
            }
        });
        return params;
    }

    public buildParameter(parameters) {
        const params = CommonTools.parametersResolver({
            params: parameters,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        return params;
    }

    public buildUrl(urlConfig) {
        let url;
        if (CommonTools.isString(urlConfig)) {
            url = urlConfig;
        }
        return url;
    }


    private async buildTableReport() {

    }

}

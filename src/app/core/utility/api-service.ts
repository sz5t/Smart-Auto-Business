import { CacheService } from '@delon/cache';
import { getMonth, getISOYear } from 'date-fns';
import { OperationLogModel } from './common-tools';
import { CommonTools } from '@core/utility/common-tools';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { APIResource } from '@core/utility/api-resource';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SystemResource } from '@core/utility/system-resource';
import { AlainThemeConfig } from '@delon/theme';
import { BSN_DB_INSTANCE } from '@core/relative-Service/BsnTableStatus';

@Injectable()
export class ApiService {
    public httpClient;
    constructor(
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private http: HttpClient,
        private cacheService: CacheService
    ) {
        this.httpClient = new _HttpClient(http, new AlainThemeConfig());
    }

    public setHeaders() {
        const token = this.tokenService.get().token;
        if (token !== 'null') {
            // const userToken = JSON.parse(this.tokenService.get().token);
            return new HttpHeaders()
                .set('_token', token ? token : '')
                .set('X-Requested-With', 'XMLHttpRequest');
        }
    }

    // region 操作配置平台的相关资源
    public post(resource, body?, params?) {
        // console.log('resource =========', resource);
        return this.httpClient.request('POST', resource, {
            body: body,
            params: params,
            headers: this.setHeaders()
        });
    }

    public get(resource, params?) {
        return this.httpClient.request('GET', resource, {
            responseType: 'json',
            params: params,
            headers: this.setHeaders()
        });
    }

    public getById(resource, params?) {
        if (params) {
            resource = `${resource}/${params['Id']}`;
        }
        return this.httpClient.request('GET', resource, {
            params: params,
            responseType: 'json',
            headers: this.setHeaders()
        });
    }

    public put(resource, body?, params?) {
        return this.httpClient.request('PUT', resource, {
            params: params,
            body: body,
            headers: this.setHeaders()
        });
    }

    public delete(resource, params?) {
        return this.httpClient.request('DELETE', resource, {
            params: params,
            headers: this.setHeaders()
        });
    }

    public getWidthNoHeader(resource, params) {
        return this.httpClient.request('GET', resource, {
            responseType: 'json',
            params: params
        });
    }

    // endregion

    // region: read inner config data
    public getLocalData(name) {
        // const urls =
        //     // environment.SERVER_URL +
        //     SystemResource.localResource.url +
        //     '/assets/data/' +
        //     name +
        //     '.json?rtc=' +
        //     CommonTools.uuID(10);
        // return this.http.get<any>(urls);

        const urls = `${SystemResource.localResourceConfigJson.url + name}.json?rtc=${CommonTools.uuID(10)}`;
        return this.httpClient.request('GET', urls);
    }

    public getSystemConfig() {
        const urls = `${SystemResource.localResource.url}/assets/config.json?rtc=${CommonTools.uuID(10)}`;
        return this.httpClient.request('GET', urls);
    }

    public login(resource, body?, params?) {
        return this.httpClient.request('POST', resource, {
            body: body,
            params: params,
            headers: this.setLoginHeaders()
        }); 
    }
    public updatePwd(resource, body?, params?) {
        return this.httpClient.request('PUT', resource, {
            body: body,
            params: params,
            headers: this.setLoginHeaders()
        }); 
    }

    public setLoginHeaders() {
        const token = this.tokenService.get().token;
        if (token !== 'null') {
            // const userToken = JSON.parse(this.tokenService.get().token);
            return new HttpHeaders()
                .set('X-Requested-With', 'XMLHttpRequest')
                // .set('_projectId', '7fe971700f21d3a796d2017398812dcf');
        }
    }

    public addOperationLog(params: OperationLogModel) {
        // inner log info from system login
        params['userId'] = this.cacheService.getNone('userInfo')['userId'] ? this.cacheService.getNone('userInfo')['userId'] : 'unknown';
        params['userIp'] = this.cacheService.getNone('userInfo')['loginIp'] ? this.cacheService.getNone('userInfo')['loginIp'] : 'unknown';
        params['instanceId'] = BSN_DB_INSTANCE.SMART_ONE_CFG;

        // 计算当前月份调用当月日志API
        const month = CommonTools.getNowFormatDate('month', '', '');
        const url = `common/SysOperationLog`;
        
        return this.httpClient.request('POST', url, {
            body: params,
            headers: this.setHeaders()
        });
    }
    // endregion
}

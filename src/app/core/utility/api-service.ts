import { CommonTools } from "@core/utility/common-tools";
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { APIResource } from "@core/utility/api-resource";
import { _HttpClient } from "@delon/theme";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { SystemResource } from "@core/utility/system-resource";
import { AlainThemeConfig } from "@delon/theme";

@Injectable()
export class ApiService {
    httpClient;
    constructor(
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private http: HttpClient
    ) {
        this.httpClient = new _HttpClient(http, new AlainThemeConfig());
    }

    setHeaders() {
        const token = this.tokenService.get().token;
        if (token !== "null") {
            // const userToken = JSON.parse(this.tokenService.get().token);
            return new HttpHeaders()
                .set("_token", token ? token : "")
                .set("X-Requested-With", "XMLHttpRequest");
        }
    }

    // region 操作配置平台的相关资源
    post(resource, body?, params?) {
        return this.httpClient.request("POST", resource, {
            body: body,
            params: params,
            headers: this.setHeaders()
        });
    }

    get(resource, params?) {
        return this.httpClient.request("GET", resource, {
            responseType: "json",
            params: params,
            headers: this.setHeaders()
        });
    }

    getById(resource) {
        return this.httpClient.request("GET", resource, {
            responseType: "json",
            headers: this.setHeaders()
        });
    }

    put(resource, body?, params?) {
        return this.httpClient.request("PUT", resource, {
            params: params,
            body: body,
            headers: this.setHeaders()
        });
    }

    delete(resource, params?) {
        return this.httpClient.request("DELETE", resource, {
            params: params,
            headers: this.setHeaders()
        });
    }

    // endregion

    // region: read inner config data
    getLocalData(name) {
        const urls =
            SystemResource.localResource.url +
            "/assets/data/" +
            name +
            ".json?rtc=" +
            CommonTools.uuID(10);
        return this.http.get<any>(urls);
    }
    // endregion
}

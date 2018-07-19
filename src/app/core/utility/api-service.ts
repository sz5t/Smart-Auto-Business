import { CommonTools } from '@core/utility/common-tools';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { APIResource } from '@core/utility/api-resource';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SystemResource } from '@core/utility/system-resource';

@Injectable()
export class ApiService {
  httpClient;
  constructor(@Inject(DA_SERVICE_TOKEN)
  private tokenService: ITokenService,
    private http: HttpClient) {
    this.httpClient = new _HttpClient(http);
  }


  setHeaders() {
    const token = this.tokenService.get().token;
    if (token !== 'null') {
      // const userToken = JSON.parse(this.tokenService.get().token);
      return new HttpHeaders()
        .set('_token', token ? token : '')
        .set('X-Requested-With', 'XMLHttpRequest');
    }
  }

  // region 操作配置平台的相关资源
  post(resource, body?, params?) {

    return this.httpClient.request(
      'POST',
      resource,
      {
        body: body,
        params: params,
        headers: this.setHeaders()
      });
  }


  get(resource, params?) {
    return this.httpClient.request(
      'GET',
      resource,
      {
        responseType: 'json',
        params: params,
        headers: this.setHeaders()

      });
  }

  getById(resource) {
    return this.httpClient.request(
      'GET',
      resource,
      {
        responseType: 'json',
        headers: this.setHeaders()

      });
  }

  put(resource, body?, params?) {
    return this.httpClient.request(
      'PUT',
      resource,
      {
        params: params,
        body: body,
        headers: this.setHeaders()
      });
  }

  delete(resource, params?) {
    return this.httpClient.request(
      'DELETE',
      resource,
      {
        params: params,
        headers: this.setHeaders()
      });
  }

  // endregion

  // region  操作项目配置的相关api

  postProj(resource, body, params?) {
    if (environment.COMMONCODE !== APIResource.LoginCommonCode) {
      if (Array.isArray(body)) {
        body.map(d => {
          d['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
          d['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
          d['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
        });
      } else {
        body['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
        body['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
        body['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
      }
    }

    return this.httpClient.post(
      resource,
      body,
      params,
      {
        headers: this.setHeaders()
      });
  }

  getProj(resource, params?) {
    if (environment.COMMONCODE !== APIResource.LoginCommonCode) {
      params = this.setParamsObjProj(params);
    }

    return this.httpClient.get(
      resource,
      params,
      {
        responseType: 'json',
        headers: this.setHeaders()

      });
  }

  putProj(resource, body?, params?) {
    // params = this.setParamsObjProj(params);
    return this.httpClient.request(
      'PUT',
      resource,
      {
        body: body,
        headers: this.setHeaders()
      }
    );
  }

  deleteProj(resource, params?) {
    // params = this.setParamsObjProj(params);
    return this.httpClient.delete(
      resource,
      params,
      {
        headers: this.setHeaders()
      });
  }


  /**
   * 添加访问业务系统是必须的参数信息
   * @param param
   * @returns {HttpParams}
   */
  setParamsProj(param?): HttpParams {
    let httpParam = new HttpParams()
      .set('ProjId', '002905c7bf57c54c9e5e65ec0e5fafe8') // 项目ID
      .set('ApplyId', '3935eb43532d435398d5189d5ece0f5d') // ApplyId
      .set('PlatCustomerId', 'f2771e4c90db29439e3c986d9859dc74'); // PlatCutomerId

    for (const p in param) {
      httpParam = httpParam.set(p, param[p]);
    }
    return httpParam;
  }

  /**
   * 添加访问业务系统是必须的参数信息
   * @param param
   * @returns {HttpParams}
   */
  setParamsObjProj(param?) {
    if (param) {
      param['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
      param['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
      param['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
      return param;
    } else {
      const paramObj = {};
      paramObj['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
      paramObj['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
      paramObj['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
      return paramObj;
    }
  }
  // endregion


  // region: business

  /**
   * 添加访问业务系统是必须的参数信息
   * @param param
   * @returns {HttpParams}
   */
  setParamsObjProjSys(param?) {
    if (param) {
      param['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
      param['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
      param['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
      param['DrmId'] = '57e76ec4a882334c85532f3a5f561a12';
      return param;
    } else {
      const paramObj = {};
      param['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
      param['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
      param['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
      param['DrmId'] = '57e76ec4a882334c85532f3a5f561a12';
      return paramObj;
    }
  }

  postProjSys(resource, body?, params?) {
    body['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
    body['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
    body['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
    body['DrmId'] = '57e76ec4a882334c85532f3a5f561a12';
    // body['ProjId'] = '0ac12f70c2a7a44794b57ef0c1c480c2';
    // body['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
    // body['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
    // let param: HttpParams = this.setParamsProj(params)
    return this.httpClient.post(
      resource,
      body,
      params,
      {
        headers: this.setHeaders()
      });
  }

  putProjSys(resource, body?, params?) {
    body['ProjId'] = '002905c7bf57c54c9e5e65ec0e5fafe8';
    body['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
    body['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
    body['DrmId'] = '57e76ec4a882334c85532f3a5f561a12';
    // body['ProjId'] = '0ac12f70c2a7a44794b57ef0c1c480c2';
    // body['ApplyId'] = '3935eb43532d435398d5189d5ece0f5d';
    // body['PlatCustomerId'] = 'f2771e4c90db29439e3c986d9859dc74';
    // let param: HttpParams = this.setParamsProj(params)
    return this.httpClient.post(
      resource,
      body,
      params,
      {
        headers: this.setHeaders()
      });
  }

  deleteProjSys(resource, params?) {
    params = this.setParamsObjProj(params);
    return this.httpClient.delete(
      resource,
      params,
      {
        headers: this.setHeaders()
      });
  }

  getProjSys(resource, body?, params?) {

    params = this.setParamsObjProjSys(params);
    return this.httpClient.get(
      resource,
      params,
      {
        responseType: 'json',
        headers: this.setHeaders()

      });
  }
  // endregion

  // region: read inner config data
  getLocalData(name) {
    const urls = APIResource.localUrl + '/data/' + name + '.json?rtc=' + CommonTools.uuID(10);
    return this.http.get<any>(urls);
  }
  // endregion

}

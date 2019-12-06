import { Component, OnInit, AfterViewInit, OnDestroy, Optional, Inject, Input } from '@angular/core';
import { SocialService, DA_SERVICE_TOKEN, TokenService, ITokenModel } from '@delon/auth';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { ReuseTabService } from '@delon/abc';
import { SystemResource } from '@core/utility/system-resource';
import { CommonTools } from '@core/utility/common-tools';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observer } from 'rxjs';

@Component({
  selector: 'bsn-inline-card-swipe',
  templateUrl: './bsn-inline-card-swipe.component.html',
  styleUrls: ['./bsn-inline-card-swipe.component.less'],
  providers: [SocialService]
})
export class BsnInlineCardSwipeComponent extends CnComponentBase
 implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public config;
  @Input()
  public initData;
  @Input()
  public dialog;
  @Input()
  public permissions;
  public _cardNo = {};
  private ajax = {
    url: 'open/getEquipment',
    ajaxType: 'get',
    params: [
      {
        'name': 'typeCode',
        'type': 'value',
        'value': 'CARD'
      },
      {
        'name': 'clientIp',
        'type': 'value',
        'value': ''
      }
    ]
  }
  private ipConfig = {
    url: 'utils/getClientIp',
    ajaxType: 'get',
    params: []
  };

  constructor(
    private cacheService: CacheService,
    private apiService: ApiService,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>
  ) {
    super();
    // modalSrv.closeAll();
    // this.tokenService.clear();
    // this.cacheService.clear();
    // this.menuService.clear();
  }

  public ngOnInit(): void {
    
  }

  public async  ngAfterViewInit() {
    const that = this;
    const clientIp = await this.loadClientIP();
    this.ajax.params[1]['value'] = clientIp;
    const wsString = await this.loadWsConfig();
    const ws = new WebSocket(wsString);
    ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // 连接服务端socket
      ws.send('客户端以上线');
      console.log('数据发送中...');
    };
    ws.onmessage = function (evt) {
      const received_msg = evt.data;
      console.log('数据已接收...', received_msg);
      that.cacheService.set('cardInfo', { cardNo: received_msg });
      that.cascade.next(
        new BsnComponentMessage(
            BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
            that.config.viewId,
            {
                data: {'_cardNo': received_msg}
            }
        )
    );
    };
    ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...');
    };
  }

  public async loadClientIP() {
    let ip;
    const url = this.ipConfig.url;
    const loadData = await this._load(url, {});
    if (loadData.isSuccess) {
      ip = loadData.data.clientIp;
    }
    return ip;
  }

  private async _load(url, params) {
    return this.apiService.get(url, params).toPromise();
  }

  public async loadWsConfig() {
    let wsString;
    const url = this._buildURL(this.ajax.url);
    const params = {
      ...this._buildParameters(this.ajax.params)
    };
    const loadData = await this._load(url, params);
    if (loadData && loadData.status === 200 && loadData.isSuccess) {
      if (loadData.data.length > 0) {
        loadData.data.forEach(element => {
          wsString = 'ws://' + element['webSocketIp'] + ':' + element['webSocketPort'] + '/' + element['connEntry'];
          return true;
        });
      }
    }
    return wsString;
  }

  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this.isString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }

  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        cacheValue: this.cacheService,
        cardValue: this.cacheService
      });
    }
    return params;
  }


  public ngOnDestroy(): void {

  }
  private sendcardNo(e) {
  if (
    this.config.componentType &&
    this.config.componentType.parent === true
) {
    if (this.cacheService.has('cardInfo')) {
      
    }
        
}}


}

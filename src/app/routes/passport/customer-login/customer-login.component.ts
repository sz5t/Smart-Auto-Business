import { SysResource } from '@core/utility/sys-resource';

import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, NzTabChangeEvent, NzNotificationService } from 'ng-zorro-antd';
import {
  SocialService,
  TokenService,
  DA_SERVICE_TOKEN,
  ITokenModel
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { OnlineUser, UserLogin } from '../../../model/APIModel/OnlineUser';
import { AppUser, CacheInfo } from '../../../model/APIModel/AppUser';
import { APIResource } from '@core/utility/api-resource';
import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
// import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { SystemResource } from '@core/utility/system-resource';
import { CommonTools } from '@core/utility/common-tools';
import { timeout, take } from 'rxjs/operators';
import {Buffer} from 'buffer';
import { interval } from 'rxjs';

@Component({
  selector: 'customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.less'],
  providers: [SocialService]
})
export class CustomerLoginComponent implements OnInit, AfterViewInit, OnDestroy {
  public form: FormGroup;
  private error = '';
  public errorApp = '';
  // 登录配置/解析系统的标识：0配置平台，1解析平台
  public loading = false;
  // 当前选择登录系统的配置项
  private _currentSystem;
  private isCardLogin = false;
  private mediaStreamTrack = null;
  public timeout;
  public ws;
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
  private isFaceLogin = false;
  private faceAjax = {
    url: 'open/getEquipment',
    ajaxType: 'get',
    params: [
      {
        'name': 'typeCode',
        'type': 'value',
        'value': 'FACERECOGNITION'
      },
      {
        'name': 'clientIp',
        'type': 'value',
        'value': ''
      }
    ]
  }
  private entry_url = '';
  constructor(
    fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    private cacheService: CacheService,
    private apiService: ApiService,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private titleService: TitleService,
    private menuService: MenuService,
    private _router: ActivatedRoute,
    private notification: NzNotificationService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(1)]],
      password: [null, Validators.required],
      uName: [null, [Validators.required, Validators.minLength(1)]],
      uPassword: [null, [Validators.required]],
      remember: [true]
    });
    modalSrv.closeAll();
  }

  public ngOnInit(): void {
    this.tokenService.clear();
    this.cacheService.clear();
    this.menuService.clear();
    const cacheList = this.cacheService.getMeta();
    if (cacheList) {
        cacheList.forEach(item => {
            this.cacheService.remove(item);
        });
    }
    this.titleService.setTitle(this.titleService.default);
    // this.cacheService.set('AppName', 'SmartOne');

    this.cacheService.set('currentConfig', SystemResource.settingSystem);
    this._router.data.subscribe(d => this.entry_url = d.path);
    // this.FaceRecognition();

  }

  public async  ngAfterViewInit() {
    if (this.isFaceLogin) {
      this.getMedia();
    } else if (this.isCardLogin) {
      this.getCard();
    }
  }

  public async getCard() {
    const that = this;
    const clientIp = await this.loadClientIP();
    this.ajax.params[1]['value'] = clientIp;
    const wsString = await this.loadWsConfig(1);
    that.ws = new WebSocket(wsString);
    that.ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // 连接服务端socket
      that.ws.send('客户端以上线');
      console.log('数据发送中...');
    };
    that.ws.onmessage = function (evt) {
      const received_msg = evt.data;
      console.log('数据已接收...', received_msg);
      that.apiService.login('common/card/login', { cardNo: received_msg })
        .toPromise()
        .then(user => {
          if (user.isSuccess) {
            // console.log(user.data);
            that.cacheService.set('userInfo', user.data);
            const token: ITokenModel = { token: user.data.token };
            that.tokenService.set(token); // 后续projectId需要进行动态获取
            // let url = user.data.modules[0].link;
            let url = '/ts/entry';
            that.ws.close();
            that.ws = null;
            that.router.navigate([`${url}`]);
          } else {
            that.showError(user.message);
            that.ws.send('reload');
          }

        });

    };
    that.ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...');
    };
  }

  public async FaceRecognition(image?) {
    const that = this;
    const clientIp = await this.loadClientIP();
    this.faceAjax.params[1]['value'] = clientIp;
    const wsString = await this.loadWsConfig(2);
    that.ws = new WebSocket(wsString);
    that.ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // 连接服务端socket
      that.ws.send(image);
      console.log('数据发送中...');
    };
    that.ws.onmessage = function (evt) {
      const received_msg = evt.data;
      console.log('数据已接收...', received_msg);
      that.apiService.login('common/login2', { Id: received_msg })
        .toPromise()
        .then(user => {
          if (user.isSuccess) {
            console.log(user.data);
            that.closeMedia();
            clearTimeout(that.timeout);
            that.cacheService.set('userInfo', user.data);
            const token: ITokenModel = { token: user.data.token };
            that.tokenService.set(token); // 后续projectId需要进行动态获取
            // let url = user.data.modules[0].link;
            let url = '/dashboard/v1';
            let menus;
            // 解析平台
            // const projModule = await this._loadProjectModule();
            menus = [
              {
                text: '功能导航',
                i18n: '',
                group: true,
                hideInBreadcrumb: true,
                children: []
              }
            ];
            // menus[0].children = this.arrayToTree(projModule.data, null);
            menus[0].children = user.data.modules;
            url = '/dashboard/v1';
            that.cacheService.set('Menus', menus);
            that.menuService.add(menus);
            that.ws.close();
            that.ws = null;
            that.router.navigate([`${that.entry_url}`]);
          } else {
            that.showError(user.message);
            that.ws.send('reload');
          }

        });

    };
    that.ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...');
    };
  }

  public getMedia() {
    const constraints = {
      video: { width: 300, height: 300 },
      audio: true
    };
    // 获得video摄像头区域
    const video = <HTMLVideoElement>document.getElementById('video');
    // 这里介绍新的方法，返回一个 Promise对象
    // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
    // then()是Promise对象里的方法
    // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
    // 避免数据没有获取到
    // const promise = navigator.mediaDevices.getUserMedia(constraints);
    const that = this;
    // promise.then(function (MediaStream) {
    //   console.log(that.mediaStreamTrack);
    //   //  this.mediaStreamTrack = MediaStream.getTracks()[0];
    //   that.mediaStreamTrack = typeof MediaStream['stop'] === 'function' ? MediaStream : MediaStream.getTracks()[1];
    //   video.srcObject = MediaStream;
    //   video.play();
    // });
    window.navigator['getMedia'] = window.navigator.getUserMedia ||
      window.navigator['webkitGetUserMedia'] ||
      window.navigator['mozGetUserMedia'] ||
      window.navigator['msGetUserMedia'];
    window.navigator['getMedia']({
      video: true, // 使用摄像头对象
      audio: false  // 不适用音频
    }, function (MediaStream) {
      // console.log(MediaStream, MediaStream.getTracks());
      that.mediaStreamTrack = typeof MediaStream.stop === 'function' ? MediaStream : MediaStream.getTracks()[0];
      video.srcObject = MediaStream;
      // video.src = vendorUrl.createObjectURL(strem);
      video.play();

    }, function (error) {
      console.log(error);
    });

    this.timeout = setTimeout(() => {
      this.takePhoto();
    }, 3000);
  }

  public takePhoto() {
    // 获得Canvas对象
    let video = <HTMLVideoElement>document.getElementById('video');
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 500, 500);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
    // console.log(dataUrl);
    this.FaceRecognition(dataUrl);
  }

  public closeMedia() {
    // console.log(this.mediaStreamTrack);
    this.mediaStreamTrack && this.mediaStreamTrack.stop();
  }

  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
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

  public async loadWsConfig(i: number) {
    let wsString;
    let url;
    let params;
    if (i === 1) {
      url = this._buildURL(this.ajax.url);
      params = {
        ...this._buildParameters(this.ajax.params)
      };
    } else if (i === 2) {
      url = this._buildURL(this.faceAjax.url);
      params = {
        ...this._buildParameters(this.faceAjax.params)
      }
    }
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

  public changeTab($event: NzTabChangeEvent) {
    if ($event.index === 2) {
      this.getMedia();
    }
    if ($event.index !== 2) {
      this.isFaceLogin = false
      this.closeMedia();
    }
    if ($event.index === 1) {
      this.isCardLogin = true
      this.getCard();
    }
    if ($event.index !== 1) {
      this.isCardLogin = false
    }
  }


  private async _load(url, params) {
    return this.apiService.get(url, params).toPromise();
  }
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this.isString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }
  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        cacheValue: this.cacheService
      });
    }
    return params;
  }


  private chooseLogin() {
    // this.isCardLogin = !this.isCardLogin;
    // this.isFaceLogin = !this.isFaceLogin;
  }
  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get uName() {
    return this.form.controls.uName;
  }
  get uPassword() {
    return this.form.controls.uPassword;
  }

  // endregion

  // private switchLogin(ret: any) {
  //     this.type = ret.index;
  //     if (ret.index === 0) {
  //         this.titleService.setTitle('SmartOne配置平台');
  //     } else {
  //         this.titleService.setTitle('SmartOne运行平台');
  //         this.cacheService.set('AppName', 'SmartOne');
  //     }
  // }

  // region: get captcha

  // count = 0;
  // interval$: any;

  // getCaptcha() {
  //     this.count = 59;
  //     this.interval$ = setInterval(() => {
  //         this.count -= 1;
  //         if (this.count <= 0)
  //             clearInterval(this.interval$);
  //     }, 1000);
  // }

  // endregion

  public submit() {
    this.error = '';
    this.errorApp = '';
    this.loading = true;
    this.reuseTabService.clear();

    const userLogin = new UserLogin();
    const cacheInfo = new CacheInfo();
    // 重置表单状态
    this._remarkLoginForm();
    // 构建用户登录信息
    this._buildOnlineUser(userLogin);

    this.login(userLogin);
  }

  public async login(userLogin) {
    // userLogin.loginPwd = new Buffer(userLogin.loginPwd).toString('base64');
    const user = await this._userLogin(userLogin);
    if (user.isSuccess) {
      // console.log(user.data);
      this.cacheService.set('userInfo', user.data);
      const token: ITokenModel = { token: user.data.token };
      this.tokenService.set(token); // 后续projectId需要进行动态获取
      let menus;
      let url;
      // 解析平台
      // const projModule = await this._loadProjectModule();
      menus = [
        {
          text: '功能导航',
          i18n: '',
          group: true,
          hideInBreadcrumb: true,
          children: []
        }
      ];
      // menus[0].children = this.arrayToTree(projModule.data, null);
      menus[0].children = user.data.modules;
      url = '/app/entry';

      this.cacheService.set('Menus', menus);
      this.menuService.add(menus);
      this.router.navigate([`${this.entry_url}`]);
    } else {
      if (user.message === 'PwdExpired') {
        
        const numbers = interval(1000);
        const takeFourNumbers = numbers.pipe(take(3));
        takeFourNumbers.subscribe(
          x => {
        
            this.showError("您的密码已过期"+(3-x)+"秒后跳转至修改密码页面");
          },
          error => {},
          () => {
            let newurl = '/passport/edit-password';
            this.router.navigate([`${newurl}`]);
         });        
             
        // console.log('PwdExpired',userLogin,user.data);
        return true;
      } else{
        this.showError(user.message);
      }
    }
    this.loading = false;
  }

  


  public async _loadProjectModule() {
    return this.apiService
      .get(
        'common/ComProjectModule/null/ComProjectModule?refProjectId=7fe971700f21d3a796d2017398812dcd&_recursive=true&_deep=3'
      )
      .toPromise();
  }

  public async _userLogin(userLogin) {
    return this.apiService.login('common/login', userLogin).toPromise();
  }

  public async _getLocalAppData() {
    return this.httpClient
      .get<any>(
        // environment.SERVER_URL
        SystemResource.localResource.url
        + '/assets/app-data.json'
      )
      .toPromise();
  }

  // async _getAppPermission() {
  //     return this.apiService
  //         .get(APIResource.AppPermission + "/Func.SinoForceWeb前端")
  //         .toPromise();
  // }

  public async _getAppConfig() {
    return this.httpClient.get('assets/app-config.json').toPromise();
  }

  public _buildOnlineUser(onlineUser: UserLogin) {
    if (!this.isCardLogin) {
      onlineUser.loginName = this.userName.value;
      onlineUser.loginPwd = this.password.value;
      // Md5.hashStr(this.password.value).toString().toUpperCase();
      // environment.SERVER_URL = APIResource.SettingUrl;
      // environment.COMMONCODE = APIResource.SettingCommonCode;
    } else {
      onlineUser.loginName = this.uName.value;
      onlineUser.loginPwd = this.uPassword.value;
      // Md5.hashStr(this.uPassword.value).toString().toUpperCase();
      // environment.SERVER_URL = APIResource.LoginUrl;
      // environment.COMMONCODE = APIResource.LoginCommonCode;
    }
    this.cacheService.set('currentConfig', SystemResource.appSystem);
  }

  public _remarkLoginForm() {
    if (!this.isCardLogin) {
      // 配置平台
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      // 解析平台
      this.uName.markAsDirty();
      this.uName.updateValueAndValidity();
      this.uPassword.markAsDirty();
      this.uPassword.updateValueAndValidity();
      if (this.uName.invalid || this.uPassword.invalid) return;
    }
  }

  public appPerMerge(data) {
    const menus: any[] = this.cacheService.getNone('Menus');
    if (data['FuncResPermission']) {
      const permis =
        data['FuncResPermission'].SubFuncResPermissions[0]
          .SubFuncResPermissions;
      this.seachModule(menus, permis);
      this.cacheService.set('Menus', menus);

      this.menuService.add(menus);
      this.router.navigate(['/dashboard/analysis']);
    } else {
      this.showError('该用户没有任何权限');
    }
  }

  public seachModule(menus, data) {
    menus.forEach(item => {
      const strPer = JSON.stringify(this.searchAppper(item.id, data));

      const subStr = strPer.substring(
        strPer.indexOf('[{'),
        strPer.lastIndexOf('}]') + 2
      );
      if (subStr.length > 5) {
        const Perer = JSON.parse(subStr);
        switch (Perer[0].Permission) {
          case 'Invisible':
            // console.log(111, item.hide);
            item.hide = true;
            // console.log(222, item.hide);
            break;
          case 'Permitted':
            // console.log(333, item.hide);
            item.hide = false;
            // console.log(444, item.hide);
            break;
          default:
          // console.log(555, item.hide);
        }
        if (item.children) {
          this.seachModule(item.children, data);
        }
      } else {
        item.hide = true;
      }
    });
  }

  public searchAppper(moduleId, data): string {
    const OpPer: any = [];
    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.Id === moduleId) {
          OpPer.push(item.OpPermissions);
        } else {
          const getAppper = this.searchAppper(
            moduleId,
            item.SubFuncResPermissions
          );
          if (getAppper && item.Name.length > 0)
            OpPer.push(getAppper);
        }
      });
    }
    return OpPer;
  }

  public showError(errmsg) {
    this.errorApp = errmsg;
  }

  public ngOnDestroy(): void {
    // if (this.interval$) clearInterval(this.interval$);
    // this.mediaStreamTrack.stop();
  }

  public arrayToTree(data, parentid): any[] {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === parentid) {
        const obj = {
          text: data[i].name,
          id: data[i].Id,
          // group: JSON.parse(data[i].ConfigData).group,
          link: data[i].url ? data[i].url : '',
          icon: data[i].icon,
          hide: data[i].isEnabled ? false : true
        };
        temp = this.arrayToTree(data[i].children, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          obj['isLeaf'] = true;
        }
        result.push(obj);
      }
    }
    return result;
  }
}


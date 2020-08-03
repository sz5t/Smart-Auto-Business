import { SysResource } from '@core/utility/sys-resource';

import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
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

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'passport-calogin',
    templateUrl: './calogin.component.html',
    styleUrls: ['./calogin.component.less'],
    providers: [SocialService]
})
export class CALoginComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public error = '';
    public errorApp = '';
    // 登录配置/解析系统的标识：0配置平台，1解析平台
    public type = 0;
    public loading = false;
    // 当前选择登录系统的配置项
    public _currentSystem;

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
        @Optional()
        @Inject(ReuseTabService)
        private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        private _route: ActivatedRoute
    ) {
        this.form = fb.group({
            cert: [null, [Validators.required, Validators.minLength(10)]]
        });
        modalSrv.closeAll();
    }


    

    public ngOnInit(): void {
        this.tokenService.clear();
        this.cacheService.clear(); 
        this.menuService.clear();
        this.titleService.setTitle(this.titleService.default);

        this._route.params.subscribe(params => {
            this.caLogin(params.Id);
        });

        
        // this.cacheService.set('AppName', 'SmartOne');
    }
    // region: fields
    get cert() {
        return this.form.controls.cert;
    }
    get sign() {
        return this.form.controls.sign;
    }

    // endregion

    // public switchLogin(ret: any) {
    //     this.type = ret.index;
    //     if (ret.index === 0) {
    //         this.titleService.setTitle('SmartOne配置平台');
    //     } else {
    //         this.titleService.setTitle('质量数据包管理系统');
    //         this.cacheService.set('AppName', 'SmartOne');
    //     }
    // }

    public caLogin(Id) {
      // 1、获取USB_KEY数据，用户名、KEY
      // 2、调用后台CA登录接口
      this.login({Id: Id});
    }

    public submit() {
        this.error = '';
        this.errorApp = '';
        this.loading = true;
        this.reuseTabService.clear();

        const userLogin = new UserLogin();
        const cacheInfo = new CacheInfo();
        // 重置表单状态
        // this._remarkLoginForm();
        // 构建用户登录信息
        this._buildCAUserInfo(userLogin);

        this.login(userLogin);
    }

    public _buildCAUserInfo(userLogin) {
      userLogin.cert = 'this.uName.value';
      userLogin.sign = 'this.uPassword.value';
      this.cacheService.set('currentConfig', SystemResource.appSystem);
    }

    public async login(userLogin) {
        const user = await this._userLogin(userLogin);
        if (user && user.status === 200 && user.isSuccess) {
            console.log(user.data);
            this.cacheService.set('userInfo', user.data);
            const token: ITokenModel = { token: user.data.token };
            this.tokenService.set(token); // 后续projectId需要进行动态获取

            let menus;
            let url;
            if (this.type === 0) {
                // 配置平台
                const localAppDataResult = await this._getLocalAppData();
                menus = localAppDataResult.menu;
                url = '/dashboard/v1';
            } else {
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
            }

            this.cacheService.set('Menus', menus);
            this.menuService.add(menus);

            this.router.navigate([`${url}`]);
        } else {
            this.showError(user.message);
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
        return this.apiService.post('common/ca/login', userLogin).toPromise();
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

    public async _getAppConfig() {
        return this.httpClient.get('assets/app-config.json').toPromise();
    }


    // public _remarkLoginForm() {
    //     if (this.type === 0) {
    //         // 配置平台
    //         this.userName.markAsDirty();
    //         this.userName.updateValueAndValidity();
    //         this.password.markAsDirty();
    //         this.password.updateValueAndValidity();
    //         if (this.userName.invalid || this.password.invalid) return;
    //     } else {
    //         // 解析平台
    //         this.uName.markAsDirty();
    //         this.uName.updateValueAndValidity();
    //         this.uPassword.markAsDirty();
    //         this.uPassword.updateValueAndValidity();
    //         if (this.uName.invalid || this.uPassword.invalid) return;
    //     }
    // }

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
                        item.hide = true;
                        break;
                    case 'Permitted':
                        item.hide = false;
                        break;
                    default:
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
        if (this.type === 0) this.error = errmsg;
        else this.errorApp = errmsg;
    }

    public ngOnDestroy(): void {

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

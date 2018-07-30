import { SysResource } from '@core/utility/sys-resource';

import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, TokenService, DA_SERVICE_TOKEN, ITokenModel } from '@delon/auth';
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
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnInit, OnDestroy {
    form: FormGroup;
    error = '';
    errorApp = '';
    // 登录配置/解析系统的标识：0配置平台，1解析平台
    type = 0;
    loading = false;
    // 当前选择登录系统的配置项
    _currentSystem;

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
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(1)]],
            password: [null, Validators.required],
            uName: [null, [Validators.required, Validators.minLength(1)]],
            uPassword: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
        this.tokenService.clear();
        this.cacheService.clear();
        this.menuService.clear();
    }

    ngOnInit(): void {
        
        this.titleService.setTitle('配置平台');
        this.cacheService.set('AppName', '自动化业务装配系统');
    }
    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get uName() { return this.form.controls.uName; }
    get uPassword() { return this.form.controls.uPassword; }

    // endregion

    switchLogin(ret: any) {
        this.type = ret.index;
        if (ret.index === 0) {
            this.titleService.setTitle('配置平台');
        } else {
            this.titleService.setTitle('解析平台');
            this.cacheService.set('AppName', 'XXX信息化系统');
        }
    }

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

    submit() {
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

        // (async () => {
        //     const onlineUserResult = await this._getOnlineUser(onlineUser);
        //     if (onlineUserResult.Data && onlineUserResult.Status === 200) {
        //         onlineUser = onlineUserResult.Data;
        //         if (!onlineUser.Online) {
        //             this.showError(onlineUser.Message);
        //             this.loading = false;
        //             return;
        //         }
        //         this.cacheService.set('OnlineUser', OnlineUser);
        //         cacheInfo.ProjectId = onlineUser.ProjId;
        //         cacheInfo.PlatCustomerId = onlineUser.PlatCustomerId;
        //         this.tokenService.set({ token: onlineUser.Token });
        //     }

        //     const appUserResult = await this._getAppUser(onlineUser.UserId);
        //     if (appUserResult.Data && appUserResult.Status === 200) {
        //         this.settingsService.setUser(appUserResult.Data);
        //         cacheInfo.RealName = appUserResult.Data.RealName;
        //         this.cacheService.set('User', appUserResult.Data);
        //     }

        //     const sysCommonCodeResult = await this._getSysCommonCode();
        //     if (sysCommonCodeResult.Data && sysCommonCodeResult.Status === 200) {
        //         console.log(sysCommonCodeResult);
        //         cacheInfo.ApplyId = sysCommonCodeResult.Data[0].Id;
        //         this.cacheService.set('ParamsUrl', cacheInfo);
        //     }

        //     const appModuleResult = await this._getAppModule(cacheInfo.ApplyId);
        //     if (appModuleResult.Data && appModuleResult.Status === 200) {
        //         if (this.type === 0) {
        //             const localAppDataResult = await this._getLocalAppData();
        //             if (localAppDataResult) {
        //                 this.cacheService.set('Menus', localAppDataResult.menu);
        //                 this.menuService.add(localAppDataResult.menu);
        //             }
        //         } else {
        //             // 运行平台菜单
        //             const moduleMenu = this.arrayToTree(appModuleResult.Data, '');
        //             this.cacheService.set('Menus', moduleMenu);
        //             this.menuService.add(moduleMenu);
        //         }
        //     }

           
        //     const appPermissionResult = await this._getAppPermission();
        //     if (appPermissionResult.Data && appPermissionResult.Status === 200) {
        //         if (this.type === 0) {
        //             this.router.navigate(['/']);
        //         } else {
        //             const appper = appPermissionResult.Data;
        //             this.router.navigate(['/dashboard/analysis']);
        //             // this.cacheService.set('AppPermission', appper);
        //             // this.appPerMerge(appper);
        //         }
        //     }

        //     this.loading = false;
        // })();

        this.login(userLogin);
    }

    async login(userLogin) {
        const user = await this._userLogin(userLogin);
        if (user && user.status === 200 && user.isSuccess) {
            this.cacheService.set('userInfo', user.data);
            const token: ITokenModel = {token: user.data.token};
            this.tokenService.set(token); // 后续projectId需要进行动态获取

            let menus;
            let url;
            if (this.type === 0) { // 配置平台
                const localAppDataResult = await this._getLocalAppData();
                menus = localAppDataResult.menu;
                url = '/dashboard/analysis';
            } else { // 解析平台
                const projModule = await this._loadProjectModule();
                menus = this.arrayToTree(projModule.data, null);
                url = '/';
            }
            
            this.cacheService.set('Menus', menus);
            this.menuService.add(menus);

            this.router.navigate([`${url}`]);
        } else {
            this.showError(user.message);
        }
        this.loading = false;
    }

    async _loadProjectModule() {
        return this.apiService.get('common/ComProjectModule/null/ComProjectModule?projectId=90621e37b806o6fe8538c5eb782901bb&_recursive=true&_deep=3').toPromise();
    }

    async _userLogin (userLogin) {
        return this.apiService.post('common/Action/ComSysAccount/login', userLogin).toPromise();
    }

    async _getOnlineUser(onlineUser) {
        return this.apiService.post(APIResource.OnlineUser, onlineUser).toPromise();
    }

    async _getAppUser(userId) {
        return this.apiService.get(APIResource.AppUser + '/' + userId).toPromise();
    }

    async _getSysCommonCode() {
        return this.apiService.get(APIResource.SysCommonCode, {
            name: environment.COMMONCODE,
            ApplyId: 'ApplyId'
        }).toPromise();
    }
    async _getAppModule(applyId) {
        return this.apiService.getProj(`${APIResource.AppModuleConfig}/_root/${APIResource.AppModuleConfig}?_recursive=true&_deep=4&_root.ApplyId=${applyId}&_root.parentid=in("",null)`, {
            _orderBy: 'order asc'
        }).toPromise();
    }

    async _getLocalAppData() {
        return this.httpClient.get<any>(APIResource.localUrl + '/app-data.json').toPromise();
    }

    async _getAppPermission() {
        return this.apiService.get(APIResource.AppPermission + '/Func.SinoForceWeb前端').toPromise();
    }

    async _getAppConfig() {
        return this.httpClient.get('assets/app-config.json').toPromise();
    }

    _buildOnlineUser(onlineUser: UserLogin) {
        if (this.type === 0) {
            onlineUser.loginName = this.userName.value;
            onlineUser.loginPwd = this.password.value; 
            // Md5.hashStr(this.password.value).toString().toUpperCase();
            // environment.SERVER_URL = APIResource.SettingUrl;
            // environment.COMMONCODE = APIResource.SettingCommonCode;
            
            this.cacheService.set('currentConfig', SystemResource.settingSystem);
        } else {
            onlineUser.loginName = this.uName.value;
            onlineUser.loginPwd = this.uPassword.value; 
            // Md5.hashStr(this.uPassword.value).toString().toUpperCase();
            // environment.SERVER_URL = APIResource.LoginUrl;
            // environment.COMMONCODE = APIResource.LoginCommonCode;
            this.cacheService.set('currentConfig', SystemResource.appSystem);
        }
    }


    _remarkLoginForm() {
        if (this.type === 0) {
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

    appPerMerge(data) {
        const menus: any[] = this.cacheService.getNone('Menus');
        if (data['FuncResPermission']) {
            const permis = data['FuncResPermission'].SubFuncResPermissions[0].SubFuncResPermissions;
            this.seachModule(menus, permis);
            this.cacheService.set('Menus', menus);


            this.menuService.add(menus);
            this.router.navigate(['/dashboard/analysis']);
        } else {
            this.showError('该用户没有任何权限');
        }
    }

    seachModule(menus, data) {
        menus.forEach(item => {
            const strPer = JSON.stringify(this.searchAppper(item.id, data));

            const subStr = strPer.substring(strPer.indexOf('[{'), strPer.lastIndexOf('}]') + 2);
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

    searchAppper(moduleId, data): string {
        const OpPer: any = [];
        if (data && data.length > 0) {
            data.forEach(item => {
                if (item.Id === moduleId) {
                    OpPer.push(item.OpPermissions);
                } else {
                    const getAppper = this.searchAppper(moduleId, item.SubFuncResPermissions);
                    if (getAppper && item.Name.length > 0)
                        OpPer.push(getAppper);
                }
            });
        } return OpPer;
    }

    showError(errmsg) {
        if (this.type === 0)
            this.error = errmsg;
        else this.errorApp = errmsg;
    }

    ngOnDestroy(): void {
        // if (this.interval$) clearInterval(this.interval$);
    }

    arrayToTree(data, parentid): any[] {
        const result = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const obj = {
                    text: data[i].name,
                    id: data[i].Id,
                    // group: JSON.parse(data[i].ConfigData).group,
                    link: data[i].url ? data[i].url :  '',
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

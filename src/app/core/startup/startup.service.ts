import { NzIconService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { APIResource } from '@core/utility/api-resource';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import {
    ALAIN_I18N_TOKEN,
    MenuService,
    SettingsService,
    TitleService
} from '@delon/theme';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { I18NService } from '@core/i18n/i18n.service';
import { SystemResource } from '@core/utility/system-resource';

import G6Editor from '@antv/g6-editor';
import G6 from '@antv/g6';
/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        iconSrv: NzIconService,
        private cacheService: CacheService
    ) {
        // iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
        G6Editor.track(false);
        G6.track(false);
    }

    public load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get(
                    // environment.SERVER_URL +
                    SystemResource.localResource.url +
                        `/assets/i18n/${this.i18n.defaultLang}.json`
                ),
                this.httpClient.get(
                    // environment.SERVER_URL +
                    SystemResource.localResource.url 
                    + '/assets/app-data.json'
                )
            )
                .pipe(
                    // 接收其他拦截器后产生的异常消息
                    catchError(([langData, appData]) => {
                        resolve(null);
                        return [langData, appData];
                    })
                )
                .subscribe(
                    ([langData, appData]) => {
                        // setting language data
                        this.translate.setTranslation(
                            this.i18n.defaultLang,
                            langData
                        );
                        this.translate.setDefaultLang(this.i18n.defaultLang);
                        // 语言信息
                        this.settingService.setLayout('lang', 'zh-CN');
                        // application data
                        const res: any = appData;
                        const user: any = this.cacheService.getNone('userInfo');
                        const menu: any = this.cacheService.getNone('Menus');

                        // 判断用户是否已经登录过系统
                        const currentSystem: any = this.cacheService.getNone(
                            'currentConfig'
                        );
                        // 1、未进行登录
                        // 读取配置信息，并进行缓存
                        if (!currentSystem && user) {
                            //this.cacheService.clearNotify();
                            //this.tokenService.clear();
                        } else if (
                            currentSystem &&
                            currentSystem.name === 'setting'
                        ) {
                            // 用户已经选择了系统并进行过登录
                           this.menuService.add(res.menu);
                        } else if (
                            currentSystem &&
                            currentSystem.name === 'app'
                        ) {
                            this.menuService.add(menu);
                        }

                        // 应用信息：包括站点名、描述、年份
                        this.settingService.setApp(res.app);
                        // 用户信息：包括姓名、头像、邮箱地址
                        this.settingService.setUser(user);
                        // ACL：设置权限为全量
                        this.aclService.setFull(true);
                        // 初始化菜单
                        // if (this.cacheService.getNone('IsSettings') === 'LOGING') {
                        //     environment.SERVER_URL = APIResource.LoginUrl;
                        // } else if (this.cacheService.getNone('IsSettings') === 'SETTING') {
                        //     environment.SERVER_URL = APIResource.SettingUrl;
                        // }
                        // this.menuService.add(menu);
                        // 设置页面标题的后缀
                        // this.titleService.suffix = res.app.name;
                        this.titleService.default = res.app.name;
                    },
                    () => {},
                    () => {
                        resolve(null);
                    }
                );
        });
    }
}

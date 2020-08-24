import { Component, HostBinding, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService, TitleService, MenuService } from '@delon/theme';
import { filter } from 'rxjs/operators';
import { ApartmentOutline } from '@ant-design/icons-angular/icons';
import { NzIconService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    @HostBinding('class.layout-fixed')
    get isFixed() {
        return this.settings.layout.fixed;
    }
    @HostBinding('class.layout-boxed')
    get isBoxed() {
        return this.settings.layout.boxed;
    }
    @HostBinding('class.aside-collapsed')
    get isCollapsed() {
        return this.settings.layout.collapsed;
    }

    constructor(
        private cacheService: CacheService,
        private menuService: MenuService,
        private iconService: NzIconService,
        private settings: SettingsService,
        private router: Router,
        private titleSrv: TitleService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
        // if (typeof G2 !== 'undefined') {
            G2.track(false);
        // }
        this.iconService.addIcon(ApartmentOutline);
        this.iconService.twoToneColor = { primaryColor: '#1890ff' };
        this.iconService.fetchFromIconfont({
            scriptUrl: '../assets/svg/iconfont.js'
        })
    }

    public ngOnInit() {
        const that = this;
        window.onbeforeunload = function (e) {
            // window.event.returnValue =  true;
            //that.tokenService.clear();
            //that.cacheService.clear();
            //that.menuService.clear();

        }
        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe(() => this.titleSrv.setTitle());
    }
}

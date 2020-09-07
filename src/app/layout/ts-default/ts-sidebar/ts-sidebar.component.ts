import { Component, Inject } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { CacheService } from '@delon/cache';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ts-sidebar',
    templateUrl: './ts-sidebar.component.html',
    styles: [
        `
            :host ::ng-deep .nav {
                font-size: 12px;
            }
            :host ::ng-deep ul .nav > li > a {
                font-size: 12px;
            }
        `
    ]
})
export class TsSidebarComponent {
    constructor(
        public settings: SettingsService,
        private modal: NzModalService,
        private router: Router,
        private cacheService: CacheService,
        public msgSrv: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {}

    public logout() {
        this.modal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                const pageList = this.cacheService.getMeta();
                pageList.forEach(item => {
                  this.cacheService.remove(item);
                });
                new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    this.tokenService.clear();
                    this.cacheService.clear();
                    this.router.navigateByUrl(this.tokenService.login_url);
                }).catch(() => console.log('Oops errors!'));
            }
        });
    }
}

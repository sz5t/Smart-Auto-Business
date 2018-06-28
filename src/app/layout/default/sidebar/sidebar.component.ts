import {Component, Inject} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import {CacheService} from '@delon/cache';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {Router} from '@angular/router';

@Component({
    selector   : 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
    constructor(
        public settings: SettingsService ,
        private modal: NzModalService, 
        private router: Router, 
        private cacheService: CacheService, 
        public msgSrv: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    logout() {
        this.modal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject , 1000);
                    this.tokenService.clear();
                    this.cacheService.clear();
                    this.router.navigateByUrl(this.tokenService.login_url);
                }).catch(() => console.log('Oops errors!'));
            }});
    }
}

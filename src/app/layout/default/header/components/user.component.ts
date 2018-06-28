// import { Component, OnInit, Inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { SettingsService } from '@delon/theme';
// import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

// @Component({
//     selector: 'header-user',
//     template: `
//     <nz-dropdown nzPlacement="bottomRight">
//         <div class="item d-flex align-items-center px-sm" nz-dropdown>
//             <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
//             {{settings.user.name}}
//         </div>
//         <div nz-menu class="width-sm">
//             <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
//             <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
//             <li nz-menu-divider></li>
//             <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
//         </div>
//     </nz-dropdown>
//     `
// })
// export class HeaderUserComponent implements OnInit {
//     constructor(
//         public settings: SettingsService,
//         private router: Router,
//         @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}

//     ngOnInit(): void {
//         this.tokenService.change().subscribe((res: any) => {
//             this.settings.setUser(res);
//         });
//         // mock
//         const token = this.tokenService.get() || {
//             token: 'nothing',
//             name: 'Admin',
//             avatar: './assets/img/zorro.svg',
//             email: 'cipchk@qq.com'
//         };
//         this.tokenService.set(token);
//     }

//     logout() {
//         this.tokenService.clear();
//         this.router.navigateByUrl(this.tokenService.login_url);
//     }
// }
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'header-user',
    template: `
    <nz-dropdown nzPlacement="bottomRight">
        <div class="item d-flex align-items-center px-sm" nz-dropdown>
            <nz-avatar [nzSrc]="settings.user['Remark']" nzSize="small" class="mr-sm"></nz-avatar>
            {{settings.user['RealName']}}
        </div>
        <div nz-menu class="width-sm">
            <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
            <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
            <li nz-menu-divider></li>
            <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
        </div>
    </nz-dropdown>
    `
})
export class HeaderUserComponent implements OnInit {
    // confirmModal: NzModalRef;
    constructor(
        public settings: SettingsService,
        private cacheService: CacheService,
        private router: Router,
        private modal: NzModalService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) { }

    ngOnInit(): void {
        this.tokenService.change().subscribe((res: any) => {
            this.settings.setUser(res);
        });
        // mock
        // const token = this.tokenService.get() || {
        //     token: 'nothing',
        //     name: 'Admin',
        //     avatar: './assets/img/zorro.svg',
        //     email: '888cipchk@qq.com'
        // };
        // this.tokenService.set(token);
    }

    logout() {
        this.modal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                this.tokenService.clear();
                this.cacheService.clear();
                this.router.navigateByUrl(this.tokenService.login_url);
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    
                // }).catch(() => console.log('Oops errors!'));
            }
        });
    }
}

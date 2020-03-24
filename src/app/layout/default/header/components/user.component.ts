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
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, MenuService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { NzModalService } from 'ng-zorro-antd';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'header-user',
    template: `
    <nz-dropdown nzPlacement="bottomRight">
        <div class="item d-flex align-items-center px-sm" nz-dropdown>
            <nz-avatar [nzSrc]="'../assets/img/user.svg'" nzSize="small" class="mr-sm"></nz-avatar>
            <!--<pre>{{userInfo | json}}</pre>-->
            {{userInfo?.accountName ? userInfo?.accountName: '用户'}}
        </div>
        <div nz-menu class="width-sm">
            <div nz-menu-item hidden="true" [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
            <div nz-menu-item hidden="true" [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
            <li nz-menu-divider hidden="true"></li>
            <div nz-menu-item (click)="editPassWord()"><i class="anticon anticon-edit mr-sm"></i>修改密码</div>
            <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
        </div>
    </nz-dropdown>
    `
})
export class HeaderUserComponent implements OnInit, AfterViewInit {
    // confirmModal: NzModalRef;
    public userInfo: any;
    constructor(
        public settings: SettingsService,
        private cacheService: CacheService,
        private menuService: MenuService,
        private modalService: NzModalService,
        private router: Router,
        private modal: NzModalService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    }

    public ngOnInit(): void {
        // mock
        // const token = this.tokenService.get() || {
        //     token: 'nothing',
        //     name: 'Admin',
        //     avatar: './assets/img/zorro.svg',
        //     email: '888cipchk@qq.com'
        // };
        // this.tokenService.set(token);
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.userInfo = this.cacheService.getNone('userInfo');
        });

        // this.tokenService.change().subscribe((res: any) => {
        //     this.settings.setUser(res);
        // });
    }

    public logout() {
        this.modal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                this.tokenService.clear();
                this.cacheService.clear();
                this.menuService.clear();
                // console.log(this.tokenService.login_url);
                this.router.navigateByUrl(this.tokenService.login_url);
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

                // }).catch(() => console.log('Oops errors!'));
            }
        });
    }

    public editPassWord() {
        const dialog = {
            'keyId': 'Id',
            'name': 'updateUserPassword',
            'title': '修改密码：',
            'editable': 'put',
            'width': '600',
            'ajaxConfig': {
                'url': 'common/SysAccount',
                'ajaxType': 'getById',
                'params': [
                    {
                        'name': 'Id',
                        'type': 'cacheValue',
                        'valueName': 'accountId'
                    }
                ]
            },
            'componentType': {
                'parent': false,
                'child': false,
                'own': true
            },
            'forms': [
                {
                    'controls': [
                        {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'password',
                            'name': 'oldPassword',
                            'label': '原密码',
                            'isRequired': true,
                            'disabled': false,
                            'readonly': false,
                            'size': 'default',
                            'layout': 'column',
                            'span': '24',
                            'validations': [
                                {
                                    'validator': 'required',
                                    'errorMessage': '请输入原密码'
                                }
                            ]
                        }
                    ]
                },
                {
                    'controls': [
                        {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'password',
                            'name': 'password',
                            'label': '新密码',
                            'isRequired': true,
                            'disabled': false,
                            'readonly': false,
                            'size': 'default',
                            'layout': 'column',
                            'span': '24',
                            'validations': [
                                {
                                    'validator': 'required',
                                    'errorMessage': '请输入新密码'
                                }
                            ]
                        }
                    ]
                },
                {
                    'controls': [
                        {
                            'type': 'input',
                            'labelSize': '6',
                            'controlSize': '18',
                            'inputType': 'password',
                            'name': 'confirmPassword',
                            'isRequired': true,
                            'label': '确认新密码',
                            'disabled': false,
                            'readonly': false,
                            'size': 'default',
                            'layout': 'column',
                            'span': '24',
                            'validations': [
                                {
                                    'validator': 'required',
                                    'errorMessage': '请输入再次确定密码'
                                }
                            ]
                        }
                    ]
                }
            ],
            'buttons': [
                {
                    'name': 'save',
                    'text': '保存',
                    'type': 'primary',
                    'ajaxConfig': [
                        {
                            'ajaxType': 'put',
                            'action': 'EXECUTE_SELECTED',
                            'url': 'common/user/account/pwd/update',
                            'params': [
                                {
                                    'name': 'Id',
                                    'type': 'tempValue',
                                    'valueName': '_id'
                                },
                                {
                                    'name': 'oldPassword',
                                    'type': 'componentValue',
                                    'valueName': 'oldPassword'
                                },
                                {
                                    'name': 'password',
                                    'type': 'componentValue',
                                    'valueName': 'password'
                                },
                                {
                                    'name': 'confirmPassword',
                                    'type': 'componentValue',
                                    'valueName': 'confirmPassword'
                                }
                            ]
                        }
                    ]
                },
                {
                    'name': 'close',
                    'class': 'editable-add-btn',
                    'text': '关闭'
                },
                {
                    'name': 'reset',
                    'class': 'editable-add-btn',
                    'text': '重置'
                }
            ]
        }
        const footer = [];
        const modal = this.modalService.create({
            nzTitle: dialog.title,
            nzWidth: dialog.width,
            nzClosable: false,
            nzContent: CnFormWindowResolverComponent,
            nzComponentParams: {
                config: dialog,
                editable: 'add'
            },
            nzFooter: footer
        });

        if (dialog.buttons) {
            dialog.buttons.forEach(btn => {
                const button = {};
                button['label'] = btn.text;
                button['type'] = btn.type ? btn.type : 'default';
                button['onClick'] = componentInstance => {
                    if (btn['name'] === 'save') {
                        componentInstance.buttonAction(
                            btn,
                            () => {
                                modal.close();
                                this.tokenService.clear();
                                this.cacheService.clear();
                                this.menuService.clear();
                                this.router.navigateByUrl(this.tokenService.login_url);
                            }, dialog
                        );
                    } else if (btn['name'] === 'close') {
                        modal.close();
                    } else if (btn['name'] === 'reset') {
                        this._resetForm(componentInstance);
                    }
                };
                footer.push(button);
            });
        }
    }

    /**
     * 重置表单
     * @param comp
     * @private
     */
    private _resetForm(comp: FormResolverComponent) {
        comp.resetForm();
    }
}

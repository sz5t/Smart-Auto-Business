import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService, MenuService } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';

@Component({
    selector: 'module-entry.component',
    templateUrl: './module-entry.component.html',
    styleUrls: [`./module-entry.component.less`]
})
export class ModuleEntryComponent implements OnInit, OnDestroy {
    public title;
    public permissions;
    public config: any = {
        rows: []
    };
    public initData;
    public isLoadLayout = false;

    public isCollapsed =  true;
    public userInfo: any;
    public triggerTemplate: TemplateRef<void> | null = null;
    public position: any;
    @ViewChild('trigger') public customTrigger: TemplateRef<void>;
  
    constructor(
        public settings: SettingsService,
        private cacheService: CacheService,
        private menuService: MenuService,
        private apiService: ApiService,
        private router: Router,
        private modal: NzModalService,
        private _http: ApiService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private _route: ActivatedRoute
    ) { }

    public ngOnInit() {
        this.userInfo = this.cacheService.getNone('userInfo');
        this._route.params.subscribe(params => {
            if(params.templateName) {
                this._http.getLocalData(params.templateName).subscribe(data => {
                    this.config = data;
                    (async() => {
                        const userId = this.userInfo['userId'];    
                        const permission = await this._getOperationPermission(params.name, userId, 'button');
                        if (permission.isSuccess) {
                            this.permissions = permission.data;
                            this._route.queryParams.subscribe(p => {
                                this.initData = p;
                                this.isLoadLayout = true;
                            });
                          
                        } else {
                            console.log('出现异常:未能获取权限信息');
                        }
                    })();
                });
                
            }
            if (params.pos) {
                this.position = params.pos;
            }
        });

    }

    public ngAfterViewInit () {
        this.userInfo = this.cacheService.getNone('userInfo');
    }

    /** custom trigger can be TemplateRef **/
    public changeTrigger(): void {
        // this.triggerTemplate = this.customTrigger;
    }

    public ngOnDestroy(): void {
        this.config = null;
    }

    public logout() {
        this.modal.confirm({
            nzTitle: '确认要关闭本系统吗？',
            nzContent: '关闭后将清空相关操作数据！',
            nzOnOk: () => {
                const pageList = this.cacheService.getMeta();
                pageList.forEach(item => {
                  this.cacheService.remove(item);
                });
                this.tokenService.clear();
                this.cacheService.clear();
                this.menuService.clear();
                // console.log(this.tokenService.login_url);
                // this.router.navigateByUrl(this.tokenService.login_url);
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                this.router.navigateByUrl('/passport/app').catch(() => {
                    this.apiService.post('login_out');
                });    
                // }).catch(() => console.log('Oops errors!'));
            }
        });
    }

    public async _getOperationPermission(moduleCode, roleId, type) {
        return this._http.get('common/GetButtonData', {type: type, moduleCode: moduleCode, roleId: roleId}).toPromise();
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
        const modal = this.modal.create({
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
                                this.router.navigateByUrl('/passport/app').catch(() => {
                                    this.apiService.post('login_out');
                                });
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

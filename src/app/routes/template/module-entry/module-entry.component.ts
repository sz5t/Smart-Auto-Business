import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService, MenuService } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

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
    public triggerTemplate: TemplateRef<void> | null = null;
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
        this._route.params.subscribe(params => {
            this._http.getLocalData(params.templateName).subscribe(data => {
                this.config = data;
                (async() => {
                    const userInfo = this.cacheService.getNone('userInfo');
                    const userId = userInfo['userId'];    
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
        });

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
                this.tokenService.clear();
                this.cacheService.clear();
                this.menuService.clear();
                // console.log(this.tokenService.login_url);
                // this.router.navigateByUrl(this.tokenService.login_url);
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                this.router.navigateByUrl('/passport/ts-login').catch(() => {
                    this.apiService.post('login_out');
                });    
                // }).catch(() => console.log('Oops errors!'));
            }
        });
    }

    public async _getOperationPermission(moduleCode, roleId, type) {
        return this._http.get('common/GetButtonData', {type: type, moduleCode: moduleCode, roleId: roleId}).toPromise();
    }

}

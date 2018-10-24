import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'cn-dynamic-template',
    templateUrl: './dynamic-template.component.html',
})
export class DynamicTemplateComponent implements OnInit, OnDestroy {
    title;
    permissions;
    config = {
        rows: []
    };
    constructor(
        private _http: ApiService,
        private _cacheService: CacheService,
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this._http.getLocalData(params.name).subscribe(data => {
                (async() => {
                    const userInfo = this._cacheService.get('userInfo');
                    const userId = userInfo['value']['userId'];
                    const permission = await this._getOperationPermission(params.name, userId, 'button');
                    if (permission.isSuccess) {
                        this.config = data;
                        this.permissions = permission.data;
                    } else {
                        console.log('出现异常:未能获取权限信息');
                    }
                })();
                
            });
        });

    }

    ngOnDestroy(): void {
        this.config = null;
    }

    async _getOperationPermission(moduleCode, roleId, type) {
        return this._http.get('common/GetButtonData', {type: type, moduleCode: moduleCode, roleId: roleId}).toPromise();
    }

}

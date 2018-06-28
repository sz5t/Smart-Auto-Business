import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CacheService} from '@delon/cache';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private router: Router) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.tokenService.get().token) {
              this.router.navigate( [this.tokenService.login_url]);
              return false;
          } else {
              const token: any = this.tokenService.get().token;
              // todo:token 只是用来判断是否匿名登录，需要完善：根据不同的token来进行具体模块的权限控制
              return true;
          }

    }
}

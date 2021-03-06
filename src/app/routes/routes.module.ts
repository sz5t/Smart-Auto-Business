import { ModuleEntryComponent } from './template/module-entry/module-entry.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { CustomerLoginComponent } from './passport/customer-login/customer-login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { AuthGuard } from '@core/utility/auth-guard';
import { BtnTableFieldLimit } from '@core/pipe/btn-table-field-limit.pipe';
import { EditPasswordComponent } from './passport/edit-password/edit-password.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CALoginComponent } from './passport/calogin/calogin.component';
import { HeaderNotifyComponent } from 'app/layout/default/header/components/notify.component';
import { LayoutModule } from 'app/layout/layout.module';

@NgModule({
    imports: [SharedModule, RouteRoutingModule, LayoutModule],
    declarations: [
        DashboardV1Component,
        DashboardAnalysisComponent,
        DashboardMonitorComponent,
        DashboardWorkplaceComponent,
        ModuleEntryComponent,
        // passport pages
        UserLoginComponent,
        UserRegisterComponent,
        UserRegisterResultComponent,
        CustomerLoginComponent,
        EditPasswordComponent,
        HomeComponent,
        // single pages
        UserLockComponent,
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        CALoginComponent,
        // HeaderNotifyComponent
    ],
    providers: [
        AuthGuard
    ]
})

export class RoutesModule { }

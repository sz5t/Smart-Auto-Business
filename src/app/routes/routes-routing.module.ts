import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { AuthGuard } from '@core/utility/auth-guard';
import { CustomerLoginComponent } from './passport/customer-login/customer-login.component';
import { ModuleEntryComponent } from './template/module-entry/module-entry.component';
import { TsLayoutDefaultComponent } from 'app/layout/ts-default/ts-default.component';
import { EditPasswordComponent } from './passport/edit-password/edit-password.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CALoginComponent } from './passport/calogin/calogin.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: environment.homePageName, pathMatch: 'full', canActivate: [AuthGuard] },
            // { path: 'dashboard', redirectTo: environment.homePageName, pathMatch: 'full', canActivate: [AuthGuard] },
           // { path: environment.homePageName, component: environment.homePageName === 'app/entry' ? DashboardV1Component : HomeComponent, data: { title: '综合信息页'}, canActivate: [AuthGuard] },
            // { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full', canActivate: [AuthGuard] },
            // { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'dashboard/home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: 'dashboard/v1', component: DashboardV1Component, canActivate: [AuthGuard] },
            // { path: 'dashboard/analysis', component: DashboardAnalysisComponent, data: { title: '工作台'}, canActivate: [AuthGuard]  },
            // { path: 'dashboard/monitor', component: DashboardMonitorComponent, canActivate: [AuthGuard] },
            // { path: 'dashboard/workplace', component: DashboardWorkplaceComponent, data: { title: '工作台'}, canActivate: [AuthGuard] },
            // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' },
            // { path: 'style', loadChildren: './style/style.module#StyleModule' },
            // { path: 'delon', loadChildren: './delon/delon.module#DelonModule' },
            // { path: 'extras', loadChildren: './extras/extras.module#ExtrasModule' },
            // { path: 'pro', loadChildren: './pro/pro.module#ProModule' },
            { path: 'system', loadChildren: './system/system.module#SystemModule'},
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
            // { path: 'test', loadChildren: './cn-test/cn-test.module#CnTestModule'},
            {
                path: 'entry', component: ModuleEntryComponent , data: { title: '工作中心'}, canActivate: [AuthGuard]
            },
            { path: 'template', loadChildren: './template/template.module#TemplateModule', canActivate: [AuthGuard]}
        ]
    },
    {
        path: 'app',
        component: TsLayoutDefaultComponent,
        children: [
            {
                path: '', redirectTo: 'workplace', pathMatch: 'full', canActivate: [AuthGuard]
            },
            // {
            //     path: 'workplace', component: TsWorkPlaceComponent , data: { title: '工作台'}
            // },
            {
                path: 'entry', component: ModuleEntryComponent , data: { title: '工作台'}, canActivate: [AuthGuard]
            },
            {
                path: 'template', loadChildren: './template/template.module#TemplateModule'
            }
        ]
    },
    // 全屏布局
    // {
    //     path: 'data-v',
    //     component: LayoutFullScreenComponent,
    //     children: [
    //         { path: '', loadChildren: './data-v/data-v.module#DataVModule' }
    //     ]
    // },
    // passport
    {
        path: 'passport',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: CustomerLoginComponent, data: {path: environment.homePageName}},
            { path: 'admin', component: UserLoginComponent},
            { path: 'app', component: CustomerLoginComponent, data: {path: '/app/entry'}},
            // { path: 'register', component: UserRegisterComponent },
            // { path: 'register-result', component: UserRegisterResultComponent },
            { path: 'calogin', component: CALoginComponent},
            { path: 'edit-password', component: EditPasswordComponent}
        ],
        data: {title: '西安航天动力测控技术研究所', sub: '质量数据包管理系统'} 
    },
    // passport2
    {
        path: 'passport2',
        component: LayoutPassportComponent,
        children: [
            { path: 'login', component: UserLoginComponent},
        ],
        data: {title: '西安航天动力测控技术研究所', sub: '检验数据采集系统'} 
    },
    // 单页不包裹Layout
    { path: 'callback/:type', component: CallbackComponent },
    { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
  })
export class RouteRoutingModule { }

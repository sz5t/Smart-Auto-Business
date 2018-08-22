// import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {SingleTableComponent} from './single-table/single-table.component';
import {MulitTableComponent} from './mulit-table/mulit-table.component';
import {TreeTableComponent} from './tree-table/tree-table.component';
import {TreeAndTableComponent} from './tree-and-table/tree-and-table.component';
import {TreeAndTabsComponent} from './tree-and-tabs/tree-and-tabs.component';
import {RouterModule, Routes} from '@angular/router';
import {TreeAndMultiTableComponent} from './tree-and-multi-table/tree-and-multi-table.component';
import {TreeAndFormComponent} from './tree-and-form/tree-and-form.component';
import {DynamicTemplateComponent} from './dynamic-template/dynamic-template.component';
import {TableChartComponent} from './table-chart/table-chart.component';
import {AuthGuard} from '@core/utility/auth-guard';
import {CnAppDocumentComponent} from './app-document/app-document.component';
import {CnApiDocumentComponent} from './api-document/api-document.component';
import {TreeAndSubTableComponent} from "./tree-and-sub-table/tree-and-sub-table.component";

const routes: Routes = [
    {path: 'singleTable', component: SingleTableComponent, canActivate: [AuthGuard]},
    {path: 'mulitTable', component: MulitTableComponent, canActivate: [AuthGuard]},
    {path: 'treeTable', component: TreeTableComponent, canActivate: [AuthGuard]},
    {path: 'treeAndTable', component: TreeAndTableComponent},
    {path: 'treeAndMulitTable', component: TreeAndMultiTableComponent, canActivate: [AuthGuard]},
    {path: 'treeAndTabs', component: TreeAndTabsComponent, canActivate: [AuthGuard]},
    {path: 'treeAndForm', component: TreeAndFormComponent, canActivate: [AuthGuard]},
    {path: 'tableChart', component: TableChartComponent, canActivate: [AuthGuard]},
    {path: 'APPConfigIntro', component: CnAppDocumentComponent, canActivate: [AuthGuard]},
    {path: 'APIIntro', component: CnApiDocumentComponent, canActivate: [AuthGuard]},
    {path: 'treeAndSubTable', component: TreeAndSubTableComponent, canActivate: [AuthGuard]},
    {path: 'dynamicTemplate/:name', component: DynamicTemplateComponent, canActivate: [AuthGuard]}
];

const COMPONENT_NOROUNT = [
    SingleTableComponent,
    MulitTableComponent,
    TreeTableComponent,
    TreeAndTableComponent,
    TreeAndTabsComponent,
    TreeAndMultiTableComponent,
    TreeAndFormComponent,
    DynamicTemplateComponent,
    // CnCodeEditComponent,
    CnAppDocumentComponent,
    CnApiDocumentComponent,
    TreeAndSubTableComponent

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        COMPONENT_NOROUNT
    ],
    entryComponents: COMPONENT_NOROUNT
})
export class TemplateModule {
}

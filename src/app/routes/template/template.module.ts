import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SingleTableComponent } from './single-table/single-table.component';
import { MulitTableComponent } from './mulit-table/mulit-table.component';
import { TreeTableComponent } from './tree-table/tree-table.component';
import { TreeAndTableComponent } from './tree-and-table/tree-and-table.component';
import { TreeAndTabsComponent } from './tree-and-tabs/tree-and-tabs.component';
import { RouterModule, Routes } from '@angular/router';
import { TreeAndMultiTableComponent } from './tree-and-multi-table/tree-and-multi-table.component';
import { TreeAndFormComponent } from './tree-and-form/tree-and-form.component';
import { DynamicTemplateComponent } from './dynamic-template/dynamic-template.component';
import { TableChartComponent } from './table-chart/table-chart.component';

const routes: Routes = [
  { path: 'singleTable', component: SingleTableComponent },
  { path: 'mulitTable', component: MulitTableComponent },
  { path: 'treeTable', component: TreeTableComponent },
  { path: 'treeAndTable', component: TreeAndTableComponent },
  { path: 'treeAndMulitTable', component: TreeAndMultiTableComponent },
  { path: 'treeAndTabs', component: TreeAndTabsComponent },
  { path: 'treeAndForm', component: TreeAndFormComponent },
  { path: 'tableChart', component: TableChartComponent},
  { path: 'dynamicTemplate/:name', component: DynamicTemplateComponent}
];

const COMPONENT_NOROUNT = [
  SingleTableComponent,
  MulitTableComponent,
  TreeTableComponent,
  TreeAndTableComponent,
  TreeAndTabsComponent,
  TreeAndMultiTableComponent,
  TreeAndFormComponent,
  DynamicTemplateComponent
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
export class TemplateModule { }

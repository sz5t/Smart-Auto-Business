import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { BlockSettingComponent } from './block-setting/block-setting.component';
import { ComponentSettingComponent } from './component-setting/component-setting.component';
import { OperationSettingComponent } from './operation-setting/operation-setting.component';
import { LayoutSettingComponent } from './layout-setting/layout-setting.component';
import { BusinessSettingComponent } from './business-setting/business-setting.component';
import { SqlSettingComponent } from './sql-setting/sql-setting.component';
import { LayoutStepSettingComponent } from './layout-step-setting/layout-step-setting.component';
const routes: Routes = [
  { path: 'layout-setting', component: LayoutSettingComponent },
  { path: 'block-setting', component: BlockSettingComponent },
  { path: 'sql-setting', component: SqlSettingComponent },
  { path: 'component-setting', component: ComponentSettingComponent },
  { path: 'operation-setting', component: OperationSettingComponent },
  { path: 'business-setting', component: BusinessSettingComponent },
  { path: 'layout-step-setting', component: LayoutStepSettingComponent },
];
const COMPONENT_NOROUNT = [
  LayoutSettingComponent,
  BlockSettingComponent,
  ComponentSettingComponent,
  OperationSettingComponent,
  SqlSettingComponent,
  BusinessSettingComponent
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    LayoutStepSettingComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class SettingsModule { }

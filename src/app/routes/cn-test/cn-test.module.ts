import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './list/list.component';
import { CnTestRoutingModule } from './cn-test-routing.module';
import { GanttComponent } from './gantt/gantt.component';
import { PertComponent } from './pert/pert.component';
const COMPONENT_NOROUNT = [
  ListComponent,
  GanttComponent,
  PertComponent
];

@NgModule({
  imports: [
    SharedModule,
    CnTestRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class CnTestModule { }

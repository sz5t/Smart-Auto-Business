import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ListComponent } from './list/list.component';
import { CnTestRoutingModule } from "./cn-test-routing.module";
const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    CnTestRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ListComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class CnTestModule { }

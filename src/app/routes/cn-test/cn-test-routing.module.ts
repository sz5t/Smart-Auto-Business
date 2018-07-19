import { PertComponent } from './pert/pert.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { GanttComponent } from './gantt/gantt.component';
const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: 'gantt', component: GanttComponent },
    { path: 'pert', component: PertComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CnTestRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "@shared/shared.module";

import { PrivManagerComponent } from "./priv-manager/priv-manager.component";
import { ModuleOperationComponent } from "./module-manager/module-operation.component";
import { UserOperationComponent } from "./user-manager/user-operation.component";
import { OrgOperationComponent } from "./org-manager/org-operation.component";
import { UserRoleComponent } from "./user-manager/user-role.component";
import { ModuleManagersComponent } from "./module-manager/module-managers.component";
import { DataModelingComponent } from "./data-modeling/data-modeling.component";
import { WorkFlowComponent } from "./work-flow/work-flow.component";
import { WorkFlowTodoComponent } from "./work-flow/work-flow-todo.component";
import { WorkFlowInitiateComponent } from "./work-flow/work-flow-initiate.component";
import { WorkFlowDictionaryComponent } from "./work-flow/work-flow-dictionary.component";
import { WorkFlowDesignComponent } from "./work-flow/work-flow-design.component";

const routes: Routes = [
    { path: "module-managers", component: ModuleManagersComponent },
    { path: "priv-manager", component: PrivManagerComponent },
    { path: "dataModeling-manager", component: DataModelingComponent },
    { path: "WorkFlow-manager", component: WorkFlowComponent },
    { path: "WorkFlow-todo-manager", component: WorkFlowTodoComponent },
    { path: "WorkFlow-initiate-manager", component: WorkFlowInitiateComponent },
    {
        path: "WorkFlow-dictionary-manager",
        component: WorkFlowDictionaryComponent
    },
    { path: "WorkFlow-design-manager", component: WorkFlowDesignComponent }
];
const COMPONENT_NOROUNT = [
    ModuleManagersComponent,
    PrivManagerComponent,
    ModuleOperationComponent,
    UserOperationComponent,
    OrgOperationComponent,
    UserRoleComponent,
    DataModelingComponent,
    WorkFlowComponent,
    WorkFlowTodoComponent,
    WorkFlowInitiateComponent,
    WorkFlowDictionaryComponent,
    WorkFlowDesignComponent
];

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes)],
    declarations: [...COMPONENT_NOROUNT],
    entryComponents: COMPONENT_NOROUNT
})
export class SystemModule {}

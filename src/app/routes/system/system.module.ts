import {NgModule} from '@angular/core';
import {UserManagerComponent} from './user-manager/user-manager.component';
import {RoleManagerComponent} from './role-manager/role-manager.component';
import {ModuleManagerComponent} from './module-manager/module-manager.component';
import {BaseManagerComponent} from './base-manager/base-manager.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {ModalBaseComponent} from './base-manager/modal-base.component';
import { OrgManagerComponent } from './org-manager/org-manager.component';
import { PrivManagerComponent } from './priv-manager/priv-manager.component';
import { DataManagerComponent } from './data-manager/data-manager.component';
import {ModuleOperationComponent} from './module-manager/module-operation.component';
import { TypeOperationComponent } from './data-manager/type-operation.component';
import {EntityOperationComponent} from './data-manager/entity-operation.component';
import { UserOperationComponent } from './user-manager/user-operation.component';
import { RoleOperationComponent } from './role-manager/role-operation.component';
import { OrgOperationComponent } from './org-manager/org-operation.component';
import { UserRoleComponent } from './user-manager/user-role.component';
import { ModuleManagersComponent } from './module-manager/module-managers.component';
import {DataModelingComponent} from './data-modeling/data-modeling.component';
import { AuthGuard } from '@core/utility/auth-guard';

const routes: Routes = [
    {path: 'base-manager', component: BaseManagerComponent, canActivate: [AuthGuard]},
    {path: 'module-managers', component: ModuleManagersComponent, canActivate: [AuthGuard]},
    {path: 'role-manager', component: RoleManagerComponent, canActivate: [AuthGuard]},
    {path: 'user-manager', component: UserManagerComponent, canActivate: [AuthGuard]},
    {path: 'org-manager', component: OrgManagerComponent, canActivate: [AuthGuard]},
    {path: 'data-manager', component: DataManagerComponent, canActivate: [AuthGuard]},
    {path: 'priv-manager', component: PrivManagerComponent, canActivate: [AuthGuard]},
    {path: 'dataModeling-manager', component: DataModelingComponent, canActivate: [AuthGuard]},
];
const COMPONENT_NOROUNT = [
    UserManagerComponent,
    RoleManagerComponent,
    ModuleManagersComponent,
    BaseManagerComponent,
    ModalBaseComponent,
    OrgManagerComponent,
    PrivManagerComponent,
    DataManagerComponent,
    ModuleOperationComponent,
    TypeOperationComponent,
    EntityOperationComponent,
    UserOperationComponent,
    RoleOperationComponent,
    OrgOperationComponent,
    UserRoleComponent,
    DataModelingComponent
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [...COMPONENT_NOROUNT ],
    entryComponents: COMPONENT_NOROUNT
})
export class SystemModule {
}

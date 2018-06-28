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


const routes: Routes = [
    {path: 'base-manager', component: BaseManagerComponent},
    {path: 'module-managers', component: ModuleManagersComponent},
    {path: 'role-manager', component: RoleManagerComponent},
    {path: 'user-manager', component: UserManagerComponent},
    {path: 'org-manager', component: OrgManagerComponent},
    {path: 'data-manager', component: DataManagerComponent},
    {path: 'priv-manager', component: PrivManagerComponent},
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

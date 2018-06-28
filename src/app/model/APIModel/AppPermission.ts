export enum PermissionValue{
    NotSet,     // 未设置，可设定系统策略来确定默认值
    Invisible,  // 不可见
    Disabled,   // 不可用
    Permitted   // 可用、可见
}

export class OpPermission{
    Name: string = null;
    Permission: PermissionValue;
    PermissionExpText: string = null;

    constructor(name: string, permission: PermissionValue){
        this.Name = name;
        this.Permission = permission;
    }
}

export class ObjectPermission {
    Id: string = null;
    Name: string = null;
    constructor(id: string, name: string){
        this.Id = id;
        this.Name = name;
    }
    OpPermissions: OpPermission[] = [];
}

export class ResourceTypePermission extends ObjectPermission{
    DeleteFilter: string  = null;
    QueryFilter: string  = null;
    UpdateFilter: string  = null;
    PropPermissions: ObjectPermission[] = [];
    RowPermissions: ObjectPermission[] = [];
}

/// <summary>
/// 数据资源访问许可
/// </summary>
export class DataResPermission  extends ObjectPermission{
    OpPermissions: OpPermission[] = [];
    ResourceTypePermissions: ResourceTypePermission[] = [];
}

/// <summary>
/// 一般功能性资源访问许可。可用于前端粗粒度的模块访问许可设置，
/// </summary>
export class FuncResPermission extends ObjectPermission{
    constructor(id?: string, name?: string) {
        super(id, name);
    }
    SubFuncResPermissions: FuncResPermission[] = [];
}

/// <summary>
/// 应用访问许可集，用来描述一个应用系统的部分或全部访问许可，在权限管理系统中，此对象作为角色的一个属性。
/// </summary>
export class AppPermission {
    DataResPermission: DataResPermission = null;
    FuncResPermission: FuncResPermission = null;
}

import {Component, Input, OnInit, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzFormatEmitEvent, NzModalRef, NzTreeNode} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';
import {AppPermission, FuncResPermission, OpPermission, PermissionValue} from '../../../model/APIModel/AppPermission';
import {ApiService} from '@core/utility/api-service';
// import {APIResource} from '@core/utility/api-resource';
import {Observable, of} from 'rxjs';

export class Data {
    Name: string;
    Remark: string;
    ShareScope: string;
    AppPermission: AppPermission;
    constructor(){
        this.AppPermission = new AppPermission();
    }
}

@Component({
    selector: 'app-role-operation',
    templateUrl: './role-operation.component.html',
})
export class RoleOperationComponent implements OnInit, AfterViewChecked {
    constructor(
        private cacheService: CacheService,
        private fb: FormBuilder,
        private modal: NzModalRef,
        private http: ApiService,
        public cdRef: ChangeDetectorRef
    ) {    }

    roleOperForm: FormGroup;
    _data: Data;
    _parentId: string;
    values: any[] ;
    moduleObj: any[];
    nodes: NzTreeNode[] ;

    ngAfterViewChecked() {
        // this.cdRef.detectChanges();
    }
    @Input()
    set data(value: any) {
        this._data = value;
    }
    ngOnInit() {
        this.nodes = [];
        this.roleOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            AppPermission : [null],
            Remark     : [null],
            ShareScope     : [ 'Project'],
            Operations : [null]
        });

        if (this._data) {
            this.roleOperForm.controls['Name'].setValue(this._data.Name);
            const appper = this._data.AppPermission;
            this.SettingPermission(appper.FuncResPermission.SubFuncResPermissions[0].SubFuncResPermissions); // (JSON.parse(appper))['FuncResPermission'].SubFuncResPermissions[0].SubFuncResPermissions
            this.roleOperForm.controls['Remark'].setValue(this._data.Remark);
            this.roleOperForm.controls['ShareScope'].setValue(this._data.ShareScope);
        }
        let modulestr = JSON.stringify(this.cacheService.getNone('Menus'));
        const id = /id/g;
        const text = /text/g;
        modulestr = modulestr.replace(id, 'key');
        modulestr = modulestr.replace(text, 'title');
        this.moduleObj = JSON.parse(modulestr);

        this.moduleObj.forEach(item => {
            const treeNode = new NzTreeNode(item);
            // todo:后期考虑对禁用的模块进行展示处理
            // treeNode.isDisableCheckbox = true;
            this.nodes.push( treeNode);
        });
        // console.log(this.nodes);
    }

    emitDataOutside() {
        if (!this.roleOperForm.valid)
            return;
        if (!this._data)
            this._data = new Data();
        this._data.Name =   this.roleOperForm.controls['Name'].value;
        this._data.AppPermission = this.testApp();
        this._data.Remark =  this.roleOperForm.controls['Remark'].value;
        this._data.ShareScope = this.roleOperForm.controls['ShareScope'].value;
        this.modal.destroy(this._data);
    }
    //
    // testAppObse(): Observable<any> {
    //     return of(this.testApp());
    // }
     testApp() {
        const appPermission: AppPermission = new AppPermission();
        const funcResPermissionroot: FuncResPermission = new FuncResPermission();
        const funcResPermissionwqd: FuncResPermission = new FuncResPermission('SinoForceWeb前端', 'SinoForceWeb前端');
        this.AddPermission(funcResPermissionwqd, this.nodes);
        funcResPermissionroot.SubFuncResPermissions.push(funcResPermissionwqd);
        appPermission.FuncResPermission = funcResPermissionroot;
        return appPermission;
    }

    AddPermission(funcResPermissionwqd: FuncResPermission, moduleTree: any) {
        moduleTree.forEach(item => {
            const funcResPermissionsub = new FuncResPermission(item.key, item.title);
            const OpPerm = new OpPermission('Open', item.isChecked || item.isHalfChecked ? PermissionValue.Permitted : PermissionValue.Invisible);
            if ((item.title === '角色管理' || item.title === '组织机构' || item.title === '用户管理') && item.origin.OpOperaion) {
                const opPera = JSON.stringify(item.origin.OpOperaion);
                if (opPera.length > 10) {
                    const AllOperation: FuncResPermission[] = JSON.parse(opPera) as FuncResPermission[];
                    funcResPermissionsub.SubFuncResPermissions = AllOperation;
                }
            }
            this.AddOperation(funcResPermissionsub, OpPerm);
            funcResPermissionwqd.SubFuncResPermissions.push(funcResPermissionsub);
            if (!item.isLeaf) {
                this.AddPermission(funcResPermissionsub, item.children);
            }
        });
    }

    SettingPermission(funcResPermissionwqd: any) {// FuncResPermission
        funcResPermissionwqd.forEach(item => {
            item.SubFuncResPermissions.forEach(items => {
                if (items.Name === '主表' && item.OpPermissions) {
                    item.OpPermissions.forEach(ite => {
                        if (ite.Name === 'Open' && ite.Permission === 'Permitted') {
                            this.checkedKeys.push(item.Id);
                        }
                    });
                }
            });
            if (item.OpPermissions) {
                item.OpPermissions.forEach(ite => {
                    if (ite.Name === 'Open' && ite.Permission === 'Permitted' && (item.SubFuncResPermissions.length == 0)) {
                        this.checkedKeys.push(item.Id);
                    }
                });
            }
            if (item.SubFuncResPermissions.length > 0) {
                this.SettingPermission(item.SubFuncResPermissions);
            }
        });
    }

    AddOperation(funcResPermissionsub: FuncResPermission, operations: any) {
        funcResPermissionsub.OpPermissions.push(operations);
    }

    handleCancel(e) {
        this.modal.destroy();
    }

    _submitForm() {
        for (const i in this.roleOperForm.controls) {
            this.roleOperForm.controls[ i ].markAsDirty();
        }
    }

    getFormControl(name) {
        return this.roleOperForm.controls[ name ];
    }

    // ----------------------------------------------------
    checkedKeys = [];
    expandDefault = false;

    checkOptionsOne: NzTreeNode[] = null;

    roleOptions = [ new NzTreeNode({
        title: '主表',
        key: '主表',
        children: [
            {
                title: '新增R',
                key: '新增R',
                children : []
            },
            {
                title: '修改R',
                key: '修改R',
                children : []
            },
            {
                title: '删除R',
                key: '删除R',
                children : []
            },
        ]
    })];
    orgOptions = [ new NzTreeNode({
        title: '主表',
        key: '主表',
        children: [
            {
                title: '新增O',
                key: '新增O',
                children : []
            },
            {
                title: '修改O',
                key: '修改O',
                children : []
            },
            {
                title: '删除O',
                key: '删除O',
                children : []
            },
        ]
    })];
    userOptions = [ new NzTreeNode({
        title: '主表',
        key: '主表',
        children: [
            {
                title: '新增',
                key: '新增',
                children : []
            },
            {
                title: '修改',
                key: '修改',
                children : []
            },
            {
                title: '删除',
                key: '删除',
                children : []
            },
            {
                title: '角色设置',
                key: '角色设置',
                children : []
            },
        ]
    }),
        new NzTreeNode({
            title: '子表',
            key: '子表',
            children: [
                {
                    title: '新增1',
                    key: '新增1',
                    children : []
                },
                {
                    title: '修改1',
                    key: '修改1',
                    children : []
                },
                {
                    title: '删除1',
                    key: '删除1',
                    children : []
                },
            ]
        })];


    module = null;
    // checkNode = [];
    mouseAction(name: string, event: NzFormatEmitEvent): void {
        // this.checkNode = [];
        this.checkedoperKeys = [];
        if (event.node.isLeaf) {
            this.checkOptionsOne = [];
            this.module = event.node.origin;
            // console.log(this.module)
            this.获取数据源(event.node);
            const funcResper: FuncResPermission[] = [];
            if (this._data) {
                this.searchAppper(funcResper, this.module.key, this._data.AppPermission['FuncResPermission'].SubFuncResPermissions[0].SubFuncResPermissions);
                // console.log(111,funcResper[0])
                this.mergeOper(this.checkOptionsOne, funcResper[0]);
            }
            // 1.先获取受限资源
            // 2.获取角色下模块对应的操作权限，并做匹配
            // 3.组织数据结构

            // this.http.get(APIResource.AppPermission + '/Func.'+this.parPath + '.' + event.node.title,{'_withAncestor':false}).subscribe(
            //     response => {
            //         if(response.Data.SubFuncResPermissions.length >0) {
            //             var getOpOperation=[];
            //             console.log(456, response.Data.SubFuncResPermissions[0]);
            //             response.Data.SubFuncResPermissions[0].OpPermissions.forEach( item => {
            //                 getOpOperation.push({label: item.Name,  value: item.Name, checked: (item.Permission === 'Invisible') ? false: true})
            //             })
            //             this.checkOptionsOne = getOpOperation;
            //         }
            //         else {
            //             console.log(111, event)
            //             this.获取数据源(event.node);
            //         }
            //         console.log(222,this.checkOptionsOne);
            //     }
            // );
        }
    }

    mouseAction1(name: string, event: NzFormatEmitEvent): void {
        const funcResPermissionsub1: FuncResPermission[] = [];
        this.checkOptionsOne.forEach( item => {
            let OpOperations: OpPermission[];
            item.children.filter( fil => {
                if ( fil.isChecked) {
                    OpOperations = [];
                }
                });
            if (OpOperations) {
                const itemFRP = new FuncResPermission(item.key, item.key);
                item.children.forEach(ite => {
                    if (ite.isChecked) {
                        OpOperations.push(new OpPermission(ite.key, PermissionValue.Permitted));
                    }
                });
                itemFRP.OpPermissions = OpOperations;
                funcResPermissionsub1.push(itemFRP);
            }
        });
        this.module['OpOperaion'] = funcResPermissionsub1;
    }
    checkedoperKeys = [];
    mergeOper(oper, apper) {
        apper.forEach( item => {
            item.OpPermissions.forEach(ite => {
                if (ite.Permission === 'Permitted')
                    this.checkedoperKeys.push(ite.Name);
            });
        });
    }

    getApper(key, apper, oper) {
        apper.forEach( ite => {
            if (key === ite.Id) {
                oper.push(ite.OpPermissions);
            }
        });
    }

    searchAppper(array, moduleId, data)  {
        if (data && data.length > 0) {
            data.forEach( item => {
                if (item.Id === moduleId) {
                    array.push(item.SubFuncResPermissions);
                } else {
                    this.searchAppper(array, moduleId, item.SubFuncResPermissions);
                }});
        }
    }

    获取数据源(node) {
        switch (node.key) {
            case '2cc0a2cf7fc4704282f3523de9fe6890': // 用户管理
                if (!this.module.OpOperaion) {
                    // console.log('USER');
                    this.checkOptionsOne = this.userOptions;
                } else {
                    // console.log('userOptions');
                    this.userOptions = [];
                    // this.getOpration(this.module);
                }
                break;
            case 'b5daad20393e284fa9ab37c5d653dcd4': // 角色管理
                if (!this.module.OpOperaion) {
                    // console.log('ROLE');
                    this.checkOptionsOne = this.roleOptions;
                } else {
                    // console.log('roleOptions');
                    this.roleOptions = [];
                    // this.getOpration(this.module);
                }
                break;
            case 'e48c4d69f0484bd39cc9855da9df25ee': // 组织机构
                if (!this.module.OpOperaion) {
                    // console.log('ORG');
                    this.checkOptionsOne = this.orgOptions;
                } else {
                    // console.log('orgOptions');
                    this.orgOptions = [];
                    // this.getOpration(this.module);
                }
                break;
            default:
                this.checkOptionsOne = [];
        }
    }

    // onChange(event){
    //     var OpOperation: OpPermission[] = [];
    //     console.log(event);
    //     // new OpPermission('Open', item.isChecked || item.isHalfChecked ? PermissionValue.Permitted : PermissionValue.Invisible);
    //     this.checkOptionsOne.forEach(item => {
    //         if(event.indexOf(item.value) >-1 ){
    //             console.log('可用',item.value);
    //             OpOperation.push(new OpPermission(item.label, PermissionValue.Permitted));}
    //         else {
    //             console.log('不可用',item.value);
    //             OpOperation.push(new OpPermission(item.label, PermissionValue.Invisible));}
    //     })
    //     console.log('操作列表',OpOperation,this.module);
    //
    //     this.module['OpOperaion'] = OpOperation;
    //     console.log('模块',this.module);
    //     console.log('模块列表',this.nodes);
    // }

    modelChange(event) {
        if (this.module.length > 0) {
            const OpOperations: OpPermission[] = [];
            event.forEach(item => {
                if (item.checked) {
                    OpOperations.push(new OpPermission(item.label, PermissionValue.Permitted));
                } else {
                    OpOperations.push(new OpPermission(item.label, PermissionValue.Invisible));
                }
            });
            // console.log('操作列表', OpOperations, this.module);
            this.module['OpOperaion'] = OpOperations;
            // console.log('模块', this.module);
            // console.log('模块列表', this.nodes);
        }
    }

    parPath = '';
    expand(event) {
        console.log(event);
        const ExpandNodeList = 'SinoForceWeb前端.';
        const paths: string[] = [];
        this.joinParent(paths, event.node);
        this.parPath = ExpandNodeList + paths.join('.');
    }

    expand1(event) {

    }

    joinParent(path: string[], node?) {
        if (path.indexOf(node.title) === -1) {
            path.unshift(node.title);
            console.log(path);
        }
        if (node.level > 0)
            this.joinParent(path, node.parentNode);
    }
}



import {Component, Injectable, OnInit} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TypeOperationComponent} from './type-operation.component';
import {EntityOperationComponent} from './entity-operation.component';



@Injectable()
export class ResourceTypeService {
    ResourceTypeUrl = APIResource.Resource_Type;

    getResourceType(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
        return this.http.getProj(`${this.ResourceTypeUrl}`, {
            _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
            });
    }

    deleteType(name?) {
        const ids = name.join(',');
        if ( ids.length > 0 ) {
            return this.http.deleteProj(this.ResourceTypeUrl, { _ids: ids});
        }
    }

    addType(data?) {
        data['ProjId'] = APIResource.AppProjId;
        data['DrmId']  = APIResource.AppDrmId;
        data['OwnerAssembly']  = APIResource.AppOwnerAssembly;
        data['OwnerNameSpace']  = APIResource.AppOwnerAssembly;
        data['ShareScope']  = 'Project';
        return this.http.postProj(this.ResourceTypeUrl, data);
    }

    updateType(data?) {
        return this.http.putProj( this.ResourceTypeUrl, data);
    }

    constructor(private http: ApiService) {

    }
}


@Injectable()
export class EntityProDefService {
    EntityProDefUrl = APIResource.EntityPropertyDefine;

    getResourceType(pageIndex = 1, pageSize = 2, sortField, sortOrder, parentId) {
        return this.http.getProj(`${this.EntityProDefUrl}`, {
            OwnerId: parentId, _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}` });
    }

    deleteEntity(name?) {
        const ids = name.join(',');
        if ( ids.length > 0 ) {
            return this.http.deleteProj(this.EntityProDefUrl, {_ids: ids});
        }
    }

    addEntity(data?) {
        data['Mapped'] = true;
        data['ProjId'] = APIResource.AppProjId;
        return this.http.postProj(this.EntityProDefUrl, data);
    }

    updateEntity(data?) {
        return this.http.putProj( this.EntityProDefUrl, data);
    }
    constructor(private http: ApiService) {
    }
}

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
    providers: [ResourceTypeService, EntityProDefService],
  styles: [
        `
    .table-operations {
      margin-bottom: 16px;
    }
    
    .table-operations > button {
      margin-right: 8px;
    }
    .selectedRow{
        color:blue;
    }
      `
    ]
})
export class DataManagerComponent implements OnInit {
    // region
    _tallChecked = false;
    _tindeterminate = false;
    _tcurrent = 1;
    _tpageSize = 10;
    _ttotal = 1;
    _tdataSet = [];
    _tloading = true;
    _tsortValue = 'asc';
    _tsortField = 'CreateTime';
    _tcacheMapData;
    _tparentid = 'XXX';
// endregion

    // region
    _eallChecked = false;
    _eindeterminate = false;
    _ecurrent = 1;
    _epageSize = 10;
    _etotal = 1;
    _edataSet = [];
    _eloading = false;
    _esortValue = 'asc';
    _esortField = 'CreateTime';
    _ecacheMapData;
    _eeditCache = {};

    shared;
    // endregion

// region  基本操作
    _tcheckAll() {
        this._tdataSet.forEach(item => item.checked = this._tallChecked);
        this._tcacheMapData.forEach( mpa => { mpa.checked = this._tallChecked; });
    }

    tselectRow(data?) {
        this._tdataSet.forEach( item => {
            item.selected = false;
        });
        this._tparentid = data.Id;
        this.refreshEntityProDef(data.Id);
        data.selected = true;
        this._tcacheMapData.get(data.Id).checked = data.checked;
    }

    _echeckAll() {
        this._edataSet.forEach(item => item.checked = this._eallChecked);
        this._ecacheMapData.forEach( mpa => {mpa.checked = this._eallChecked; });
    }

    eselectRow(data?) {
        this._edataSet.forEach( item => {
            item.selected = false;
        });
        data.selected = true;
        this._ecacheMapData.get(data.Id).checked = data.checked;
    }

    constructor(private resourceType: ResourceTypeService,
                public msgSrv: NzMessageService,
                private modalService: NzModalService,
                private entityProDef: EntityProDefService ) {
        this.shared = new Map();
        this.shared.set('Customer', '当前客户');
        this.shared.set('Project', '项目的授权客户');
        this.shared.set('All', '所有客户');

    }

    ngOnInit() {
        this.refreshResourceType();
    }


    sortType(sort) {
        this._tsortValue = (sort.value === 'descend') ? 'DESC' : 'ASC';
        this._tsortField = sort.key;
        this.refreshResourceType();
    }

    sortEntity(sort) {
        this._esortValue = (sort.value === 'descend') ? 'DESC' : 'ASC';
        this._esortField = sort.key;
        this.refreshEntityProDef();
    }

    refreshResourceType(reset = false) {
        if ( reset ) {
            this._tcurrent = 1;
        }
        this._tcacheMapData = new Map();
        this._tallChecked = false;
        this._tloading = true;
        this.resourceType.getResourceType(this._tcurrent, this._tpageSize, this._tsortField, this._tsortValue).subscribe( (response) => {
            this._tloading = false;
            this._ttotal = response.Data.Total;
            this._tdataSet = response.Data.Rows;
            this._tdataSet.forEach(item => {
                this._tcacheMapData.set(item.Id, {checked: false, dataItem: item});
            });
        } );
    }

    refreshEntityProDef(parentId?: string, reset?) {
        if ( reset ) {
            this._ecurrent = 1;
        }
        this._ecacheMapData = new Map();
        this._eallChecked = false;
        this._eloading = true;
        this.entityProDef.getResourceType(this._ecurrent, this._epageSize, this._esortField, this._esortValue, parentId).subscribe( (response) => {
            this._eloading = false;
            this._etotal = response.Data.Total;
            this._edataSet = response.Data.Rows;
            this._edataSet.forEach(item => {
                this._ecacheMapData.set(item.Id, {checked: false, dataItem: item});
            });
        } );
    }

    trefresh() {
        this.refreshResourceType();
        this._tparentid = 'XXX';
        this.erefresh();
    }

    erefresh() {
        this.refreshEntityProDef(this._tparentid);
    }

    tdelete(event?) {
        const name = this.gettSelectId();
        if (name.length >= 1) {
            this.resourceType.deleteType(name).subscribe(response => {
                if (response.Status === 200) {
                    this.msgSrv.success(response.Message);
                    name.forEach( na => {
                        this._tcacheMapData.delete(na);
                    });
                    this.refreshResourceType();
                } else {
                    this.msgSrv.error(response.Message);
                }
            });
        } else {
            this.msgSrv.success('请选中要删除的数据！');
        }
    }

    getText(flag) {
        return flag ? '是' : '否';
    }

    edelete() {
        const name = this.geteSelectId();
        if (name.length >= 1) {
            this.entityProDef.deleteEntity(name).subscribe(response => {
                if (response.Status === 200) {
                    this.msgSrv.success(response.Message);
                    name.forEach( na => {
                        this._tcacheMapData.delete(na);
                    });
                    this.erefresh();
                } else {
                    this.msgSrv.error(response.Message);
                }
            });
        } else {
            this.msgSrv.success('请选中要删除的数据！');
        }
    }

    gettSelectId() {
        const name = [] ;
        this._tcacheMapData.forEach(item => {
            if (item.checked) {
                name.push(item.dataItem.Id);
            }
        });
        return name;
    }

    geteSelectId() {
        const name = [] ;
        this._ecacheMapData.forEach(item => {
            if (item.checked) {
                name.push(item.dataItem.Id);
            }
        });
        return name;
    }

    getShared(data?) {
        return this.shared.get(data);
    }
    // endregion

// region 类型操作
    showTypeForComponent(flag?) {
        switch (flag) {
            case 'Add':
                this.confirmAddType();
                break;
            case 'Edit':
                this.confirmEditType();
                break;
        }
    }

    confirmAddType() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : TypeOperationComponent,
            nzFooter         : null,
            nzComponentParams: {
                name: '',
            }
        });
        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object')

                this.resourceType.addType(result).subscribe( response => {
                    if (response.Status === 200) {
                        this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                        this.trefresh();
                    } else {
                        this.msgSrv.error(response.Message);
                    }
                });
        });
    }

    confirmEditType() {
        const items = this.gettSelectId();
        if ( items.length === 1) {
            const itemId = items.pop();
            let ITEM = {};
            this._tdataSet.forEach( (item) => {if (item.Id === itemId) ITEM = item; } );

            const subscription = this.modalService.create({
                nzTitle          : '修改数据',
                nzContent        : TypeOperationComponent,
                nzFooter         : null,
                nzComponentParams: {
                data: ITEM
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = itemId;
                    this.resourceType.updateType(result).subscribe( response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '修改成功！');
                            this.trefresh();
                        } else {
                            this.msgSrv.error(response.Message);
                        }
                    }); }
            });
        } else if (items.length > 1 ) {
            this.msgSrv.warning('不能修改多条记录！');
        } else {
            this.msgSrv.warning('请选中要修改的记录！');
        }
    }

// endregion

// region 字段操作
    showEntityForComponent(flag?) {

        switch (flag) {
            case 'Add':
                this.confirmAddEntity();
                break;
            case 'Edit':
                this.confirmEditEntity();
                break;
        }
    }

    confirmAddEntity() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : EntityOperationComponent,
            nzFooter         : null,
            nzComponentParams: {
            name: ''
            }
        });
        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object')
                if (this._tparentid) {
                    result['OwnerId'] = this._tparentid;
                    this.entityProDef.addEntity(result).subscribe(response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                            this.erefresh();
                        } else {
                            this.msgSrv.error(response.Message);
                        }
                    });
                } else {
                    this.msgSrv.error('没有选中字段所属的表名称！');
                }
        });
    }

    confirmEditEntity() {
        const items = this.geteSelectId();
        if ( items.length === 1) {
            const itemId = items.pop();
            let ITEM = {};
            this._edataSet.forEach( (item) => {if ( item.Id === itemId ) ITEM = item; } );
            const subscription = this.modalService.create({
                nzTitle          : '修改数据',
                nzContent        : EntityOperationComponent,
                nzFooter         : null,
                nzComponentParams: {
                 data: ITEM
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = itemId;
                    this.entityProDef.updateEntity(result).subscribe( response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '修改成功！');
                            this.erefresh();
                        } else {
                            this.msgSrv.error(response.Message);
                        }
                    }); }
            });
        } else if (items.length  > 1 ) {
            this.msgSrv.warning('不能修改多条记录！');
        } else {
            this.msgSrv.warning('请选中要修改的记录！');
        }
    }
// endregion
}

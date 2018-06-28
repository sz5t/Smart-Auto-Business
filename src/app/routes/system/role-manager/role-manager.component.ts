import {Component, Injectable, OnInit} from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RoleOperationComponent} from './role-operation.component';
import {AppPermission, FuncResPermission} from '../../../model/APIModel/AppPermission';
import {CacheService} from '@delon/cache';

@Injectable()
export class RoleService {
  roleServiceUrl = APIResource.PrivRole;

  getPrivRole(pageIndex = 1, pageSize = 2, sortField, sortOrder, genders) {
    return this.http.get(`${this.roleServiceUrl}`, {
      _page: pageIndex, _rows: pageSize // , _orderBy: `${sortField} ${sortOrder}`
    });
  }

    deleteRole(idlist) {
        const ids = idlist.join(',');
        if ( ids.length > 0 ) {
            return this.http.delete(`${this.roleServiceUrl}`, {_ids: ids});
        }
    }

    addRole(data?) {
      data['OwnerId'] = APIResource.AppPlatCustomerId;
      data['ProjId'] = APIResource.AppProjId;
      // data['AppPermission'] = JSON.parse('{"$type":"SinoForce.User.AppPermission, SinoForce.Data","DataResPermission":{"$type":"SinoForce.User.DataResPermission, SinoForce.Data","ResourceTypePermissions":[{"$type":"SinoForce.User.ResourceTypePermission, SinoForce.Data","PropPermissions":[],"QueryFilter":"ApplyId=754EEF73A2781F4D81A9C37ED83B43B9","UpdateFilter":"","DeleteFilter":"","RowPermissions":[],"Id":"282daf2270ff45aba76e221fb8605923","Name":"UnstructData","OpPermissions":[{"$type":"SinoForce.User.OpPermission, SinoForce.Data","Name":"GET","Permission":"Permitted","PermissionExpText":""}]}],"Id":"b48d78bf8883e944939bad7e123f0248","Name":"任意类型","OpPermissions":[]},"FuncResPermission":null}');
      // data['AppPermission'] = JSON.parse('{"DataResPermission": null,"FuncResPermission": null}');
        return this.http.post(`${this.roleServiceUrl}`, data);
    }

    updateRole(data?) {
        return this.http.put(`${this.roleServiceUrl}`, data);
    }

  constructor(private http: ApiService) {
  }
}


@Component({
  selector: 'app-role-manager',
  providers: [RoleService],
  templateUrl: './role-manager.component.html',
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
export class RoleManagerComponent implements OnInit {

    _allChecked = false;
    _indeterminate = false;
    _cacheMapData;

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet = [];
    _loading = true;
    _sortValue = 'asc';
    _sortField = 'order';
    _filterGender = [];

    _checkAll() {
        this._dataSet.forEach(item => item.checked = this._allChecked);
        this._cacheMapData.forEach( mpa => {mpa.checked = this._allChecked; });
    }

    selectRow(data?) {
        this._dataSet.forEach( item => {
            item.selected = false;
        });
        data.selected = true;
        this._cacheMapData.get(data.Id).checked = data.checked;
    }

  sort(field , value) {
    this._sortValue = (value === 'descend') ? 'DESC' : 'ASC';
    this._sortField = field;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  constructor(
      private cacheService: CacheService,
      private _randomRole: RoleService,
      private modalService: NzModalService,
      public msgSrv: NzMessageService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
      this._cacheMapData = new Map();
      this._allChecked = false;
    this._loading = true;
    this._randomRole.getPrivRole(this._current, this._pageSize, this._sortField, this._sortValue, '').subscribe((data: any) => {
      this._loading = false;
      this._total = data.Data.Total;
      this._dataSet = data.Data.Rows;
        this._dataSet.forEach( item => {
            this._cacheMapData.set(item.Id, {checked: false, dataItem: item});
        });
    });
  }

    refresh() {
        this.refreshData();
    }

    update(data?) {
        // console.log('update');
    }

    delete() {
        const idlist = this.getSelectId();
        if (idlist.length >= 1) {
            this._randomRole.deleteRole(idlist).subscribe(response => {
                if (response.Status === 200) {
                    this.msgSrv.success(response.Message);
                    idlist.forEach( na => {
                        this._cacheMapData.delete(na);
                    });
                    this.refreshData();
                } else {
                    this.msgSrv.error(response.Message);
                }
            });
        } else {
            this.msgSrv.success('请选中要删除的数据！');
        }
    }
    getSelectId() {
        const name = [] ;
        this._cacheMapData.forEach(item => {
            if (item.checked) {
                name.push(item.dataItem.Id);
            }
        });
        return name;
    }
  ngOnInit() {
    this.refreshData();
  }

    showRoleForComponent(flag?) {
        switch (flag) {
            case 'Add':
                this.confirmAddRole();
                break;
            case 'Edit':
                this.confirmEditRole();
                break;
        }
    }

    confirmAddRole() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : RoleOperationComponent,
            nzFooter         : null,
            nzWidth          : 800,
            nzComponentParams: {
                name: '',
            }
        });

        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object') {
                this._randomRole.addRole(result).subscribe(response => {
                    if (response.Status === 200) {
                        this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                        this.refreshData();
                    } else {
                        this.msgSrv.error(response.Message);
                    }
                });
            }
        });
    }

    confirmEditRole() {
        const items = this.getSelectId();
        if ( items.length === 1) {
            const itemId = items.pop();
            let ITEM = {};
            this._dataSet.forEach( (item) => {
                if (item.Id === itemId)
                    ITEM = item;
            } );

            const subscription = this.modalService.create({
                nzTitle          : '修改数据',
                nzContent        : RoleOperationComponent,
                nzFooter         : null,
                nzWidth          : 800,
                nzComponentParams: {
                    data: ITEM
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = itemId;
                    this._randomRole.updateRole(result).subscribe( response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '修改成功！');
                            this.refreshData();
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
}



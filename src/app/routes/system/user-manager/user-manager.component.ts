import { Component, Injectable, OnInit } from '@angular/core';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {UserOperationComponent} from './user-operation.component';
import {UserRoleComponent} from './user-role.component';

@Injectable()
export class RandomUserService {
  randomUserUrl = APIResource.AppUser;
  roleUrl = APIResource.PrivRole;

  getUsers(pageIndex = 1, pageSize = 2, sortField, sortOrder, genders) {
    return this.http.get(`${this.randomUserUrl}`, {
      _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
    });
  }

  getRole() {
      return this.http.get(`${this.roleUrl}`, {
          _select: 'Id as value,Name as label,false as checked'
      });
  }
  deleteUser(idlist) {
      const ids = idlist.join(',');
      if ( ids.length > 0 ) {
          return this.http.delete(`${this.randomUserUrl}`, {_ids: ids});
      }
  }

  addUser(data?) {
      data['Password'] = '1';
      data['PlatCustomerId'] = APIResource.AppPlatCustomerId;
      data['LoginLimitKind'] = 'None';
      return this.http.post(`${this.randomUserUrl}`, data);
  }

    updateUser(data?) {
      return this.http.put(`${this.randomUserUrl}`, data);
    }
  constructor(private http: ApiService) {
  }
}

@Component({
  selector: 'app-user-manager',
  providers: [ RandomUserService ],
  templateUrl: './user-manager.component.html',
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
export class UserManagerComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;
  _cacheMapData;


  _roleDataset = [];
  _roleInit = [];
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = 'asc';
  _sortField = 'CreateTime';
  _filterGender = [];
    isVisible = false;

  Gender = {Unknown: '未知', Male: '男', Female: '女'};

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

    refresh() {
        this.refreshData();
    }

    delete() {
        const idlist = this.getSelectId();
        if (idlist.length >= 1) {
            this._randomUser.deleteUser(idlist).subscribe(response => {
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

  sort(sort) {
    this._sortValue = (sort.value === 'descend') ? 'DESC' : 'ASC';
    this._sortField = sort.key;
    this.refreshData();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }
    constructor(
      public msgSrv: NzMessageService,
      private modalService: NzModalService,
      private _randomUser: RandomUserService
    ) { }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._cacheMapData = new Map();
    this._allChecked = false;
    this._loading = true;
    this._randomUser.getUsers(this._current, this._pageSize, this._sortField, this._sortValue, '').subscribe((data: any) => {
      this._loading = false;
      this._total = data.Data.Total;
      this._dataSet = data.Data.Rows;
      this._dataSet.forEach( item => {
          this._cacheMapData.set(item.Id, {checked: false, dataItem: item});
      });
    });
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
    this.getRole();
    }

    getRole() {
        this._randomUser.getRole().subscribe(  (data) => {
            this._roleDataset = data.Data;
            this._roleInit = data.Data;
        });
    }

    showUserForComponent(flag?) {
        switch (flag) {
            case 'Add':
                this.confirmAddUser();
                break;
            case 'Edit':
                this.confirmEditUser();
                break;
        }
    }

    confirmAddUser() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : UserOperationComponent,
            nzFooter         : null,
            nzComponentParams: {
                name: '',
            }
        });
        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object')

                this._randomUser.addUser(result).subscribe( response => {
                    if (response.Status === 200) {
                        this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                        this.refreshData();
                    } else {
                        this.msgSrv.error(response.Message);
                    }
                });
        });
    }

    confirmEditUser() {
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
                nzContent        : UserOperationComponent,
                nzFooter         : null,
                nzComponentParams: {
                    data: ITEM
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = itemId;
                    delete result['Password'];
                    this._randomUser.updateUser(result).subscribe( response => {
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

    settingRole() {
        this.confirmRoleUser();
    }

    confirmRoleUser() {
        const subscription = this.modalService.create({
            nzTitle          : '角色设置',
            nzContent        : UserRoleComponent,
            nzFooter         : null,
            nzComponentParams: {
                dataSet: this._dataSet,
                dataDataset: this._roleDataset
            }
        });
    }
}

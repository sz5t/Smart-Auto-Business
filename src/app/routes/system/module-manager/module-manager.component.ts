import {Component, Injectable, OnInit} from '@angular/core';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';
import {CacheService} from '@delon/cache';

import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ModuleOperationComponent} from './module-operation.component';

@Injectable()
export class ModuleService {
  moduleUrl = APIResource.AppModuleConfig;
  moduleServiceUrl = `${APIResource.AppModuleConfig}/_root/${APIResource.AppModuleConfig}?_recursive=true&_deep=6&_root.ApplyId=${APIResource.AppApplyId}&_root.parentid=in("",null)`;
  getModule(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
    return this.http.get(`${this.moduleServiceUrl}` , {
      _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
    } );
  }

  deleteModule(ids) {
      const _ids = ids.join(',');
      if ( _ids.length > 0 ) {
          return this.http.deleteProj(`${this.moduleUrl}`, { _ids: _ids});
      }
  }

  updateModule(data?) {
        return this.http.putProj(`${this.moduleUrl}`, data);
      }

    addModule(data?) {
        return this.http.postProj(`${this.moduleUrl}`, data);
    }

  constructor(private http: ApiService) {
  }
}

@Component({
  selector: 'cn-module-manager',
  providers: [ModuleService],
  templateUrl: './module-manager.component.html',
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
export class ModuleManagerComponent implements OnInit {
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = 'asc';
  _sortField = 'order';

  ids: string[];
  dataItems;
  dataTree = [];

  constructor(
      private cacheService: CacheService,
      private apiService: ApiService,
      public msgSrv: NzMessageService,
      private _moduleService: ModuleService,
      private modalService: NzModalService
    ) {
      this.dataItems = new Map();
  }

  expandDataCache = {};

  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root) {
    const stack = [], array = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  reset() {
    this.loadData(true);
  }

  visitNode(node, hashMap, array) {
    if (!hashMap[ node.id ]) {
      hashMap[ node.id ] = true;
      array.push(node);
    }
  }

  ngOnInit() {
      this.loadData();
  }

  loadData(reset = false, event?) {
      this.dataItems.clear();
      if (reset) {
        this._current = 1;
        this._pageSize = event;
      }
      this._loading = true;
      this._moduleService.getModule(this._current, this._pageSize, this._sortField, this._sortValue).subscribe( (data: any) => {
        this._loading = false;
        this._total = data.Data.Total;

        this._dataSet = this.arrayToTree(data.Data.Rows, '');
        this.dataTree = this.drarrayToTree(data.Data.Rows, '');
        this.cacheService.set('ModuleTree', this.dataTree);
        this._dataSet.forEach(item => {
          this.expandDataCache[ item.id ] = this.convertTreeToList(item);
        });
      });
    }

  refresh(event?) {
    this._current = 1;
    this._pageSize = 10;
      this.loadData();
    }

  delete(event?) {
      if (this.dataItems.size >= 1) {
          const ids = [];
          this.dataItems.forEach((item, ikey) => {ids.push(ikey); });
          this._moduleService.deleteModule(ids).subscribe(response => {
              if (response.Status === 200) {
                  this.msgSrv.success(response.Message);
                  this.loadData();
              } else {
                  this.msgSrv.error(response.Message);
              }
          });
      } else {
          this.msgSrv.success('请选中要删除的数据！');
      }
    }

  drarrayToTree(data, parentid) {
        const result = [];
        let temp;
        if (data)
        for (let i = 0; i < data.length; i++) {
            if (data[i].ParentId == parentid || !data[i].ParentId) {
                const obj = { label: data[i].Name,
                        value: data[i].Id
                    };
                temp = this.drarrayToTree(data[i].Children, data[i].Id);
                if (temp.length > 0) {
                    obj['children'] = temp;
                } else {
                    obj['isLeaf'] = true;
                }
                result.push(obj);
            }
        }
        return result;
    }

    idss = [];
  arrayToTree(data, parentid) {
    const result = [];
    let temp;
      if (data)
    for (let i = 0; i < data.length; i++) {
        if (data[i].ParentId === '' || data[i].ParentId == null)
            this.idss = [];
      if (data[i].ParentId == parentid || !data[i].ParentId) {
          if (!(this.idss.indexOf(data[i].ParentId) >= 0) )this.idss.push(data[i].ParentId);
        const obj = { text: data[i].Name,
            id: data[i].Id,
            group: JSON.parse(data[i].ConfigData).group,
            link: JSON.parse(data[i].ConfigData).link,
            icon: JSON.parse(data[i].ConfigData).icon,
            isDisableCheckbox:  JSON.parse(data[i].ConfigData).isDisableCheckbox,
            remark: data[i].Remark,
            order: data[i].Order,
            createtime: data[i].CreateTime,
            applyid: data[i].ApplyId,
            projid: data[i].ProjId,
            platcustomerid: data[i].PlatCustomerId,
          };
        temp = this.arrayToTree(data[i].Children, data[i].Id);
        if (temp.length > 0) {
            obj['children'] = temp;
            obj['isLeaf'] = false;
        } else {
            obj['Ids'] =  this.idss.slice(0);
            obj['isLeaf'] = true;
            obj['checked'] = false;
            if (data[i].ParentId === '' || data[i].ParentId == null)
                this.idss = [];
            else
            this.idss.pop();
        }
        obj['selected'] = false;
        result.push(obj);
      }
    }
    return result;
  }

  refChecked(value, item) {
      if (value) {
          this.dataItems.set(item.id, item);
      } else {
          this.dataItems.delete(item.id);
      }
  }

    showModalForComponent(flag?) {

        switch (flag) {
            case 'Add':
                this.confirmAddData();
                break;
            case 'Edit':
                this.confirmEditData( );
                break;
        }
    }

    confirmAddData() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : ModuleOperationComponent,
            nzFooter         : null,
            nzComponentParams: {
                name: '',
                tree: this.dataTree
            }
        });
        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object')
                this._moduleService.addModule(result).subscribe( response => {
                    if (response.Status === 200) {
                        this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                        this.loadData();
                    } else {
                        this.msgSrv.error(response.Message);
                    }
                });
        });
        this.loadData();
    }

    confirmEditData() {
        if ( this.dataItems.size === 1) {
            let data: any = {};
            this.dataItems.forEach(item => { data = item; });
            const subscription = this.modalService.create({
                nzTitle          : '修改数据',
                nzContent        : ModuleOperationComponent,
                nzFooter         : null,
                nzComponentParams: {
                    name: data,
                    tree: this.dataTree
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = data.id;
                    this._moduleService.updateModule(result).subscribe( response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '修改成功！');
                            this.loadData();
                        } else {
                            this.msgSrv.error(response.Message);
                        }
                    }); }
            });
            this.loadData();
        } else if (this.dataItems.size > 1 ) {
            this.msgSrv.warning('不能修改多条记录！');
        } else {
            this.msgSrv.warning('请选中要修改的记录！');
        }
    }

    getText(flag) {
        return !flag ? '启用' : '禁用';
    }
}

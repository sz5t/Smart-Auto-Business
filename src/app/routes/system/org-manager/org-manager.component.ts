import {Component, Injectable, OnInit} from '@angular/core';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {OrgOperationComponent} from './org-operation.component';
import {CacheService} from '@delon/cache';


@Injectable()
export class OrgService {
    OrgNodeUrl = APIResource.OrgNode;
    moduleServiceUrl = `${APIResource.OrgNode}/_root/${APIResource.OrgNode}?_recursive=true&_deep=6&_root.ParentId=in("${APIResource.AppPlatCustomerId}")`;
    getorg(pageIndex = 1, pageSize = 2, sortField, sortOrder) {
        return this.http.get(`${this.moduleServiceUrl}`, {
            _page: pageIndex, _rows: pageSize, _orderBy: `${sortField} ${sortOrder}`
        });
    }

    deleteorg(idlist?) {
        const ids = idlist.join(',');
        if ( ids.length > 0 ) {
            return this.http.delete(this.OrgNodeUrl, { _ids: ids});
        }
    }

    updateOrg(data) {
        return this.http.put(`${this.OrgNodeUrl}`, data);
    }

    addOrg(data?) {
        return this.http.post(`${this.OrgNodeUrl}`, data);
    }

    constructor(private http: ApiService) {

    }
}

@Component({
  selector: 'app-org-manager',
  templateUrl: './org-manager.component.html',
    providers: [OrgService],
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
export class OrgManagerComponent implements OnInit {

    _allChecked = false;
    _indeterminate = false;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet = [];
    _loading = true;
    _sortValue = 'asc';
    _sortField = 'CreateTime';
    _cacheMapData;
    expandDataCache = {};
    dataItems;
    dataTree = [];

    constructor(
        private cacheService: CacheService,
        public msgSrv: NzMessageService,
        private orgService: OrgService,
        private modalService: NzModalService
    ) { this.dataItems = new Map(); }

    ngOnInit() {
        this.refreshOrg();
    }

    refresh() {
        this.refreshOrg();
    }

    add() {
       this.orgService.addOrg().subscribe( response => {
           if (response.Status === 200) {
               this.msgSrv.success(response.Message ? response.Message : '添加成功！');
               this.refreshOrg();
           } else {
               this.msgSrv.error(response.Message);
           }
       });
    }

    delete() {
        if (this.dataItems.size >= 1) {
            const ids = [];
            this.dataItems.forEach((item, ikey) => {ids.push(ikey); });
            this.orgService.deleteorg(ids).subscribe(response => {
                if (response.Status === 200) {
                    this.msgSrv.success(response.Message);
                    this.refreshOrg();
                } else {
                    this.msgSrv.error(response.Message);
                }
            });
        } else {
            this.msgSrv.success('请选中要删除的数据！');
        }
    }

    collapse(array, data, $event) {

        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.Id === d.Id);
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

    visitNode(node, hashMap, array) {
        if (!hashMap[ node.Id ]) {
            hashMap[ node.Id ] = true;
            array.push(node);
        }
    }

    refChecked(value, item) {
        if (value) {
            this.dataItems.set(item.Id, item);
        } else {
            this.dataItems.delete(item.Id);
        }
    }

    refreshOrg(reset?) {
        this.dataItems.clear();
        if ( reset ) {
            this._current = 1;
        }
        this._cacheMapData = new Map();
        // this._allChecked = false;
        this._loading = true;
        this.orgService.getorg(this._current, this._pageSize, this._sortField, this._sortValue).subscribe( (response) => {
            this._loading = false;
            this._total = response.Data.Total;
            this._dataSet = this.arrayToTree(response.Data.Rows, `${APIResource.AppPlatCustomerId}`);
            this.dataTree = this.drarrayToTree(response.Data.Rows, `${APIResource.AppPlatCustomerId}`);
            this.cacheService.set('OrgTree', this.dataTree);
            this._dataSet.forEach(item => {
                this.expandDataCache[ item.Id ] = this.convertTreeToList(item);
            });
        } );
    }

    drarrayToTree(data, parentid) {
        const result = [];
        let temp;
        if (data)
            for (let i = 0; i < data.length; i++) {
                if (data[i].ParentId === parentid || !data[i].ParentId) {
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
                if (data[i].ParentId === APIResource.AppPlatCustomerId)
                    this.idss = [];
                if (data[i].ParentId === parentid || !data[i].ParentId) {
                    if (!(this.idss.indexOf(data[i].ParentId) >= 0) )this.idss.push(data[i].ParentId);
                    const obj = {
                            Name: data[i].Name,
                            Id: data[i].Id,
                            ShortName: data[i].ShortName,
                            Code: data[i].Code,
                            Comment: data[i].Comment,
                            CreateTime: data[i].CreateTime,
                            Kind: data[i].Kind,
                            Level: data[i].Level,
                            Order: data[i].Order,
                        };
                    temp = this.arrayToTree(data[i].Children, data[i].Id);
                    if (temp.length > 0) {
                        obj['children'] = temp;
                        obj['isLeaf'] = false;
                    } else {
                        obj['Ids'] =  this.idss.slice(0);
                        obj['isLeaf'] = true;
                        obj['checked'] = false;
                        if (data[i].ParentId === APIResource.AppPlatCustomerId)
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


    showModalForComponent(flag?) {

        switch (flag) {
            case 'Add':
                this.confirmAddOrg();
                break;
            case 'Edit':
                this.confirmEditOrg( );
                break;
        }
    }

    confirmAddOrg() {
        const subscription = this.modalService.create({
            nzTitle          : '新增数据',
            nzContent        : OrgOperationComponent,
            nzFooter         : null,
            nzComponentParams: {
                data: '',
                tree: this.dataTree
            }
        });
        subscription.afterClose.subscribe((result) => {
            if (typeof result === 'object')
                this.orgService.addOrg(result).subscribe( response => {
                    if (response.Status === 200) {
                        this.msgSrv.success(response.Message ? response.Message : '添加成功！');
                        this.refreshOrg();
                    } else {
                        this.msgSrv.error(response.Message);
                    }
                });
        });
        this.refreshOrg();
    }

    confirmEditOrg() {
        if ( this.dataItems.size === 1) {
            let data: any = {};
            this.dataItems.forEach(item => { data = item; });

            const subscription = this.modalService.create({
                nzTitle          : '修改数据',
                nzContent        : OrgOperationComponent,
                nzFooter         : null,
                nzComponentParams: {
                    data: data,
                    tree: this.dataTree
                }
            });
            subscription.afterClose.subscribe(result => {
                if (typeof result === 'object') {
                    result['Id'] = data.Id;
                    this.orgService.updateOrg(result).subscribe( response => {
                        if (response.Status === 200) {
                            this.msgSrv.success(response.Message ? response.Message : '修改成功！');
                            this.refreshOrg();
                        } else {
                            this.msgSrv.error(response.Message);
                        }
                    }); }
            });
            this.refreshOrg();
        } else if (this.dataItems.size > 1 ) {
            this.msgSrv.warning('不能修改多条记录！');
        } else {
            this.msgSrv.warning('请选中要修改的记录！');
        }
    }

}



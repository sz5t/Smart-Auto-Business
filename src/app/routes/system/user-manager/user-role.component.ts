import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {APIResource} from '@core/utility/api-resource';
import {ApiService} from '@core/utility/api-service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styles  : [
        `
      [nz-radio] {
        display: block;
      }
    `
    ]
})
export class UserRoleComponent implements OnInit {

    _dataSet: any;
    _roleDataset: any[];
    _roleInit: any[];
    radioValue = '';


    @Input()
    set dataSet(value: any) {
        this._dataSet = value;

    }

    @Input()
    set dataDataset(value: any) {
        this._roleDataset = value;
        // this._roleInit = this._roleDataset.slice(0);
        // this._roleInit = this._roleDataset.concat();
        // console.log(666,this._roleInit ===this._roleDataset)
    }
    constructor(
        private modal: NzModalRef,
        private http: ApiService,
        public msg: NzMessageService,

    ) { }

    ngOnInit() {
    }

    emitDataOutside() {
        if (this.roleList.length === 0) {
            // console.log('对当前用户的角色没有做任何更改，请修改后继续');
        } else {
            const roles = this.roleList.pop();
            this.http.delete(`${APIResource.PrivRoleLink}`, {'LeftId': this.userList.pop()}).subscribe(
                response => {
                    // console.log(response.Message);
                    if (response.Status === 200) {
                        const body = [];
                        roles.forEach(item => {
                            body.push({'LeftId': this.radioValue, 'RightId': item, 'ProjId': APIResource.AppProjId});
                        });
                       this.http.post(`${APIResource.PrivRoleLink}`, body).subscribe( () => {
                           this.msg.success('角色添加成功！');
                       });
                    }
                }
            );
        }
    }

    handleCancel(e) {
        this.modal.destroy();
        this._roleDataset.forEach(item => {
            item.checked = false;
        });
    }

    userList = [];
    roleList = [];
    log(name: string, value: string[]): void {
        this.roleList.push(value);
    }

    clickRadio(Id: string) {
        this.userList.push(Id);
        this.http.get(`${APIResource.PrivRoleLink}`, {leftId: Id, _select: 'RightId as Id'}).subscribe(response => {
            // console.log('获取用户角色列表：', response.Data);
            const roleList = response.Data;
            this._roleDataset.forEach(item => {
                item.checked = false;
                roleList.forEach(ite => {
                    if (ite.Id === item.value) {
                        item.checked = true;
                    }
                    });
            });
        });
}

    style = {
        display   : 'block',
        height    : '30px',
        lineHeight: '30px'
    };
}

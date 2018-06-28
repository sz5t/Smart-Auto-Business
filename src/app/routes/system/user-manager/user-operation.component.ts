import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';
@Component({
  selector: 'app-user-operation',
  templateUrl: './user-operation.component.html',
})
export class UserOperationComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef
    ) { }

    userOperForm: FormGroup;
    _data: any;
    _parentId: string;
    values: any[] ;

    @Input()
    set data(value: any) {
        this._data = value;
    }
    ngOnInit() {
        this.userOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            Gender : [ 'Unknown'],
            IdCardNumber     : [null, [ Validators.required ]],
            // Birthday     : [ null, [Validators.required]],
            Code     : [ ],
            MailAddress   : [ null],
            MobileNumber    : [null, [ Validators.required ]],
            NickName   : [ null],
            // OrgId   : [ null],
            RealName   : [ null],
            Remark   : [ null],
            UserType   : ['Normal'],
            Status   : ['Inactive']
            // PersonId: [ null ],

        });
        if (this._data) {
            this.userOperForm.controls['Name'].setValue(this._data.Name);
            this.userOperForm.controls['Gender'].setValue(this._data.Gender);
            this.userOperForm.controls['IdCardNumber'].setValue(this._data.IdCardNumber);
            // this.userOperForm.controls['Birthday'].setValue(this._data.Birthday);
            this.userOperForm.controls['Code'].setValue(this._data.Code);
            this.userOperForm.controls['MailAddress'].setValue(this._data.MailAddress);
            this.userOperForm.controls['MobileNumber'].setValue(this._data.MobileNumber);
            this.userOperForm.controls['NickName'].setValue(this._data.NickName);
            this.userOperForm.controls['RealName'].setValue(this._data.RealName);
            this.userOperForm.controls['Remark'].setValue(this._data.Remark);
            this.userOperForm.controls['UserType'].setValue(this._data.UserType);
            this.userOperForm.controls['Status'].setValue(this._data.Status);
        }
    }

    emitDataOutside() {
        if (!this.userOperForm.valid)
            return;
        if (!this._data) this._data = {};
        this._data['Name'] =   this.userOperForm.controls['Name'].value;
        this._data['Gender'] =  this.userOperForm.controls['Gender'].value;
        this._data['IdCardNumber'] =  this.userOperForm.controls['IdCardNumber'].value;
        // this._data['Birthday'] = this.userOperForm.controls['Birthday'].value;
        this._data['Code'] = this.userOperForm.controls['Code'].value;
        this._data['MailAddress'] = this.userOperForm.controls['MailAddress'].value;
        this._data['MobileNumber'] =  this.userOperForm.controls['MobileNumber'].value;
        this._data['NickName'] =  this.userOperForm.controls['NickName'].value;
        this._data['RealName'] = this.userOperForm.controls['RealName'].value;
        this._data['Remark'] = this.userOperForm.controls['Remark'].value;
        this._data['UserType'] = this.userOperForm.controls['UserType'].value;
        this._data['Status'] = this.userOperForm.controls['Status'].value;
            this.modal.destroy(this._data);
    }

    handleCancel(e) {
        this.modal.destroy();
    }


    _submitForm() {
        for (const i in this.userOperForm.controls) {
            this.userOperForm.controls[ i ].markAsDirty();
        }
    }

    getFormControl(name) {
        return this.userOperForm.controls[ name ];
    }
}







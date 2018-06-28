import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {CacheService} from '@delon/cache';
import { NzModalRef } from 'ng-zorro-antd';
import {SysResource} from '@core/utility/sys-resource';

@Component({
  selector: 'app-module-operation',
  templateUrl: './module-operation.component.html',
})
export class ModuleOperationComponent implements OnInit {

    data = SysResource.data;
    isVisible = false;
    iconFlag = null;
    validateForm: FormGroup;
    _name: any;
    _parentId: string;
    _tree: any;
    values: any[] ;

    @Input()
    set name(value: any) {
        this._name = value;
    }
    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel1(): void {
        this.isVisible = false;
    }

    copy(group?: any, item?: any) {
        this.iconFlag = group.prefix + item.k;
    }

    constructor(
        private http: _HttpClient,
        private cacheService: CacheService,
        private fb: FormBuilder,
        private modal: NzModalRef) {

    }
    emitDataOutside() {
        if (!this.validateForm.valid)
            return;
        const data = {
            Children: null,
            ConfigData :  JSON.stringify({
                group: this.validateForm.controls['Group'].value ? this.validateForm.controls['Group'].value : false,
                link: this.validateForm.controls['Link'].value,
                icon: this.validateForm.controls['Icon'].value,
                isDisableCheckbox: this.validateForm.controls['isDisableCheckbox'].value ? this.validateForm.controls['isDisableCheckbox'].value : false,
                hide: this.validateForm.controls['isDisableCheckbox'].value ? this.validateForm.controls['isDisableCheckbox'].value : false
            }),
            Name:   this.validateForm.controls['Name'].value,
            Order:  this.validateForm.controls['Order'].value,
            ParentId:  this._parentId,
            Remark: this.validateForm.controls['Remark'].value,
            ShareScope: 'Project'
        };
        if (!this._parentId)
            data['ParentId'] = '';

        this.modal.destroy(data);
    }

    handleCancel(e) {
        this.modal.destroy();
    }


    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            ParentId : [ null],
            Group    : [ null],
            isDisableCheckbox     : [ null ],
            Link     : [ null],
            Icon     : [ ],
            Remark   : [ null],
            Order    : [null, [ Validators.min(0)]],
        });
        this._tree = this.cacheService.getNone('ModuleTree');
        if (this._name !== '') {
            this.validateForm.controls['Name'].setValue(this._name.text);
            this.validateForm.controls['Group'].setValue(this._name.group);
            this.validateForm.controls['Link'].setValue(this._name.link);
            this.validateForm.controls['Icon'].setValue(this._name.icon);
            this.validateForm.controls['isDisableCheckbox'].setValue(this._name.isDisableCheckbox);
            this.iconFlag = this._name.icon;
            this.validateForm.controls['Order'].setValue(this._name.order);
            this.validateForm.controls['Remark'].setValue(this._name.remark);
            this._name.Ids.shift();
            this.values = this._name.Ids;
        }
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    public onChanges(values: any) {

        this._parentId = values.pop();
        // console.log(this._parentId);
    }

}

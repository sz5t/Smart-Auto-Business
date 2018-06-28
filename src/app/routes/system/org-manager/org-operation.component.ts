import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';
import {APIResource} from '@core/utility/api-resource';

@Component({
  selector: 'app-org-operation',
  templateUrl: './org-operation.component.html',
})
export class OrgOperationComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private cacheService: CacheService,
        private modal: NzModalRef
    ) { }

    orgOperForm: FormGroup;
    _data: any;
    _parentId: string;
    _tree: any;
    values: any[] ;

    @Input()
    set data(value: any) {
        this._data = value;
    }
    ngOnInit() {
        this.orgOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            Code : [null],
            Comment     : [null],
            ShortName     : [ null ],
            Order : [],
            ParentId : [ null],
        });
        this._tree = this.cacheService.getNone('OrgTree');
        if (this._data) {
            this.orgOperForm.controls['Name'].setValue(this._data.Name);
            this.orgOperForm.controls['Code'].setValue(this._data.Code);
            this.orgOperForm.controls['ShortName'].setValue(this._data.ShortName);
            this.orgOperForm.controls['Comment'].setValue(this._data.Comment);
            this.orgOperForm.controls['Order'].setValue(this._data.Order);
            this._data.Ids.shift();
            this.values = this._data.Ids;
        }
    }

    emitDataOutside() {
        if (!this.orgOperForm.valid)
            return;
        if (!this._data) this._data = {};
        this._data['Name'] =   this.orgOperForm.controls['Name'].value;
        this._data['Code'] =  this.orgOperForm.controls['Code'].value;
        this._data['Comment'] =  this.orgOperForm.controls['Comment'].value;
        this._data['ShortName'] = this.orgOperForm.controls['ShortName'].value;
        this._data['Order'] = this.orgOperForm.controls['Order'].value;
        this._data['ParentId'] = this._parentId;
        if (!this._parentId)
            this._data['ParentId'] = APIResource.AppPlatCustomerId;
        this.modal.destroy(this._data);
    }

    handleCancel(e) {
        this.modal.destroy();
    }

    _submitForm() {
        for (const i in this.orgOperForm.controls) {
            this.orgOperForm.controls[ i ].markAsDirty();
        }
    }

    getFormControl(name) {
        return this.orgOperForm.controls[ name ];
    }

    public onChanges(values: any) {
        this._parentId = values.pop();
    }
}


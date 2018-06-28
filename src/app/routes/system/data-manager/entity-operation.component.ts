import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';

@Component({
  selector: 'app-entity-operation',
  templateUrl: './entity-operation.component.html',
})
export class EntityOperationComponent implements OnInit {

    entityOperForm: FormGroup;
    _data: any;
    _parentId: string;
    values: any[] ;

    @Input()
    set data(value: any) {
        this._data = value;
    }

    constructor(
        private http: _HttpClient,
        private cacheService: CacheService,
        private fb: FormBuilder,
        private modal: NzModalRef) {

    }
    emitDataOutside() {
        if(!this.entityOperForm.valid)
            return;
        if(!this._data) this._data = {};
        this._data['Name'] =  this.entityOperForm.controls['Name'].value,
        this._data['Caption'] =  this.entityOperForm.controls['Caption'].value,
        this._data['MaxLength'] = this.entityOperForm.controls['MaxLength'].value,
        this._data['MinLength'] =  this.entityOperForm.controls['MinLength'].value,
        this._data['Nullable'] =  this.entityOperForm.controls['Nullable'].value ? this.entityOperForm.controls['Nullable'].value : false,
        this._data['Precision'] =  this.entityOperForm.controls['Precision'].value,
        this._data['SortCode'] =  this.entityOperForm.controls['SortCode'].value,
        this._data['Remark'] =  this.entityOperForm.controls['Remark'].value,
        this._data['PropertyType'] = this.entityOperForm.controls['PropertyType'].value,
        this.modal.destroy(this._data);
    }

    handleCancel(e) {
        this.modal.destroy();
    }


    _submitForm() {
        for (const i in this.entityOperForm.controls) {
            this.entityOperForm.controls[ i ].markAsDirty();
        }
    }

    ngOnInit() {
        this.entityOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            Caption : [ null],
            IsKey    : [ null],
            MaxLength     : [50],
            MinLength : [0],
            Nullable :  [true],
            Precision     : [0],
            SortCode     : [null, [ Validators.required ] ],
            Remark   : [ null],
            PropertyType: ['String']
        });

        if(this._data) {
            this.entityOperForm.controls['Name'].setValue(this._data.Name);
            this.entityOperForm.controls['Caption'].setValue(this._data.Caption);
            this.entityOperForm.controls['IsKey'].setValue(this._data.IsKey);
            this.entityOperForm.controls['MaxLength'].setValue(this._data.MaxLength);
            this.entityOperForm.controls['MinLength'].setValue(this._data.MinLength);
            this.entityOperForm.controls['Nullable'].setValue(this._data.Nullable);
            this.entityOperForm.controls['Precision'].setValue(this._data.Precision);
            this.entityOperForm.controls['SortCode'].setValue(this._data.SortCode);
            this.entityOperForm.controls['Remark'].setValue(this._data.Remark);
            this.entityOperForm.controls['PropertyType'].setValue(this._data.PropertyType);
        }
    }

    getFormControl(name) {
        return this.entityOperForm.controls[ name ];
    }

}

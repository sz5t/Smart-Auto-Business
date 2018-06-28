import {Component, Input, OnInit} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd';
import {CacheService} from '@delon/cache';

@Component({
  selector: 'app-type-operation',
  templateUrl: './type-operation.component.html',
})
export class TypeOperationComponent implements OnInit {

    typeOperForm: FormGroup;
    _data : any;
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
        if(!this.typeOperForm.valid)
            return;
            if(!this._data) this._data = {};
            this._data['Name'] =   this.typeOperForm.controls['Name'].value,
            this._data['Caption'] =  this.typeOperForm.controls['Caption'].value,
            this._data['BuildMode'] =  this.typeOperForm.controls['BuildMode'].value,
            this._data['Remark'] = this.typeOperForm.controls['Remark'].value,
            this._data['BuildState'] = this.typeOperForm.controls['BuildState'].value,
            this._data['DbObjState'] = this.typeOperForm.controls['DbObjState'].value,
            this._data['Enabled'] = this.typeOperForm.controls['Enableds'].value ? this.typeOperForm.controls['Enableds'].value : false,
        this.modal.destroy(this._data);
    }

    handleCancel(e) {
        this.modal.destroy();
    }


    _submitForm() {
        for (const i in this.typeOperForm.controls) {
            this.typeOperForm.controls[ i ].markAsDirty();
        }
    }

    ngOnInit() {
        this.typeOperForm = this.fb.group({
            Name     : [ null, [ Validators.required ] ],
            Caption : [ null, [ Validators.required ] ],
            BuildMode     : [ '手动' ],
            BuildState     : [ '正在定义'],
            DbObjState     : [ '未创建'],
            Remark   : [ null],
            Enableds    : [true]
        });
        if(this._data) {
            this.typeOperForm.controls['Name'].setValue(this._data.Name);
            this.typeOperForm.controls['Caption'].setValue(this._data.Caption);
            this.typeOperForm.controls['BuildMode'].setValue(this._data.BuildMode);
            this.typeOperForm.controls['BuildState'].setValue(this._data.BuildState);
            this.typeOperForm.controls['DbObjState'].setValue(this._data.DbObjState);
            this.typeOperForm.controls['Enableds'].setValue(this._data.Enabled);
            this.typeOperForm.controls['Remark'].setValue(this._data.Remark);
        }
    }

    getFormControl(name) {
        return this.typeOperForm.controls[ name ];
    }

}

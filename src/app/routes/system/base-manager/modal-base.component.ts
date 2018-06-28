import {Component, OnInit, Input} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {FormBuilder,  FormGroup, Validators} from '@angular/forms';
import {CacheService} from '@delon/cache';
import { NzModalRef } from 'ng-zorro-antd';
import {SysResource} from '@core/utility/sys-resource';


@Component({
  selector: 'app-modal-base',
  templateUrl: './modal-base.component.html'
})
export class ModalBaseComponent implements OnInit {

    data = SysResource.data;
    isVisible = false;
    iconFlag = null;
  validateForm: FormGroup;
    _name: any;
    _parentId: string;
    _tree: any;
    _ids: any[];
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
        // console.log(this.iconFlag);

    }

  constructor(
    private http: _HttpClient,
    private cacheService: CacheService,
    private fb: FormBuilder,
    private modal: NzModalRef) {

  }
  emitDataOutside($event) {

    if (!this.validateForm.valid)
      return;
    const data = {
      Children: null,
      ConfigData :  JSON.stringify({
        group: this.validateForm.controls['Group'].value ? this.validateForm.controls['Group'].value : false,
        link: this.validateForm.controls['Link'].value,
        icon: this.validateForm.controls['Icon'].value,
        ids : this._ids
      }),
      Name:   this.validateForm.controls['Name'].value,
      Order:  this.validateForm.controls['Order'].value,
      ParentId:  this._parentId,
      Remark: this.validateForm.controls['Remark'].value,
      ShareScope: 'Project'
    };

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
        Link     : [ null],
        Icon     : [ ],
        Remark   : [ null],
        Order    : [null, [ Validators.min(0)]],
      });
        this._tree = this.cacheService.getNone('ModuleTree');
        if (this._name !== '') {
          this.validateForm.controls['Name'].setValue(this._name.Name);
          this.validateForm.controls['Group'].setValue(JSON.parse(this._name.ConfigData).group);
          this.validateForm.controls['Link'].setValue(JSON.parse(this._name.ConfigData).link);
          // this.validateForm.controls['Icon'].setValue(JSON.parse(this._name.ConfigData).icon);
            this.iconFlag = JSON.parse(this._name.ConfigData).icon;
          this.validateForm.controls['Order'].setValue(this._name.Order);
          this.validateForm.controls['Remark'].setValue(this._name.Remark);
          this.values = JSON.parse(this._name.ConfigData).ids;
          this._ids = this.values;

        }
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  public onChanges(values: any) {
    this._parentId = values.pop();
  }

  public onSelectionChange(options: any) {
    this._ids = [];
    options.forEach( item => {
      this._ids.push({
        label: item.label,
        value: item.value
      });
    });
  }
}

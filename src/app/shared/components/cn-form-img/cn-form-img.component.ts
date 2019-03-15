import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-img',
  templateUrl: './cn-form-img.component.html',
  styleUrls: ['./cn-form-img.component.css']
})
export class CnFormImgComponent implements OnInit {
  @Input() public config;
  @Input() public formGroup: FormGroup;
  @Input() public value;


  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public initValue;
  @Input() private changeConfig;
  @Output() public updateValue = new EventEmitter();

  public _value;
  public bodyStyle = {
    width: '100 %',
    height: '50px'

  };
  constructor() { }

  public ngOnInit() {
    if (!this.value) {
      if (this.config.hasOwnProperty('defaultValue')) {
        this.value = this.config.defaultValue;
      }
    }
    //  this.value = 'http://192.168.1.111:8081/api.cfg/files/upload/2019-03-12/44bb4a6551dd4f3984d49c470ed5c07a.jpg'
    // console.log(this.value, this._value);
  }
  public valueChange(name?) {
    this.value.data = name;
    this.updateValue.emit(this.value);
  }

}

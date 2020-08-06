import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-tag',
  templateUrl: './cn-form-tag.component.html',
  styleUrls: ['./cn-form-tag.component.css']
})
export class CnFormTagComponent implements OnInit {
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
  tags=[];
  _tags=[];

  tagColor ='cyan';
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
    this.createTags(name);
  }


  public createTags(v?){

    let splitstr=',';
    if(this.config.hasOwnProperty('tagSplit')){
        splitstr =this.config['tagSplit']; 
    }
   let newTags = v.split(splitstr);
   this._tags = newTags;
   this.tags=[...newTags];
   
}


  sliceTagName(tag: string): string {

    let length =20;
    if(this.config.hasOwnProperty('tagContent')){
        if(this.config['tagContent']['ContentSubstr'] && this.config['tagContent']['ContentSubstr']){
            length = this.config['tagContent']['ContentSubstrlength'];
        }else{
            return tag;
        }
    }else{
        return tag;
    }
    const isLongTag = tag.length > length;
    return isLongTag ? `${tag.slice(0, length)}...` : tag;
  }

}

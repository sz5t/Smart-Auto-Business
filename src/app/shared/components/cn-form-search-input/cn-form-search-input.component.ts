import { CnFormHiddenComponent } from '@shared/components/cn-form-hidden/cn-form-hidden.component';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-search-input',
  templateUrl: './cn-form-search-input.component.html',
  styles: [
    `
    .anticon-close-circle {
      cursor: pointer;
      color: #ccc;
      transition: color 0.3s;
      font-size: 12px;
    }

    .anticon-close-circle:hover {
      color: #999;
    }

    .anticon-close-circle:active {
      color: #666;
    }  
    `
  ]
})
export class CnFormSearchInputComponent implements OnInit {
  @Input() public config;
  @Input() public formGroup: FormGroup;
  public valModel: any;
  public optionModel: any; 
  public hidValModel: any;
  public optionList: any[];

  @Output()
  public updateValue = new EventEmitter();
  constructor(
  ) { 
    
  }

  public setOP() {
    if (this.config.type === 'select') {
      const newOp = [
        { label: '等于', value: 'eq', select: true },
        { label: '不等于', value: 'neq', select: false },
        { label: '包含', value: 'in', select: false },
        { label: '不包含', value: 'nin', select: false },
      ];
      this.optionList = newOp;
    } else if (this.config.type === 'searchInput') {
      const newOp = [
        { label: '等于', value: 'eq', select: true },
        { label: '不等于', value: 'neq', select: false },
        { label: '部分一致', value: 'ctn', select: false },
        { label: '不属于', value: 'nctn', select: false },
        { label: '包含', value: 'in', select: false },
        { label: '不包含', value: 'nin', select: false },
      ];
      this.optionList = newOp;

    } else if (this.config.type === 'searchNumber') {
      const newOp = [
        { label: '等于', value: 'eq', select: true },
        { label: '大于', value: 'gt', select: false },
        { label: '小于', value: 'lt', select: false },
        { label: '大于等于', value: 'ge', select: false },
        { label: '小于等于', value: 'le', select: false },
      ];
      this.optionList = newOp;
    }
  }

  public ngOnInit() {
    this.setOP();
    this.optionModel = this.optionList[0].value;
  }

  public ngModelChange($event) {
    this.createSearchChange(this.valModel);
  }

  public valueChange($val) {
    this.createSearchChange($val);
  }

  public createSearchChange(inputValue?) {
    let strQ = '';
    if (!inputValue) {
      // return strQ;
    }
    switch (this.optionModel) {
      case 'eq': // =
        strQ = strQ + 'eq(' + inputValue + ')';
        break;
      case 'neq': // !=
        strQ = strQ + '!eq(' + inputValue + ')';
        break;
      case 'ctn': // like
        strQ = strQ + 'ctn(\'%' + inputValue + '%\')';
        break;
      case 'nctn': // not like
        strQ = strQ + '!ctn(\'%' + inputValue + '%\')';
        break;
      case 'in': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + 'in(' + inputValue + ')';
        break;
      case 'nin': // not in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + '!in(' + inputValue + ')';
        break;
      case 'btn': // between  
        strQ = strQ + 'btn(' + inputValue + ')';
        break;
      case 'ge': // >=  
        strQ = strQ + 'ge(' + inputValue + ')';
        break;
      case 'gt': // >  
        strQ = strQ + 'gt(' + inputValue + ')';
        break;
      case 'le': // <=  
        strQ = strQ + 'le(' + inputValue + ')';
        break;
      case 'lt': // <  
        strQ = strQ + 'lt(' + inputValue + ')';
        break;
      default:
        strQ = strQ + 'default(' + inputValue + ')';
        break;
    }
    if (!inputValue) {
      strQ = null;
    }
    this.hidValModel = strQ;
    // this.value.data = strQ;
    // this.updateValue.emit(this.hidValModel);
  }

  public createSearch() {

  }

  public onblur() {
    this.createSearch();

  }
  public async onKeyPress(e) {
    if (e.code === 'Enter') {
      this.createSearch();
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cn-grid-search,[cn-grid-search]',
  templateUrl: './cn-grid-search.component.html',
  styleUrls: ['./cn-grid-search.component.css']
})
export class CnGridSearchComponent implements OnInit {
  @Input() config;
  @Output() updateValue = new EventEmitter();
  @Input() value;
  @Input() casadeData;
  constructor() { }
  inputValue;
  AfterValue;

  searchType = 'input';
  ngOnInit() {
    this.AfterValue = 'eq';
  }

  // 查询条件配置 设计
  config_one = {
    searchEdit: {
      type: "search",
      field: "Id",
      options: {
        type: "search",
        labelSize: "6",
        controlSize: "18",
        inputType: "text",
        queryTerm: ['eq', 'ctn'],  // 适配条件
        defaultQueryTerm: 'eq', // 默认条件
        queryTermOptions: [
          { name: 'eq', options: { type: "input", labelSize: "6", controlSize: "18", inputType: "text" } },
          { name: 'ctn', options: { type: "input", labelSize: "6", controlSize: "18", inputType: "text" } }
        ]
      }
    }

  }


  AftervalueChange(v?) {

    // console.log('查询条件发生变化：', v, this.AfterValue);
    if (v === 'btn') {
      this.searchType = v;
    } else {
      this.searchType = 'input';
    }

    this.CreateSearch();
  }

  onblur() {
    // console.log('onblur：', this.inputValue);
    this.CreateSearch();

  }
  async onKeyPress(e) {
    if (e.code === 'Enter') {
      // console.log('Enter', this.inputValue);
      this.CreateSearch();
    }
  }

  CreateSearch() {
    let strQ = "";
    if (!this.inputValue) {
      return strQ;
    }
    switch (this.AfterValue) {
      case 'eq': // =
        strQ = strQ + "eq (" + this.inputValue + ")";
        break;
      case 'neq': // =
        strQ = strQ + "!eq (" + this.inputValue + ")";
        break;
      case 'ctn': // like
        strQ = strQ + "ctn('%" + this.inputValue + "%')";
        break;
      case 'nctn': // not like
        strQ = strQ + "!ctn('%" + this.inputValue + "%')";
        break;
      case 'in': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + "in(" + this.inputValue + ")";
        break;
      case 'nin': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + "!in(" + this.inputValue + ")";
        break;
      default:
        strQ = strQ + "default(" + this.inputValue + ")";
        break;
    }
    console.log('查询参数：', strQ);
    return strQ;

  }

  CreateSearchChange(inputValue?) {
    let strQ = "";
    if (!inputValue) {
      return strQ;
    }
    switch (this.AfterValue) {
      case 'eq': // =
        strQ = strQ + "eq (" + inputValue + ")";
        break;
      case 'neq': // =
        strQ = strQ + "!eq (" + inputValue + ")";
        break;
      case 'ctn': // like
        strQ = strQ + "ctn('%" + inputValue + "%')";
        break;
      case 'nctn': // not like
        strQ = strQ + "!ctn('%" + inputValue + "%')";
        break;
      case 'in': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + "in(" + inputValue + ")";
        break;
      case 'nin': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + "!in(" + inputValue + ")";
        break;
      default:
        strQ = strQ + "default(" + inputValue + ")";
        break;
    }
    console.log('查询参数：', strQ);
    return strQ;

  }
  // 触发条件，光标离开、回车、下拉选择触发
  tempValue;
  initData;
  rowData = { edit: true };
  dataSet;
  options = {
    type:
      "input",
    labelSize:
      "6",
    controlSize:
      "18",
    inputType:
      "text",
    disabled: false,
    readonly: null
  }
  valueChange(backdata?) {

    // 
    console.log('查询行返回', backdata);
    this.CreateSearchChange(backdata);

  }

  searchValue;

 
  onClick(name?) {
    console.log('onClick', name);

    const id = name.hostElement.nativeElement.id;
    // const index =   name.nzMenuDirective.menuItems.findIndex(
    //   item => item._selected === true
    // );
    const index = this.op.findIndex( item => item.value === id);
    const ck =  this.op[index].value;
    this.op.forEach(element => {
      element.select = false;
    });
    this.op[index].select = true;
    this.AfterValue = ck;
    if ( ck === 'btn') {
      this.searchType = ck;
    } else {
      this.searchType = 'input';
    }
    this.CreateSearch();
    console.log('最终选择：', ck, this.op);
  }
  op = [
    { lable: '=', value: 'eq', select: false },
    { lable: '!=', value: 'neq', select: false },
    { lable: '部分一致', value: 'ctn', select: false },
    { lable: '不属于', value: 'nctn', select: false },
    { lable: '包含', value: 'in', select: false },
    { lable: '不包含', value: 'nin', select: false },
    { lable: '范围', value: 'btn', select: false },
    { lable: '>=', value: 'ge', select: false },
    { lable: '>', value: 'gt', select: false },
    { lable: '<=', value: 'le', select: false },
    { lable: '<', value: 'lt', select: false } 
    // { lable: '自定义', value: 'zdy', select: false }
  ];

}

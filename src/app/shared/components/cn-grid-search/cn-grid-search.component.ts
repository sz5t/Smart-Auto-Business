import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cn-grid-search,[cn-grid-search]',
  templateUrl: './cn-grid-search.component.html',
  styleUrls: ['./cn-grid-search.component.css']
})
export class CnGridSearchComponent implements OnInit {

  constructor() { }
  inputValue;
  AfterValue;
  ngOnInit() {
    this.AfterValue = 'eq';
  }

  config_one = {
    searchEdit: {
      type: "input",
      field: "Id",
      options: {
        type: "input",
        labelSize: "6",
        controlSize: "18",
        inputType: "text",

        queryTerm: ['eq'],  // 适配条件
        defaultQueryTerm: 'eq', // 默认条件
      }
    }

  }


  AftervalueChange(v?) {

    console.log('查询条件发生变化：', v);

  }

  onblur() {
    console.log('onblur：', this.inputValue);


  }

  CreateSearch() {
    let strQ = "";
    switch (this.AfterValue) {
      case 'eq':
        strQ = strQ + "eq (" + this.inputValue + ")";
        break;

      default:
        break;
    }

  }

  // 触发条件，光标离开、回车、下拉选择触发

}

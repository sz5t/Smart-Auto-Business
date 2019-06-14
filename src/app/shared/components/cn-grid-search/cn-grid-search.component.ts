import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cn-grid-search,[cn-grid-search]',
  templateUrl: './cn-grid-search.component.html',
  styleUrls: ['./cn-grid-search.component.css']
})
export class CnGridSearchComponent implements OnInit {
  @Input()
  public searchConfigType;
  @Input()
  public config;
  @Input()
  public value;
  @Input()
  public rowData;
  @Input()
  public bsnData;
  @Input()
  public dataSet;
  @Input()
  public changeConfig;
  @Input()
  public initData;
  @Output()
  public updateValue = new EventEmitter();
  // 查询条件配置 设计
  public config_one = {
    searchEdit: {
      type: 'search',
      field: 'Id',
      options: {
        type: 'search',
        labelSize: '6',
        controlSize: '18',
        inputType: 'text',
        queryTerm: ['eq', 'ctn'],  // 适配条件
        defaultQueryTerm: 'eq', // 默认条件
        queryTermOptions: [
          { name: 'eq', options: { type: 'input', labelSize: '6', controlSize: '18', inputType: 'text' } },
          { name: 'ctn', options: { type: 'input', labelSize: '6', controlSize: '18', inputType: 'text' } }
        ]
      }
    }

  }
  public inputValue;
  public AfterValue;

  public searchType = 'input';

  public tempValue;
  // initData;
  // rowData = { edit: true };
  // dataSet;
  public options = {
    type: 'input',
    labelSize: '6',
    controlSize: '18',
    inputType: 'text',
    disabled: false,
    readonly: null
  }

  // 配置模板
  public liu = {
    title: '名称',
    field: 'name',
    width: 80,
    showFilter: false,
    showSort: false,
    editorAsSearch: true, // 是否启用editor 作为 查询框
    editor: {
      type: 'input',
      field: 'name',
      options: {
        type: 'input',
        labelSize: '6',
        controlSize: '18',
        inputType: 'text'
      }
    },
    searcheditor: {
      type: 'search',
      field: 'name',
      queryTerm: ['eq', 'ctn'],  // 适配条件
      defaultQueryTerm: 'eq', // 默认条件
      options: [
        {
          name: 'eq',
          type: 'input',
          field: 'name',
          options: {
            type: 'input',
            labelSize: '6',
            controlSize: '18',
            inputType: 'text'
          }
        },
        {
          name: 'ctn',
          type: 'input',
          field: 'name',
          options: {
            type: 'input',
            labelSize: '6',
            controlSize: '18',
            inputType: 'text'
          }
        }
      ]
    }
  }
  public op = [
    { lable: '等于', value: 'eq', select: true },
    { lable: '不等于', value: 'neq', select: false },
    { lable: '部分一致', value: 'ctn', select: false },
    { lable: '不属于', value: 'nctn', select: false },
    { lable: '包含', value: 'in', select: false },
    { lable: '不包含', value: 'nin', select: false },
    { lable: '范围', value: 'btn', select: false },
    { lable: '大于等于', value: 'ge', select: false },
    { lable: '大于', value: 'gt', select: false },
    { lable: '小于等于', value: 'le', select: false },
    { lable: '小于', value: 'lt', select: false }
    // { lable: '自定义', value: 'zdy', select: false }
  ];
  public searchValue;
  constructor() { }

  public ngOnInit() {
    if (this.searchConfigType) {
      if (this.searchConfigType === 'default') {
        this.config = {
          type: 'input',
          labelSize: '6',
          controlSize: '18',
          inputType: 'text'
        }
      }
    }
    this.setOP();  // 简析条件参数
    this.AfterValue = 'eq';
  }

  // 默认 Edit 简析操作条件
  // 下拉选中等， = ！= in not in  这四种
  // 文本 = ！= in not in like not like
  // 数值类型的 范围 = ！= in not in  btw
  // 时间类型的 = ！= in not in  btw
  public setOP() {

    if (this.config.type === 'select') {
      const newOp = [
        { lable: '等于', value: 'eq', select: true },
        { lable: '不等于', value: 'neq', select: false },
        { lable: '包含', value: 'in', select: false },
        { lable: '不包含', value: 'nin', select: false },
      ];
      this.op = newOp;
    } else if (this.config.type === 'input') {
      const newOp = [
        { lable: '等于', value: 'eq', select: true },
        { lable: '不等于', value: 'neq', select: false },
        { lable: '部分一致', value: 'ctn', select: false },
        { lable: '不属于', value: 'nctn', select: false },
        { lable: '包含', value: 'in', select: false },
        { lable: '不包含', value: 'nin', select: false },
      ];
      this.op = newOp;

    } else if (this.config.type === 'number') {
      const newOp = [
        { lable: '等于', value: 'eq', select: true },
        { lable: '不等于', value: 'neq', select: false },
        { lable: '范围', value: 'btn', select: false },
      ];
      this.op = newOp;
    }
  }




  public AftervalueChange(v?) {
    if (v === 'btn') {
      this.searchType = v;
    } else {
      this.searchType = 'input';
    }

    this.CreateSearch();
  }

  public onblur() {
    this.CreateSearch();

  }
  public async onKeyPress(e) {
    if (e.code === 'Enter') {
      this.CreateSearch();
    }
  }

  public CreateSearch() {
    let strQ = '';
    if (!this.inputValue) {
      return strQ;
    }
    switch (this.AfterValue) {
      case 'eq': // =
        strQ = strQ + 'eq (' + this.inputValue + ')';
        break;
      case 'neq': // =
        strQ = strQ + '!eq (' + this.inputValue + ')';
        break;
      case 'ctn': // like
        strQ = strQ + 'ctn(\'%' + this.inputValue + '%\')';
        break;
      case 'nctn': // not like
        strQ = strQ + '!ctn(\'%' + this.inputValue + '%\')';
        break;
      case 'in': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + 'in(' + this.inputValue + ')';
        break;
      case 'nin': // in  如果是input 是这样取值，其他则是多选取值
        strQ = strQ + '!in(' + this.inputValue + ')';
        break;
      default:
        strQ = strQ + 'default(' + this.inputValue + ')';
        break;
    }
    return strQ;

  }

  public CreateSearchChange(inputValue?) {
    let strQ = '';
    if (!inputValue) {
      // return strQ;
    }
    switch (this.AfterValue) {
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
    this.value.data = strQ;
    this.updateValue.emit(this.value);

  }
  // 触发条件，光标离开、回车、下拉选择触发

  public valueChange(backdata?) {
    let backvalue;
    if (this.isString(backdata)) {
      backvalue = backdata;
    } else {
      if (backdata === null) {
        backvalue = backdata;
      } else if (backdata.hasOwnProperty('data')) {
        backvalue = backdata.data;
      } else {
        backvalue = backdata;
      }
    }

    this.CreateSearchChange(backvalue);

  }
  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }



  public onClick(name?) {
    const id = name.elementRef.nativeElement.id;
    // const index =   name.nzMenuDirective.menuItems.findIndex(
    //   item => item._selected === true
    // );
    const index = this.op.findIndex(item => item.value === id);
    const ck = this.op[index].value;
    this.op.forEach(element => {
      element.select = false;
    });
    this.op[index].select = true;
    this.AfterValue = ck;
    if (ck === 'btn') {
      this.searchType = ck;
    } else {
      this.searchType = 'input';
    }
    this.CreateSearch();
    this.op = JSON.parse(JSON.stringify(this.op));
  }

}

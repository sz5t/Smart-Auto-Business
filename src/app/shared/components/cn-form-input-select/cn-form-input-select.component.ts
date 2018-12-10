import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-input-select,[cn-form-input-select]',
  templateUrl: './cn-form-input-select.component.html',
  styleUrls: ['./cn-form-input-select.component.css']
})
export class CnFormInputSelectComponent implements OnInit {

  constructor() { }

  public ngOnInit() {
  }



  // 文本值，可填、可选
  // 选则内容，树、树表、列表 基本需要这3种组件中取值
  
  // 场景描述：liu20181207
  // 1.文本框 内容，有一部分值是手动输入的，有一部分值是参考其他数据集来的
  // 2.点击参考，弹出表单
  // 3.表单内嵌3种组件 树、树表、列表 选中一条数据，将对应值回写到文本框内




}

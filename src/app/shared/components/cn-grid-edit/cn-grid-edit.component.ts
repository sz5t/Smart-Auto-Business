import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-grid-edit',
  templateUrl: './cn-grid-edit.component.html',
  styleUrls: ['./cn-grid-edit.component.css']
})
export class CnGridEditComponent implements OnInit {
  @Input() public searchConfigType;
  @Input() public config;
  @Input() public value;
  @Input() public rowData;
  @Input() public bsnData;
  @Input() public dataSet;
  @Input() public changeConfig;
  @Input() public initData;
  @Output() public updateValue = new EventEmitter();
  constructor() { }

  public ngOnInit() {
  }

  // 值返回
  public valueChange(name?) {
    this.value.data = name;
    this.updateValue.emit(this.value);
  }

}

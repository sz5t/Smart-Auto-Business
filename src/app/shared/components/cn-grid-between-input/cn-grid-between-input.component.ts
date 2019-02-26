import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cn-grid-between-input,[cn-grid-between-input]',
  templateUrl: './cn-grid-between-input.component.html',
  styleUrls: ['./cn-grid-between-input.component.css']
})
export class CnGridBetweenInputComponent implements OnInit {
  @Input() config;
  @Output() updateValue = new EventEmitter();
  @Input() value;
  @Input() casadeData;
  constructor() { }
  beginValue;
  endValue;
  ngOnInit() {
  }



  onblur(e?, type?) {
     this.assemblyValue();

  }
  onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
       this.assemblyValue();
    }
  }


  // 组装值

  assemblyValue() {
    let value = "";
    if (this.beginValue) {
      value = value + this.beginValue;
    }
    value = value + ',';
    if (this.endValue) {
      value = value + this.endValue;
    }

    if (!this.beginValue && !this.endValue) {
      value = null;
    }
   // console.log('组装值:' , value);
    this.updateValue.emit(value);
    return value;
  }


}

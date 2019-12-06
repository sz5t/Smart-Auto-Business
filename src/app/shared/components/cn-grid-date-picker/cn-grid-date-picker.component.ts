import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { getMonth, getDate, getHours, getMinutes, getSeconds, getMilliseconds } from 'date-fns';

@Component({
  selector: 'cn-grid-date-picker',
  templateUrl: './cn-grid-date-picker.component.html',
})
export class CnGridDatePickerComponent implements OnInit {
  @Input() config;
  @Input() value;
  @Output() updateValue = new EventEmitter();
  _value;
  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
    if (this.value)
      this._value = this.value.data;
  }

  setValue(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  valueChange(name?) {
    if (name) {
      let sj = name;
      if (typeof (name) === 'string') {
        sj = this.parserDate(name);
      }

      const bc = this.getDateFormat(sj, 'yyyy-MM-dd hh:mm:ss');
      if (this.value.data !== bc) {
        this.value.data = bc;
      }
    }
    // this.value.data = name;
    this.updateValue.emit(this.value);
  }


  public parserDate(date) {
    const t = Date.parse(date)
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, '/')))
    }
  }

  public getDateFormat(strDate: Date, fmt?) {
    // console.log('getDateFormat', strDate);
    const o = {
      'M+': getMonth(strDate) + 1, // 月份
      'd+': getDate(strDate), // 日
      'h+': getHours(strDate), // 小时
      'm+': getMinutes(strDate), // 分
      's+': getSeconds(strDate), // 秒
      'q+': Math.floor((getMonth(strDate) + 3) / 3), // 季度
      'S': getMilliseconds(strDate) // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (strDate.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;

  }
}

import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getMonth, getDate, getHours, getMinutes, getSeconds, getMilliseconds } from 'date-fns';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-year-picker',
    templateUrl: './cn-year-picker.component.html'
})
export class CnYearPickerComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input() public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public year = new Date();
    constructor() {}

    public ngOnInit() {
        this.value = this.getDateFormat(this.year, 'yyyy');
    }

    public ngAfterViewInit() {
        
    }

    public valueChange(v?) {
        if (v) {
          const sj = this.parserDate(v);
          if (this.year) {
            const _oldyear = this.getDateFormat(this.year, 'yyyy');
            const _newyear = this.getDateFormat(sj, 'yyyy');
            if (_oldyear !== _newyear) {
              this.year = sj;
            }
          } else {
            this.year = sj;
          }
      
     
        } else {
          this.year = null;
        }
    
        const backValue = { name: this.config.name, value: v};
        this.updateValue.emit(backValue);
    
      }

      public parserDate(date) {
        const t = Date.parse(date)
        if (!isNaN(t)) {
          return new Date(Date.parse(date.replace(/-/g, '/')))
        }
      }

    public changeYear(date: Date) {
        if (date) {
            const bc = this.getDateFormat(date, 'yyyy');
            if (this.value !== bc) {
              this.value = bc;
            }
          } else {
            this.value = null;
          }
        // this.year = getISOYear(date);
        // const backValue = { name: this.config.name, value: `${getISOYear(date)}` };
        // this.updateValue.emit(backValue);
    }

    public getDateFormat(strDate: Date, fmt?) {
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
        for (const k in o)
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        return fmt;
    
      }
}

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISOYear, getMonth, getISODay, getDate, getHours, getMinutes, getSeconds, getMilliseconds, getISOWeek, getISOWeeksInYear, getQuarter } from 'date-fns';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cn-date-picker',
    templateUrl: './cn-date-picker.component.html'
})
export class CnDatePickerComponent implements OnInit {
    @Input()
    public config;
    public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public date = new Date();
    public controlValue;
    constructor() { }

    public ngOnInit() {
       /*  if (!this.controlValue) {
            if (this.formGroup.value[this.config.name]) {
                this.value = this.formGroup.value[this.config.name];
            } else {
                const year = getISOYear(this.controlValue);
                const month = this.getNewDate(getMonth(this.controlValue) + 1);
                const date = this.getNewDate(getDate(this.controlValue));
                const hour = this.getNewDate(getHours(this.controlValue));
                const minute = this.getNewDate(getMinutes(this.controlValue));
                const second = this.getNewDate(getSeconds(this.controlValue));
                setTimeout(s => {
                    // this.controlValue = this.controlValue;
                    this.controlValue = `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                        }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                        }${' '}${hour}${':'}${minute}${':'}${second}`
                    this.value = `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                        }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                        }${' '}${hour}${':'}${minute}${':'}${second}`
                }, 0);
            }
        } */
        if (!this.controlValue) {
            if (this.formGroup.value[this.config.name]) {
                this.value = this.formGroup.value[this.config.name];
            } else {
                const newdate =  new Date();
                this.value  = this.getDateFormat(newdate, 'yyyy-MM-dd hh:mm:ss');
            }
        } 
   
     
       
    }

    public valueChange1(val?: Date) {
        if (val) {
            const year = getISOYear(val);
            const month = this.getNewDate(getMonth(val) + 1);
            const date = this.getNewDate(getDate(val));
            const hour = this.getNewDate(getHours(val));
            const minute = this.getNewDate(getMinutes(val));
            const second = this.getNewDate(getSeconds(val));
            const backValue = {
                name: this.config.name,
                value: `${year}${
                    this.config.sep1 ? this.config.sep1 : '-'
                    }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date
                    }${' '}${hour}${':'}${minute}${':'}${second}`
            };
            setTimeout(s => {
                this.value = backValue.value;
                this.updateValue.emit(backValue);
            }, 0)
        } else {
            // console.log(this.controlValue);
        }
    }

    public changeControlValue1(val) {
        this.controlValue = val;
        // console.log(this.config, this.controlValue);
        this.valueChange(this.controlValue);
    }

    public getNewDate(d: any) {
        if (d <= 9) {
            d = '0' + d;
        }
        return d;
    }



    public valueChange(result?: Date): void {
        // 选择日期
        //  console.log('日期 onChange: ', result, typeof (result));
        if (result) {
            let sj = result;
            if (typeof (result) === 'string') {
                sj = this.parserDate(result);
            }
            let bc;
            if (this.config.showHours) {
                bc = this.getDateFormat(sj, 'yyyy-MM-dd hh:mm:ss');
            } else {
                bc = this.getDateFormat(sj, 'yyyy-MM-dd');
            }
            if (this.value !== bc) {
                this.value = bc;
            }
        }

    }

    /**
     * 值变化（内部机制自动赋值）需要将值转化为可识别数据类型
     * @param v 
     */
    public changeControlValue(v?) {
        if (v) {
            const sj = this.parserDate(v);
            if (sj !== this.controlValue)
                this.controlValue = sj;
        } else {
            this.controlValue = null;
            // this.controlValue =  new Date();
            // if (typeof (this.controlValue) !== 'string') {
            //     v = this.getDateFormat(this.controlValue, 'yyyy-MM-dd');
            // }
        }
        const year = getISOYear(this.controlValue);
        const week = getISOWeek(this.controlValue);
        const weeks = getISOWeeksInYear(this.controlValue);
        const month = getMonth(this.controlValue) + 1;
        const quarter = getQuarter(this.controlValue);
        const item = { 'year': year, 'quarter': quarter, 'month': month, 'week': week, 'weeks': weeks, 'weekString': `${year}-${week}`, 'monthString': `${year}-${month}` };
        // console.log('多选值变化model=>data', v, this.controlValue, item);
        const backValue = { name: this.config.name, value: v, dataItem: item };
        setTimeout(s => {
           // this.value = backValue.value;
           
        }, 0)
        this.updateValue.emit(backValue);
        //    console.log('多选值变化model=>data', v, this.controlValue, item);
    }



    public parserDate(date) {
        const t = Date.parse(date)
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, '/')))
        }
    }
    // 字符串转日期格式，strDate要转为日期格式的字符串
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    // let time1 = new Date().Format("yyyy-MM-dd");
    // let time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
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

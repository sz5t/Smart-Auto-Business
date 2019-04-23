import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getISOYear, getMonth, getISODay, getDate } from 'date-fns';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cn-form-search-date-picker',
    templateUrl: './cn-form-search-date-picker.component.html'
})
export class CnFormSearchDatePickerComponent implements OnInit {
    @Input()
    public config;
    @Input()
    public value;
    @Output()
    public updateValue = new EventEmitter();
    public formGroup: FormGroup;
    public date = new Date();
    public controlValue: any;
    public valModel: any;
    public optionModel: any; 
    public hidValModel: any;
    public optionList: any[];

    
    constructor() {}

    public setOP() {
        const newOp = [
            { label: '等于', value: 'eq', select: true },
            { label: '大于', value: 'gt', select: false },
            { label: '小于', value: 'lt', select: false },
            { label: '大于等于', value: 'ge', select: false },
            { label: '小于等于', value: 'le', select: false },
          ];
          this.optionList = newOp;
      }

    public ngOnInit() {
        if (!this.valModel) {
            if (this.formGroup.value[this.config.name]) {
                this.value = this.formGroup.value[this.config.name];
            } else {
                const year = getISOYear(this.date);
                const month = this.getNewDate(getMonth(this.date) + 1);
                const date = this.getNewDate(getDate(this.date));
                setTimeout(s => {
                    
                    this.valModel = `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                    }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date}`
                    this.value =  `${year}${
                        this.config.sep1 ? this.config.sep1 : '-'
                    }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date}`
                }, 0);
            }
        }
        this.setOP();

        this.optionModel = this.optionList[0].value;

    }

    public valueChange(val?: Date) {
        if (val) {
            const year = getISOYear(this.date);
                const month = this.getNewDate(getMonth(val) + 1);
                const date = this.getNewDate(getDate(val));
            const backValue = {
                name: this.config.name,
                value: `${year}${
                    this.config.sep1 ? this.config.sep1 : '-'
                }${month}${this.config.sep1 ? this.config.sep1 : '-'}${date}`
            };
            setTimeout(s => {
                this.value = backValue.value;
                this.updateValue.emit(backValue);
            }, 0)
            
            
        }
    }

    public getNewDate(d: any) {
        if (d <= 9) {
            d = '0' + d;
        }
        return d;
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

    public ngModelChange($event) {
        this.createSearchChange(this.valModel);
    }
}

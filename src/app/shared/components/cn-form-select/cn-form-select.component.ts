import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-select',
  templateUrl: './cn-form-select.component.html',
})
export class CnFormSelectComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  formGroup: FormGroup;
  // @Output() updateValue = new EventEmitter();
  @Output() updateValue = new EventEmitter();
  _options = [];
  cascadeValue = {};
  // _selectedMultipleOption:any[];
  constructor(
    private apiService: ApiService
  ) { }
    _selectedOption;

  ngOnInit() {
    if (!this.config['multiple']) {
      this.config['multiple'] = 'default';
    }

    // console.log('select加载固定数据', this.config);
    if (this.config['cascadeValue']) {
      // cascadeValue
       for (const key in this.config['cascadeValue']) {
         if (this.config['cascadeValue'].hasOwnProperty(key)) {
          this. cascadeValue['cascadeValue'] = this.config['cascadeValue'][key];

         }
       }

    }

    this._options.length = 0;
    if (this.dataSet) {
      // 加载数据集
      this._options = this.dataSet;
      this.selectedByLoaded();
    } else if (this.config.ajaxConfig) {
      // 异步加载options
      (async () => {
        const result = await this.asyncLoadOptions(this.config.ajaxConfig);
        if (this.config.valueType && this.config.valueType === 'list') {
          const labels = this.config.labelName.split('.');
          const values = this.config.valueName.split('.');
          result.data.forEach(d => {
            d[this.config.valueName].forEach(v => {
              this._options.push({ label: v.ParameterName, value: v.ParameterName });
            });
          });
        } else {
          result.data.forEach(d => {
            this._options.push({ 'label': d[this.config.labelName], 'value': d[this.config.valueName] });
          });
        }
        this.selectedByLoaded();
      })();
    } else {

      // 加载固定数据
      this._options = this.config.options;
      this.selectedByLoaded();
    }

  }

  ngOnChanges() {
    // console.log('select加载固定数据ngOnChanges', this.config);
   // console.log('变化时临时参数' , this.bsnData);
  }
  ngAfterViewInit() {

  }

  async asyncLoadOptions(p?, componentValue?, type?) {
    // console.log('select load 异步加载'); // liu
    const params = {
    };
    let tag = true;
    let url;
    if (p) {
      p.params.forEach(param => {
        if (param.type === 'tempValue') {
          if (type) {
            if (type === 'load') {
              if (this.bsnData[param.valueName]) {
                params[param.name] = this.bsnData[param.valueName];
              } else {
                // console.log('参数不全不能加载');
                tag = false;
                return;
              }
            } else {
              params[param.name] = this.bsnData[param.valueName];
            }
          } else {
            if (this.bsnData && this.bsnData[param.valueName]) { // liu 参数非空判断
              params[param.name] = this.bsnData[param.valueName];
            }
          }

        } else if (param.type === 'value') {

          params[param.name] = param.value;

        } else if (param.type === 'componentValue') {
          params[param.name] = componentValue[param.valueName];
        } else if (param.type === 'cascadeValue') {
          params[param.name] = this.cascadeValue[param.valueName];

        }
      });
      if (this.isString(p.url)) {
        url = p.url;
      } else {
        let pc = 'null';
        p.url.params.forEach(param => {
          if (param['type'] === 'value') {
            pc = param.value;
          } else if (param.type === 'componentValue') {
            pc = componentValue[param.valueName];
          } else if (param.type === 'tempValue') {
            pc = this.bsnData[param.valueName];
          }
        });

        url = p.url['parent'] + '/' + pc + '/' + p.url['child'];
      }
    }
    if (p.ajaxType === 'get' && tag) {
      // console.log('get参数', params);
      /*  const dd=await this._http.getProj(APIResource[p.url], params).toPromise();
       if (dd && dd.Status === 200) {
       console.log("服务器返回执行成功返回",dd.Data);
       }
       console.log("服务器返回",dd); */

      return this.apiService.getProj(url, params).toPromise();
    }
    // else if (p.ajaxType === 'put') {
    //   console.log('put参数', params);
    //   return this.apiService.putProj(url, params).toPromise();
    // } else if (p.ajaxType === 'post') {
    //   console.log('post参数', params);
    //   console.log(url);
    //   return this.apiService.postProj(url, params).toPromise();
    // } else {
    //   return null;
    // }
  }

  selectedByLoaded() {
      let selected;
      if (!this.value) {
          this.value = this.config.defaultValue;
      }
      if (this.value && this.value.data) {
          this._options.forEach(element => {
              if (element.value === this.value.data) {
                  selected = element;
              }
          });

      } else {
          this._options.forEach((element => {
              if (element.value === this.config.defaultValue) {
                  selected = element;
              }
          }));
      }

      this._selectedOption = selected;
  }

  valueChange(name?) {
    if (name) {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
    }

  }

  isString(obj) { // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }
}

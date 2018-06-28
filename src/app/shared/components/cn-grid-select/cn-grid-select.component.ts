import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';

@Component({
  selector: 'cn-grid-select',
  templateUrl: './cn-grid-select.component.html',
})
export class CnGridSelectComponent implements OnInit {
  @Input() config;
  @Input() value;
  @Input() bsnData;
  @Input() rowData;
  @Input() dataSet;
  @Output() updateValue = new EventEmitter();
  _options = [];
  // _selectedMultipleOption:any[];
  constructor(
    private apiService: ApiService
  ) { }
  _selectedMultipleOption;

  async ngOnInit() {
    if (this.dataSet) {
      // 加载数据集
      this._options = this.dataSet;
    } else if (this.config.ajaxConfig) {
      // 异步加载options
      const result = await this.asyncLoadOptions(this.config.ajaxConfig);
      if (this.config.valueType && this.config.valueType === 'list') {
        const labels = this.config.labelName.split('.');
        const values = this.config.valueName.split('.');
        result.Data.forEach(d => {
          d[this.config.valueName].forEach(v => {
            this._options.push({ label: v.ParameterName, value: v.ParameterName });
          });
        });
      } else {
        result.Data.forEach(d => {
          this._options.push({ 'label': d[this.config.labelName], 'value': d[this.config.valueName] });
        });
      }

    } else {
      // 加载固定数据
      this._options = this.config.options;
    }
    this.selectedByLoaded();
  }

  async asyncLoadOptions(p?, componentValue?, type?) {
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
            params[param.name] = this.bsnData[param.valueName];
          }

        } else if (param.type === 'value') {

          params[param.name] = param.value;

        } else if (param.type === 'componentValue') {
          params[param.name] = componentValue[param.valueName];
        }
      });
     
      if (this.isString(p.url)) {
        url = APIResource[p.url];
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

        url = APIResource[p.url['parent']] + '/' + pc + '/' + APIResource[p.url['child']];
      }
    }
    if (p.ajaxType === 'get' && tag) {
    
      /*  const dd=await this._http.getProj(APIResource[p.url], params).toPromise();
       if (dd && dd.Status === 200) {
       console.log("服务器返回执行成功返回",dd.Data);
       }
       console.log("服务器返回",dd); */

      return this.apiService.getProj(url, params).toPromise();
    } else if (p.ajaxType === 'put') {
      // console.log('put参数', params);
      return this.apiService.putProj(url, params).toPromise();
    } else if (p.ajaxType === 'post') {
      // console.log('post参数', params);
      return this.apiService.postProj(url, params).toPromise();
    } else {
      return null;
    }
  }

  selectedByLoaded() {
    if (this.value) {
      let selected;
      this._options.forEach(element => {
        if (element.value === this.value.data) {
          selected = element;
        }
      });
      this._selectedMultipleOption = selected;
    }
  }

  valueChange(name?) {
    if (name) {
      this.value.data = name.value;
      this.updateValue.emit(this.value);
    } else {
      this.value.data = null;
      this.updateValue.emit(this.value);
    }

  }

  isString(obj) { // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

}

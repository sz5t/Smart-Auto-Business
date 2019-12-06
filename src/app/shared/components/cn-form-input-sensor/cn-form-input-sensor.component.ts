import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'cn-form-input-sensor',
  templateUrl: './cn-form-input-sensor.component.html',
  styles: [
    `
    .anticon-close-circle {
      cursor: pointer;
      color: #ccc;
      transition: color 0.3s;
      font-size: 12px;
    }

    .anticon-close-circle:hover {
      color: #999;
    }

    .anticon-close-circle:active {
      color: #666;
    }
    `
  ]
})
export class CnFormInputSensorComponent implements OnInit {
  @Input() public config;
  @Input() public formGroup: FormGroup;
  @Output()
  public updateValue = new EventEmitter();
  public selectoptions = [];
  public select;
  public model;
  public isEQUIPMENT = false;
  constructor(private apiService: ApiService,
    private cacheService: CacheService
  ) { }

  public async ngOnInit() {
    if (!this.config['disabled']) {
      this.config['disabled'] = false;
    }
    if (!this.config['readonly']) {
      this.config['readonly'] = false;
    }

    const ajaxConfig = {
      url: 'common/getEquipment',
      ajaxType: 'get',
      params: [
        {
          'name': 'typeCode',
          'type': 'value',
          'value': this.config['Equipment']
        },
        {
          'name': 'clientIp',
          'type': 'cacheValue',
          'valueName': 'loginIp'
        }
      ]
    }

    this.selectoptions = await this.load(ajaxConfig);
    this.select = this.selectoptions[0].value;
    this.getData(this.select);
  }



  public valueChange(name?) {
    const backValue = { name: this.config.name, value: name };
    this.updateValue.emit(backValue);
  }

  public changeEquiment(select) {
    this.getData(select);
  }

  public onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
      //  console.log('Enter', type, 'beginValue', this.beginValue, 'endValue', this.endValue);
      this.assemblyValue();
    }
  }

  public onblur(e?, type?) {
    // console.log('onblur：', type, 'beginValue', this.beginValue, 'endValue', this.endValue);
    this.assemblyValue();

  }

  // 组装值
  public assemblyValue() {
    this.valueChange(this.model);
  }

  public getData(select) {
    const that = this;
    let wsconfig;
    this.selectoptions.forEach(element => {
      console.log(element);
      if (element['value'] === select) {
        console.log('select', select)
        wsconfig = element['wsconfig'];
        const ws = new WebSocket(wsconfig);
        ws.onopen = () => {
          console.log('send message');
          ws.send('ReadData1');
        }
        ws.onmessage = (evt) => {
          const data: string = evt.data;
          console.log('已经接收到数据', data);
          // 获取第一组数据

          // 获取温度
          if (that.config.valueFrom && that.config.valueFrom === 't') {
            this.model = data.split(';')[2].split('=')[1];
          } else if (this.config.valueFrom && this.config.valueFrom === 'h') { // 获取湿度
            this.model = data.split(';')[1].split('=')[1];
          }

        }
        ws.onclose = () => {
          console.log('连接已经关闭');
        }
      }
    });

  }

  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  public async load(ajaxConfig) {
    let m = [{ name: '未找到设备', value: '0' }];
    const url = this._buildURL(ajaxConfig.url);
    const params = {
      ...this._buildParameters(ajaxConfig.params)
    };
    const loadData = await this._load(url, params);
    if (loadData && loadData.status === 200 && loadData.isSuccess) {
      if (loadData.data.length > 0) {
        loadData.data.forEach(element => {
          element['value'] = element['Id'];
          element['name'] = element['name'];
          element['wsconfig'] = 'ws://' + element['webSocketIp'] + ':' + element['webSocketPort'] + '/' + element['connEntry'];
        });
        m = loadData.data;
        this.isEQUIPMENT = true;
      }
    }
    return m;
  }
  private async _load(url, params) {
    return this.apiService.get(url, params).toPromise();
  }
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this.isString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }
  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        cacheValue: this.cacheService
      });
    }
    return params;
  }

}

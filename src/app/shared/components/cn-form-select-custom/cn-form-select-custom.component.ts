import { Component, OnInit, Input, Output, EventEmitter, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { NzModalService } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
const component: { [type: string]: Type<any> } = {
  layout: LayoutResolverComponent
};
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-form-select-custom',
  templateUrl: './cn-form-select-custom.component.html',
  styleUrls: ['./cn-form-select-custom.component.css']
})
export class CnFormSelectCustomComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData;
  @Input() public changeConfig;
  @Input() public initValue;
  @Output() public updateValue = new EventEmitter();
  public formGroup: FormGroup;
  public resultData;
  public cascadeValue = {};
  public cascadeSetValue = {};

  public isVisible = false;
  public isConfirmLoading = false;
  public _value;
  public _valuetext;
  public permissions = [];

  public selectedValue;
  constructor(private modalService: NzModalService,
    private _http: ApiService
  ) {
    super();
    this.apiResource = this._http;
    // this.baseMessage = this._message;
    this.baseModal = this.modalService;
    //  this.cacheValue = this.cacheService;
  }

  public ngOnInit() {
    if (this.casadeData) {
      for (const key in this.casadeData) {
        // 临时变量的整理
        if (key === 'cascadeValue') {
          for (const casekey in this.casadeData['cascadeValue']) {
            if (this.casadeData['cascadeValue'].hasOwnProperty(casekey)) {
              this.cascadeValue[casekey] = this.casadeData['cascadeValue'][casekey];
            }
          }
        } else if (key === 'options') {
          // 目前版本，静态数据集 优先级低
          this.config['options'] = this.casadeData['options'];
        } else if (key === 'setValue') {
          this.cascadeSetValue['setValue'] = JSON.parse(JSON.stringify(this.casadeData['setValue']));
          delete this.casadeData['setValue'];
        }
      }
    }
    if (!this.config.labelName) {
      this.config.labelName = 'name';
    }
    if (!this.config.valueName) {
      this.config.valueName = 'Id';
    }

          // 未知是否有错误
          if (!this._value) {
            if (this.formGroup.value[this.config.name]) {
                this._value = this.formGroup.value[this.config.name];
            } else {
                if (this.config.hasOwnProperty('defaultValue')) {
                    this._value = this.config.defaultValue;
                }
            }
        }

  }
  public async asyncLoadOptions(p?, componentValue?, type?) {

    const params = {};
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

                tag = false;
                return;
              }
            } else {
              params[param.name] = this.bsnData[param.valueName];
            }
          } else {
            if (this.bsnData && this.bsnData[param.valueName]) {
              // liu 参数非空判断
              params[param.name] = this.bsnData[param.valueName];
            }
          }
        } else if (param.type === 'value') {
          params[param.name] = param.value;
        } else if (param.type === 'componentValue') {
          params[param.name] = componentValue[param.valueName];
        } else if (param.type === 'cascadeValue') {
          params[param.name] = this.cascadeValue[param.valueName];
        } else if (param.type === 'initValue') {
          params[param.name] = this.initValue[param.valueName];
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
      /*  const dd=await this._http.getProj(APIResource[p.url], params).toPromise();
 if (dd && dd.Status === 200) {

 }
*/

      return this._http.get(url, params).toPromise();
    } else if (p.ajaxType === 'put') {

      return this._http.put(url, params).toPromise();
    } else if (p.ajaxType === 'post') {

      return this._http.post(url, params).toPromise();
    } else {
      return null;
    }
  }
  public showLayout() {
    const dialog = this.config.dialog;
    //  {
    //   layoutName: 'liu',
    //   title: '自由弹出页面',
    //   width: '800px',
    //   buttons: [
    //     {
    //       name: 'ok',
    //       text: '确定',
    //       type: 'default'
    //     },
    //     {
    //       name: 'close',
    //       text: '关闭',
    //       type: 'default'
    //     }
    //   ]
    // };
    const footer = [];
    this._http.getLocalData(dialog.layoutName).subscribe(data => {
      // const selectedRow = this._selectRow ? this._selectRow : {};
      //  const tmpValue = this.tempValue ? this.tempValue : {};
      const modal = this.baseModal.create({
        nzTitle: dialog.title,
        nzWidth: dialog.width,
        nzContent: component['layout'],
        nzComponentParams: {
          permissions: this.permissions,
          config: data,
          initData: { ...this.bsnData, ...this.initValue} // ...tmpValue, ...selectedRow
        },
        nzFooter: footer
      });
      if (dialog.buttons) {
        dialog.buttons.forEach(btn => {
          const button = {};
          button['label'] = btn.text;
          button['type'] = btn.type ? btn.type : 'default';
          button['show'] = true;
          button['onClick'] = componentInstance => {
            if (btn['name'] === 'save') {
              (async () => {
                const result = await componentInstance.buttonAction(
                  btn,
                  () => {
                    modal.close();
                    // todo: 操作完成当前数据后需要定位
                    //  this.load();
                    //  this.sendCascadeMessage();
                  }
                );
              })();
            } else if (btn['name'] === 'saveAndKeep') {
              (async () => {
                const result = await componentInstance.buttonAction(
                  btn,
                  () => {
                    // todo: 操作完成当前数据后需要定位
                    //  this.load();
                    //  this.sendCascadeMessage();
                  }
                );
                if (result) {

                }
              })();
            } else if (btn['name'] === 'close') {
              modal.close();
              // this.load();
              // this.sendCascadeMessage();
            } else if (btn['name'] === 'reset') {
              //  this._resetForm(componentInstance);
            } else if (btn['name'] === 'ok') {
              const labelName = this.config.labelName ? this.config.labelName : 'name';
              const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
              if (componentInstance.value) {
                this._valuetext = componentInstance.value[labelName];
                this.selectedValue = componentInstance.value;
               // this.valueChange(this._valuetext, this.selectedValue);
                this.valueChange(componentInstance.value[valueName], this.selectedValue );
              }

              modal.close();
              //  this.load();
              //  this.sendCascadeMessage();
              //
            }
          };
          footer.push(button);
        });
      }
    });
  }

  public async valueChange(name?, dataItemValue?) {


    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    if (name) {
      const backValue = { name: this.config.name, value: name };
      if (dataItemValue) {
        backValue['dataItem'] = dataItemValue;
      } else {
        let selectrowdata = {};
        const componentvalue = this.formGroup.value;
        componentvalue[valueName] = name;
        const loadData = await this.asyncLoadOptions(this.config.ajaxConfig, componentvalue);

        if (loadData && loadData.status === 200 && loadData.isSuccess) {
          if (loadData.data) {
            if (loadData.data.length > 0) {
              selectrowdata = loadData.data[0];
            }
          }
        }
        if (selectrowdata.hasOwnProperty(labelName)) {
          this._valuetext = selectrowdata[labelName];
        } else {
          this._valuetext = this._value;
        }
        backValue['dataItem'] = selectrowdata;
      }
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);

    }
  }
  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

}

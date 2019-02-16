import { Component, OnInit, Input, Output, EventEmitter, Type } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { NzModalService } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
const component: { [type: string]: Type<any> } = {
  layout: LayoutResolverComponent
};
@Component({
  selector: 'cn-grid-select-custom-multiple',
  templateUrl: './cn-grid-select-custom-multiple.component.html',
  styleUrls: ['./cn-grid-select-custom-multiple.component.css']
})
export class CnGridSelectCustomMultipleComponent  extends CnComponentBase  implements OnInit {

  @Input() public config;
  @Input() public value;
  @Input() public bsnData;
  @Input() public rowData;
  @Input() public dataSet;
  @Input() public casadeData;
  @Input() public changeConfig;
  @Output() public updateValue = new EventEmitter();

  public resultData;
  public cascadeValue = {};
  public cascadeSetValue = {};

  public isVisible = false;
  public isConfirmLoading = false;
  public _value;
  public _valuetext;
  public permissions = [];
  public tags = [];

  public selectedValue;
  constructor(private modalService: NzModalService,
    private _http: ApiService) {
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
  }

  public handleClosetag(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    this.getMultipleValue();
    this.valueChange(this._value);
  }

  public sliceTagName(tag: any): string {
    const isLongTag = tag['label'].length > 20;
    return isLongTag ? `${tag['label'].slice(0, 20)}...` : tag['label'];
  }

  // 获取多选文本值
  public getMultipleValue() {
    let labels = '';
    let values = '';
    this.tags.forEach(element => {
      labels = labels + element.label + ',';
      values = values + element.value + ',';
    });
    if (labels.length > 0) {
      this._valuetext = this._valuetext.substring(0, labels.length - 1);
    } else {
      this._valuetext = null;
    }
    if (values.length > 0) {
      this._value = this._value.substring(0, values.length - 1);
    } else {
      this._value = null;
    }
  }
  public getMultipleTags(dlist?) {
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    dlist.forEach(data => {
      const b_lable = data[labelName];
      const b_value = data[valueName]; // 取值时动态读取的
      const newobj = { label: b_lable, value: b_value };

      let isInsert = true;
      this.tags.forEach(element => {
        if (element.value === b_value) {
          isInsert = false;
        }
      });
      if (newobj && isInsert) {
        this.tags.push(newobj);
      }
    });

  }
  public async asyncLoadOptions(p?, componentValue?, type?) {
    // console.log('select load 异步加载', componentValue); // liu
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
                // console.log('参数不全不能加载');
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
 console.log("服务器返回执行成功返回",dd.Data);
 }
 console.log("服务器返回",dd); */

      return this._http.get(url, params).toPromise();
    } else if (p.ajaxType === 'put') {
      console.log('put参数', params);
      return this._http.put(url, params).toPromise();
    } else if (p.ajaxType === 'post') {
      console.log('post参数', params);
      console.log(url);
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
      const layoutTag = { ROW: this.tags };
      const modal = this.baseModal.create({
        nzTitle: dialog.title,
        nzWidth: dialog.width,
        nzContent: component['layout'],
        nzComponentParams: {
          permissions: this.permissions,
          config: data,
          initData: {...layoutTag, ...this.rowData, ...this.initValue} // ...tmpValue, ...selectedRow
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
              // console.log('ok');
             //  console.log(componentInstance.value);
              const labelName = this.config.labelName ? this.config.labelName : 'name';
              const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
              //  this.tags = [{ label: componentInstance.value[labelName], value: componentInstance.value[valueName] }];
              if (componentInstance.value) {
                this.tags = componentInstance.value;
                this.selectedValue = componentInstance.value;
                let labels = '';
                let values = '';
                this.tags.forEach(element => {
                  labels = labels + element.label + ',';
                  values = values + element.value + ',';
                });
                this._valuetext = labels;
                this._value = values;
                if (this._valuetext.length > 0) {
                  this._valuetext = this._valuetext.substring(0, this._valuetext.length - 1);
                }
                if (this._value.length > 0) {
                  this._value = this._value.substring(0, this._value.length - 1);
                }
                // this.valueChange(this._valuetext, this.selectedValue);
                this.valueChange(componentInstance.value[valueName]);
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
   // console.log('valueChangeSelectGridMultiple', name);

    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    if (name) {
      this.value.data = name;
      // 将当前下拉列表查询的所有数据传递到bsnTable组件，bsnTable处理如何及联
      // console.log('this.resultData:', this.resultData);
      if (this.tags) {
        // valueName
        const index = this.tags.length;
        if (this.tags) {
          if (index > 0) {
            this.getMultipleValue();
          } else {
            // 取值
            const componentvalue = {};
            componentvalue[valueName] = name;
            if (this.config.ajaxConfig) {
              const loadData = await this.asyncLoadOptions(this.config.ajaxConfig, componentvalue);
              // console.log('自定义数据：', loadData);
              let selectrowdata = [];
              if (loadData && loadData.status === 200 && loadData.isSuccess) {
                if (loadData.data) {
                  if (loadData.data.length > 0) {
                    selectrowdata = loadData.data;
                  }
                }
              }
              this.getMultipleTags(selectrowdata);
              this.getMultipleValue();

            } else {
              this._valuetext = this._value;
            }
            // console.log('loadByselect: ',  backselectdata) ;
          }
        }

        // console.log('iftrue弹出表格返回数据', backValue);
      }
      // this.value['dataText'] = this._valuetext;
     // console.log('iftrue弹出表格返回数据', this.value);
      this.updateValue.emit(this.value);
    } else {
      this.value.data = null;
      this.updateValue.emit( this.value);
      // console.log('iffalse弹出表格返回数据', backValue);
    }
  }

  public isString(obj) {
    // 判断对象是否是字符串
    return Object.prototype.toString.call(obj) === '[object String]';
  }

}

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage } from '@core/relative-Service/BsnTableStatus';
import { Subscription, Observable } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';

@Component({
  selector: 'bsn-tag',
  templateUrl: './bsn-tag.component.html',
  styleUrls: ['./bsn-tag.component.css']
})
export class BsnTagComponent extends CnComponentBase implements OnInit, OnDestroy {
  @Input() public config; // dataTables 的配置参数
  @Input() public permissions = [];
  @Input() public dataList = []; // 表格数据集合
  @Input() public initData;
  @Input() public casadeData; // 级联配置 liu 20181023
  @Input() public value;
  @Input() public bsnData;
  @Input() public ref;
  @Output() public updateValue = new EventEmitter();
  public cascadeValue = {}; // 级联数据
  public tags: any;
  public _cascadeSubscription: Subscription;
  public is_Selectgrid = true;
  public _valuetext;
  public _value;
  constructor(
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>,
    private cacheService: CacheService,
    private _http: ApiService
  ) {
    super();
  }

  public ngOnInit() {
    if (this.initData) {
      if (this.initData['ROW']) {
        this.tags = this.initData['ROW'];
      }
    }
    if (this.config.ajaxConfig.url) {
      this.load(); // 自加载
    }
    // this.tags = [
    //   { label: '测试01' },
    //   { label: '测试02' },
    //   { label: '测试03' },
    //   { label: '测试04' },
    //   { label: '测试05' },
    //   { label: '测试06' }
    // ]

    if (this.config.isSelectGrid) {
      this.is_Selectgrid = false;
    }
    this.resolverRelation();
  }
  public handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    // this.getMultipleValue();
    // this.valueChange(this._value);
    if (this.config.delConfig) {
      this.del(removedTag);
    }
    this.valueChange();
  }
  public sliceTagName(tag: any): string {
    const isLongTag = tag['label'].length > 20;
    return isLongTag ? `${tag['label'].slice(0, 20)}...` : tag['label'];
  }

  public addTag(data?) {

    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    if (data) {
      const tagsItem = { label: data[labelName], value: data[valueName] };
      let isAdd = true;
      this.tags.forEach(element => {
        if (element.value === tagsItem.value) {
          isAdd = false;
        }
      });
      if (isAdd) {
        this.tags.push(tagsItem);
        this.valueChange();

      }
    }

  }

  public valueChange() {
    if (!this.is_Selectgrid) {
      // console.log(' tags 值变化返回给layout', this.tags);
      // liu 20181210
      this.updateValue.emit(this.tags);
    }

  }

  private resolverRelation() {

    if (
      this.config.componentType && this.config.componentType.child === true
    ) {
      this._cascadeSubscription = this.cascadeEvents.subscribe(
        cascadeEvent => {
          // 解析子表消息配置
          if (this.config.relations && this.config.relations.length > 0) {
            this.config.relations.forEach(relation => {
              if (relation.relationViewId === cascadeEvent._viewId) {
                // 获取当前设置的级联的模式
                const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode];
                // 获取传递的消息数据
                const option = cascadeEvent.option;
                if (option) {
                  // 解析参数
                  if (relation.params && relation.params.length > 0) {
                    relation.params.forEach(param => {
                      if (!this.tempValue) {
                        this.tempValue = {};
                      }
                      this.tempValue[param['cid']] = option.data[param['pid']];
                    });
                  }
                }
                  console.log('********接收*********', option);
                // 匹配及联模式
                switch (mode) {
                  case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                    this.addTag(option.data['ROW']);
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                    this.load();
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.RELOAD:
                    this.load();
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                    this.load();
                    break;
                  case BSN_COMPONENT_CASCADE_MODES.Scan_Code_ROW:
                    this.scanCodeROW();
                    break;

                }
              }
            });
          }
        }
      );
    }
  }
  public scanCodeROW() {

    //  console.log('_ScanCode', this.tempValue['_ScanCode']);
    this.scanCodeaddRow();
  }


  public scanCodeaddRow() {
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    //  'judge':{'name':'_ScanCodeObject'},
    const _ScanCode = '_ScanCode';
    if (this.tempValue[_ScanCode]) {
      if (this.tempValue[_ScanCode].length <= 0) {
        //  this._message.info('扫码没有匹配到数据！');
        return true;
      }
    }
    this.add();
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
  public async load() {
    this.tags = [];
    const url = this._buildURL(this.config.ajaxConfig.url);
    const params = {
      ...this._buildParameters(this.config.ajaxConfig.params)
    };
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    const aloadData = await this[this.config.ajaxConfig.ajaxType ? this.config.ajaxConfig.ajaxType : 'get'](url, params);
    if (aloadData && aloadData.status === 200 && aloadData.isSuccess) {
      aloadData.data.forEach(element => {
        const rowContentNew = { label: element[labelName], value: element[valueName] };
        let isAdd = true;
        this.tags.forEach(tag => {
          if (tag.value === rowContentNew.value) {
            isAdd = false;
          }
        });
        if (isAdd) {
          this.tags.push(rowContentNew);
          this.valueChange();

        }
      });
    }
  }
  public async add() {
    this.tags = [];
    const url = this._buildURL(this.config.addConfig.url);
    const params = {
      ...this._buildParameters(this.config.addConfig.params)
    };
    console.log('add:', params, this.tempValue);
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    const aloadData = await this[this.config.addConfig.ajaxType ? this.config.addConfig.ajaxType : 'post'](url, params);
    if (aloadData && aloadData.status === 200 && aloadData.isSuccess) {
      this.load();
    }
  }

  public async del(componentValue?) {
    this.tags = [];
    const url = this._buildURL(this.config.delConfig.url);
    const params = {
      ...this._buildParameters(this.config.delConfig.params, componentValue)
    };
    const labelName = this.config.labelName ? this.config.labelName : 'name';
    const valueName = this.config['valueName'] ? this.config['valueName'] : 'Id';
    const aloadData = await this[this.config.delConfig.ajaxType ? this.config.delConfig.ajaxType : 'del'](url, params);
    if (aloadData && aloadData.status === 200 && aloadData.isSuccess) {
      this.load();
    }
  }


  private async post(url, body) {
    return this._http.post(url, body).toPromise();
  }

  private async put(url, body) {
    return this._http.put(url, body).toPromise();
  }

  private async delete(url, params) {
    return this._http.delete(url, params).toPromise();
  }

  private async get(url, params) {
    return this._http.get(url, params).toPromise();
  }
  /**
 * 构建URL
 * @param ajaxUrl
 * @returns {string}
 * @private
 */
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }
  /**
   * 处理URL格式
   * @param url
   * @returns {boolean}
   * @private
   */
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }

  /**
 * 构建URL参数
 * @param paramsConfig
 * @returns {{}}
 * @private
 */
  private _buildParameters(paramsConfig, componentValue?) {
    let params = {};
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        componentValue: componentValue,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheService,
        cascadeValue: this.cascadeValue
      });
    }
    return params;
  }
  public ngOnDestroy() {

    if (this._cascadeSubscription) {
      this._cascadeSubscription.unsubscribe();
    }
  }
}

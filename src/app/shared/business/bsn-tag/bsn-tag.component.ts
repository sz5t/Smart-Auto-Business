import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage } from '@core/relative-Service/BsnTableStatus';
import { Subscription, Observable } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';

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
  public tags: any;
  public is_Selectgrid = true;
  public _cascadeSubscription: Subscription;
  constructor(@Inject(BSN_COMPONENT_CASCADE)
  private cascadeEvents: Observable<BsnComponentMessage>) {
    super();
  }

  public ngOnInit() {
    if (this.initData) {
      if (this.initData['ROW']) {
        this.tags = this.initData['ROW'];
      }
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
              //  console.log('********接收*********', option);
                // 匹配及联模式
                switch (mode) {
                  case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                    this.addTag(option.data['ROW']);
                    break;
                }
              }
            });
          }
        }
      );
    }
  }

  public ngOnDestroy() {

    if (this._cascadeSubscription) {
      this._cascadeSubscription.unsubscribe();
    }
  }
}

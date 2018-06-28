import { SimpleTableButton } from '@delon/abc';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';

@Component({
  selector: 'app-block-setting',
  templateUrl: './block-setting.component.html',
})
export class BlockSettingComponent implements OnInit {
  // 加载模块数据
  _funcOptions: any[] = [];
  _funcValue;
  _layoutNameValue;
  _layoutConfig;
  // 布局列表数据
  _layoutList = [];
  _selectedModuleText;
  _layoutId;
  constructor(
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    const params = { _select: 'Id,Name,ParentId' };
    const moduleData = await this.getModuleData(params);
    // 初始化模块列表，将数据加载到及联下拉列表当中
    this._funcOptions = this.arrayToTree(moduleData.Data, '');
  }

  // 改变模块选项
  _changeModuleValue($event?) {
    this._layoutList = [];
    // 选择功能模块，首先加载服务端配置列表
    // const params = new HttpParams().set('TagA', this._funcValue.join(','));
    if (this._funcValue.length > 0) {
      const params = {
        ModuleId: this._funcValue[this._funcValue.length - 1],
        _select: 'Id,Name,Metadata'
      };
      this.getLayoutConfigData(params).then(serverLayoutData => {
        if (serverLayoutData.Status === 200 && serverLayoutData.Data.length > 0) {
          serverLayoutData.Data.forEach((data, index) => {
            const metadata = JSON.parse(data.Metadata);
            this._layoutList.push({ label: data.Name, value: { id: data.Id, metadata: metadata } });
          });
        } else {
          this._layoutList = [];
        }

      });
    }
  }

  // 获取布局设置列表
  getLayoutConfigData(params) {
    return this.apiService.getProj(APIResource.LayoutSetting, params).toPromise();
  }

  // 获取区块信息
  async getBlockConfigData(params) {
    return this.apiService.getProj(APIResource.BlockSetting, params).toPromise();
  }

  // 获取模块信息
  async getModuleData(params) {
    return this.apiService.getProj(APIResource.AppModuleConfig, params).toPromise();
  }

  // 选择布局名称
  _changeLayoutName($event) {
    // 创建布局
    // this._layoutConfig = $event.metadata;
    //
    this._layoutId = $event.id;
    (async () => {
      const params = {
        LayoutId: $event.id
      };
      const layoutData = $event.metadata;
      const blockData = await this.getBlockConfigData(params);

      
      // 获取顶层布局块
      const topBlock = blockData.Data.filter(block => {
        return block.ParentId === this._funcValue[this._funcValue.length - 1];
      });

      const result = this.listToTreeData(blockData.Data, this._funcValue[this._funcValue.length - 1]);

      const layoutBlock = [];

      result.map(res => {
        const block = {};
        if (res.Type === 'view' && res.children) {
          block['title'] = res.Title;
          block['id'] = res.Id;
          block['tabs'] = [];
          block['area'] = res.Area;
          block['size'] = JSON.parse(res.Size);
          block['span'] = res.Span;
          res.children.map(tabs => {
            if (tabs.Type === 'tabs' && tabs.children) {
              tabs.children.map(tab => {
                const _tab = {};
                _tab['title'] = tab.Title;
                _tab['id'] = tab.Id;
                _tab['viewCfg'] = [];
                block['tabs'].push(_tab);
              });
            }
          });
        } else {
          block['title'] = res.Title;
          block['id'] = res.Id;
          block['viewCfg'] = [];
          block['area'] = res.Area;
          block['size'] = JSON.parse(res.Size);
          block['span'] = res.Span;
        }
        layoutBlock.push(block);
      });

      // const tabsBlock = blockData.Data.filter(block => {
      //   return block.Type === 'tabs';
      // });

      // const tabBlock = blockData.Data.filter(block => {
      //   return block.Type === 'tab';
      // });

      // console.log('topBlocl', topBlock);
      // console.log('topBlocl', tabsBlock);
      // console.log('topBlocl', tabBlock);

      topBlock.map(block => {
        this.rebuildLayoutMeta(layoutData, block , layoutBlock);
      });

      // tabsBlock.map(block => {
      //   this.rebuildBlockMeta(layoutData, block, tabBlock);
      // });

      

      // layout.map(lay => {
      //   this.resolveLayout(layoutData, lay);
      // });
      // console.log(layoutData);
      // this._layoutConfig = layoutData;
    })();
  }

  listToTreeData(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        temp = this.listToTreeData(data, data[i].Id);
        if (temp.length > 0) {
          data[i]['children'] = temp;
        } else {
          data[i]['isLeaf'] = true;
        }
        result.push(data[i]);
      }
    }
    return result;
  }

  rebuildLayoutMeta(layout, block, layoutBlock) {
    if (layout.rows) {
      for (let i = 0, len = layout.rows.length; i < len; i++) {
        for (let j = 0, jlen = layout.rows[i].row.cols.length; j < jlen; j++) {
          if (layout.rows[i].row.cols[j].id === block.Area) {
            layoutBlock.forEach(b => {
              if (b.area === block.Area) {
                layout.rows[i].row.cols[j] = {...b};
              }
            });
          }
        }
      }
    }
    console.log(layout);
  }


  _onSelectionChange(selectedOptions: any[]) {
    this._selectedModuleText = `【${selectedOptions.map(o => o.label).join(' / ')}】`;
  }

  arrayToTree(data, parentid) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ParentId === parentid) {
        const obj = { 'label': data[i].Name, 'value': data[i].Id };
        temp = this.arrayToTree(data, data[i].Id);
        if (temp.length > 0) {
          obj['children'] = temp;
        } else {
          obj['isLeaf'] = true;
        }
        result.push(obj);
      }
    }
    return result;
  }

  resetForm($event) {

  }

}

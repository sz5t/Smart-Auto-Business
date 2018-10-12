import { CnComponentBase } from './../../components/cn-component-base';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Inject, OnDestroy } from '@angular/core';
import G6 from '@antv/g6';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { CommonTools } from '@core/utility/common-tools';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
import { AdNumberToChineseModule } from '@delon/abc';
@Component({
  selector: 'bsn-data-step',
  template: `<nz-spin [nzSpinning]="isLoading" nzTip='加载中...'><div #dataSteps></div></nz-spin>`,
  styles: [``]
})
export class BsnDataStepComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @Input() config;
  @Input() initData;
  @ViewChild('dataSteps') dataSteps: ElementRef;
  isLoading = false;
  bNodeColor;
  sNodeColor = '#eee';
  sNodeEnterColor = '#4B99FD';
  _statusSubscription;
  _cascadeSubscription;
  graph;
  constructor(
    private _apiService: ApiService,
    private _cacheService: CacheService,
    @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>) {
    super();
  }

  ngOnInit() {
    if (this.initData) {
      this.initValue = this.initValue;
    }
    this.resolverRelation();
  }

  async load() {
    this.isLoading = true;
    const response = await this.get();
    if (response.isSuccess) {
      // 构建数据源
      const rgNodes = this.listToAsyncTreeData(response.data, null);
      const crNodes = this.convertTreeToNodes(rgNodes);
      const copy = JSON.parse(JSON.stringify(crNodes));
      const edges = this.convertTreeToEdges(copy);
      this.graph.read({ nodes: crNodes, edges: edges });
      this.isLoading = false;
    }
  }



  listToAsyncTreeData(data, parentid) {
    const result: any[] = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === parentid) {
        const temps = [];
        temp = this.listToAsyncTreeData(data, data[i].Id);
        if (temp.length > 0) {
          temp.forEach(item => {
            item['type'] = 'child';
            temps.push(item);
          });
        } else {
          data[i]['type'] = 'parent';
        }
        data[i]['type'] = 'parent';
        data[i]['id'] = data[i]['Id'];
        result.push(data[i]);
        if (temps.length > 0) {
          result.push(...temps);
        }
      }
    }
    return result;
  }

  convertTreeToNodes(rgNodes) {
    const nodes = [];
    if (rgNodes && rgNodes.length > 0) {
      for (let i = 0, len = rgNodes.length; i < len; i++) {
        rgNodes[i]['x'] = this.config.startX * i === 0 ? this.config.startX : this.config.startX + this.config.startX * i;
        rgNodes[i]['y'] = this.config.startY;
        rgNodes[i]['label'] = rgNodes[i][this.config.textField];
        if (rgNodes[i]['type'] === 'child') {
          rgNodes[i]['color'] = this.sNodeColor;
        }
        nodes.push(rgNodes[i]);
      }
    }
    return nodes;
  }

  convertTreeToEdges(cNodes) {
    const edges = [];
    let next;
    if (cNodes) {
      while (cNodes.length > 0) {
        const edge = {};
        let current;

        if (next) {
          current = next;
        } else {
          current = cNodes.pop();
        }
        next = cNodes.pop();

        edge['source'] = next.Id;
        edge['target'] = current.Id;
        edge['endArrow'] = true;
        if (next.type === 'child') {
          edge['label'] = this.config.subTitle;
        } else if (next.type === 'parent') {
          edge['label'] = this.config.mainTitle;
        }
        edges.push(edge);
      }
    }
    return edges;
  }

  async get() {
    return this._apiService.get(this.config.ajaxConfig.url, CommonTools.parametersResolver({
      params: this.config.ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this._cacheService
    })).toPromise();
  }

  visitNode(node: any, hashMap: object, array: any[]): void {
    if (!hashMap[node.Id]) {
      hashMap[node.Id] = true;
      array.push(node);
    }
  }

  resolverRelation() {
    if (this.config.componentType && this.config.componentType.child === true) {
      this._cascadeSubscription = this.cascadeEvents.subscribe(cascadeEvent => {
        // 解析子表消息配置
        if (this.config.relations && this.config.relations.length > 0) {
          this.config.relations.forEach(relation => {
            if (relation.relationViewId === cascadeEvent._viewId) {
              // 获取当前设置的级联的模式
              const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode];
              // 获取传递的消息数据
              const option = cascadeEvent.option;
              // 解析参数
              if (relation.params && relation.params.length > 0) {
                relation.params.forEach(param => {
                  if (!this.tempValue) { this.tempValue = {}; }
                  this.tempValue[param['cid']] = option.data[param['pid']];
                });
              }
              // 匹配及联模式
              switch (mode) {
                case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                  this.load();
                  break;
                case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                  this.load();
                  break;
              }
            }
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    G6.registerBehaviour('mouseEnterColor', (graph) => {
      graph.behaviourOn('node:mouseenter', (ev) => {
        this.bNodeColor = ev.item.model.color;
        graph.update(ev.item, {
          color: this.sNodeEnterColor
        });
      });
    });

    G6.registerBehaviour('mouseLeaveColor', (graph) => {
      graph.behaviourOn('node:mouseleave', (ev) => {
        graph.update(ev.item, {
          color: this.bNodeColor
        });
      });
    });

    G6.registerBehaviour('onclick', (graph) => {
      graph.on('node:click', (ev) => {
        if (this.config.componentType && this.config.componentType.child === true) {

        }
        if (this.config.componentType && this.config.componentType.sub === true) {

        }

      });
    });

    const data = {
      nodes: [{
        id: 'node1',
        x: 100,
        y: 50,
        label: 'node 3',
        type: 'parent'
      }, {
        id: 'node2',
        x: 300,
        y: 50,
        label: 'node 3',
        color: '#eee',
        type: 'child'
      },
      {
        id: 'node3',
        x: 500,
        y: 50,
        label: 'node 3',
        type: 'parent'
      }
      ],
      edges: [{
        target: 'node2',
        source: 'node1',
        label: '工步',
        endArrow: true
      },
      {
        target: 'node3',
        source: 'node2',
        label: '工艺',
        endArrow: true
      }]
    };

    this.graph = new G6.Graph({
      container: this.dataSteps.nativeElement,
      fitView: 'cc',
      width: this.config.width,
      height: this.config.height,
      modes: {
        red: ['mouseEnterColor', 'mouseLeaveColor', 'onclick']
      },
      mode: 'red'
    });

    this.load();
  }

  ngOnDestroy() {
    if (this._statusSubscription) {
      this._statusSubscription.unsubscribe();
    }
    if (this._cascadeSubscription) {
      this._cascadeSubscription.unsubscribe();
    }
  }

}

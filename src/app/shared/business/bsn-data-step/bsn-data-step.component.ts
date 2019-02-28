import { CnComponentBase } from './../../components/cn-component-base'
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Inject, OnDestroy, TemplateRef } from '@angular/core'
import G6 from '@antv/g6'
import { ApiService } from '@core/utility/api-service'
import { CacheService } from '@delon/cache'
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus'
import { Observable, Observer } from 'rxjs'
import { CommonTools } from '@core/utility/common-tools'
import { NzDropdownService, NzDropdownContextComponent, NzMenuItemDirective } from 'ng-zorro-antd'
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-data-step',
    template: `
    <nz-spin [nzSpinning]="isLoading" nzTip='加载中...'>
        <div 
            (contextmenu)="contextMenu($event,template)"
            [ngStyle]="{overflow: 'auto',height: config.scrollHeight, width: config.scrollWidth}"
            infiniteScroll
            [infiniteScrollDistance]="1"
            [infiniteScrollThrottle]="50"
            [scrollWindow]="false">
            <div #dataSteps></div>
        </div>
        <ng-template #template>
        <ul nz-menu nzInDropDown (nzClick)="close($event)">
          <li nz-menu-item>一级数据</li>
          <li nz-menu-item>二级数据</li>
          <li nz-menu-item>三级数据</li> 
        </ul>
      </ng-template>
    </nz-spin>`,
    styles: [``]
})
export class BsnDataStepComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config
    @Input()
    public initData
    @ViewChild('dataSteps')
    public dataSteps: ElementRef
    public isLoading = true
    public bNodeColor
    public sNodeColor = '#eee'
    public sNodeEnterColor = '#00B2EE'
    public sNodeClickColor = '#9BCD9B'
    public _lastNode
    public _statusSubscription
    public _cascadeSubscription
    public graph
    private dropdown: NzDropdownContextComponent
    private defaultStyle = {
        color: '#ccc',
        background: '#ddd'
    }
    constructor(
        private _apiService: ApiService,
        private _cacheService: CacheService,
        private nzDropdownService: NzDropdownService,
        @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super()
    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {}
        this.resolverRelation()
    }
    public contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template)
    }

    public close(e: NzMenuItemDirective): void {
        this.dropdown.close()
    }

    public load() {
        this.isLoading = true
            ; (async () => {
                this.get().then(response => {
                    if (response.isSuccess) {
                        // 构建数据源
                        const crNodes = this.sortingNode(response.data, null)
                        // 拷贝数据源(构建连线会破坏原属数据的结构,所以要对数据源进行重新拷贝)
                        const copy = JSON.parse(JSON.stringify(crNodes))
                        if (crNodes.length > 1) {
                            // 构建连线
                            const edges = this.convertTreeToEdges(copy)
                            // 绘制图形
                            this.graph.read({ nodes: crNodes, edges: edges })
                        } else {
                            this.graph.read({ nodes: crNodes })
                        }
                        if (!this._lastNode) {
                            this._lastNode = this.graph._cfg._itemMap[crNodes[0].Id];
                        }
                        
                        this.isLoading = false
                    }
                })
            })()
    }

    public sortingNode(dataSource, parentId) {
        // 获取所有根节点的数据
        const parentNodes = dataSource.filter(d => d.parentId === parentId)
        // 获取所有非根节点数据
        const restNodes = dataSource.filter(d => d.parentId !== parentId)
        const resultNodes = []
        if (Array.isArray(restNodes) && restNodes.length > 0) {
            parentNodes.forEach(parentNode => {
                resultNodes.push(...this.addRestNodesToParent(parentNode, restNodes, 0))
            })
        } else {
            resultNodes.push(...this.sortData(parentNodes, 'parent'))
            resultNodes.forEach(nodeData => {
                this.decorateNode(nodeData, 0)
            })
        }
        this.getResultNodes(resultNodes);
        return resultNodes
    }

    private getResultNodes(resultNodes: any[]) {
        resultNodes.forEach((nodeData, i) => {
            if (this._lastNode && (this._lastNode.model['Id'] === nodeData['Id'])) {
                this.buildSelectedNode(nodeData);
            } else if (!this._lastNode) {
                if (i === 0) {
                    this.buildSelectedNode(nodeData);
                }
            }
            if (this.config.direction === 'horizontal') {
                nodeData['x'] = this.config.startX * i === 0 ? this.config.startX : this.config.startX + this.config.startX * i;
                nodeData['y'] = this.config.startY + 25;
            } else if (this.config.direction === 'vertical') {
                nodeData['y'] = this.config.startY * i === 0 ? this.config.startY : this.config.startY + this.config.startY * i;
            }
            nodeData['label'] = nodeData[this.config.textField];
            if (nodeData['type'] === 'child') {
            }
        });
    }

    private buildSelectedNode(nodeData: any) {
        nodeData['color'] = this.sNodeClickColor;
        nodeData['style'] = { stroke: '#000' };
        this.tempValue['_selectedNode'] = nodeData;
        if (this.config.componentType && this.config.componentType.parent === true) {
            this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD, this.config.viewId, {
                data: this.tempValue['_selectedNode']
            }));
        }
    }

    public sortData(data, type) {
        if (type === 'children' && this.config.childSortField && this.config.childSortField.length > 0) {
            return data.sort((x, y) => x['childSortField'] - y['childSortField'])
        } else if (type === 'parent' && this.config.parentSortField && this.config.parentSortField.length > 0) {
            return data.sort((x, y) => x['parentSortField'] - y['parentSortField'])
        } else {
            return data
        }
    }

    public decorateNode(nodeData, level) {
        const style = this.config.styles ? this.config.styles[level] : this.defaultStyle

        nodeData['level'] = level
        nodeData['style'] = { stroke: style.stroke }
        nodeData['color'] = style.background
        nodeData['id'] = nodeData['Id']
        // data[i]['shape'] = 'customNode';
        nodeData['labelOffsetX'] = this.config.labelOffsetX ? this.config.labelOffsetX : 0
        nodeData['labelOffsetY'] = this.config.labelOffsetY ? this.config.labelOffsetY : -30
        nodeData['size'] = this.config.size - 8 * level
    }

    public addRestNodesToParent(parentNode, restNodes, level) {
        const childNodes = []
        this.decorateNode(parentNode, level)
        for (let i = 0, len = restNodes.length; i < len; i++) {
            if (parentNode.Id === restNodes[i].parentId) {
                childNodes.push(restNodes[i])
                restNodes.splice(i, 1)
                i--
                len--
            }
        }
        let matchNodes = this.sortData(childNodes, 'children')
        const res = []
        if (matchNodes.length > 0) {
            level++
            matchNodes.forEach(match => {
                res.push(...this.addRestNodesToParent(match, restNodes, level))
            })
            matchNodes = res
        }

        return [parentNode, ...matchNodes]
    }

    public listToAsyncTreeData(data, parentid, level) {
        const result: any[] = []
        let temp
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                const temps = []
                temp = this.listToAsyncTreeData(data, data[i].Id, level + 1)
                if (temp.length > 0) {
                    temp.forEach(item => {
                        item['type'] = 'child'
                        item['size'] = this.config.size - 5 * level
                        // item['shape'] = 'childNode';
                        item['style'] = { stroke: '#666' }
                        temps.push(item)
                    })
                } else {
                    data[i]['type'] = 'parent'
                }
                data[i]['type'] = 'parent'
                data[i]['style'] = { stroke: '#333' }
                data[i]['id'] = data[i]['Id']
                // data[i]['shape'] = 'customNode';
                data[i]['labelOffsetX'] = this.config.labelOffsetX ? this.config.labelOffsetX : 0
                data[i]['labelOffsetY'] = this.config.labelOffsetY ? this.config.labelOffsetY : -30
                data[i]['size'] = this.config.size
                result.push(data[i])
                if (temps.length > 0) {
                    result.push(...temps)
                }
            }
        }
        return result
    }

    public convertTreeToNodes(rgNodes) {
        const nodes = []
        if (rgNodes && rgNodes.length > 0) {
            for (let i = 0, len = rgNodes.length; i < len; i++) {
                if (this.config.direction === 'horizontal') {
                    rgNodes[i]['x'] = this.config.startX * i === 0 ? this.config.startX : this.config.startX + this.config.startX * i
                    rgNodes[i]['y'] = this.config.startY + 25
                } else if (this.config.direction === 'vertical') {
                    rgNodes[i]['y'] = this.config.startY * i === 0 ? this.config.startY : this.config.startY + this.config.startY * i
                }

                rgNodes[i]['label'] = rgNodes[i][this.config.textField]
                if (rgNodes[i]['type'] === 'child') {
                    rgNodes[i]['color'] = this.sNodeColor
                }
                nodes.push(rgNodes[i])
            }
        }
        return nodes
    }

    public convertTreeToEdges(cNodes) {
        const edges = []
        let next
        if (cNodes) {
            while (cNodes.length > 0) {
                const edge = {}
                let current
                if (next) {
                    current = next
                } else {
                    current = cNodes.pop()
                }
                next = cNodes.pop()

                edge['source'] = next.Id
                edge['target'] = current.Id
                edge['endArrow'] = true
                if (next.type === 'child') {
                    edge['label'] = this.config.subTitle
                } else if (next.type === 'parent') {
                    edge['label'] = this.config.mainTitle
                }
                edges.push(edge)
            }
        }
        return edges
    }

    public async get() {
        return this._apiService
            .get(
                this.config.ajaxConfig.url,
                CommonTools.parametersResolver({
                    params: this.config.ajaxConfig.params,
                    tempValue: this.tempValue,
                    initValue: this.initValue,
                    cacheValue: this._cacheService
                })
            )
            .toPromise()
    }

    public resolverRelation() {
        if (this.config.componentType && this.config.componentType.child === true) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(cascadeEvent => {
                // 解析子表消息配置
                if (this.config.relations && this.config.relations.length > 0) {
                    this.config.relations.forEach(relation => {
                        if (relation.relationViewId === cascadeEvent._viewId) {
                            // 获取当前设置的级联的模式
                            const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode]
                            // 获取传递的消息数据
                            const option = cascadeEvent.option
                            // 解析参数
                            if (relation.params && relation.params.length > 0) {
                                relation.params.forEach(param => {
                                    if (!this.tempValue) {
                                        this.tempValue = {}
                                    }
                                    this.tempValue[param['cid']] = option.data[param['pid']]
                                })
                            }
                            if (cascadeEvent._mode === mode) {
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.load()
                                        break
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.load()
                                        break
                                }
                            }
                            
                        }
                    })
                }
            })
        }
    }

    public ngAfterViewInit() {
        G6.registerNode('childNode', {
            draw: function draw(item) {
                const group = item.getGraphicGroup()
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: -13,
                        fill: '#333',
                        text: item.model.label
                    }
                })
                return group.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: -12,
                        width: 25,
                        height: 25,
                        stroke: '#333',
                        fill: '#eee',
                        label: item.model.label
                    }
                })
            }
        })

        G6.registerBehaviour('mouseEnterColor', graph => {
            graph.behaviourOn('node:mouseenter', ev => {
                this.bNodeColor = ev.item.model.color
                if (ev.item.model.color !== this.sNodeClickColor) {
                    graph.update(ev.item, {
                        color: this.sNodeEnterColor
                    })
                }
            })
        })

        G6.registerBehaviour('mouseLeaveColor', graph => {
            graph.behaviourOn('node:mouseleave', ev => {
                if (ev.item.model.color !== this.sNodeClickColor) {
                    graph.update(ev.item, {
                        color: this.bNodeColor
                    })
                }
            })
        })

        G6.registerBehaviour('onclick', graph => {
            graph.on('node:click', ev => {
                if (!this._lastNode) {
                    graph.update(ev.item, {
                        color: this.sNodeClickColor,
                        style: { stroke: '#000' }
                    })
                    this._lastNode = ev.item
                }
                if (this._lastNode !== ev.item) {
                    graph.update(ev.item, {
                        color: this.sNodeClickColor,
                        style: { stroke: '#000' }
                    })

                    graph.update(this._lastNode, {
                        color: this.config.styles ? this.config.styles[this._lastNode.model.level].background : this.defaultStyle.background,
                        style: { stroke: this.config.styles ? this.config.styles[this._lastNode.model.level].stroke : this.defaultStyle.color }
                    })
                    this._lastNode = ev.item
                }

                this.tempValue['_selectedNode'] = ev.item.model
                if (this.config.componentType && this.config.componentType.parent === true) {
                    this.cascade.next(
                        new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD, this.config.viewId, {
                            data: this.tempValue['_selectedNode']
                        })
                    )
                }
                // 注册多界面切换消息
                if (this.config.componentType && this.config.componentType.sub === true) {
                    this.tempValue['_selectedNode'] &&
                        this.cascade.next(
                            new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REPLACE_AS_CHILD, this.config.viewId, {
                                data: this.tempValue['_selectedNode'],
                                tempValue: this.tempValue,
                                subViewId: () => {
                                    let id = ''
                                    if (Array.isArray(this.config.subMapping) && this.config.subMapping.length > 0) {
                                        this.config.subMapping.forEach(sub => {
                                            const mappingVal = this.tempValue['_selectedNode'][sub['field']]
                                            if (sub.mapping) {
                                                sub.mapping.forEach(m => {
                                                    if (m.value === mappingVal) {
                                                        id = m.subViewId
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    return id
                                }
                            })
                        )
                }
            })
        })

        this.graph = new G6.Graph({
            container: this.dataSteps.nativeElement,
            fitView: this.config.position ? this.config.position : 'cc',
            width: this.config.width,
            height: this.config.height,
            modes: {
                red: ['mouseEnterColor', 'mouseLeaveColor', 'onclick']
            },
            mode: 'red'
        })

        this.load()
    }

    public ngOnDestroy() {
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe()
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe()
        }
    }
}

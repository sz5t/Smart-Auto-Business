import { Component, OnInit, Input, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { _HttpClient } from '@delon/theme';
import Editor from '@antv/g6-editor';
import { Subscription, Observable, Observer } from 'rxjs';
import { BSN_COMPONENT_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
import { CacheService } from '@delon/cache';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { ElementDef } from '@angular/core/src/view';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'wf-design,[wf-design]',
  templateUrl: './wf-design.component.html',
  styleUrls: ['./wf-design.component.css', '../../../../../node_modules/@antv/g6-editor/build/base.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WfDesignComponent extends CnComponentBase implements OnInit {
  @Input() public config; // dataTables 的配置参数
  @Input() public permissions = [];
  @Input() public dataList = []; // 表格数据集合
  @Input() public initData;
  // './node_modules/@antv/g6-editor/build/base.css'
  @ViewChild('minimap') public minimap: ElementRef;
  @ViewChild('toolbar') public toolbar: ElementRef;
  @ViewChild('contextmenu') public contextmenu: ElementRef;
  @ViewChild('itempannel') public itempannel: ElementRef;
  @ViewChild('detailpannel') public detailpannel: ElementRef;
  @ViewChild('page') public rpage: ElementRef;
  @ViewChild('zoomslider') public zoomslider: ElementRef;
  public _statusSubscription: Subscription;
  public _cascadeSubscription: Subscription;
  public tempValue = {};
  public data1 = {
    nodes: [
      {
        type: 'node',
        nodetype: 'BeginNode',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '开始节点',
        x: 155,
        y: 55,
        id: 'ea1184e8',
        index: 0

      },
      {
        type: 'node',
        nodetype: 'Node',
        size: '72*72',
        shape: 'flow-rect',
        color: '#13C2C2',
        label: '普通节点',
        x: 155,
        y: 155,
        id: 'ea1184e7',
        index: 1,

      },
      {
        type: 'node',
        nodetype: 'GatewayNode',
        size: '80*72',
        shape: 'flow-rhombus',
        color: '#13C2C2',
        label: '分叉节点',
        x: 155,
        y: 255,
        id: 'ea1184e6',
        index: 2,
      },
      {
        type: 'node',
        nodetype: 'EndNode',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '结束节点',
        x: 155,
        y: 355,
        id: '481fbb1a',
        index: 3,
      }],
    edges: [
      {
        source: 'ea1184e8',
        sourceAnchor: 2,
        target: 'ea1184e7',
        targetAnchor: 0,
        id: '7989ac70',
        index: 4,
      },
      {
        source: 'ea1184e7',
        sourceAnchor: 2,
        target: 'ea1184e6',
        targetAnchor: 0,
        id: '7989ac71',
        index: 5,
      },
      {
        source: 'ea1184e6',
        sourceAnchor: 2,
        target: '481fbb1a',
        targetAnchor: 0,
        id: '7989ac72',
        index: 6,
      }
    ],
  };

  public data = { nodes: [], edges: [] };

  // 节点基本信息配置
  public node_panels = [
    {
      active: true,
      name: '属性',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '扩充信息'
    }
  ];

  // 边基本信息
  public edge_panels = [
    {
      active: true,
      name: '属性',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: '扩充信息'
    }
  ];

  // 节点表单信息
  public nodeinfo = {
    id: '',
    label: ''
  };
  public edgeinfo = {
    id: '',
    label: ''
  };


  // 构造函数
  constructor(private http: _HttpClient,
    private apiService: ApiService,
    private _message: NzMessageService,
    private cacheService: CacheService,
    @Inject(BSN_COMPONENT_MODES) private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE) private cascadeEvents: Observable<BsnComponentMessage>
  ) {
    super();
  }

  public editor = new Editor();
  public page;


  public async load() {

    // console.log('tempValue:', this.tempValue);

    const url = this._buildURL(this.config.ajaxConfig.url);
    const params = {
      ...this._buildParameters(this.config.ajaxConfig.params),
      ...this._buildFilter(this.config.ajaxConfig.filter)
    };
    const configjson = this.config.configjson ? this.config.configjson : 'configjson';
    const loadData = await this._load(url, params);
    console.log(url, params);
    if (loadData && loadData.status === 200 && loadData.isSuccess) {
      if (loadData.data) {
        // console.log('加载数据', loadData);
        if (loadData.data.length > 0) {
          if (loadData.data[0][configjson]) {
            //   console.log('configjson:', loadData.data[0].configjson);
            this.data = JSON.parse(loadData.data[0][configjson]);
          }
        } else {
          this.data = { nodes: [], edges: [] };
        }
      } else {
        this.data = { nodes: [], edges: [] };
      }
    } else {
      this.data = { nodes: [], edges: [] };
    }


    // console.log('this.data:', this.data);
    this.page.read(this.data);
    // console.log('调用load结束');

  }
  private async _load(url, params) {
    return this.apiService.get(url, params).toPromise();
  }
  public ngOnInit() {
    this.resolverRelation();
    if (this.initData) {
      this.initValue = this.initData;
    }
    this.load();
    console.log('begin');

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngAfterViewInit() {
    console.log('ngAfterViewInit');
    const Command = Editor.Command;
    Command.registerCommand('liu', {
      queue: true,  // 命令是否进入队列，默认是 true  
      // 命令是否可用
      enable(/* editor */) {
        console.log('enable');
      },
      // 正向命令
      execute(/* editor */) {
        console.log('execute');
      },
      // 反向命令
      back(/* editor */) {
        console.log('back');
      }
    });
    // 小地图
    const minimap = new Editor.Minimap({
      container: this.minimap.nativeElement,
      width: 200,
      height: 120,
    });
    // const zoomslider = new Editor.slider({
    //   container: this.zoomslider.nativeElement,
    // });
    // zoomslider.render();
    const toolbar = new Editor.Toolbar({
      container: this.toolbar.nativeElement,
    });
    const contextmenu = new Editor.Contextmenu({
      container: this.contextmenu.nativeElement,
    });
    const itempannel = new Editor.Itempannel({
      container: this.itempannel.nativeElement,
    });
    const detailpannel = new Editor.Detailpannel({
      container: this.detailpannel.nativeElement,
    });
    // console.log('innerHeight', window.innerHeight - 238);
    this.page = new Editor.Flow({
      graph: {
        container: this.rpage.nativeElement,
        height: window.innerHeight - 238,
        width: window.innerWidth - 400

      },
      // shortcut: {
      //   zoomIn: true,   // 开启放大快捷键
      //   zoomOut: false, // 开启视口缩小快捷键
      // },
    });

    this.editor.add(minimap);
    this.editor.add(toolbar);
    this.editor.add(contextmenu);
    this.editor.add(itempannel);
    this.editor.add(detailpannel);
    this.editor.add(this.page);

    // 默认加载数据
    this.page.read(this.data);

    const graph = this.page.getGraph();
    graph.on('click', ev => {
      console.log('click');
    });          // 任意点击事件
    graph.on('node:click', ev => {
      // console.log('node:click', ev);
      if (ev.item) {
        const s_data = this.page.save();
        this.data.edges = s_data.edges;

        // s_data.nodes.forEach(nodeItem => {
        //   let nodeState = false;
        //   this.data.nodes.forEach(n => {
        //     if (n.id === nodeItem.id) {
        //       nodeState = true;
        //     }
        //   });
        //   if (!nodeState) {
        //     this.data.nodes.push(nodeItem);
        //   }
        // });

        // console.log('节点model', ev.item.model);
        let nodestate = true;
        this.data.nodes.forEach(n => {
          if (n.id === ev.item.model.id) {
            this.nodeinfo.id = n.id;
            this.nodeinfo.label = n.label;
            nodestate = false;
          }
        });
        if (nodestate) {
          const nodemodel = ev.item.model;
          nodemodel['nodetype'] = this.getNodeType(ev.item.model.label);
          this.data.nodes.push(nodemodel);
          this.data.nodes.forEach(n => {
            if (n.id === ev.item.model.id) {
              this.nodeinfo.id = n.id;
              this.nodeinfo.label = n.label;
            }
          });
        }

        // 点击中节点发出消息
        let sendData = {};
        let nodeData = {};
        this.data.nodes.forEach(n => {
          if (n.id === ev.item.model.id) {
            sendData = n;
            nodeData = n;
          }
        });
        console.log('*******************');
        console.log('发出消息：', sendData);
        // ******注释调这块
        // this.cascade.next(
        //   new BsnComponentMessage(
        //     BSN_COMPONENT_CASCADE_MODES['SELECTED_NODE'],
        //     this.config.viewId,
        //     {
        //       data: sendData
        //     }
        //   )
        // );


        // *******************************
        // 配置明细
        // const cascadeRelation = [{
        //   name: 'node',
        //   cascadeMode: 'Scan_Code_Locate_ROW',
        //   cascadeField: [
        //     { name: 'ScanCode', valueName: 'value',type:'selectObject/tempValueObject/tempValue/initValueObject/initValue/value',value:'固定值' },
        //     { name: 'ScanCodeObject', valueName: 'dataItem' }
        //   ]
        // }];

        if (this.config.cascadeRelation) {
          this.config.cascadeRelation.forEach(element => {
            if (element.name === 'node') {
              if (element.cascadeField) {
                element.cascadeField.forEach(feild => {
                  if (!feild['type']) {
                    if (nodeData[feild.valueName]) {
                      sendData[feild.name] = nodeData[feild.valueName];
                    }
                  } else {
                    if (feild['type'] === 'selectObject') {
                      if (nodeData[feild.valueName]) {
                        sendData[feild.name] = nodeData[feild.valueName];
                      }
                    } else if (feild['type'] === 'tempValueObject') {

                      sendData[feild.name] = this.tempValue;

                    } else if (feild['type'] === 'tempValue') {
                      if (this.tempValue[feild.valueName]) {
                        sendData[feild.name] = this.tempValue[feild.valueName];
                      }
                    } else if (feild['type'] === 'initValueObject') {

                      sendData[feild.name] = this.initValue;

                    } else if (feild['type'] === 'initValue') {
                      if (this.initValue[feild.valueName]) {
                        sendData[feild.name] = this.initValue[feild.valueName];
                      }
                    } else if (feild['type'] === 'value') {
                      sendData[feild.name] = feild.value;
                    }

                  }

                });
              }
              this.cascade.next(
                new BsnComponentMessage(
                  BSN_COMPONENT_CASCADE_MODES[element.cascadeMode],
                  this.config.viewId,
                  {
                    data: sendData
                  }
                )
              );
            }
          });
        }
        // *******************************






      }
      // this.nodeform 
      //  const data = page.save();
      // console.log('当前节点数据', this.data);

    });     // 节点点击事件
    graph.on('edge:click', ev => {
      // console.log('edge:click', ev);
      if (ev.item) {
        const s_data = this.page.save();
        this.data.edges = s_data.edges;

        s_data.nodes.forEach(nodeItem => {
          let nodeState = false;
          this.data.nodes.forEach(n => {
            if (n.id === nodeItem.id) {
              nodeState = true;
            }
          });
          if (!nodeState) {
            this.data.nodes.push(nodeItem);
          }
        });
        let nodestate = true;
        // console.log('edgemodel', ev.item.model);
        this.data.edges.forEach(n => {
          if (n.id === ev.item.model.id) {
            this.edgeinfo.id = n.id;
            nodestate = false;
          }
        });
        if (nodestate) {
          const nodemodel = ev.item.model;
          this.data.edges.push(nodemodel);
          this.data.edges.forEach(n => {
            if (n.id === ev.item.model.id) {
              this.edgeinfo.id = n.id;
            }
          });
        }
      }
      // console.log('当前边节点数据', this.data);
    });     // 边点击事件
    graph.on('group:click', ev => {
      console.log('group:click');
    });    // 组点击事件
    graph.on('anchor:click', ev => {
      console.log('anchor:click');
    });   // 锚点点击事件



  }

  public async save() {
    console.log('执行save');
    // const s_data = this.page.save();
    // s_data.nodes.forEach(n => {
    //   if (!n.hasOwnProperty('nodetype')) {
    //     n['nodetype'] = this.getNodeType(n.label);
    //   }
    // });
    // console.log('当前节点数据', s_data);
    // console.log('当前节点数据string: ', JSON.stringify(s_data));

    // const submitData = {};
    // submitData['Id'] = this.tempValue['_parentId'];
    // submitData['configjson'] = JSON.stringify(s_data);
    // submitData['nodejson'] = JSON.stringify(s_data.nodes);
    // submitData['edgejson'] = JSON.stringify(s_data.edges);

    // componentValue

    if (this.config.saveConfig) {
      const url = this._buildURL(this.config.saveConfig.url);
      const params = {
        ...this._buildParameters(this.config.saveConfig.params),
      };
      const response = await this.execute(url, this.config.saveConfig.ajaxType, params);
      if (response && response.status === 200 && response.isSuccess) {
        this._message.create('success', '保存成功');
      } else {
        this._message.create('error', response.message);
      }
    }

  }

  // 获取组件值
  public getComponentValue() {
    const s_data = this.page.save();
    s_data.nodes.forEach(n => {
      if (!n.hasOwnProperty('nodetype')) {
        n['nodetype'] = this.getNodeType(n.label);
      }
    });
    const submitData = {};
    submitData['configjson'] = JSON.stringify(s_data);
    submitData['nodejson'] = JSON.stringify(s_data.nodes);
    submitData['edgejson'] = JSON.stringify(s_data.edges);
    return submitData;
  }

  public valueChange() {
    this.data.nodes.forEach(n => {
      if (n.id === this.nodeinfo.id) {
        n.label = this.nodeinfo.label;
      }
    });
    this.page.read(this.data);
  }
  // 看以后是否维护边信息
  public edgevalueChange() {
    //   this.data.edges.forEach(n => {
    //     if (n.id === this.edgeinfo.id ) {
    //      //  n.label = this.edgeinfo.label;
    //     }
    //  });
    //  this.page.read(this.data);
  }

  public getNodeType(label) {
    let nodetype = '';
    if (label === '开始节点') {
      nodetype = 'BeginNode';
    }
    if (label === '结束节点') {
      nodetype = 'EndNode';
    }
    if (label === '常规节点') {
      nodetype = 'Node';
    }
    if (label === '分叉节点') {
      nodetype = 'GatewayNode';
    }
    return nodetype;
  }


  // 工作流配置信息保存，保存的时候，拆解node edge 通过函数简析，这部分信息也通过配置
  public executeSave() {


  }

  // 执行异步请求  url 资源  method get/post/put body
  private async execute(url, method, body) {
    return this.apiService[method](url, body).toPromise();
  }


  // 工作流组件json 格式定义
  // tslint:disable-next-line:member-ordering
  public config1 = {
    viewId: 'wfeditorid',  // 唯一标识
    component: 'wf_design', // 工作流图形编辑组件
    loadtype: 'ajax',  // 【新增配置项】ajax、data  当前组件的加载方式【预留，目前以ajax为主】
    wfjson: 'configjson', // 当前存储json字段的
    ajaxConfig: {   // 图形自加载
      'url': 'common/WfInfo',
      'ajaxType': 'get',
      'params': [
        // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
      ],
      filter: []
    },
    // 该属性不作简析，目前只作单纯json维护
    componentType: {
      'parent': false,
      'child': false,
      'own': true
    },
    relations: [],
    toolbar: [ // 此处的toolbar 是用户自定义按钮 + 编辑器内置命令按钮，分组  commandtype: 'editorcommand',  // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
      {
        group: [
          {
            name: 'undo',
            commandtype: 'editorcommand',  // editorcommand 编辑器内置命令，componentcommand 组件内置方法，command 自定义
            class: 'command iconfont icon-undo',
            text: '撤销',
            hidden: false
          },
          {
            name: 'redo',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-redo disable',
            text: '重做',
            hidden: false
          }

        ]
      },
      {
        group: [
          {
            name: 'copy',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-copy-o disable',
            text: '复制',
            hidden: false
          },
          {
            name: 'paste',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-paster-o disable',
            text: '粘贴',
            hidden: false
          },
          {
            name: 'delete',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-delete-o disable',
            text: '删除',
            hidden: false
          }

        ]
      },
      {
        group: [
          {
            name: 'zoomIn',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-zoom-in-o',
            text: '放大',
            hidden: false
          },
          {
            name: 'zoomOut',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-zoom-out-o',
            text: '缩小',
            hidden: false
          },
          {
            name: 'autoZoom',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-fit',
            text: '适应画布',
            hidden: false
          },
          {
            name: 'resetZoom',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-actual-size-o',
            text: '实际尺寸',
            hidden: false
          }

        ]
      },
      {
        group: [
          {
            name: 'toBack',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-to-back disable',
            text: '层级后置',
            hidden: false
          },
          {
            name: 'toFront',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-to-front disable',
            text: '层级前置',
            hidden: false
          }

        ]
      },
      {
        group: [
          {
            name: 'multiSelect',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-select',
            text: '多选',
            hidden: false
          },
          {
            name: 'addGroup',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-group disable',
            text: '成组',
            hidden: false
          },
          {
            name: 'unGroup',
            commandtype: 'editorcommand',
            class: 'command iconfont icon-ungroup disable',
            text: '解组',
            hidden: false
          }

        ]
      },
      {
        group: [
          {
            name: 'saveWF',
            commandtype: 'componentcommand',
            class: 'command iconfont icon-select',
            text: '保存',
            hidden: false
          }
        ]
      },
    ],
    // 节点等的右键事件【目前不实现】
    contextmenu: [

    ]

  };
  /*
    参数简析
    【节点】 nodes
    id 唯一标识
    index // 层级 类似 z-index
    color 节点颜色
    label 节点名称
    nodetype 【节点属性】【自定义属性】
    parent 所属分组【预留,暂时不实现，有分组的时候有该属性，无分组，或者解组后 undefined】
    shape 图形编辑器 内置图形类别
    size 节点大小
    type 类别（节点，边）
    x:坐标
    y:坐标
  
    【边】 edges
     id：边的唯一标识
     index：边的层级 类似 z-index
     source：连线的出发点
     sourceAnchor ： 出发锚点
     target ：指向节点
     targetAnchor：指向锚点
  
    【分组】 groups的值
    id：唯一标识  也是节点parent 
    collapsed：是否收缩 true/false 
    index：分组的层级 类似 z-index
    x:坐标
    y:坐标
    
  */
  // 注意事项

  private resolverRelation() {
    // 注册按钮状态触发接收器
    this._statusSubscription = this.stateEvents.subscribe(updateState => {
      if (updateState._viewId === this.config.viewId) {
        const option = updateState.option;
        switch (updateState._mode) {
          case BSN_COMPONENT_MODES.REFRESH:
            this.load();
            break;
          // case BSN_COMPONENT_MODES.CREATE:
          //     this.addRow();
          //     break;
          // case BSN_COMPONENT_MODES.EDIT:
          //     this.updateRow();
          //     break;
          // case BSN_COMPONENT_MODES.CANCEL:
          //     this.cancelRow();
          //     break;
          // case BSN_COMPONENT_MODES.SAVE:
          //     this.saveRow(option);
          //     break;
          // case BSN_COMPONENT_MODES.DELETE:
          //     this.deleteRow(option);
          //     break;
          // case BSN_COMPONENT_MODES.DIALOG:
          //     this.dialog(option);
          //     break;
          // case BSN_COMPONENT_MODES.EXECUTE:
          //     // 使用此方式注意、需要在按钮和ajaxConfig中都配置响应的action
          //     this._resolveAjaxConfig(option);
          //     break;
          // case BSN_COMPONENT_MODES.WINDOW:
          //     this.windowDialog(option);
          //     break;
          // case BSN_COMPONENT_MODES.FORM:
          //     this.formDialog(option);
          //     break;
          // case BSN_COMPONENT_MODES.SEARCH:
          //     this.SearchRow(option);
          //     break;
          // case BSN_COMPONENT_MODES.UPLOAD:
          //     this.uploadDialog(option);
          //     break;
          // case BSN_COMPONENT_MODES.FORM_BATCH:
          //     this.formBatchDialog(option);
          //     break;
        }
      }
    });
    // 通过配置中的组件关系类型设置对应的事件接受者
    // 表格内部状态触发接收器console.log(this.config);
    // if (this.config.componentType && this.config.componentType.parent === true) {
    //     // 注册消息发送方法
    //     // 注册行选中事件发送消息
    //     this.after(this, 'selectRow', () => {
    //         this.cascade.next(new BsnComponentMessage(BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD, this.config.viewId, {
    //             data: this._selectRow
    //         }));
    //     });
    // }
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

              // 匹配及联模式
              switch (mode) {
                case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                  this.load();
                  break;
                case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                  this.load();
                  break;
                case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILDREN:
                  this.load();
                  break;
                case BSN_COMPONENT_CASCADE_MODES.CHECKED_ROWS:
                  break;
                case BSN_COMPONENT_CASCADE_MODES.SELECTED_ROW:
                  break;
              }
            }
          });
        }
      });
    }
  }

  /**
     * 构建查询过滤参数
     * @param filterConfig
     * @returns {{}}
     * @private
     */
  private _buildFilter(filterConfig) {
    let filter = {};
    if (filterConfig) {
      filter = CommonTools.parametersResolver({
        params: filterConfig,
        tempValue: this.tempValue,
        cacheValue: this.cacheService
      });
    }
    return filter;
  }
  /**
   * 构建URL参数
   * @param paramsConfig
   * @returns {{}}
   * @private
   */
  private _buildParameters(paramsConfig) {
    let params = {};
    if (paramsConfig) {
      params = CommonTools.parametersResolver({
        params: paramsConfig,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheService,
        componentValue: this.getComponentValue()
      });
    }
    return params;
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




}

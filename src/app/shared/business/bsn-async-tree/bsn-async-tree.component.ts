import { CommonTools } from "@core/utility/common-tools";
import {
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    Input,
    Inject
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { SimpleTableColumn, SimpleTableComponent } from "@delon/abc";
import {
    RelativeService,
    RelativeResolver
} from "@core/relative-Service/relative-service";
import { ApiService } from "@core/utility/api-service";
import { CnComponentBase } from "@shared/components/cn-component-base";
import { APIResource } from "@core/utility/api-resource";
import { NzTreeNode } from "ng-zorro-antd";
import { Subscription, Observable, Observer } from "rxjs";
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES
} from "@core/relative-Service/BsnTableStatus";

@Component({
    selector: "cn-bsn-async-tree",
    templateUrl: "./bsn-async-tree.component.html",
    styles: [
        `
            :host ::ng-deep .ant-tree {
                overflow: hidden;
                /*margin: 0 -24px;*/
                /*padding: 0 24px;*/
            }

            :host ::ng-deep .ant-tree li {
                padding: 4px 0 0 0;
            }

            @keyframes shine {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 1;
                }
            }

            .shine-animate {
                animation: shine 2s ease infinite;
            }

            .custom-node {
                cursor: pointer;
                line-height: 26px;
                margin-left: 4px;
                display: inline-block;
                margin: 0 -1000px;
                padding: 0 1000px;
            }

            .active {
                background: #0bcaf8;
                color: #fff;
            }

            .is-dragging {
                background-color: transparent !important;
                color: #000;
                opacity: 0.7;
            }

            .file-name,
            .folder-name,
            .file-desc,
            .folder-desc {
                margin-left: 4px;
            }

            .file-desc,
            .folder-desc {
                /*padding: 2px 8px;
            background: #87CEFF;
            color: #FFFFFF;*/
            }
        `
    ]
})
export class BsnAsyncTreeComponent extends CnComponentBase
    implements OnInit, OnDestroy {
    @Input()
    config;
    treeData;
    _relativeResolver;
    // _tempValue = {};
    checkedKeys = [];
    selectedKeys = [];
    _toTreeBefore = [];
    activedNode: NzTreeNode;
    _clickedNode: any;

    _statusSubscription: Subscription;
    _cascadeSubscription: Subscription;

    constructor(
        private _http: ApiService,
        private _messageService: RelativeService,
        @Inject(BSN_COMPONENT_MODES)
        private eventStatus: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
    }

    ngOnInit() {
        this.resolverRelation();
        if (this.config.componentType) {
            if (this.config.componentType.parent === true) {
                this.loadTreeData();
            }
            if (!this.config.componentType.child) {
                this.loadTreeData();
            }
        } else {
            this.loadTreeData();
        }
    }

    resolverRelation() {
        this._statusSubscription = this.eventStatus.subscribe(updateStatus => {
            if ((this.config.viewId = updateStatus._viewId)) {
                const option = updateStatus.option;
                switch (updateStatus._mode) {
                    case BSN_COMPONENT_MODES.ADD_NODE:
                        break;
                    case BSN_COMPONENT_MODES.DELETE_NODE:
                        break;
                    case BSN_COMPONENT_MODES.EDIT_NODE:
                        break;
                    case BSN_COMPONENT_MODES.SAVE:
                        break;
                    case BSN_COMPONENT_MODES.FORM:
                        break;
                    case BSN_COMPONENT_MODES.DIALOG:
                        break;
                    case BSN_COMPONENT_MODES.WINDOW:
                        break;
                }
            }
        });

        if (
            this.config.componentType &&
            this.config.componentType.parent === true
        ) {
            this.after(this, "clickNode", () => {
                this._clickedNode &&
                    this.cascade.next(
                        new BsnComponentMessage(
                            BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD,
                            this.config.viewId,
                            {
                                data: this._clickedNode
                            }
                        )
                    );
            });
        }

        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            this._statusSubscription = this.cascadeEvents.subscribe(
                cascadeEvent => {
                    if (
                        this.config.relations &&
                        this.config.relations.length > 0
                    ) {
                        this.config.relations.forEach(relation => {
                            if (
                                relation.relationViewId === cascadeEvent._viewId
                            ) {
                                // 获取当前设置的级联的模式
                                const mode =
                                    BSN_COMPONENT_CASCADE_MODES[
                                        relation.cascadeMode
                                    ];
                                // 获取传递的消息数据
                                const option = cascadeEvent.option;
                                // 解析参数
                                if (
                                    relation.params &&
                                    relation.params.length > 0
                                ) {
                                    relation.params.forEach(param => {
                                        this.tempValue()[param["cid"]] =
                                            option.data[param["pid"]];
                                    });
                                }
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.loadTreeData();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.loadTreeData();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.SELECTED_NODE:
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    async getAsyncTreeData(nodeValue = null) {
        return await this.execAjax(this.config.ajaxConfig, nodeValue, "load");
    }

    loadTreeData() {
        (async () => {
            const data = await this.getAsyncTreeData();
            // if (data.Data && data.Status === 200) {
            //     this.treeData = this.listToAsyncTreeData(data.Data, '');
            // }
            if (data.data && data.isSuccess) {
                this._toTreeBefore = data.data;
                this._toTreeBefore.forEach(d => {
                    if (this.config.columns) {
                        this.config.columns.forEach(col => {
                            d[col["field"]] = d[col["valueName"]];
                        });
                    }
                });
                let parent = "";
                // 解析出 parentid ,一次性加载目前只考虑一个值
                if (this.config.parent) {
                    this.config.parent.forEach(param => {
                        if (param.type === "tempValue") {
                            parent = this.tempValue()[param.valueName];
                        } else if (param.type === "value") {
                            if (param.value === "null") {
                                param.value = null;
                            }
                            parent = param.value;
                        } else if (param.type === "GUID") {
                            const fieldIdentity = CommonTools.uuID(10);
                            parent = fieldIdentity;
                        }
                    });
                }
                const result = [
                    new NzTreeNode({
                        title: "根节点",
                        key: "null",
                        isLeaf: false,
                        children: []
                    })
                ];
                result[0].children.push(
                    ...this.listToAsyncTreeData(this._toTreeBefore, parent)
                );
                this.treeData = result;
            }
        })();
    }

    listToAsyncTreeData(data, parentid): NzTreeNode[] {
        const result: NzTreeNode[] = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parentid) {
                temp = this.listToAsyncTreeData(data, data[i].key);
                if (temp.length > 0) {
                    data[i]["children"] = temp;
                    data[i]["isLeaf"] = false;
                } else {
                    data[i]["isLeaf"] = false;
                }
                data[i].level = "";
                result.push(new NzTreeNode(data[i]));
            }
        }
        return result;
    }

    ngOnDestroy() {
        // if (this._relativeResolver) {
        //     this._relativeResolver.unsubscribe();
        // }
        if (this._statusSubscription) {
            this._statusSubscription.unsubscribe();
        }
        if (this._cascadeSubscription) {
            this._cascadeSubscription.unsubscribe();
        }
    }

    async execAjax(p?, componentValue?, type?) {
        const params = {};
        let url;
        let tag = true;
        /*  if (!this.tempValue())  {
         this.tempValue() = {};
         } */
        if (p) {
            p.params.forEach(param => {
                if (param.type === "tempValue") {
                    if (type) {
                        if (type === "load") {
                            if (this.tempValue()[param.valueName]) {
                                params[param.name] = this.tempValue()[
                                    param.valueName
                                ];
                            } else {
                                // console.log('参数不全不能加载');
                                tag = false;
                                return;
                            }
                        } else {
                            params[param.name] = this.tempValue()[
                                param.valueName
                            ];
                        }
                    } else {
                        params[param.name] = this.tempValue()[param.valueName];
                    }
                } else if (param.type === "value") {
                    params[param.name] = param.value;
                } else if (param.type === "GUID") {
                    const fieldIdentity = CommonTools.uuID(10);
                    params[param.name] = fieldIdentity;
                } else if (param.type === "componentValue") {
                    params[param.name] = componentValue;
                }
            });
            if (this.isString(p.url)) {
                url = p.url;
            } else {
                let pc = "null";
                p.url.params.forEach(param => {
                    if (param["type"] === "value") {
                        pc = param.value;
                    } else if (param.type === "GUID") {
                        const fieldIdentity = CommonTools.uuID(10);
                        pc = fieldIdentity;
                    } else if (param.type === "componentValue") {
                        pc = componentValue.value;
                    } else if (param.type === "tempValue") {
                        pc = this.tempValue()[param.valueName];
                    }
                });
                url = p.url["parent"] + "/" + pc + "/" + p.url["child"];
            }
        }
        if (p.ajaxType === "get" && tag) {
            return this._http.getProj(url, params).toPromise();
        }
    }

    onMouseAction(actionName, $event) {
        this[actionName]($event);
    }

    expandNode = e => {
        (async () => {
            if (e.node.getChildren().length === 0 && e.node.isExpanded) {
                const s = await Promise.all(
                    this.config.expand
                        .filter(p => p.type === e.node.isLeaf)
                        .map(async expand => {
                            const data = await this.execAjax(
                                expand.ajaxConfig,
                                e.node.key,
                                "load"
                            );
                            if (data.isSuccess && data.data.length > 0) {
                                this._toTreeBefore.push(
                                    ...JSON.parse(JSON.stringify(data.data))
                                );
                                data.data.forEach(item => {
                                    item["isLeaf"] = false;
                                    item["children"] = [];
                                    if (this.config.columns) {
                                        this.config.columns.forEach(col => {
                                            item[col["field"]] =
                                                item[col["valueName"]];
                                        });
                                    }
                                });
                                e.node.addChildren(data.data);
                            }
                        })
                );
            }
        })();
    };

    clickNode = e => {
        if (this.activedNode) {
            this.activedNode = null;
        }
        e.node.isSelected = true;
        this.activedNode = e.node;
        // 从节点的列表中查找选中的数据对象
        this._clickedNode = this._toTreeBefore.find(n => n.Id === e.node.key);
    };

    isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === "[object String]";
    }
}

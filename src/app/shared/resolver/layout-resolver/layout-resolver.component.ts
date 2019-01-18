import { Component, Input, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_CASCADE, BsnComponentMessage } from "@core/relative-Service/BsnTableStatus";
import { CnComponentBase } from "@shared/components/cn-component-base";
import { Observable } from "rxjs";

@Component({
    selector: "cn-layout-resolver",
    templateUrl: "./layout-resolver.component.html",
    styles: [
        `
            :host ::ng-deep .ant-card-head {
                min-height: 36px;
            }
        `
    ]
})
export class LayoutResolverComponent extends CnComponentBase implements OnInit {
    @Input()
    config;
    @Input()
    permissions;
    @Input()
    layoutId;
    @Input()
    initData;
    @Input()
    tempValue;
    @Output()
    public updateValue = new EventEmitter();
    public value;
    constructor(@Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>) {
        super();
    }

    public ngOnInit() {
        this.resolverRelation();
    }

    public valueChange(data?) {
        this.value = data;
        console.log('布局信息返回', data, this.config);
        this.updateValue.emit(data);
    }

    private resolverRelation() {
        // 通过配置中的组件关系类型设置对应的事件接受者
        // 表格内部状态触发接收器console.log(this.config);
       // if (this.config.componentType && this.config.componentType.child === true) {
            this.cascadeSubscriptions = this.cascadeEvents.subscribe(
                cascadeEvent => {
                    // 解析子表消息配置
                    if (this.config.relations && this.config.relations.length > 0) {
                        this.config.relations.forEach(relation => {
                            if (relation.relationViewId === cascadeEvent._viewId) {
                                // 获取当前设置的级联的模式
                                const mode = BSN_COMPONENT_CASCADE_MODES[relation.cascadeMode];
                                // 获取传递的消息数据
                                const option = cascadeEvent.option;
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.AUTO_RESIZE:
                                        if (option) {
                                            // 解析参数
                                                this.autoResize(option.data['autoResize'])  
                                            

                                        }
                                        break;
                                }
                            }
                        });
                    }
                }
            );
       // }
    }

    /**
     * autoResize
     */
    public autoResize(d?) {

        d.forEach(item => {
            this.config.rows.forEach(row => {
                row.row.cols.forEach(col => {
                    if (col.viewId) {
                        if (col.viewId === item.viewId) {
                            col.span = item.span;
                            col.size = item.size;
                        }
                    }
                });
            });
        });
    }


}

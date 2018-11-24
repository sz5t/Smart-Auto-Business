import { BsnComponentMessage } from "@core/relative-Service/BsnTableStatus";
import { Observable, Observer } from "rxjs";
import {
    BSN_COMPONENT_CASCADE_MODES,
    BSN_COMPONENT_MODES
} from "@core/relative-Service/BsnTableStatus";
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    ViewEncapsulation
} from "@angular/core";
@Component({
    selector: "bsn-toolbar",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./bsn-toolbar.component.html",
    styles: [
        `
            .table-operations {
                padding-bottom: 3px;
            }

            .table-operations .ant-btn-group {
                margin-right: 4px;
                margin-bottom: 2px;
            }
        `
    ]
})
export class BsnToolbarComponent implements OnInit, OnDestroy {
    @Input()
    config;
    @Input()
    size;
    @Input()
    permissions = [];
    @Input()
    viewId;
    toolbarConfig = [];
    model;
    _cascadeState;
    toolbars;
    constructor(
        @Inject(BSN_COMPONENT_MODES)
        private state: Observer<BsnComponentMessage>
    ) {}

    ngOnInit() {

        if (Array.isArray(this.config)) {
            this.toolbars = this.config;
        } else if (this.config) {
            if (this.config.hasOwnProperty('toolbar')) {
                this.toolbars = this.config.toolbar;
            }
        }
        
        // if (this.config.toolbar) {
            
        // } else {
        //     this.toolbars = this.config;
        // }
        this.getPermissions();
    }

    getPermissions() {
        const permissionMap = new Map();
        this.permissions.forEach(item => {
            permissionMap.set(item.code, item);
        });
        if (this.toolbars && Array.isArray(this.toolbars)) {
            this.toolbars.forEach(item => {
                if (item.group) {
                    const groups = [];
                    item.group.forEach(g => {
                        if (permissionMap.has(g.name)) {
                            groups.push({ ...g });
                        } else if (g["cancelPermission"]) {
                            groups.push({ ...g });
                        }
                    });

                    this.toolbarConfig.push({ group: groups });
                } else if (item.dropdown) {
                    const dropdown = [];
                    item.dropdown.forEach(b => {
                        let is_dropdown = true;
                        if (permissionMap.has(b.name)) {
                            is_dropdown = false;
                        } else if (b["cancelPermission"]) {
                            is_dropdown = false;
                        }
                        if (is_dropdown) {
                            return true;
                        }
                        const down = {};
                        const { name, text, icon } = b;
                        down["name"] = name;
                        down["text"] = text;
                        down["icon"] = icon;
                        down["buttons"] = [];
                        b.buttons.forEach(btn => {
                            if (permissionMap.has(btn.name)) {
                                down["buttons"].push({ ...btn });
                            } else if (btn["cancelPermission"]) {
                                down["buttons"].push({ ...btn });
                            }
                        });
                        dropdown.push(down);
                    });
                    this.toolbarConfig.push({ dropdown: dropdown });
                }
            });
        }
    }

    toolbarAction(btn) {
        // console.log('send btn message', this.viewId);
        // const message = new BsnToolbarRelativeMessage();
        // message.action = this.TABLE_MODELS[btn.action];
        // message.messageData = this.config;
        // message.senderViewId = this.viewId;
        // 判断操作action的状态，根据状态发送具体消息
        // 消息的内容是什么？如何将消息与组件和数据进行关联
        // 根据按钮是否包含action属性，区别组件的内部状态操作还是进行数据操作
        const action = btn.action
            ? BSN_COMPONENT_MODES[btn.action]
            : BSN_COMPONENT_MODES["EXECUTE"];
        this._cascadeState = this.state.next(
            new BsnComponentMessage(action, this.viewId, {
                type: btn.actionType ? btn.actionType : null,
                name: btn.name ? btn.name : "",
                actionName: btn.actionName ? btn.actionName : null,
                ajaxConfig: btn.ajaxConfig ? btn.ajaxConfig : null
            })
        );
    }

    ngOnDestroy() {
        if (this._cascadeState) {
            this._cascadeState.unsubscribe();
        }
    }
}

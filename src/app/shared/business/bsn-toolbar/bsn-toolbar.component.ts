import { BsnComponentMessage } from '@core/relative-Service/BsnTableStatus';
import { Observable ,  Observer } from 'rxjs';
import { BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES } from '@core/relative-Service/BsnTableStatus';
import { Component, OnInit, Input, OnDestroy, Type, Inject, ViewEncapsulation } from '@angular/core';
@Component({
    selector: 'bsn-toolbar',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './bsn-toolbar.component.html',
    styles: [
        `
.table-operations {
  margin-bottom: 8px;
}

.table-operations .ant-btn-group {
  margin-right: 4px;
  margin-bottom: 2px;
}
`]
})
export class BsnToolbarComponent implements OnInit {
    @Input() config;
    @Input() size;
    @Input() permissions = [];
    @Input() viewId;
    toolbarConfig;
    model;
    constructor(
        @Inject(BSN_COMPONENT_MODES) private state: Observer<BsnComponentMessage>
    ) { }

    ngOnInit() {
        // if (this.permissions.length > 0) {
        //     this.toolbarConfig = this.getPermissions();
        // } else {
        //     this.toolbarConfig = this.config;
        // }
        // this.toolbarConfig = this.config;

    }

    getPermissions() {
        const stack = JSON.parse(JSON.stringify(this.config));
        const array = [];
        while (stack.length !== 0) {
            const s = stack.shift();
            if (s.type === 'group') {
                const groupBtn = JSON.parse(JSON.stringify(s));
                groupBtn.group = [];
                s.group.forEach(g => {
                    this.permissions.forEach(p => {
                        if (g.name === p.name) {
                            if (!p.hidden) {
                                if (p.disabled) {
                                    g['disabled'] = p.disabled;
                                }
                                groupBtn.group.push(g);
                            }
                        }
                    });
                });
                array.push(groupBtn);
            } else {
                for (let i = 0, len = this.permissions.length; i < len; i++) {
                    if (this.permissions[i].name === s.name) {
                        if (!this.permissions[i].hidden) {
                            if (this.permissions[i].disabled) {
                                s['disabled'] = this.permissions[i].disabled;
                            }
                            array.push(s);
                        }
                    }
                }
            }

        }
        return array;
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
            : BSN_COMPONENT_MODES['EXECUTE']
        this.state.next(
            new BsnComponentMessage(
                action,
                this.viewId,
                {
                    type: btn.actionType ? btn.actionType : null,
                    name: btn.actionName ? btn.actionName : null,
                    ajaxConfig: btn.ajaxConfig ? btn.ajaxConfig : null
                }
            )
        );
    }
}

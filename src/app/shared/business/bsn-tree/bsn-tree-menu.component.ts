import {
    BSN_COMPONENT_CASCADE_MODES, BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE,
    BSN_EXECUTE_ACTION
} from '@core/relative-Service/BsnTableStatus';
import {Component, OnInit, Input, OnDestroy, Inject, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzTreeNode, NzDropdownContextComponent, NzDropdownService } from 'ng-zorro-antd';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { Observer ,  Observable ,  Subscription } from 'rxjs';
@Component({
    selector: 'cn-bsn-tree-menu',
    template: `
        <ul nz-menu nzInDropDown *ngFor="let group of config">
            <li *ngFor="let btn of group.group"  nz-menu-item (click)="selectMenu(btn, group.relationViewId)">
                <span style="padding-left:15px;padding-right:15px;"><strong><i class="{{btn.icon}} {{btn.color}}"></i> {{btn.text}}</strong></span>
            </li>
        </ul>
    `
    })
export class CnBsnTreeMenuComponent extends CnComponentBase implements OnInit, OnDestroy {
    @Input() public config;
    @Input() public dropdown: NzDropdownContextComponent;
    public treeData;
    public _relativeResolver;
    public checkedKeys = [];
    public selectedKeys = [];
    public _toTreeBefore = [];
    public activedNode: NzTreeNode;
    public _cascadeState;
    public _checkItemList = [];
    constructor(
        private _http: ApiService,
        private _message: NzMessageService,
        private _modalService: NzModalService,
        private _dropdownService: NzDropdownService,
        @Inject(BSN_COMPONENT_MODES) private state: Observer<BsnComponentMessage>
    ) {
        super();
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        if (this._cascadeState) {
            this._cascadeState.unsubscribe();
        }
    }

    public selectMenu(menuConfig, relationViewId) {
        const action = menuConfig.action
            ? BSN_COMPONENT_MODES[menuConfig.action]
            : BSN_COMPONENT_MODES['EXECUTE'];
        this._cascadeState = this.state.next(
            new BsnComponentMessage(
                action,
                relationViewId,
                {
                    type: menuConfig.actionType ? menuConfig.actionType : null,
                    name: menuConfig.name ? menuConfig.name : null,
                    actionName: menuConfig.actionName ? menuConfig.actionName : null,
                    ajaxConfig: menuConfig.ajaxConfig ? menuConfig.ajaxConfig : null
                }
            )
        );
        this.dropdown.close();
    }


}
import { EventEmitter, ViewChildren, TemplateRef, QueryList, ViewChild, ElementRef } from '@angular/core';
import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    Type,
    Inject,
    AfterViewInit,
    Output
} from '@angular/core';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';
import {
    BSN_COMPONENT_MODES,
    BsnComponentMessage,
    BSN_COMPONENT_CASCADE,
    BSN_COMPONENT_CASCADE_MODES,
    BSN_FORM_STATUS,
    BSN_EXECUTE_ACTION,
    BSN_OUTPOUT_PARAMETER_TYPE
} from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { CommonTools } from '@core/utility/common-tools';
import { BeforeOperation } from '../before-operation.base';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-entry-card-list',
    templateUrl: './bsn-entry-card-list.component.html',
    styleUrls: [`bsn-entry-card-list.less`]
})
export class BsnEntryCardListComponent extends CnComponentBase
    implements OnInit, AfterViewInit, OnDestroy {
    @Input()
    public config;
    @Input()
    public viewId;
    @Input() public moduleName: any;
    @Input()
    public initData;
    public count = 0;
    public formConfig = {};
    public isLoading = true;
    public data;
    public _statusSubscription;
    public _cascadeSubscription;
    public title;
    public switchAll = false;
    public _lastItem;
    public selectedItems;
    public beforeOperation: BeforeOperation;
    public gridStyle = {
        width: '25%',
        textAlign: 'center',
        'padding': '24px',
        'font-size': '24px'
    };
    public bodyStyle = {
       
    }
    @Output() public updateValue = new EventEmitter();
    @ViewChildren('moduleList') public templateList: QueryList<ElementRef<any>>;
    constructor(
        private _apiService: ApiService,
        private _cacheService: CacheService,
        private _message: NzMessageService,
        private _modal: NzModalService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>,
        private _router: Router
    ) {
        super();
        this.apiResource = this._apiService;
        this.cacheValue = this._cacheService;
        this.baseModal = this._modal;
        this.baseMessage = this._message;

    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
        this.load();
    }

    private async _executeRequest(url, method, body) {
        return this.apiResource[method](url, body).toPromise();
    }
    /**
     * 根据表单组件routeParams属性配置参数,执行页面跳转
     * @param option 按钮操作配置参数
     */
    private linkToPage(option, pos) {
        this._router.navigate([`${option.appUrl}/${pos}`]);
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }

    public load() {
        const user = this.cacheValue.getNone('userInfo');
        this.data = user.modules;
        // const response = await this.get();
        // if (response.isSuccess) {
        //     this.data = response.data;
        //     this.getSelectedItems();
        //     this.isLoading = false;
        // } else {
        //     this.isLoading = false;
        // }
    }

    public async get() {
        const url = 'common/';
        const params = CommonTools.parametersResolver({
            params: this.config.ajaxConfig.params,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue,
            // routerValue : this.cacheValue
        });
        return this._apiService
            .get(url, params).toPromise();
    }


    public getItemValue(name, item) {
        let result;
        if (Array.isArray(this.config.fieldMapping)) {
            const index = this.config.fieldMapping.findIndex(s => s.name === name);
            index > -1 && (result = item[this.config.fieldMapping[index].field]);
        }
        return result;
    }

    public getMappingField(item, field) {
        let result;
        const excludeName = ['name', 'title', 'icon'];
        if (!excludeName.includes(field.name)) {
            result = item[field.field];
        }
        return result;
    }

    public selectItem(item, pos) {
        if (item.selected) {
            // item.selected = !item.selected;
        } else {
            if (!this._lastItem) {
                this._lastItem = item;
            } else {
                this._lastItem['selected'] = false;
            }
            item['selected'] = !item['selected'];
            this._lastItem = item;
        }
        this.getSelectedItems();

        this.linkToPage(item, pos);
    }

    public selectItems(item) {
        item.selected = !item.selected;
        this.getSelectedItems();
    }

    public ngAfterViewInit() {
        this.load();
        if (this.templateList !== null && this.templateList.length > 0) {
            this.templateList.forEach(eleRef => { 
               
                if(eleRef.nativeElement.id === this.moduleName) {
                    console.log(eleRef.nativeElement.id, this.moduleName);
                    //eleRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
                    eleRef.nativeElement.scrollIntoView(true);
                }
                
            });
        }
    }

    public switch() {
        this.data.forEach(d => d.selected = !!this.switchAll);
        this.getSelectedItems();
    }

    private getSelectedItems() {
        this.selectedItems =  this.data.filter(d => d.selected);
        this.updateValue.emit(this.selectedItems);
    }

    private getCheckedItemsId() {
        const ids = [];
        this.selectedItems =  this.data.filter(d => d.selected);
        if (this.selectedItems.length > 0) {
            this.selectedItems.forEach(item => {
                ids.push(item['Id']);
            });
        }
        return ids.join(',');
    }
}

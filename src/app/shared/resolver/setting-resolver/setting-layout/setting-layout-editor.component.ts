import { TypeOperationComponent } from './../../../../routes/system/data-manager/type-operation.component';
import { Component, OnInit, ViewChild, ComponentRef, ViewContainerRef, TemplateRef, ComponentFactoryResolver, AfterViewInit, Input, Type, OnChanges } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzDropdownContextComponent, NzMessageService, NzDropdownService } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { TabsResolverComponent } from '@shared/resolver/tabs-resolver/tabs-resolver.component';
const component: { [type: string]: Type<any> } = {
    tabs: TabsResolverComponent
  };
@Component({
    selector: 'cn-setting-layout-editor',
    templateUrl: './setting-layout-editor.component.html',
})
export class SettingLayoutEditorComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() config;
    @Input() blockId;
    @Input() layoutId;
    @Input() area;
    _serverLayoutId;
    menuConfig = [
        {
            label: '布局',
            value: {},
            children: [
                {
                    label: '标签页',
                    value: {
                        type: 'tabs',
                        config: [
                            {
                                id: `tab_${this.uuID(6)}`,
                                name: `Tab 1`,
                                config: {}
                            }
                        ]
                    }
                },
                {
                    label: '分步页',
                    value: {}
                },
                {
                    label: '折叠面板',
                    value: {}
                }
            ]
        }
    ];
    componentRef: ComponentRef<any>;
    @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
    _currentLyoutData;
    private dropdown: NzDropdownContextComponent;
    constructor(
        private _http: ApiService,
        private message: NzMessageService,
        private resolver: ComponentFactoryResolver,
        private nzDropdownService: NzDropdownService
    ) { }

    ngOnInit() {
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }

    async ngAfterViewInit() {
        // 获取组件区域数据
        /*
        const params = {
            BlockId: this.blockId,     // 区域ID
            // TagB: '',               // 组件类型
            LayoutId: this.layoutId // 布局ID
        };
        this._http.get(APIResource.AppConfigPack, params).subscribe(result => {
            if (result && result.Status === 200) {
                result.Data.forEach(data => {
                    const comp = data.TagB.substring(data.TagB.lastIndexOf('.') + 1, data.TagB.length);
                    if (comp === 'tabs') {
                        const d = {};
                        d['config'] = JSON.parse(data.Metadata);
                        d['dataList'] = [];
                        d['component'] = comp;
                        this.createBsnComponent(d);
                    } else {
                        // this.createBsnComponent(this._dataStruct[component]);
                    }

                    this._serverLayoutId = data.Id;
                });
            }
        }); */
    }

    ngOnChanges() {
        this.createBsnComponent();
    }

    createBsnComponent(event?) {      
        if (event) {
            this.config = event;
        }
        if (this.config && this.config.type) {
            // 保存选中组件数据
            //
            // 构建tabs/accordion/ 对象
            // 1、LayoutId, ParentId, Title, Icon, Type, showTitle
            this._currentLyoutData = {
                LayoutId: this.layoutId,
                Type: this.config.type,
                Title: '标签页',
                ParentId: this.blockId, // 当前布局区域ID
                ShowTitle: true
                // Metadata: JSON.stringify(this.config)
            };
            // 构建tab 对象
            // console.log(this._currentLyoutData);

            if (event) {
                (async() => {
                    const tabsResult = await this.save(this._currentLyoutData);
                    if (tabsResult && tabsResult.Status === 200) {
                        const tabData = {
                            LayoutId: this.layoutId,
                            Type: 'tab',
                            Title: '标签 1',
                            ParentId: tabsResult.Data.Id, // 当前布局区域ID
                            ShowTitle: true
                        };
                        const tabResult = await this.save(tabData);
                        if (tabResult.Status === 200 ) {
                            if (!component[this.config.type]) {
                                const supportedTypes = Object.keys(component).join(', ');
                                throw new Error(
                                    `Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`
                                );
                            }
                            this.container.clear();
                            const comp = this.resolver.resolveComponentFactory<any>(component[this.config.type]);
                            this.componentRef = this.container.createComponent(comp);
                            this.componentRef.instance.config = this.config.config;
                            this.componentRef.instance.dataList = this.config.dataList;
                            this.componentRef.instance.layoutId = this.layoutId;
                            this.componentRef.instance.blockId = this.blockId;
                            this.componentRef.instance.tabsId = tabsResult.Data.Id;
                        }
                    }
                })();
            } else {

            }
            
        }

    }

    saveComponent(data) {
        if (this.config.type === 'list') {
            if (this.config.component === 'tabs') {
                
            } else if (this.config.component === 'accordion') {

            } else if (this.config.component === 'step') {

            }
        } else {
            this._http.postProj(APIResource.BlockSetting, data).subscribe(result => {
                if (result && result.Status === 200) {
                    if (result && result.Status === 200) {
                        this.message.success('保存成功');
                    } else {
                        this.message.warning(`出现异常: ${result.Message}`);
                    }
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            });
        }
    }

    async save(body) {
        return this._http.postProj(APIResource.BlockSetting, body).toPromise();
    }

    async delete (param) {
        return this._http.deleteProj(APIResource.BlockSetting, param).toPromise();
    }

    async update (param) {
        return this._http.putProj(APIResource.BlockSetting, param).toPromise();
    }

   /*  _saveComponent() {
        const body: AppConfigPack_Block = {
            ParentId: this.layoutId,
            Name: this.blockId, // 组件名称
            TagA: this.uuID(10),
        };
        if (this.config.component === 'tabs') {
            body.Metadata = JSON.stringify(this.config.config);
            body.TagB = `tabs.${this.config.component}`;
        } else {
            body.TagB = `component.${this.config.component}`;
        }
        if (this._serverLayoutId) {
            body.Id = this._serverLayoutId;
            this._http.putProj(APIResource.AppConfigPack, body, { Id: this._serverLayoutId }).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        } else {
            this._http.postProj(APIResource.AppConfigPack, body).subscribe(result => {
                if (result && result.Status === 200) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.Message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            }
            );
        }
    } */

    async getTabComponent(blockId) {
        const params = {
            ParentId: this.layoutId,
            TagA: blockId
        };
        return this._http.get(APIResource.AppConfigPack, params).toPromise();
    }

    uuID(w) {
        let s = '';
        const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < w; i++) {
            s += str.charAt(Math.round(Math.random() * (str.length - 1)));
        }
        return s;
    }

}

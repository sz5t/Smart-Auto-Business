import { TypeOperationComponent } from '../../../../routes/system/data-manager/type-operation.component';
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
    @Input() bufferId;
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
                                config: []
                            }
                        ]
                    }
                },
                {
                    label: '分步页',
                    value: {
                        type: 'steps',
                        config: [
                            
                        ]
                    }
                },
                {
                    label: '折叠面板',
                    value: {
                        type: 'accordion',
                        config: [

                        ]
                    }
                }
            ]
        }
    ];
    componentRef: ComponentRef<any>;
    @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
    _currentLyoutData;
    private dropdown: NzDropdownContextComponent;
    constructor(
        private apiService: ApiService,
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
        const params = {
            // parentId: this.blockId,     // 区域ID
            bufferId: this.bufferId,    // 缓存ID
            layoutId: this.layoutId,     // 布局ID
            _recursive: true,
            _deep: -1
        };

        (async() => {
            const blockTypeData = await this.getBlockTypeByBufferId(this.blockId, params);
            if (blockTypeData.isSuccess && blockTypeData.data.length > 0) {
                // 渲染结构布局， tabs/steps/accordion
                blockTypeData.data.forEach(blockType => {
                    this.buildTypeLayout(blockType);
                });
            }
        })();
        // this.apiService.get('common/BlockSettingBuffer', params).subscribe(result => {
        //     if (result && result.status === 200 && result.isSuccess) {
        //         result.data.forEach(data => {
        //             const comp = data.type;
        //             if (comp === 'tabs') {
        //                 const d = {};
        //                 d['config'] = JSON.parse(data.metadata);
        //                 d['dataList'] = [];
        //                 d['component'] = comp;
        //                 this.createBsnComponent(d);
        //             } else {
        //                 // this.createBsnComponent(this._dataStruct[component]);
        //             }

        //             this._serverLayoutId = data.Id;
        //         });
        //     }
        // }); 
    }

    buildTabsLayoutData (blockType) {
        const tabs = [];
        blockType.children.forEach(element => {
            const tab = {};
            tab['id'] = element.Id;
            tab['name'] = element.title;
            tab['config'] = [];

            tabs.push(tab);
        });
        return tabs;
    }

    buildStepsLayoutData(blockType) {
        return null;
    }

    buildAccordionLayoutData(blockType) {
        return null;
    }

    buildTypeLayoutData(blockType) {
        if (blockType.type === 'tabs') {
            return this.buildTabsLayoutData(blockType);
        } else if (blockType.type === 'steps') {
            return this.buildStepsLayoutData(blockType);
        } else if (blockType.type === 'accordion') {
            return this.buildAccordionLayoutData(blockType);
        }
    }

    buildTypeLayout(blockTypeData) {
        if (this.checkBlockType(blockTypeData.type)) {
            this.container.clear();
            const comp = this.resolver.resolveComponentFactory<any>(component[blockTypeData.type]);
            this.componentRef = this.container.createComponent(comp);
            this.componentRef.instance.config = this.buildTypeLayoutData(blockTypeData);
            this.componentRef.instance.dataList = this.config.dataList;
            this.componentRef.instance.layoutId = this.layoutId;
            this.componentRef.instance.blockId = this.blockId;
            this.componentRef.instance.bufferId = this.bufferId;
            this.componentRef.instance.tabsId = blockTypeData.Id;
        }
    }

    checkBlockType(type) {
        if (!component[type]) {
            const supportedTypes = Object.keys(component).join(', ');
            throw new Error(
                `Trying to use an unsupported types (${type}).Supported types: ${supportedTypes}`
            );
        }
        return true;
    }

    ngOnChanges() {
        this.createBsnComponent();
    }

    createBsnComponent(event?) {      
        if (event) {
            this.config = event;
        }
        if (this.config && this.config.type) {
            this._currentLyoutData = {
                layoutId: this.layoutId,
                type: this.config.type,
                parentId: this.blockId, // 当前布局区域ID
                showTitle: 1,
                bufferId: this.bufferId
                // Metadata: JSON.stringify(this.config)
            };
            switch (this.config.type) {
                case 'tabs':
                this._currentLyoutData.title = '标签页';
                break;
                case 'steps':
                this._currentLyoutData.title = '分步页';
                break;
                case 'accordion':
                this._currentLyoutData.title = '折叠页';
                break;
            }

            console.log('bubfferId', this.bufferId);
            // 保存选中组件数据
            //
            // 构建tabs/accordion/ 对象
            // 1、LayoutId, ParentId, Title, Icon, Type, showTitle
            // this._currentLyoutData = {
            //     layoutId: this.layoutId,
            //     type: this.config.type,
            //     title: '标签页',
            //     parentId: this.blockId, // 当前布局区域ID
            //     showTitle: true
            //     // Metadata: JSON.stringify(this.config)
            // };
            // 构建tab 对象
            // console.log(this._currentLyoutData);

            if (event) {
                (async() => {
                    const tabsResult = await this.save(this._currentLyoutData);
                    if (tabsResult && tabsResult.status === 200 && tabsResult.isSuccess) {
                        const tabData = {
                            layoutId: this.layoutId,
                            type: 'tab',
                            title: '标签 1',
                            parentId: tabsResult.data.Id, // 当前布局区域ID
                            showTitle: 1,
                            bufferId: this.bufferId
                        };
                        const tabResult = await this.save(tabData);
                        if (tabResult.status === 200 && tabResult.isSuccess) {
                            if (!component[this.config.type]) {
                                const supportedTypes = Object.keys(component).join(', ');
                                throw new Error(
                                    `Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`
                                );
                            }
                            this.container.clear();
                            const comp = this.resolver.resolveComponentFactory<any>(component[this.config.type]);
                            this.componentRef = this.container.createComponent(comp);
                            console.log(this.config.config);
                            this.componentRef.instance.config = this.config.config;
                            this.componentRef.instance.dataList = this.config.dataList;
                            this.componentRef.instance.layoutId = this.layoutId;
                            this.componentRef.instance.blockId = this.blockId;
                            this.componentRef.instance.bufferId = this.bufferId;
                            this.componentRef.instance.tabsId = tabsResult.data.Id;
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
            this.apiService.post('common/BlockSettingBuffer', data).subscribe(result => {
                if (result && result.status === 200 && result.isSuccess) {
                    this.message.success('保存成功');
                } else {
                    this.message.warning(`出现异常: ${result.message}`);
                }
            }, error => {
                this.message.error(`出现错误：${error}`);
            });
        }
    }

    async save(body) {
        return this.apiService.post('common/BlockSettingBuffer', body).toPromise();
    }

    async delete (param) {
        return this.apiService.delete('common/BlockSettingBuffer', param).toPromise();
    }

    async update (param) {
        return this.apiService.put('common/BlockSettingBuffer', param).toPromise();
    }

    async getTabComponent(blockId) {
        
    }

    async getBlockTypeByBufferId(parentId, param) {
        return this.apiService.get(`common/BlockSettingBuffer/${parentId}/BlockSettingBuffer`, param).toPromise();
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

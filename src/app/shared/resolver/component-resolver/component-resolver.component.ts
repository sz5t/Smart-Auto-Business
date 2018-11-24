import { BsnToolbarComponent } from "./../../business/bsn-toolbar/bsn-toolbar.component";
import { BsnCardListComponent } from "./../../business/bsn-card-list/bsn-card-list.component";
import { BsnDataStepComponent } from "./../../business/bsn-data-step/bsn-data-step.component";
import { LineChartComponent } from "@shared/chart/line-chart/line-chart.component";
import { BsnStepComponent } from "@shared/business/bsn-step/bsn-step.component";
import { BsnAsyncTreeComponent } from "@shared/business/bsn-async-tree/bsn-async-tree.component";
import { SearchResolverComponent } from "@shared/resolver/form-resolver/search-resolver.component";
import { BsnTableComponent } from "@shared/business/bsn-data-table/bsn-table.component";
import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { BsnDataTableComponent } from "@shared/business/bsn-data-table/bsn-data-table.component";
import { FormResolverComponent } from "@shared/resolver/form-resolver/form-resolver.component";
import { CnCodeEditComponent } from "@shared/components/cn-code-edit/cn-code-edit.component";
import { CnBsnTreeComponent } from "@shared/business/bsn-tree/bsn-tree.component";
import { BarChartComponent } from "@shared/chart/bar-chart/bar-chart.component";
import { BsnAccordionComponent } from "@shared/business/bsn-accordion/bsn-accordion.component";
import { BsnTabsComponent } from "@shared/business/bsn-tabs/bsn-tabs.component";
import { BsnTransferComponent } from "@shared/business/bsn-transfer/bsn-transfer.component";
import { BsnTreeTableComponent } from "@shared/business/bsn-tree-table/bsn-tree-table.component";
import { WfDesignComponent } from "@shared/work-flow/wf-design/wf-design.component";
import { BsnCarouselComponent } from "@shared/business/bsn-carousel/bsn-carousel";
const components: { [type: string]: Type<any> } = {
    code_edit: CnCodeEditComponent,
    bsnTable: BsnTableComponent,
    bsnTreeTable: BsnTreeTableComponent,
    form_view: FormResolverComponent,
    search_view: SearchResolverComponent,
    bsnTree: CnBsnTreeComponent,
    bsnAsyncTree: BsnAsyncTreeComponent,
    bsnStep: BsnStepComponent,
    lineChart: LineChartComponent,
    barChart: BarChartComponent,
    bsnAccordion: BsnAccordionComponent,
    bsnTabs: BsnTabsComponent,
    bsnTransfer: BsnTransferComponent,
    dataSteps: BsnDataStepComponent,
    wf_design: WfDesignComponent,
    bsnCarousel: BsnCarouselComponent,
    bsnCardList: BsnCardListComponent,
    bsnToolbar: BsnToolbarComponent
};
@Component({
    selector: "cn-component-resolver",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./component-resolver.component.html"
})
export class ComponentResolverComponent
    implements OnInit, OnChanges, OnDestroy {
    @Input()
    config;
    @Input()
    permissions;
    @Input()
    blockId;
    @Input()
    layoutId;
    @Input()
    tempValue;
    @Input()
    initData;
    @Input()
    editable = true;
    componentRef: ComponentRef<any>;
    @ViewChild("dynamicComponent", { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(
        private http: _HttpClient,
        private resolver: ComponentFactoryResolver
    ) {}

    ngOnInit() {
        if (this.config) {
            this.createBsnComponent();
        }
    }

    ngOnChanges() {
        if (this.componentRef && this.config) {
            this.container.clear();
            this.createBsnComponent();
        }
    }

    createBsnComponent() {
        if (this.config.config) {
            if (!components[this.config.config.component]) {
                const supportedTypes = Object.keys(components).join(", ");
                throw new Error(
                    `Trying to use an unsupported types (${
                        this.config.config.component
                    }).Supported types: ${supportedTypes}`
                );
            }
            const comp = this.resolver.resolveComponentFactory<any>(
                components[this.config.config.component]
            );
            this.componentRef = this.container.createComponent(comp);
            this.componentRef.instance.config = this.config.config;
            if (this.tempValue && this.componentRef.instance.tempValue) {
                this.componentRef.instance.tempValue = this.tempValue;
            }

            if (this.initData) {
                this.componentRef.instance.initData = this.initData;
            }
            if (this.componentRef.instance.hasOwnProperty("permissions")) {
                this.componentRef.instance.permissions = this.permissions;
            }
            // if (this.componentRef.instance.dataList) {
            //     this.componentRef.instance.dataList = this.config.dataList;
            // }

            this.componentRef.instance.layoutId = this.layoutId;
            this.componentRef.instance.blockId = this.blockId;
        }
    }
    ngOnDestroy() {
        this.componentRef.destroy();
    }
}

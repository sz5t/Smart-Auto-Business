import { CnWeekPickerComponent } from './components/cn-date-picker/cn-week-picker.component';
import { CnMonthPickerComponent } from './components/cn-date-picker/cn-month-picker.component';
import { CnYearPickerComponent } from './components/cn-date-picker/cn-year-picker.component';
import { CnFormNumberComponent } from './components/cn-form-number/cn-form-number.component';
import { CnBsnTreeMenuComponent } from './business/bsn-tree/bsn-tree-menu.component';
import { BarChartComponent } from '@shared/chart/bar-chart/bar-chart.component';
import { TableChartComponent } from '../routes/template/table-chart/table-chart.component';
import { LineChartComponent } from '@shared/chart/line-chart/line-chart.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { ViserModule } from 'viser-ng';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import { ComponentResolverComponent } from '@shared/resolver/component-resolver/component-resolver.component';
import { ComponentSettingResolverComponent } from '@shared/resolver/component-resolver/component-setting-resolver.component';
import { LayoutResolverComponent } from '@shared/resolver/layout-resolver/layout-resolver.component';
import { LayoutSettingResolverComponent } from '@shared/resolver/layout-resolver/layout-setting-resolver.component';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
import { CnFormInputComponent } from '@shared/components/cn-form-input/cn-form-input.component';
import { CnFormSubmitComponent } from '@shared/components/cn-form-submit/cn-form-submit.component';
import { CnFormCheckboxGroupComponent } from '@shared/components/cn-form-checkbox-group/cn-form-checkbox-group.component';
import { CnFormRangePickerComponent } from '@shared/components/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormCheckboxComponent } from '@shared/components/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormRadioGroupComponent } from '@shared/components/cn-form-radio-group/cn-form-radio-group.component';
import { CnGridInputComponent } from '@shared/components/cn-grid-input/cn-grid-input.component';
import { CnGridSelectComponent } from '@shared/components/cn-grid-select/cn-grid-select.component';
import { BsnDataTableComponent } from '@shared/business/bsn-data-table/bsn-data-table.component';
import { BsnTableComponent } from '@shared/business/bsn-data-table/bsn-table.component';
import { TabsResolverComponent } from '@shared/resolver/tabs-resolver/tabs-resolver.component';
import { CnContextMenuComponent } from '@shared/components/cn-context-menu/cn-context-menu.component';
import { CnFormSelectComponent } from '@shared/components/cn-form-select/cn-form-select.component';
import { CnFormSelectMultipleComponent } from '@shared/components/cn-form-select-multiple/cn-form-select-multiple.component';
import { FormResolverDirective } from '@shared/resolver/form-resolver/form-resolver.directive';
import { GridEditorDirective } from '@shared/resolver/grid-resolver/grid-editor.directive';
import { SqlEditorComponent } from '@shared/business/sql-editor/sql-editor.component';
import { CnCodeEditComponent } from '@shared/components/cn-code-edit/cn-code-edit.component';
import { CnBsnTreeComponent } from '@shared/business/bsn-tree/bsn-tree.component';
import { BsnAsyncTreeComponent } from '@shared/business/bsn-async-tree/bsn-async-tree.component';
import { SettingLayoutComponent } from '@shared/resolver/setting-resolver/setting-layout/setting-layout.component';
import { SettingComponentComponent } from '@shared/resolver/setting-resolver/setting-component/setting-component.component';
import { SettingLayoutEditorComponent } from '@shared/resolver/setting-resolver/setting-layout/setting-layout-editor.component';
import { SettingComponentEditorComponent } from '@shared/resolver/setting-resolver/setting-component/setting-component-editor.component';
import { SearchResolverComponent } from '@shared/resolver/form-resolver/search-resolver.component';
import { CnFormSearchComponent } from '@shared/components/cn-form-search/cn-form-search.component';
import { CnDatePickerComponent } from '@shared/components/cn-date-picker/cn-date-picker.component';
import { CnTimePickerComponent } from '@shared/components/cn-time-picker/cn-time-picker.component';
import { CnGridDatePickerComponent } from '@shared/components/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridTimePickerComponent } from '@shared/components/cn-grid-time-picker/cn-grid-time-picker.component';
import { CnGridCheckboxComponent } from '@shared/components/cn-grid-checkbox/cn-grid-checkbox.component';
import { CnGridRangePickerComponent } from '@shared/components/cn-grid-range-picker/cn-grid-range-picker.component';
import { BsnToolbarComponent } from '@shared/business/bsn-toolbar/bsn-toolbar.component';
import { BsnStepComponent } from '@shared/business/bsn-step/bsn-step.component';
import { CnFormSelectTreeComponent } from '@shared/components/cn-form-select-tree/cn-form-select-tree.component';
import { CnFormSelectTreeMultipleComponent } from '@shared/components/cn-form-select-tree-multiple/cn-form-select-tree-multiple.component';
import { BtnTableFieldLimit } from '@core/pipe/btn-table-field-limit.pipe';
import { BsnAccordionComponent } from '@shared/business/bsn-accordion/bsn-accordion.component';
import { BsnTabsComponent } from '@shared/business/bsn-tabs/bsn-tabs.component';
import { CnFormTextareaComponent } from '@shared/components/cn-form-textarea/cn-form-textarea.component';
import { BsnUploadComponent } from './business/bsn-upload/bsn-upload.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CnGridSelectTreeComponent } from '@shared/components/cn-grid-select-tree/cn-grid-select-tree.component';
import { LayoutResolverDirective } from '@shared/resolver/layout-resolver/layout-resolver.directive';
import { CnFormLabelComponent } from '@shared/components/cn-form-label/cn-form-label.component';
import { CnFormLabelDirective } from '@shared/resolver/form-resolver/form-label.directive';
import { CnFormWindowResolverComponent } from '@shared/resolver/form-resolver/form-window-resolver.component';
import { BsnTransferComponent } from './business/bsn-transfer/bsn-transfer.component';
import { BsnTreeTableComponent } from '@shared/business/bsn-tree-table/bsn-tree-table.component';
import { CnFormHiddenComponent } from '@shared/components/cn-form-hidden/cn-form-hidden.component';
import { CnGridNumberComponent } from '@shared/components/cn-grid-munber/cn-grid-number.component';
import { BsnDataStepComponent } from './business/bsn-data-step/bsn-data-step.component';
import { WfDesignComponent } from './work-flow/wf-design/wf-design.component';
import { WfDashboardComponent } from './work-flow/wf-dashboard/wf-dashboard.component';
import { CnFormSelectGridComponent } from './components/cn-form-select-grid/cn-form-select-grid.component';
import { CnGridSelectGridComponent } from './components/cn-grid-select-grid/cn-grid-select-grid.component';
import { CnGridSelectTreegridComponent } from './components/cn-grid-select-treegrid/cn-grid-select-treegrid.component';
import { CnFormSelectTreegridComponent } from './components/cn-form-select-treegrid/cn-form-select-treegrid.component';
import { BsnCarouselComponent } from './business/bsn-carousel/bsn-carousel';
import { CnFormGridComponent } from './components/cn-form-grid/cn-form-grid.component';
import { BsnStaticTableComponent } from '@shared/business/bsn-data-table/bsn-static-table.component';
import { BsnCardListComponent } from './business/bsn-card-list/bsn-card-list.component';
import { BsnCardListItemComponent } from './business/bsn-card-list/bsn-card-list-item.component';
import { CnFormScancodeComponent } from './components/cn-form-scancode/cn-form-scancode.component';
import { CnGridSearchComponent } from './components/cn-grid-search/cn-grid-search.component';
import { CnGridBetweenInputComponent } from './components/cn-grid-between-input/cn-grid-between-input.component';
import { CnFormInputSelectComponent } from './components/cn-form-input-select/cn-form-input-select.component'
import { BsnReportComponent } from './business/bsn-report/bsn-report.component';
import { BsnAsyncTreeTableComponent } from './business/bsn-treeTable/bsn-treeTable.component';
import { CnFormSelectGridMultipleComponent } from './components/cn-form-select-grid-multiple/cn-form-select-grid-multiple.component';
import { CnGridSelectGridMultipleComponent } from './components/cn-grid-select-grid-multiple/cn-grid-select-grid-multiple.component';
import { TsDataTableComponent } from './business/ts-data-table/ts-data-table.component';
import { CnGridSelectMultipleComponent } from '@shared/components/cn-grid-select-multiple/cn-grid-select-multiple.component';
import { CnGridEditComponent } from './components/cn-grid-edit/cn-grid-edit.component';
import { BsnTagComponent } from './business/bsn-tag/bsn-tag.component';
import { CnFormSelectCustomComponent } from './components/cn-form-select-custom/cn-form-select-custom.component';
import { CnGridSelectCustomComponent } from './components/cn-grid-select-custom/cn-grid-select-custom.component';
import { CnFormSelectCustomMultipleComponent } from './components/cn-form-select-custom-multiple/cn-form-select-custom-multiple.component';
import { CnGridSelectCustomMultipleComponent } from './components/cn-grid-select-custom-multiple/cn-grid-select-custom-multiple.component';
import { CnGridUploadComponent } from './components/cn-grid-upload/cn-grid-upload.component';
import { CnGridUploadListComponent } from '@shared/components/cn-grid-upload-list/cn-grid-upload-list.component';
import { SafeUrlPipe } from '@core/pipe/safe-url.pipe';
import { BsnChartComponent } from './business/bsn-chart/bsn-chart.component';
import { BsnGanttComponent } from './business/bsn-gantt/bsn-gantt.component';


const THIRDMODULES = [
    NgZorroAntdModule,
    CountdownModule,
    UEditorModule,
    NgxTinymceModule,
    ViserModule
    // NzSchemaFormModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [
    ComponentResolverComponent,
    ComponentSettingResolverComponent,
    LayoutResolverComponent,
    LayoutSettingResolverComponent,
    FormResolverComponent,
    CnFormInputComponent,
    CnFormSubmitComponent,
    CnFormSelectComponent,
    CnFormSelectMultipleComponent,
    CnFormNumberComponent,
    CnDatePickerComponent,
    CnTimePickerComponent,
    CnFormRangePickerComponent,
    CnFormCheckboxComponent,
    CnFormCheckboxGroupComponent,
    CnFormTextareaComponent,
    CnFormRadioGroupComponent,
    CnGridInputComponent,
    CnGridSelectComponent,
    CnGridDatePickerComponent,
    CnGridTimePickerComponent,
    CnGridRangePickerComponent,
    CnGridCheckboxComponent,
    CnGridNumberComponent,
    BsnDataTableComponent,
    BsnTableComponent,
    BsnTreeTableComponent,
    CnContextMenuComponent,
    // CnCodeEditComponent,
    TabsResolverComponent,
    FormResolverComponent,
    CnCodeEditComponent,
    SqlEditorComponent,
    CnBsnTreeComponent,
    BsnAsyncTreeComponent,
    SettingLayoutComponent,
    SettingComponentComponent,
    SettingComponentEditorComponent,
    SettingLayoutEditorComponent,
    SearchResolverComponent,
    CnFormSearchComponent,
    BsnToolbarComponent,
    BsnStepComponent,
    BsnTreeTableComponent,
    TableChartComponent,
    LineChartComponent,
    BarChartComponent,
    CnFormSelectTreeComponent,
    CnFormSelectTreeMultipleComponent,
    BsnAccordionComponent,
    BsnTabsComponent,
    BsnUploadComponent,
    CnGridSelectTreeComponent,
    CnFormLabelComponent,
    CnFormWindowResolverComponent,
    BsnTransferComponent,
    CnFormHiddenComponent,
    CnBsnTreeMenuComponent,
    BsnDataStepComponent,
    WfDesignComponent,
    WfDashboardComponent,
    CnFormSelectGridComponent,
    CnGridSelectGridComponent,
    CnGridSelectTreegridComponent,
    CnFormSelectTreegridComponent,
    CnYearPickerComponent,
    CnMonthPickerComponent,
    CnWeekPickerComponent,
    BsnCarouselComponent,
    CnFormGridComponent,
    BsnStaticTableComponent,
    BsnCardListComponent,
    BsnCardListItemComponent,
    CnFormScancodeComponent,
    CnGridSearchComponent,
    CnGridBetweenInputComponent,
    BsnReportComponent,
    CnFormInputSelectComponent,
    BsnAsyncTreeTableComponent,
    CnFormSelectGridMultipleComponent,
    CnGridSelectGridMultipleComponent,
    TsDataTableComponent,
    CnGridSelectMultipleComponent,
    CnGridEditComponent,
    BsnTagComponent,
    CnFormSelectCustomComponent,
    CnGridSelectCustomComponent,
    CnFormSelectCustomMultipleComponent,
    CnGridSelectCustomMultipleComponent,
    CnGridUploadComponent,
    CnGridUploadListComponent,
    BsnChartComponent,
    BsnGanttComponent
];
const DIRECTIVES = [
    FormResolverDirective,
    GridEditorDirective,
    CnFormLabelDirective,
    LayoutResolverDirective
];
// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        InfiniteScrollModule,
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        BtnTableFieldLimit,
        SafeUrlPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    entryComponents: [...COMPONENTS]
})
export class SharedModule {}

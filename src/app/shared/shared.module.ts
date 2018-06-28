import { BarChartComponent } from './chart/bar-chart/bar-chart.component';
import { TableChartComponent } from './../routes/template/table-chart/table-chart.component';
import { LineChartComponent } from './chart/line-chart/line-chart.component';

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
import { ComponentResolverComponent } from './resolver/component-resolver/component-resolver.component';
import { ComponentSettingResolverComponent } from './resolver/component-resolver/component-setting-resolver.component';
import { LayoutResolverComponent } from './resolver/layout-resolver/layout-resolver.component';
import { LayoutSettingResolverComponent } from './resolver/layout-resolver/layout-setting-resolver.component';
import { FormResolverComponent } from './resolver/form-resolver/form-resolver.component';
import { CnFormInputComponent } from './components/cn-form-input/cn-form-input.component';
import { CnFormSubmitComponent } from './components/cn-form-submit/cn-form-submit.component';
import { CnFormCheckboxGroupComponent } from './components/cn-form-checkbox-group/cn-form-checkbox-group.component';
import { CnFormRangePickerComponent } from './components/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormCheckboxComponent } from './components/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormRadioGroupComponent } from './components/cn-form-radio-group/cn-form-radio-group.component';
import { CnGridInputComponent } from './components/cn-grid-input/cn-grid-input.component';
import { CnGridSelectComponent } from './components/cn-grid-select/cn-grid-select.component';
import { BsnDataTableComponent } from './business/bsn-data-table/bsn-data-table.component';
import { BsnTableComponent } from './business/bsn-data-table/bsn-table.component';
import { TabsResolverComponent } from './resolver/tabs-resolver/tabs-resolver.component';
import { CnContextMenuComponent } from './components/cn-context-menu/cn-context-menu.component';
import { CnFormSelectComponent } from './components/cn-form-select/cn-form-select.component';
import { FormResolverDirective } from './resolver/form-resolver/form-resolver.directive';
import { GridEditorDirective } from './resolver/grid-resolver/grid-editor.directive';
import { SqlEditorComponent } from './business/sql-editor/sql-editor.component';
import { CnCodeEditComponent } from './components/cn-code-edit/cn-code-edit.component';
import { CnBsnTreeComponent } from './business/bsn-tree/bsn-tree.component';
import { BsnAsyncTreeComponent } from './business/bsn-async-tree/bsn-async-tree.component';
import { SettingLayoutComponent } from './resolver/setting-resolver/setting-layout/setting-layout.component';
import { SettingComponentComponent } from './resolver/setting-resolver/setting-component/setting-component.component';
import { SettingLayoutEditorComponent } from './resolver/setting-resolver/setting-layout/setting-layout-editor.component';
import { SettingComponentEditorComponent } from './resolver/setting-resolver/setting-component/setting-component-editor.component';
import { BsnTreeTableComponent } from './business/bsn-tree-table/bsn-tree-table.component';
import { SearchResolverComponent } from './resolver/form-resolver/search-resolver.component';
import { CnFormSearchComponent } from './components/cn-form-search/cn-form-search.component';
import { CnDatePickerComponent } from './components/cn-date-picker/cn-date-picker.component';
import { CnTimePickerComponent } from './components/cn-time-picker/cn-time-picker.component';
import { CnGridDatePickerComponent } from './components/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridTimePickerComponent } from './components/cn-grid-time-picker/cn-grid-time-picker.component';
import { CnGridCheckboxComponent } from './components/cn-grid-checkbox/cn-grid-checkbox.component';
import { CnGridRangePickerComponent } from './components/cn-grid-range-picker/cn-grid-range-picker.component';
import { BsnToolbarComponent } from './business/bsn-toolbar/bsn-toolbar.component';
import { BsnStepComponent } from './business/bsn-step/bsn-step.component';
// import { NzSchemaFormModule } from 'nz-schema-form';
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
    CnDatePickerComponent,
    CnTimePickerComponent,
    CnFormRangePickerComponent,
    CnFormCheckboxComponent,
    CnFormCheckboxGroupComponent,
    CnFormRadioGroupComponent,
    CnGridInputComponent,
    CnGridSelectComponent,
    CnGridDatePickerComponent,
    CnGridTimePickerComponent,
    CnGridRangePickerComponent,
    CnGridCheckboxComponent,
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
    BarChartComponent
];
const DIRECTIVES = [
    FormResolverDirective,
    GridEditorDirective
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
        // third libs
        ...THIRDMODULES
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
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
    entryComponents: [
        ...COMPONENTS
    ]
})
export class SharedModule { }

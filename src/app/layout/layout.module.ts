import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';

import { TsHeaderSearchComponent } from './ts-default/ts-header/ts-components/ts-search.component';
import { TsHeaderNotifyComponent } from './ts-default/ts-header/ts-components/ts-notify.component';
import { TsHeaderTaskComponent } from './ts-default/ts-header/ts-components/ts-task.component';
import { TsHeaderIconComponent } from './ts-default/ts-header/ts-components/ts-icon.component';
import { TsHeaderI18nComponent } from './ts-default/ts-header/ts-components/ts-i18n.component';
import { TsHeaderStorageComponent } from './ts-default/ts-header/ts-components/ts-storage.component';
import { TsHeaderUserComponent } from './ts-default/ts-header/ts-components/user.component';
import { TsLayoutPassportComponent } from './ts-passport/ts-passport.component';

import { LayoutPassportComponent } from './passport/passport.component';
import { TsHeaderComponent } from './ts-default/ts-header/ts-header.component';
import { TsHeaderFullScreenComponent } from './ts-default/ts-header/ts-components/ts-fullscreen.component';
import { TsLayoutDefaultComponent } from './ts-default/ts-default.component';
import { TsSidebarComponent } from './ts-default/ts-sidebar/ts-sidebar.component';

const COMPONENTS = [
    LayoutDefaultComponent,
    LayoutFullScreenComponent,
    HeaderComponent,
    SidebarComponent,
    TsHeaderComponent,
    TsHeaderFullScreenComponent,
    TsLayoutDefaultComponent,
    TsSidebarComponent,
    TsLayoutPassportComponent
];

const HEADERCOMPONENTS = [
    HeaderSearchComponent,
    HeaderNotifyComponent,
    HeaderTaskComponent,
    HeaderIconComponent,
    HeaderFullScreenComponent,
    HeaderI18nComponent,
    HeaderStorageComponent,
    HeaderUserComponent,
    TsHeaderSearchComponent,
    TsHeaderNotifyComponent,
    TsHeaderTaskComponent,
    TsHeaderIconComponent,
    TsHeaderFullScreenComponent,
    TsHeaderI18nComponent,
    TsHeaderStorageComponent,
    TsHeaderUserComponent
];

// passport

const PASSPORT = [
    LayoutPassportComponent
];

@NgModule({
    imports: [SharedModule],
    providers: [],
    declarations: [
        ...COMPONENTS,
        ...HEADERCOMPONENTS,
        ...PASSPORT
    ],
    exports: [
        ...COMPONENTS,
        ...PASSPORT,
        ...HEADERCOMPONENTS
    ]
})
export class LayoutModule { }

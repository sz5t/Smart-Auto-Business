import { Component, HostBinding, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { SettingsService, TitleService } from "@delon/theme";
import { filter } from "rxjs/operators";
import { ApartmentOutline } from "@ant-design/icons-angular/icons";
import { NzIconService } from "ng-zorro-antd";

@Component({
    selector: "app-root",
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    @HostBinding("class.layout-fixed")
    get isFixed() {
        return this.settings.layout.fixed;
    }
    @HostBinding("class.layout-boxed")
    get isBoxed() {
        return this.settings.layout.boxed;
    }
    @HostBinding("class.aside-collapsed")
    get isCollapsed() {
        return this.settings.layout.collapsed;
    }

    constructor(
        private iconService: NzIconService,
        private settings: SettingsService,
        private router: Router,
        private titleSrv: TitleService
    ) {
        if (typeof G2 !== "undefined") G2.track(false);
        this.iconService.addIcon(ApartmentOutline);
        this.iconService.twoToneColor = { primaryColor: "#1890ff" };
    }

    ngOnInit() {
        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe(() => this.titleSrv.setTitle());
    }
}

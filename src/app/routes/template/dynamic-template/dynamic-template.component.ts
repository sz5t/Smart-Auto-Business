import { ApiService } from './../../../core/utility/api-service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'cn-dynamic-template',
    templateUrl: './dynamic-template.component.html',
})
export class DynamicTemplateComponent implements OnInit, OnDestroy {
    title;
    config;
    constructor(
        private http: ApiService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.http.getLocalData(params.name).subscribe(data => {
                this.config = data;
            });
        });
        
    }

    ngOnDestroy(): void {
        this.config = null;
        // throw new Error("Method not implemented.");
    }

}

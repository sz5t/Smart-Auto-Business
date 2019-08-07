import { ApiService } from '@core/utility/api-service';
import { APIResource } from './../../core/utility/api-resource';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ts-layout-passport',
    templateUrl: './ts-passport.component.html',
    styleUrls: ['./ts-passport.component.less']
})
export class TsLayoutPassportComponent implements OnInit {
    public links = [
        {
            title: '帮助',
            href: ''
        },
        {
            title: '隐私',
            href: ''
        },
        {
            title: '条款',
            href: ''
        }
    ];
    public title: string;
    public subTitle: string;
    public company: string;
    public year: string
    constructor(
        private _route: ActivatedRoute,
        private _apiService: ApiService
    ) {

    }

    public ngOnInit() {
        this._apiService.getSystemConfig().subscribe(s => {
            this.title = s.title;
            this.subTitle = s.subTitle;
            this.year = s.year;
            this.company = s.company;
        });
        // this._route.data.subscribe(data => {
        //     this.title = data['title'] ? data['title'] : 'Smart One 自动化业务平台';
        //     this.subTitle = data['sub'] ? data['sub'] : '管理系统'
        // });
    }

}

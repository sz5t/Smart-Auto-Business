import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'layout-passport',
    templateUrl: './passport.component.html',
    styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit {
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
    private title: string;
    private subTitle: string;
    constructor(private _route: ActivatedRoute) {
        
    }

    public ngOnInit() {
        this._route.data.subscribe(data => {
            this.title = data['title'] ? data['title'] : 'Smart One 自动化业务平台';
            this.subTitle = data['sub'] ? data['sub'] : '管理系统'

        })
    }

}

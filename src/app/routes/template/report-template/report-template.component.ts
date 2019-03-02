import {
    Component,
    OnInit,
    AfterViewInit,
    ViewEncapsulation
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cn-report-template',
    templateUrl: './report-template.component.html'
})
export class ReportTemplateComponent implements OnInit {
    constructor() {}

    public config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: 'area1',
                            // title: '左树',
                            span: 24,
                            size: {
                                nzXs: 24,
                                nzSm: 24,
                                nzMd: 24,
                                nzLg: 24,
                                ngXl: 24
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: 'tree_and_mulit_tree',
                                        component: 'bsnReport',
                                        reportName: 'R_gongyibaobiao.grf',
                                        componentType: {
                                            parent: false,
                                            child: false,
                                            own: true
                                        },
                                        ajaxConfig: {
                                            url: 'common/RepDMPM',
                                            ajaxType: 'get',
                                            params: [
                                                {
                                                    name: 'mpfid',
                                                    type: 'value',
                                                    value: 'f9a5bda095c449d79240119366a2c47d',
                                                }
                                                // {
                                                //     name: 'guocheng',
                                                //     children: [
                                                //         {
                                                //             name: '$operDataType$',
                                                //             type: 'value',
                                                //             value: 'select'
                                                //         },
                                                //         {
                                                //             name: 'processrouteid',
                                                //             type: 'value',
                                                //             value: '1'
                                                //         },
                                                //         {
                                                //             name: 'processtype',
                                                //             type: 'value',
                                                //             value: '1'
                                                //         },
                                                //         {
                                                //             name: 'gongxuka',
                                                //             children: [
                                                //                 {
                                                //                     name: '$operDataType$',
                                                //                     type: 'value',
                                                //                     value: 'select'
                                                //                 }
                                                //             ]
                                                //         }
                                                //     ] 
                                                // }
                                            ]
                                        }
                                    },
                                    dataList: []
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    };

    public ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }
}

import {
    Component,
    OnInit,
    AfterViewInit,
    ViewEncapsulation
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    selector: 'cn-report-template',
    templateUrl: './report-template.component.html'
})
export class ReportTemplateComponent implements OnInit {
    constructor() {}

    private config = {
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
                                        reportName: 'getMpmBaseProcess',
                                        componentType: {
                                            parent: false,
                                            child: false,
                                            own: true
                                        },
                                        ajaxConfig: {
                                            url: 'common/RepMPM',
                                            ajaxType: 'post',
                                            params: [
                                                {
                                                    name: 'Id',
                                                    type: 'value',
                                                    value: '1ca111ea09514483a1175f0118916cb0',
                                                },
                                                {
                                                    name: 'guocheng',
                                                    children: [
                                                        {
                                                            name: '$operDataType$',
                                                            type: 'value',
                                                            value: 'select'
                                                        },
                                                        {
                                                            name: 'processrouteid',
                                                            type: 'value',
                                                            value: '1'
                                                        },
                                                        {
                                                            name: 'processtype',
                                                            type: 'value',
                                                            value: '1'
                                                        },
                                                        {
                                                            name: 'gongxuka',
                                                            children: [
                                                                {
                                                                    name: '$operDataType$',
                                                                    type: 'value',
                                                                    value: 'select'
                                                                }
                                                            ]
                                                        }
                                                    ] 
                                                }
                                                

                                                // children: [
                                                //     {
                                                //         name: 'guocheng',
                                                //         type: '',
                                                //         value: ''
                                                //     },
                                                //     {
                                                //         name: '$operDataType$',
                                                //         type: 'value',
                                                //         value: 'select'
                                                //     },
                                                //     {
                                                //         name: 'processrouteid',
                                                //         type: 'value',
                                                //         value: '1'
                                                //     },
                                                //     {
                                                //         name: 'processrouteid',
                                                //         type: 'value',
                                                //         value: '1'
                                                //     }
                                                // ]
                                                // {
                                                //     Id: '1ca111ea09514483a1175f0118916cb0',
                                                //    
                                                //     guocheng: [
                                                //         {
                                                //             processrouteid: '1',
                                                //             processtype: '1',
                                                //             // name: '$operDataType$',
                                                //             // type: 'value',
                                                //             // value: 'select',
                                                //             gongxuka: [
                                                //                 {
                                                //                     // name: '$operDataType$',
                                                //                     // type: 'value',
                                                //                     // value: 'select'
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

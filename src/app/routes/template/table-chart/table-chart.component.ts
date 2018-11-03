import {
    Component,
    OnInit,
    ViewChild,
    Input,
    ElementRef,
    AfterViewInit,
    ViewEncapsulation
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { SimpleTableColumn, SimpleTableComponent } from "@delon/abc";
import { Form, FormGroup } from "@angular/forms";
@Component({
    selector: "cn-table-chart",
    templateUrl: "./table-chart.component.html",
    encapsulation: ViewEncapsulation.None,
    styleUrls: ["./table-chart.css"]
})
export class TableChartComponent implements OnInit, AfterViewInit {
    config = {
        rows: [
            {
                row: {
                    cols: [
                        {
                            id: "area1",
                            // title: '数据网格',
                            span: 24,
                            icon: "icon-list",
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
                                        title: "数据网格",
                                        viewId: "chartTable",
                                        component: "bsnTable",
                                        info: true,
                                        keyId: "Id",
                                        pagination: true, // 是否分页
                                        showTotal: true, // 是否显示总数据量
                                        pageSize: 5, // 默认每页数据条数
                                        pageSizeOptions: [
                                            5,
                                            18,
                                            20,
                                            30,
                                            40,
                                            50
                                        ],
                                        ajaxConfig: {
                                            // 'url': 'common/ShowCase',
                                            url: "common/GetCase",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "parentId",
                                                    type: "value",
                                                    valueName: "",
                                                    value: null
                                                }
                                            ]
                                        },
                                        columns: [
                                            {
                                                title: "序号",
                                                field: "_serilize",
                                                width: "50px",
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "Id",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "Id",
                                                field: "Id",
                                                width: 80,
                                                hidden: true,
                                                editor: {
                                                    type: "input",
                                                    field: "Id",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "名称",
                                                field: "caseName",
                                                width: "90px",
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "caseName",
                                                    options: {
                                                        type: "input",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "类别",
                                                field: "typeName",
                                                width: "100px",
                                                hidden: false,
                                                showFilter: true,
                                                showSort: true,
                                                editor: {
                                                    type: "select",
                                                    field: "Type",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "Type",
                                                        label: "Type",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder:
                                                            "-请选择数据-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "200px",
                                                        dataSet: "getCaseName",
                                                        options: [
                                                            {
                                                                label: "表格",
                                                                value: "1",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "树组件",
                                                                value: "2",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "树表",
                                                                value: "3",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "表单",
                                                                value: "4",
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "标签页",
                                                                value: "5",
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                title: "数量",
                                                field: "caseCount",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "caseCount",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "级别",
                                                field: "caseLevel",
                                                width: 80,
                                                hidden: false,
                                                showFilter: false,
                                                showSort: false,
                                                editor: {
                                                    type: "input",
                                                    field: "caseLevel",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "创建时间",
                                                field: "createDate",
                                                width: 80,
                                                hidden: false,
                                                dataType: "date",
                                                editor: {
                                                    type: "input",
                                                    pipe: "datetime",
                                                    field: "createDate",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "datetime"
                                                    }
                                                }
                                            },
                                            {
                                                title: "备注",
                                                field: "remark",
                                                width: 80,
                                                hidden: false,
                                                editor: {
                                                    type: "input",
                                                    field: "remark",
                                                    options: {
                                                        type: "input",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "text"
                                                    }
                                                }
                                            },
                                            {
                                                title: "状态",
                                                field: "enableText",
                                                width: 80,
                                                hidden: false,
                                                formatter: [
                                                    {
                                                        value: "启用",
                                                        bgcolor: "",
                                                        fontcolor: "text-blue",
                                                        valueas: "启用"
                                                    },
                                                    {
                                                        value: "禁用",
                                                        bgcolor: "",
                                                        fontcolor: "text-red",
                                                        valueas: "禁用"
                                                    }
                                                ],
                                                editor: {
                                                    type: "select",
                                                    field: "enabled",
                                                    options: {
                                                        type: "select",
                                                        labelSize: "6",
                                                        controlSize: "18",
                                                        inputType: "submit",
                                                        name: "enabled",
                                                        notFoundContent: "",
                                                        selectModel: false,
                                                        showSearch: true,
                                                        placeholder: "-请选择-",
                                                        disabled: false,
                                                        size: "default",
                                                        clear: true,
                                                        width: "80px",
                                                        options: [
                                                            {
                                                                label: "启用",
                                                                value: true,
                                                                disabled: false
                                                            },
                                                            {
                                                                label: "禁用",
                                                                value: false,
                                                                disabled: false
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ],
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            own: true
                                        }
                                    },
                                    dataList: []
                                }
                            ]
                        }
                    ]
                }
            },
            {
                row: {
                    cols: [
                        {
                            id: "area2",
                            span: 12,
                            icon: "icon-list",
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 12,
                                nzLg: 12,
                                ngXl: 12
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart1",
                                        component: "barChart",
                                        keyId: "Id",
                                        height: 300,
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "parentId",
                                                    type: "tempValue",
                                                    valueName: "_parentId"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "chartTable",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "Id",
                                                        cid: "_parentId"
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        options: {
                                            scales: {
                                                caseName: {
                                                    alias: "用例"
                                                },
                                                caseCount: {
                                                    alias: "数量"
                                                }
                                            },
                                            geoms: [
                                                {
                                                    type: "interval",
                                                    position:
                                                        "caseName*caseCount",
                                                    color: "caseName"
                                                }
                                            ]
                                            // 'coord': {},
                                            // 'axes': {},
                                            // 'legends': {},
                                            // 'guides': [],
                                            // 'filter': {},
                                            // 'tooltip': {}
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: "area2",
                            span: 12,
                            icon: "icon-list",
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 12,
                                nzLg: 12,
                                ngXl: 12
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart1e",
                                        component: "barChart",
                                        keyId: "Id",
                                        height: 300,
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "parentId",
                                                    type: "tempValue",
                                                    valueName: "_parentId"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "chartTable",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "Id",
                                                        cid: "_parentId"
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        options: {
                                            scales: {
                                                caseName: {
                                                    alias: "用例"
                                                },
                                                caseCount: {
                                                    alias: "数量",
                                                    min: 0
                                                }
                                            },
                                            geoms: [
                                                {
                                                    type: "line",
                                                    position:
                                                        "caseName*caseCount"
                                                },
                                                {
                                                    type: "point",
                                                    position:
                                                        "caseName*caseCount",
                                                    // color: 'caseName',
                                                    size: 4,
                                                    shape: "circle",
                                                    style: {
                                                        stroke: "#fff",
                                                        lineWidth: 1
                                                    }
                                                }
                                            ],
                                            // 'coord': {},
                                            // 'axes': {},
                                            // 'legends': {},
                                            // 'guides': [],
                                            // 'filter': {},
                                            tooltip: {
                                                crosshairs: {
                                                    type: "line"
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                row: {
                    cols: [
                        {
                            id: "area2",
                            span: 12,
                            icon: "icon-list",
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 12,
                                nzLg: 12,
                                ngXl: 12
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart1e",
                                        component: "barChart",
                                        keyId: "Id",
                                        height: 300,
                                        ajaxConfig: {
                                            url: "common/GetCasePercent",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "_parentId",
                                                    type: "tempValue",
                                                    valueName: "_parentId"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "chartTable",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "Id",
                                                        cid: "_parentId"
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        options: {
                                            scales: {
                                                casePercent: {
                                                    type: "cat"
                                                },
                                                casePercentText: {
                                                    type: "cat"
                                                }
                                            },
                                            geoms: [
                                                {
                                                    type: "intervalStack",
                                                    position: "casePercent",
                                                    color: "caseName",
                                                    style: {
                                                        stroke: "#fff",
                                                        lineWidth: 1
                                                    },
                                                    label: {
                                                        field: "casePercentText"
                                                    },
                                                    tooltip: {
                                                        field:
                                                            "caseName*casePercent"
                                                    }
                                                }
                                            ],
                                            coord: {
                                                type: "theta",
                                                cfg: {
                                                    radius: 0.75
                                                }
                                            },
                                            // 'axes': {},
                                            // 'legends': {},
                                            // 'guides': [],
                                            // 'filter': {},
                                            tooltip: {
                                                showTitle: true,
                                                itemTpl:
                                                    '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}</li>'
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: "area4",
                            span: 12,
                            icon: "icon-list",
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 12,
                                nzLg: 12,
                                ngXl: 12
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart1e",
                                        component: "barChart",
                                        keyId: "Id",
                                        height: 300,
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "parentId",
                                                    type: "tempValue",
                                                    valueName: "_parentId"
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: false,
                                            child: true,
                                            own: true
                                        },
                                        relations: [
                                            {
                                                relationViewId: "chartTable",
                                                cascadeMode: "REFRESH_AS_CHILD",
                                                params: [
                                                    {
                                                        pid: "Id",
                                                        cid: "_parentId"
                                                    }
                                                ],
                                                relationReceiveContent: []
                                            }
                                        ],
                                        options: {
                                            scales: {
                                                caseName: {
                                                    alias: "用例"
                                                },
                                                caseCount: {
                                                    alias: "数量",
                                                    min: 0
                                                }
                                            },
                                            geoms: [
                                                {
                                                    type: "line",
                                                    position:
                                                        "caseName*caseCount"
                                                },
                                                {
                                                    type: "point",
                                                    position:
                                                        "caseName*caseCount",
                                                    // color: 'caseName',
                                                    size: 4,
                                                    shape: "circle",
                                                    style: {
                                                        stroke: "#fff",
                                                        lineWidth: 1
                                                    }
                                                }
                                            ],
                                            // 'coord': {},
                                            // 'axes': {},
                                            // 'legends': {},
                                            // 'guides': [],
                                            // 'filter': {},
                                            tooltip: {
                                                crosshairs: {
                                                    type: "line"
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                row: {
                    cols: [
                        {
                            id: "dataSteps",
                            span: 24,
                            icon: "icon-list",
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
                                        viewId: "chart",
                                        component: "dataSteps",
                                        width: 1400,
                                        height: 60,
                                        stepNum: 50,
                                        startX: 100,
                                        startY: 100,
                                        textField: "caseName",
                                        mainTitle: "",
                                        subTitle: "",
                                        position: "lc",
                                        direction: "horizontal",
                                        labelOffsetX: 0,
                                        labelOffsetY: -30,
                                        size: 40,
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ]
                                        },
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            sub: false
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                row: {
                    cols: [
                        {
                            id: "dataSteps",
                            span: 3,
                            icon: "icon-list",
                            size: {
                                nzXs: 3,
                                nzSm: 3,
                                nzMd: 3,
                                nzLg: 3,
                                ngXl: 3
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart34",
                                        component: "dataSteps",
                                        width: 120,
                                        height: 1000,
                                        stepNum: 50,
                                        startX: 75,
                                        startY: 75,
                                        position: "tr",
                                        direction: "vertical",
                                        textField: "caseName",
                                        mainTitle: "",
                                        subTitle: "",
                                        size: 40,
                                        labelOffsetX: -50,
                                        labelOffsetY: 1,
                                        ajaxConfig: {
                                            url: "common/ShowCase",
                                            ajaxType: "get",
                                            params: [
                                                // { name: 'LayoutId', type: 'tempValue', valueName: '_LayoutId', value: '' }
                                            ]
                                        },
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            sub: false
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                row: {
                    cols: [
                        {
                            id: "dataSteps",
                            span: 12,
                            icon: "icon-list",
                            size: {
                                nzXs: 12,
                                nzSm: 12,
                                nzMd: 12,
                                nzLg: 12,
                                ngXl: 12
                            },
                            viewCfg: [
                                {
                                    config: {
                                        viewId: "chart34",
                                        component: "bsnCarousel",
                                        autoPlay: false,
                                        dataMapping: [
                                            { field: "remark", name: "alt" },
                                            { field: "savePath", name: "src" }
                                        ],
                                        ajaxConfig: {
                                            url: "common/SysFile",
                                            ajaxType: "get",
                                            params: [
                                                {
                                                    name: "refDataId",
                                                    type: "tempValue",
                                                    valueName: ""
                                                }
                                            ]
                                        },
                                        componentType: {
                                            parent: true,
                                            child: false,
                                            sub: false
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    };
    constructor(private http: _HttpClient) {}

    ngOnInit() {
        // console.log(JSON.stringify(this.config));
    }
    // region: init
    ngAfterViewInit() {}

    // endregion
}

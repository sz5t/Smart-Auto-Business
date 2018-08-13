import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {ApiService} from '@core/utility/api-service';
import {APIResource} from '@core/utility/api-resource';
import 'anychart';
import '../../../../assets/vender/anychart/zh-cn';
declare var anychart: any;
@Component({
    selector: 'app-gantt-setting',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.css']
})
export class GanttComponent implements OnInit, AfterViewInit {
    @ViewChild('container') container: ElementRef;
    data = {
        "gantt": {
            "enabled": true,
            "credits": {
                "enabled": false
            },
            "type": "gantt-project",
            "splitterPosition": 200,
            "defaultRowHeight": 40,
            "controller": {
                "treeData": {
                    "rootMapping": {},
                    "children": [
                        {
                            "treeDataItemData": {
                                "id": 1,
                                "name": "AA_安全机构",
                                "rowHeight": 40,
                            },
                            "children": [
                                {
                                    "treeDataItemData": {
                                        "id": 4,
                                        "name": "动作组件",
                                        "rowHeight": 40,
                                        "actualStart": 1533081600000,
                                        "actualEnd": 1533859200000,
                                        "baselineStart": 1533081600000,
                                        "baselineEnd": 1533859200000,
                                        "progressValue": "40%",
                                        "connector": [
                                            {
                                                "connectTo": 2
                                            }
                                        ]
                                    },
                                    "treeDataItemMeta": {},
                                    "children": [
                                        {
                                            "treeDataItemData": {
                                                "id": 2,
                                                "name": "工序 1",
                                                "actualStart": 1533810200000,
                                                "actualEnd": 1534540200000,
                                                "rowHeight": 40,
                                                "connector": [
                                                    {
                                                        "connectTo": 3
                                                    }
                                                ]
                                            },
                                            "treeDataItemMeta": {}
                                        },
                                        {
                                            "treeDataItemData": {
                                                "id": 3,
                                                "name": "工序 2",
                                                "actualStart": 1533427200000,
                                                "actualEnd": 1533859200000,
                                                "rowHeight": 40,
                                                // "connector": [
                                                //     {
                                                //         "connectTo": 7
                                                //     }
                                                // ]
                                            },
                                            "treeDataItemMeta": {}
                                        },
                                    ]
                                }
                            ]
                        },

                        // {
                        //   "treeDataItemData": {
                        //     "id": 0,
                        //     "name": "Additional Planning"
                        //   },
                        //   "treeDataItemMeta": {},
                        //   "children": [
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 1,
                        //         "name": "Additional Phase #1",
                        //         "actualStart": 1391990400000,
                        //         "actualEnd": 1392422400000,
                        //         "progressValue": "30%",
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": 2
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 2,
                        //         "name": "Additional Phase #2",
                        //         "actualStart": 1392249600000,
                        //         "actualEnd": 1392595200000,
                        //         "baselineStart": 1392163200000,
                        //         "baselineEnd": 1392681600000,
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": 3
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 3,
                        //         "name": "Additional Phase #3",
                        //         "actualStart": 1392681600000,
                        //         "actualEnd": 1392940800000,
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": "milestone"
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": "milestone",
                        //         "name": "Additional Summary Meeting",
                        //         "actualStart": 1393002000000,
                        //         "rowHeight": 30
                        //       },
                        //       "treeDataItemMeta": {}
                        //     }
                        //   ]
                        // },
                        // {
                        //   "treeDataItemData": {
                        //     "id": 8,
                        //     "name": "Quality Assurance"
                        //   },
                        //   "treeDataItemMeta": {},
                        //   "children": [
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 9,
                        //         "name": "QA Phase #1",
                        //         "rowHeight": 30,
                        //         "actualStart": 1394236800000,
                        //         "actualEnd": 1394668800000,
                        //         "baselineStart": 1394409600000,
                        //         "baselineEnd": 1394668800000,
                        //         "connector": [
                        //           {
                        //             "connectTo": 10
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 10,
                        //         "name": "QA Phase #2",
                        //         "actualStart": 1394841600000,
                        //         "actualEnd": 1395014400000,
                        //         "rowHeight": 30,
                        //         "progressValue": "10%",
                        //         "connector": [
                        //           {
                        //             "connectTo": 11
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 11,
                        //         "name": "QA Phase #3",
                        //         "rowHeight": 30,
                        //         "actualStart": 1395187200000,
                        //         "actualEnd": 1395705600000,
                        //         "connector": [
                        //           {
                        //             "connectTo": 8,
                        //             "connectorType": "finish-start"
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     }
                        //   ]
                        // }
                    ],
                    "index": [
                        "id"
                    ]
                },
                "verticalOffset": 0,
                "startIndex": 0
            },
            "dataGrid": {
                "enabled": true,
                "headerHeight": 70,
                "edit": {},
                "horizontalOffset": 0,
                "buttons": {
                    "enabled": true,
                    "hovered": {
                        "background": {}
                    },
                    "selected": {
                        "background": {}
                    }
                },
                "columns": [
                    {
                        "enabled": true,
                        "width": 50,
                        "collapseExpandButtons": false,
                        "depthPaddingMultiplier": 0,
                        "labels": {
                            "zIndex": 0,
                            "enabled": true,
                            "background": {
                                "enabled": false,
                                "fill": "#ffffff",
                                "stroke": "none",
                                "cornerType": "round",
                                "corners": 0
                            },
                            "padding": {
                                "left": 5,
                                "top": 0,
                                "bottom": 0,
                                "right": 5
                            },
                            "minFontSize": 8,
                            "maxFontSize": 72,
                            "adjustFontSize": {
                                "width": false,
                                "height": false
                            },
                            "fontSize": 16,
                            "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                            "fontColor": "#7c868e",
                            "fontOpacity": 1,
                            "fontDecoration": "none",
                            "fontStyle": "normal",
                            "fontVariant": "normal",
                            "fontWeight": "normal",
                            "letterSpacing": "normal",
                            "textDirection": "ltr",
                            "lineHeight": "normal",
                            "textIndent": 0,
                            "vAlign": "middle",
                            "hAlign": "start",
                            "wordWrap": "normal",
                            "wordBreak": "break-all",
                            "textOverflow": "",
                            "selectable": false,
                            "disablePointerEvents": true,
                            "useHtml": false,
                            "format": "{%linearIndex}",
                            "anchor": "left-top",
                            "offsetX": 0,
                            "offsetY": 0,
                            "rotation": 0
                        },
                        "title": {
                            "enabled": true,
                            "fontSize": 16,
                            "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                            "fontColor": "#7c868e",
                            "fontOpacity": 1,
                            "fontDecoration": "none",
                            "fontStyle": "normal",
                            "fontVariant": "normal",
                            "fontWeight": "normal",
                            "letterSpacing": "normal",
                            "textDirection": "ltr",
                            "lineHeight": "normal",
                            "textIndent": 0,
                            "vAlign": "middle",
                            "hAlign": "center",
                            "wordWrap": "normal",
                            "wordBreak": "normal",
                            "textOverflow": "",
                            "selectable": false,
                            "disablePointerEvents": false,
                            "useHtml": false,
                            "height": 70,
                            "align": "center",
                            "text": "序号",
                            "background": {
                                "enabled": false,
                                "fill": "#ffffff",
                                "stroke": "none",
                                "cornerType": "round",
                                "corners": 0
                            }
                        }
                    },
                    {
                        "enabled": true,
                        "width": 170,
                        "collapseExpandButtons": true,
                        "depthPaddingMultiplier": 15,
                        "labels": {
                            "zIndex": 0,
                            "enabled": true,
                            "background": {
                                "enabled": false,
                                "fill": "#03f5f4",
                                "stroke": "none",
                                "cornerType": "round",
                                "corners": 0
                            },
                            "padding": {
                                "left": 5,
                                "top": 0,
                                "bottom": 0,
                                "right": 5
                            },
                            "minFontSize": 8,
                            "maxFontSize": 72,
                            "adjustFontSize": {
                                "width": false,
                                "height": false
                            },
                            "fontSize": 16,
                            "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                            "fontColor": "#333",
                            "fontOpacity": 1,
                            "fontDecoration": "none",
                            "fontStyle": "normal",
                            "fontVariant": "normal",
                            "fontWeight": "normal",
                            "letterSpacing": "normal",
                            "textDirection": "ltr",
                            "lineHeight": "normal",
                            "textIndent": 0,
                            "vAlign": "middle",
                            "hAlign": "start",
                            "wordWrap": "normal",
                            "wordBreak": "break-all",
                            "textOverflow": "",
                            "selectable": false,
                            "disablePointerEvents": true,
                            "useHtml": false,
                            "format": "{%name}",
                            "anchor": "left-top",
                            "offsetX": 0,
                            "offsetY": 0,
                            "rotation": 0
                        },
                        "title": {
                            "enabled": true,
                            "fontSize": 16,
                            "fontFamily": "Verdana, Helvetica, Arial, sans-serif",
                            "fontColor": "#7c868e",
                            "fontOpacity": 1,
                            "fontDecoration": "none",
                            "fontStyle": "normal",
                            "fontVariant": "normal",
                            "fontWeight": "normal",
                            "letterSpacing": "normal",
                            "textDirection": "ltr",
                            "lineHeight": "normal",
                            "textIndent": 0,
                            "vAlign": "middle",
                            "hAlign": "center",
                            "wordWrap": "normal",
                            "wordBreak": "normal",
                            "textOverflow": "",
                            "selectable": false,
                            "disablePointerEvents": false,
                            "useHtml": false,
                            "height": 70,
                            "align": "center",
                            "text": "任务名称",
                            "background": {
                                "enabled": false,
                                "fill": "#ffffff",
                                "stroke": "none",
                                "cornerType": "round",
                                "corners": 0
                            }
                        }
                    }
                ],
                "horizontalScrollBar": {
                    "enabled": true,
                    "backgroundStroke": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "backgroundFill": {
                        "color": "#e0e0e0",
                        "opacity": 0.25
                    },
                    "sliderFill": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "sliderStroke": {
                        "color": "#656565",
                        "opacity": 0.25
                    }
                }
            },
            "timeline": {
                "enabled": true,
                "edit": {},
                "scale": {
                    "visibleMinimum": 1514764800000,
                    "visibleMaximum": 1546214400000,
                    "dataMinimum": 1514764800000,
                    "dataMaximum": 1546214400000,
                    "minimumGap": 0.01,
                    "maximumGap": 0.01
                },
                "markers": {
                    "enabled": null
                },
                "header": {
                    "zIndex": 80,
                    "enabled": true,
                    "background": {
                        "zIndex": 0,
                        "enabled": false
                    },
                    "levels": [
                        {}
                    ]
                },
                "elements": {
                    "edit": {
                        "start": {
                            "thumb": {},
                            "connectorThumb": {}
                        },
                        "end": {
                            "thumb": {},
                            "connectorThumb": {}
                        }
                    }
                },
                "tasks": {
                    "edit": {
                        "start": {
                            "thumb": {},
                            "connectorThumb": {}
                        },
                        "end": {
                            "thumb": {},
                            "connectorThumb": {}
                        }
                    },
                    "progress": {
                        "normal": {},
                        "selected": {},
                        "edit": {
                            "thumbs": {},
                            "connectorThumbs": {},
                            "start": {
                                "thumb": {},
                                "connectorThumb": {}
                            },
                            "end": {
                                "thumb": {},
                                "connectorThumb": {}
                            }
                        }
                    }
                },
                "groupingTasks": {
                    "edit": {
                        "start": {
                            "thumb": {},
                            "connectorThumb": {}
                        },
                        "end": {
                            "thumb": {},
                            "connectorThumb": {}
                        }
                    },
                    "progress": {
                        "normal": {},
                        "selected": {},
                        "edit": {
                            "thumbs": {},
                            "connectorThumbs": {},
                            "start": {
                                "thumb": {},
                                "connectorThumb": {}
                            },
                            "end": {
                                "thumb": {},
                                "connectorThumb": {}
                            }
                        }
                    }
                },
                "baselines": {
                    "edit": {
                        "start": {
                            "thumb": {},
                            "connectorThumb": {}
                        },
                        "end": {
                            "thumb": {},
                            "connectorThumb": {}
                        }
                    }
                },
                "milestones": {
                    "edit": {
                        "start": {
                            "thumb": {},
                            "connectorThumb": {}
                        },
                        "end": {
                            "thumb": {},
                            "connectorThumb": {}
                        }
                    }
                },
                "horizontalScrollBar": {
                    "enabled": true,
                    "backgroundStroke": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "backgroundFill": {
                        "color": "#e0e0e0",
                        "opacity": 0.25
                    },
                    "sliderFill": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "sliderStroke": {
                        "color": "#656565",
                        "opacity": 0.25
                    }
                },
                "verticalScrollBar": {
                    "zIndex": 20,
                    "enabled": true,
                    "backgroundStroke": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "backgroundFill": {
                        "color": "#e0e0e0",
                        "opacity": 0.25
                    },
                    "sliderFill": {
                        "color": "#d5d5d5",
                        "opacity": 0.25
                    },
                    "sliderStroke": {
                        "color": "#656565",
                        "opacity": 0.25
                    }
                }
            }
        }
    }
    change = false;

    constructor() {
    }

    ngOnInit() {

    }

    changeDate() {
        this.change = !this.change;
        if (this.change) {
            this.getGantt_1();
        } else {
            this.getGantt_2();
        }
    }

    ngAfterViewInit(): void {
        anychart.format.inputLocale('zh-cn');
        anychart.format.inputDateTimeFormat('yyyy.MM.dd'); // Like '2015.03.12'
        anychart.format.outputLocale('zh-cn');
        this.getGantt_1();

    }

    getGantt_1() {
        const chart = anychart.fromJson(this.data);
        chart.container('container');
        chart.draw();
        chart.fitAll();
    }

    getGantt_2() {
        // create data
        const treeData = anychart.data.tree(this.getData(), 'as-table');

        // create gantt-project chart
        const chart = anychart.ganttProject();

        // set data
        chart.data(treeData);

        // setting common rows separation stroke
        //chart.rowStroke('#90caf9');

        // set main splitter's pixel position
        //chart.splitterPosition(300);


        // datagrid settings
        const dataGrid = chart.dataGrid();

        dataGrid.rowEvenFill('#e3f2fd')
            .rowOddFill('#f6fbfe')
            .rowHoverFill('#fff8e1')
            .rowSelectedFill('#ffecb3')
        //.columnStroke('2 #90caf9');


        dataGrid.column(0).title().text('编号');
        dataGrid.column(1).width(250).title('标题');
        dataGrid.column(2).labels().format(function () {
            const start = this['actualStart'] || this['autoStart'];
            return anychart.format.date(start);
        });
        dataGrid.column(2).title('开始');

        dataGrid.column(3).labels().format(function () {
            const end = this['actualEnd'] || this['autoEnd'];
            return (end === void 0) ? '' : anychart.format.date(end); //can be milestone
        });
        dataGrid.column(3).title('结束');

        // tooltip settings
        dataGrid.tooltip().format(this.tooltipFormatter);
        chart.getTimeline().tooltip().format(this.tooltipFormatter);

        // set container id for the chart
        chart.container('container');

        // initiate chart drawing
        chart.draw();
    }

    // formatter for timeline and datagrid tooltips
    tooltipFormatter() {
        const startDate = this['actualStart'] || this['autoStart'];
        const endDate = this['actualEnd'] || this['autoEnd'];
        let progress = this['progressValue'];

        if (progress === void 0) {
            const auto = this['autoProgress'] * 100;
            progress = (Math.round(auto * 100) / 100 || 0) + '%';
        }

        return (startDate ? '开始时间: ' + anychart.format.date(startDate) : '') +
            (endDate ? '\n结束时间: ' + anychart.format.date(endDate) : '') +
            (progress ? '\n进度: ' + progress : '');
    }

    // simple data
    getData() {
        return [{
            'id': '1',
            'name': 'Phase 1 - Strategic Plan'
        },
            {
                'id': '2',
                'name': 'Self assessment',
                'parent': '1'
            },
            {
                'id': '3',
                'name': 'It defines the business vision',
                'parent': '2',
                'actualStart': '2015.03.13',
                'actualEnd': '2015.03.24'
            },
            {
                'id': '4',
                'name': 'To identify the available skills, information and support',
                'parent': '2',
                'actualStart': '2015.03.25',
                'actualEnd': '2015.04.06'
            },
            {
                'id': '5',
                'name': 'Decide whether you want to continue',
                'parent': '2',
                'actualStart': '2015.04.07',
                'actualEnd': '2015.04.15',
                'baselineStart': '2015.04.06',
                'baselineEnd': '2015.04.18'
            }

        ];
    }
}
//anychart-credits-text

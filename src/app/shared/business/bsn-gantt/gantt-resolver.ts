export class GanttResolver {
    private _gantt: Gantt;
    private _controller: Controller;
    private _dataGrid: DataGrid;
    private _timeline: Timeline;

    private _data: any;
    private _config: any;
    constructor(private data: any, private config: any) {
        debugger;
        this._data = data;
        this._config = config
    }
    public resolver() {
        // init gantt object
        this._gantt = {
            enabled: true,
            credits: {
                enabled: false
            },
            type: 'gantt-project',
            splitterPosition: this._config.splitterPosition,
            defaultRowHeight: this._config.defaultRowHeight,
        };

        // build controller
        this._gantt.controller = this.buildController();
        // build dataGrid
        this._gantt.dataGrid = this.buildDataGrid();
        // build timeline
        this._timeline = this.buildTimeLine();
        return { gantt: this._gantt };
    }

    private buildController() {
        this._controller = {
            treeData: {
                rootMapping: {},
                index: ['Id'], // 默认Id属性为数据顺序关联标识    
                children: this.createTreeDataChildren(this._data)
            },
            verticalOffset: 0,
            startIndex: 0
        };

        return this._controller;
    }

    private createTreeDataChildren(data) {
        debugger;
        const children: TreeDataChildren[] = [];
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                const child: TreeDataChildren = {};
                child.treeDataItemMeta = {};
                child.treeDataItemData = this.createItemData(d);
                if (Array.isArray(d['children']) && d['children'].length > 0) {
                    child.children = this.createTreeDataChildren(d.children);
                }
            });
        }
        return children;
    }

    // private createTreeDataItemData() {
    //     const itemData: TreeDataItemData[] = [];
    //     if (Array.isArray(this._data) && this._data.length > 0) {
    //         this._data.forEach(d => {
    //             const item = this.createItemData(d);
    //             itemData.push(item);
    //         });
    //     }
    //     return itemData;
    // }

    private createItemData(d) {
        const tempData: TreeDataItemData = {
            id: d['Id'],
            name: d[this._config.columnField]
        };
        if (d[this._config.actualStart]) {
            tempData.actualStart = d[this._config.actualStart];
        }
        if (d[this._config.actualEnd]) {
            tempData.actualEnd = d[this._config.actualEnd];
        }
        if (d[this._config.planStart]) {
            tempData.baselineStart = d[this._config.planStart];
        }
        if (d[this._config.planEnd]) {
            tempData.baselineEnd = d[this._config.planEnd];
        }
        if (d[this._config.progressField]) {
            tempData.progressValue = d[this._config.progressField];
        }
        if (d[this._config.connectorField]) {
            tempData.connector = this.createConnector(d[this._config.connectorField]);
        }

        return tempData;
    }

    private createConnector(connectorData) {
        const connectors: Connector[] = [];
        // 根据数据源提供的数据进行解析
        return connectors;
    }

    private buildDataGrid() {
        const columns = [];
        this._config.columns.forEach(col => {
            const labels = {
                zIndex: 0,
                enabled: true,
                background: {
                    enabled: false,
                    fill: '#ffffff',
                    stroke: 'none',
                    cornerType: 'round',
                    corners: 0
                },
                padding: {
                    left: 5,
                    top: 0,
                    bottom: 0,
                    right: 5
                },
                minFontSize: 8,
                maxFontSize: 72,
                adjustFontSize: {
                    width: false,
                    height: false
                },
                fontSize: 16,
                fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                fontColor: '#7c868e',
                fontOpacity: 1,
                fontDecoration: 'none',
                fontStyle: 'normal',
                fontVariant: 'normal',
                fontWeight: 'normal',
                letterSpacing: 'normal',
                textDirection: 'ltr',
                lineHeight: 'normal',
                textIndent: 0,
                vAlign: 'middle',
                hAlign: 'start',
                wordWrap: 'normal',
                wordBreak: 'break-all',
                textOverflow: '',
                selectable: false,
                disablePointerEvents: true,
                useHtml: false,
                format: '{%name}',
                anchor: 'left-top',
                offsetX: 0,
                offsetY: 0,
                rotation: 0
            };
            const title = {
                enabled: true,
                fontSize: 14,
                fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                fontColor: '#7c868e',
                fontOpacity: 1,
                fontDecoration: 'none',
                fontStyle: 'normal',
                fontVariant: 'normal',
                fontWeight: 'normal',
                letterSpacing: 'normal',
                textDirection: 'ltr',
                lineHeight: 'normal',
                textIndent: 0,
                vAlign: 'middle',
                hAlign: 'center',
                wordWrap: 'normal',
                wordBreak: 'normal',
                textOverflow: '',
                selectable: false,
                disablePointerEvents: false,
                useHtml: false,
                height: 70,
                align: 'center',
                text: col.title,
                background: {
                    enabled: false,
                    fill: '#ffffff',
                    stroke: 'none',
                    cornerType: 'round',
                    corners: 0
                }
            }
            const column = {
                labels: labels,
                title: title,
                enabled: true,
                width: col.width,
                collapseExpandButtons: false,
                depthPaddingMultiplier: 0
            }
            columns.push(column);
        });
        this._dataGrid = {
            columns : columns,
            enabled: true,
            headerHeight: 70,
            edit: {},
            horizontalOffset: 0,
            buttons: {
                enabled: true,
                hovered: {
                    background: {}
                },
                selected: {
                    background: {}
                }
            }
        }

        return this._dataGrid;
    }

    private buildTimeLine() {
        this._timeline = {
            enabled: true,
                edit: {},
                scale: {
                    visibleMinimum: 1514764800000,
                    visibleMaximum: 1546214400000,
                    dataMinimum: 1514764800000,
                    dataMaximum: 1546214400000,
                    minimumGap: 0.01,
                    maximumGap: 0.01
                },
                markers: {
                    enabled: null
                },
                header: {
                    zIndex: 80,
                    enabled: true,
                    background: {
                        zIndex: 0,
                        enabled: false
                    },
                    levels: [{}]
                },
                elements: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                tasks: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    },
                    progress: {
                        normal: {},
                        selected: {},
                        edit: {
                            thumbs: {},
                            connectorThumbs: {},
                            start: {
                                thumb: {},
                                connectorThumb: {}
                            },
                            end: {
                                thumb: {},
                                connectorThumb: {}
                            }
                        }
                    }
                },
                groupingTasks: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    },
                    progress: {
                        normal: {},
                        selected: {},
                        edit: {
                            thumbs: {},
                            connectorThumbs: {},
                            start: {
                                thumb: {},
                                connectorThumb: {}
                            },
                            end: {
                                thumb: {},
                                connectorThumb: {}
                            }
                        }
                    }
                },
                baselines: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                milestones: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                horizontalScrollBar: {
                    enabled: true,
                    backgroundStroke: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    backgroundFill: {
                        color: '#e0e0e0',
                        opacity: 0.25
                    },
                    sliderFill: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    sliderStroke: {
                        color: '#656565',
                        opacity: 0.25
                    }
                },
                verticalScrollBar: {
                    zIndex: 20,
                    enabled: true,
                    backgroundStroke: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    backgroundFill: {
                        color: '#e0e0e0',
                        opacity: 0.25
                    },
                    sliderFill: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    sliderStroke: {
                        color: '#656565',
                        opacity: 0.25
                    }
                }
        }

        return this._timeline;
    }
}

interface Gantt {
    enabled?: any;
    credits?: any;
    type?: any;
    splitterPosition?: number;
    defaultRowHeight?: number;
    controller?: Controller;
    dataGrid?: DataGrid;
    timeline?: Timeline;
}

interface TreeDataItemData {
    id: any;
    name: any;
    rowHeight?: any;
    actualStart?: any;
    actualEnd?: any;
    baselineStart?: any;
    baselineEnd?: any;
    progressValue?: any;
    connector?: Connector[];
}

interface Connector {
    connectTo?: any;
    connectorType?: any;
}


interface Controller {
    treeData: any;
    verticalOffset: number;
    startIndex: number;
}

interface TreeData {
    rootMapping?: any;
    children?: []
}

interface TreeDataChildren {
    treeDataItemData?: TreeDataItemData;
    treeDataItemMeta?: any;
    children?: TreeDataChildren[];
}

// --------------------------------------------------------------------/
interface DataGrid {
    enabled?: any;
    headerHeight?: number;
    edit?: any;
    horizontalOffset?: number;
    buttons?: any;
    columns?: any[];
    horizontalScrollBar?: any;
    verticalScrollBar?: any;
}

interface Columns {
    enabled?: any;
    width?: any;
    collapseExpandButtons?: any;
    depthPaddingMultiplier?: number;
    labels?: any[];
    title?: any[];

}

interface Timeline {
    enabled?: any;
    edit?: any;
    scale?: any;
    markers?: any;
    header?: any;
    elements?: any;
    tasks?: any;
    groupingTasks?: any;
    milestones?: any
    baselines?: any;
    horizontalScrollBar?: any;
    verticalScrollBar?: any;

}





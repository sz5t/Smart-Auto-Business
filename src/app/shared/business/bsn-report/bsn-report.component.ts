import { ApiService } from './../../../core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import { ElementRef, AfterViewInit } from '@angular/core';
import {
    Component,
    OnInit,
    Input,
    ViewChild
} from '@angular/core';
import { DataService } from 'app/model/app-data.service';
import { CnComponentBase } from '@shared/components/cn-component-base';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-report',
    templateUrl: './bsn-report.component.html',
    styles: [``]
})
export class BsnReportComponent extends CnComponentBase implements OnInit, AfterViewInit {
    @Input()
    public config;
    
    private data: any;
    private autoGenerateColumns;
    private hostStyle = {
        width: '100%',
        height: '500px'
    }

    @ViewChild('report') 
    private reportView: ElementRef;
    private reportObject;

    private _lines = ['Computers', 'Washers', 'Stoves'];
    private _colors = ['Red', 'Green', 'Blue', 'White'];
    private _ratings = ['Terrible', 'Bad', 'Average', 'Good', 'Great', 'Epic'];
    constructor(
        private _api: ApiService
    ) {
        super();
        this.apiResource = _api;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
        
        this.reportObject = new GC.Spread.Sheets.Workbook(this.reportView.nativeElement, {sheetCount: 2});
        this.initSpread(this.reportObject);
    }

    private async getReportTemplate() {
        this.apiResource.getLocalReportTemplate('demo.ssjson').toPromise();
    }


    private getProducts(count) {
        const dataList = [];
        for (let i = 1; i <= count; i++) {
            // tslint:disable-next-line:radix
            const line = this._lines[parseInt(Math.random() * 3 + '')];
            dataList[i - 1] = new Product(i,
                    line,
                    // tslint:disable-next-line:radix
                    this._colors[parseInt(Math.random() * 4 + '')],
                    line + ' ' + line.charAt(0) + i,
                    // tslint:disable-next-line:radix
                    parseInt(Math.random() * 5001 + '') / 10.0 + 500,
                    // tslint:disable-next-line:radix
                    parseInt(Math.random() * 6001 + '') / 10.0,
                    // tslint:disable-next-line:radix
                    parseInt(Math.random() * 10001 + '') / 100.0,
                    !!(Math.random() > 0.5),
                    // tslint:disable-next-line:radix
                    this._ratings[parseInt(Math.random() * 6 + '')]);
        }
        return dataList;
    }

    private initSpread(spread) {
        spread.suspendPaint();
        spread.options.tabStripRatio = 0.8;

        const products = this.getProducts(100);

        const sheet = spread.getSheet(0);
        sheet.name('默认绑定');
        sheet.setDataSource(products);

        const sheet2 = spread.getSheet(1);
        sheet2.name('自定义绑定');
        sheet2.autoGenerateColumns = false;
        sheet2.setDataSource(products);
        const colInfos = [
            { name: 'id', displayName: '编号' },
            { name: 'name', displayName: '名称', size: 100 },
            { name: 'line', displayName: '线', size: 80 },
            { name: 'color', displayName: '颜色' },
            { name: 'price', displayName: '价格', formatter: '0.00', size: 80 },
            { name: 'cost', displayName: '话费', formatter: '0.00', size: 80 },
            { name: 'weight', displayName: '重量', formatter: '0.00', size: 80 },
            { name: 'discontinued', displayName: '折扣', cellType: new GC.Spread.Sheets.CellTypes.CheckBox(), size: 100 },
            { name: 'rating', displayName: '评价' }
        ];
        sheet2.bindColumns(colInfos);

        spread.resumePaint();
    };
    

}

export class Product {
    private id
    private line;
    private color;
    private name;
    private price;
    private cost;
    private weight;
    private discontinued;
    private rating;
    constructor(id, line, color, name, price, cost, weight, discontinued, rating) {
        this.id = id;
        this.line = line;
        this.color = color;
        this.name = name;
        this.price = price;
        this.cost = cost;
        this.weight = weight;
        this.discontinued = discontinued;
        this.rating = rating;
    }
}

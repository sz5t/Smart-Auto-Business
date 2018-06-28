import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-priv-manager',
  templateUrl: './priv-manager.component.html',
  styles: [
        `
    .table-operations {
      margin-bottom: 16px;
    }
    
    .table-operations > button {
      margin-right: 8px;
    }
    .selectedRow{
        color:blue;
    }
    `
    ]
})
export class PrivManagerComponent implements OnInit {

    _total = 0;
    _loading;
    _dataSet;
    _current;
    _pageSize = 10;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

    refreshData(event?) {

    }

    sort() {

    }
}

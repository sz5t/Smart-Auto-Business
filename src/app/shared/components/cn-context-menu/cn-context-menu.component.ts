import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'cn-context-menu',
  templateUrl: './cn-context-menu.component.html',
})
export class CnContextMenuComponent implements OnInit {

    @Input() menuConfig;
    @Output() selectedMenu: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
      if(!this.menuConfig) {

      }
    }

    getSelectedData(value) {
      this.selectedMenu.emit(value)
    }

}

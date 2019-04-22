import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '@core/utility/api-service';
import { BsnStaticTableComponent } from '@shared/business/bsn-data-table/bsn-static-table.component';

@Component({
  selector: 'cn-form-grid,[cn-form-grid]',
  templateUrl: './cn-form-grid.component.html',
  styleUrls: ['./cn-form-grid.component.css']
})
export class CnFormGridComponent implements OnInit {
  @Input()
  public config;
  @Input()
  public value;
  @Input()
  public bsnData;
  @Input()
  public rowData;
  @Input()
  public dataSet;
  public formGroup: FormGroup;
  // @Output() updateValue = new EventEmitter();
  @Output()
  public updateValue = new EventEmitter();
  @Input() public initValue;
  @Input() public casadeData = {};
  public _options = [];
  public cascadeValue = {};
  public resultData;
  public _value = [];
  @ViewChild("table")
  public table: BsnStaticTableComponent;
  constructor(@Inject(BSN_COMPONENT_MODES)
  private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>,
    private apiService: ApiService) { }

  public ngOnInit() {
    // 1.看配置，以及参数的接受
    // 组件值，临时变量，级联值

    // this._value = this.table.loadData.rows ? this.table.loadData.rows : [];
        // 未知是否有错误
        if (!this._value) {
          if (this.formGroup.value[this.config.name]) {
              this._value = this.formGroup.value[this.config.name];
          }
      }
  }

  public valueChange(name?) {


    // if (name) {
    //     const backValue = { name: this.config.name, value: name };
    //     if (this.resultData) {
    //         const index = this.resultData.data.findIndex(
    //             item => item[this.config["valueName"]] === name
    //         );
    //         this.resultData.data &&
    //             (backValue["dataItem"] = this.resultData.data[index]);
    //     }
    //     this.updateValue.emit(backValue);
    // } else {
    //     const backValue = { name: this.config.name, value: name };
    //     this.updateValue.emit(backValue);
    // }
  }

  public valueChangeTable(name?) {

    this._value = name;
    if (name) {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
    } else {
      const backValue = { name: this.config.name, value: name };
      this.updateValue.emit(backValue);
    }
  }

}

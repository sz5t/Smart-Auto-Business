import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '@core/utility/api-service';

@Component({
  selector: 'cn-form-grid,[cn-form-grid]',
  templateUrl: './cn-form-grid.component.html',
  styleUrls: ['./cn-form-grid.component.css']
})
export class CnFormGridComponent implements OnInit {
  @Input()
  config;
  @Input()
  value;
  @Input()
  bsnData;
  @Input()
  rowData;
  @Input()
  dataSet;
  formGroup: FormGroup;
  // @Output() updateValue = new EventEmitter();
  @Output()
  updateValue = new EventEmitter();
  _options = [];
  cascadeValue = {};
  resultData;
  _value;
  constructor(@Inject(BSN_COMPONENT_MODES)
  private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>,
    private apiService: ApiService) { }

  ngOnInit() {
    // 1.看配置，以及参数的接受
    // 组件值，临时变量，级联值
    console.log("peizhi:", this.config);
  }

  valueChange(name?) {

    // console.log('valueChange', name);
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

}

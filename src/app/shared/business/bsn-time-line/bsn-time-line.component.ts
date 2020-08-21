import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { ApiService } from '@core/utility/api-service';
import { NzMessageService, NzModalService, NzDropdownService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE } from '@core/relative-Service/BsnTableStatus';
import { Observable, Observer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { XlsxService } from '@delon/abc';

@Component({
  selector: 'bsn-time-line',
  templateUrl: './bsn-time-line.component.html',
  styleUrls: ['./bsn-time-line.component.less']
})
export class BsnTimeLineComponent extends CnComponentBase
implements OnInit, AfterViewInit, OnDestroy  {

  constructor(
    private _http: ApiService,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private cacheService: CacheService,
    private _dropdownService: NzDropdownService,
    @Inject(BSN_COMPONENT_MODES)
    private stateEvents: Observable<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascade: Observer<BsnComponentMessage>,
    @Inject(BSN_COMPONENT_CASCADE)
    private cascadeEvents: Observable<BsnComponentMessage>,
    private _router: ActivatedRoute,
    private xlsx: XlsxService
) {
    super();
    this.apiResource = this._http;
    this.baseMessage = this._message;
    this.baseModal = this.modalService;
    this.cacheValue = this.cacheService;
    this.cascadeBase = this.cascade;
}

  public ngOnInit() {
    
  }

  /**
   * a
   */
  public ngAfterViewInit() {
    
  }

  public ngOnDestroy() {

  }

}

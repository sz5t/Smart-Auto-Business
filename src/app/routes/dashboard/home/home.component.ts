import { CacheService } from '@delon/cache';
import { ApiService } from '@core/utility/api-service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public title;
  public permissions;
  public config = {
    rows: []
  };
  public isLoadLayout = false;
  constructor(
    private _http: ApiService,
    private _cacheService: CacheService,
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {
    this._http.getLocalData('HOME_DISPLAY').subscribe(data => {
      (async () => {
        this.config = data;
        this.isLoadLayout = true;
      })();

    });
  }

  public ngOnDestroy(): void {
    this.config = null;
  }

}

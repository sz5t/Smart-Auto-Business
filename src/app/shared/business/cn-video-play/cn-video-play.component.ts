import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { CnComponentBase } from '@shared/components/cn-component-base';
import { ApiService } from '@core/utility/api-service';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'cn-video-play',
  templateUrl: './cn-video-play.component.html',
  styleUrls: ['./cn-video-play.component.css']
})
export class CnVideoPlayComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public config;
  @Input()
  public initData;
  public videoUrl: string;
  constructor(
    private _api: ApiService,
    private _cacheService: CacheService,
  ) { 
    super();
        this.apiResource = _api;
        this.cacheValue = this._cacheService
  }


  public ngOnInit() {
    this.initValue = this.initData ? this.initData : {};
    console.log(this.initValue);
    this.loadVideo();
  }

  public loadVideo() {
    let params;
    let url = this.config.url;
    const sessionId = this.config['session'] ? this.config['session'] : 'c1782caf-b670-42d8-ba90-2244d0b0ee83';
    const token = this.config['token'] ? this.config['token'] : 'token1';
    if (this.config) {
      if (this.config.playType === 'play') {
        url = this.config.url + 'now.html?autoplay=true';
        params = `&token=${token}&session=${sessionId}&newid=${new Date().getMilliseconds()}`;
        
      } else if (this.config.playType === 'playback') {
        url = this.config.url + 'playback2.html?autoplay=true'
        let beginTime, endTime;
        if (this.initValue['beginTime']) {
          beginTime = this.initValue['beginTime'].split(' ', 'T');
        }
        if (this.initValue['endTime']) {
          endTime = this.initValue['beginTime'].split(' ', 'T');
        }
        // const beginTime = this.initValue['beginTime'] ? this.initValue['beginTime'] : '2020-08-18T17:12:14+08:00';
        // const endTime =  this.initValue['endTime'] ? this.initValue['endTime'] : '2020-08-18T17:27:14+08:00';
        params = `&token=${token}&session=${sessionId}&beginTime=${beginTime}&endTime=${endTime}&newid=${new Date().getMilliseconds()}`;

      }
    }

    this.videoUrl = url + params;
    console.log(this.videoUrl);
  }

  public ngAfterViewInit(): void {
    // throw new Error("Method not implemented.");
  }
  public ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

}

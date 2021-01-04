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
  private strSession: string;
  constructor(
    private _api: ApiService,
    private _cacheService: CacheService,
  ) { 
    super();
        this.apiResource = _api;
        this.cacheValue = this._cacheService
  }


  public async ngOnInit() {
    this.initValue = this.initData ? this.initData : {};
    const videoInfo = await this.loginVideo();
    if (videoInfo) {
      this.strSession = videoInfo.strSession;
      this.loadVideo();
    }
    
  }

  private async loginVideo() {
    return this._api.get('http://10.129.198.30:8080/api/v1/login',{user: 'admin', strSession: '827ccb0eea8a706c4c34a16891f84e7b'}).toPromise();
  }

  public loadVideo() {
    let params;
    let url = this.config.url;
    const sessionId = this.strSession ? this.strSession : 'c1782caf-b670-42d8-ba90-2244d0b0ee83';
    const token = this.config['token'] ? this.config['token'] : 'token1';
    if (this.config) {
      if (this.config.playType === 'play') {
        url = this.config.url + 'now.html?autoplay=true';
        params = `&token=${token}&session=${sessionId}&newid=${new Date().getMilliseconds()}`;
        
      } else if (this.config.playType === 'playback') {
        url = this.config.url + 'playback2.html?autoplay=true'
        let beginTime, endTime;
        if (this.initValue['begintime']) {
          beginTime = this.initValue['begintime'].replace(' ', 'T') + '+08:00';
        }
        if (this.initValue['endtime']) {
          endTime = this.initValue['endtime'].replace(' ', 'T') + '+08:00';
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

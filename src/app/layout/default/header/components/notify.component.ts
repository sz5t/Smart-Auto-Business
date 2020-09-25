import { Component } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { environment } from '@env/environment';
import { CacheService } from '@delon/cache';
import { CommonTools } from '@core/utility/common-tools';
import { ApiService } from '@core/utility/api-service';
import { Router } from '@angular/router';
import { parseJsonText } from 'typescript';

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
        [data]="data"
        [count]="count"
        [loading]="loading"
        (select)="select($event)"
        
        (popoverVisibleChange)="loadData()"></notice-icon>
    `
    // (clear)="clear($event)"
})
export class HeaderNotifyComponent {

  public data: NoticeItem[] = [
    // { title: '通知', list: [], emptyText: '你已查看所有通知', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg', clearText: '清空通知' },
    // { title: '消息', list: [], emptyText: '您已读完所有消息', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg', clearText: '清空消息' },
    { title: '待办', list: [], emptyText: '你已完成所有待办', emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg' } // clearText: '清空待办'
  ];
  public count;
  public loading = false;
  public noticeArray = [];
  public ws;
  public cache;
  public NoticeConfig = {
    url: 'common/getNoticeData',
    ajaxType: 'get',
    params: [
      {
        'name': 'receiverId',
        'type': 'cacheValue',
        'valueName': 'userId'
      },
      {
        'name': 'taskType',
        'type': 'value',
        'value': 1
      }
    ]
  }
  public MessageArray = [];


  constructor(
    private msg: NzMessageService,
    private api: ApiService,
    private router: Router,
    private cacheService: CacheService) {
  }

  public updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => i.list = []);

    notices.forEach(item => {
      const newItem = { ...item };
      if (newItem.datetime)
        newItem.datetime = distanceInWordsToNow(item.datetime, { locale: (window as any).__locale__ });
      if (newItem.extra && newItem.state) {
        newItem.color = ({
          todo: undefined,
          1: 'blue',
          2: 'red',
          3: 'gold',
        })[newItem.state];
      }
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  public ngOnInit() {
    this.cache = this.cacheService.getNone('userInfo');
    // console.log(cache);
    this.openMessagePushService(this.cache);
    this.load();
  }

  public ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public ngAfterViewInit() {
  }

  /**
   * load 统一load数据入口
   */
  public async load() {
    await this.loadNoticeArray()
  }

  /**
   * loadNoticeArray 读取notice数据集合
   */
  public async loadNoticeArray() {
    this.getNotcieData(this.NoticeConfig).then(data => {
      if (data.isSuccess) {
        if (data.data) {
          // console.log(data.data);
          data.data.forEach(e => {
            this.MessageArray.push({ toUserId: e['receiverId'], message: e['descs'] })
          });
          this.count = data.data.length;
          this.startMessagePush(this.MessageArray);
          data.data.forEach(d => {
            this.noticeArray.push(
              {
                id: d.Id,
                type: '待办',
                title: d.title,
                description: d.descs,
                datatime: d.createDate,
                state: d.taskType,
                extra: d.taskTypeText
              }
            )
          })
        } else {
          this.count = 0
        }
      }
    });
    // this.noticeArray = [{
    //   id: '000000001',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    //   title: '你收到了 14 份新周报',
    //   datetime: '2017-08-09',
    //   type: '通知',
    // }, {
    //   id: '000000002',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    //   title: '你推荐的 曲妮妮 已通过第三轮面试',
    //   datetime: '2017-08-08',
    //   type: '通知',
    // }, {
    //   id: '000000003',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    //   title: '这种模板可以区分多种通知类型',
    //   datetime: '2017-08-07',
    //   read: true,
    //   type: '通知',
    // }, {
    //   id: '000000004',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    //   title: '左侧图标用于区分不同的类型',
    //   datetime: '2017-08-07',
    //   type: '通知',
    // }, {
    //   id: '000000005',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    //   title: '内容不要超过两行字，超出时自动截断',
    //   datetime: '2017-08-07',
    //   type: '通知',
    // }, {
    //   id: '000000006',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //   title: '曲丽丽 评论了你',
    //   description: '描述信息描述信息描述信息',
    //   datetime: '2017-08-07',
    //   type: '消息',
    // }, {
    //   id: '000000007',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //   title: '朱偏右 回复了你',
    //   description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    //   datetime: '2017-08-07',
    //   type: '消息',
    // }, {
    //   id: '000000008',
    //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //   title: '标题',
    //   description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    //   datetime: '2017-08-07',
    //   type: '消息',
    // }, {
    //   id: '000000009',
    //   title: '任务名称',
    //   description: '任务需要在 2017-01-12 20:00 前启动',
    //   extra: '未开始',
    //   status: 'todo',
    //   type: '待办',
    // }, {
    //   id: '000000010',
    //   title: '第三方紧急代码变更',
    //   description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    //   extra: '马上到期',
    //   status: 'urgent',
    //   type: '待办',
    // }, {
    //   id: '000000011',
    //   title: '信息安全考试',
    //   description: '指派竹尔于 2017-01-09 前完成更新并发布',
    //   extra: '已耗时 8 天',
    //   status: 'doing',
    //   type: '待办',
    // }, {
    //   id: '000000012',
    //   title: 'ABCD 版本发布',
    //   description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    //   extra: '进行中',
    //   status: 'processing',
    //   type: '待办',
    // }]
  }

  public loadData() {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      this.data = this.updateNoticeData(this.noticeArray);

      this.loading = false;
    }, 0);
  }

  public clear(type: string) {
    this.msg.success(`清空了 ${type}`);
  }

  public select(res: any) {
    // this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    this.router.navigate(['/app/template/appTemplate/Todotasks/我的流程']);
  }

  /**
   * openMessagePushService 建立消息推送
   */
  public openMessagePushService(cache) {
    const that = this;
    const wsString = environment.msgServiceUrl + cache['userId'];
    // console.log('wsString', wsString);
    this.ws = new WebSocket(wsString);
    this.ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // 连接服务端socket
      that.ws.send('客户端以上线');
      console.log('数据发送中...');
    };
    this.ws.onmessage = function (evt) {
      let received_msg = evt.data;
      received_msg = JSON.parse(received_msg);
      console.log('数据已接收...', received_msg);
      if (received_msg !== '1') {
        if (received_msg.type === 1) {
          that.getNotcieData(that.NoticeConfig).then(data => {
            if (data.isSuccess) {
              if (data.data) {
                console.log(data.data);
                // data.data.forEach(e => {
                //   that.MessageArray.push({toUserId: e['receiverId'], message: e['descs']})
                // });
                that.count = data.data.length;
                that.noticeArray = [];
                data.data.forEach(d => {
                  that.noticeArray.push(
                    {
                      id: d.Id,
                      type: '待办',
                      title: d.title,
                      description: d.descs,
                      datatime: d.createDate,
                      state: d.taskType,
                      extra: d.taskTypeText
                    }
                  )
                })
              } else {
                that.count = 0
              }
            }
          });
        } else if (received_msg.type === 2) {
          const num = parseInt(received_msg.message, 10)
          that.count = num;
          that.getNotcieData(that.NoticeConfig).then(data => {
            if (data.isSuccess) {
              if (data.data) {
                that.noticeArray = [];
                data.data.forEach(d => {
                  that.noticeArray.push(
                    {
                      id: d.Id,
                      type: '待办',
                      title: d.title,
                      description: d.descs,
                      datatime: d.createDate,
                      state: d.taskType,
                      extra: d.taskTypeText
                    }
                  )
                })
              }
            }
          });
        }
      }
    };
    this.ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...');
    };
  }

  /**
   * startMessagePush 消息初始化的时候，调用推送消息接口
   */
  public startMessagePush(MsgArray) {
    // console.log(userId, MsgArray);
    const url = 'api.push.message/common/message/batch_individuality/push'
    this.api.post(url, MsgArray).toPromise();
  }

  /**
   * _getAsyncChangeData
   */
  public async getNotcieData(config) {
    const params = CommonTools.parametersResolver({
      params: config.params,
      cacheValue: this.cacheService
    });

    const ajaxData = await this.api
      .get(
        config.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }
}

import { CnComponentBase } from '@shared/components/cn-component-base';
import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Input,
    Inject
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from '@core/utility/api-service';
import { APIResource } from '@core/utility/api-resource';
import 'anychart';
import '../../../../assets/vender/anychart/zh-cn';
import { Subscription, Observable, Observer } from 'rxjs';
import { CacheService } from '@delon/cache';
import { BSN_COMPONENT_MODES, BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_CASCADE_MODES } from '@core/relative-Service/BsnTableStatus';
import { CommonTools } from '@core/utility/common-tools';
declare var anychart: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-gantt',
    templateUrl: './bsn-gantt.component.html',
    styleUrls: ['./bsn-gantt.css']
})
export class BsnGanttComponent extends CnComponentBase implements OnInit, AfterViewInit {
    @ViewChild('container')
    @Input() 
    public config;
    @Input()
    public initData;

    private _statusSubscription: Subscription;
    private _cascadeSubscription: Subscription;

    public container: ElementRef;
    public dataSet = {
        "data": [
          {
            "idtext": "1",
            "remark": null,
            "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
            "materialname": "成品5",
            "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
            "children": [],
            "ordernumber": "SC-20190117-001",
            "taskplannumble": 1,
            "systemcodeid": null,
            "serialnumber": "1901",
            "parentId": "BCA80C45-0908-414B-9317-A4E5B0FCEC0C",
            "bomproductid": "831a96b381bf493a8d9ebaff21acf64e",
            "periodday": 15,
            "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
            "priority": 1,
            "prioritytext": "正常",
            "tasktime": "2019-2",
            "mpmprocessid": null,
            "createDate": "2019-01-25 17:18:20",
            "depname": "第八研究室",
            "xhname": "F-117",
            "taskplanname": "半成品5",
            "securitylevel": null,
            "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
            "plantype": null,
            "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
            "planenddate": "2019-01-31",
            "taskplantypesortcode": 4,
            "taskstatustext": "已下达",
            "technicalid": null,
            "plantypeid": "bf4cd77fa563486d828d6562f836845b",
            "taskplantype": 2,
            "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
            "taskstatus": 5,
            "jdname": "T",
            "figurenumber": "GAX--1-005",
            "workcentreid": "019ea3b98db3405aa4858053bb39e965",
            "planbegindate": "2019-01-17",
            "Id": "23E59EB1-01FF-49A7-A605-0CE5C367",
            "taskplantypetext": "零部件任务",
            "dataflagtext": null
          },
          {
            "idtext": "2",
            "remark": null,
            "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
            "materialname": "成品5",
            "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
            "children": [
              {
                "idtext": "1",
                "remark": null,
                "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                "materialname": "成品5",
                "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                "children": [],
                "ordernumber": "SC-20190117-001",
                "taskplannumble": 1,
                "systemcodeid": null,
                "serialnumber": "1901",
                "parentId": "2ABA7E42-E34A-4D85-94AB-17252DC0",
                "bomproductid": "ff6fdd73a12248598bbd078d83f05990",
                "periodday": 15,
                "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                "priority": 1,
                "prioritytext": "正常",
                "tasktime": "2019-2",
                "mpmprocessid": null,
                "createDate": "2019-01-25 17:18:20",
                "depname": "第七研究室",
                "xhname": "F-117",
                "taskplanname": "机加",
                "securitylevel": null,
                "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                "plantype": null,
                "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                "planenddate": "2019-01-31",
                "taskplantypesortcode": 5,
                "taskstatustext": "已下达",
                "technicalid": null,
                "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                "taskplantype": null,
                "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                "taskstatus": 5,
                "jdname": "T",
                "figurenumber": "GAX--1-005",
                "workcentreid": "0c86d2d64a4e4fdd8e332ab3efca4050",
                "planbegindate": "2019-01-17",
                "Id": "4179D27A-5732-4E8D-B185-546A4A165CC4",
                "taskplantypetext": "工艺任务",
                "dataflagtext": null
              }
            ],
            "ordernumber": "SC-20190117-001",
            "taskplannumble": 1,
            "systemcodeid": null,
            "serialnumber": "1901",
            "parentId": "BCA80C45-0908-414B-9317-A4E5B0FCEC0C",
            "bomproductid": "ff6fdd73a12248598bbd078d83f05990",
            "periodday": 15,
            "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
            "priority": 1,
            "prioritytext": "正常",
            "tasktime": "2019-2",
            "mpmprocessid": null,
            "createDate": "2019-01-25 17:18:20",
            "depname": "第七研究室",
            "xhname": "F-117",
            "taskplanname": "半成品4",
            "securitylevel": null,
            "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
            "plantype": null,
            "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
            "planenddate": "2019-01-31",
            "taskplantypesortcode": 4,
            "taskstatustext": "已下达",
            "technicalid": null,
            "plantypeid": "bf4cd77fa563486d828d6562f836845b",
            "taskplantype": 2,
            "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
            "taskstatus": 5,
            "jdname": "T",
            "figurenumber": "GAX--1-005",
            "workcentreid": "0c86d2d64a4e4fdd8e332ab3efca4050",
            "planbegindate": "2019-01-17",
            "Id": "2ABA7E42-E34A-4D85-94AB-17252DC0",
            "taskplantypetext": "零部件任务",
            "dataflagtext": null
          },
          {
            "idtext": "2",
            "remark": null,
            "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
            "materialname": "成品5",
            "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
            "children": [
              {
                "idtext": "2",
                "remark": null,
                "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                "materialname": "成品5",
                "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                "children": [
                  {
                    "idtext": "1",
                    "remark": null,
                    "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                    "materialname": "成品5",
                    "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                    "children": [],
                    "ordernumber": "SC-20190117-001",
                    "taskplannumble": 1,
                    "systemcodeid": null,
                    "serialnumber": "1901",
                    "parentId": "30386500-AD92-4C8C-82A4-EDA6F2E07B59",
                    "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                    "periodday": 15,
                    "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                    "priority": 1,
                    "prioritytext": "正常",
                    "tasktime": "2019-2",
                    "mpmprocessid": "b53e0dd2a7f2451c9baf0abfa373343d",
                    "createDate": "2019-01-25 17:45:49",
                    "depname": null,
                    "xhname": "F-117",
                    "taskplanname": "铣",
                    "securitylevel": null,
                    "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                    "plantype": null,
                    "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                    "planenddate": "2019-01-31",
                    "taskplantypesortcode": 7,
                    "taskstatustext": "外协中",
                    "technicalid": null,
                    "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                    "taskplantype": null,
                    "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                    "taskstatus": 11,
                    "jdname": "T",
                    "figurenumber": "GAX--1-005",
                    "workcentreid": null,
                    "planbegindate": "2019-01-17",
                    "Id": "345C38EF-BC07-47B8-9A7A-4709A1E7A0AD",
                    "taskplantypetext": "工序任务",
                    "dataflagtext": null
                  },
                  {
                    "idtext": "1",
                    "remark": null,
                    "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                    "materialname": "成品5",
                    "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                    "children": [],
                    "ordernumber": "SC-20190117-001",
                    "taskplannumble": 1,
                    "systemcodeid": null,
                    "serialnumber": "1901",
                    "parentId": "30386500-AD92-4C8C-82A4-EDA6F2E07B59",
                    "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                    "periodday": 15,
                    "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                    "priority": 1,
                    "prioritytext": "正常",
                    "tasktime": "2019-2",
                    "mpmprocessid": "b53e0dd2a7f2451c9baf0abfa373343d",
                    "createDate": "2019-01-25 17:45:02",
                    "depname": null,
                    "xhname": "F-117",
                    "taskplanname": "铣",
                    "securitylevel": null,
                    "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                    "plantype": null,
                    "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                    "planenddate": "2019-01-31",
                    "taskplantypesortcode": 7,
                    "taskstatustext": "起草",
                    "technicalid": null,
                    "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                    "taskplantype": null,
                    "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                    "taskstatus": 1,
                    "jdname": "T",
                    "figurenumber": "GAX--1-005",
                    "workcentreid": null,
                    "planbegindate": "2019-01-17",
                    "Id": "684A9E28-512A-4B0E-8B18-D9A9AB584F76",
                    "taskplantypetext": "工序任务",
                    "dataflagtext": null
                  },
                  {
                    "idtext": "2",
                    "remark": null,
                    "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                    "materialname": "成品5",
                    "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                    "children": [
                      {
                        "idtext": "1",
                        "remark": null,
                        "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                        "materialname": "成品5",
                        "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                        "children": [],
                        "ordernumber": "SC-20190117-001",
                        "taskplannumble": 1,
                        "systemcodeid": null,
                        "serialnumber": "1901",
                        "parentId": "9A8FFFA0-335D-4C40-9AE8-DD61173731B8",
                        "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                        "periodday": 15,
                        "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                        "priority": 1,
                        "prioritytext": "正常",
                        "tasktime": "2019-2",
                        "mpmprocessid": "b53e0dd2a7f2451c9baf0abfa373343d",
                        "createDate": "2019-01-25 17:50:30",
                        "depname": null,
                        "xhname": "F-117",
                        "taskplanname": "铣",
                        "securitylevel": null,
                        "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                        "plantype": null,
                        "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                        "planenddate": "2019-01-31",
                        "taskplantypesortcode": 7,
                        "taskstatustext": "起草",
                        "technicalid": null,
                        "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                        "taskplantype": null,
                        "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                        "taskstatus": 1,
                        "jdname": "T",
                        "figurenumber": "GAX--1-005",
                        "workcentreid": null,
                        "planbegindate": "2019-01-17",
                        "Id": "79A961D2-2C87-4503-B3BB-D44F94D1195C",
                        "taskplantypetext": "工序任务",
                        "dataflagtext": null
                      },
                      {
                        "idtext": "1",
                        "remark": null,
                        "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                        "materialname": "成品5",
                        "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                        "children": [],
                        "ordernumber": "SC-20190117-001",
                        "taskplannumble": 1,
                        "systemcodeid": null,
                        "serialnumber": "1901",
                        "parentId": "9A8FFFA0-335D-4C40-9AE8-DD61173731B8",
                        "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                        "periodday": 15,
                        "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                        "priority": 1,
                        "prioritytext": "正常",
                        "tasktime": "2019-2",
                        "mpmprocessid": "b53e0dd2a7f2451c9baf0abfa373343d",
                        "createDate": "2019-01-25 17:56:27",
                        "depname": null,
                        "xhname": "F-117",
                        "taskplanname": "铣",
                        "securitylevel": null,
                        "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                        "plantype": null,
                        "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                        "planenddate": "2019-01-31",
                        "taskplantypesortcode": 7,
                        "taskstatustext": "起草",
                        "technicalid": null,
                        "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                        "taskplantype": null,
                        "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                        "taskstatus": 1,
                        "jdname": "T",
                        "figurenumber": "GAX--1-005",
                        "workcentreid": null,
                        "planbegindate": "2019-01-17",
                        "Id": "9EC84D20-2F14-4B2F-99AB-A74F355DA2FE",
                        "taskplantypetext": "工序任务",
                        "dataflagtext": null
                      }
                    ],
                    "ordernumber": "SC-20190117-001",
                    "taskplannumble": 1,
                    "systemcodeid": null,
                    "serialnumber": "1901",
                    "parentId": "30386500-AD92-4C8C-82A4-EDA6F2E07B59",
                    "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                    "periodday": 15,
                    "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                    "priority": 1,
                    "prioritytext": "正常",
                    "tasktime": "2019-2",
                    "mpmprocessid": null,
                    "createDate": "2019-01-25 17:50:09",
                    "depname": "第七研究室",
                    "xhname": "F-117",
                    "taskplanname": "01",
                    "securitylevel": null,
                    "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                    "plantype": null,
                    "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                    "planenddate": "2019-01-31",
                    "taskplantypesortcode": 6,
                    "taskstatustext": "已下达",
                    "technicalid": null,
                    "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                    "taskplantype": null,
                    "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                    "taskstatus": 5,
                    "jdname": "T",
                    "figurenumber": "GAX--1-005",
                    "workcentreid": "0c86d2d64a4e4fdd8e332ab3efca4050",
                    "planbegindate": "2019-01-17",
                    "Id": "9A8FFFA0-335D-4C40-9AE8-DD61173731B8",
                    "taskplantypetext": "分组任务",
                    "dataflagtext": null
                  },
                  {
                    "idtext": "1",
                    "remark": null,
                    "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
                    "materialname": "成品5",
                    "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
                    "children": [],
                    "ordernumber": "SC-20190117-001",
                    "taskplannumble": 1,
                    "systemcodeid": null,
                    "serialnumber": "1901",
                    "parentId": "30386500-AD92-4C8C-82A4-EDA6F2E07B59",
                    "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                    "periodday": 15,
                    "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                    "priority": 1,
                    "prioritytext": "正常",
                    "tasktime": "2019-2",
                    "mpmprocessid": "b53e0dd2a7f2451c9baf0abfa373343d",
                    "createDate": "2019-01-25 17:44:23",
                    "depname": null,
                    "xhname": "F-117",
                    "taskplanname": "铣",
                    "securitylevel": null,
                    "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                    "plantype": null,
                    "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                    "planenddate": "2019-01-31",
                    "taskplantypesortcode": 7,
                    "taskstatustext": "起草",
                    "technicalid": null,
                    "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                    "taskplantype": null,
                    "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                    "taskstatus": 1,
                    "jdname": "T",
                    "figurenumber": "GAX--1-005",
                    "workcentreid": null,
                    "planbegindate": "2019-01-17",
                    "Id": "F1E8BEC7-6AD9-4352-8400-A3C47431B8BC",
                    "taskplantypetext": "工序任务",
                    "dataflagtext": null
                  }
                ],
                "ordernumber": "SC-20190117-001",
                "taskplannumble": 1,
                "systemcodeid": null,
                "serialnumber": "1901",
                "parentId": "5C635516-F0B9-4EEE-A2E7-9E885E41",
                "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
                "periodday": 15,
                "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
                "priority": 1,
                "prioritytext": "正常",
                "tasktime": "2019-2",
                "mpmprocessid": null,
                "createDate": "2019-01-25 17:18:20",
                "depname": "第七研究室",
                "xhname": "F-117",
                "taskplanname": "机加",
                "securitylevel": null,
                "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
                "plantype": null,
                "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
                "planenddate": "2019-01-31",
                "taskplantypesortcode": 5,
                "taskstatustext": "已下达",
                "technicalid": null,
                "plantypeid": "bf4cd77fa563486d828d6562f836845b",
                "taskplantype": null,
                "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
                "taskstatus": 5,
                "jdname": "T",
                "figurenumber": "GAX--1-005",
                "workcentreid": "0c86d2d64a4e4fdd8e332ab3efca4050",
                "planbegindate": "2019-01-17",
                "Id": "30386500-AD92-4C8C-82A4-EDA6F2E07B59",
                "taskplantypetext": "工艺任务",
                "dataflagtext": null
              }
            ],
            "ordernumber": "SC-20190117-001",
            "taskplannumble": 1,
            "systemcodeid": null,
            "serialnumber": "1901",
            "parentId": "BCA80C45-0908-414B-9317-A4E5B0FCEC0C",
            "bomproductid": "52c813d14116499dbbefbd41e7a505c9",
            "periodday": 15,
            "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
            "priority": 1,
            "prioritytext": "正常",
            "tasktime": "2019-2",
            "mpmprocessid": null,
            "createDate": "2019-01-25 17:18:20",
            "depname": "第七研究室",
            "xhname": "F-117",
            "taskplanname": "半成品4",
            "securitylevel": null,
            "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
            "plantype": null,
            "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
            "planenddate": "2019-01-31",
            "taskplantypesortcode": 4,
            "taskstatustext": "已下达",
            "technicalid": null,
            "plantypeid": "bf4cd77fa563486d828d6562f836845b",
            "taskplantype": 2,
            "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
            "taskstatus": 5,
            "jdname": "T",
            "figurenumber": "GAX--1-005",
            "workcentreid": "0c86d2d64a4e4fdd8e332ab3efca4050",
            "planbegindate": "2019-01-17",
            "Id": "5C635516-F0B9-4EEE-A2E7-9E885E41",
            "taskplantypetext": "零部件任务",
            "dataflagtext": null
          },
          {
            "idtext": "1",
            "remark": null,
            "productcodeid": "061b346a5bd1470a8ff6b5828f16ab6e",
            "materialname": "成品5",
            "taskid": "vNLxzUjFfYzUwiehHzTDFfiB20EiSMxB",
            "children": [],
            "ordernumber": "SC-20190117-001",
            "taskplannumble": 2,
            "systemcodeid": null,
            "serialnumber": "1901",
            "parentId": "BCA80C45-0908-414B-9317-A4E5B0FCEC0C",
            "bomproductid": "4b69d83c43364e138a9794e968d7b751",
            "periodday": 15,
            "productid": "8f3b03ca0235415ba7cfecd461cecdb2",
            "priority": 1,
            "prioritytext": "正常",
            "tasktime": "2019-2",
            "mpmprocessid": null,
            "createDate": "2019-01-25 17:18:20",
            "depname": "第八研究室",
            "xhname": "F-117",
            "taskplanname": "半成品1",
            "securitylevel": null,
            "bomid": "ffea749f30da4439ac6ba11a99af4fd7",
            "plantype": null,
            "stageid": "1875b9c37dfc42ee9f099ac467b528d1",
            "planenddate": "2019-01-31",
            "taskplantypesortcode": 4,
            "taskstatustext": "外协中",
            "technicalid": null,
            "plantypeid": "bf4cd77fa563486d828d6562f836845b",
            "taskplantype": 2,
            "taskplanid": "35EDCACE-5417-4435-A48F-A799D5C89ED1",
            "taskstatus": 11,
            "jdname": "T",
            "figurenumber": "GAX--1-005",
            "workcentreid": "019ea3b98db3405aa4858053bb39e965",
            "planbegindate": "2019-01-17",
            "Id": "6307B48F-D7E0-4A63-9D66-78160148",
            "taskplantypetext": "零部件任务",
            "dataflagtext": null
          }
        ],
        "isSuccess": true,
        "message": null,
        "status": 200
    }
    public data = {
        gantt: {
            enabled: true,
            credits: {
                enabled: false
            },
            type: 'gantt-project',
            splitterPosition: 200,
            defaultRowHeight: 40,
            controller: {
                treeData: {
                    rootMapping: {},
                    children: [
                        {
                            treeDataItemData: {
                                id: 1,
                                name: 'AA_安全机构',
                                rowHeight: 40
                            },
                            children: [
                                {
                                    treeDataItemData: {
                                        id: 4,
                                        name: '动作组件',
                                        rowHeight: 40,
                                        actualStart: 1533081600000,
                                        actualEnd: 1533859200000,
                                        baselineStart: 1533081600000,
                                        baselineEnd: 1533859200000,
                                        progressValue: '40%',
                                        connector: [
                                            {
                                                connectTo: 2
                                            }
                                        ]
                                    },
                                    treeDataItemMeta: {},
                                    children: [
                                        {
                                            treeDataItemData: {
                                                id: 2,
                                                name: '工序 1',
                                                actualStart: 1533810200000,
                                                actualEnd: 1534540200000,
                                                rowHeight: 40,
                                                connector: [
                                                    {
                                                        connectTo: 3
                                                    }
                                                ]
                                            },
                                            treeDataItemMeta: {}
                                        },
                                        {
                                            treeDataItemData: {
                                                id: 3,
                                                name: '工序 2',
                                                actualStart: 1533427200000,
                                                actualEnd: 1533859200000,
                                                rowHeight: 40
                                                // "connector": [
                                                //     {
                                                //         "connectTo": 7
                                                //     }
                                                // ]
                                            },
                                            treeDataItemMeta: {}
                                        }
                                    ]
                                }
                            ]
                        }

                        // {
                        //   "treeDataItemData": {
                        //     "id": 0,
                        //     "name": "Additional Planning"
                        //   },
                        //   "treeDataItemMeta": {},
                        //   "children": [
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 1,
                        //         "name": "Additional Phase #1",
                        //         "actualStart": 1391990400000,
                        //         "actualEnd": 1392422400000,
                        //         "progressValue": "30%",
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": 2
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 2,
                        //         "name": "Additional Phase #2",
                        //         "actualStart": 1392249600000,
                        //         "actualEnd": 1392595200000,
                        //         "baselineStart": 1392163200000,
                        //         "baselineEnd": 1392681600000,
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": 3
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 3,
                        //         "name": "Additional Phase #3",
                        //         "actualStart": 1392681600000,
                        //         "actualEnd": 1392940800000,
                        //         "rowHeight": 30,
                        //         "connector": [
                        //           {
                        //             "connectTo": "milestone"
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": "milestone",
                        //         "name": "Additional Summary Meeting",
                        //         "actualStart": 1393002000000,
                        //         "rowHeight": 30
                        //       },
                        //       "treeDataItemMeta": {}
                        //     }
                        //   ]
                        // },
                        // {
                        //   "treeDataItemData": {
                        //     "id": 8,
                        //     "name": "Quality Assurance"
                        //   },
                        //   "treeDataItemMeta": {},
                        //   "children": [
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 9,
                        //         "name": "QA Phase #1",
                        //         "rowHeight": 30,
                        //         "actualStart": 1394236800000,
                        //         "actualEnd": 1394668800000,
                        //         "baselineStart": 1394409600000,
                        //         "baselineEnd": 1394668800000,
                        //         "connector": [
                        //           {
                        //             "connectTo": 10
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 10,
                        //         "name": "QA Phase #2",
                        //         "actualStart": 1394841600000,
                        //         "actualEnd": 1395014400000,
                        //         "rowHeight": 30,
                        //         "progressValue": "10%",
                        //         "connector": [
                        //           {
                        //             "connectTo": 11
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     },
                        //     {
                        //       "treeDataItemData": {
                        //         "id": 11,
                        //         "name": "QA Phase #3",
                        //         "rowHeight": 30,
                        //         "actualStart": 1395187200000,
                        //         "actualEnd": 1395705600000,
                        //         "connector": [
                        //           {
                        //             "connectTo": 8,
                        //             "connectorType": "finish-start"
                        //           }
                        //         ]
                        //       },
                        //       "treeDataItemMeta": {}
                        //     }
                        //   ]
                        // }
                    ],
                    index: ['id']
                },
                verticalOffset: 0,
                startIndex: 0
            },
            dataGrid: {
                enabled: true,
                headerHeight: 70,
                edit: {},
                horizontalOffset: 0,
                buttons: {
                    enabled: true,
                    hovered: {
                        background: {}
                    },
                    selected: {
                        background: {}
                    }
                },
                columns: [
                    {
                        enabled: true,
                        width: 50,
                        collapseExpandButtons: false,
                        depthPaddingMultiplier: 0,
                        labels: {
                            zIndex: 0,
                            enabled: true,
                            background: {
                                enabled: false,
                                fill: '#ffffff',
                                stroke: 'none',
                                cornerType: 'round',
                                corners: 0
                            },
                            padding: {
                                left: 5,
                                top: 0,
                                bottom: 0,
                                right: 5
                            },
                            minFontSize: 8,
                            maxFontSize: 72,
                            adjustFontSize: {
                                width: false,
                                height: false
                            },
                            fontSize: 16,
                            fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                            fontColor: '#7c868e',
                            fontOpacity: 1,
                            fontDecoration: 'none',
                            fontStyle: 'normal',
                            fontVariant: 'normal',
                            fontWeight: 'normal',
                            letterSpacing: 'normal',
                            textDirection: 'ltr',
                            lineHeight: 'normal',
                            textIndent: 0,
                            vAlign: 'middle',
                            hAlign: 'start',
                            wordWrap: 'normal',
                            wordBreak: 'break-all',
                            textOverflow: '',
                            selectable: false,
                            disablePointerEvents: true,
                            useHtml: false,
                            format: '{%linearIndex}',
                            anchor: 'left-top',
                            offsetX: 0,
                            offsetY: 0,
                            rotation: 0
                        },
                        title: {
                            enabled: true,
                            fontSize: 16,
                            fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                            fontColor: '#7c868e',
                            fontOpacity: 1,
                            fontDecoration: 'none',
                            fontStyle: 'normal',
                            fontVariant: 'normal',
                            fontWeight: 'normal',
                            letterSpacing: 'normal',
                            textDirection: 'ltr',
                            lineHeight: 'normal',
                            textIndent: 0,
                            vAlign: 'middle',
                            hAlign: 'center',
                            wordWrap: 'normal',
                            wordBreak: 'normal',
                            textOverflow: '',
                            selectable: false,
                            disablePointerEvents: false,
                            useHtml: false,
                            height: 70,
                            align: 'center',
                            text: '序号',
                            background: {
                                enabled: false,
                                fill: '#ffffff',
                                stroke: 'none',
                                cornerType: 'round',
                                corners: 0
                            }
                        }
                    },
                    {
                        enabled: true,
                        width: 170,
                        collapseExpandButtons: true,
                        depthPaddingMultiplier: 15,
                        labels: {
                            zIndex: 0,
                            enabled: true,
                            background: {
                                enabled: false,
                                fill: '#03f5f4',
                                stroke: 'none',
                                cornerType: 'round',
                                corners: 0
                            },
                            padding: {
                                left: 5,
                                top: 0,
                                bottom: 0,
                                right: 5
                            },
                            minFontSize: 8,
                            maxFontSize: 72,
                            adjustFontSize: {
                                width: false,
                                height: false
                            },
                            fontSize: 16,
                            fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                            fontColor: '#333',
                            fontOpacity: 1,
                            fontDecoration: 'none',
                            fontStyle: 'normal',
                            fontVariant: 'normal',
                            fontWeight: 'normal',
                            letterSpacing: 'normal',
                            textDirection: 'ltr',
                            lineHeight: 'normal',
                            textIndent: 0,
                            vAlign: 'middle',
                            hAlign: 'start',
                            wordWrap: 'normal',
                            wordBreak: 'break-all',
                            textOverflow: '',
                            selectable: false,
                            disablePointerEvents: true,
                            useHtml: false,
                            format: '{%name}',
                            anchor: 'left-top',
                            offsetX: 0,
                            offsetY: 0,
                            rotation: 0
                        },
                        title: {
                            enabled: true,
                            fontSize: 16,
                            fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                            fontColor: '#7c868e',
                            fontOpacity: 1,
                            fontDecoration: 'none',
                            fontStyle: 'normal',
                            fontVariant: 'normal',
                            fontWeight: 'normal',
                            letterSpacing: 'normal',
                            textDirection: 'ltr',
                            lineHeight: 'normal',
                            textIndent: 0,
                            vAlign: 'middle',
                            hAlign: 'center',
                            wordWrap: 'normal',
                            wordBreak: 'normal',
                            textOverflow: '',
                            selectable: false,
                            disablePointerEvents: false,
                            useHtml: false,
                            height: 70,
                            align: 'center',
                            text: '任务名称',
                            background: {
                                enabled: false,
                                fill: '#ffffff',
                                stroke: 'none',
                                cornerType: 'round',
                                corners: 0
                            }
                        }
                    }
                ],
                horizontalScrollBar: {
                    enabled: true,
                    backgroundStroke: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    backgroundFill: {
                        color: '#e0e0e0',
                        opacity: 0.25
                    },
                    sliderFill: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    sliderStroke: {
                        color: '#656565',
                        opacity: 0.25
                    }
                }
            },
            timeline: {
                enabled: true,
                edit: {},
                scale: {
                    visibleMinimum: 1514764800000,
                    visibleMaximum: 1546214400000,
                    dataMinimum: 1514764800000,
                    dataMaximum: 1546214400000,
                    minimumGap: 0.01,
                    maximumGap: 0.01
                },
                markers: {
                    enabled: null
                },
                header: {
                    zIndex: 80,
                    enabled: true,
                    background: {
                        zIndex: 0,
                        enabled: false
                    },
                    levels: [{}]
                },
                elements: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                tasks: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    },
                    progress: {
                        normal: {},
                        selected: {},
                        edit: {
                            thumbs: {},
                            connectorThumbs: {},
                            start: {
                                thumb: {},
                                connectorThumb: {}
                            },
                            end: {
                                thumb: {},
                                connectorThumb: {}
                            }
                        }
                    }
                },
                groupingTasks: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    },
                    progress: {
                        normal: {},
                        selected: {},
                        edit: {
                            thumbs: {},
                            connectorThumbs: {},
                            start: {
                                thumb: {},
                                connectorThumb: {}
                            },
                            end: {
                                thumb: {},
                                connectorThumb: {}
                            }
                        }
                    }
                },
                baselines: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                milestones: {
                    edit: {
                        start: {
                            thumb: {},
                            connectorThumb: {}
                        },
                        end: {
                            thumb: {},
                            connectorThumb: {}
                        }
                    }
                },
                horizontalScrollBar: {
                    enabled: true,
                    backgroundStroke: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    backgroundFill: {
                        color: '#e0e0e0',
                        opacity: 0.25
                    },
                    sliderFill: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    sliderStroke: {
                        color: '#656565',
                        opacity: 0.25
                    }
                },
                verticalScrollBar: {
                    zIndex: 20,
                    enabled: true,
                    backgroundStroke: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    backgroundFill: {
                        color: '#e0e0e0',
                        opacity: 0.25
                    },
                    sliderFill: {
                        color: '#d5d5d5',
                        opacity: 0.25
                    },
                    sliderStroke: {
                        color: '#656565',
                        opacity: 0.25
                    }
                }
            }
        }
    };
    public change = false;

    constructor(
        private _api: ApiService,
        private _cacheService: CacheService,
        @Inject(BSN_COMPONENT_MODES)
        private stateEvents: Observable<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascade: Observer<BsnComponentMessage>,
        @Inject(BSN_COMPONENT_CASCADE)
        private cascadeEvents: Observable<BsnComponentMessage>
    ) {
        super();
        this.apiResource = _api;
        this.cacheValue = this._cacheService
    }

    public ngOnInit() {
        this.initValue = this.initData ? this.initData : {};
    }

    private load() {

    }

    private async getAsyncData() {
        // 尝试采用加载多个数据源配置,异步加载所有数据后,进行数据整合,然后进行绑定
        const url = this.buildUrl(this.config.ajaxConfig.url);
        const params = this.resolverParameters(this.config.ajaxConfig.params);
        return this.apiResource[this.config.ajaxConfig.ajaxType](url, params).toPromise();
    }

    private resolverParameters(config) {
        let params = this.buildParameter(config);
        config.forEach(cfg => {
            if (Array.isArray(cfg.children) && cfg.children.length > 0) {
                const p = {};
                p[cfg.name] = this.resolverParameters(cfg.children);
                params = { ...params, ...p };
            }
        });
        return params;
    }

    public buildParameter(parameters) {
        const params = CommonTools.parametersResolver({
            params: parameters,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        return params;
    }

    public buildUrl(urlConfig) {
        let url;
        if (CommonTools.isString(urlConfig)) {
            url = urlConfig;
        }
        return url;
    }

    private resolverRelation() {
        if (
            this.config.componentType &&
            this.config.componentType.child === true
        ) {
            this._cascadeSubscription = this.cascadeEvents.subscribe(
                cascadeEvent => {
                    // 解析子表消息配置
                    if (
                        this.config.relations &&
                        this.config.relations.length > 0
                    ) {
                        this.config.relations.forEach(relation => {
                            if (
                                relation.relationViewId === cascadeEvent._viewId
                            ) {
                                // 获取当前设置的级联的模式
                                const mode =
                                    BSN_COMPONENT_CASCADE_MODES[
                                    relation.cascadeMode
                                    ];
                                // 获取传递的消息数据
                                const option = cascadeEvent.option;
                                // 解析参数
                                if (
                                    relation.params &&
                                    relation.params.length > 0
                                ) {
                                    relation.params.forEach(param => {
                                        this.tempValue[param['cid']] =
                                            option.data[param['pid']];
                                    });
                                }
                                // 匹配及联模式
                                switch (mode) {
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH:
                                        this.load();
                                        break;
                                    case BSN_COMPONENT_CASCADE_MODES.REFRESH_AS_CHILD:
                                        this.load();
                                        break;
                                }
                            }
                        });
                    }
                }
            );
        }
    }

    public changeDate() {
        this.change = !this.change;
        if (this.change) {
            this.getGantt_1();
        } else {
            this.getGantt_2();
        }
    }

    public ngAfterViewInit(): void {
        anychart.format.inputLocale('zh-cn');
        anychart.format.inputDateTimeFormat('yyyy.MM.dd'); // Like '2015.03.12'
        anychart.format.outputLocale('zh-cn');
        this.getGantt_1();
    }

    public getGantt_1() {
        const chart = anychart.fromJson(this.data);
        chart.container('container');
        chart.draw();
        chart.fitAll();
    }

    public getGantt_2() {
        // create data
        const treeData = anychart.data.tree(this.getData(), 'as-table');

        // create gantt-project chart
        const chart = anychart.ganttProject();

        // set data
        chart.data(treeData);

        // setting common rows separation stroke
        // chart.rowStroke('#90caf9');

        // set main splitter's pixel position
        // chart.splitterPosition(300);

        // datagrid settings
        const dataGrid = chart.dataGrid();

        dataGrid
            .rowEvenFill('#e3f2fd')
            .rowOddFill('#f6fbfe')
            .rowHoverFill('#fff8e1')
            .rowSelectedFill('#ffecb3');
        // .columnStroke('2 #90caf9');

        dataGrid
            .column(0)
            .title()
            .text('编号');
        dataGrid
            .column(1)
            .width(250)
            .title('标题');
        dataGrid
            .column(2)
            .labels()
            .format(function() {
                const start = this['actualStart'] || this['autoStart'];
                return anychart.format.date(start);
            });
        dataGrid.column(2).title('开始');

        dataGrid
            .column(3)
            .labels()
            .format(function() {
                const end = this['actualEnd'] || this['autoEnd'];
                return end === void 0 ? '' : anychart.format.date(end); // can be milestone
            });
        dataGrid.column(3).title('结束');

        // tooltip settings
        dataGrid.tooltip().format(this.tooltipFormatter);
        chart
            .getTimeline()
            .tooltip()
            .format(this.tooltipFormatter);

        // set container id for the chart
        chart.container('container');

        // initiate chart drawing
        chart.draw();
    }

    // formatter for timeline and datagrid tooltips
    public tooltipFormatter() {
        const startDate = this['actualStart'] || this['autoStart'];
        const endDate = this['actualEnd'] || this['autoEnd'];
        let progress = this['progressValue'];

        if (progress === void 0) {
            const auto = this['autoProgress'] * 100;
            progress = (Math.round(auto * 100) / 100 || 0) + '%';
        }

        return (
            (startDate ? '开始时间: ' + anychart.format.date(startDate) : '') +
            (endDate ? '\n结束时间: ' + anychart.format.date(endDate) : '') +
            (progress ? '\n进度: ' + progress : '')
        );
    }

    // simple data
    public getData() {
        return [
            {
                id: '1',
                name: 'Phase 1 - Strategic Plan'
            },
            {
                id: '2',
                name: 'Self assessment',
                parent: '1'
            },
            {
                id: '3',
                name: 'It defines the business vision',
                parent: '2',
                actualStart: '2015.03.13',
                actualEnd: '2015.03.24'
            },
            {
                id: '4',
                name:
                    'To identify the available skills, information and support',
                parent: '2',
                actualStart: '2015.03.25',
                actualEnd: '2015.04.06'
            },
            {
                id: '5',
                name: 'Decide whether you want to continue',
                parent: '2',
                actualStart: '2015.04.07',
                actualEnd: '2015.04.15',
                baselineStart: '2015.04.06',
                baselineEnd: '2015.04.18'
            }
        ];
    }
}
// anychart-credits-text

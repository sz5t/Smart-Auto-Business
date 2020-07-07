import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { CommonTools } from '@core/utility/common-tools';
import { SystemResource, SystemResource_1 } from '@core/utility/system-resource';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-upload',
    templateUrl: './bsn-upload.component.html',
    styles: [
        `
            :host ::ng-deep nz-upload {
                display: block;
            }

            :host ::ng-deep .ant-upload.ant-upload-drag {
                height: 180px;
            }
            :host ::ng-deep .file-list {
                min-height: 250px;
            }
            :host ::ng-deep .uploadList-container {
                overflow: auto;
                height: 200px;
            }
        `
    ]
})
export class BsnUploadComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input()
    public refObj;
    public uploading = false;
    public fileList: UploadFile[] = [];
    public fileType: string;
    public promptText: string;
    public promptTextStyle: object;
    public securityList = [];
    public uploadList = [];
    public loading = false;
    public securityLevel;
    public remark;

    public isUpload = true;
    public url = SystemResource.appSystem.Server;
    constructor(
        private _message: NzMessageService,
        private _apiService: ApiService
    ) {}

    public ngOnInit() {
        if (this.config.showList) {
            this.isUpload = false;
        }
        if (this.config.fileType) {
            this.fileType = this.config.fileType
        } else if (this.config.ajaxConfig.fileType) {
            this.fileType = this.config.ajaxConfig.fileType
        }

        if (this.config.promptText) {
            this.promptText = this.config.promptText
        } else if (this.config.ajaxConfig.promptText) {
            this.promptText = this.config.ajaxConfig.promptText
        } else {
            this.promptText = '请确认文件格式！'
        }

        if (this.config.promptTextStyle) {
            this.promptTextStyle = this.config.promptTextStyle
        } else if (this.config.ajaxConfig.promptTextStyle) {
            this.promptTextStyle = this.config.ajaxConfig.promptTextStyle
        } else {
            this.promptTextStyle = {'font-size': '14px', 'color': '	#FF0000'}
        }
        
        if (this.config.securityConfig) {
            this.getsecurityList();
            this.loadUploadList();
        } else if (!this.config.securityConfig) {
            this.loadUploadList();
        }
    }

    public ngAfterViewInit() {
       // this.loadUploadList();
       this.url = this._replaceCurrentURL(this.url);
    }
    
    public getsecurityList() {
           this._apiService
            .get(
                this.config.securityConfig['SecurityUrl'],
                CommonTools.parametersResolver({
                    params: this.config.securityConfig['params'],
                    tempValue: this.refObj
                })
            )
            .subscribe(
                result => {
                    this.securityList = result.data;
                        this.loading = false;
                },
                error => {
                        this.loading = false;
                }
            );
    }

    public async loadUploadList() {
        this.loading = true;
        if (this.config.ajaxConfig) {
            this._apiService
            .get(
                this.config.ajaxConfig['listUrl'],
                CommonTools.parametersResolver({
                    params: this.config.ajaxConfig['params'],
                    tempValue: this.refObj
                })
            )
            .subscribe(
                result => {
                    this.uploadList = result.data;
                        this.loading = false;
                },
                error => {
                        this.loading = false;
                }
            );
        } else {
            this._apiService
            .get(
                this.config['listUrl'],
                CommonTools.parametersResolver({
                    params: this.config['params'],
                    tempValue: this.refObj
                })
            )
            .subscribe(
                result => {
                    this.uploadList = result.data;
                        this.loading = false;
                },
                error => {
                        this.loading = false;
                }
            );
        }
           
    }

    public handleChange({ file, fileList }): void {
        const status = file.status;
        if (status !== 'uploading') {
        }
        if (status === 'done') {
            this._message.success(`文件 ${file.name} 上传成功！`);
        } else if (status === 'error') {
            this._message.error(`文件 ${file.name} 上传失败！`);
        }
    }
    public beforeUpload = (file: UploadFile): boolean => {
        this.fileList.push(file);
        return false;
    };

    /**
     *  "refDataId":"",                                       --关联的业务数据主键
         "batch":"",                                           --批次，标识同一次上传的文件
         "file_1":"",                                          --上传的第一个文件
         "secretLevel_1":"",                                   --上传第一个文件的密级
         ...
         "file_x":"",                                          --上传的第x个文件
         "secretLevel_x":""                                    --上传第x个文件的密级
     */

    public handleUpload(): void {
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        this.fileList.forEach((file: any, index) => {
            formData.append(`file_${index}`, file);
            formData.append(`secretLevel_${index}`, this.securityLevel);
            formData.append(`remark_${index}`, this.remark);
        });
        if (this.refObj._id) {
            formData.append('refDataId', this.refObj._id);
        } else {
            formData.append('refDataId', this.refObj.Id);
        }
        setTimeout(() => {
            this.uploading = true;
        });
        if (this.config.ajaxConfig) {
            this._apiService.post(this.config.ajaxConfig['url'], formData).subscribe(
                result => {
                    setTimeout(() => {
                        this.uploading = false;    
                    });
                    if (this.config.showpicture) {
                        this._apiService.post(
                            this.config.ajaxConfig['faceUrl'],
                            {
                             'refDataId' : result.data['refDataId'], 
                             'path' : result.data['urlPath'], 
                             'code': result.data['code'],
                             'suffix': result.data['suffix']
                            }
                        )
                        .subscribe(
                            resultlist => {
                                // this.uploadList = result.data;
                                    this.loading = false;
                            },
                            error => {
                                    this.loading = false;
                            }
                        );
                    }
                    this._message.success('上传成功！');
                    this.loadUploadList();
                },
                error => {
                    setTimeout(() => {
                        this.uploading = false;    
                    });
                    this._message.error('上传失败！');
                }
            );
        } else {
            this._apiService.post(this.config['url'], formData).subscribe(
                result => {
                    setTimeout(() => {
                        this.uploading = false;    
                    });
                    if (this.config.showpicture) {
                        this._apiService.post(
                            this.config['faceUrl'],
                            {
                             'refDataId' : result.data['refDataId'], 
                             'path' : result.data['urlPath'], 
                             'code': result.data['code'],
                             'suffix': result.data['suffix']
                            }
                        )
                        .subscribe(
                            resultlist => {
                                // this.uploadList = result.data;
                                    this.loading = false;
                            },
                            error => {
                                    this.loading = false;
                            }
                        );
                    }
                    this._message.success('上传成功！');
                    this.loadUploadList();
                },
                error => {
                    setTimeout(() => {
                        this.uploading = false;    
                    });
                    this._message.error('上传失败！');
                }
            );
        }
        
       
    }

    public download(id) {
        if (this.config.ajaxConfig) {
            this._apiService
            .get(this.config.ajaxConfig['downloadUrl'], { _ids: id })
            .subscribe(result => {
                this._message.success('下载成功');
            });
        } else {
            this._apiService
            .get(this.config['downloadUrl'], { _ids: id })
            .subscribe(result => {
                this._message.success('下载成功');
            });
        }
        
    }

    public delete(id) {
        if (this.config.ajaxConfig) {
            this._apiService.delete(this.config.ajaxConfig['deleteUrl'], { _ids: id }).subscribe(
                result => {
                    this._message.success('附件删除成功');
                    this.loadUploadList();
                },
                error => {
                    this._message.success('附件删除失败！');
                }
            );
        } else {
            this._apiService.delete(this.config['deleteUrl'], { _ids: id }).subscribe(
                result => {
                    this._message.success('附件删除成功');
                    this.loadUploadList();
                },
                error => {
                    this._message.success('附件删除失败！');
                }
            );
        }
    }

    public _replaceCurrentURL(oldUrl: string): string {
        const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        const reg_port = /:\d{1,5}/;
        const reg_all = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/
        const ip = reg_all.exec(oldUrl)[0];
        
        const href = window.location.href;

        const port = reg_port.exec(href)[0];
        const subPort = reg_port.exec(href)[0].substring(1, port.length);

        let match, matchIP;
        if (href.indexOf('localhost') < 0) {
            match = reg.exec(window.location.href)[0].replace(/\./g, '_');  
            
            matchIP = `url_${match}_${subPort}`;
        } else {
            matchIP = `url_localhost_${subPort}`;
        }
        let newIP;
        if (oldUrl.indexOf('api.cfg') > 0) {
            newIP = SystemResource_1[matchIP].settingSystemServer;
        } else if (oldUrl.indexOf('ReportServer.ashx') > 0) {
            newIP = SystemResource_1[matchIP].reportServerUrl;
        } else {
            newIP = SystemResource_1[matchIP].localResourceUrl;
        }
        return oldUrl.replace(ip, newIP);
    }

    public cancel() {
        return false;
    }
}

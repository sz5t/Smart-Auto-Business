import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { ApiService } from '@core/utility/api-service';
import { CommonTools } from '@core/utility/common-tools';
import { SystemResource } from '@core/utility/system-resource';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bsn-import-excel',
    templateUrl: './bsn-import-excel.component.html',
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
export class BsnImportExcelComponent implements OnInit, AfterViewInit {
    @Input()
    public config;
    @Input()
    public refObj;
    public uploading = false;
    public fileList: UploadFile[] = [];
    public uploadList = [];
    public loading = false;
    public securityLevel;
    public remark;

    public isUpload = true;
    public url = SystemResource.appSystem.Server;
    constructor(
        private _message: NzMessageService,
        private _apiService: ApiService
    ) { }

    public ngOnInit() {
        // this.isUpload = false;
        // if (this.config.showList) {

        // }
        // this.loadUploadList();
    }

    public ngAfterViewInit() {
        // this.loadUploadList();
    }

    // public async loadUploadList() {
    //     this.loading = true;
    //        this._apiService
    //         .get(
    //             this.config.listUrl,
    //             CommonTools.parametersResolver({
    //                 params: this.config.params,
    //                 tempValue: this.refObj
    //             })
    //         )
    //         .subscribe(
    //             result => {
    //                 this.uploadList = result.data;
    //                     this.loading = false;
    //             },
    //             error => {
    //                     this.loading = false;
    //             }
    //         );
    // }

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
        if (this.fileList.length > 0) {
            this._message.warning('只允许导入一个excel文件');
        } else {
            this.fileList.push(file);
        }
        return false;
    };

    public handleUpload(): void {
        let continues = false;
        const formData = new FormData();
        
        // tslint:disable-next-line:no-any
        
        this.fileList.forEach((file: any, index) => {
            const startIndex = file.name.lastIndexOf('.');
            const endIndex = file.name.length - 1;
            const extName = file.name.substring(startIndex, endIndex);
            if (extName === '.xls' || extName === '.xlsx') {
                continues = true;
            }
            formData.append(`file_${index}`, file);
        });

        if (continues) {
            formData.append('refDataId', 'import_excel' + CommonTools.uuID(6));
            formData.append('isImport', '1');
            setTimeout(() => {
                this.uploading = true;
            });
            this._apiService.post(this.config.url, formData).subscribe(
                result => {
                    let importData;
                    if (result.data && Array.isArray(result.data)) {
                        // 数组
                        importData = [];
                        for (const d of result.data) {
                            importData.push({
                                fileId: d.Id,
                                resourceName: '',
                                batchImportCount: ''
                            });
                        }
                    } else if (result.data) {
                        // 对象
                        importData = {
                            fileId: result.data['Id'],
                            resourceName: this.config.resourceName,
                            batchImportCount: this.config.batchImportCount
                        };
                        this._apiService.post(this.config.importUrl, importData).subscribe(
                            result1 => {
                                if (result1.isSuccess) {
                                    setTimeout(() => {
                                        this.uploading = false;
                                    });
                                    this._message.success('数据导入成功');
                                    // this.loadUploadList();

                                } else {
                                    setTimeout(() => {
                                        this.uploading = false;
                                    });
                                    this._message.error(`导入失败: ${result1.message}`)
                                }
                            },
                            error1 => {
                                setTimeout(() => {
                                    this.uploading = false;
                                });
                                this._message.error(`导入失败: ${error1}`);
                            }
                        )

                    }
                },
                error => {
                    setTimeout(() => {
                        this.uploading = false;
                    });
                    this._message.error('上传失败！');
                }
            );
        } else {
            this._message.warning('导入的文件应为: .xls或.xlsx 的excel文件')
        }


    }

    public cancel() {
        return false;
    }
}

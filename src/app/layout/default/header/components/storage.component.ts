import { Component, HostListener } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'header-storage',
    template: `
    <i class="anticon anticon-tool"></i>
    {{ 'clear-local-storage'}}`
})
export class HeaderStorageComponent {

    constructor(
        private confirmServ: NzModalService,
        private messageServ: NzMessageService
    ) {
    }

    @HostListener('click')
    _click() {
        this.confirmServ.confirm({
            nzTitle: '确认要清除所有本地存储?',
            nzOnOk: () => {
                localStorage.clear();
                this.messageServ.success('Clear Finished!');
            }
        });
    }
}

import { Component, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
    selector: 'ts-header-fullscreen',
    template: `
    <i class="anticon anticon-{{status ? 'shrink' : 'arrows-alt'}}"></i>
    {{(status ? 'fullscreen-exit' : 'fullscreen') }}
    `
})
export class TsHeaderFullScreenComponent {

    public status = false;

    @HostListener('window:resize')
    public _resize() {
        // this.status = screenfull.isFullscreen;
    }

    @HostListener('click')
    public _click() {
        // if (screenfull.enabled) {
        //     screenfull.toggle();
        // }
    }
}


import { Component, OnInit, Input, OnDestroy, Type, Inject } from '@angular/core';
@Component({
    selector: 'bsn-step',
    templateUrl: './bsn-step.component.html',
    styles: [
        `
        .steps-content {
            margin-top: 16px;
            border: 1px dashed #e9e9e9;
            border-radius: 6px;
            background-color: #fafafa;
            min-height: 200px;
            text-align: center;
            padding-top: 10px;
            padding-left: 10px;
          }
    
          .steps-action {
            margin-top: 24px;
          }
          `
    ]
})
export class BsnStepComponent implements OnInit {
    @Input() config;
    @Input() viewId;
    viewCfg;
    _current = 0;
    _status = 'wait';
    indexContent = '';
    constructor(

    ) { }

    ngOnInit() {
        this.getViewCfg();
    }

    pre() {
        if (this._current === 0) return;
        this._current -= 1;
        this.changeContent();
      }
    
      next() {
        if (this._current === this.config.steps.length) return;
        this._current += 1;
        this.changeContent();
      }
    
      done() {
        // console.log('done');
      }

      changeContent() {
        switch (this._current) {
          case 0: {
            this.indexContent = 'First-content';
            break;
          }
          case 1: {
            this.indexContent = 'Second-content';
            break;
          }
          case 2: {
            this.indexContent = 'third-content';
            break;
          }
          default: {
            this.indexContent = 'error';
          }
        }
        this.getViewCfg();
      }

      getViewCfg() {
        this.viewCfg = this.config.steps[this._current].viewCfg;
        // console.log(this.viewCfg);
      }
}

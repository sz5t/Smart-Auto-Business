import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-search',
  templateUrl: './cn-form-search.component.html',
})
export class CnFormSearchComponent implements OnInit, AfterViewInit {

   
    expandForm = false;
    loading = false;
    @Input() formGroup: FormGroup;
    @Input()
    public config;
    @Output() searchEmitter = new EventEmitter();
    @Output() expandEmitter = new EventEmitter();
    constructor() { }

    ngOnInit() { }

    ngAfterViewInit() {
    }

    clickExpand() {
      this.expandForm = !this.expandForm;
      this.expandEmitter.emit(this.expandForm);
    }

    search() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.searchEmitter.emit();
    }

    reset() {

    }
}

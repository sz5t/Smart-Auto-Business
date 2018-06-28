import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cn-form-search',
  templateUrl: './cn-form-search.component.html',
})
export class CnFormSearchComponent implements OnInit {

   
    expandForm = false;
    loading = false;
    @Input() formGroup: FormGroup;
    @Output() searchEmitter: EventEmitter<any> = new EventEmitter<any>();
    constructor() { }

    ngOnInit() { }

    clickExpand() {
      this.expandForm = !this.expandForm;
      // this.expand.emit(this.expandForm);
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

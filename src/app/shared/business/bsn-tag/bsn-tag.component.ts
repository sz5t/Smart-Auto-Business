import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bsn-tag',
  templateUrl: './bsn-tag.component.html',
  styleUrls: ['./bsn-tag.component.css']
})
export class BsnTagComponent implements OnInit {
  public tags: any;

  constructor() { }

  public ngOnInit() {
    this.tags = [
      { label: '测试01' },
      { label: '测试02' },
      { label: '测试03' },
      { label: '测试04' },
      { label: '测试05' },
      { label: '测试06' }
    ]
  }
  public handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    // this.getMultipleValue();
    // this.valueChange(this._value);
  }
  public sliceTagName(tag: any): string {
    const isLongTag = tag['label'].length > 20;
    return isLongTag ? `${tag['label'].slice(0, 20)}...` : tag['label'];
  }

}

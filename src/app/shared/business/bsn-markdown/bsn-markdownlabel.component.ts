import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';
@Component({
  selector: 'bsn-markdownlabel',
  templateUrl: './bsn-markdownlabel.component.html',
  styleUrls: ['./bsn-markdown.component.css']
})
export class BsnMarkdownlabelComponent implements OnInit , OnChanges {

  @Input()
  public config;
  @Input() public value;
  @Input()
  public height;
  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();
  public Geometric;
  public MathematicalSymbols;
  public GreekAlphabet;
  @ViewChild('tablecontentview') public tablecontentview: ElementRef<any>;
  // StackEditor
  public ngOnInit() {
  }
  public ngAfterViewInit(): void {

    const nodetablecontent = this.tablecontentview.nativeElement;
    if (this.value) {
      nodetablecontent.innerHTML = this.value;
    }
    //  this.editormdPreview();
  }

  public ngOnChanges() {
    const nodetablecontent = this.tablecontentview.nativeElement;
    if (this.value) {
      // console.log('ngOnChanges');
      nodetablecontent.innerHTML = this.value;
    }
  }



}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';
@Component({
  selector: 'bsn-markdownlabel',
  templateUrl: './bsn-markdownlabel.component.html',
  styleUrls: ['./bsn-markdown.component.css']
})
export class BsnMarkdownlabelComponent implements OnInit {

  @Input() public value;
  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();
  public Geometric;
  public MathematicalSymbols;
  public GreekAlphabet;
  // StackEditor
  public ngOnInit() {


  }
  public ngAfterViewInit(): void {
    const nodetablecontent = document.getElementById('tablecontent');
    if (this.value) {
      nodetablecontent.innerHTML = this.value;
    }
    //  this.editormdPreview();
  }



}

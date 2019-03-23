import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'jm-editor,[jm-editor]',
  templateUrl: './jm-editor.component.html',
  styleUrls: ['./jm-editor.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})

export class JmEditorComponent implements OnInit {
  // @ViewChild('CKEDITOR') public CKEDITOR: ElementRef;
  public config = {
    col_1: { id: '01', type: '', value: '——', hidden: false, children: {} },
    col_2: { id: '02', type: '', value: '2', hidden: false, children: {} },
    col_3: { id: '03',  type: '', value: '3', hidden: false, children: {} },
    col_4: {  id: '04', type: '', value: '4', hidden: false, children: {} },
    col_5: { id: '05',  type: '', value: '5±', hidden: false, children: {} },
    col_6: { id: '06',  type: '', value: '6', hidden: false, children: {} },
    col_7: { id: '07',  type: '', value: '7', hidden: false, children: {} },
    col_8: { id: '08',  type: '', value: '8', hidden: false, children: {} },
    col_9: { id: '09',  type: '', value: '9', hidden: false, children: {} }

  }
  constructor() { }
  //               "src/assets/vender/JMEditor-0.9.4/jmeditor/JMEditor.js"
  public ngOnInit() {
    // console.log(JMEditor);
  }

  /**
   * execFun
   */
  public execFun() {
    console.log('当前json', this.config);
    
  }

}

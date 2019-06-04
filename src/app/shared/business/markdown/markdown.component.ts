import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.css']
})
export class MarkdownComponent implements OnInit {

  constructor() { }
  ;

  public myEditor: any;
  public editorText: any;
  public obj: any;

  public ZFconfig = [
    { key: '001', name: '±', value: ' \\pm' }
  ];


  @Input() public markdown: string;

  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();

  // StackEditor
  public ngOnInit() {

    console.log('+++++++++++++');


    this.markdown = '  saveHTMLToTextarea : true';
    const data = this.markdown;
    this.myEditor = editormd('editormd', {
      markdown: data,
      width: '100%',
      height: 640,
      syncScrolling: 'single',
      path: '../../assets/editor.md-master/lib/',
      imageUpload: true,
      imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
      imageUploadURL: 'api/upload/mdupload?test=dfdf',
      emoji: true,
      taskList: true,
      tex: true,  // 默认不解析
      flowChart: true,  // 默认不解析
      sequenceDiagram: true,  // 默认不解析SS
      saveHTMLToTextarea: true // 保存
    });

    // 一个小bug 全窗口预览关闭按钮初始化没有隐藏（原因未知），手动隐藏
    //  $('.editormd-preview-close-btn').hide();
  }
  public getData() {
    this.onChange.emit(this.myEditor.getMarkdown());
  }

  /**
   * loadOne
   */
  public loadOne() {
    const dd = this.myEditor.getMarkdown();
    const ss = this.myEditor.getHTML();
    console.log('文本内容:', ss, dd);
  }

  /**
   * createImg
   */
  public createImg() {

    const node1 = document.getElementById('table');

    const node22 = document.getElementsByClassName('markdown-body editormd-preview-container')[0];
    let node = node22.getElementsByClassName('katex-html')[0];
    // const node = document.getElementsByClassName("editormd-preview")[0];
    if (node) { } else { node = node22 }
    console.log('找到节点', node);
    // domtoimage.toPng(node)
    //   .then(function (dataUrl) {
    //     const img = new Image();
    //     img.src = dataUrl;

    //     const nodetablecontent = document.getElementById('tablecontent');
    //     nodetablecontent.appendChild(img);
    //   });
    const img = new Image();
    html2canvas(node, {  // 指定区域
      allowTaint: true,
      taintTest: false,
      onrendered: function (canvas) {
        const dataUrl = canvas.toDataURL('image/png');

        img.src = dataUrl;
        // img.className = 'divimg';
        const nodetablecontent = document.getElementById('tablecontent');
        const that = this;

        nodetablecontent.appendChild(img);
        //  img.onclick =  this.imgClick()


        /*         img.onclick => {
                  alert('您点到我了');
                  this.imgClick();
                } */
        //  $("#make").html("<img src=" + dataUrl + ">");//将图片在什么位置展示
        // dataUrl----base64图片

      }
    });

    img.addEventListener('click', this.imgClick, true);

  }

  public imgClick() {
    console.log('点击图片');

  };


  /**
   * downHtml
   */
  public downHtml() {
    // katex-html
    const node = document.getElementsByClassName('markdown-body editormd-preview-container')[0];
    const node_1 = node.getElementsByClassName('katex-html')[0];
    const nodetablecontent = document.getElementById('tablecontent');
    // for (let i = 0; i <= node_1.length; i--) {
    //   nodetablecontent.appendChild(node_1[i]);
    //   console.log('html 是：', node_1[i]);
    // }
    console.log('html 是：', node_1.innerHTML);
    nodetablecontent.appendChild(node_1.cloneNode());
  }


  /**
   * FH
   */
  public FH() {

    console.log('符号');

  }



  // ----
}

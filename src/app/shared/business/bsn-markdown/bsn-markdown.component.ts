import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';

@Component({
  selector: 'bsn-markdown',
  templateUrl: './bsn-markdown.component.html',
  styleUrls: ['./bsn-markdown.component.css']
})
export class BsnMarkdownComponent implements OnInit {


  constructor() { }
  ;

  public myEditor: any;
  public editorText: any;
  public obj: any;
  // 光标在的文本框
  public FocusIput;
  // 选中的col
  public selectedCol;
  // 常用公式
  public data = [
    { key: '', selected: false, type: '', value: '范围公式', showValue: 'A∼B' },
  ];
  public ZFconfig = [
    // ----常用的数学运算符---
    { key: '1001', name: '>', value: '\>', type: 'MathematicalSymbols' },
    { key: '1002', name: '<', value: '\<', type: 'MathematicalSymbols' },
    { key: '1003', name: '≤', value: '\\le', type: 'MathematicalSymbols' },
    { key: '1004', name: '≥', value: '\\ge', type: 'MathematicalSymbols' },
    { key: '1005', name: '≠', value: '\\ne', type: 'MathematicalSymbols' },
    { key: '1006', name: '≈', value: '\\approx', type: 'MathematicalSymbols' },
    { key: '1007', name: '∼', value: '\\sim', type: 'MathematicalSymbols' },
    { key: '1008', name: '⊆', value: '\\subseteq', type: 'MathematicalSymbols' },
    { key: '1009', name: '∈', value: '\\in', type: 'MathematicalSymbols' },
    { key: '1010', name: '∉', value: '\\notin', type: 'MathematicalSymbols' },
    { key: '1011', name: '+', value: '+', type: 'MathematicalSymbols' },
    { key: '1011', name: '-', value: '-', type: 'MathematicalSymbols' },
    { key: '1011', name: '×', value: '\\times', type: 'MathematicalSymbols' },
    { key: '1012', name: '÷', value: '\\div', type: 'MathematicalSymbols' },
    { key: '1013', name: '±', value: '\\pm', type: 'MathematicalSymbols' },
    { key: '1013', name: '∓', value: '\\mp', type: 'MathematicalSymbols' },
    { key: '1014', name: '⇒', value: '\\Rightarrow', type: 'MathematicalSymbols' },
    { key: '1015', name: '→', value: '\\rightarrow', type: 'MathematicalSymbols' },
    { key: '1016', name: '∞', value: '\\infty', type: 'MathematicalSymbols' },
    { key: '1017', name: '∂', value: '\\partial', type: 'MathematicalSymbols' },
    { key: '1018', name: '∠', value: '\\angle', type: 'MathematicalSymbols' },
    { key: '1019', name: '△', value: '\\triangle', type: 'MathematicalSymbols' },
    { key: '1019', name: '(', value: '(', type: 'MathematicalSymbols' },
    { key: '1019', name: ')', value: ')', type: 'MathematicalSymbols' },

    // ---希腊字母---
    { key: '2001', name: 'α', value: ' \\alpha', type: 'GreekAlphabet' },
    { key: '2002', name: 'β', value: '\\beta', type: 'GreekAlphabet' },
    { key: '2003', name: 'γ', value: '\\gamma', type: 'GreekAlphabet' },
    { key: '2004', name: 'δ', value: '\\delta', type: 'GreekAlphabet' },
    { key: '2005', name: 'ϵ', value: '\\epsilon', type: 'GreekAlphabet' },
    { key: '2006', name: 'ζ', value: '\\zeta', type: 'GreekAlphabet' },
    { key: '2007', name: 'η', value: '\\eta', type: 'GreekAlphabet' },
    { key: '2008', name: 'θ', value: '\\theta', type: 'GreekAlphabet' },
    { key: '2009', name: 'ι', value: '\\iota', type: 'GreekAlphabet' },
    { key: '2010', name: 'κ', value: '\\kappa', type: 'GreekAlphabet' },
    { key: '2011', name: 'λ', value: '\\lambda', type: 'GreekAlphabet' },
    { key: '2012', name: 'μ', value: '\\mu', type: 'GreekAlphabet' },
    { key: '2013', name: 'ν', value: '\\nu', type: 'GreekAlphabet' },
    { key: '2014', name: 'ξ', value: '\\xi', type: 'GreekAlphabet' },
    { key: '2015', name: 'ο', value: '\\omicron', type: 'GreekAlphabet' },
    { key: '2016', name: 'π', value: '\\pi', type: 'GreekAlphabet' },
    { key: '2017', name: 'ρ', value: '\\rho', type: 'GreekAlphabet' },
    { key: '2018', name: 'σ', value: ' \\sigma', type: 'GreekAlphabet' },
    { key: '2019', name: 'ς', value: ' \\sigmaf', type: 'GreekAlphabet' },
    { key: '2020', name: 'τ', value: '\\tau', type: 'GreekAlphabet' },
    { key: '2021', name: 'υ', value: '\\upsilon', type: 'GreekAlphabet' },
    { key: '2022', name: 'ϕ', value: '\\phi', type: 'GreekAlphabet' },
    { key: '2023', name: 'χ', value: '\\chi', type: 'GreekAlphabet' },
    { key: '2024', name: 'ψ', value: '\\psi', type: 'GreekAlphabet' },
    { key: '2025', name: 'ω', value: '\\omega', type: 'GreekAlphabet' },
    { key: '2025', name: 'Γ', value: '\\Gamma', type: 'GreekAlphabet' },
    { key: '2027', name: 'Δ', value: '\\Delta', type: 'GreekAlphabet' },
    { key: '2028', name: 'Θ', value: '\\Theta', type: 'GreekAlphabet' },
    { key: '2029', name: 'Λ', value: '\\Lambda', type: 'GreekAlphabet' },
    { key: '2030', name: 'Ξ', value: '\\Xi', type: 'GreekAlphabet' },
    { key: '2031', name: 'Π', value: '\\Pi', type: 'GreekAlphabet' },
    { key: '2032', name: 'Σ', value: '\\Sigma', type: 'GreekAlphabet' },
    { key: '2033', name: 'Φ', value: '\\Phi', type: 'GreekAlphabet' },
    { key: '2034', name: 'Ψ', value: '\\Psi', type: 'GreekAlphabet' },
    { key: '2035', name: 'Ω', value: '\\Omega', type: 'GreekAlphabet' },
    // ---几何符号---
    { key: '30', name: '◊', value: '\\Diamond', type: 'Geometric' },
    { key: '30', name: '□', value: '\\Box', type: 'Geometric' },
    { key: '30', name: '△', value: '\\triangle', type: 'Geometric' },
    { key: '30', name: '∠', value: '\\angle', type: 'Geometric' },
    { key: '30', name: '⊥', value: '\\perp', type: 'Geometric' },
    { key: '30', name: '∣', value: '\\mid', type: 'Geometric' },
    { key: '30', name: '∤', value: '\\nmid', type: 'Geometric' },
    { key: '30', name: '​∘', value: '^\\circ', type: 'Geometric' },
    { key: '30', name: '​◯', value: '\\bigcirc', type: 'Geometric' },
    { key: '30', name: '​//', value: '//', type: 'Geometric' },
    { key: '30', name: '​⊚', value: '\\circledcirc', type: 'Geometric' },
    { key: '30', name: '​⌣', value: '\\smile', type: 'Geometric' },
    { key: '30', name: '​⌢', value: '\\frown', type: 'Geometric' },
    { key: '30', name: '​◃', value: '\\triangleleft', type: 'Geometric' },
    { key: '30', name: '▹', value: '\\triangleright', type: 'Geometric' },
    { key: '30', name: '⊕', value: '\\oplus', type: 'Geometric' },
    { key: '30', name: '√', value: '\\surd', type: 'Geometric' },
    //  不能内嵌在公式里
    { key: '40', name: '▱', value: '▱', type: 'Geometric' },
    { key: '40', name: '⩍', value: '⩍', type: 'Geometric' },
    { key: '40', name: '/∘/', value: '/∘/', type: 'Geometric' },





  ];


  public gsShowConfig = [
  ];




  @Input() public markdown: string;
  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();

  // StackEditor
  public ngOnInit() {

    console.log('+++++++++++++');
    this.markdown = ''
    this.editormdPreview();


    // this.myEditor = editormd.markdownToHTML('test-markdown-view', {
    //   // markdown: data,
    //   // htmlDecode : true,
    //   // width: '100%',
    //   // height: 640,
    //   // syncScrolling: 'single',
    //   // path: '../../assets/editor.md-master/lib/',
    //   // imageUpload: true,
    //   // imageFormats: ['jpg', 'jpeg', 'gif', 'png', 'bmp'],
    //   // imageUploadURL: 'api/upload/mdupload?test=dfdf',
    //   // emoji: true,
    //   // taskList: true,
    //   // tex: true,  // 默认不解析
    //   // flowChart: true,  // 默认不解析
    //   // sequenceDiagram: true,  // 默认不解析SS
    //   // saveHTMLToTextarea: true // 保存
    //   markdown : '[TOC]\n### Hello world!\n## Heading 2', // Also, you can dynamic set Markdown text
    //   htmlDecode : true,  // Enable / disable HTML tag encode.
    //  // htmlDecode : "style,script,iframe",  // Note: If enabled, you should filter some dangerous HTML tags for website security.
    // });
    console.log(this.myEditor);
    // 一个小bug 全窗口预览关闭按钮初始化没有隐藏（原因未知），手动隐藏
    //  $('.editormd-preview-close-btn').hide();
  }

  /**
   * editormdPreview 预览
   */
  public editormdPreview() {
    // this.markdown = '### Examples';
    //  const data = this.markdown;

    const node1 = document.getElementById('test-markdown-view');
    node1.innerHTML = '<textarea style="display:none;">' + this.markdown + '</textarea>';

    this.myEditor = editormd.markdownToHTML('test-markdown-view', {
      //   markdown: this.markdown,
      width: '100%',
      height: 640,
      htmlDecode: 'style,script,iframe',  // you can filter tags decode
      emoji: true,
      taskList: true,
      tex: true,  // 默认不解析
      flowChart: true,  // 默认不解析
      sequenceDiagram: true,  // 默认不解析
    });

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

    const node22 = document.getElementsByClassName('markdown-body editormd-html-preview')[0];
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
    console.log('生成的图片如下：', img);
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
  public FH(e, vstr?, v?) {

    console.log('符号', v);

    if (this.FocusIput) {
      // this.gsShowConfig.forEach
      this.gsShowConfig.forEach(input => {
        if (input['key'] === this.FocusIput['key']) {
          input['value'] = v;
          input['valueString'] = vstr;
        }
        if (input['content']) {
          input['content'].forEach(cinput => {
            if (cinput['key'] === this.FocusIput['key']) {
              cinput['value'] = v;
              cinput['valueString'] = vstr;
            }
          });
        }

      });

      this.inputValueChange(v, this.FocusIput['key']);
    }
    console.log('按钮录入特殊字符后', this.FocusIput, this.gsShowConfig)
  }

  //  $${b}^{3}_{3}$$  上下标的生成


  /**
   * createForm 创建录入公式表单
   */
  public createForm(type?, sapn?) {
    if (!sapn) {
      sapn = 4;
    }
    const input1 = CommonTools.uuID(20);
    const input11 = CommonTools.uuID(20);
    const input12 = CommonTools.uuID(20);
    // 特殊字符
    const f_char = { key: input1, type: 'char', sapn: sapn, value: null, valueString: '', selected: false };
    // 文本
    const f_text = { key: input1, type: 'text', sapn: sapn, value: null, valueString: '', selected: false };
    // 运算符号
    const f_symbol = { key: input1, type: 'symbol', sapn: sapn, value: null, valueString: '', selected: false };
    // 上标
    const f_sup = { key: input1, type: 'sup', sapn: sapn, value: null, valueString: '', selected: false };
    // 下标
    const f_sub = { key: input1, type: 'sub', sapn: sapn, value: null, valueString: '', selected: false };
    // 上下标
    const f_supb = {
      key: input1, type: 'supb', sapn: sapn, selected: false, content: [
        { key: input11, type: 'sup', sapn: '24', value: null, valueString: '' },
        { key: input12, type: 'sub', sapn: '24', value: null, valueString: '' }
      ]
    };
    let back;
    if (type === 'char') {
      back = f_char;
    }
    if (type === 'text') {
      back = f_text;
    }
    if (type === 'symbol') {
      back = f_symbol;
    }
    if (type === 'sup') {
      back = f_sup;
    }
    if (type === 'sub') {
      back = f_sub;
    }
    if (type === 'supb') {
      back = f_supb;
    }
    return back;

  }

  /**
   * CheckTemplate  根据模板创建公式
   */
  public CheckTemplate(temp?) {
    // ('char')">特殊字符
    // ('text')">文本
    // ('symbol')">运算符号
    // ('sup')">上标
    // ('sub')">下标
    // ('supb')">上下标
    // ('unit ')">计量单位

    let span = 4;
    if (temp === 'char') {
      span = 2;
    }
    if (temp === 'symbol') {
      span = 2;
    }

    const newTemplate = this.createForm(temp, span);
    if (newTemplate) {
      if (this.selectedCol) {

        const index = this.gsShowConfig.findIndex(item => item['key'] === this.selectedCol['key']);
        this.gsShowConfig.forEach(input => {
          input['selected'] = false;
        });
        newTemplate['selected'] = true;
        this.selectedCol = newTemplate;
        this.gsShowConfig.splice((index + 1), 0, newTemplate);

      } else {
        newTemplate['selected'] = true;
        this.selectedCol = newTemplate;
        this.gsShowConfig.push(newTemplate);
      }
      // this.gsShowConfig.push(newTemplate);
    }

    // 插入到指定位置
    console.log('新的公式输入框', this.gsShowConfig);

  }

  /**
   * inputFocus 文本获取焦点
   */
  public inputFocus(key?, type?) {

    console.log('文本获取焦点', key);
    this.FocusIput = { key: key, type: type };
  }

  /**
   * inputValueChange  公式文本值变化
   */
  public inputValueChange(v?, key?, types?) {
    //  $${b}^{3}_{3}$$  上下标的生成
    console.log('inputValueChange', v)
    let backstr = '$$';
    this.gsShowConfig.forEach(input => {
      if (input['key'] === key) {
        input['value'] = v;
      }
      const type = input['type'];
      let varstr = input['valueString'];
      let value = input['value'];
      if (varstr === undefined) {
        varstr = '';
      }
      if (value === undefined) {
        value = '';
      }

      if (type === 'char') {
        if (varstr)
          backstr = backstr + '{' + varstr + '}';
      }
      if (type === 'text') {
        if (value)
          backstr = backstr + '{' + value + '}';
      }
      if (type === 'symbol') {
        if (varstr)
          backstr = backstr + '{' + varstr + '}';
      }
      if (type === 'sup') {
        if (value)
          backstr = backstr + '^{' + value + '}';
      }
      if (type === 'sub') {
        if (value)
          backstr = backstr + '_{' + value + '}';
      }

      if (input['content']) {
        input['content'].forEach(cinput => {
          const ctype = cinput['type'];
          if (cinput['key'] === key) {
            cinput['value'] = v;
          }
          let ccvalue = cinput['value'];
          if (ccvalue === undefined) {
            ccvalue = '';
          }
          if (ctype === 'sup') {
            if (ccvalue)
              backstr = backstr + '^{' + ccvalue + '}';
          }
          if (ctype === 'sub') {
            if (ccvalue)
              backstr = backstr + '_{' + ccvalue + '}';
          }
        });
      }

    });

    backstr = backstr + '$$';
    console.log('生成公式字符串：', backstr);
    this.markdown = backstr;
    this.editormdPreview();
  }

  /**
   * EmptyGS 清空公式
   */
  public EmptyGS() {
    this.gsShowConfig = [];
    this.FocusIput = null;
    this.markdown = '';
    this.selectedCol = null;
    this.editormdPreview();

  }

  /**
   * selectCol  公式模板选中状态
   */
  public selectCol(c) {
    this.gsShowConfig.forEach(input => {
      if (input['key'] === c.key) {
        input['selected'] = true;
        this.selectedCol = input;
      } else {
        input['selected'] = false;
      }
    });

  }

  /**
   * delcol 删除公式
   */
  public delcol() {
    if (this.selectedCol) {
      const index = this.gsShowConfig.findIndex(item => item['key'] === this.selectedCol['key']);
      if (index !== -1) {
        const rowValue = this.gsShowConfig[index];
        this.gsShowConfig.splice(this.gsShowConfig.indexOf(rowValue), 1);
        this.selectedCol = null;
        this.inputValueChange();
      }
    }

  }


  /**
   * keyEventFun  监听div内鼠标事件
   */
  public keyEventFun(e?) {

    const nodetablecontent = document.getElementById('tablecontent');
    const ht = nodetablecontent.innerHTML;
    if (e.code === 'Backspace') {
      const selection = window.getSelection();

      if (selection) {
        const selectedText = selection.toString();
        const rangeObj = selection.getRangeAt(0);
        const docFragment = rangeObj.cloneContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(docFragment);
        const imgs = tempDiv.getElementsByTagName('img');
        if (imgs) {
          console.log('判断当前节点是否存在img ', imgs, tempDiv);
        }
        const 　selectedHtml = tempDiv.innerHTML;
        console.log('　selectedText', selectedText);
        console.log('　rangeObj:', rangeObj);
        console.log('选中的html selectedHtml:', selectedHtml)
      }
      console.log('监听div内鼠标事件->删除事件', e);
      console.log('富文本内容', ht);
      console.log('鼠标选中内容:', selection);
      // return false;
    }

  }

}

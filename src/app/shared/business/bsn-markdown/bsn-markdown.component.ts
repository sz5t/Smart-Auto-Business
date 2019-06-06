import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';
@Component({
  selector: 'bsn-markdown',
  templateUrl: './bsn-markdown.component.html',
  styleUrls: ['./bsn-markdown.component.css']
})
export class BsnMarkdownComponent implements OnInit, OnChanges {

  public myEditor: any;
  public editorText: any;
  public obj: any;
  // 光标在的文本框
  public FocusIput;
  // 选中的col
  public selectedCol;
  public isVisible = false;
  // 修改的公式信息
  public editImageObj;
  public rangeFocus;
  //
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

  // 公式数据集
  public GsDataList = [];
  // 公式展示数据集
  public GsFormDataList = [];


  constructor() { }
  ;

  @Input() public value;
  @ViewChild('markdownview') public markdownview: ElementRef<any>;
  //
  @Input() public markdown: string;
  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();
  public Geometric;
  public MathematicalSymbols;
  public GreekAlphabet;
  // StackEditor
  public ngOnInit() {
    this.Geometric = this.ZFconfig.filter(d => d.type === 'Geometric');
    this.MathematicalSymbols = this.ZFconfig.filter(d => d.type === 'MathematicalSymbols');
    this.GreekAlphabet = this.ZFconfig.filter(d => d.type === 'GreekAlphabet');
  }
  public ngAfterViewInit(): void {
    this.markdown = ''
    //  this.editormdPreview();
    const nodetablecontent = document.getElementById('tablecontent');
    if (this.value) {
      nodetablecontent.innerHTML = this.value;
      this.ImageChange();
    }
  }

  public ngOnChanges() {
    const nodetablecontent = document.getElementById('tablecontent');
    if (this.value) {
      // console.log('ngOnChanges');
      nodetablecontent.innerHTML = this.value;
      this.ImageChange();
    }
  }

  public getData() {
    this.onChange.emit(this.myEditor.getMarkdown());
  }

  public imgClick(d?, img?) {
    console.log('点击图片', img);
    this.editImageObj = img;
    this.showModal('update');
    d.editImage(img);

  };
  /**
   * editImage 编辑图片
   */
  public editImage(img?) {
    console.log('editImage', img);
    const gsformJson = JSON.parse(img.getAttribute('gsform'));
    const gsId = img.getAttribute('gsId');
    const src = img.getAttribute('src');
    this.gsShowConfig = gsformJson;
    //   this.inputValueChange();
  }

  // 给图片重新绑定事件
  public ImageChange() {
    const nodetablecontent = document.getElementById('tablecontent');
    const imgs_cc = nodetablecontent.getElementsByTagName('img');
    const d = this;
    for (let i = 0; i < imgs_cc.length; i++) {
      imgs_cc[i].removeEventListener('click', () => this.imgClick(d, imgs_cc[i]), true);
      imgs_cc[i].addEventListener('click', () => this.imgClick(d, imgs_cc[i]), true);
    }
    console.log('ImageChange', imgs_cc);
  }






  /**
   * keyEventFun  监听div内鼠标事件
   */
  public keyEventFun(e?) {

    const nodetablecontent = document.getElementById('tablecontent');
    const ht = nodetablecontent.innerHTML;
    if (e.code === 'Backspace') {

      console.log('监听div内鼠标事件->删除事件', e);

      console.log('富文本内容', ht);
      this.getTextarea();
      // 0603
      // this.ImageChange(); // 重新绑定onclik 事件

      // ht.replace(/<(?!img).*?>/g, '');
      // 如果保留img,p标签，则为：
      // description.replace(/<(?!img|p|/p).*?>/g, "");
      // 将img 替换为其他字符
      // const imgReg = /<img.*?(?:>|\/>)/gi;
      // const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      // const result = ht.match(imgReg);  // arr 为包含所有img标签的数组
      // for (let i = 0; i < result.length; i++) {
      //   const src = result[i].match(srcReg);
      //   // 获取图片地址
      //   console.log('图片地址' + (i + 1) + '：' + src[1]);
      // }


    }

  }

  /**
   * getTextarea 获取富文本json
   */
  public getTextarea() {
    this.GsDataList = [];
    const nodetablecontent = document.getElementById('tablecontent');
    const imgs_cc = nodetablecontent.getElementsByTagName('img');
    for (let i = 0; i < imgs_cc.length; i++) {
      const gsformJson = JSON.parse(imgs_cc[i].getAttribute('gsform'));
      const gsId = imgs_cc[i].getAttribute('gsId');
      const src = imgs_cc[i].getAttribute('src');
      this.GsDataList.push({ key: gsId, src: src, gsform: gsformJson });
    }
   const back = {value: nodetablecontent.innerHTML, dataItem: {markdownlist: this.GsDataList}} ;
   console.log(' 富文本信息', back);
    this.onChange.emit( back );
  }


  public showModal(type?): void {
    this.isVisible = true;
    if (type === 'update') {

    } else {
      this.editImageObj = null;
      this.gsShowConfig = [];
      this.markdown = '';
    }

  }

  public modelOpen() {
    this.inputValueChange();
  }

  public handleOk(): void {
   // console.log('handleOk!');
    this.createImage(this.editImageObj);
    this.isVisible = false;

  }

  public handleCancel(): void {
    this.editImageObj = null;
    // console.log('handleCancel!');
    this.isVisible = false;
  }

  public modelClose(): void {

    // console.log('弹出关闭!');
    this.getTextarea();
  }




  // ==============弹出操作=================

  /**
* editormdPreview 预览
*/
  public editormdPreview() {
    // this.markdown = '### Examples';
    //  const data = this.markdown;
    // const node1 = this.markdownview.nativeElement;
    let node1 = document.getElementById('test-markdown-view');

    if (node1) {
      node1.innerHTML = '<textarea style="display:none;">' + this.markdown + '</textarea>';
      // console.log('editormdPreview 预览结果', node1);
    } else {
      node1 = this.markdownview.nativeElement;
      node1.innerHTML = '<textarea style="display:none;">' + this.markdown + '</textarea>';
      // console.log('editormdPreview  nativeElement预览结果', node1);
    }
    // console.log('开始公式渲染', this.markdown);

    this.myEditor = editormd.markdownToHTML('test-markdown-view', {
      // markdown: this.markdown,
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


  /**
     * getImg
     */
  public createImage(oldimg?) {

    const node22 = document.getElementsByClassName('markdown-body editormd-html-preview')[0];
    let node = node22.getElementsByClassName('katex-html')[0];
    // const node = document.getElementsByClassName("editormd-preview")[0];
    if (node) { } else { node = node22 }
    // console.log('找到节点', node);
    // console.log('当前光标位置',   this.rangeFocus );
    const createImg_rangeFocus = this.rangeFocus;
    const createImg = {};
    let img;
    if (oldimg) {
      img = oldimg;
    } else {
      img = new Image()
    }
    html2canvas(node, {  // 指定区域
      allowTaint: true,
      taintTest: false,
      onrendered: function (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        img.src = dataUrl;
        const gsId = CommonTools.uuID(20);
        createImg['src'] = dataUrl;
        createImg['gsId'] = gsId;
        const nodetablecontent = document.getElementById('tablecontent');
        const that = this;
        img.setAttribute('gsId', gsId);
        if (!oldimg) {
          if (createImg_rangeFocus) {
           // console.log('createImg_rangeFocus', createImg_rangeFocus);
            createImg_rangeFocus.insertNode(img);
          } else {
          //  console.log('nodetablecontent', nodetablecontent);
            nodetablecontent.appendChild(img);
          }

        }
        //  nodetablecontent.focus();

      }
    });

    // html2canvas(node).then(function (canvas) {
    //   console.log('canvas:', canvas);
    //   const dataUrl = canvas.toDataURL('image/png');
    //      img.src = dataUrl;
    //      const gsId = CommonTools.uuID(20);
    //     createImg['src'] = dataUrl;
    //     createImg['gsId'] = gsId;
    //     const nodetablecontent = document.getElementById('tablecontent');
    //     const that = this;
    //     img.setAttribute('gsId', gsId);
    //     nodetablecontent.appendChild(img);

    // });
    const d = this;
    const gsForm = JSON.stringify(this.gsShowConfig);
    createImg['gsform'] = this.gsShowConfig;
    img.setAttribute('gsform', gsForm);
    if (!oldimg) {
      img.addEventListener('click', () => this.imgClick(d, img));
    }
    // img.addEventListener('click', () => this.imgClick(d, img), true);
    // console.log('生成的图片如下：', createImg, createImg['src']);
    this.rangeFocus = undefined;

  }





  /**
   * FH  点击符号
   */
  public FH(e, vstr?, v?, type?) {

  //  console.log('符号', v);
    if (type === 'Geometric') {
      type = 'char';
    }
    if (type === 'MathematicalSymbols') {
      type = 'symbol';
    }
    if (type === 'GreekAlphabet') {
      type = 'char';
    }
    let isInput = false;
    if (this.FocusIput) {
      // this.gsShowConfig.forEach
      this.gsShowConfig.forEach(input => {
        if (input['key'] === this.FocusIput['key']) {
          if (input['type'] === type) {
            input['value'] = v;
            input['valueString'] = vstr;
            isInput = true;
          }
        }
        if (input['content']) {
          input['content'].forEach(cinput => {
            if (cinput['key'] === this.FocusIput['key']) {
              cinput['value'] = v;
              cinput['valueString'] = vstr;
              isInput = true;
            }
          });
        }

      });
      if (isInput) {
        this.inputValueChange(v, this.FocusIput['key']);
      }

    }
  //  console.log('按钮录入特殊字符后', this.FocusIput, this.gsShowConfig)
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
    // console.log('新的公式输入框', this.gsShowConfig);

  }

  /**
   * inputFocus 文本获取焦点
   */
  public inputFocus(key?, type?) {

    // console.log('文本获取焦点', key);
    this.FocusIput = { key: key, type: type };
  }

  /**
   * inputValueChange  公式文本值变化
   */
  public inputValueChange(v?, key?, types?) {
    //  $${b}^{3}_{3}$$  上下标的生成
    // console.log('inputValueChange', v)
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
    // console.log('生成公式字符串：', backstr);
    if (!backstr) {
      backstr = '$$$$'
    }
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
 * 光标移除事件
 */
  public contenteditableblur() {
   //  console.log('contenteditableblur');
    let range; // 记录光标位置对象
    const node = window.getSelection().anchorNode;
    // 这里判断是做是否有光标判断，因为弹出框默认是没有的
   // console.log('insertImage', node);
    if (node != null) {
      range = window.getSelection().getRangeAt(0); // 获取光标起始位置
      // range = el.getSelection().getRangeAt(0);// 获取光标起始位置
    } else {
      range = undefined;
    }
    this.rangeFocus = range;
    this.getTextarea();
  }

}

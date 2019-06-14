import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CommonTools } from '@core/utility/common-tools';
import { FormResolverComponent } from '@shared/resolver/form-resolver/form-resolver.component';
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
  // 弹出model的标识信息
  public isVisible = false;
  public handleState = false;
  // 修改的公式信息
  public editImageObj;
  public rangeFocus;
  public rangeFocusPosition;


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
    { key: '1005', name: '=', value: '=', type: 'MathematicalSymbols' },
    { key: '1006', name: '≠', value: '\\ne', type: 'MathematicalSymbols' },
    { key: '1007', name: '≈', value: '\\approx', type: 'MathematicalSymbols' },
    { key: '1008', name: '∼', value: '\\sim', type: 'MathematicalSymbols' },
    { key: '1009', name: '⊆', value: '\\subseteq', type: 'MathematicalSymbols' },
    { key: '1010', name: '∈', value: '\\in', type: 'MathematicalSymbols' },
    { key: '1011', name: '∉', value: '\\notin', type: 'MathematicalSymbols' },
    { key: '1012', name: '+', value: '+', type: 'MathematicalSymbols' },
    { key: '1013', name: '-', value: '-', type: 'MathematicalSymbols' },
    { key: '1014', name: '×', value: '\\times', type: 'MathematicalSymbols' },
    { key: '1015', name: '÷', value: '\\div', type: 'MathematicalSymbols' },
    { key: '1016', name: '±', value: '\\pm', type: 'MathematicalSymbols' },
    { key: '1017', name: '∓', value: '\\mp', type: 'MathematicalSymbols' },
    { key: '1018', name: '⇒', value: '\\Rightarrow', type: 'MathematicalSymbols' },
    { key: '1019', name: '→', value: '\\rightarrow', type: 'MathematicalSymbols' },
    { key: '1020', name: '∞', value: '\\infty', type: 'MathematicalSymbols' },
    { key: '1021', name: '∂', value: '\\partial', type: 'MathematicalSymbols' },
    { key: '1022', name: '∠', value: '\\angle', type: 'MathematicalSymbols' },
    { key: '1023', name: '△', value: '\\triangle', type: 'MathematicalSymbols' },
    { key: '1024', name: '(', value: '(', type: 'MathematicalSymbols' },
    { key: '1025', name: ')', value: ')', type: 'MathematicalSymbols' },

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
    { key: '40', name: '▱', value: '▱', type: 'Geometric1' },
    { key: '40', name: '⩍', value: '⩍', type: 'Geometric1' },
    { key: '40', name: '/∘/', value: '/∘/', type: 'Geometric1' }





  ];

  public gsShowConfig = [
  ];

  // 公式数据集
  public GsDataList = [];
  // 公式展示数据集
  public GsFormDataList = [];

  // 公式编辑器上的表单
  public form_value = {};
  @Input() public formConfig;
  public formConfig1 = {
    'keyId': 'Id',
    'name': 'addCraftform',
    'layout': 'horizontal',
    'title': '新增数据',
    'width': '500',
    'isCard': true,
    'type': 'add',
    'editable': 'post',
    'forms': [
      {
        'controls': [
          {
            'type': 'select',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'submit',
            'name': 'scopeflag',
            'textName': 'xscopeflag',
            'label': '使用范围',
            'notFoundContent': '',
            'isRequired': true,
            'selectModel': false,
            'showSearch': true,
            'placeholder': '--请选择--',
            'disabled': false,
            'size': 'default',
            'defaultValue': 1,
            'options': [
              {
                'label': '全局通用',
                'value': 1
              },
              {
                'label': '专用',
                'value': 2
              }
            ],
            'layout': 'column',
            'span': '12'
          },
          {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'text',
            'name': 'propellantno',
            'label': '原材料序号',
            'hidden': false,
            'placeholder': '',
            'disabled': false,
            'readonly': false,
            'size': 'default',
            'layout': 'column',
            'span': '12'
          }
        ]
      },
      {
        'controls': [
          {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'text',
            'name': 'propellantname',
            'label': '原材料名称',
            'hidden': false,
            'placeholder': '',
            'disabled': false,
            'readonly': false,
            'size': 'default',
            'layout': 'column',
            'span': '12',
            'isRequired': true,
            'validations': [
              {
                'validator': 'required',
                'errorMessage': '请输入原材料名称!'
              }
            ]
          },
          {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'text',
            'name': 'propellantcode',
            'label': '原材料代号',
            'hidden': false,
            'placeholder': '',
            'disabled': false,
            'readonly': false,
            'size': 'default',
            'layout': 'column',
            'span': '12',
            'isRequired': true,
            'validations': [
              {
                'validator': 'required',
                'errorMessage': '请输入原材料代号!'
              }
            ]
          }
        ]
      },
      {
        'controls': [
          {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'text',
            'name': 'Scopestatement',
            'label': '使用范围说明',
            'isRequired': true,
            'placeholder': '',
            'hidden': true,
            'disabled': false,
            'readonly': false,
            'size': 'default',
            'layout': 'column',
            'span': '12'
          }
        ]
      },
      {
        'controls': [
          {
            'type': 'input',
            'labelSize': '6',
            'controlSize': '16',
            'inputType': 'text',
            'name': 'parentId',
            'label': '父节点ID',
            'isRequired': true,
            'placeholder': '',
            'hidden': true,
            'disabled': false,
            'readonly': false,
            'size': 'default',
            'layout': 'column',
            'span': '12'
          }
        ]
      }
    ]
  }
  constructor() { }
  ;

  @Input() public value = '';
  @ViewChild('markdownview') public markdownview: ElementRef<any>;
  //
  @Input() public markdown: string;
  /**
   * 将子组件获取的内容传输到父组件
   */
  @Output() public onChange = new EventEmitter<any>();

  @ViewChild('contentForm') public contentForm: FormResolverComponent;
  @ViewChild('tablecontentview') public tablecontentview: ElementRef<any>;
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
    const nodetablecontent = this.tablecontentview.nativeElement;
    if (this.value) {
      nodetablecontent.innerHTML = this.value;
      this.ImageChange();
    }
    // console.log('ngAfterViewInit');
  }

  public ngOnChanges() {
    // const nodetablecontent = this.tablecontentview.nativeElement;
    // if (this.value) {
    //   // console.log('ngOnChanges');
    //   nodetablecontent.innerHTML = this.value;
    //   this.ImageChange();
    // }
  }

  public myChanges() {
    const nodetablecontent = this.tablecontentview.nativeElement;
    if (this.value) {
      // console.log('ngOnChanges');
      nodetablecontent.innerHTML = this.value;
      this.ImageChange();
      this.getTextarea();
    }
    // console.log('myChanges');
  }

  public getData() {
    this.onChange.emit(this.myEditor.getMarkdown());
  }

  public imgClick(d?, img?) {
    // console.log('点击图片', img);
    this.editImageObj = img;
    this.showModal('update');
    d.editImage(img);

  };
  /**
   * editImage 编辑图片
   */
  public editImage(img?) {
    // console.log('editImage', img);
    const gsformJson = JSON.parse(img.getAttribute('gsform'));
    const gsId = img.getAttribute('gsId');
    const src = img.getAttribute('src');
    const constcontentformJson = JSON.parse(img.getAttribute('contentform'));
    this.gsShowConfig = gsformJson;
    //  console.log('editImage->图片信息', constcontentformJson);
    this.form_value = constcontentformJson;
    //   this.inputValueChange();
  }

  // 给图片重新绑定事件
  public ImageChange() {
    const nodetablecontent = this.tablecontentview.nativeElement;
    const imgs_cc = nodetablecontent.getElementsByTagName('img');
    const d = this;
    for (let i = 0; i < imgs_cc.length; i++) {
      // imgs_cc[i].removeEventListener('click', () => this.imgClick(d, imgs_cc[i]), true);
      // imgs_cc[i].addEventListener('click', () => this.imgClick(d, imgs_cc[i]), true);
      this.loginEvent(imgs_cc[i], 'click', () => this.imgClick(d, imgs_cc[i]), false, true);
    }
    // console.log('ImageChange', imgs_cc);
  }

  /*
     * 事件注册
     * @param Element     ele
     * @param String      eventType
     * @param Function    fn
     * @param Boolean     isRepeat
     * @param Boolean     isCaptureCatch
     * @return undefined
  */
  public loginEvent(ele, eventType, fn, isRepeat, isCaptureCatch) {
    if (ele === undefined || eventType === undefined || fn === undefined) {
      throw new Error('传入的参数错误！');
    }

    if (typeof ele !== 'object') {
      throw new TypeError('不是对象！');
    }

    if (typeof eventType !== 'string') {
      throw new TypeError('事件类型错误！');
    }

    if (typeof fn !== 'function') {
      throw new TypeError('fn 不是函数！');
    }

    if (isCaptureCatch === undefined || typeof isCaptureCatch !== 'boolean') {
      isCaptureCatch = false;
    }

    if (isRepeat === undefined || typeof isRepeat !== 'boolean') {
      isRepeat = true;
    }

    if (ele.eventList === undefined) {
      ele.eventList = {};
    }

    if (isRepeat === false) {
      for (const key in ele.eventList) {
        if (key === eventType) {
          return '该事件已经绑定过！';
        }
      }
    }

    // 添加事件监听
    if (ele.addEventListener) {
      ele.addEventListener(eventType, fn, isCaptureCatch);
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + eventType, fn);
    } else {
      return false;
    }

    ele.eventList[eventType] = true;
  }




  /**
   * keyEventFun  监听div内鼠标事件
   */
  public keyEventFun(e?) {

    const nodetablecontent = this.tablecontentview.nativeElement;
    const ht = nodetablecontent.innerHTML;
    if (e.code === 'Backspace') {

      //  console.log('监听div内鼠标事件->删除事件', e);

      //   console.log('富文本内容', ht);
      //  this.getTextarea();
      // 0603
      this.ImageChange(); // 重新绑定onclik 事件

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
   * keyEventPaste  粘贴
   */
  public keyEventPaste(e?) {

    // console.log('===.>>>>>监听粘贴');
    this.ImageChange(); // 重新绑定onclik 事件
  }

  /**
   * keyEventInput
   */
  public keyEventInput(e?) {
    // console.log('===.>>>>>监听内容变化');
  }

  /**
   * getTextarea 获取富文本json
   */
  public getTextarea() {
    this.GsDataList = [];
    const nodetablecontent = this.tablecontentview.nativeElement;
    const imgs_cc = nodetablecontent.getElementsByTagName('img');
    for (let i = 0; i < imgs_cc.length; i++) {
      const gsformJson = JSON.parse(imgs_cc[i].getAttribute('gsform'));
      const constcontentformJson = JSON.parse(imgs_cc[i].getAttribute('contentform'));
      const gsId = imgs_cc[i].getAttribute('gsId');
      const src = imgs_cc[i].getAttribute('src');
      // 当前默认状态 都是新增，每次操作都清除再插入
      this.GsDataList.push({ $operDataType$: 'add', key: gsId, src: src, gsform: gsformJson, ...constcontentformJson });
    }
    const back = { value: nodetablecontent.innerHTML, dataItem: { markdownlist: this.GsDataList } };
    // console.log(' 富文本信息', back);
    this.onChange.emit(back);
  }


  public showModal(type?): void {
    this.isVisible = true;

    if (type === 'update') {

    } else {
      this.editImageObj = null;
      this.gsShowConfig = [];
      const newTemplate = this.createForm('projectName', 0);
      this.gsShowConfig.push(newTemplate);
      const newTemplateunit = this.createForm('unit', 0);
      newTemplateunit['selected'] = true;
      this.selectedCol = newTemplateunit;
      this.gsShowConfig.push(newTemplateunit);
      //  console.log('gsShowConfig=>>', this.gsShowConfig);
      this.markdown = '';
      this.form_value = {};
    }
    // console.log('showModal->公式编辑表单的值', this.form_value);

  }

  public modelOpen() {
    this.inputValueChange();
    // console.log('nzAfterOpen->公式编辑表单的值', this.form_value);
    if (this.formConfig) {
      //  resetForm
      console.log('弹出表单的信息', this.form_value);
      this.contentForm.resetForm();
      this.contentForm.setFormValue(this.form_value);
    }

  }

  public handleOk(): void {
    // console.log('handleOk!');
    if (this.formConfig) {
      const contentFormValidation = this.contentForm.checkFormValidation();
      // console.log('表单是否校验通过', contentFormValidation);
      if (contentFormValidation) {
        const contentFormValue = this.contentForm.GetComponentValue();
        // console.log('表单值是', contentFormValue);
        this.createImage(this.editImageObj, contentFormValue);
        this.isVisible = false;
        this.handleState = true;
      }
    } else {
      this.createImage(this.editImageObj, {});
      this.isVisible = false;
      this.handleState = true;
    }



  }

  public handleCancel(): void {
    this.editImageObj = null;
    // console.log('handleCancel!');
    this.isVisible = false;
  }

  public modelClose(): void {
    if (this.handleState) {
      // console.log('弹出关闭!');


      this.getTextarea();
    }
    this.handleState = false;
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
      htmlDecode: true,
      delay: 400,
      // htmlDecode: 'style,script,iframe',  // you can filter tags decode
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
  public createImage(oldimg?, formValue?) {

    const node22 = document.getElementsByClassName('markdown-body editormd-html-preview')[0];
    let node = node22.getElementsByClassName('katex-html')[0];
    if (node22.getElementsByClassName('katex-html').length >= 1) {
      node = node22.children[0];
      node.setAttribute('style', 'display:inline-block; line-height:1.2; font: 1.21em');
    }
    // const node = document.getElementsByClassName("editormd-preview")[0];
    if (node) { } else { node = node22 }
    // console.log('找到节点', node, node22);
    // console.log('createImage-->=>当前光标位置', this.rangeFocus, oldimg);
    const createImg_rangeFocus = this.rangeFocus;
    // if (createImg_rangeFocus) {
    //   if (this.rangeFocusPosition) {
    //     createImg_rangeFocus.startOffset = this.rangeFocusPosition.startOffset;
    //     createImg_rangeFocus.endOffset = this.rangeFocusPosition.endOffset;
    //   }
    // }

    const createImg = {};
    let img;
    if (oldimg) {
      img = oldimg;
    } else {
      img = new Image()
    }
    const that = this;
    html2canvas(node, {  // 指定区域
      allowTaint: true,
      taintTest: false,
      onrendered: function (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        img.src = dataUrl;
        const gsId = CommonTools.uuID(20);
        createImg['src'] = dataUrl;
        createImg['gsId'] = gsId;
        const nodetablecontent = that.tablecontentview.nativeElement;

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
    const contentForm = JSON.stringify(formValue);
    createImg['contentform'] = contentForm;
    img.setAttribute('gsform', gsForm);
    img.setAttribute('contentform', contentForm);
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
        if (input['fkey'] === this.FocusIput['fkey']) {
          if (input['type'] === type) {
            input['value'] = v;
            input['valueString'] = vstr;
            isInput = true;
          }
        }
        if (input['content']) {
          input['content'].forEach(cinput => {
            if (cinput['fkey'] === this.FocusIput['fkey']) {
              cinput['value'] = v;
              cinput['valueString'] = vstr;
              isInput = true;
            }
          });
        }

      });
      if (isInput) {
        this.inputValueChange(v, this.FocusIput['fkey']);
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
    const input1 = CommonTools.uuID(36);
    const input11 = CommonTools.uuID(36);
    const input12 = CommonTools.uuID(36);
    // 项目名称
    const f_projectName = { fkey: input1, type: 'projectName', sapn: 0, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 特殊字符
    const f_char = { fkey: input1, type: 'char', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 设计值
    const f_design = { fkey: input1, type: 'design', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 文本描述
    const f_text = { fkey: input1, type: 'text', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 运算符号
    const f_symbol = { fkey: input1, type: 'symbol', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 上标
    const f_sup = { fkey: input1, type: 'sup', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 下标
    const f_sub = { fkey: input1, type: 'sub', sapn: sapn, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    // 上下标
    const f_supb = {
      fkey: input1, type: 'supb', sapn: sapn, selected: false, $operDataType$: 'add', fparentId: '',
      content: [
        { fkey: input11, type: 'sup', sapn: '24', value: null, valueString: '', $operDataType$: 'add', fparentId: input1 },
        { fkey: input12, type: 'sub', sapn: '24', value: null, valueString: '', $operDataType$: 'add', fparentId: input1 }
      ]
    };
    const f_unit = { fkey: input1, type: 'unit', sapn: 0, value: null, valueString: '', selected: false, $operDataType$: 'add', fparentId: '' };
    let back;

    if (type === 'projectName') {
      back = f_projectName;
    }
    if (type === 'char') {
      back = f_char;
    }
    if (type === 'design') {
      back = f_design;
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
    if (type === 'unit') {
      back = f_unit;
    }


    // console.log('1111--->>>', back, type, sapn);
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

        const index = this.gsShowConfig.findIndex(item => item['fkey'] === this.selectedCol['fkey']);
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
  public inputFocus(fkey?, type?) {

    // console.log('文本获取焦点', fkey);
    this.FocusIput = { fkey: fkey, type: type };
  }

  /**
   * inputValueChange  公式文本值变化
   */
  public inputValueChange(v?, fkey?, types?) {
    //  $${b}^{3}_{3}$$  上下标的生成
    // console.log('inputValueChange', v)
    let backstr = '  $$';

    let projectName;
    let unit;
    this.gsShowConfig.forEach(input => {
      if (input['type'] === 'projectName') {
        projectName = input['value'];
      }
      if (input['type'] === 'unit') {
        unit = input['value'];
      }
    });
    if (projectName) {
      backstr = '** **' + projectName + '  $$';
    }
    this.gsShowConfig.forEach(input => {
      if (input['fkey'] === fkey) {
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
      if (type === 'design') {
        if (value)
          backstr = backstr + '{' + value + '}';
      }
      if (type === 'text') {
        if (value)
          backstr = backstr + ' $$' + value + '$$ ';
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
          if (cinput['fkey'] === fkey) {
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
    if (unit) {
      backstr = backstr + ' ' + unit;
    }

   //  console.log('生成公式字符串：', backstr);
    if (!backstr) {
      backstr = '$$$$'
    }
    this.markdown = backstr;
    this.editormdPreview();
  }

  /**
   * returnItemValue
   */
  public returnItemValue(name?) {
   //  console.log('表单值返回', name);
    this.gsShowConfig.forEach(input => {
      if (input['type'] === name.name) {
        if (name.data === null) {
          name.data = '';
        }
        // if (input['type'] === 'projectName') {
        const value = '<font color="blue">' + name.data + '</font>';
        input['value'] = value;
       // console.log('表单值返回1', name, input['value']);
        // } else {
        //   input['value'] = name.data;
        //   console.log('表单值返回2', name,  input['value']  );
        // }

      }

    });
    // console.log('表单值返回', this.gsShowConfig);
    this.inputValueChange();
  }

  /**
   * EmptyGS 清空公式
   */
  public EmptyGS() {
    this.gsShowConfig = this.gsShowConfig.filter(d => d.type !== 'projectName' && d.type !== 'unit');
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
      if (input['fkey'] === c.fkey) {
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
      const index = this.gsShowConfig.findIndex(item => item['fkey'] === this.selectedCol['fkey'] && item['type'] !== 'projectName' && item['type'] !== 'unit');
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

    const startOffset = JSON.stringify(this.rangeFocus.startOffset);
    const endOffset = JSON.stringify(this.rangeFocus.endOffset);
    if (this.rangeFocus) {
      this.rangeFocusPosition = { startOffset: startOffset, endOffset: endOffset };
    } else {
      this.rangeFocusPosition = undefined;
    }


    this.getTextarea();
    // console.log('记录光标位置对象->>', this.rangeFocus);
  }


}

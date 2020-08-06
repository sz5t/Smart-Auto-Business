import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';
@Component({
    selector: 'cn-grid-tag,[cn-grid-tag]',
    templateUrl: './cn-grid-tag.component.html',
})
export class CnGridTagComponent implements OnInit {
    @Input() public config;
    @Output() public updateValue = new EventEmitter();
    @Input() public value;
    @Input() public casadeData;
    @Input()
    public bsnData;
    @Input()
    public rowData;
    public _value;
    public cascadeSetValue = {};
    public Visible = false;
    public message = '当前值不合理';

    tags = [];
    _tags = [];

    tagColor = 'cyan';

    constructor(
        private http: _HttpClient
    ) { }
    public ngOnInit() {
        if (!this.config['disabled']) {
            this.config['disabled'] = false;
        }
        if (!this.config['readonly']) {
            this.config['readonly'] = null;
        }
        if (this.value) {
            if (this.value.data === '') {
                this._value = this.config.defaultValue;
                this.value.data = this._value;
                this.updateValue.emit(this.value);
            } else {
                this._value = this.value.data
            }
        }
        for (const key in this.casadeData) {
            if (key === 'setValue') {
                this.cascadeSetValue['setValue'] = JSON.parse(JSON.stringify(this.casadeData['setValue']));
                delete this.casadeData['setValue'];
            }
        }
        if (this.cascadeSetValue.hasOwnProperty('setValue')) {
            this._value = this.cascadeSetValue['setValue'];
            this.valueChange(this._value);
            delete this.cascadeSetValue['setValue'];
        }

        this.createTags();

    }


    public createTags() {

        let splitstr = ',';
        if (this.config.hasOwnProperty('tagSplit')) {
            splitstr = this.config['tagSplit'];
        }
        let newTags = [];
        if (this._value)
            newTags = this._value.split(splitstr);
        newTags = newTags.filter((s) => {
            if (s && s.trim() !== '') {
                return s;
            }

        });
        this._tags = newTags;
        this.tags = [...newTags];

    }


    public setValue(value) {
        this.value = value;
    }

    public getValue() {
        return this.value;
    }

    public valueChange(name?) {
        this.value.data = name;
        this.updateValue.emit(this.value);
    }



    // 组装值
    public assemblyValue() {
        this._value = this._value.trim();
        this.valueChange(this._value);
    }

    // formatConfig

    sliceTagName(tag: string): string {

        let length = 20;
        if (this.config.hasOwnProperty('tagContent')) {
            if (this.config['tagContent']['ContentSubstr'] && this.config['tagContent']['ContentSubstr']) {
                length = this.config['tagContent']['ContentSubstrlength'];
            } else {
                return tag;
            }
        } else {
            return tag;
        }
        const isLongTag = tag.length > length;
        return isLongTag ? `${tag.slice(0, length)}...` : tag;
    }

    mb = {
        "showFormat": {
            "type": "tag",
            "field": "remark",
            "options": {
                "type": "tag",
                "tagColor": "cyan", // magenta,red,volcano,orange,gold,lime,green,cyan,blue,geekblue,purple
                "tagSplit": ",", // 分割字符，默认是英文逗号，也可自定义
                "tagContent": {
                    "ContentSubstr": true, // 是否截取tag内容
                    "ContentSubstrlength": 20  // 内容长度
                },
                "tagsContent": {
                    "ContentSubstr": true, // 显示个数
                    "ContentSubstrlength": 20
                }



            }
        }
    }

}


import {Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewInit, ViewEncapsulation} from '@angular/core';
// declare let CodeMirror: any;
declare let showdown: any;
@Component({
    selector: 'cn-api-document-template',
    templateUrl: './api-document.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./api-document.css']
})
export class CnApiDocumentComponent implements AfterViewInit, OnDestroy {
    @ViewChild('CodeMirror') codeEditor: ElementRef;
    editor;
    constructor(
    ) { }

    ngAfterViewInit() {
        // this.editor = CodeMirror.fromTextArea(this.codeEditor.nativeElement, {
        //     mode: 'text/x-markdown',
        //     highlightFormatting: true,
        //     indentWithTabs: true,
        //     smartIndent: true,
        //     lineNumbers: true,
        //     matchBrackets: true,
        //     theme: 'default',
        //     autofocus: true,
        //     allowAtxHeaderWithoutSpace: true,
        //     extraKeys: {'Ctrl-Space': 'autocomplete'}
        // });

        const text = this.codeEditor.nativeElement.value;
        const converter = new showdown.Converter();
        const result = converter.makeHtml(text);
        document.getElementById('result').innerHTML = result;
    }

    ngOnDestroy(): void {

    }

}

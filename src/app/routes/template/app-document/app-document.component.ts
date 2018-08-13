import {Component, ViewChild, OnDestroy, ElementRef, AfterViewInit, ViewEncapsulation} from '@angular/core';
declare let showdown: any;
@Component({
    selector: 'cn-app-document-template',
    templateUrl: './app-document.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app-document.css']
})
export class CnAppDocumentComponent implements AfterViewInit, OnDestroy {
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
        document.getElementById('result').innerHTML = converter.makeHtml(text);
    }

    ngOnDestroy(): void {

    }
}

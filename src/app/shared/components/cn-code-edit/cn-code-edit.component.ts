import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
declare let CodeMirror: any;
@Component({
  selector: 'cn-code-edit,[cn-code-edit]',
  templateUrl: './cn-code-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cn-code-edit.component.css']
})
export class CnCodeEditComponent implements OnInit , AfterViewInit {
    @ViewChild('CodeMirror') codeEditor: ElementRef;
    @Input() config;

    editor;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {

    }
    ngAfterViewInit () {
        this.editor = CodeMirror.fromTextArea(this.codeEditor.nativeElement, {
          mode: 'text/x-sql',
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: true,
          matchBrackets: true,
          autofocus: true,
          extraKeys: {'Ctrl-Space': 'autocomplete'},
          hintOptions: {
            tables: {
              users: {name: null, score: null, birthDate: null},
              countries: {name: null, population: null, size: null}
            }
          }
        });
      }
      getValue() {
        return this.editor.getValue();
      }

      setValue(data?) {
        this.editor.setValue(data);
      }

}

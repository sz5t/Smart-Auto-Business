import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cn-layout-resolver',
  templateUrl: './layout-resolver.component.html',
})
export class LayoutResolverComponent implements OnInit {
  @Input() config;
  @Input() layoutId;
  constructor(
  ) { }

  ngOnInit() {

  }

}

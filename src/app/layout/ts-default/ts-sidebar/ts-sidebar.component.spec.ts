import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { setUpTestBed } from '@testing/common.spec';

import { TsSidebarComponent } from './ts-sidebar.component';

describe('Layout: Sidebar', () => {
    setUpTestBed(<TestModuleMetadata>{
        declarations: [ TsSidebarComponent ]
    });

    it('should create an instance', () => {
        const fixture = TestBed.createComponent(TsSidebarComponent);
        const comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    });
});

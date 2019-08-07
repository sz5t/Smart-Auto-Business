import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { setUpTestBed } from '@testing/common.spec';

import { TsHeaderComponent } from './ts-header.component';

describe('Layout: Header', () => {
    setUpTestBed(<TestModuleMetadata>{
        declarations: [ TsHeaderComponent ]
    });

    it('should create an instance', () => {
        const fixture = TestBed.createComponent(TsHeaderComponent);
        const comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    });
});

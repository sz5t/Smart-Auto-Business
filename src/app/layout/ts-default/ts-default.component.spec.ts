import { TestBed, TestModuleMetadata } from '@angular/core/testing';

import { setUpTestBed } from '@testing/common.spec';

import { TsLayoutDefaultComponent } from './ts-default.component';

describe('Layout', () => {
    setUpTestBed(<TestModuleMetadata>{
        declarations: [TsLayoutDefaultComponent]
    });

    it('should create an instance', () => {
        const fixture = TestBed.createComponent(TsLayoutDefaultComponent);
        const comp = fixture.debugElement.componentInstance;
        expect(comp).toBeTruthy();
    });
});

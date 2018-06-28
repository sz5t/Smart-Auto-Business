import { InjectionToken } from '@angular/core';

export const BSN_COMPONENT_MODES = {
    // grid
    CREATE: 'create',
    EDIT: 'edit', 
    DELETE: 'delete', 
    DIALOG: 'dialog',
    WINDOW: 'window',
    SAVE: 'save',
    CANCEL: 'cancel',
    FORM: 'form',
    // tree
    ADD_NODE: 'addNode',
    EDIT_NODE: 'editNode',
    DELETE_NODE: 'deleteNode',

    // form
    FORM_ADD: 'formAdd',
    FORM_EDIT: 'formEdit',
    FORM_LOAD: 'formLoad'
};

export const BSN_COMPONENT_CASCADE_MODES = {
    // grid, tree
    REFRESH_AS_CHILD : 'refreshAsChild',
    REFRESH: 'refresh',

    // grid
    SELECTED_ROW: 'selectRow',
    CHECKED_ROWS: 'checkRow',

    // tree
    CLICK_NODE : 'clickNode',
    SELECTED_NODE: 'selectNode',
    CHEKCED_NODES: 'checkNode',

    // form
    LOAD_FORM: 'loadForm'
};

export const BSN_COMPONENT_CASCADE = new InjectionToken<string>('bsnComponentCascade');

export class BsnComponentMessage {
    constructor(public _mode: string, public _viewId: string, public option?: any) {}
}

/*
// region: table models
export const BSN_TABLE_STATUS = new InjectionToken<string>('bsnTable_status');
export class BsnTableStatus {
    constructor(public _mode: string, public _viewId: string, public option?: any) {}
}
// endregion

// region: table cascade
export const BSN_TABLE_CASCADE = new InjectionToken<string>('bsnTable_cascade');
export class BsnTableCascade {
    constructor(public _mode: string, public _viewId: string, public option: any) {}
}
// endregion

// region: tree status
export const BSN_TREE_STATUS = new InjectionToken<string>('bsnTreeStatus');
export class BsnTreeStatus {
    constructor(public _mode: string, public _viewId: string, public option: any) {}
}
// endregion

// region: tree cascade
export const BSN_TREE_CASCADE = new InjectionToken<string>('bsnTree_cascade');
export class BsnTreeCascade {
    constructor(public _mode: string, public _viewId: string, public option: any) {}
}

// endregion
*/




import { InjectionToken } from '@angular/core';

export const BSN_COMPONENT_MODES = {
    // grid
    CREATE: 'create',
    CREATE_CHILD: 'create_child',
    EDIT: 'edit',
    DELETE: 'delete',
    DIALOG: 'dialog',
    WINDOW: 'window',
    SAVE: 'save',
    CANCEL: 'cancel',
    CANCEL_SELECTED: 'cancel_select',
    FORM: 'form',
    EXECUTE_SELECTED : 'execute_select',
    EXECUTE_CHECKED: 'execute_checked',
    SEARCH : 'Search',
    UPLOAD: 'upload',
    REFRESH: 'refresh',
    FORM_BATCH: 'formBatch',
    // tree
    ADD_NODE: 'addNode',
    EDIT_NODE: 'editNode',
    DELETE_NODE: 'deleteNode',
    SAVE_NODE: 'saveNode',
    EXECUTE: 'execute',

    // form
    FORM_ADD: 'formAdd',
    FORM_EDIT: 'formEdit',
    FORM_LOAD: 'formLoad'

};

export const BSN_FORM_STATUS = {
    CREATE: 'post',
    EDIT: 'put',
    TEXT: 'text'
};

export const BSN_PARAMETER_TYPE = {
    TEMP_VALUE: 'tempValue',
    VALUE: 'value',
    GUID: 'GUID',
    COMPONENT_VALUE: 'componentValue',
    CHECKED_ROW: 'checkedRow',
    SELECTED_ROW: 'selectedRow',
    CHECKED: 'checked',
    SELECTED: 'selected',
    CHECKED_ID: 'checkedId',
    INIT_VALUE: 'initValue',
    CACHE_VALUE: 'cacheValue',
    CASCADE_VALUE: 'cascadeValue'
};

export const BSN_EXECUTE_ACTION = {
    EXECUTE_SAVE_ROW: 'EXECUTE_SAVE_ROW',
    EXECUTE_EDIT_ROW: 'EXECUTE_EDIT_ROW',
    EXECUTE_SELECTED: 'EXECUTE_SELECTED',
    EXECUTE_CHECKED: 'EXECUTE_CHECKED',
    EXECUTE_CHECKED_ID: 'EXECUTE_CHECKED_ID',
    EXECUTE_NODE_SELECTED: 'EXECUTE_NODE_SELECTED',
    EXECUTE_NODE_CHECKED: 'EXECUTE_NODE_CHECKED',
    EXECUTE_NODES_CHECKED_KEY: 'EXECUTE_NODES_CHECKED_KEY',
    EXECUTE_SAVE_TREE_ROW: 'EXECUTE_SAVE_TREE_ROW',
    EXECUTE_EDIT_TREE_ROW: 'EXECUTE_EDIT_TREE_ROW'

};

export const BSN_OUTPOUT_PARAMETER_TYPE = {
    TABLE: 'table',
    VALUE: 'value',
    MESSAGE: 'message',
    NEXT: 'next'
};

export const BSN_COMPONENT_CASCADE_MODES = {
    // grid, tree
    REFRESH_AS_CHILD : 'refreshAsChild',
    RELOAD: 'reload',
    REFRESH: 'refresh',
    REPLACE_AS_CHILD: 'replaceAsChild',
    REFRESH_AS_CHILDREN: 'refreshAsChildren',

    // grid
    SELECTED_ROW: 'selectRow',
    CHECKED_ROWS: 'checkRow',

    // tree
    CLICK_NODE : 'clickNode',
    SELECTED_NODE: 'selectNode',
    CHEKCED_NODES: 'checkNode',
    CHECKED_NODES_ID: 'checkNodesId',

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




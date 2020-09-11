
import { InjectionToken } from '@angular/core';

export abstract class ComponentModes {
    public CREATE: string;
    public CREATE_CHILD: string;
    public EDIT: string;
    public DELETE: string;
    public DELETE_SELECTED: string;
    public DIALOG: string;
    public WINDOW: string;
    public SAVE: string;
    public CANCEL: string;
    public CANCEL_SELECTED: string;
    public FORM: string;
    public EXECUTE_SELECTED: string;
    public EXECUTE_CHECKED: string;
    public SEARCH: string;
    public UPLOAD: string;
    public REFRESH: string;
    public ADD_ROW_DATA: string;
    public FORM_BATCH: string;
    public EXPORT: string;
    // tree
    public ADD_NODE: string;
    public EDIT_NODE: string;
    public DELETE_NODE: string;
    public SAVE_NODE: string;
    public EXECUTE: string;

    // form
    public FORM_ADD: string;
    public FORM_EDIT: string;
    public FORM_LOAD: string;
    public IMPORT_EXCEL: string;
    public SEND_ORDER: string;
    public PROCESS_SUBMIT: string;

    // tstable
    public AUTO_PLAY: string;
    public CALL_INTERFACE: string;
    public SHOW_VIDEO: string;

}

export const BSN_COMPONENT_MODES: ComponentModes = {
    // grid
    CREATE: 'create',
    CREATE_CHILD: 'create_child',
    EDIT: 'edit',
    DELETE: 'delete',
    DELETE_SELECTED: 'delete_select',
    DIALOG: 'dialog',
    WINDOW: 'window',
    SAVE: 'save',
    CANCEL: 'cancel',
    CANCEL_SELECTED: 'cancel_select',
    FORM: 'form',
    EXECUTE_SELECTED: 'execute_select',
    EXECUTE_CHECKED: 'execute_checked',
    SEARCH: 'Search',
    UPLOAD: 'upload',
    REFRESH: 'refresh',
    ADD_ROW_DATA: 'add_row_data',
    FORM_BATCH: 'formBatch',
    EXPORT: 'export',
    // tree
    ADD_NODE: 'addNode',
    EDIT_NODE: 'editNode',
    DELETE_NODE: 'deleteNode',
    SAVE_NODE: 'saveNode',
    EXECUTE: 'execute',

    // form
    FORM_ADD: 'formAdd',
    FORM_EDIT: 'formEdit',
    FORM_LOAD: 'formLoad',
    IMPORT_EXCEL: 'importExcel',
    SEND_ORDER: 'sendOrder',
    PROCESS_SUBMIT: 'processSubmit',

    // tstable
    AUTO_PLAY: 'autoPlay',
    CALL_INTERFACE: 'callInterface',
    SHOW_VIDEO: 'showVideo'
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
    ITEM: 'item',
    COMPONENT_VALUE: 'componentValue',
    CHECKED_ROW: 'checkedRow',
    SELECTED_ROW: 'selectedRow',
    CHECKED: 'checked',
    SELECTED: 'selected',
    CHECKED_ID: 'checkedId',
    INIT_VALUE: 'initValue',
    CACHE_VALUE: 'cacheValue',
    CASCADE_VALUE: 'cascadeValue',
    RETURN_VALUE: 'returnValue',
    DEFAULT_WEEK: 'defaultWeek',
    DEFAULT_DAY: 'defaultDay',
    DEFAULT_MONTH: 'defaultMonth',
    ROUTER: 'router',
    ROUTER_VALUE: 'routerValue'
};

export const BSN_EXECUTE_ACTION = {
    EXECUTE_ADD_ROW_DATA: 'EXECUTE_ADD_ROW_DATA',
    EXECUTE_SAVE_ROW: 'EXECUTE_SAVE_ROW',
    EXECUTE_EDIT_ROW: 'EXECUTE_EDIT_ROW',
    EXECUTE_EDIT_SELECTED_ROW: 'EXECUTE_EDIT_SELECTED_ROW',
    EXECUTE_SELECTED: 'EXECUTE_SELECTED',
    EXECUTE_CHECKED: 'EXECUTE_CHECKED',
    EXECUTE_CHECKED_ID: 'EXECUTE_CHECKED_ID',
    EXECUTE_NODE_SELECTED: 'EXECUTE_NODE_SELECTED',
    EXECUTE_NODE_CHECKED: 'EXECUTE_NODE_CHECKED',
    EXECUTE_ALL_NODE_CHECKED: 'EXECUTE_ALL_NODE_CHECKED',
    EXECUTE_NODES_CHECKED_KEY: 'EXECUTE_NODES_CHECKED_KEY',
    EXECUTE_ALL_NODES_CHECKED_KEY: 'EXECUTE_ALL_NODES_CHECKED_KEY',
    EXECUTE_SAVE_TREE_ROW: 'EXECUTE_SAVE_TREE_ROW',
    EXECUTE_EDIT_TREE_ROW: 'EXECUTE_EDIT_TREE_ROW',
    EXECUTE_AND_LOAD: 'EXECUTE_AND_LOAD',
    EXECUTE_DOWNLOAD: 'EXECUTE_DOWNLOAD',
    EXECUTE_MESSAGE: 'EXECUTE_MESSAGE',
    EXECUTE_EDIT_ALL_ROW: 'EXECUTE_EDIT_ALL_ROW',
    CREATE_DYNAMIC_TABLE: 'CREATE_DYNAMIC_TABLE'

};

export const BSN_OUTPOUT_PARAMETER_TYPE = {
    TABLE: 'table',
    VALUE: 'value',
    MESSAGE: 'message',
    NEXT: 'next',
    TEMPVALUE: 'tempValue'
};

export const BSN_COMPONENT_CASCADE_MODES = {
    AUTO_RESIZE: 'autoResize',
    // grid, tree
    REFRESH_AS_CHILD: 'refreshAsChild',
    RELOAD: 'reload',
    REFRESH: 'refresh',
    REPLACE_AS_CHILD: 'replaceAsChild',
    REFRESH_AS_CHILDREN: 'refreshAsChildren',
    REPLACE_AS_SUBMAPPING: 'replaceAsSubMapping',
    REFRESH_BY_IDS : 'refreshByIds',

    // grid
    SELECTED_ROW: 'selectRow',
    CHECKED_ROWS: 'checkRow',
    Scan_Code_ROW: 'scanCodeROW',
    Scan_Code_Locate_ROW: 'scanCodeLocateROW',

    // tree
    CLICK_NODE: 'clickNode',
    SELECTED_NODE: 'selectNode',
    CHEKCED_NODES: 'checkNode',
    CHECKED_NODES_ID: 'checkNodesId',
    ADD_ASYNC_TREE_NODE: 'addAsyncTreeNode',
    EDIT_ASNYC_TREE_NODE: 'editAsyncTreeNode',
    DELETE_ASYNC_TREE_NODE: 'deleteAsyncTreeNode',
    MOBILE_ASYNC_TREE_NODE: 'mobileAsyncTreeNode',
    UP_ASYNC_TREE_NODE: 'upAsyncTreeNode',
    DOWN_ASYNC_TREE_NODE: 'downAsyncTreeNode',

    // form
    LOAD_FORM: 'loadForm',
    REFRESH_VALUE_CHANGE: 'refreshValueChange',

    // tstable
    START_AUTO_PLAY: 'startAutoPlay',
    CREATE_DYNAMIC_TABLE: 'createDynamicTable'
    
};

export const BSN_COMPONENT_MODE = new InjectionToken<string>(
    'bsnComponentModes'
);

export const BSN_COMPONENT_CASCADE = new InjectionToken<string>(
    'bsnComponentCascade'
);

export class BsnComponentMessage {
    constructor(
        public _mode?: string,
        public _viewId?: string,
        public option?: any
    ) { }
}

export const BSN_OPERATION_LOG_TYPE = {
    ADD: '1',
    DELETE: '2',
    UPDATE: '3',
    SEARCH: '4',
    PROC: '6',
    SQL: '5',
    SAVE: '7',
    POST: '8'
}

export const BSN_OPERATION_LOG_RESULT = {
    SUCCESS: '1',
    ERROR: '0'
}

export const BSN_DB_INSTANCE = {
    SMART_ONE_CFG: 'SmartOneCfg'
}

export class BeforeOperation {
    private _beforeOperationMap: Map<string, any>;
    public get beforeOperationMap() {
        return this._beforeOperationMap;
    }
    public set beforeOperationMap(value) {
        this._beforeOperationMap = value;
    }

    private _operationItemData;
    public get operationItemData() {
        return this._operationItemData;
    }
    public set operationItemData(value) {
        this._operationItemData = value;
    }

    private _operationItemsData;
    public get operationItemsData() {
        return this._operationItemsData;
    }
    public set operationItemsData(value) {
        this._operationItemsData = value;
    }

    private _modal;
    public get modal() {
        return this._modal;
    }
    public set modal(value) {
        this._modal = value;
    }

    private _tempValue;
    public get tempValue() {
        return this._tempValue;
    }
    public set tempValue(value) {
        this._tempValue = value;
    }

    private _initValue;
    public get initValue() {
        return this._initValue;
    }
    public set initValue(value) {
        this._initValue = value;
    }

    private _message;
    public get message() {
        return this._message;
    }
    public set message(value) {
        this._message = value;
    }

    private _config;
    public get config() {
        return this._config;
    }
    public set config(value) {
        this._config = value;
    }

    private _cacheValue;
    public get cacheValue() {
        return this._cacheValue;
    }
    public set cacheValue(value) {
        this._cacheValue = value;
    }

    constructor({ config, modal, message, tempValue, initValue, cacheValue }) {
        this.config = config;
        this.modal = modal;
        this.message = message;
        this.tempValue = tempValue;
        this.initValue = initValue;
        this.cacheValue = cacheValue;
        this.resolverBeforeOperation();
    }

    /**
     * 操作选中行前置判断
     * @option  {type, name, actionName, ajaxConfig}
     */
    public beforeItemDataOperation(option) {
        let result = false;
        if (this._beforeOperationMap.has(option.name)) {
            const op_status = this._beforeOperationMap.get(option.name);
            op_status.forEach(statusItem => {
                const conditionResult = this.handleOperationConditions(
                    statusItem.conditions
                );
                const actionResult = this.handleOperationAction(
                    conditionResult,
                    statusItem.action
                );
                if (actionResult) {
                    result = true;
                    return true;
                }
                result = actionResult;
            });
        }
        return result;
    }

    /**
     * 操作勾选行前置判断
     * @param option
     */
    public beforeItemsDataOperation(option) {
        let result = false;
        if (this._beforeOperationMap.has(option.name)) {
            const op_status = this._beforeOperationMap.get(option.name);
            op_status.forEach(statusItem => {
                const conditionResult = this.handleCheckedRowsOperationConditions(
                    statusItem.conditions
                );
                const actionResult = this.handleOperationAction(
                    conditionResult,
                    statusItem.action
                );
                if (actionResult) {
                    result = true;
                    // 跳出循环
                    return true;
                }
                result = actionResult;
            });
        }
        return result;
    }

    /**
     * 处理选中前置操作条件
     * @param conditions
     */
    private handleOperationConditions(conditions) {
        const orResult = [];
        conditions.forEach(elements => {
            // 解析‘与’的关系条件
            const andResults = [];
            elements.forEach(item => {
                let andResult = true;
                // 选中行的解析处理
                switch (item.checkType) {
                    case "value":
                        andResult = this.matchValueCondition(
                            this.operationItemData,
                            item
                        );
                        break;
                    case "regexp":
                        andResult = this.matchRegexpCondition(
                            this.operationItemData,
                            item
                        );
                        break;
                    case "tempValue":
                        andResult = this.matchValueCondition(
                            this.tempValue,
                            item
                        );
                        break;
                    case "initValue":
                        andResult = this.matchValueCondition(
                            this.initValue,
                            item
                        );
                        break;
                    case "cacheValue":
                        andResult = this.matchValueCondition(
                            this.cacheValue,
                            item
                        );
                        break;
                }
                andResults.push(andResult);
            });
            const and = andResults.every(s => s === true);
            orResult.push(and);
            // 解析’或‘的关系条件
        });

        return orResult.some(s => s === true);
    }

    /**
     * 处理勾选前置操作条件
     * @param conditions
     */
    private handleCheckedRowsOperationConditions(conditions) {
        const orResult = [];
        const checkedRows = this.operationItemsData();
        conditions.forEach(elements => {
            // 解析‘与’的关系条件
            const andResults = [];
            elements.forEach(item => {
                let andResult = true;
                // 选中行的解析处理
                switch (item.checkType) {
                    case "value":
                        andResult = this.matchCheckedValueCondition(
                            // 勾选的行
                            checkedRows,
                            item
                        );
                        break;
                    case "regexp":
                        andResult = this.matchCheckedRegexpCondition(
                            // 勾选的行
                            checkedRows,
                            item
                        );
                        break;
                    case "tempValue":
                        andResult = this.matchValueCondition(
                            // 勾选的行
                            this.tempValue,
                            item
                        );
                        break;
                    case "initValue":
                        andResult = this.matchValueCondition(
                            // 勾选的行
                            this.initValue,
                            item
                        );
                        break;
                    case "cacheValue":
                        andResult = this.matchValueCondition(
                            this.cacheValue,
                            item
                        );
                        break;
                }
                andResults.push(andResult);
            });
            // 解析’或‘的关系条件
            const and = andResults.every(s => s === true);
            orResult.push(and);
        });
        return orResult.some(s => s === true);
    }

    /**
     * 值匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    private matchValueCondition(dataItem, statusItem) {
        let result = true;
        if (dataItem) {
            if (dataItem[statusItem["name"]] === statusItem["value"]) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    /**
     * 匹配勾选行值条件
     * @param checkedRows
     * @param statusItem
     */
    private matchCheckedValueCondition(checkedRows, statusItem) {
        let result = true;
        if (checkedRows.length > 0) {
            checkedRows.forEach(row => {
                if (row[statusItem["name"]] === statusItem["value"]) {
                    result = true;
                } else {
                    result = false;
                }
            });
        }
        return result;
    }

    /**
     * 匹配勾选行的正则条件
     * @param checkedRows
     * @param statusItem
     */
    private matchCheckedRegexpCondition(checkedRows, statusItem) {
        let result = true;
        if (checkedRows.length > 0) {
            const reg = new RegExp(statusItem.value ? statusItem.value : "");
            checkedRows.forEach(row => {
                if (reg.test(row[statusItem["name"]])) {
                    result = true;
                } else {
                    result = false;
                }
            });
        }
        return result;
    }

    /**
     * 正则表达匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    private matchRegexpCondition(dataItem, statusItem) {
        let result = true;
        if (dataItem) {
            const reg = new RegExp(statusItem.value ? statusItem.value : "");
            if (reg.test(dataItem[statusItem["name"]])) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }

    /**
     * 处理验证结果
     * @param actionResult
     * @param action
     */
    private handleOperationAction(actionResult, action) {
        let result = true;
        if (action) {
            switch (action.execute) {
                case "prevent":
                    if (actionResult) {
                        this.beforeOperationMessage(action, result);
                        // result = true;
                    } else {
                        result = false;
                    }
                    break;
                case "continue":
                    if (!actionResult) {
                        result = false;
                    } else {
                        this.beforeOperationMessage(action, result);
                        // result = true;
                    }
                    break;
            }
        }

        return result;
    }

    /**
     * 构建验证消息
     * @param action
     */
    private beforeOperationMessage(action, result) {
        if (action["type"] === "confirm") {
            this.modal.confirm({
                nzTitle: action["title"],
                nzContent: action["message"],
                nzOnOk: () => {
                    result = false;
                    // 调用后续操作
                },
                nzOnCancel() {
                    result = true;
                }
            });
        } else {
            this._message[action["type"]](action.message);
            result = action.execute === "prevent" ? true : false;
        }
    }

    /**
     * 解析前作动作配置条件
     */
    private resolverBeforeOperation() {
        this._beforeOperationMap = new Map();
        if (
            this.config.beforeOperation &&
            Array.isArray(this.config.beforeOperation) &&
            this.config.beforeOperation.length > 0
        ) {
            this.config.beforeOperation.forEach(element => {
                this._beforeOperationMap.set(element.name, element.status);
            });
        }
    }
}

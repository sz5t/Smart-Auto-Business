import { CommonTools } from '@core/utility/common-tools';
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

    private _apiResource;
    public get apiResource() {
        return this._apiResource;
    }
    public set apiResource(value) {
        this._apiResource = value;
    }

    public buildParameter(parameters, value) {
        const params = CommonTools.parametersResolver({
            params: parameters,
            item: value,
            componentValue: value,
            tempValue: this.tempValue,
            initValue: this.initValue,
            cacheValue: this.cacheValue
        });
        return params;
    }

    public buildUrl(urlConfig) {
        let url;
        if (CommonTools.isString(urlConfig)) {
            url = urlConfig;
        } else {
            const pc = CommonTools.parametersResolver({
                params: urlConfig.params,
                tempValue: this.tempValue,
                initValue: this.initValue,
                cacheValue: this.cacheValue
            });
            url = `${urlConfig.url['parent']}/${pc}/${urlConfig.url['child']}`;
        }
        return url;
    } 

    constructor({ config, modal, message, tempValue, initValue, cacheValue, apiResource }) {
        this.config = config;
        this.modal = modal;
        this.message = message;
        this.tempValue = tempValue;
        this.initValue = initValue;
        this.cacheValue = cacheValue;
        this.apiResource = apiResource;
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
            for (let i = 0, len = op_status.length; i < len; i++) {
                const conditionResult = this.handleOperationConditions(
                    op_status[i].conditions
                );
                const actionResult = this.handleOperationAction(
                    conditionResult,
                    op_status[i].action
                );
                if (actionResult) {
                    result = true;
                    break;
                }
                result = actionResult;
            }
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
            for (let i = 0, len = op_status.length; i < len; i++) {
                const conditionResult = this.handleCheckedRowsOperationConditions(
                    op_status[i].conditions
                );
                const actionResult = this.handleOperationAction(
                    conditionResult,
                    op_status[i].action
                );
                if (actionResult) {
                    result = true;
                    // 跳出循环
                    break;
                }
                result = actionResult;
            }
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
                    case 'value':
                        andResult = this.matchValueCondition(item);
                        break;
                    case 'regexp':
                        andResult = this.matchRegexpCondition(item);
                        break;
                    case 'tempValue':
                        andResult = this.matchTempValueCondition(item);
                        break;
                    case 'initValue':
                        andResult = this.matchInitValueCondition(item);
                        break;
                    case 'cacheValue':
                        andResult = this.matchCacheValueCondition(item);
                        break;
                    case 'innerValue':
                        andResult = this.innerValueCondition(item);
                        break;
                    case 'executeAjax':
                        // 预留前置异步操作
                        // andResult = this.executeAjaxCondition(item);
                        break;
                    case 'ajaxValue':
                        // 预留前置异步校验
                        // andResult = this.matchAjaxValueCondition(item);
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
     * 值匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    private matchValueCondition(statusItem) {
        let result = false;
        if (this.operationItemData) {
            result =
                this.operationItemData[statusItem['name']] ===
                statusItem['value'];
        }
        return result;
    }

    /**
     * 正则表达匹配验证
     * @param dataItem 待比较数据
     * @param statusItem 匹配条件对象
     */
    private matchRegexpCondition(statusItem) {
        let result = false;
        if (this.operationItemData) {
            const reg = new RegExp(
                statusItem['value'] ? statusItem['value'] : ''
            );
            result = reg.test(this.operationItemData[statusItem['name']]);
        }
        return result;
    }

    private innerValueCondition (statusItem) {
        // 判断与固定值做验证还是与当前行数据验证
        let result = false;
        let tmpValue;
        let cchValue;
        let iniValue;
        if (statusItem['tempValue']) {
            tmpValue = this.tempValue[statusItem['tempValue']];
        }
        if (statusItem['cacheValue']) {
            cchValue = this.cacheValue[statusItem['cacheValue']];
        }
        if (statusItem['initValue']) {
            iniValue = this.initValue[statusItem['initValue']];
        }

        if (tmpValue && cchValue) {
            result = tmpValue !== cchValue;
        } else if (tmpValue && iniValue) {
            result = tmpValue !== iniValue; 
        } else if (cchValue && iniValue) {
            result = cchValue !== iniValue;
        } else if (iniValue && tmpValue) {
            result = iniValue !== tmpValue;
        }

        return result;

    }

    private matchTempValueCondition(statusItem) {
        // 判断与固定值做验证还是与当前行数据验证
        let result = false;
        if (statusItem['name']) {
            result =
                this.operationItemData[statusItem['name']] !==
                this.tempValue[statusItem['valueName']];
        } else {
            const reg = new RegExp(statusItem['value']);
            result = reg.test(this.tempValue[statusItem['valueName']]);
            //   if (this.tempValue[statusItem['valueName']] === statusItem['value']) {
            //     result = true;
            //   }
        }
        return result;
    }

    private matchInitValueCondition(statusItem) {
        let result = false;
        if (statusItem['name']) {
            result =
                this.operationItemData[statusItem['name']] !==
                this.initValue[statusItem['valueName']];
        } else {
            const reg = new RegExp(statusItem['value']);
            result = reg.test(this.initValue[statusItem['valueName']]);
        }
        return result;
    }

    private matchCacheValueCondition(statusItem) {
        let result = false;
        if (statusItem['name']) {
            result =
                this.operationItemData[statusItem['name']] !==
                this.cacheValue[statusItem['valueName']];
        } else {
            const reg = new RegExp(statusItem['value']);
            result = reg.test(this.cacheValue[statusItem['valueName']]);
        }
        return result;
    }

    private async matchAjaxValueCondition(statusItem) {
        let result = false;
        const url = this.buildUrl(statusItem.ajaxConfig.url);
        const params = this.buildParameter(statusItem.ajaxConfig.params, this.operationItemData);
        const response = await this.apiResource[statusItem.ajaxConfig.ajaxType](url, params);
        if (response.isSuccess) {
            if (statusItem['name']) {
                if (Array.isArray(response.data)) {
                    result = response.data.every(s => this.operationItemData[statusItem['name']] === s[statusItem['valueName']]);
                } else {
                    result = this.operationItemData[statusItem['name']] ===
                    response.data[statusItem['valueName']];
                }
            } else {
                const reg = new RegExp(statusItem['value']);
                if (Array.isArray(response.data)) {
                    result = response.data.every(s => reg.test(s[statusItem['name']]));
                } else {
                    result = reg.test(response.data[statusItem['valueName']]);
                }
            }
        }
        return result;
    }

    private async executeAjaxCondition(statusItem) {
        const url = this.buildUrl(statusItem.ajaxConfig.url);
        const params = this.buildParameter(statusItem.ajaxConfig.params, this.operationItemData);
        const response = await this.apiResource[statusItem.ajaxConfig.ajaxType](url, params);
        return response.isSuccess;
    }

    /**
     * 处理勾选前置操作条件
     * @param conditions
     */
    private handleCheckedRowsOperationConditions(conditions) {
        const orResult = [];
        conditions.forEach(elements => {
            // 解析‘与’的关系条件
            const andResults = [];
            elements.forEach(item => {
                let andResult = true;
                // 选中行的解析处理
                switch (item.checkType) {
                    case 'value':
                        andResult = this.matchCheckedValueCondition(item);
                        break;
                    case 'regexp':
                        andResult = this.matchCheckedRegexpCondition(item);
                        break;
                    case 'tempValue':
                        andResult = this.matchCheckedTempValueCondition(item);
                        break;
                    case 'initValue':
                        andResult = this.matchCheckedInitValueCondition(item);
                        break;
                    case 'cacheValue':
                        andResult = this.matchCheckedCacheValueCondition(item);
                        break;
                    case 'innerValue':
                        andResult = this.innerValueCondition(item);
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
     * 匹配勾选的缓存数据
     * @param statusItem
     */
    private matchCheckedCacheValueCondition(statusItem) {
        let result = false;
        if (this.operationItemsData) {
            if (statusItem['name']) {
                result = this.operationItemsData.some(
                    row =>
                        row[statusItem['name']] !==
                        this.cacheValue[statusItem['valueName']]
                );
            } else {
                const reg = new RegExp(statusItem['value']);
                result = reg.test(this.cacheValue[statusItem['valueName']]);
            }
        }
        return result;
    }

    /**
     * 匹配勾选的缓存数据
     * @param statusItem
     */
    private matchCheckedTempValueCondition(statusItem) {
        let result = false;
        if (this.operationItemsData) {
            if (statusItem['name']) {
                result = this.operationItemsData.some(
                    row =>
                        row[statusItem['name']] !==
                        this.tempValue[statusItem['valueName']]
                );
            } else {
                const reg = new RegExp(statusItem['value']);
                result = reg.test(this.tempValue[statusItem['valueName']]);
            }
        }
        return result;
    }

    /**
     * 匹配勾选的缓存数据
     * @param statusItem
     */
    private matchCheckedInitValueCondition(statusItem) {
        let result = false;
        if (this.operationItemsData) {
            if (statusItem['name']) {
                result = this.operationItemsData.some(
                    row =>
                        row[statusItem['name']] !==
                        this.initValue[statusItem['valueName']]
                );
            } else {
                const reg = new RegExp(statusItem['value']);
                result = reg.test(this.initValue[statusItem['valueName']]);
            }
        }
        return result;
    }

    /**
     * 匹配勾选行值条件
     * @param checkedRows
     * @param statusItem
     */
    private matchCheckedValueCondition(statusItem) {
        let result = false;
        if (this.operationItemsData.length > 0) {
            result = this.operationItemsData.some(
                row => row[statusItem['name']] === statusItem['value']
            );
        }
        return result;
    }

    /**
     * 匹配勾选行的正则条件
     * @param checkedRows
     * @param statusItem
     */
    private matchCheckedRegexpCondition(statusItem) {
        let result = false;
        if (this.operationItemsData.length > 0) {
            const reg = new RegExp(statusItem.value ? statusItem.value : '');
            const txt = reg.test(
                this.operationItemsData[0][statusItem['name']]
            );
            result = this.operationItemsData.some(row =>
                reg.test(row[statusItem['name']])
            );
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
                case 'prevent':
                    if (actionResult) {
                        this.beforeOperationMessage(action, result);
                    } else {
                        result = false;
                    }
                    break;
                case 'continue':
                    if (actionResult) {
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
        if (action['type'] === 'confirm') {
            this.modal.confirm({
                nzTitle: action['title'],
                nzContent: action['message'],
                nzOnOk: () => {
                    result = false;
                    // 调用后续操作
                },
                nzOnCancel() {
                    result = true;
                }
            });
        } else {
            this._message[action['type']](action.message);
            result = action.execute === 'prevent' ? true : false;
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

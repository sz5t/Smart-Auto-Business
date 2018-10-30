export class CnComponentBase {
    // 临时变量，所有组件中进行业务处理所保存的操作数据
    private _tempValue;
    get tempValue() {
        if (!this._tempValue) {
            this._tempValue = {};
        }
        return this._tempValue;
    }

    set tempValue(value) {
        this._tempValue = value;
    }

    private _initValue;
    get initValue() {
        return this._initValue;
    }
    set initValue(value) {
        this._initValue = value;
    }

    private _cacheValue;
    public get cacheValue() {
        return this._cacheValue;
    }
    public set cacheValue(value) {
        this._cacheValue = value;
    }

    before(target, method, advice) {
        const original = target[method];
        target[method] = function() {
            const result = advice(arguments);
            if (result) {
                original.apply(target, arguments);
            }
        };
        return target;
    }
    after(target, method, advice) {
        const original = target[method];
        target[method] = function() {
            original.apply(target, arguments);
            advice(arguments);
        };
        return target;
    }
    around(target, method, advice) {
        const original = target[method];
        target[method] = function() {
            advice(arguments);
            original.apply(target, arguments);
            advice(arguments);
        };
        return target;
    }
}

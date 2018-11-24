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

    private _statusSubscriptions;
    public get statusSubscriptions() {
        return this._statusSubscriptions;
    }
    public set statusSubscriptions(value) {
        this._statusSubscriptions = value;
    }

    private _cascadeSubscriptions;
    public get cascadeSubscriptions() {
        return this._cascadeSubscriptions;
    }
    public set cascadeSubscriptions(value) {
        this._cascadeSubscriptions = value;
    }

    private _baseMessage;
    public get baseMessage() {
        return this._baseMessage;
    }
    public set baseMessage(value) {
        this._baseMessage = value;
    }

    private _baseModal;
    public get baseModal() {
        return this._baseModal;
    }
    public set baseModal(value) {
        this._baseModal = value;
    }

    private _apiResource;
    public get apiResource() {
        return this._apiResource;
    }
    public set apiResource(value) {
        this._apiResource = value;
    }

    unsubscribe() {
        if (this._statusSubscriptions) {
            this.statusSubscriptions.unsubscribe();
        }

        if (this._cascadeSubscriptions) {
            this.statusSubscriptions.unsubscribe();
        }
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

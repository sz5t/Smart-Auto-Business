import { Observable } from 'rxjs';
export class CnComponentBase {
    before(target, method, advice) {
        const original = target[method];
        target[method] = function () {
            (advice)(arguments);
            original.apply(target, arguments);
        };
        return target;
    }
    after (target, method, advice) {
        const original = target[method];
        target[method] = function () {
            original.apply(target, arguments);
            (advice)(arguments);
        };
        return target;
    }
    around (target, method, advice) {
        const original = target[method];
        target[method] = function () {
            (advice)(arguments);
            original.apply(target, arguments);
            (advice)(arguments);
        };
        return target;
    }
}

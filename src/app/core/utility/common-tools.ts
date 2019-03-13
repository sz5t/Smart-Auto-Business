import { BSN_PARAMETER_TYPE } from '@core/relative-Service/BsnTableStatus';
import { getISOYear, getMonth, getISOWeek } from 'date-fns';
import { ActivatedRoute } from '@angular/router';
export interface ParametersResolverModel {
    params: any[];
    tempValue?: any;
    item?: any;
    componentValue?: any;
    initValue?: any;
    cacheValue?: any;
    cascadeValue?: any;
    returnValue?: any;
    router?: ActivatedRoute;
}

export interface OperationLogModel {
    Id: string,
    categoryId: string,
    eventId: string,
    eventResult: string,
    funcId: string,
    description: string,
    instanceId: string,
    loginDate: string,
    userId: string,
    userIp: string
}

export class CommonTools {
    public static uuID(w) {
        let s = '';
        const str =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < w; i++) {
            s += str.charAt(Math.round(Math.random() * (str.length - 1)));
        }
        return s;
    }

    public static deepCopy(data) {
        return JSON.parse(JSON.stringify(data));
    }

    public static parametersResolver(model: ParametersResolverModel) {
        const result = {};
        if (Array.isArray(model.params)) {
            model.params.forEach(param => {
                const paramType = param['type'];
                if (paramType) {
                    switch (paramType) {
                        case BSN_PARAMETER_TYPE.TEMP_VALUE:
                            if (
                                model.tempValue &&
                                model.tempValue[param['valueName']]
                            ) {
                               // result[param['name']] = model.tempValue[param['valueName']];
                                if (param['datatype']) {
                                    result[param['name']] = this.getParameters(param['datatype'],  model.tempValue[param['valueName']]);
                                } else {
                                    result[param['name']] =  model.tempValue[param['valueName']];
                                }
                            } else {
                                if (
                                    param['value'] === null ||
                                    param['value'] === '' ||
                                    param['value'] === 0
                                ) {
                                    // result[param['name']] = param.value;
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'],   param.value);
                                    } else {
                                        result[param['name']] =  param.value;
                                    }
                                } else if (param['defaultDate']) {
                                    const dateType = param['defaultDate'];
                                    let dValue;
                                    switch (dateType) {
                                        case 'defaultWeek':
                                        dValue = `${getISOYear(Date.now())}-${getISOWeek(Date.now())}`;
                                        break;
                                        case 'defaultDay':

                                        break;
                                        case 'defaultMonth':
                                        dValue = `${getISOYear(Date.now())}-${getMonth(Date.now()) + 1 }`;
                                        break;
                                        case 'defaultYear':
                                        dValue = `${getISOYear(Date.now())}`;
                                        break;
                                    }
                                    // result[param['name']] = dValue;
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'],   dValue);
                                    } else {
                                        result[param['name']] =  dValue;
                                    }
                                }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.VALUE:
                            if (param['value'] === 'null') {
                                param['value'] = null;
                            }
                            // result[param['name']] = param.value;
                            if (param['datatype']) {
                                result[param['name']] = this.getParameters(param['datatype'],  param.value);
                            } else {
                                result[param['name']] =  param.value;
                            }
                            break;
                        case BSN_PARAMETER_TYPE.COMPONENT_VALUE:
                            if (model.componentValue) {
                                // 判断组件取值是否为null
                                if (
                                    model.componentValue[param['valueName']] ===
                                    null ||
                                    model.componentValue[param['valueName']] ===
                                    undefined
                                ) {
                                    if (param['value'] !== undefined) {
                                        if (param['datatype']) {
                                            result[param['name']] = this.getParameters(param['datatype'], param['value']);
                                        } else if (param['defaultDate']) {
                                            const dateType = param['defaultDate'];
                                            let dValue;
                                            switch (dateType) {
                                                case 'defaultWeek':
                                                dValue = `${getISOYear(Date.now())}-${getISOWeek(Date.now())}`;
                                                break;
                                                case 'defaultDay':
                                                break;
                                                case 'defaultMonth':
                                                dValue = `${getISOYear(Date.now())}-${getMonth(Date.now()) + 1 }`;
                                                break;
                                                case 'defaultYear':
                                                dValue = `${getISOYear(Date.now())}`;
                                                break;
                                            }
                                            result[param['name']] = dValue;
                                        } else {
                                            result[param['name']] = param['value'];
                                        }
                                    }
                                } else {
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'], model.componentValue[param['valueName']]);
                                    } else {
                                        result[param['name']] = model.componentValue[param['valueName']];
                                    }
                                }

                                // if (
                                //     model.componentValue[param["valueName"]] !==
                                //     undefined
                                // ) {
                                //     result[param["name"]] =
                                //         model.componentValue[
                                //             param["valueName"]
                                //         ];
                                // } else {
                                //     if (
                                //         param["value"] === null ||
                                //         param["value"] === "" ||
                                //         param["value"] === 0
                                //     ) {
                                //         result[param["name"]] = param["value"];
                                //     }
                                // }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.GUID:
                            // result[param['name']] = CommonTools.uuID(32);
                            if (param['datatype']) {
                                result[param['name']] = this.getParameters(param['datatype'],   CommonTools.uuID(32));
                            } else {
                                result[param['name']] =   CommonTools.uuID(32);
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED:
                            if (model.item) {
                               // result[param['name']] = model.item[param['valueName']];
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'],  model.item[param['valueName']]);
                                    } else {
                                        result[param['name']] =   model.item[param['valueName']];
                                    }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.SELECTED:
                            if (model.item) {
                               //  result[param['name']] = model.item[param['valueName']];
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'],  model.item[param['valueName']]);
                                    } else {
                                        result[param['name']] =  model.item[param['valueName']];
                                    }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED_ID:
                            if (model.item) {
                                // result[param['name']] = model.item;
                                if (param['datatype']) {
                                    result[param['name']] = this.getParameters(param['datatype'],  model.item);
                                } else {
                                    result[param['name']] =  model.item;
                                }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED_ROW: // 后续替换为 CHECKED
                            if (model.item) {
                             //   result[param['name']] = model.item[param['valueName']];
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'], model.item[param['valueName']]);
                                    } else {
                                        result[param['name']] = model.item[param['valueName']];
                                    }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.SELECTED_ROW: // 后续替换 SELECTED
                            if (model.item) {
                                result[param['name']] =
                                    model.item[param['valueName']];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.INIT_VALUE:
                            if (model.initValue) {
                                if (
                                    model.initValue[param['valueName']] ===
                                    null ||
                                    model.initValue[param['valueName']] ===
                                    undefined
                                ) {
                                    if (param['value'] !== undefined) {
                                        if (param['datatype']) {
                                            result[param['name']] = this.getParameters(param['datatype'], model.initValue['value']);
                                        } else if (param['defaultDate']) {
                                            const dateType = param['defaultDate'];
                                            let dValue;
                                            switch (dateType) {
                                                case 'defaultWeek':
                                                dValue = `${getISOYear(Date.now())}-${getISOWeek(Date.now())}`;
                                                break;
                                                case 'defaultDay':
                                                break;
                                                case 'defaultMonth':
                                                dValue = `${getISOYear(Date.now())}-${getMonth(Date.now()) + 1 }`;
                                                break;
                                                case 'defaultYear':
                                                dValue = `${getISOYear(Date.now())}`;
                                                break;
                                            }
                                            result[param['name']] = dValue;
                                        } else {
                                            result[param['name']] = param['value'];
                                        }
                                    }
                                } else {
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'], model.initValue[param['valueName']]);
                                    } else {
                                        result[param['name']] = model.initValue[param['valueName']];
                                    }
                                }
                                    
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CACHE_VALUE:
                            if (model.cacheValue) {
                                const cache = model.cacheValue.get('userInfo');
                                // result[param['name']] = cache.value[param['valueName']];
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'], cache.value[param['valueName']]);
                                    } else {
                                        result[param['name']] = cache.value[param['valueName']];
                                    }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CASCADE_VALUE:
                            if (model.cascadeValue) {
                               // result[param['name']] = model.cascadeValue[param['valueName']];
                                    if (param['datatype']) {
                                        result[param['name']] = this.getParameters(param['datatype'], model.cascadeValue[param['valueName']]);
                                    } else {
                                        result[param['name']] = model.cascadeValue[param['valueName']];
                                    }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.RETURN_VALUE:
                            if (model.returnValue) {
                                result[param['name']] =
                                    model.returnValue[param['valueName']];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.ROUTER:
                            if (model.router) {
                                if (param['datatype']) {
                                    model.router.params.subscribe(r => {
                                        result[param['name']] = this.getParameters(param['datatype'], r['name']);
                                    })
                                    
                                }  else {
                                    model.router.params.subscribe(r => {
                                        result[param['name']] = r.name;
                                    })
                                }  
                            }
                    }
                }
            });
        }
        return result;
    }


    public static isString(obj) {
        // 判断对象是否是字符串
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    // liu 20181213  参数简析[可适配后台多条件查询]
    public static getParameters(datatype?, inputValue?) {
        let strQ;
        if (!inputValue) {
            // return strQ;
        }
        switch (datatype) {
            case 'eq': // =
                strQ = strQ + 'eq(' + inputValue + ')';
                break;
            case 'neq': // !=
                strQ = strQ + '!eq(' + inputValue + ')';
                break;
            case 'ctn': // like
                strQ = strQ + 'ctn(\'%' + inputValue + '%\')';
                break;
            case 'nctn': // not like
                strQ = strQ + '!ctn(\'%' + inputValue + '%\')';
                break;
            case 'in': // in  如果是input 是这样取值，其他则是多选取值
                strQ = strQ + 'in(' + inputValue + ')';
                break;
            case 'nin': // not in  如果是input 是这样取值，其他则是多选取值
                strQ = strQ + '!in(' + inputValue + ')';
                break;
            case 'btn': // between  
                strQ = strQ + 'btn(' + inputValue + ')';
                break;
            case 'ge': // >=  
                strQ = strQ + 'ge(' + inputValue + ')';
                break;
            case 'gt': // >  
                strQ = strQ + 'gt(' + inputValue + ')';
                break;
            case 'le': // <=  
                strQ = strQ + 'le(' + inputValue + ')';
                break;
            case 'lt': // <  
                strQ = strQ + 'lt(' + inputValue + ')';
                break;
            default:
                strQ = inputValue;
                break;
        }

        if (!inputValue) {
            strQ = null;
        }
        console.log('liu查询参数：', strQ);
        return strQ;
    }

    public static getNowFormatDate(type,seperator1, seperator2) {
        const date = new Date();
        seperator1 = seperator1 ? seperator1 : '';
        seperator2 = seperator2 ? seperator2 : '';
        const month = getNewDate(date.getMonth() + 1);
        const day = getNewDate(date.getDate());
        const hours = getNewDate(date.getHours());
        const minutes = getNewDate(date.getMinutes());
        const seconds = getNewDate(date.getSeconds());
        // 统一格式为两位数
        function getNewDate(d: any) {
            if (d <= 9) {
                d = '0' + d;
            }
            return d;
        }

        let currentDate;
        switch(type) {
            case 'year':
                currentDate = date.getFullYear();
            break;
            case 'month':
            currentDate = date.getFullYear() + seperator1 + month;
            break;
            case 'day':
            currentDate = date.getFullYear() + seperator1 + month + seperator1 + day;
            break;
            case 'hh':
            currentDate = date.getFullYear() + seperator1 + month + seperator1 + day
                + ' ' + hours;
            break;
            case 'mm':
            currentDate = date.getFullYear() + seperator1 + month + seperator1 + day
                + ' ' + hours + seperator2 + minutes;
            break;
            case 'ss':
            currentDate = date.getFullYear() + seperator1 + month + seperator1 + day
                + ' ' + hours + seperator2 + minutes + seperator2 + seconds;
            break;
        }

        
        return currentDate;
    }

    

}

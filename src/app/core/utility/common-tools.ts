import { BSN_PARAMETER_TYPE } from "@core/relative-Service/BsnTableStatus";
export interface ParametersResolverModel {
    params;
    tempValue?;
    item?;
    componentValue?;
    initValue?;
    cacheValue?;
    cascadeValue?;
}
export class CommonTools {
    public static uuID(w) {
        let s = "";
        const str =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
                const paramType = param["type"];
                if (paramType) {
                    switch (paramType) {
                        case BSN_PARAMETER_TYPE.TEMP_VALUE:
                            if (
                                model.tempValue &&
                                model.tempValue[param["valueName"]]
                            ) {
                                result[param["name"]] =
                                    model.tempValue[param["valueName"]];
                            } else {
                                if (
                                    param["value"] === null ||
                                    param["value"] === "" ||
                                    param["value"] === 0
                                ) {
                                    result[param["name"]] = param.value;
                                }
                            }
                            break;
                        case BSN_PARAMETER_TYPE.VALUE:
                            if (param["value"] === "null") {
                                param["value"] = null;
                            }
                            result[param["name"]] = param.value;
                            break;
                        case BSN_PARAMETER_TYPE.COMPONENT_VALUE:
                            if (model.componentValue) {
                                // 判断组件取值是否为null
                                if (
                                    model.componentValue[param["valueName"]] ===
                                        null ||
                                    model.componentValue[param["valueName"]] ===
                                        undefined
                                ) {
                                    if (param["value"] !== undefined) {
                                        result[param["name"]] = param["value"];
                                    }
                                } else {
                                    result[param["name"]] =
                                        model.componentValue[
                                            param["valueName"]
                                        ];
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
                            result[param["name"]] = CommonTools.uuID(32);
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED:
                            if (model.item) {
                                result[param["name"]] =
                                    model.item[param["valueName"]];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.SELECTED:
                            if (model.item) {
                                result[param["name"]] =
                                    model.item[param["valueName"]];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED_ID:
                            if (model.item) {
                                result[param["name"]] = model.item;
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CHECKED_ROW: // 后续替换为 CHECKED
                            if (model.item) {
                                result[param["name"]] =
                                    model.item[param["valueName"]];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.SELECTED_ROW: // 后续替换 SELECTED
                            if (model.item) {
                                result[param["name"]] =
                                    model.item[param["valueName"]];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.INIT_VALUE:
                            if (model.initValue) {
                                result[param["name"]] =
                                    model.initValue[param["valueName"]];
                            }
                            break;
                        case BSN_PARAMETER_TYPE.CACHE_VALUE:
                            if (model.cacheValue) {
                                const cache = model.cacheValue.get("userInfo");
                                result[param["name"]] =
                                    cache.value[param["valueName"]];
                            }
                            break;
                    }
                }
            });
        }
        return result;
    }
}

import {BSN_PARAMETER_TYPE} from '@core/relative-Service/BsnTableStatus';
export class CommonTools {
  public static uuID(w) {
    let s = '';
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < w; i++) {
      s += str.charAt(Math.round(Math.random() * (str.length - 1)));
    }
    return s;
  }

  public static parametersResolver (params, tempValue?, item?, componentValue?) {
      const result = {};
      if (Array.isArray(params)) {
          params.forEach(param => {
              const paramType = param['type'];
              if (paramType) {
                  switch (paramType) {
                      case BSN_PARAMETER_TYPE.TEMP_VALUE:
                          if (tempValue && tempValue[param['valueName']]) {
                              result[param['name']] = tempValue[param['valueName']];
                          }
                          break;
                      case BSN_PARAMETER_TYPE.VALUE:
                          if (param['value'] === 'null') {
                              param['value'] = null;
                          }
                          result[param['name']] = param.value;
                          break;
                      case BSN_PARAMETER_TYPE.COMPONENT_VALUE:
                          if (componentValue) {
                              result[param['name']] = componentValue[param['valueName']];
                          }
                          break;
                      case BSN_PARAMETER_TYPE.GUID:
                          result[param['name']] = CommonTools.uuID(32);
                          break;
                      case BSN_PARAMETER_TYPE.CHECKED:
                          if (item) {
                              result[param['name']] = item[param['valueName']];
                          }
                          break;
                      case BSN_PARAMETER_TYPE.SELECTED:
                          if (item) {
                              result[param['name']] = item[param['valueName']];
                          }
                          break;
                      case BSN_PARAMETER_TYPE.CHECKED_ID:
                          if(item) {
                              result[param['name']] = item;
                          }
                          break;
                      case BSN_PARAMETER_TYPE.CHECKED_ROW: // 后续替换为 CHECKED
                          if (item) {
                              result[param['name']] = item[param['valueName']];
                          }
                          break;
                      case BSN_PARAMETER_TYPE.SELECTED_ROW: // 后续替换 SELECTED
                          if (item) {
                              result[param['name']] = item[param['valueName']];
                          }
                          break;
                  }
              }
          });
      }
      return result;
  }
}

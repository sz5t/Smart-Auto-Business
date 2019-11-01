export class SystemResourceConfig {
    public static SysRconfig = require('../../../assets/webConfig.js');
}

export const SystemResource_1 = {
    // 实施本地
    'url_localhost_8083': {
        localResourceUrl: 'localhost:8083',
        /** 后台服务 */
        settingSystemServer: 'localhost:8081',
        /** 后台服务 */
        appSystemServer: 'localhost:8081',
        /**报表  */
        reportServerUrl: 'localhost:8088'
      },
    // 研发本地
    'url_localhost_4200': {
        localResourceUrl: 'localhost:4200',
        /** 后台服务 */
        settingSystemServer: '192.168.1.111:8081',
        /** 后台服务 */
        appSystemServer: '192.168.1.111:8081',
        /**报表  */
        reportServerUrl: '192.168.1.111:8088'
      },
      'url_192_168_1_111_8083': {
        localResourceUrl: '192.168.1.111:8083',
        /** 后台服务 */
        settingSystemServer: '192.168.1.111:8081',
        /** 后台服务 */
        appSystemServer: '192.168.1.111:8081',
        /**报表  */
        reportServerUrl: '192.168.1.111:8088'
      },
      'url_192_168_1_200_8081': {
        localResourceUrl: '192.168.1.200:8081',
        /** 后台服务 */
        settingSystemServer: '192.168.1.200:8072',
        /** 后台服务 */
        appSystemServer: '192.168.1.200:8072',
        /**报表  */
        reportServerUrl: '192.168.1.200:8088'
      },
      'url_10_10_63_249_8081': {
        localResourceUrl: '10.10.63.249:8081',
        /** 后台服务 */
        settingSystemServer: '10.10.63.249:8072',
        /** 后台服务 */
        appSystemServer: '10.10.63.249:8072',
        /**报表  */
        reportServerUrl: '10.10.63.249:8088'
      },
      'url_10_129_7_4_8083': {
        localResourceUrl: '10.129.7.4:8083',
        /** 后台服务 */
        settingSystemServer: '10.129.7.4:8081',
        /** 后台服务 */
        appSystemServer: '10.129.7.4:8081',
        /**报表  */
        reportServerUrl: '10.129.7.4:8088'
      },
}

export class SystemResource {
    public static settingSystem = {
        name: 'setting',
        // Server: 'http://127.0.0.1:8081/api.cfg/'
       // Server: 'http://192.168.1.111:8081/api.cfg/'
        // 'Server': 'http://192.168.1.252:8081/api.cfg/'
        Server : SystemResourceConfig.SysRconfig.settingSystemServer
    };

    public static appSystem = {
        name: 'app',
        // Server: 'http://127.0.0.1:8081/api.cfg/'
       // Server: 'http://192.168.1.111:8081/api.cfg/'
        // 'Server': 'http://192.168.1.252:8081/api.cfg/'
        Server: SystemResourceConfig.SysRconfig.appSystemServer
    };

    public static localResource = {
           // url: "http://192.168.1.111:8083"
        //  url: 'http://localhost:4200'
        url: SystemResourceConfig.SysRconfig.localResourceUrl
    };

    public static localResourceConfigJson = {
        url: 'files/moduleConfig/',
        reportTemplate: 'files/reportTemplate/'
    }


    public static reportServer = {
        // url: 'http://192.168.1.111:8081/api.cfg/files/reportTemplate/',
        // url: 'http://127.0.0.1:8081/api.cfg/files/reportTemplate/',
       // url: 'http://192.168.1.111:8088/ReportServer.ashx'
        url: SystemResourceConfig.SysRconfig.reportServerUrl
    }
}

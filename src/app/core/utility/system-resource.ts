export class SystemResource {
    public static settingSystem = {
        name: 'setting',
        // Server: 'http://127.0.0.1:8081/api.cfg/'
        Server: 'http://192.168.1.111:8081/api.cfg/'
        // 'Server': 'http://192.168.1.252:8081/api.cfg/'
    };

    public static appSystem = {
        name: 'app',
       // Server: 'http://127.0.0.1:8081/api.cfg/'
       Server: 'http://192.168.1.111:8081/api.cfg/'
        // 'Server': 'http://192.168.1.252:8081/api.cfg/'
    };

    public static localResource = {
      // url: "http://192.168.1.111:8083"
         url: 'http://localhost:4200'
    };

    public static localResourceConfigJson = {
        url: 'files/moduleConfig/',
        reportTemplate: 'files/reportTemplate/'
    }

    public static reportServer = {
        // url: 'http://192.168.1.111:8081/api.cfg/files/reportTemplate/',
       // url: 'http://127.0.0.1:8081/api.cfg/files/reportTemplate/',
       url: 'http://localhost:2070/server/ReportServer.ashx'
    }
}

// {
//     "settingSystem": {
//         "name":"setting",
//         "ApplyId": "b9743e6da0b940beb34345fe09240c2f",
//         "ProjId": "0ac12f70c2a7a44794b57ef0c1c480c2",
//         "PlatCustomerId": "f2771e4c90db29439e3c986d9859dc74",
//         "CommonCode": "{WEB前端标识}",
//         "Server": "http://192.168.1.8:8016/f277/Res/"
//     },
//     "appSystem": {
//         "name": "app",
//         "ApplyId": "3935eb43532d435398d5189d5ece0f5d",
//         "ProjId": "002905c7bf57c54c9e5e65ec0e5fafe8",
//         "PlatCustomerId": "eb4332bbb4d01a4289457a891b6a0333",
//         "CommonCode": "{WEB应用运行平台}",
//         "Server": "http://192.168.1.8:8016/eb43/Res/",
//         "DrmId": "57e76ec4a882334c85532f3a5f561a12"
//     }
// }

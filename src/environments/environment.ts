// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// url: "http://192.168.1.111:8083"
// url: "http://localhost:4200"
export const environment = {
    SERVER_URL: 'http://localhost:4200',
    production: false,
    hmr: false,
    msgServiceUrl: 'ws://192.168.1.111:8081/api.push.message/websocket/message/push/abe76e78c469dd46a4d9252247848c6b/',
    login_url: '/passport/login', // calogin CA登陆, login 普通登陆, app APP登陆
    useHash: true,
    admin_url: '/dashboard/v1',
    homePageName: '/dashboard/v1' // dashboard/v1 系统默认，dashboard/home 自定义的首页页面 HOME_DISPLAY(json名称) app/entry APP登陆
};

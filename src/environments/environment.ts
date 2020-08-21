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
    useHash: true,
    homePageName: 'app/entry' // dashboard/v1 系统默认，dashboard/home 自定义的首页页面 HOME_DISPLAY(json名称)
};

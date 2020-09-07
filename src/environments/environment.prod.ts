export const environment = {
    SERVER_URL: ``,
    production: true,
    hmr: false,
    useHash: true,
    msgServiceUrl: 'ws://10.129.198.30:8081/api.push.message/websocket/message/push/abe76e78c469dd46a4d9252247848c6b/',
    admin_url: '/dashboard/v1',
    login_url: 'passport/calogin', // calogin CA登陆, login 普通登陆, app APP登陆
    homePageName: '/app/entry' // dashboard/v1 系统默认，dashboard/home 自定义的首页页面 HOME_DISPLAY(json名称) app/entry APP登陆
};

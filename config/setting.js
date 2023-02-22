const path = require('path');

module.exports = {
  port: 8083,
  siteDomain: 'http://localhost:8083',
  countDefault: 10,
  pageDefault: 0,
  jwtSecret: 'chemistry-server',
  apiDir: 'app/api',
  accessExp: 60 * 60, // 1h 单位秒
  // 指定工作目录，默认为 process.cwd() 路径
  baseDir: path.resolve(__dirname, '../'),
  // debug 模式
  debug: true,
  // refreshExp 设置refresh_token的过期时间，默认一个月
  refreshExp: 60 * 60 * 24 * 30,
  // 暂不启用插件
  pluginPath: {
    // // plugin name
    // poem: {
    //   // determine a plugin work or not
    //   enable: true,
    //   // path of the plugin
    //   path: "app/plugin/poem",
    //   // other config
    //   limit: 2
    // },
  },
  // 是否开启登录验证码
  loginCaptchaEnabled: false,
  sessionConfig: {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认true
    rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false //(boolean) renew session when session is nearly expired,
  }
};

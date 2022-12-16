const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koajwt = require('koa-jwt')
const session = require('koa-session');
const koaBody = require('koa-body')
const path = require('path')

const MongoConnect = require('./db')
MongoConnect()
onerror(app)


// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))
app.use(koaBody({
  enableTypes: ["json", "form", "text"],
  multipart:true, // 支持文件上传
  // encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'public/uploads/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      console.log(`name: ${name}`);
      console.log(file);
    },
  }
}),
console.log('koaBody执行了😀===>'));
app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
app.use(json())
app.use(logger())
app.use(cors())
app.use(koajwt({
  secret: 'david-server-jwt'
}).unless({
  path: [/^\/movie\/detail/,/^\/users\/login/,/^\/users\/wxLogin/, /^\/users\/register/,/^\/.*\/list/]
}))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 判断角色是否需要管理员权限中间件
app.use(async (ctx, next) => {
  // console.log('判断角色是否需要管理员权限中间件ctx结果===>',ctx)
  const url = ctx.request.url
  const reg = /(tags|role)\/(?!(list|detail)).*/
  const flag = reg.test(url)
  if (flag) {
    const {
      isAdmin
    } = require('./controller/authUtils')
    const res = await isAdmin(ctx)
    console.log('判断角色为管理员结果===>', res)
    if (res.role==='admin') {
      await next()
    } else {
      ctx.body = {
        code: 500,
        msg: '仅限管理员进行操作',
      }
    }
  } else {
    await next()
  }
})
// logger
app.use(async (ctx, next) => {
  console.log('😂ctx.body结果===>',ctx.body)
  const start = new Date()
  await next()
  const ms = new Date() - start
  const url = decodeURI(ctx.url)
  console.log(`logger=>${ctx.method} ${url} - ${ms}ms`)
})

// routes
const {routerApp} = require('./routes/index')
routerApp(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
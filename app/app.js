const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');
const session = require('koa-session');
const koaBody = require('koa-body');
const path = require('path');
const MongoConnect = require('./db');
const config = require('./utils/config');
const { logging } = require('./utils/logging');
const { httpLogger } = require('./middleware/httpLogger');

// 基础中间件
const basicMiddlewaresInit = app => {
  logging(app);
  // 自定义logger
  app.use(httpLogger);

  // app.use(session(config.getItem('sessionConfig'), app));
  app.use(json());
  app.use(cors());

  app.use(
    koaBody({
      enableTypes: ['json', 'form', 'text'],
      multipart: true, // 支持文件上传
      // encoding:'gzip',
      formidable: {
        uploadDir: path.join(__dirname, 'public/uploads/'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => {
          // 文件上传前的设置
          console.log(`name: ${name}`);
          console.log(file);
        },
      },
    }),
    console.log('koaBody执行了😀===>'),
  );
  app.use(
    koajwt({
      secret: config.getItem('jwtSecret'),
    }).unless({
      path: [
        // /^\/movie\/detail/,
        /\/admin\/login/,
        // /^\/users\/wxLogin/,
        /\/admin\/register/,
        // /^\/.*\/list/
      ],
    }),
  );

  app.use(
    views(path.join(__dirname, '/views'), {
      extension: 'pug',
    }),
  );

  // 统一处理httpException
  app.use((ctx, next) => {
    return next().catch(error => {
      ctx.status = error.status || 500;
      ctx.body = {
        code: error.code,
        msg: error.message,
      };
    });
  });

  // routes
  const routerApp = require('./routes/index');
  routerApp(app);

  // error-handling
  app.on('error', (err, ctx) => {
    console.error('server error', err);
  });
};

// 静态文件配置
const staticPublicInit = app => {
  app.use(require('koa-static')(path.join(__dirname, '/public')));
};

const createApp = async () => {
  const app = new Koa();
  MongoConnect();
  basicMiddlewaresInit(app);
  staticPublicInit(app);
  return app;
};

module.exports = { createApp };

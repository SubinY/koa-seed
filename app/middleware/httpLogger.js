import { HttpException, NotFound, MethodNotAllowed } from '../utils/exception/http-exception';
const config = require('../utils/config');
const levels = require('egg-logger/lib/level');

/* TODO: 分离logger方法 */
/**
 * 全局日志记录，且判断状态码，发出相应的异常
 * @description 目前使用该中间件前需要先把logger方法挂载到ctx上
 */
export const httpLogger = async (ctx, next) => {
  const start = Date.now();
  try {
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    const requestLog = config.getItem('log.requestLog', true);
    const level = config.getItem('log.level', 'INFO');
    if (requestLog) {
      if (levels[level] <= levels['DEBUG']) {
        const data = {
          param: ctx.request.query,
          body: ctx.request['body'],
        };
        ctx.app.logger.debug(
          `[${ctx.method}] -> [${ctx.status}][${ctx.url}] from: ${ctx.ip} costs: ${ms}ms data:${JSON.stringify(
            data,
            null,
            4,
          )}`,
        );
      } else {
        ctx.app.logger.info(`[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} costs: ${ms}ms`);
      }
    }
    if (ctx.status < 200 || ctx.status >= 300) {
      let error = new HttpException({ message: ctx.message });
      if (ctx.status === 404) {
        ctx.app.emit('error', (error = new NotFound()), ctx);
      } else if (ctx.status === 405) {
        ctx.app.emit('error', (error = new MethodNotAllowed()), ctx);
      } else {
        ctx.app.emit('error', error, ctx);
      }
      ctx.app.logger.error(
        `[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} errmsg: ${error.message} errcode: ${
          error.code
        } costs: ${ms}ms`,
      );
    }
  } catch (err) {
    const ms = Date.now() - start;
    const requestLog = config.getItem('log.requestLog', true);
    const level = config.getItem('log.level', 'INFO');
    const error = new HttpException({ message: ctx.message });
    if (requestLog) {
      if (levels[level] <= levels['DEBUG']) {
        const data = {
          param: ctx.request.query,
          body: ctx.request['body'],
        };
        ctx.app.logger.debug(
          `[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} costs: ${ms}ms data:${JSON.stringify(data, null, 4)}`,
        );
      } else {
        ctx.app.logger.info(`[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} costs: ${ms}ms`);
      }
    }
    ctx.status = ctx.status || 500;
    ctx.app.emit('error', error, ctx);
    ctx.app.logger.error(
      `[${ctx.method}] -> [${ctx.url}] from: ${ctx.ip} errmsg: ${err.message} errcode: ${err.code} costs: ${ms}ms`,
    );
  }
};

const assert = require('assert');
const { isInteger, isFunction } = require('lodash');
const config = require('../config');

const CodeMessage = config.getItem('codeMessage', {});

if (CodeMessage && !isFunction(CodeMessage.getMessage)) {
  throw new Error('CodeMessage.getMessage() must be implemented');
}

/**
 * HttpException 是lin中所有其他异常的基类
 *
 * ```js
 * // 实例化一个默认的HttpException
 * const ex = new HttpException();
 *
 * // 实例化一个带参的HttpException
 * // 如果只传 code 会通过 CodeMessage.getMessage(code) 方法获取 message
 * const ex = new HttpException({ code: 10010 });
 *
 * // 也可以是其他参数
 * const ex = new HttpException({ message: CodeMessage.getMessage(10010) });
 *
 * // 也可以指定所有参数
 * const ex = new HttpException({ code: 10010, message: CodeMessage.getMessage(10010) });
 *
 * // 也可以只穿一个 code 作为参数
 * // 如果只传 code 会通过 CodeMessage.getMessage(code) 方法获取 message
 * const ex = new HttpException(10010)
 * ```
 */
class HttpException extends Error {
  /**
   * 构造函数
   * @param ex 可选参数，通过{}的形式传入 / 也可以直接传 code
   */
  constructor(ex) {
    super();
    this.exceptionHandler(ex);

    /**
     * http 状态码
     */
    this.status = 500;

    /**
     * 返回的信息内容
     */
    this.message = CodeMessage.getMessage(9999);

    /**
     * 特定的错误码
     */
    this.code = 9999;

    this.fields = ['message', 'code'];
  }

  exceptionHandler(ex) {
    // 可以直接传一个 code
    if (isInteger(ex)) {
      this.code = ex;
      this.message = CodeMessage.getMessage(ex);
      return;
    }

    if (ex && ex.code) {
      assert(isInteger(ex.code));
      const code = ex.code;
      this.code = code;
      this.message = CodeMessage.getMessage(code);
    }
    if (ex && ex.message) {
      this.message = ex.message;
    }
  }
}
/**
 * 成功
 */
class Success extends HttpException {
  constructor(ex) {
    super();

    this.status = 200;
    this.message = CodeMessage.getMessage(0);
    this.code = 0;
    this.exceptionHandler(ex);
  }
}
/**
 * 失败
 */
class Failed extends HttpException {
  constructor(ex) {
    super();
    this.exceptionHandler(ex);

    this.status = 400;
    this.message = CodeMessage.getMessage(9999);
    this.code = 9999;
  }
}

/**
 * 认证失败
 */
class AuthFailed extends HttpException {
  constructor(ex) {
    super();
    this.status = 401;
    this.message = CodeMessage.getMessage(10000);
    this.code = 10000;
    this.exceptionHandler(ex);
  }
}

/**
 * 资源不存在
 */
class NotFound extends HttpException {
  constructor(ex) {
    super();
    this.status = 404;
    this.message = CodeMessage.getMessage(10020);
    this.code = 10020;
    this.exceptionHandler(ex);
  }
}

/**
 * 参数错误
 */
class ParametersException extends HttpException {
  constructor(ex) {
    super();
    this.status = 400;
    this.message = CodeMessage.getMessage(10030);
    this.code = 10030;
    this.exceptionHandler(ex);
  }
}

/**
 * 令牌失效或损坏
 */
class InvalidTokenException extends HttpException {
  constructor(ex) {
    super();
    this.status = 401;
    this.message = CodeMessage.getMessage(10040);
    this.code = 10040;
    this.exceptionHandler(ex);
  }
}

/**
 * 令牌过期
 */
class ExpiredTokenException extends HttpException {
  constructor(ex) {
    super();
    this.status = 422;
    this.message = CodeMessage.getMessage(10050);
    this.code = 10050;
    this.exceptionHandler(ex);
  }
}

/**
 * 服务器未知错误
 */
class UnknownException extends HttpException {
  constructor(ex) {
    super();
    this.status = 400;
    this.message = CodeMessage.getMessage(9999);
    this.code = 9999;
    this.exceptionHandler(ex);
  }
}

/**
 * 字段重复
 */
class RepeatException extends HttpException {
  constructor(ex) {
    super();
    this.status = 400;
    this.message = CodeMessage.getMessage(10060);
    this.code = 10060;
    this.exceptionHandler(ex);
  }
}

/**
 * 禁止操作
 */
class Forbidden extends HttpException {
  constructor(ex) {
    super();
    this.status = 403;
    this.message = CodeMessage.getMessage(10070);
    this.code = 10070;
    this.exceptionHandler(ex);
  }
}

/**
 * 请求方法不允许
 */
class MethodNotAllowed extends HttpException {
  constructor(ex) {
    super();
    this.status = 405;
    this.message = CodeMessage.getMessage(10080);
    this.code = 10080;
    this.exceptionHandler(ex);
  }
}

/**
 * refresh token 获取失败
 */
class RefreshException extends HttpException {
  constructor(ex) {
    super();
    this.status = 401;
    this.message = CodeMessage.getMessage(10100);
    this.code = 10100;
    this.exceptionHandler(ex);
  }
}

/**
 * 文件体积过大
 */
class FileTooLargeException extends HttpException {
  constructor(ex) {
    super();
    this.status = 413;
    this.message = CodeMessage.getMessage(10110);
    this.code = 10110;
    this.exceptionHandler(ex);
  }
}

/**
 * 文件数量过多
 */
class FileTooManyException extends HttpException {
  constructor(ex) {
    super();
    this.status = 413;
    this.message = CodeMessage.getMessage(10120);
    this.code = 10120;
    this.exceptionHandler(ex);
  }
}

/**
 * 文件扩展名不符合规范
 */
class FileExtensionException extends HttpException {
  constructor(ex) {
    super();
    this.status = 406;
    this.message = CodeMessage.getMessage(10130);
    this.code = 10130;
    this.exceptionHandler(ex);
  }
}

/**
 * 请求过于频繁，请稍后重试
 */
class LimitException extends HttpException {
  constructor(ex) {
    super();
    this.status = 401;
    this.message = CodeMessage.getMessage(10140);
    this.code = 10140;
    this.exceptionHandler(ex);
  }
}

module.exports = {
  HttpException,
  Success,
  Failed,
  AuthFailed,
  NotFound,
  ParametersException,
  InvalidTokenException,
  ExpiredTokenException,
  UnknownException,
  RepeatException,
  Forbidden,
  MethodNotAllowed,
  RefreshException,
  FileTooLargeException,
  FileTooManyException,
  FileExtensionException,
  LimitException
};

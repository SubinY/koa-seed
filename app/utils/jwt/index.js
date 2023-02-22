import { AuthFailed, ExpiredTokenException } from '../exception/http-exception';
import { get } from 'lodash';
import jwt from 'jsonwebtoken';
import config from '../config';

const TokenType = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

const jwtSecret = config.getItem('jwtSecret');
const refreshExp = config.getItem('refreshExp');

function createAccessToken(user) {
  const { id } = user;
  const accessToken = jwt.sign(
    {
      id
    },
    jwtSecret,
    {
      expiresIn: refreshExp
    }
  );
  return {
    accessToken
  };
}

/**
 * 解析请求头
 * @param ctx koa 的context
 * @param type 令牌的类型
 */
function parseHeader(ctx, type = TokenType.ACCESS) {
  // 此处借鉴了koa-jwt
  if (!ctx.header || !ctx.header.authorization) {
    ctx.throw(new AuthFailed({ code: 10013 }));
  }
  const parts = ctx.header.authorization.split(' ');

  if (parts.length === 2) {
    // Bearer 字段
    const scheme = parts[0];
    // token 字段
    const token = parts[1];
    try {
      if (/^Bearer$/i.test(scheme)) {
        // @ts-ignore
        const decode = jwt.verify(token, jwtSecret);
        return decode;
      }
    } catch (error) {
      throw new ExpiredTokenException({
        code: 10051
      });
    }
  } else {
    ctx.throw(new AuthFailed());
  }
}

export { parseHeader, createAccessToken };

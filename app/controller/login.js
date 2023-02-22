const crud = require('../utils/crudUtil');
const { AdminModel } = require('../models/admin');
const {
  Forbidden,
  AuthFailed
} = require('./../utils/exception/http-exception');
const { createAccessToken } = require('./../utils/jwt');
const config = require('./../utils/config');
const { LoginValidator } = require('../service/validator/user');
const md5 = require('md5-node');

class LoginDAO {
  async login(ctx, next) {
    // if (config.getItem('loginCaptchaEnabled', false)) {
    //   const tag = ctx.req.headers.tag;
    //   const captcha = v.get('body.captcha');

    //   if (!verifyCaptcha(captcha, tag)) {
    //     throw new Forbidden({
    //       code: 10260
    //     });
    //   }
    // }
    const v = await new LoginValidator().validate(ctx);
    const user = await AdminModel.findOne({
      user_name: v.get('body.username', false),
      password: md5(v.get('body.password', false))
    });
    if (user) {
      const { accessToken } = await createAccessToken(user);
      ctx.body = {
        code: 200,
        data: { accessToken, userId: user.user_id }
      };
    } else {
      throw new AuthFailed({ code: 10031 });
    }
  }

  logout(ctx, next) {}
}

module.exports = {
  LoginDAO
};

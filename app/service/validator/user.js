const { LinValidator, Rule } = require('../../utils/validator');
const config = require('../../utils/config');

class LoginValidator extends LinValidator {
  constructor() {
    super();
    this.username = new Rule('isNotEmpty', '用户名不可为空');
    this.password = new Rule('isNotEmpty', '密码不可为空');

    if (config.getItem('loginCaptchaEnabled', false)) {
      this.captcha = new Rule('isNotEmpty', '验证码不能为空');
    }
  }
}

module.exports = {
  LoginValidator
};

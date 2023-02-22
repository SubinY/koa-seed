const { fromPairs } = require('lodash');

const ADMIN_TYPE = Object.freeze({
  SUPER: 1,
  ADMIN: 2,
  USER: 3
});

const GROUP_TYPE_GETTER = [
  [ADMIN_TYPE.SUPER, 'super'],
  [ADMIN_TYPE.ADMIN, 'admin'],
  [ADMIN_TYPE.USER, 'user']
];
const GROUP_TYPE_ENUM = fromPairs(GROUP_TYPE_GETTER);

module.exports = GROUP_TYPE_ENUM;

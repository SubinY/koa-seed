// const { routerAppV0 } = require('./v0');
const { routerAppV1 } = require('./v1');

module.exports = (app) => ({
  // ...routerAppV0(app),
  ...routerAppV1(app)
});

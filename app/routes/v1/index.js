const admin = require('./admin');

const routerAppV1 = (app) => {
  app.use(admin.routes(), admin.allowedMethods());
};

module.exports = {
  routerAppV1
};

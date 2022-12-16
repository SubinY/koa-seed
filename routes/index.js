const users = require('./users'),
  maps = require('./maps'),
  routers = require('./routers'),
  roles = require('./roles'),
  tags = require('./tags'),
  menus = require('./menus'),
  category = require('./category'),
  article = require('./article'),
  movie = require('./movie'),
  novel = require('./novel')


const routerApp = (app) => {
  app.use(users.routes(), users.allowedMethods())
  app.use(maps.routes(), maps.allowedMethods())
  app.use(routers.routes(), maps.allowedMethods())
  app.use(roles.routes(), maps.allowedMethods())
  app.use(tags.routes(), maps.allowedMethods())
  app.use(menus.routes(), maps.allowedMethods())
  app.use(category.routes(), maps.allowedMethods())
  app.use(article.routes(), maps.allowedMethods())
  app.use(movie.routes(), maps.allowedMethods())
  app.use(novel.routes(), maps.allowedMethods())
}

module.exports = {
  routerApp
}
const router = require('koa-router')()
const {
  menuAdd,
  list
} = require('../controller/menu')

router.prefix('/system/menu')

// // 添加用户
router.post('/add', menuAdd)
// // 修改用户
// router.post('/update', mapUpdate)
// // 删除用户
// router.post('/delete', mapDelete)
// // 查询用户
// router.get('/detail', mapDetail)
// 查询所有用户
router.get('/list', list)
// 删除没用的字段
// router.post('/remove',mapRemoveItem)

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
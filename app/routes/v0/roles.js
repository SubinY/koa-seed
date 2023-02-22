const router = require('koa-router')()
const {
  roleAdd,
  roleList
} = require('../../controller/roles')

router.prefix('/roles')

// // 用户认证
// router.get('/verify', userVerify)
// // 用户登录
// router.post('/login', userLogin)
// // 用户注册
// router.post('/register', userReg)
// 添加用户
router.post('/add', roleAdd)
// // 修改用户
// router.post('/update', userUpdate)
// // 删除用户
// router.post('/delete', userDelete)
// // 查询用户
// router.get('/detail', userDetail)
// 查询所有用户
router.get('/list', roleList)
// handleBatch()

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
const router = require('koa-router')()
const {
  mapAdd,
  mapUpdate,
  mapDelete,
  mapDetail,
  mapList,
  mapRemoveItem
} = require('../controller/maps')

router.prefix('/maps')

// 添加用户
router.post('/add', mapAdd)
// 修改用户
router.post('/update', mapUpdate)
// 删除用户
router.post('/delete', mapDelete)
// 查询用户
router.get('/detail', mapDetail)
// 查询所有用户
router.get('/list', mapList)
// 删除没用的字段
router.post('/remove',mapRemoveItem)

module.exports = router
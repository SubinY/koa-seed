const router = require('koa-router')()
const {
  add,
  list,
  detail,
  del
} = require('../../controller/novel')


router.prefix('/novel')

// 添加小说
router.post('/add', add)
// // 修改小说
// router.post('/update', update)
// // 删除小说
router.post('/del', del)
// // 查询小说
router.get('/detail', detail)
// 查询所有小说
router.get('/list', list)
// // 删除没用的字段
// router.post('/remove',mapRemoveItem)
module.exports = router
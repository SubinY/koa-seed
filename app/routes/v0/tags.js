const router = require('koa-router')()
const {
  tagAdd,
  list,
  update,
  del,
  detail
} = require('../../controller/tags')

router.prefix('/tags')

// 添加标签
router.post('/add', tagAdd)
// 修改标签
router.post('/update', update)
// // 删除标签
router.post('/del', del)
// // 查询标签
router.get('/detail', detail)
// 查询所有标签
router.get('/list', list)
// // 删除没用的字段
// router.post('/remove',mapRemoveItem)
module.exports = router
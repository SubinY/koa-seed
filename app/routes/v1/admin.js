const { LinRouter, routeMetaInfo } = require('../../utils/router');
const { AdminDAO } = require('../../controller/admin');
const { LoginDAO } = require('../../controller/login');
const { adminRequired, loginRequired, groupRequired } = require('../../middleware/auth');

const adminDAO = new AdminDAO();
const loginDAO = new LoginDAO();

const router = new LinRouter({
  prefix: '/v1/admin',
  module: 'admin',
  moduleDesc: '管理员模块'
  // mountPermission: true
});

// 查看当前用户
router.linGet(
  'getAdminInfo',
  '/getAdminInfo',
  router.permission('admin_getAdminInfo', '查看当前用户'),
  groupRequired,
  adminDAO.getAdminInfo
);

// 根据id获取用户信息
router.linGet(
  'getAdminInfoById',
  '/getAdminInfoById',
  router.permission('admin_getAdminInfoById', '根据id获取用户信息'),
  groupRequired,
  adminDAO.getAdminInfoById
);

// 列表——查询所有后台用户
router.linGet(
  'getAdminList',
  '/list',
  router.permission('admin_getAdminList', '列表查询'),
  adminRequired,
  adminDAO.getAdminList
);

// 创建用户
router.linPost(
  'createUser',
  '/create',
  router.permission('admin_createUser', '创建用户'),
  adminDAO.create
);

// 删除用户
router.linDelete(
  'deleteUser',
  '/delete:id',
  router.permission('admin_deleteUser', '删除用户'),
  adminDAO.delete
);

// 更新用户
router.linPut(
  'updateUser',
  '/update',
  router.permission('admin_updateUser', '更新用户'),
  adminDAO.update
);

// 查看用户
router.linGet(
  'getDetail',
  '/detail/:id',
  router.permission('admin_getDetail', '用户详情'),
  adminDAO.detail
);

// 登录
router.linPost(
  'userLogin',
  '/login',
  loginDAO.login
);

module.exports = router;

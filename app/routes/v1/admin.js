const { LinRouter, routeMetaInfo } = require('../../utils/router');
const { AdminDAO } = require('../../controller/admin');
const { LoginDAO } = require('../../controller/login');
const { adminRequired, loginRequired } = require('../../middleware/auth');

const adminDAO = new AdminDAO();
const loginDAO = new LoginDAO();

const router = new LinRouter({
  prefix: '/v1/admin',
  module: 'admin'
  // mountPermission: true
});

// 查看当前用户
router.linGet(
  'getAdminInfo',
  '/getAdminInfo',
  router.permission('查询当前用户'),
  loginRequired,
  adminDAO.getAdminInfo
);

// 列表——查询所有后台用户
router.linGet(
  'getAdminList',
  '/list',
  router.permission('查询所有后台用户'),
  adminRequired,
  adminDAO.getAdminList
);

// 创建用户
router.linPost(
  'createUser',
  '/create',
  router.permission('创建后台用户'),
  adminDAO.create
);

// 删除用户
router.linDelete(
  'deleteUser',
  '/delete:id',
  router.permission('删除后台用户'),
  adminDAO.delete
);

// 更新用户
router.linPut(
  'updateUser',
  '/update',
  router.permission('更新后台用户'),
  adminDAO.update
);

// 查看用户
router.linGet(
  'getDetail',
  '/detail/:id',
  router.permission('查看后台用户'),
  adminDAO.detail
);

// 登录
router.linPost(
  'userLogin',
  '/login',
  router.permission('后台用户登录'),
  loginDAO.login
);

module.exports = router;

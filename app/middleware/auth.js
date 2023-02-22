const { RoleGroupModel } = require('../models/roleGroup');
const { PermissionModel } = require('../models/permission');
const { AdminModel, GROUP_TYPE_ENUM } = require('../models/admin');
const { uniq } = require('lodash');

const { NotFound, AuthFailed } = require('../utils/exception');
const { routeMetaInfo } = require('../utils/router');
const { parseHeader } = require('../utils/jwt');

// 是否超级管理员
async function isAdmin(ctx, next) {
  const { role = [] } = await AdminModel.findOne({
    id: ctx.currentUser.id
  });
  return role.includes(GROUP_TYPE_ENUM[1]);
}

/**
 * 将 user 挂在 ctx 上
 */
async function mountUser(ctx, next) {
  try {
    const identity = parseHeader(ctx);
    const { id: userId } = identity;
    const user = await AdminModel.findOne({
      id: userId
    });
    if (!user) {
      throw new NotFound({
        code: 10021
      });
    }
    // 将user挂在ctx上
    ctx.currentUser = user;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 守卫函数，非超级管理员不可访问
 */
async function adminRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx, next);

    if (await isAdmin(ctx)) {
      await next();
    } else {
      throw new AuthFailed({
        code: 10001
      });
    }
  } else {
    await next();
  }
}

/**
 * 守卫函数，用户登陆即可访问
 */
async function loginRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx, next);

    await next();
  } else {
    await next();
  }
}

/**
 * 守卫函数，用户刷新令牌，统一异常
 */
// async function refreshTokenRequiredWithUnifyException(ctx, next) {
//   if (ctx.request.method !== 'OPTIONS') {
//     try {
//       const { identity } = parseHeader(ctx, TokenType.REFRESH);
//       const user = await AdminModel.findByPk(identity);
//       if (!user) {
//         ctx.throw(
//           new HttpException.NotFound({
//             code: 10021
//           })
//         );
//       }
//       // 将user挂在ctx上
//       ctx.currentUser = user;
//     } catch (error) {
//       throw new RefreshException();
//     }
//     await next();
//   } else {
//     await next();
//   }
// }

/**
 * 守卫函数，用于权限组鉴权
 */
async function groupRequired(ctx, next) {
  if (ctx.request.method !== 'OPTIONS') {
    await mountUser(ctx, next);

    // 超级管理员
    if (await isAdmin(ctx)) {
      await next();
    } else {
      console.log(ctx, 'cccccc');
      if (ctx.matched) {
        const routeName = ctx._matchedRouteName || ctx.routerName;
        const endpoint = `${ctx.method} ${routeName}`;
        const { permission, module } = routeMetaInfo.get(endpoint);
        console.log(permission, module, 'permission, module');
        const { role_id: roleId } = ctx.currentUser;
        /* ---------------- 角色包预留位 start ---------------- */

        /* ---------------- 角色包预留位 end ---------------- */
        const role = await RoleGroupModel.find({
          where: {
            role_id: roleId
          }
        });
        const { role_permission: rolePermission } = role;
        const permissionIds = uniq(rolePermission.map((v) => v.permission_id));
        const item = await PermissionModel.findOne({
          where: {
            name: permission,
            mount: 1, // type
            module,
            id: permissionIds
          }
        });
        if (item) {
          await next();
        } else {
          throw new AuthFailed({
            code: 10001
          });
        }
      } else {
        throw new AuthFailed({
          code: 10001
        });
      }
    }
  } else {
    await next();
  }
}

module.exports = {
  adminRequired,
  loginRequired,
  groupRequired
  // refreshTokenRequiredWithUnifyException
};

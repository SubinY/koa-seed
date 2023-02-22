const Router = require('koa-router');
const assert = require('assert');
const { isBoolean, isFunction } = require('lodash');

const routeMetaInfo = new Map();
/**
 * lin-router继承自koa-router
 * 即可使用全部的koa-router api
 * 也可使用以 lin 为前缀的方法，用于视图函数的权限
 */
class LinRouter extends Router {
  constructor(linRouterOptions) {
    super(linRouterOptions);
    this.module = null;

    // 如果存在 permission，默认挂载之
    this.mountPermission = true;

    if (linRouterOptions) {
      if (linRouterOptions.module) {
        this.module = linRouterOptions.module;
      }
      if (isBoolean(linRouterOptions.mountPermission)) {
        this.mountPermission = linRouterOptions.mountPermission;
      }
    }
  }

  permission(permission, mount) {
    return {
      permission,
      module: this.module,
      mount: isBoolean(mount) ? mount : this.mountPermission
    };
  }

  linOption(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'OPTION ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.options(name, path, meta, ...middleware);
    }
    return this.options(name, path, ...middleware);
  }

  linHead(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'HEAD ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.head(name, path, meta, ...middleware);
    }
    return this.head(name, path, ...middleware);
  }

  linGet(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'GET ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.get(name, path, meta, ...middleware);
    }
    return this.get(name, path, ...middleware);
  }

  linPut(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'PUT ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.put(name, path, meta, ...middleware);
    }
    return this.put(name, path, ...middleware);
  }

  linPatch(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'PATCH ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.patch(name, path, meta, ...middleware);
    }
    return this.patch(name, path, ...middleware);
  }

  linPost(name, path, meta, ...middleware) {
    // if (meta && meta.mount) {
    //   assert(
    //     !!(meta.permission && meta.module),
    //     'permission and module must not be empty, if you want to mount'
    //   );
    //   const endpoint = 'POST ' + name;
    //   routeMetaInfo.set(endpoint, {
    //     permission: meta.permission,
    //     module: meta.module
    //   });
    // }
    // if (isFunction(meta)) {
    //   return this.post(name, path, meta, ...middleware);
    // }
    return this.post(name, path, ...middleware);
  }

  linDelete(name, path, meta, ...middleware) {
    if (meta && meta.mount) {
      assert(
        !!(meta.permission && meta.module),
        'permission and module must not be empty, if you want to mount'
      );
      const endpoint = 'DELETE ' + name;
      routeMetaInfo.set(endpoint, {
        permission: meta.permission,
        module: meta.module
      });
    }
    if (isFunction(meta)) {
      return this.delete(name, path, meta, ...middleware);
    }
    return this.delete(name, path, ...middleware);
  }
}

module.exports = {
  LinRouter,
  routeMetaInfo
};

import BaseService from './../service/baseService';
import crud from '../utils/crudUtil';
import { AdminModel } from '../models/admin';

class AdminDAO extends BaseService {
  async getAdminInfo(ctx, next) {
    ctx.body = {
      code: 200,
      msg: '操作成功',
      data: ctx.currentUser
    };
  }
  async getAdminInfoById(ctx, next) {
    try {
      await crud.detail(
        AdminModel,
        {
          id: ctx.query.id
        },
        ctx
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAdminList(ctx, next) {
    try {
      await crud.find(AdminModel, {}, ctx);
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '非管理员，无法执行操作'
      };
    }
  }
  create() {}
  delete() {}
  update() {}
  detail() {}
}

module.exports = {
  AdminDAO
};

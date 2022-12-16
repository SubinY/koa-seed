const {
    Category
} = require('../models/category')
const crud = require('./crudUtil')
const {
    isAdmin
} = require('./authUtils')

// 添加用户
const add = async (ctx) => {
    const {username} = await isAdmin(ctx)
    const {
        name
    } = ctx.request.body
    await crud.add(Category, {
        name,
        creator:username
    }, ctx)
}

const update = async (ctx) => {
    const {username} = await isAdmin(ctx)
    console.log('username结果===>',username)
    const {
        _id,
        name
    } = ctx.request.body
    await crud.update(
        Category, {
            _id
        }, {
            name: name,
            creator:username
        },
        ctx)
}

const del = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(Category, {
        _id
    }, ctx)
}

const detail = async (ctx) => {
    const {
        _id,name
    } = ctx.query
    await crud.detail(Category, {
        _id,name
    }, ctx)

}

const list = async (ctx) => {
    await crud.find(Category, null, ctx)
}

const batch = async (ctx) => {
    const {
        type
    } = ctx.request.body
    await crud.updateMany(Category, {}, {
        creator: 'admin'
    }, ctx)
}


module.exports = {
    add,
    list,
    update,
    del,
    detail
}
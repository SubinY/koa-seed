const {
    Tags
} = require('../models/tags')
const crud = require('./crudUtil')
const {
    isAdmin
} = require('./authUtils')

// 添加用户
const tagAdd = async (ctx) => {
    const {username} = await isAdmin(ctx)
    const {
        name,color
    } = ctx.request.body
    await crud.add(Tags, {
        name,color,
        creator:username
    }, ctx)
}

const update = async (ctx) => {
    const {username} = await isAdmin(ctx)
    // console.log('username结果===>',username)
    const {
        _id,
        name,color
    } = ctx.request.body
    await crud.update(
        Tags, {
            _id
        }, {
            name,
            color,
            creator:username
        },
        ctx)
}

const del = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(Tags, {
        _id
    }, ctx)
}

const detail = async (ctx) => {
    const {
        _id,name
    } = ctx.query
    // console.log('ctx.params结果===>', ctx.query)
    await crud.detail(Tags, {
        _id,name
    }, ctx)

}

const list = async (ctx) => {
    await crud.find(Tags, null, ctx)
}

const batch = async (ctx) => {
    // const {
    //     type
    // } = ctx.request.body
    await crud.updateMany(Tags, {}, {
        color: '#ffffff'
    } ,ctx)
}
// batch()

module.exports = {
    tagAdd,
    list,
    update,
    del,
    detail
}
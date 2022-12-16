const {
    Model
} = require('../models/movie')
const crud = require('./crudUtil')
const {
    isAdmin
} = require('./authUtils')

// 添加
const add = async (ctx) => {
    const {
        title,
        director,
        publishYear,
        category,
        content,
        region,
        actors,
        length
    } = ctx.request.body
    await crud.add(Model, {
        title,
        director,
        publishYear,
        category,
        content,
        region,
        actors,
        length
    }, ctx)
}

const update = async (ctx) => {
    const {
        username
    } = await isAdmin(ctx)
    console.log('username结果===>', username)
    const {
        _id,
        title,
        director,
        publishYear,
        category,
        content,
        region,
        actors,
        length
    } = ctx.request.body
    await crud.update(
        Model, {
            _id
        }, {
            title,
            director,
            publishYear,
            category,
            content,
            region,
            actors,
            length
        },
        ctx)
}

const del = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(Model, {
        _id
    }, ctx)
}

const detail = async (ctx) => {
    const {
        _id,
    } = ctx.query
    await crud.detail(Model, {
        _id
    }, ctx)
}

const list = async (ctx) => {
    const {
        _id,
        title,
        author,
        publishYear,
        category,
        tag,
        content,
        star,
        status,
        word
    } = ctx.query
    await crud.find(Model, {...ctx.query}, ctx)
}

const batch = async (ctx) => {
    const {
        type
    } = ctx.request.body
    await crud.updateMany(Model, {}, {
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
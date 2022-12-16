const {
    Maps
} = require('../models/maps')
const crud = require('./crudUtil')
// 添加用户
const mapAdd = async (ctx) => {
    const {
        name,
        location
    } = ctx.request.body
    await crud.add(Maps, {
        name,
        location
    }, ctx)
}

const mapUpdate = async (ctx) => {
    const {
        _id,
        name,
        location
    } = ctx.request.body
    await crud.update(Maps, {
        _id
    }, {
        name:name,
        location:location
    }, ctx)
}

const mapDelete = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(Maps, {
        _id
    }, ctx)
}

const mapDetail = async (ctx) => {
    const {
        _id
    } = ctx.query
    // console.log('ctx.params结果===>', ctx.query)
    await crud.detail(Maps, {
        _id
    }, ctx)

}

const mapList = async (ctx) => {
    await crud.find(Maps, null, ctx)
}

const mapRemoveItem = async (ctx) => {
    const {
        type
    } = ctx.request.body
    await crud.updateMany(Maps,{},{type}, ctx)
}

module.exports = {
    mapAdd,
    mapUpdate,
    mapDelete,
    mapDetail,
    mapList,
    mapRemoveItem 
}
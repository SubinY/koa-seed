const {
    Menu
} = require('../models/routers')
const crud = require('./crudUtil')
// 添加用户
const menuAdd = async (ctx) => {
    const params = ctx.request.body
    await crud.add(Menu, {
        ...params
    }, ctx)
}

// const mapUpdate = async (ctx) => {
//     const {
//         _id,
//         name,
//         location
//     } = ctx.request.body
//     await crud.update(Menu, {
//         _id
//     }, {
//         name:name,
//         location:location
//     }, ctx)
// }

// const mapDelete = async (ctx) => {
//     const {
//         _id
//     } = ctx.request.body
//     await crud.del(Menu, {
//         _id
//     }, ctx)
// }

// const mapDetail = async (ctx) => {
//     const {
//         _id
//     } = ctx.query
//     // console.log('ctx.params结果===>', ctx.query)
//     await crud.detail(Menu, {
//         _id
//     }, ctx)

// }

const list = async (ctx) => {
    await crud.find(Menu, null, ctx)
}

// const mapRemoveItem = async (ctx) => {
//     const {
//         type
//     } = ctx.request.body
//     await crud.updateMany(Menu,{},{type}, ctx)
// }

module.exports = {
    menuAdd,
    list
}
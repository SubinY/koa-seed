const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    alwaysShow: {
        type: Boolean
    },
    hidden: {
        type: Boolean
    },
    children: {
        type: Array,
        default: []
    },
    component: {
        type: String,
    },
    meta: {
        type: Object,
    },
    name: {
        type: String,
    },
    path: {
        type: String,
    },
    redirect: {
        type: String,
    },
}, {
    versionKey: false
})

const MenuSchema = new mongoose.Schema({
    menuId: String,
    parentId: String,
    menuName: String,
    icon: String,
    menuType: String,
    orderNum: Number,
    isFrame: String,
    isCache: String,
    visible: String,
    status: String
})

const Routers = mongoose.model('Routers', Schema, 'routers')
const Menu = mongoose.model('Menu', MenuSchema, 'menu')

module.exports = {
    Routers,
    Menu
}
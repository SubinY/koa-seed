const mongoose = require('mongoose')

// 角色权限
const Schema = new mongoose.Schema({
    role:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        default:''
    }
},{versionKey: false})

const Role = mongoose.model('Role',Schema,'roles')

module.exports = {
    Role
}
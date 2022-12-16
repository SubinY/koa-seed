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

const Auth = mongoose.model('Auth',Schema,'auth')

module.exports = {
    Auth
}
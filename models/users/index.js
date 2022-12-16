const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:String,
    password:{
        type:String,
        select:false
    },
    avatar:{
        type:String,
        default:''
    },
    sex:{
        type:String,
        default:''
    },
    desc:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    role:{
        type:String,
        default:'user'
    },
},{versionKey: false})
const User = mongoose.model('Users',UserSchema,'users')

const WxUserSchema = new mongoose.Schema({
    username:String,
    password:{
        type:String,
        select:false
    },
    avatar:{
        type:String,
        default:''
    },
    openid:{
        type:String,
        default:''
    },
    session_key:{
        type:String,
        default:''
    },
    sex:{
        type:String,
        default:''
    },
    desc:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    role:{
        type:String,
        default:'user'
    },
},{versionKey: false})
const WxUser = mongoose.model('WxUsers',WxUserSchema,'wxUsers')

module.exports = {
    User,
    WxUser
}
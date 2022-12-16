const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:String,
    color:{
        type:String,
        default:'#ffffff'
    },
    creator:String
},{versionKey: false})
const Tags = mongoose.model('Tags',Schema,'tags')

module.exports = {
    Tags
}
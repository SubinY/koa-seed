const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:String,
    creator:String
},{versionKey: false})
const Category = mongoose.model('Category',Schema,'category')

module.exports = {
    Category
}
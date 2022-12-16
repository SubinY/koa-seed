const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:String,
    catalog:Array,
    content:Array
},{versionKey: false})
const Novel = mongoose.model('Novels',Schema,'novels')

module.exports = {
    Novel
}
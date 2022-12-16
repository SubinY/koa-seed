const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:String,
    content:Array
},{versionKey: false})
const Upload = mongoose.model('Uploads',Schema,'uploads')

module.exports = {
    Upload
}
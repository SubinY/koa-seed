const mongoose = require('mongoose')

const MapSchema = new mongoose.Schema({
    name:String,
    location:Array,
    type:String
},{versionKey: false})
const Maps = mongoose.model('Maps',MapSchema,'maps')

module.exports = {
    Maps
}
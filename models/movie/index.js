const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    title: { //电影标题
        type: String,
        required: true
    },
    director: String, // 电影导演
    publishYear: String, //电影上映日期
    category: Array, //电影分类
    content: String, //电影内容
    region: String, //制片国家/地区
    actors:String, //电影演员
    length: Number //电影片长
}, {
    versionKey: false
})
const Model = mongoose.model('Movie', Schema, 'movie')

module.exports = {
    Model
}
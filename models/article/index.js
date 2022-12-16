const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    title: { //小说标题
        type: String,
        required: true
    },
    author: String, // 小说作者
    publishYear: String, //小说上线年份
    category: Array, //小说分类
    tag: Array, //小说标签
    content: String, //小说内容
    star: {
        type: Number,
        min: 0,
        max: 10
    }, //小说评分
    status: { //小说状态
        type: String,
        enum: ['连载中', '已完结', '已太监']
    },
    word: Number //小说字数
}, {
    versionKey: false
})
const Model = mongoose.model('Article', Schema, 'article')

module.exports = {
    Model
}
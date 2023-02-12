const mongoose = require('mongoose')
const config  = require('./config')
module.exports = () => {
    const url = process.env.NODE_ENV === 'development' ?  config.dev :config.prod
    console.log('url--->',url)
    mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('数据库连接成功',url)
        })
        .catch((err) => {
            console.error('数据库连接失败===>', err)
        })
}
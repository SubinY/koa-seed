const mongoose = require('mongoose')
const config  = require('./config')
module.exports = () => {
    const url = process.env.NODE_ENV === 'development' ?  config.prod :'mongodb://user:davidpassword@localhost:27017/harem' 
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
const {
    User,
    Auth
} = require('../models/users')
const crud = require('./crudUtil')

const jwt = require('jsonwebtoken')

// 用户验证
const userVerify = async ctx => {
    let token = ctx.header.authorization
    token = token.replace('Bearer ', '') // 注意,Bearer后面有个空格
    try {
        // console.log('token结果===>',token)
        const result = jwt.verify(token, 'david-server-jwt')
        // console.log('result结果===>',result)
        return await User.findOne({
            _id: result._id
        }).then(res => {
            if (res) {
                ctx.body = {
                    code: 200,
                    msg: '用户认证成功',
                    data: res
                }
                return res
            } else {
                ctx.body = {
                    code: 500,
                    msg: '用户认证失败',
                }
            }
        }).catch(err => {
            ctx.body = {
                code: 501,
                msg: '用户认证异常',
            }
        })

    } catch (error) {
        ctx.body = {
            code: 502,
            msg: '用户认证异常'
        }
    }
}

// 添加用户
const authAdd = async (ctx) => {
    const {
        name,
        age,
        status
    } = ctx.request.body
    await crud.add(Auth, {
        name,
        age,
        status
    }, ctx)
}

const userUpdate = async (ctx) => {
    const {
        username,
        password
    } = ctx.request.body
    await crud.update(Auth, {
        username
    }, {
        password
    }, ctx)
}

const userDelete = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(Auth, {
        _id
    }, ctx)
}

const userDetail = async (ctx) => {
    const {
        _id
    } = ctx.query
    // console.log('ctx.params结果===>', ctx.query)
    await crud.detail(Auth, {
        _id
    }, ctx)

}

const userList = async (ctx) => {
    
    // 判断用户名是否为管理员
    const res = await userVerify(ctx)
    console.log('userVerify()结果===>', res)
    if (res && res.role === 'admin') {
        await crud.find(Auth, null, ctx)
    } else {
        ctx.body = {
            code: 500,
            msg: '非管理员，无法执行操作'
        }
        return
    }
}


module.exports = {
    userAdd,
    userUpdate,
    userDelete,
    userDetail,
    userList,
    userLogin,
    userReg,
    userVerify,
    handleBatch
}
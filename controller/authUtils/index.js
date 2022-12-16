const {
    User
} = require('../../models/users')

const jwt = require('jsonwebtoken')

const isAdmin = async (ctx) => {
    // 判断用户名是否为管理员
    const res = await userVerify(ctx)
    // console.log('userVerify()结果===>', res)
    return {
        role:res.role,
        username:res.username
    }
}
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
                // ctx.body = {
                //     code: 200,
                //     msg: '用户认证成功',
                //     data: res
                // }
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
// 微信用户数据获取
const wxUserData = async (ctx) => {
    // 判断用户名是否为管理员
    const res = await wxUserVerify(ctx)
    // console.log('userVerify()结果===>', res)
    return {
        // role:res.role,
        // username:res.username
        ...res
    }
}
// 微信用户验证
const wxUserVerify = async ctx => {
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
                // ctx.body = {
                //     code: 200,
                //     msg: '用户认证成功',
                //     data: res
                // }
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
module.exports = {
    isAdmin,
    wxUserData
}
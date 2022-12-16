const {
    User,
    WxUser
} = require('../models/users')
const crud = require('./crudUtil')
const jwt = require('jsonwebtoken')
const qs = require('qs')
const {appid,secret} = require('./wxSecret')

const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
// 批量添加角色
const handleBatch = async (ctx) => {
    User.updateMany({}, {
            $rename: {
                "password": "password"
            }
        })
        .then(res => {
            console.log('handleBatch结果===>', res)
            if (res) {
                // ctx.body = {
                //     code: 200,
                //     msg: '操作成功',
                // }
            } else {
                // ctx.body = {
                //     code: 500,
                //     msg: '操作失败',
                // }
            }
        }).catch(err => {
            console.log('catch handleBatch结果===>', res)

            // ctx.body = {
            //     code: 501,
            //     msg: '操作异常',
            // }
        })
}

// 用户登录
const userLogin = async (ctx) => {
    const {
        username,
        password
    } = ctx.request.body
    const userList = await User.find()
    console.log('userList结果===>', userList)
    await User.findOne({
        username,
        password
    }).then(res => {
        if (res) {
            // console.log('用户已存在', res)
            // 执行登录
            const token = jwt.sign({
                username: res.username,
                role: res.role,
                _id: res._id
            }, 'david-server-jwt', {
                expiresIn: 3600 * 24 * 7
            })
            ctx.body = {
                code: 200,
                msg: '登录成功',
                token
            }
        } else {
            console.log('找不到用户')
            ctx.body = {
                code: 500,
                msg: '用户名或密码错误',
            }
        }
    }).catch(err => {
        console.log('登录异常===>', err)
        ctx.body = {
            code: 501,
            msg: '登录异常',
        }
    })

}


// 用户注册

const userReg = async ctx => {
    const {
        username,
        password
    } = ctx.request.body
    // 判断用户名是否已存在
    let isDouble = false
    await User.findOne({
        username
    }).then(res => {
        if (res) isDouble = true
    })
    if (isDouble) {
        ctx.body = {
            code: 500,
            msg: '用户名已注册'
        }
        return
    }
    await User.create({
        username,
        password
    }).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败'
            }
        }
    }).catch(err => {
        ctx.body = {
            code: 501,
            msg: '注册异常',
            data: err
        }
    })

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
const userAdd = async (ctx) => {
    const {
        name,
        age,
        status
    } = ctx.request.body
    await crud.add(User, {
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
    await crud.update(User, {
        username
    }, {
        password
    }, ctx)
}

const userDelete = async (ctx) => {
    const {
        _id
    } = ctx.request.body
    await crud.del(User, {
        _id
    }, ctx)
}

const userDetail = async (ctx) => {
    const {
        _id
    } = ctx.query
    // console.log('ctx.params结果===>', ctx.query)
    await crud.detail(User, {
        _id
    }, ctx)

}

const userList = async (ctx) => {

    // 判断用户名是否为管理员
    const res = await userVerify(ctx)
    // console.log('userVerify()结果===>', res)
    if (res && res.role === 'admin') {
        await crud.find(User, null, ctx)
    } else {
        ctx.body = {
            code: 500,
            msg: '非管理员，无法执行操作'
        }
        return
    }
}


const wxLogin = async (ctx) => {
    console.log('ctx.request.body结果===>', ctx.request.body)
    const {
        JSCODE
    } = ctx.request.body
    const params = qs.stringify({
        appid,
        secret,
        'js_code': JSCODE,
        'grant_type': 'authorization_code'
    })
    const url = `https://api.weixin.qq.com/sns/jscode2session?${params}`

    console.log('url结果===>', url)
    const response = await fetch(url);
    const {
        openid,
        session_key
    } = await response.json();
    // 判断用户名是否已存在
    let isDouble = false
    let userInfo = {}
    await WxUser.findOne({
        openid
    }).then(res => {
        if (res) {
            isDouble = true
            userInfo = res
            console.log('判断用户名是否已存在===>',)
        }
    })
    if (!isDouble) {
        //未注册用户执行注册
        await WxUser.create({
            openid
        }).then(res => {
            if (res) {
                console.log('未注册用户执行注册结果===>',)
                userInfo = res
                ctx.body = {
                    code: 200,
                    msg: '注册成功',
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: '注册失败'
                }
            }
        }).catch(err => {
            ctx.body = {
                code: 501,
                msg: '注册异常',
                data: err
            }
        })
    }
    // 执行登录
    const token = jwt.sign({
        openid,
        session_key,
    }, 'david-server-jwt', {
        expiresIn: 3600 * 24 * 7
    })
    const {avatar,sex,desc,phone,email,role} = userInfo
    const userInfos = {avatar,sex,desc,phone,email,role}
    // console.log('userInfo结果===>',userInfo)
    ctx.body = {
        code: 200,
        msg: '登录成功',
        data: userInfos,
        token
    }
}


// handleBatch()
module.exports = {
    userAdd,
    userUpdate,
    userDelete,
    userDetail,
    userList,
    userLogin,
    userReg,
    userVerify,
    handleBatch,
    wxLogin
}
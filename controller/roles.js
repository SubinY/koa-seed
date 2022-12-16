const {
    Role
} = require('../models/users/role.js')
const {
    User
} = require('../models/users')

const crud = require('./crudUtil')
const {
    toJSON
} = require('../app.js')

// 添加用户
const roleAdd = async (ctx) => {
    const {
        role,
        desc
    } = ctx.request.body
    await crud.add(Role, {
        role,
        desc
    }, ctx)
}

const roleUpdate = async (ctx) => {
    const {
        role,
        desc
    } = ctx.request.body
    await crud.update(Role, {
        username
    }, {
        password
    }, ctx)
}

const roleDelete = async (ctx) => {
    const {
        role,
        desc
    } = ctx.request.body
    await crud.del(Role, {
        _id
    }, ctx)
}

const roleDetail = async (ctx) => {
    const {
        role,
        desc
    } = ctx.request.body
    // console.log('ctx.params结果===>', ctx.query)
    await crud.detail(Role, {
        _id
    }, ctx)

}

const roleList = async (ctx) => {
    // console.log('roleListctx结果===>',ctx)
    await crud.find(Role, null, ctx)
}

const roleAggregate = async ctx => {
    await User.aggregate([{
        $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: 'role',
            as: 'info'
        }

    }, {
        $project: {
            _id: 0,
            // email:'$username',
            // username: {
            //     prefix: { $substr: [ "$username", 0, 1 ] },
            //  },
            password: 0,
            sex: 0,
            avatar: 0,
            phone: 0,
            info: {
                _id: 0
             },
            //  sub:{
            //      nickname:'$username'
            //  }
        }
    },
    {
        $addFields:{
            nickname:'$username,',
            infoObj:'$info'
        }
    }


]).then(res => {
        console.log('roleAggregate结果===>', JSON.stringify(res))
    })
}
// roleAggregate()
module.exports = {
    roleAdd,
    roleList
}
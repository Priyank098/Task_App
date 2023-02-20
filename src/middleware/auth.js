const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {userRoles,adminRoles} = require("../utils/Roles")

const auth = (url, method) => {

    return (async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, 'jidjfidjidijij')
            const user = await User.findOne({ _id: decoded._id, token: token })
            if (!user)
                throw new Error("please authenticate", {
                    cause: { status: 400 }
                }) 
            if (user.role === "Admin") {
                if (adminRoles.some(admin => admin.method === method && admin.url === url )) {
                    req.user = user;
                    next()
                } else {
                    throw new Error("Access Denied!!", {
                        cause: { status: 400 }
                    });
                }
            } else if(user.role === "User"){
                if (userRoles.some(user => user.method === method && user.url === url )) {
                    req.user = user;
                    next()
                } else {
                    throw new Error("Access Denied!! user", {
                        cause: { status: 400 }
                    });
                }
            }
            else {
                throw new Error("You have no access", {
                    cause: { status: 400 }
                });
            }
        } catch (error) {
            next(error)
        }
    })
}

module.exports = auth
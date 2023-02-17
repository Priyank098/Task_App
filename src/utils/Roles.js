const adminRoles = [
    {
        url: "/api/user",
        method: "post"
    },
    {
        url: "/api/user/update/:id",
        method: "patch"
    },
    {
        url: "/api/user/delete/:id",
        method: "delete"
    }
]
const userRoles = [
    {
        url: "/api/user/get",
        method: "get"
    },
]

module.exports = {adminRoles,userRoles}
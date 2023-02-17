const express = require('express')
const auth = require("../middleware/auth")
const router = new express.Router()
const {createUser,Login,updateUser,deleteUser,getUser} = require("../controller/userController")
const upload = require("../utils/file_upload")
const url = "/api"

//login
router.post('/login',Login) 

//create user by admin
router.post('/user',auth(`${url}/user`,'post'),upload.single('file'),createUser)

//update user by admin
router.patch('/user/update/:id',auth(`${url}/user/update/:id`,'patch'),updateUser)

//delete user by admin
router.delete('/user/delete/:id',auth(`${url}/user/delete/:id`,'delete'),deleteUser)

//view profile by user
router.get('/user/get',auth(`${url}/user/get`,'get'),getUser)


module.exports = router;
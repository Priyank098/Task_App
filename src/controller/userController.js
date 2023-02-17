const user = require("../models/user")
var XLSX = require('xlsx')
const path = require("path")
const {sendWelcomeEmail} = require("../utils/sendMail")
const Login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const userFound = await user.findOne({ email });
        if (!userFound)
            throw new Error("Email not found", {
                cause: { status: 400 }
            })
        else {
            const verify = await userFound.matchPassword(password)
            if (!verify) {
                throw new Error("Passsword not match", {
                    cause: { status: 400 }
                })
            }
            userFound.generateAuthToken()
            res.status(400).json({
                success: true
            })
        }
    } catch (error) {
        next(error)

    }
}

const createUser = async (req, res, next) => {
    try {
        const directory = path.join(__dirname, '../ExcelFile/excel.xlsx')
        const workbook = XLSX.read(req.file.buffer);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        await Promise.all(xlData.map(async (data) => {
            if (!data['E Mail']) {
                throw new Error("Email should not be empty", {
                    cause: { status: 400 }
                })
            }
            const emailExists = await user.findOne({ email: data['E Mail'] });
            const phoneExists = await user.findOne({ phone: data['Phone Number'] });
            if (emailExists || phoneExists) {
                data.created = "NO"
                data.reason = "user already created"
            } else {
                const newUser = await user.create({ firstName: data["First Name"], lastName: data["Last Name"], email: data["E Mail"], phone: data["Phone Number"], password: data["password"] })
                const isEmailSent = await sendWelcomeEmail(newUser.email,newUser.firstName)
                if (isEmailSent){
                    data.created = "Yes"
                    data.reason = "Email sent"
                }else{
                    data.created = "Yes"
                    data.reason = "Email not sent"
                }
            }
        }))
        // console.log(xlData);
        const ws = XLSX.utils.json_to_sheet(xlData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Responses')
        XLSX.writeFile(wb, directory)
        return res.status(201).json({
            data: xlData
        })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['firstName', 'lastName', 'email', 'phone']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            throw new Error("invalid updates ", {
                cause: { status: 400 }
            });
        }
        const _id = req.params.id;
        //console.log(req.params.name);
        const updateUserData = await user.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        if (!updateUserData) {
            throw new Error("Data not updated ", {
                cause: { status: 400 }
            });
        } else {
            res.status(201).json({ success: true });
        }
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res,next) => {
    const _id = req.params.id;
    try {
        const deleteUserData = await user.findByIdAndDelete(_id);
        if (!deleteUserData) {
            throw new Error("Data not deleted ", {
                cause: { status: 400 }
            });
        } else {
            res.status(201).json({ success: true });
        }

    } catch (error) {
        next(error)
    }
}

const getUser = async(req,res,next) =>{
    const _id = req.user._id 
    try {
        const userData = await user.findById(_id)
        if(!userData)
        {throw new Error("Data not deleted ", {
            cause: { status: 400 }
        })}else{
            res.status(201).send(userData );
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { createUser, Login, updateUser, deleteUser,getUser }
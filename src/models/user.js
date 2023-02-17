const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        trim: true,
    },
    role: {
        type: String,
        default: 'User',
    },
    token: {
        type: String,
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "jidjfidjidijij")

    user.token = token 
    await user.save()

    return token
}
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = new mongoose.model('user', userSchema)

module.exports = User
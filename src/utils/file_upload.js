const multer = require("multer")
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(xlsx)$/)) {
            return cb(new Error('Please upload an excel file'))
        }
        cb(undefined, true)
    }
})

module.exports = upload
const Multer = require("multer");
const path = require("path")

exports.diskStorage = () => {
    return Multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../uploads"));
        },
        filename: function (req, file, cb) {
            cb(
                null,
                file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            );
        }
    });
}
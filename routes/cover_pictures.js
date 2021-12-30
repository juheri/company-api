"use strict";
const Multer  = require('multer');
const cover_pictures = require("../controllers/cover_pictures");
const multer_config = require("../config/multer");
const validate = require("../libs/validate");

module.exports = (app) => {
    app.route("/cover-pictures").post(Multer(
        { storage: multer_config.diskStorage(), fileFilter: validate.imageFilter }
        ).single("image"), cover_pictures.addCover)

    app.route("/cover-pictures").delete(cover_pictures.deleteCover)
}
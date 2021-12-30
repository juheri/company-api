"use strict";
const contents = require("../controllers/contents");
const Multer = require("multer");
const multer_config = require("../config/multer");
const validate = require("../libs/validate");

module.exports = (app) => {
    app.route("/content").post(
        Multer({ storage: multer_config.diskStorage(), fileFilter: validate.imageFilter }).single("image"),
        contents.Content
    );
    app.route("/content").put(
        Multer({ storage: multer_config.diskStorage(), fileFilter: validate.imageFilter }).single("image"),
        contents.updateContent
    );
    app.route("/content").delete(contents.deleteContent);
    app.route("/content").get(contents.getContent);
}
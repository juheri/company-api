"use strict";
const user = require("../controllers/users");
const Multer = require("multer");
const multer_config = require("../config/multer");
const validate = require("../helpers/validate");

module.exports = (app) => {
    app.route("/register").post(user.Register);
    app.route("/login").post(user.Login);
    app.route("/company/user").post(user.addUser);

    app.route("/description").put(user.Description);
    app.route("/logo").put(
        Multer({
            storage: multer_config.diskStorage(),
            fileFilter: validate.imageFilter,
        }).single("image"),
        user.Logo
    );
    app.route("/avatar").put(
        Multer({
            storage: multer_config.diskStorage(),
            fileFilter: validate.imageFilter,
        }).single("image"),
        user.Avatar
    );

    app.route("/user/destroy").delete(user.deleteUser);
};

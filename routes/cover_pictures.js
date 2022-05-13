"use strict";
const Multer = require("multer");
const cover_pictures = require("../controllers/cover_pictures");
const multer_config = require("../config/multer");
const validate = require("../helpers/validate");

module.exports = (app) => {
  app.route("/cover-pictures").post(
    Multer({
      storage: multer_config.diskStorage(),
      fileFilter: validate.imageFilter,
    }).single("image"),
    cover_pictures.addCover
  );
  app.route("/cover-pictures/destroy").delete(cover_pictures.deleteCover);
  app.route("/cover-pictures/:unique_url").get(cover_pictures.getCover);
  app.route("/cover-pictures/detail/:id").get(cover_pictures.getCoverDetail);
};

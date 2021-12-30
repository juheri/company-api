"use strict";
const index = require("../controllers/index");
module.exports = (app) => {
    app.route("/").get(index.index);
    app.route("/").post(index.index);
    app.route("/").put(index.index);
    app.route("/").delete(index.index);
}
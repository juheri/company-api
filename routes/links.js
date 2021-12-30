"use strict";
const link = require("../controllers/links")

module.exports = (app) => {
    app.route("/link").post(link.addLinks)
    app.route("/link").put(link.updateLinks)
    app.route("/link").delete(link.deleteLinks)
    app.route("/link/:company_id").get(link.getLinks)
    app.route("/detail-link/:id").get(link.getLinksDetail)
}
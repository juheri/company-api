"use strict";
const tags = require("./../controllers/tags");

module.exports = (app) => {
    app.route("/tags/:tag/url/:unique_url").get(tags.findByTag);
    app.route("/tags/destroy").delete(tags.destroy);
}
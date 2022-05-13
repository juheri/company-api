"use strict";
const companies = require("../controllers/companies");

module.exports = (app) => {
  app.route("/url/:unique_url").get(companies.getDetailCompanies);
};

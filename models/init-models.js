var DataTypes = require("sequelize").DataTypes;
var _companies = require("./companies");
var _contents = require("./contents");
var _cover_pictures = require("./cover_pictures");
var _links = require("./links");
var _product_images = require("./product_images");
var _products = require("./products");
var _tags = require("./tags");
var _users = require("./users");

function initModels(sequelize) {
  var companies = _companies(sequelize, DataTypes);
  var contents = _contents(sequelize, DataTypes);
  var cover_pictures = _cover_pictures(sequelize, DataTypes);
  var links = _links(sequelize, DataTypes);
  var product_images = _product_images(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var tags = _tags(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    companies,
    contents,
    cover_pictures,
    links,
    product_images,
    products,
    tags,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

var DataTypes = require("sequelize").DataTypes;
var _contents = require("./contents");
var _tags = require("./tags");

function initModels(sequelize) {
  var contents = _contents(sequelize, DataTypes);
  var tags = _tags(sequelize, DataTypes);


  return {
    contents,
    tags,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

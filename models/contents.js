const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const contents = sequelize.define('contents', {
    id: {
      type: DataTypes.CHAR(40),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(40),
      allowNull: false
    },
    company_id: {
      type: DataTypes.CHAR(40),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'contents',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  contents.associate = (models) => {
    contents.hasMany(models.tags, { foreignKey: "content_id"});
    contents.belongsTo(models.users, { foreignKey: "user_id"});
    contents.belongsTo(models.companies, { foreignKey: "company_id"});
  }
  return contents;
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const tags = sequelize.define('tags', {
    id: {
      type: DataTypes.CHAR(25),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    product_id: {
      type: DataTypes.CHAR(25),
      allowNull: true
    },
    content_id: {
      type: DataTypes.CHAR(25),
      allowNull: true
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'tags',
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
  tags.associate = (models) => {
    tags.belongsTo(models.products, { foreignKey: "product_id" })
    tags.belongsTo(models.contents, { foreignKey: "content_id" })
  }
  return tags;
};

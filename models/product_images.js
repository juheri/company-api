const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const product_images = sequelize.define('product_images', {
    id: {
      type: DataTypes.CHAR(40),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    product_id: {
      type: DataTypes.CHAR(40),
      allowNull: false
    },
    filename: {
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
    tableName: 'product_images',
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
  product_images.associate = (models) => {
    product_images.belongsTo(models.products, { foreignKey: "product_id"})
  }
  return product_images;
};

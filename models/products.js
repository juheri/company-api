const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const products = sequelize.define('products', {
    id: {
      type: DataTypes.CHAR(25),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    company_id: {
      type: DataTypes.CHAR(25),
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(255),
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
    tableName: 'products',
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
  products.associate = (models) => {
    products.hasMany(models.product_images, { foreignKey: "product_id"})
    products.belongsTo(models.companies, { foreignKey: "company_id"})
  }
  return products;
};

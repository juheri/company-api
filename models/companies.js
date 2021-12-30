const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const companies = sequelize.define('companies', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    unique_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('FREE','PRO','',''),
      allowNull: false,
      defaultValue: "FREE"
    },
    verification: {
      type: DataTypes.ENUM(0, 1),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'companies',
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

  companies.associate = (models) => {
    companies.hasMany(models.cover_pictures, { foreignKey: "company_id" })
    companies.hasMany(models.products, { foreignKey: "company_id" })
    companies.hasMany(models.links, { foreignKey: "company_id" })
    companies.hasMany(models.users, { foreignKey: "company_id" })
  }
  return companies
};

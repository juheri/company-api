const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const links = sequelize.define('links', {
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    link: {
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
    tableName: 'links',
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
  links.associate = (models) => {
    links.belongsTo(models.companies, { foreignKey: "company_id"})
  }
  return links;
};

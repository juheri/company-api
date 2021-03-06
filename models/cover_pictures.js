const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const cover_pictures = sequelize.define('cover_pictures', {
    id: {
      type: DataTypes.CHAR(40),
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    company_id: {
      type: DataTypes.CHAR(40),
      allowNull: false
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
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
    tableName: 'cover_pictures',
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
  cover_pictures.associate = (models) => {
    cover_pictures.belongsTo(models.companies, { foreignKey: "company_id"})
  }
  return cover_pictures;
};

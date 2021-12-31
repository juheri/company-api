const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const users = sequelize.define('users', {
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
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('OWNER','ADMIN'),
      allowNull: true
    },
    token: {
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
    tableName: 'users',
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
  users.associate = (models) => {
    users.belongsTo(models.companies, { foreignKey: "company_id"});
    users.hasMany(models.contents, { foreignKey: "user_id" })
  }
  return users;
};

const { DataTypes } = require("sequelize");
const sequelize =require('../Data/DB.js');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
  },
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true
});

module.exports = Category;
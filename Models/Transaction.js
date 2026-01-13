const { DataTypes } = require("sequelize");
const sequelize = require("../Data/DB.js");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Transaction;

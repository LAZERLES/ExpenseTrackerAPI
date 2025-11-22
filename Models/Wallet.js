const sequelize = require("../Data/DB")
const { DataTypes } = require("sequelize")

const Wallet = sequelize.define(
    "Wallet",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        balance:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00,
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
)

module.exports = Wallet;
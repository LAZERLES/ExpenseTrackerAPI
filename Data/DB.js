const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV !== "production") {
  sequelize = new Sequelize(
    'ext_db',
    'root',
    '',
    {
      host: 'localhost',
      dialect: "mysql",
      logging: true,
      timezone: "+07:00",
    }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
}

module.exports = sequelize;
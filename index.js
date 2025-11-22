const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./Data/DB.js");
const User = require("./Models/User.js");
const Wallet = require("./Models/Wallet.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Associate models
User.hasOne(Wallet, {foreignKey: 'user_id'});
Wallet.belongsTo(User, {foreignKey: 'user_id'}, {onDelete: 'CASCADE'});

// routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const LISTEN_PORT = process.env.NODE_ENV === "production" ? PORT : 3000;

// Start the server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    return sequelize.sync({ force: true });
  })
  .then(() => {
    app.listen(LISTEN_PORT, () => {
      console.log(`Server is running on http://localhost:${LISTEN_PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

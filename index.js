const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./Data/DB.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
    return sequelize.sync();
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

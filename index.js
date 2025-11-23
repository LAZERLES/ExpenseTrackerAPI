const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sequelize = require("./Data/DB.js");
const User = require("./Models/User.js");
const Transaction = require("./Models/Transaction.js");
const Category = require("./Models/Category.js");
const UserRoute = require('./Routes/User.Route.js');
const ExpenseRoute = require('./Routes/Transaction.Route.js');
const CategoryRoute = require('./Routes/Category.Route.js');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Associate models
// Transaction belongs to User
Transaction.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Transaction, { foreignKey: 'user_id' });

// Transaction belongs to Category
Transaction.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Transaction, { foreignKey: 'category_id' });


// routes
app.use("/api/users",UserRoute);
app.use("/api/expenses",ExpenseRoute);
app.use("/api/categories",CategoryRoute);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});


const LISTEN_PORT = process.env.NODE_ENV === "production" ? PORT : 3000;

// Start the server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    return sequelize.sync({ force: false });
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

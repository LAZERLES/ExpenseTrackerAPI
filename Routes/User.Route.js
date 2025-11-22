const express = require("express");
const { createUser, loginUser } = require("../Controllers/User.Controller.js");

const Router = express.Router();

Router.post("/register", createUser);
Router.post("/login", loginUser);


module.exports = Router;

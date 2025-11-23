const { getCategories, getCategoriesByType } = require("../Controllers/Category.Controller");
const {authenticate} = require("../Auth/Auth");
const express = require("express");
const router = express.Router();

router.use(authenticate);

router.get("/", getCategories);
router.get("/type/:type", getCategoriesByType);

module.exports = router;
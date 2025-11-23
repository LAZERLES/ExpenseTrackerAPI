const { createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction } = require("../Controllers/Transaction.Controller.js");
const { authenticate } = require("../Auth/Auth.js");
const express = require("express");
const router = express.Router();
// Create Transaction
router.post("/", authenticate, createTransaction);
router.get("/", authenticate, getTransactions);
router.get("/:id", authenticate, getTransaction);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);

module.exports = router;
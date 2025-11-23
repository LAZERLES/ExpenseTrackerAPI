const { createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction, getBalance, getSummary } = require("../Controllers/Transaction.Controller.js");
const { authenticate } = require("../Auth/Auth.js");

const express = require("express");
const router = express.Router();

router.use(authenticate);

// Create Transaction
router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/balance", getBalance);
router.get("/summary", getSummary);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
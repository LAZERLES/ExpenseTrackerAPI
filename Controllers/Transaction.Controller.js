const Transaction = require("../Models/Transaction.js");
const Category = require("../Models/Category.js");
const sequelize = require("../Data/DB.js");
const { Op } = require("sequelize");

// Create Expense
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, description, category_id, transaction_date } =
      req.body;
    const user_id = req.user.id;

    // Validation (YOU write this - you know how!)
    if (!title || !amount || !type || !category_id || !transaction_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate type
    if (type && type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Validate amount
    if (amount && amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    // Validate category exists
    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      description,
      category_id,
      user_id,
      transaction_date,
    });

    return res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      include: Category,
      order: [["transaction_date", "DESC"]],
    });

    return res.status(200).json({
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user_id: userId,
      },
      include: Category,
    });

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({ transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, description, category_id, transaction_date } =
      req.body;
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user_id: userId,
      },
    });

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update transaction
    // Use !== undefined to handle 0, false, empty string
    await transaction.update({
      title: title || transaction.title,
      amount: amount !== undefined ? amount : transaction.amount,
      type: type || transaction.type,
      description:
        description !== undefined ? description : transaction.description,
      category_id: category_id || transaction.category_id,
      transaction_date: transaction_date || transaction.transaction_date,
    });

    // Save transaction
    await transaction.save();

    const updatedTransaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user_id: userId,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name", "type", "icon", "color"],
        },
      ],
    });

    return res
      .status(200)
      .json({
        message: "Transaction updated successfully",
        transaction: updatedTransaction,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user_id: userId,
      },
    });

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Delete transaction
    await transaction.destroy();
    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate balance
    // Income - Expense by if type is income value is positive else negative and sum it up on balance
    const result = await Transaction.findOne({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "CASE WHEN type = 'income' THEN amount ELSE -amount END"
            )
          ),
          "balance",
        ],
      ],
      where: { user_id: userId },
      raw: true, // for getting plain object
    });

    // If no transactions, balance is 0
    const balance = result.balance || 0;

    return res.status(200).json({
      balance: parseFloat(balance),
    });
  } catch (error) {
    console.error("Get balance error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    const where = { user_id: userId };

    if (start_date || end_date) {
      where.transaction_date = {};
      if (start_date) where.transaction_date[Op.gte] = start_date;
      if (end_date) where.transaction_date[Op.lte] = end_date;
    }

    // --- TOTALS ---
    const totals = await Transaction.findAll({
      attributes: [
        [sequelize.col("Transaction.type"), "type"],
        [sequelize.fn("SUM", sequelize.col("Transaction.amount")), "total_amount"],
      ],
      where,
      group: ["Transaction.type"], 
      raw: true,
    });

    // --- CATEGORY BREAKDOWN ---
    const byCategory = await Transaction.findAll({
      attributes: [
        [sequelize.col("Transaction.type"), "type"],
        [sequelize.col("Transaction.category_id"), "category_id"],
        [sequelize.fn("SUM", sequelize.col("Transaction.amount")), "total_amount"],
        [sequelize.fn("COUNT", sequelize.col("Transaction.id")), "count"],
      ],
      where,
      include: [
        {
          model: Category,
          attributes: ["id", "name", "icon", "color"],
        },
      ],
      group: [
        "Transaction.type",        
        "Transaction.category_id", 
        "Category.id",             
      ],
      order: [
        [sequelize.fn("SUM", sequelize.col("Transaction.amount")), "DESC"],
      ],
    });

    const incomeTotal =
      totals.find((t) => t.type === "income")?.total_amount || 0;
    const expenseTotal =
      totals.find((t) => t.type === "expense")?.total_amount || 0;

    return res.status(200).json({
      total_income: parseFloat(incomeTotal),
      total_expense: parseFloat(expenseTotal),
      balance: parseFloat(incomeTotal) - parseFloat(expenseTotal),
      by_category: byCategory,
    });
  } catch (error) {
    console.error("Get summary error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance,
  getSummary,
};

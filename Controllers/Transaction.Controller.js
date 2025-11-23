const Transaction = require("../Models/Transaction.js");
const Categorie = require("../Models/Category.js");
const sequelize = require("../Data/DB.js");

// Create Expense
const createTransaction = async (req, res) => {
  const { title, amount, type, description, category_id, transaction_date } = req.body;
  const user_id = req.user.id;

  // Validation (YOU write this - you know how!)
  if (!title || !amount || !type || !category_id || !transaction_date) {
    return res.status(400).json({ message: "Missing required fields" });
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

  return res.status(201).json({ transaction });
};

const getTransactions = async (req,res) => {
    try {
        const userId = req.user.id;
        
        const transactions = await Transaction.findAll({
            where: { user_id: userId },
            order: [['transaction_date', 'DESC']],
        })

        // Check if transactions exist
        if(transactions.length === 0){
            return res.status(404).json({ message: "No transactions found" });
        }

        return res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({
            where: {
                id: transactionId,
                user_id: userId
            }
        });

        // Check if transaction exists
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.status(200).json({ transaction });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { title, amount, type, description, category_id, transaction_date } = req.body;
        const userId = req.user.id;
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({
            where: {
                id: transactionId,
                user_id: userId
            }
        })

        // Check if transaction exists
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Update transaction
        transaction.title = title || transaction.title;
        transaction.amount = amount || transaction.amount;
        transaction.type = type || transaction.type;
        transaction.description = description || transaction.description;
        transaction.category_id = category_id || transaction.category_id;
        transaction.transaction_date = transaction_date || transaction.transaction_date;

        await transaction.save();

        return res.status(200).json({ transaction });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const transaction = await Transaction.findOne({
            where: {
                id: transactionId,
                user_id: userId
            }
        });

        // Check if transaction exists
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Delete transaction
        await transaction.destroy();
        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};

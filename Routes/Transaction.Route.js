const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getBalance,
  getSummary,
} = require("../Controllers/Transaction.Controller.js");
const { authenticate } = require("../Auth/Auth.js");

const express = require("express");
const router = express.Router();

router.use(authenticate);

// Create Transaction
/**
 * @swagger
 * /api/transactions/:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new income or expense transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - type
 *               - category_id
 *               - transaction_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery Shopping
 *                 description: Transaction title
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *                 example: 150.75
 *                 description: Transaction amount (must be positive)
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *                 description: Type of transaction
 *               description:
 *                 type: string
 *                 example: Bought groceries for the week
 *                 description: Optional detailed description
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: Category ID (must exist in database)
 *               transaction_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-23
 *                 description: Transaction date (YYYY-MM-DD format)
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request - Missing fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. No token provided.
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 */
router.post("/", createTransaction);

// Get All Transactions
/**
 * @swagger
 * /api/transactions/:
 *   get:
 *     summary: Retrieve all transactions for the authenticated user
 *     description: Get a list of all income and expense transactions associated with the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 count:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/", getTransactions);

// Get Balance and Summary
/**
 * @swagger
 * /api/transactions/balance:
 *   get:
 *     summary: Get user balance
 *     description: Calculate total balance (income minus expenses) for authenticated user
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   format: decimal
 *                   example: 4850.00
 *                   description: Current balance (total income - total expenses)
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/balance", getBalance);

// Get Summary
/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Get financial summary
 *     description: Get total income, expenses, balance, and breakdown by category for all transactions
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_income:
 *                   type: number
 *                   format: decimal
 *                   example: 23000.00
 *                   description: Sum of all income transactions
 *                 total_expense:
 *                   type: number
 *                   format: decimal
 *                   example: 1500.00
 *                   description: Sum of all expense transactions
 *                 balance:
 *                   type: number
 *                   format: decimal
 *                   example: 21500.00
 *                   description: Total income minus total expenses
 *                 by_category:
 *                   type: array
 *                   description: Breakdown of transactions grouped by category
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [income, expense]
 *                         example: expense
 *                       category_id:
 *                         type: integer
 *                         example: 1
 *                       total_amount:
 *                         type: string
 *                         example: "1500.00"
 *                         description: Total amount for this category
 *                       count:
 *                         type: integer
 *                         example: 3
 *                         description: Number of transactions in this category
 *                       Category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Food & Dining
 *                           icon:
 *                             type: string
 *                             example: 🍔
 *                           color:
 *                             type: string
 *                             example: "#FF6B6B"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/summary", getSummary);

// Get, Update, Delete Transaction by ID
// Get Transaction by ID
router.get("/:id", getTransaction);

// Update Transaction
/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Update an existing income or expense transaction by ID for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Transaction Title
 *               description: 
 *                 type: string
 *                 example: Updated detailed description
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 2000.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               transaction_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-11-23
 * 
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction updated successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Ivalid or missing token
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Transaction not found
 *       500:
 *         description: Internal Server error
 */
router.put("/:id", updateTransaction);

// Delete Transaction
/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Delete an existing income or expense transaction by ID for the authenticated user]
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or missing token 
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteTransaction);

module.exports = router;

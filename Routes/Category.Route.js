const { getCategories, getCategoriesByType } = require("../Controllers/Category.Controller");
const {authenticate} = require("../Auth/Auth");
const express = require("express");
const router = express.Router();

router.use(authenticate);

// Get all categories
/**
 * @swagger
 * /api/categories/:
 *   get:
 *     summary: Retrieve all categories for the authenticated user
 *     description: Get a list of all categories available in the system
 *     tags: [Categories]
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
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/category'
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
 *       404:
 *         description: Categories not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categories not found
 *       500:
 *         description: Server error
 */
router.get("/", getCategories);

// Get categories by type
router.get("/type/:type", getCategoriesByType);

module.exports = router;
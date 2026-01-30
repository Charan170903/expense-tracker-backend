const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction
} = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

// All routes below require authentication
router.use(authenticate);

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', createTransaction);

// @route   GET /api/transactions
// @desc    Get all transactions (with optional filters)
// @access  Private
router.get('/', getTransactions);

// @route   GET /api/transactions/:id
// @desc    Get a single transaction by ID
// @access  Private
router.get('/:id', getTransactionById);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', deleteTransaction);

module.exports = router;

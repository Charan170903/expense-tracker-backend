const Transaction = require('../models/Transaction');

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
    try {
        const { title, amount, category, type, occurredAt } = req.body;

        // Validate required fields
        if (!title || !amount || !category || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, amount, category, type'
            });
        }

        // Create transaction with user ID
        const transaction = await Transaction.create({
            user: req.user.id,
            title,
            amount,
            category,
            type,
            occurredAt: occurredAt || Date.now()
        });

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        console.error('❌ Create Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating transaction'
        });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, limit = 100 } = req.query;

        // Build filter object - scope to authenticated user
        const filter = { user: req.user.id };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (startDate || endDate) {
            filter.occurredAt = {};
            if (startDate) {
                filter.occurredAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.occurredAt.$lte = new Date(endDate);
            }
        }

        // Fetch transactions with sorting (latest first)
        const transactions = await Transaction.find(filter)
            .sort({ occurredAt: -1, createdAt: -1 })
            .limit(parseInt(limit));

        // Calculate summary stats for authenticated user
        const totalIncome = await Transaction.getTotalByTypeAndUser(req.user.id, 'income');
        const totalExpense = await Transaction.getTotalByTypeAndUser(req.user.id, 'expense');
        const balance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            count: transactions.length,
            summary: {
                totalIncome,
                totalExpense,
                balance
            },
            data: transactions
        });
    } catch (error) {
        console.error('❌ Get Transactions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching transactions'
        });
    }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
    try {
        // Find transaction for authenticated user only
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        console.error('❌ Get Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching transaction'
        });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    try {
        // Find transaction for authenticated user only
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            data: { id: req.params.id }
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        console.error('❌ Delete Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting transaction'
        });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const { title, amount, category, type, occurredAt } = req.body;

        // Find transaction for authenticated user only
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Update fields if provided
        if (title !== undefined) transaction.title = title;
        if (amount !== undefined) transaction.amount = amount;
        if (category !== undefined) transaction.category = category;
        if (type !== undefined) transaction.type = type;
        if (occurredAt !== undefined) transaction.occurredAt = occurredAt;

        await transaction.save();

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        console.error('❌ Update Transaction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating transaction'
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction
};

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true // Index for fast user-based queries
    },
    title: {
        type: String,
        required: [true, 'Transaction title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: {
            values: [
                'Food & Dining',
                'Transportation',
                'Shopping',
                'Entertainment',
                'Bills & Utilities',
                'Healthcare',
                'Education',
                'Travel',
                'Groceries',
                'Salary',
                'Freelance',
                'Investment',
                'Gift',
                'Business',
                'Other'
            ],
            message: '{VALUE} is not a valid category'
        }
    },
    type: {
        type: String,
        required: [true, 'Transaction type is required'],
        enum: {
            values: ['income', 'expense'],
            message: 'Type must be either income or expense'
        }
    },
    occurredAt: {
        type: Date,
        required: [true, 'Transaction date is required'],
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: false, // We're managing createdAt manually
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index for user-based queries and date sorting
transactionSchema.index({ user: 1, occurredAt: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
    return `₹${this.amount.toFixed(2)}`;
});

// Instance method to check if transaction is recent (within 24 hours)
transactionSchema.methods.isRecent = function () {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.occurredAt >= oneDayAgo;
};

// Static method to get transactions by type for a user
transactionSchema.statics.findByTypeAndUser = function (userId, type) {
    return this.find({ user: userId, type }).sort({ occurredAt: -1 });
};

// Static method to calculate total by type for a user
transactionSchema.statics.getTotalByTypeAndUser = async function (userId, type) {
    const result = await this.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), type } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
};


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

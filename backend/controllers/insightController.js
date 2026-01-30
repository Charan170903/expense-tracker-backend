const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get monthly summary for authenticated user
// @route   GET /api/insights/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { year, month } = req.query;

        // Default to current month if not specified
        const currentDate = new Date();
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth(); // 0-indexed

        // Calculate start and end of month
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        // Aggregation pipeline for monthly summary
        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    occurredAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Process results
        let totalIncome = 0;
        let totalExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        summary.forEach(item => {
            if (item._id === 'income') {
                totalIncome = item.total;
                incomeCount = item.count;
            } else if (item._id === 'expense') {
                totalExpense = item.total;
                expenseCount = item.count;
            }
        });

        // Calculate savings and savings rate
        const savings = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

        // Get category breakdown
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    occurredAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: {
                        type: '$type',
                        category: '$category'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                period: {
                    year: targetYear,
                    month: targetMonth + 1,
                    monthName: startOfMonth.toLocaleString('default', { month: 'long' }),
                    startDate: startOfMonth,
                    endDate: endOfMonth
                },
                summary: {
                    totalIncome,
                    totalExpense,
                    savings,
                    savingsRate: parseFloat(savingsRate),
                    incomeTransactions: incomeCount,
                    expenseTransactions: expenseCount,
                    totalTransactions: incomeCount + expenseCount
                },
                categories: categoryBreakdown.map(item => ({
                    type: item._id.type,
                    category: item._id.category,
                    total: item.total,
                    count: item.count,
                    percentage: item._id.type === 'income' && totalIncome > 0
                        ? ((item.total / totalIncome) * 100).toFixed(2)
                        : item._id.type === 'expense' && totalExpense > 0
                            ? ((item.total / totalExpense) * 100).toFixed(2)
                            : 0
                }))
            }
        });
    } catch (error) {
        console.error('❌ Monthly Summary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while generating monthly summary'
        });
    }
};

// @desc    Detect subscription/recurring transactions
// @route   GET /api/insights/subscriptions
// @access  Private
const detectSubscriptions = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { minOccurrences = 2, toleranceDays = 3 } = req.query;

        // Get all expense transactions for the user, sorted by date
        const transactions = await Transaction.find({
            user: userId,
            type: 'expense'
        }).sort({ occurredAt: 1 }).lean();

        // Group by title + amount (case-insensitive title)
        const groupedTransactions = {};

        transactions.forEach(tx => {
            const key = `${tx.title.toLowerCase().trim()}_${tx.amount}`;

            if (!groupedTransactions[key]) {
                groupedTransactions[key] = {
                    title: tx.title,
                    amount: tx.amount,
                    category: tx.category,
                    occurrences: [],
                    ids: []
                };
            }

            groupedTransactions[key].occurrences.push(new Date(tx.occurredAt));
            groupedTransactions[key].ids.push(tx._id);
        });

        // Detect subscriptions
        const subscriptions = [];

        Object.values(groupedTransactions).forEach(group => {
            const occurrenceCount = group.occurrences.length;

            // Need at least minOccurrences to be considered a subscription
            if (occurrenceCount >= parseInt(minOccurrences)) {
                // Calculate intervals between occurrences (in days)
                const intervals = [];
                for (let i = 1; i < group.occurrences.length; i++) {
                    const diff = (group.occurrences[i] - group.occurrences[i - 1]) / (1000 * 60 * 60 * 24);
                    intervals.push(Math.round(diff));
                }

                if (intervals.length > 0) {
                    // Calculate average interval
                    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

                    // Calculate standard deviation to check consistency
                    const variance = intervals.reduce((sum, interval) => {
                        return sum + Math.pow(interval - avgInterval, 2);
                    }, 0) / intervals.length;
                    const stdDev = Math.sqrt(variance);

                    // Determine if it's a subscription based on consistency
                    // If standard deviation is low, it's likely a recurring payment
                    const tolerance = parseInt(toleranceDays);
                    const isRecurring = stdDev <= tolerance;

                    if (isRecurring) {
                        // Determine frequency
                        let frequency = 'Unknown';
                        if (avgInterval >= 27 && avgInterval <= 33) {
                            frequency = 'Monthly';
                        } else if (avgInterval >= 6 && avgInterval <= 8) {
                            frequency = 'Weekly';
                        } else if (avgInterval >= 13 && avgInterval <= 15) {
                            frequency = 'Biweekly';
                        } else if (avgInterval >= 85 && avgInterval <= 95) {
                            frequency = 'Quarterly';
                        } else if (avgInterval >= 360 && avgInterval <= 370) {
                            frequency = 'Yearly';
                        } else {
                            frequency = `Every ${Math.round(avgInterval)} days`;
                        }

                        // Calculate next expected date
                        const lastOccurrence = group.occurrences[group.occurrences.length - 1];
                        const nextExpectedDate = new Date(lastOccurrence);
                        nextExpectedDate.setDate(nextExpectedDate.getDate() + Math.round(avgInterval));

                        subscriptions.push({
                            title: group.title,
                            amount: group.amount,
                            category: group.category,
                            frequency,
                            averageInterval: Math.round(avgInterval),
                            occurrenceCount,
                            firstOccurrence: group.occurrences[0],
                            lastOccurrence,
                            nextExpectedDate,
                            consistency: stdDev <= 1 ? 'High' : stdDev <= 3 ? 'Medium' : 'Low',
                            transactionIds: group.ids,
                            estimatedMonthlyImpact: frequency === 'Monthly'
                                ? group.amount
                                : frequency === 'Weekly'
                                    ? group.amount * 4.33
                                    : frequency === 'Yearly'
                                        ? group.amount / 12
                                        : (group.amount * 30) / avgInterval
                        });
                    }
                }
            }
        });

        // Sort by estimated monthly impact (highest first)
        subscriptions.sort((a, b) => b.estimatedMonthlyImpact - a.estimatedMonthlyImpact);

        // Calculate total monthly subscription cost
        const totalMonthlySubscriptions = subscriptions.reduce(
            (sum, sub) => sum + sub.estimatedMonthlyImpact,
            0
        );

        res.status(200).json({
            success: true,
            data: {
                subscriptions,
                count: subscriptions.length,
                totalMonthlyImpact: totalMonthlySubscriptions,
                detectionCriteria: {
                    minOccurrences: parseInt(minOccurrences),
                    toleranceDays: parseInt(toleranceDays)
                }
            }
        });
    } catch (error) {
        console.error('❌ Subscription Detection Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while detecting subscriptions'
        });
    }
};

// @desc    Get year overview
// @route   GET /api/insights/year-overview
// @access  Private
const getYearOverview = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { year } = req.query;

        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        const startOfYear = new Date(targetYear, 0, 1);
        const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

        // Monthly breakdown aggregation
        const monthlyBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    occurredAt: {
                        $gte: startOfYear,
                        $lte: endOfYear
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$occurredAt' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.month': 1 }
            }
        ]);

        // Process into month-by-month data
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: new Date(targetYear, i, 1).toLocaleString('default', { month: 'long' }),
            income: 0,
            expense: 0,
            savings: 0,
            savingsRate: 0,
            transactionCount: 0
        }));

        monthlyBreakdown.forEach(item => {
            const monthIndex = item._id.month - 1;
            if (item._id.type === 'income') {
                months[monthIndex].income = item.total;
                months[monthIndex].transactionCount += item.count;
            } else {
                months[monthIndex].expense = item.total;
                months[monthIndex].transactionCount += item.count;
            }
        });

        // Calculate savings and savings rate for each month
        months.forEach(month => {
            month.savings = month.income - month.expense;
            month.savingsRate = month.income > 0
                ? parseFloat(((month.savings / month.income) * 100).toFixed(2))
                : 0;
        });

        // Calculate yearly totals
        const yearlyIncome = months.reduce((sum, m) => sum + m.income, 0);
        const yearlyExpense = months.reduce((sum, m) => sum + m.expense, 0);
        const yearlySavings = yearlyIncome - yearlyExpense;
        const yearlySavingsRate = yearlyIncome > 0
            ? parseFloat(((yearlySavings / yearlyIncome) * 100).toFixed(2))
            : 0;

        res.status(200).json({
            success: true,
            data: {
                year: targetYear,
                summary: {
                    totalIncome: yearlyIncome,
                    totalExpense: yearlyExpense,
                    totalSavings: yearlySavings,
                    savingsRate: yearlySavingsRate,
                    averageMonthlyIncome: yearlyIncome / 12,
                    averageMonthlyExpense: yearlyExpense / 12
                },
                monthlyBreakdown: months
            }
        });
    } catch (error) {
        console.error('❌ Year Overview Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while generating year overview'
        });
    }
};

module.exports = {
    getMonthlySummary,
    detectSubscriptions,
    getYearOverview
};

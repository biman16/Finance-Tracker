import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

//Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //Fetch total income & expenses
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId }},
            { $group: { _id: null, total: { $sum: "$amount"}}},
        ]);

        console.log("totalIncome", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId}},
            { $group: { _id: null, total: { $sum: "$amount"}}},
        ]);


        //Get income transaction in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)},
        }).sort({ date: -1 });

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //Get expense transaction in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)},
        }).sort({ date: -1});

        //Get total expense for last 30 Days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum+ transaction.amount,
            0
        );

        //Fetch last 5 transactions (income+expenses)
        const incomeTransactions = await Income.find({ userId }).sort({ date: -1 }).limit(5);
        const expenseTransactions = await Expense.find({ userId }).sort({ date: -1 }).limit(5);

        const lastTransactions = [
            ...incomeTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "Income",
            })),
            ...expenseTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "Expense",
            })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime()); //Sort latest first by converting dates to timestamps

        //Final Response
        res.json({
            totalBalance:
             (totalIncome[0]?.total || 0) - (totalExpense[0]?.total  || 0),

            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,

            last30DaysExpense: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error); // Log the full error
        res.status(500).json({ message: "Server Error", error: error.message }); // Send error message to client
    }
}
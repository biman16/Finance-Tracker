import xlsx from "xlsx";
import Expense from "../models/Expense.js";



//Add Expense Source
export const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        //Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required."})
        }

        const newExpense = new Expense ({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (error) {
        res.status(500).json({ message: "Server Error while Add Expense" });
    }
}


//Get All Income Source
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1});
        res.json(expense);
    } catch (error) {
        console.error("Error in getAllExpense:", error); // Log the actual error
        res.status(500).json({ message: "Server Error while Get All Income", error: error.message });
    }
};

    
//Delete Expense Source
export const deleteExpense = async (req, res) => {
    
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error while Delete Income"})
    }
};

//Download in Excel
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        //Prepare data for Excel
        const data = expense.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx')
    } catch (error) {
        res.status(500).json({ message: "Server Error while Downloading"});
    }
};
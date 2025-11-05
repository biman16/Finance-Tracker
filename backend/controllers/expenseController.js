import PDFDocument from 'pdfkit';
import Expense from "../models/Expense.js";
import User from "../models/User.js";



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

//Download in PDF
export const downloadExpensePDF = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        const user = await User.findById(userId);

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=expense_details.pdf');
        
        // Pipe the PDF to the response
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text('Expense Report', { align: 'center' });
        doc.moveDown();

        // Add current date
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Add table headers
        doc.fontSize(14).text('Expense Details:', { underline: true });
        doc.moveDown();

        // Table headers
        const headers = ['Category', 'Amount', 'Date'];
        let y = doc.y;
        doc.fontSize(12)
           .text(headers[0], 50, y)
           .text(headers[1], 250, y)
           .text(headers[2], 400, y);

        doc.moveDown();

        // Add expenses data
        doc.moveDown();
        doc.fontSize(12).text(`Currency: ${user.currency.code}`, { align: 'left' });
        doc.moveDown();

        expenses.forEach((expense) => {
            const amount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: user.currency.code
            }).format(expense.amount);
            y = doc.y;
            doc.fontSize(10)
               .text(expense.category || '', 50, y)
               .text(`$${expense.amount.toFixed(2)}`, 250, y)
               .text(new Date(expense.date).toLocaleDateString(), 400, y);
            doc.moveDown();
        });

        // Add total
        doc.moveDown();
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        doc.fontSize(12)
           .text(`Total Expenses: $${total.toFixed(2)}`, { align: 'right' });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: "Server Error while generating PDF" });
    }
};
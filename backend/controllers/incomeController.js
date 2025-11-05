import PDFDocument from 'pdfkit';
import Income from "../models/Income.js";



//Add Income Source
export const addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        //Validation: Check for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required."})
        }

        const newIncome = new Income ({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);

    } catch (error) {
        res.status(500).json({ message: "Server Error while Add Income" });
    }
}


//Get All Income Source
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1});
        res.json(income);
    } catch (error) {
        console.error("Error in getAllIncome:", error); // Log the actual error
        res.status(500).json({ message: "Server Error while Get All Income", error: error.message });
    }
};

    
//Delete Income Source
export const deleteIncome = async (req, res) => {
    
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error while Delete Income"})
    }
};

//Download in PDF
export const downloadIncomePDF = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=income_details.pdf');
        
        // Pipe the PDF to the response
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text('Income Report', { align: 'center' });
        doc.moveDown();

        // Add current date
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Add table headers
        doc.fontSize(14).text('Income Details:', { underline: true });
        doc.moveDown();

        // Table headers
        const headers = ['Source', 'Amount', 'Date'];
        let y = doc.y;
        doc.fontSize(12)
           .text(headers[0], 50, y)
           .text(headers[1], 250, y)
           .text(headers[2], 400, y);

        doc.moveDown();

        // Add incomes data
        incomes.forEach((income) => {
            y = doc.y;
            doc.fontSize(10)
               .text(income.source || '', 50, y)
               .text(`$${income.amount.toFixed(2)}`, 250, y)
               .text(new Date(income.date).toLocaleDateString(), 400, y);
            doc.moveDown();
        });

        // Add total
        doc.moveDown();
        const total = incomes.reduce((sum, income) => sum + income.amount, 0);
        doc.fontSize(12)
           .text(`Total Income: $${total.toFixed(2)}`, { align: 'right' });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: "Server Error while generating PDF" });
    }
};
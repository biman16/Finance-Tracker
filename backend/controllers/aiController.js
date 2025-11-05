import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateAiResponse = async (req, res) => {
  try {
    const { message, dashboardData } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const incomes = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    const userName = user.fullName;
    const userEmail = user.email;
    const userIncomes = incomes.map(inc => ({ amount: inc.amount, description: inc.description, date: inc.date }));
    const userExpenses = expenses.map(exp => ({ amount: exp.amount, description: exp.description, date: exp.date, category: exp.category }));

    const prompt = `
      You are a financial advisor AI. Your goal is to provide financial advice, insights, and answer questions based on the user's financial data.
      The user's name is ${userName}
      Here is their financial data:
      Incomes: ${JSON.stringify(userIncomes)}
      Expenses: ${JSON.stringify(userExpenses)}
      Dashboard Data: ${JSON.stringify(dashboardData)}

      Based on this information, respond to the following message from the user: "${message}"

      If the user's message is a greeting (e.g., "hi", "hello") or a generic query, your response MUST start with "Hello, ${userName}! Here is a snapshot of your current financial situation:". Then, present the financial details in a clear, well-formatted bulleted list. After the financial details, include a section for "Financial Insights & Suggestions" with the following clickable options, each on a new line and prefixed with a simple bullet:
      - Smart budgeting
      - Saving habits
      - Expense control
      - Income diversification
      - Financial planning
      End with a polite closing line wishing the user financial success.

      If the user's message matches one of the suggestions (e.g., "Saving habits"), provide a detailed and topic-specific response related to that suggestion, using the user's financial data to offer personalized advice. Do not repeat the initial greeting or the full financial summary.

      Ensure the entire response is in plain text, avoiding any markdown characters like asterisks (*), hashes (#), or backticks (\`).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error generating AI response:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Error generating AI response", error: error.message, details: error.response ? error.response.data : null });
  }
};
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import incomeRoutes from "./routes/incomeRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"


const app = express();

//middileware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ai", aiRoutes);


//Serve uploads folder
app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.get("/api/v1/ai/models", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { models } = await genAI.listModels();
        res.status(200).json(models.map(model => ({ name: model.name, supportedGenerationMethods: model.supportedGenerationMethods })));
    } catch (error) {
        console.error("Error listing Gemini models:", error);
        res.status(500).json({ message: "Error listing Gemini models", error: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";

import {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpensePDF
} from "../controllers/expenseController.js";

import { protect } from "../middileware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadpdf", protect, downloadExpensePDF);
router.delete("/:id", protect, deleteExpense);


export default router;

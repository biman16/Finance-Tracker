import express from "express";

import {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomePDF
} from "../controllers/incomeController.js";

import { protect } from "../middileware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadpdf", protect, downloadIncomePDF);
router.delete("/:id", protect, deleteIncome);


export default router;

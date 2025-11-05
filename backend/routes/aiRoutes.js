import express from 'express';
import { generateAiResponse } from '../controllers/aiController.js';
import { protect } from '../middileware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, generateAiResponse);

export default router;
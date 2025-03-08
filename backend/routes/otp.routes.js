import express from 'express';
import { generateAndSendOTP, verifyOTP } from '../controllers/otp.controller.js';

const router = express.Router();

// Route to generate and send OTP
router.post('/generate', generateAndSendOTP);

// Route to verify OTP (useful for testing)
router.post('/verify', verifyOTP);

export default router;

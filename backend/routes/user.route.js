import express from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// Additional user routes can be added here
// router.post('/login', loginUser);
// router.get('/profile', authenticateToken, getUserProfile);
// etc.

export default router;

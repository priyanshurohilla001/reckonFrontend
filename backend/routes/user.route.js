import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller.js';
import authUser from '../middleware/auth.middleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// User profile route
router.get('/profile', authUser, getUserProfile);

// Additional user routes can be added here
// etc.

export default router;

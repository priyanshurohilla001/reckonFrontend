import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import otpRoutes from './routes/otp.routes.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase();

// Register routes
app.use('/api/otp', otpRoutes);
app.use('/api/users', userRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Reckon API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
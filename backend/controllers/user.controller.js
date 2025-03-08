import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import { registerUserSchema } from '../validations/user.validation.js';

export const registerUser = async (req, res) => {
  try {
    // Validate request body using Zod schema
    const result = registerUserSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.format()
      });
    }

    const validatedData = result.data;
    const { name, age, gender, course, email, phoneNumber, password, college, tags, otp } = validatedData;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp, isVerified: false });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone number already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      age,
      gender,
      course,
      email,
      phoneNumber,
      password: hashedPassword,
      college,
      tags
    });

    await newUser.save();
    
    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser,
    });
    
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



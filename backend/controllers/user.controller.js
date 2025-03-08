import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import { registerUserSchema, loginUserSchema } from '../validations/user.validation.js';

export const registerUser = async (req, res) => {
  try {
    // Validate request body using Zod schema
    const result = registerUserSchema.safeParse(req.body);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      // Find the first error message for better user feedback
      let firstErrorMessage = "Validation error";
      for (const key in formattedErrors) {
        if (key !== '_errors' && formattedErrors[key]?._errors?.length > 0) {
          firstErrorMessage = formattedErrors[key]._errors[0];
          break;
        }
      }
      
      return res.status(400).json({
        success: false,
        message: firstErrorMessage,
        errors: formattedErrors
      });
    }

    const validatedData = result.data;
    const { name, age, gender, course, email, phoneNumber, password, college, tags, otp } = validatedData;


    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });
    
    if (existingUser) {
      // Provide more specific error message
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered. Please log in instead.',
          field: 'email'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'This phone number is already registered with another account.',
          field: 'phoneNumber'
        });
      }
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
      tags: tags || []
    });

    await newUser.save();
    
    // Delete used OTP
    await OTP.deleteMany({ email });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Filter sensitive information from response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
      gender: newUser.gender,
      course: newUser.course,
      college: newUser.college
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Campus Cash.',
      token,
      user: userResponse,
    });
    
  } catch (error) {
    console.error('Error in registerUser:', error);
    
    // Provide more helpful error messages based on error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please check your information and try again.',
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Validate request body using Zod schema
    const result = loginUserSchema.safeParse(req.body);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      let firstErrorMessage = "Validation error";
      for (const key in formattedErrors) {
        if (key !== '_errors' && formattedErrors[key]?._errors?.length > 0) {
          firstErrorMessage = formattedErrors[key]._errors[0];
          break;
        }
      }
      
      return res.status(400).json({
        success: false,
        message: firstErrorMessage,
        errors: formattedErrors
      });
    }

    const { email, password } = result.data;

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        field: 'email'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        field: 'password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Filter sensitive information from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      course: user.course,
      college: user.college
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: userResponse,
    });
    
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // The user is already attached to req.user from the auth middleware
    // Remove sensitive information before sending the response
    const user = req.user.toObject();
    delete user.password;
    
    return res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      user
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};



import { z } from 'zod';
import OTP from '../models/otp.model.js';
import User from '../models/user.model.js';
import mailgun from 'mailgun-js';
import dotenv from 'dotenv';

dotenv.config();

// Validation schema for email
const emailSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address" })
});

// Function to generate a random 6-digit OTP
const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateAndSendOTP = async (req, res) => {
  try {
    // Validate email
    const result = emailSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.format()
      });
    }

    const { email } = result.data;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    // Generate OTP
    const otp = generateRandomOTP();

    // Save OTP to database (delete any existing OTPs first)
    await OTP.deleteMany({ email });
    
    const newOTP = new OTP({
      email,
      otp
    });
    
    await newOTP.save();

    try {
      // Configure mailgun properly
      const mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      });

      // Prepare email content with improved design
      const emailData = {
        from: `Reckon <noreply@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: '🔐 Your Verification Code for Reckon | Be Money Smart!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">RECKON</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Be Smart With Your Money</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 20px;">Hey Future Financial Wizard! 🧙‍♂️</h2>
                  <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">You're just one step away from unlocking your financial potential with Reckon - the platform built specifically for college students like you!</p>
                  
                  <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">Use this magical verification code to complete your registration:</p>
                  
                  <div style="background-color: #F3F4F6; border-left: 4px solid #6366F1; border-radius: 4px; padding: 20px; text-align: center; margin: 20px 0;">
                    <span style="color: #1F2937; font-size: 32px; font-weight: 700; letter-spacing: 8px;">${otp}</span>
                  </div>
                  
                  <p style="color: #6B7280; font-size: 14px; margin: 25px 0 0;">This code will expire in 10 minutes.</p>
                  
                  <div style="margin: 35px 0; padding: 20px; background-color: #F9FAFB; border-radius: 6px;">
                    <h3 style="color: #1F2937; margin: 0 0 15px; font-size: 16px; font-weight: 600;">What's waiting for you:</h3>
                    <ul style="color: #4B5563; font-size: 15px; padding-left: 20px; margin: 0;">
                      <li style="margin-bottom: 8px;">Voice-powered expense tracking - just tell us what you spent!</li>
                      <li style="margin-bottom: 8px;">AI-powered financial analysis tailored to your spending habits</li>
                      <li>Fun financial simulations that prepare you for real-world money decisions</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #F3F4F6; padding: 20px; text-align: center; font-size: 13px; color: #6B7280;">
                  <p style="margin: 0 0 10px;">This is a hackathon project by Team Reckon.</p>
                  <p style="margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 15px auto 0;">
              <tr>
                <td style="padding: 0 20px; text-align: center; font-size: 12px; color: #9CA3AF;">
                  <p>&copy; ${new Date().getFullYear()} Reckon. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      };

      // Send email
      await mg.messages().send(emailData);

      console.log(`OTP email sent to ${email}`);
    } catch (emailError) {
      // Log error but don't fail the request - OTP is still generated and saved
      console.error('Error sending email:', emailError);
      
      // Return OTP for development purposes (remove in production)
      return res.status(200).json({
        success: true,
        message: 'OTP generated but email could not be sent. For development: ',
        otp: otp // REMOVE THIS IN PRODUCTION
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
    
  } catch (error) {
    console.error('Error in generateAndSendOTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate OTP, please try again later'
    });
  }
};

// Function to verify OTP (useful for testing)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const otpRecord = await OTP.findOne({ email, otp, isVerified: false });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
    
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

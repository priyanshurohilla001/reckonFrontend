import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 
  }
});

const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// More specific validations with better error messages
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits")
});

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(16, "Age must be at least 16").max(100, "Age must be less than 100"),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  course: z.string().min(2, "Course name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  college: z.string().min(2, "College name is required"),
  tags: z.array(z.string()).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Example colleges with name field used for display
  const colleges = [
    { _id: "dtu", name: "Delhi Technological University" },
    { _id: "nsut", name: "Netaji Subhas University of Technology" },
    { _id: "iiitd", name: "Indraprastha Institute of Information Technology Delhi" },
    { _id: "iitd", name: "Indian Institute of Technology Delhi" },
    { _id: "other", name: "Other" }
  ];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    course: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    college: "",
    tags: []
  });

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Password strength calculator
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field-specific error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value, 10) : "") : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    // Clear field-specific error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Email validation and OTP generation
  const sendOTP = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setErrors({});
      
      // Validate email
      const result = emailSchema.safeParse({ email });
      if (!result.success) {
        setErrors({ email: result.error.errors[0].message });
        return;
      }

      setIsLoading(true);
      
      // Check if email exists before sending OTP
      try {
        const checkResponse = await axios.post(`${serverUrl}/api/users/check-email`, { email });
        if (checkResponse.data.exists) {
          setErrors({ email: "This email is already registered. Please log in instead." });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        // If the endpoint doesn't exist or other error, continue with OTP
        console.log("Email check skipped:", error);
      }
      
      const response = await axios.post(`${serverUrl}/api/otp/generate`, { email });
      
      if (response.data.success) {
        setOtpSent(true);
        setCountdown(60);
        toast.success("Verification code sent! Check your inbox", {
          description: "If you don't see it, check your spam folder"
        });
        
        // For development, if the backend returns OTP
        if (response.data.otp) {
          toast.info(`Development only: OTP is ${response.data.otp}`);
        }
      }
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.field) {
          setErrors({ [error.response.data.field]: error.response.data.message });
        }
      } else {
        toast.error("Could not send verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification
  const verifyOTP = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setErrors({});
      
      // Validate OTP
      const result = otpSchema.safeParse({ otp });
      if (!result.success) {
        setErrors({ otp: result.error.errors[0].message });
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/api/otp/verify`, { email, otp });
      
      if (response.data.success) {
        setOtpVerified(true);
        setFormData(prev => ({ ...prev, email }));
        setStep(2);
        toast.success("Email verified successfully");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        const errorMsg = error.response.data.message;
        toast.error(errorMsg);
        setErrors({ otp: errorMsg });
      } else {
        toast.error("Invalid verification code. Please try again.");
        setErrors({ otp: "Invalid verification code" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clear previous errors
      setErrors({});
      
      // Validate complete form
      const result = registrationSchema.safeParse(formData);
      if (!result.success) {
        const formattedErrors = {};
        result.error.errors.forEach(err => {
          formattedErrors[err.path[0]] = err.message;
        });
        
        setErrors(formattedErrors);
        const firstError = result.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/api/users/register`, { 
        ...formData, 
        otp 
      });
      
      if (response.data.success) {
        // Store JWT token
        localStorage.setItem("token", response.data.token);
        
        toast.success(response.data.message || "Registration successful!");
        
        // Short delay for better UX
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        
        // Transform backend errors to match our format
        for (const key in backendErrors) {
          if (key !== '_errors' && backendErrors[key]?._errors?.length > 0) {
            formattedErrors[key] = backendErrors[key]._errors[0];
          }
        }
        
        setErrors(formattedErrors);
        toast.error(error.response.data.message || "Please fix the errors and try again");
      } else if (error.response?.data?.field) {
        // Handle field-specific error
        setErrors({ [error.response.data.field]: error.response.data.message });
        toast.error(error.response.data.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification step UI with improved error handling
  const renderEmailVerification = () => (
    <>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: undefined});
              }}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to this email
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => {
                // Only allow numbers and maximum 6 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                if (errors.otp) setErrors({...errors, otp: undefined});
              }}
              className={`text-center tracking-wider ${errors.otp ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              maxLength={6}
              required
            />
            {errors.otp && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.otp}
              </p>
            )}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Check your inbox at {email}
              </p>
              {countdown > 0 ? (
                <span className="text-sm text-muted-foreground">
                  Resend in {countdown}s
                </span>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={sendOTP}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={!otpSent ? sendOTP : verifyOTP}
          disabled={isLoading || (otpSent && otp.length !== 6)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {!otpSent ? "Sending..." : "Verifying..."}
            </>
          ) : !otpSent ? "Get Verification Code" : "Verify & Continue"}
        </Button>
      </CardFooter>
    </>
  );

  // Registration form UI with field-level validation
  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            required
          />
          {errors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Your age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.age && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.age}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              onValueChange={(value) => handleSelectChange("gender", value)}
              defaultValue={formData.gender}
            >
              <SelectTrigger className={errors.gender ? "border-red-500 focus-visible:ring-red-500" : ""}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.gender}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="course">Course/Program</Label>
          <Input
            id="course"
            name="course"
            placeholder="E.g., B.Tech Computer Science"
            value={formData.course}
            onChange={handleChange}
            className={errors.course ? "border-red-500 focus-visible:ring-red-500" : ""}
            required
          />
          {errors.course && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.course}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="flex">
            <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md border-input bg-muted">
              +91
            </div>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="10-digit mobile number"
              maxLength={10}
              value={formData.phoneNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData(prev => ({...prev, phoneNumber: value}));
                if (errors.phoneNumber) setErrors({...errors, phoneNumber: undefined});
              }}
              className={`rounded-l-none ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              required
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.phoneNumber}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="college">College/University</Label>
          <Input
            id="college"
            name="college"
            placeholder="Enter your college name"
            value={formData.college}
            onChange={handleChange}
            className={errors.college ? "border-red-500 focus-visible:ring-red-500" : ""}
            required
          />
          {errors.college && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.college}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
            required
          />
          
          {/* Password strength indicator */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 100 ? 'bg-yellow-500' : 'bg-green-500'
              }`} 
              style={{ width: `${passwordStrength}%` }}
            ></div>
          </div>
          
          {formData.password && (
            <div className="space-y-1 mt-1">
              <p className="text-xs text-muted-foreground">Password requirements:</p>
              <ul className="text-xs space-y-1">
                <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}>
                  {formData.password.length >= 8 ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}>
                  {/[A-Z]/.test(formData.password) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  At least one uppercase letter
                </li>
                <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}>
                  {/[0-9]/.test(formData.password) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  At least one number
                </li>
                <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}>
                  {/[^A-Za-z0-9]/.test(formData.password) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  At least one special character
                </li>
              </ul>
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.password}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
            required
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : "Create Account"}
        </Button>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </CardFooter>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-violet-50 to-indigo-100">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => step === 1 ? navigate("/") : setStep(1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold">
              {step === 1 ? "Verify Email" : "Create Account"}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 1 
              ? "First, let's verify your email address" 
              : "Complete your profile to get started with Campus Cash"}
          </CardDescription>
        </CardHeader>
        
        {step === 1 ? renderEmailVerification() : renderRegistrationForm()}
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const serverUrl = import.meta.env.VITE_SERVER_URL;

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
  password: z.string().min(8, "Password must be at least 8 characters"),
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
  const [college, setCollege] = useState("");

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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value, 10) : "") : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      // Validate email
      const result = emailSchema.safeParse({ email });
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/api/otp/generate`, { email });
      
      if (response.data.success) {
        setOtpSent(true);
        setCountdown(60);
        toast.success("OTP sent to your email");
        // For development, if the backend returns OTP
        if (response.data.otp) {
          toast.info(`Development only: OTP is ${response.data.otp}`);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to send OTP");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      // Validate OTP
      const result = otpSchema.safeParse({ otp });
      if (!result.success) {
        toast.error(result.error.errors[0].message);
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
      if (error.response) {
        toast.error(error.response.data.message || "Invalid OTP");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const result = registrationSchema.safeParse(formData);
      if (!result.success) {
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
        
        toast.success("Registration successful!");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailVerification = () => (
    <>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to this email
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {email}
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
                  Resend
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
          disabled={isLoading}
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

  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="21"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              onValueChange={(value) => handleSelectChange("gender", value)}
              defaultValue={formData.gender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            name="course"
            placeholder="B.Tech Computer Science"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="10-digit mobile number"
            maxLength={10}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="college">college</Label>
          <Input
            id="college"
            name="college"
            placeholder="B.Tech Computer Science"
            value={formData.college}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : "Create Account"}
        </Button>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-violet-50 to-indigo-100">
      <Card className="w-full max-w-md border-none shadow-lg">
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
